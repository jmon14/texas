import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ReferenceRangesService } from './reference-ranges.service';
import { ScenariosService } from './scenarios.service';
import { StandardRangesService } from './standard-ranges.service';
import { TexasSolverService } from '../ranges/texas-solver.service';
import { ReferenceRangeDocument } from './schemas/reference-range.schema';
import { Position } from './enums/position.enum';
import { ScenarioActionType } from './enums/scenario-action-type.enum';
import { PlayerPosition } from '../ranges/enums/player-position.enum';
import { Street } from './enums/street.enum';
import { STANDARD_OPEN_SIZE, BLINDS, MAX_STACK_TO_POT_RATIO } from './constants';
import { SOLVER_DEFAULTS, REFERENCE_RANGE_SOLVER } from '../ranges/constants';

@Injectable()
export class ReferenceRangesImportService {
  private readonly logger = new Logger(ReferenceRangesImportService.name);

  constructor(
    private readonly scenariosService: ScenariosService,
    private readonly standardRangesService: StandardRangesService,
    private readonly texasSolverService: TexasSolverService,
    private readonly referenceRangesService: ReferenceRangesService,
  ) {}

  /**
   * Import reference range for a single scenario
   * Currently only supports post-flop scenarios (flop, turn, river)
   */
  async importForScenario(scenarioId: string): Promise<ReferenceRangeDocument> {
    this.logger.log(`Importing reference range for scenario: ${scenarioId}`);

    // 1. Load scenario
    const scenario = await this.scenariosService.findById(scenarioId);
    if (!scenario) {
      throw new NotFoundException(`Scenario with ID ${scenarioId} not found`);
    }

    // 2. Determine IP/OOP ranges and player position based on scenario type
    const { rangeIp, rangeOop, playerPosition } = this.determineSolverInputs(scenario);

    // 3. Calculate pot size based on street and action history
    const pot = this.calculatePot(scenario);

    // 4. Adjust effective stack to be reasonable relative to pot
    // Solver may have issues with very high stack-to-pot ratios
    // Cap effective stack at a reasonable multiple of pot
    const effectiveStack = Math.min(scenario.effectiveStack, pot * MAX_STACK_TO_POT_RATIO);

    // 5. Solve scenario using TexasSolver
    // For post-flop scenarios, pass boardCards to the solver
    const solvedRange = await this.texasSolverService.solveScenario({
      name: scenario.name,
      effectiveStack,
      pot,
      rangeIp,
      rangeOop,
      playerPosition,
      boardCards: scenario.boardCards, // Pass boardCards for post-flop scenarios
    });

    // 5. Save as ReferenceRange
    const referenceRange = await this.referenceRangesService.createOrUpdate(
      scenarioId,
      solvedRange,
      {
        solver: REFERENCE_RANGE_SOLVER.NAME,
        solverVersion: REFERENCE_RANGE_SOLVER.VERSION,
        solveParameters: {
          iterations: SOLVER_DEFAULTS.MAX_ITERATIONS,
          accuracy: String(SOLVER_DEFAULTS.ACCURACY),
        },
      },
    );

    this.logger.log(`Successfully imported reference range for scenario: ${scenario.name}`);
    return referenceRange;
  }

  /**
   * Import reference ranges for all scenarios
   */
  async importAllScenarios(): Promise<ReferenceRangeDocument[]> {
    this.logger.log('Starting batch import of all scenarios');

    const scenarios = await this.scenariosService.findAll();
    const results: ReferenceRangeDocument[] = [];
    const errors: Array<{ scenarioId: string; error: string }> = [];

    for (const scenario of scenarios) {
      try {
        const referenceRange = await this.importForScenario(scenario._id);
        results.push(referenceRange);
        this.logger.log(`✓ Imported: ${scenario.name}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push({ scenarioId: scenario._id, error: errorMessage });
        this.logger.error(`✗ Failed to import ${scenario.name}: ${errorMessage}`);
        // Continue with other scenarios
      }
    }

    this.logger.log(`Batch import completed: ${results.length} succeeded, ${errors.length} failed`);

    if (errors.length > 0) {
      this.logger.warn('Failed scenarios:');
      errors.forEach(({ scenarioId, error }) => {
        this.logger.warn(`  - ${scenarioId}: ${error}`);
      });
    }

    return results;
  }

  /**
   * Calculate pot size based on scenario street and action history
   *
   * Preflop pot calculation:
   * - Blinds: 1.5bb (SB 0.5 + BB 1.0)
   * - Opening bet: 2.5bb (standard)
   * - Call: 2.5bb (matches opening bet)
   * - Total: 6.5bb
   *
   * Postflop pot calculation:
   * - Flop: preflop pot + flop bet
   * - Turn: preflop pot + flop bet + turn bet
   * - River: preflop pot + flop bet + turn bet + river bet
   *
   * Assumes standard 2.5bb opening bet and same bet size for all postflop streets.
   * Returns integer pot size (solver may not accept fractional values)
   */
  private calculatePot(scenario: {
    street: Street;
    betSize: number;
    actionType: ScenarioActionType;
  }): number {
    // Calculate preflop pot based on actionType
    // For CBET and VS_CBET_CALL scenarios, someone opened and someone called
    const preflopPot = BLINDS + STANDARD_OPEN_SIZE + STANDARD_OPEN_SIZE; // blinds + open + call

    if (scenario.street === Street.PREFLOP) {
      return Math.round(preflopPot);
    }

    // For postflop scenarios, chain bets through streets
    // betSize represents the bet on the current street
    // We assume previous streets also had bets of the same size
    let pot = preflopPot;

    if (scenario.street === Street.FLOP) {
      // Flop: preflop pot + flop bet
      pot += scenario.betSize;
    } else if (scenario.street === Street.TURN) {
      // Turn: preflop pot + flop bet + turn bet
      pot += scenario.betSize; // flop bet (assume same size)
      pot += scenario.betSize; // turn bet
    } else if (scenario.street === Street.RIVER) {
      // River: preflop pot + flop bet + turn bet + river bet
      pot += scenario.betSize; // flop bet (assume same size)
      pot += scenario.betSize; // turn bet (assume same size)
      pot += scenario.betSize; // river bet
    }

    return Math.round(pot);
  }

  /**
   * Determine if a position is IP relative to another position
   * Preflop: Position order (later = more IP): UTG < MP < CO < BTN < SB < BB
   * Postflop: Position order reverses (BB acts first, UTG acts last): BB < SB < BTN < CO < MP < UTG
   */
  private isPositionIp(heroPosition: Position, villainPosition: Position, street: Street): boolean {
    const isPostflop = street !== Street.PREFLOP;

    if (isPostflop) {
      // Postflop: BB acts first (OOP), UTG acts last (IP)
      const positionOrder: Record<Position, number> = {
        [Position.BB]: 0,
        [Position.SB]: 1,
        [Position.BTN]: 2,
        [Position.CO]: 3,
        [Position.MP]: 4,
        [Position.UTG]: 5,
      };
      return positionOrder[heroPosition] > positionOrder[villainPosition];
    } else {
      // Preflop: UTG acts first (OOP), BB acts last (IP)
      const positionOrder: Record<Position, number> = {
        [Position.UTG]: 0,
        [Position.MP]: 1,
        [Position.CO]: 2,
        [Position.BTN]: 3,
        [Position.SB]: 4,
        [Position.BB]: 5,
      };
      return positionOrder[heroPosition] > positionOrder[villainPosition];
    }
  }

  /**
   * Determine solver inputs (IP/OOP ranges and player position) based on scenario
   * Currently only supports post-flop scenarios (flop, turn, river)
   * Ranges account for preflop actions (e.g., opening range for cbet scenarios)
   */
  private determineSolverInputs(scenario: {
    position: Position;
    vsPosition: Position;
    actionType: ScenarioActionType;
    street: Street;
  }): {
    rangeIp: string;
    rangeOop: string;
    playerPosition: PlayerPosition;
  } {
    switch (scenario.actionType) {
      case ScenarioActionType.CBET: {
        // Cbet scenario: Hero opened preflop, now cbetting postflop
        const heroIsIp = this.isPositionIp(scenario.position, scenario.vsPosition, scenario.street);
        const heroRange = this.standardRangesService.getOpeningRange(scenario.position);
        const villainRange = this.standardRangesService.getDefendingRange(
          scenario.vsPosition,
          scenario.position,
        );

        return {
          rangeIp: heroIsIp ? heroRange : villainRange,
          rangeOop: heroIsIp ? villainRange : heroRange,
          playerPosition: heroIsIp ? PlayerPosition.IP : PlayerPosition.OOP,
        };
      }

      case ScenarioActionType.VS_CBET_CALL: {
        // Calling cbet scenario: Hero called preflop, now calling cbet postflop
        const heroIsIp = this.isPositionIp(scenario.position, scenario.vsPosition, scenario.street);
        const heroRange = this.standardRangesService.getDefendingRange(
          scenario.position,
          scenario.vsPosition,
        );
        const villainRange = this.standardRangesService.getOpeningRange(scenario.vsPosition);

        return {
          rangeIp: heroIsIp ? heroRange : villainRange,
          rangeOop: heroIsIp ? villainRange : heroRange,
          playerPosition: heroIsIp ? PlayerPosition.IP : PlayerPosition.OOP,
        };
      }

      case ScenarioActionType.VS_CBET_RAISE: {
        // Raising cbet scenario: Hero called preflop, now raising cbet postflop
        const heroIsIp = this.isPositionIp(scenario.position, scenario.vsPosition, scenario.street);
        const heroRange = this.standardRangesService.getThreeBettingRange(
          scenario.position,
          scenario.vsPosition,
        ); // Using 3-bet range as proxy for raising range
        const villainRange = this.standardRangesService.getOpeningRange(scenario.vsPosition);

        return {
          rangeIp: heroIsIp ? heroRange : villainRange,
          rangeOop: heroIsIp ? villainRange : heroRange,
          playerPosition: heroIsIp ? PlayerPosition.IP : PlayerPosition.OOP,
        };
      }

      default:
        throw new Error(
          `Unsupported action type for solver: ${scenario.actionType}. ` +
            'Supported postflop action types: cbet, vs_cbet_call, vs_cbet_raise',
        );
    }
  }
}
