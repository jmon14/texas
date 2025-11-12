import { Injectable, Logger } from '@nestjs/common';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Range, HandRange } from './schemas';
import { ActionType } from './enums/action-type.enum';
import { PlayerPosition } from './enums/player-position.enum';
import { SolveScenarioDto } from './dtos/solve-scenario.dto';
import { ConfigurationService } from '../config/configuration.service';
import { NODE_ENV } from '../utils/constants';
import { SOLVER_DEFAULTS, SOLVER_EXECUTION, PLAYER_IDS, POKER_CONSTANTS } from './constants';

const execFileAsync = promisify(execFile);

/**
 * TexasSolver Integration Service
 *
 * Handles integration with TexasSolver console binary for GTO range calculations.
 *
 * Phase 0: Discovery and basic integration
 * - Generates config files from scenario data
 * - Executes console_solver binary
 * - Parses JSON output and transforms to Range schema
 */
@Injectable()
export class TexasSolverService {
  private readonly logger = new Logger(TexasSolverService.name);

  // Paths relative to backend root
  private readonly solverBinary: string;
  private readonly resourcesDir: string;
  private readonly tempDir: string;

  constructor(private readonly configurationService: ConfigurationService) {
    // Resolve paths relative to backend root
    const backendRoot = path.resolve(__dirname, '../..');
    this.solverBinary = path.join(backendRoot, 'tools/TexasSolver/console_solver');
    this.resourcesDir = path.join(backendRoot, 'tools/TexasSolver/resources');
    this.tempDir = path.join(backendRoot, 'tmp/texas-solver');
  }

  /**
   * Generate TexasSolver config file from scenario parameters
   *
   * Phase 0: Preflop tournament scenarios
   * Phase 2: Post-flop scenarios (flop, turn, river)
   */
  private async generateConfigFile(params: {
    effectiveStack: number; // Big blinds
    pot: number; // Big blinds (typically 1.5 for preflop: SB + BB)
    rangeIp: string; // Hero's range (e.g., "AA,KK,AKs,AKo")
    rangeOop: string; // Villain's range (e.g., "AA,KK,QQ,JJ,TT")
    board?: string; // Board cards (optional - omit for preflop)
    betSizes?: {
      ip?: number[]; // In-position bet sizes (% of pot)
      oop?: number[]; // Out-of-position bet sizes
    };
    accuracy?: number; // Convergence accuracy (default 0.5 for production)
    maxIterations?: number; // Max solver iterations (default 200 for production)
  }): Promise<{ configPath: string; outputPath: string }> {
    const {
      effectiveStack,
      pot,
      rangeIp,
      rangeOop,
      board,
      betSizes,
      accuracy = SOLVER_DEFAULTS.ACCURACY,
      maxIterations = SOLVER_DEFAULTS.MAX_ITERATIONS,
    } = params;

    const configLines: string[] = [];

    // Basic game setup
    configLines.push(`set_pot ${pot}`);
    configLines.push(`set_effective_stack ${effectiveStack}`);

    // Board - Set if provided, otherwise use empty board for preflop scenarios
    // For preflop scenarios, set_board can be empty (no cards)
    let boardCardCount = 0;
    if (board) {
      configLines.push(`set_board ${board}`);
      // Count board cards (comma-separated format from TexasSolver)
      boardCardCount = board.split(',').length;
    } else {
      // Empty board for preflop scenarios
      configLines.push(`set_board`);
    }

    // Ranges
    configLines.push(`set_range_ip ${rangeIp}`);
    configLines.push(`set_range_oop ${rangeOop}`);

    // Bet sizes - Handle preflop and post-flop streets
    if (betSizes) {
      // Preflop bet sizes (if provided)
      if (betSizes.ip) {
        for (const size of betSizes.ip) {
          configLines.push(`set_bet_sizes ip,preflop,bet,${size}`);
        }
      }
      if (betSizes.oop) {
        for (const size of betSizes.oop) {
          configLines.push(`set_bet_sizes oop,preflop,bet,${size}`);
        }
      }
    }

    // Post-flop bet sizes - Set for current and all future streets based on board card count
    // When on flop (3 cards), need bet sizes for flop, turn, and river (all future streets)
    // When on turn (4 cards), need bet sizes for turn and river (future streets)
    // When on river (5 cards), need bet sizes for river only
    // Default bet sizes: 50% pot for bet, 60% pot for raise
    // These are standard sizes used in GTO solvers
    const defaultBetSize = 50;
    const defaultRaiseSize = 60;

    if (boardCardCount === 3) {
      // Flop (3 cards) - bet sizes for flop, turn, and river (all future streets)
      configLines.push(`set_bet_sizes ip,flop,bet,${defaultBetSize}`);
      configLines.push(`set_bet_sizes ip,flop,raise,${defaultRaiseSize}`);
      configLines.push(`set_bet_sizes oop,flop,bet,${defaultBetSize}`);
      configLines.push(`set_bet_sizes oop,flop,raise,${defaultRaiseSize}`);
      // Also set turn and river bet sizes (future streets)
      configLines.push(`set_bet_sizes ip,turn,bet,${defaultBetSize}`);
      configLines.push(`set_bet_sizes ip,turn,raise,${defaultRaiseSize}`);
      configLines.push(`set_bet_sizes oop,turn,bet,${defaultBetSize}`);
      configLines.push(`set_bet_sizes oop,turn,raise,${defaultRaiseSize}`);
      configLines.push(`set_bet_sizes ip,river,bet,${defaultBetSize}`);
      configLines.push(`set_bet_sizes ip,river,raise,${defaultRaiseSize}`);
      configLines.push(`set_bet_sizes oop,river,bet,${defaultBetSize}`);
      configLines.push(`set_bet_sizes oop,river,raise,${defaultRaiseSize}`);
    } else if (boardCardCount === 4) {
      // Turn (4 cards) - bet sizes for turn and river (future streets)
      configLines.push(`set_bet_sizes ip,turn,bet,${defaultBetSize}`);
      configLines.push(`set_bet_sizes ip,turn,raise,${defaultRaiseSize}`);
      configLines.push(`set_bet_sizes oop,turn,bet,${defaultBetSize}`);
      configLines.push(`set_bet_sizes oop,turn,raise,${defaultRaiseSize}`);
      configLines.push(`set_bet_sizes ip,river,bet,${defaultBetSize}`);
      configLines.push(`set_bet_sizes ip,river,raise,${defaultRaiseSize}`);
      configLines.push(`set_bet_sizes oop,river,bet,${defaultBetSize}`);
      configLines.push(`set_bet_sizes oop,river,raise,${defaultRaiseSize}`);
    } else if (boardCardCount === 5) {
      // River (5 cards) - bet sizes for river only
      configLines.push(`set_bet_sizes ip,river,bet,${defaultBetSize}`);
      configLines.push(`set_bet_sizes ip,river,raise,${defaultRaiseSize}`);
      configLines.push(`set_bet_sizes oop,river,bet,${defaultBetSize}`);
      configLines.push(`set_bet_sizes oop,river,raise,${defaultRaiseSize}`);
    }

    // All-in threshold
    configLines.push(`set_allin_threshold ${SOLVER_DEFAULTS.ALL_IN_THRESHOLD}`);
    // Note: set_raise_limit is not a valid command - raise limit is configured in YAML rules

    // Build tree
    configLines.push(`build_tree`);

    // Solver settings
    configLines.push(`set_thread_num ${SOLVER_DEFAULTS.THREAD_COUNT}`);
    // For faster testing: use lower accuracy (higher value) and fewer iterations
    // Production: accuracy 0.5, iterations 200
    // Testing: accuracy 1.0, iterations 100
    configLines.push(`set_accuracy ${accuracy}`);
    configLines.push(`set_max_iteration ${maxIterations}`);
    configLines.push(`set_print_interval ${SOLVER_DEFAULTS.PRINT_INTERVAL}`);
    configLines.push(`set_use_isomorphism ${SOLVER_DEFAULTS.USE_ISOMORPHISM}`);

    // Solve
    configLines.push(`start_solve`);

    // Generate unique output filename to prevent collisions in concurrent executions
    const timestamp = Date.now();
    const outputFilename = `output_result-${timestamp}.json`;

    // Dump results (after solving)
    // Set dump rounds based on street:
    // - Flop (3 cards) → dump_rounds 2
    // - Turn (4 cards) → dump_rounds 3
    // - River (5 cards) → dump_rounds 4
    // - Preflop (no board) → omit dump_rounds (not needed)
    if (boardCardCount === 3) {
      configLines.push(`set_dump_rounds 2`); // Flop
    } else if (boardCardCount === 4) {
      configLines.push(`set_dump_rounds 3`); // Turn
    } else if (boardCardCount === 5) {
      configLines.push(`set_dump_rounds 4`); // River
    }
    // Preflop: omit set_dump_rounds (not needed for preflop-only scenarios)

    configLines.push(`dump_result ${outputFilename}`);

    // Ensure temp directory exists before writing
    // Note: recursive: true makes this idempotent - won't throw if directory exists
    await fs.mkdir(this.tempDir, { recursive: true });

    // Write config file
    const configPath = path.join(this.tempDir, `config-${timestamp}.txt`);
    const outputPath = path.join(this.tempDir, outputFilename);
    await fs.writeFile(configPath, configLines.join('\n'), 'utf-8');

    this.logger.debug(`Generated config file: ${configPath}`);
    this.logger.debug(`Output will be written to: ${outputPath}`);
    return { configPath, outputPath };
  }

  /**
   * Execute TexasSolver binary with config file
   */
  private async executeSolver(configPath: string, expectedOutputPath: string): Promise<string> {
    const outputDir = path.dirname(configPath);

    try {
      this.logger.log(`Executing TexasSolver with config: ${configPath}`);
      this.logger.debug(`Expected output: ${expectedOutputPath}`);

      // Execute: ./console_solver -i config.txt -r resources
      // Capture both stdout and stderr to see progress
      const { stdout, stderr } = await execFileAsync(
        this.solverBinary,
        ['-i', configPath, '-r', this.resourcesDir, '-m', 'holdem'],
        {
          cwd: outputDir,
          timeout: SOLVER_EXECUTION.TIMEOUT_MS,
          maxBuffer: SOLVER_EXECUTION.MAX_BUFFER_BYTES,
        },
      );

      // Log solver output for debugging
      if (stdout) {
        this.logger.debug(
          `Solver stdout: ${stdout.substring(0, SOLVER_EXECUTION.STDOUT_LOG_MAX_LENGTH)}`,
        );
      }
      if (stderr) {
        this.logger.warn(`Solver stderr: ${stderr}`);
      }

      // Check if output file exists
      try {
        await fs.access(expectedOutputPath);
        this.logger.log(`Solver completed. Output: ${expectedOutputPath}`);
        return expectedOutputPath;
      } catch (error) {
        throw new Error(`Output file not found at ${expectedOutputPath}. Solver may have failed.`);
      }
    } catch (error) {
      this.logger.error(`Solver execution failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Parse TexasSolver JSON output and transform to Range schema
   *
   * TexasSolver JSON structure is nested through the game tree.
   * For preflop scenarios, we need to extract the root node strategy.
   *
   * Structure:
   * {
   *   "node_type": "action_node",
   *   "childrens": { ... },
   *   "strategy": {
   *     "strategy": {
   *       "AsAh": [0.5, 0.3, 0.2], // [freq1, freq2, freq3] for each action
   *       ...
   *     },
   *     "actions": ["FOLD", "CALL", "RAISE"]
   *   },
   *   "player": 0 or 1
   * }
   */
  private async parseAndTransform(
    jsonPath: string,
    playerPosition: PlayerPosition,
  ): Promise<HandRange[]> {
    const jsonContent = await fs.readFile(jsonPath, 'utf-8');
    const data = JSON.parse(jsonContent);

    const handRanges: HandRange[] = [];

    // Find the root strategy node
    // For preflop, we want the root action node strategy
    const rootStrategy = TexasSolverService.findRootStrategy(
      data,
      this.getPlayerId(playerPosition),
    );

    if (!rootStrategy) {
      throw new Error('Could not find root strategy in solver output');
    }

    const strategyData = rootStrategy.strategy || {};
    const actions = rootStrategy.actions || [];

    // Aggregate specific combos into poker notation groups
    // Map: poker notation -> aggregated frequencies
    const aggregatedHands = new Map<string, number[][]>();

    for (const [comboLabel, frequencies] of Object.entries(strategyData)) {
      if (!Array.isArray(frequencies) || frequencies.length === 0) {
        continue;
      }

      // Convert combo label to poker notation (e.g., "AcKc" -> "AKs")
      const pokerNotation = this.convertComboToPokerNotation(comboLabel);

      if (!aggregatedHands.has(pokerNotation)) {
        aggregatedHands.set(pokerNotation, []);
      }

      // Store frequencies for this combo (will average later)
      aggregatedHands.get(pokerNotation)!.push(frequencies as number[]);
    }

    // Transform aggregated hands to HandRange array
    for (const [pokerNotation, comboFrequencies] of aggregatedHands.entries()) {
      // Average frequencies across all combos of this hand type
      // e.g., average all AKs combos together
      const averagedFrequencies = TexasSolverService.averageFrequencies(comboFrequencies);

      const actionArray = averagedFrequencies
        .map((freq, index) => {
          const actionType = this.mapActionType(actions[index] || `action_${index}`);
          // Convert 0-1 frequency to 0-100 frequency
          const frequency = Math.round(freq * POKER_CONSTANTS.FREQUENCY_MULTIPLIER);

          return {
            type: actionType,
            frequency: frequency,
          };
        })
        .filter((action) => action.frequency > 0); // Only include actions with frequency > 0

      if (actionArray.length === 0) {
        continue; // Skip hands with no actions
      }

      handRanges.push({
        label: pokerNotation,
        carryoverFrequency: POKER_CONSTANTS.PREFLOP_CARRYOVER_FREQUENCY,
        actions: actionArray,
      });
    }

    this.logger.debug(`Transformed ${handRanges.length} hands from solver output`);
    return handRanges;
  }

  /**
   * Map PlayerPosition enum to TexasSolver numeric player ID
   */
  private getPlayerId(position: PlayerPosition): number {
    return position === PlayerPosition.IP ? PLAYER_IDS.IP : PLAYER_IDS.OOP;
  }

  /**
   * Convert specific combo label to poker notation
   * Examples:
   * - "AcKc" -> "AKs" (suited)
   * - "AcKd" -> "AKo" (offsuit)
   * - "AdAc" -> "AA" (pair)
   */
  private convertComboToPokerNotation(comboLabel: string): string {
    // Format: "AcKc" = first card rank + suit, second card rank + suit
    if (comboLabel.length !== POKER_CONSTANTS.COMBO_LABEL_LENGTH) {
      this.logger.warn(`Unexpected combo format: ${comboLabel}`);
      return comboLabel; // Return as-is if format unexpected
    }

    const card1Rank = comboLabel[0];
    const card1Suit = comboLabel[1];
    const card2Rank = comboLabel[2];
    const card2Suit = comboLabel[3];

    // Pair detection (same rank)
    if (card1Rank === card2Rank) {
      return `${card1Rank}${card1Rank}`; // e.g., "AA", "KK"
    }

    // Determine which rank is higher (A > K > Q > J > T > 9 > ... > 2)
    const rankOrder = POKER_CONSTANTS.RANK_ORDER;
    const rank1Index = rankOrder.indexOf(card1Rank);
    const rank2Index = rankOrder.indexOf(card2Rank);

    const higherRank = rank1Index < rank2Index ? card1Rank : card2Rank;
    const lowerRank = rank1Index < rank2Index ? card2Rank : card1Rank;

    // Same suit = suited, different suit = offsuit
    const isSuited = card1Suit === card2Suit;

    return `${higherRank}${lowerRank}${isSuited ? 's' : 'o'}`; // e.g., "AKs", "AKo"
  }

  /**
   * Average frequency arrays across multiple combos
   * Example: [[0.5, 0.5], [0.3, 0.7], [0.4, 0.6]] -> [0.4, 0.6]
   *
   * Pure function - can be static
   */
  private static averageFrequencies(frequencyArrays: number[][]): number[] {
    if (frequencyArrays.length === 0) {
      return [];
    }

    if (frequencyArrays.length === 1) {
      return frequencyArrays[0];
    }

    // Determine max length (handle different action counts)
    const maxLength = Math.max(...frequencyArrays.map((arr) => arr.length));

    // Average each position across all arrays
    const averaged: number[] = [];
    for (let i = 0; i < maxLength; i++) {
      let sum = 0;
      let count = 0;

      for (const arr of frequencyArrays) {
        if (i < arr.length) {
          sum += arr[i];
          count++;
        }
      }

      averaged.push(count > 0 ? sum / count : 0);
    }

    return averaged;
  }

  /**
   * Recursively find root strategy node for specified player
   *
   * Pure function - can be static
   */
  private static findRootStrategy(node: any, playerId: number): any {
    // If this node has strategy and matches player, return it
    if (node.strategy && node.player === playerId) {
      return node.strategy;
    }

    // If this node has strategy but no player specified, it might be root
    if (node.strategy && node.player === undefined) {
      return node.strategy;
    }

    // Check childrens recursively
    if (node.childrens && typeof node.childrens === 'object') {
      for (const child of Object.values(node.childrens)) {
        const result = TexasSolverService.findRootStrategy(child, playerId);
        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  /**
   * Map TexasSolver action strings to our ActionType enum
   */
  private mapActionType(solverAction: string): ActionType {
    const upper = solverAction.toUpperCase();

    if (upper.includes('FOLD')) return ActionType.FOLD;
    if (upper.includes('CALL')) return ActionType.CALL;
    if (upper.includes('CHECK')) return ActionType.CHECK;
    if (upper.includes('RAISE') || upper.includes('BET')) {
      return ActionType.RAISE;
    }

    // Default to fold if unknown
    this.logger.warn(`Unknown action type: ${solverAction}, defaulting to FOLD`);
    return ActionType.FOLD;
  }

  /**
   * Main method: Solve a scenario and return Range
   *
   * Phase 0: Preflop scenarios
   * Phase 2: Post-flop scenarios (flop, turn, river)
   */
  async solveScenario(params: SolveScenarioDto): Promise<Range> {
    this.logger.log(`Solving scenario: ${params.name}`);

    let configPath: string;
    let outputPath: string;

    const { effectiveStack, pot, rangeIp, rangeOop, playerPosition, name, boardCards } = params;
    try {
      // 1. Generate config file
      // Convert space-separated board cards to comma-separated format for TexasSolver
      const boardForSolver = boardCards ? boardCards.trim().split(/\s+/).join(',') : undefined;

      const { configPath: generatedConfigPath, outputPath: generatedOutputPath } =
        await this.generateConfigFile({
          effectiveStack,
          pot,
          rangeIp,
          rangeOop,
          board: boardForSolver,
        });
      configPath = generatedConfigPath;
      outputPath = generatedOutputPath;

      // 2. Execute solver
      outputPath = await this.executeSolver(configPath, outputPath);

      // 3. Parse and transform
      const handsRange = await this.parseAndTransform(outputPath, playerPosition);

      // TODO: Future enhancement - create system user seeded in all environments
      const result: Range = {
        name,
        handsRange,
        userId: 'system',
      };

      return result;
    } catch (error) {
      this.logger.error(`Failed to solve scenario ${name}: ${error.message}`);
      throw error;
    } finally {
      // 4. Cleanup temp files (always cleanup, even on error)
      await this.cleanupTempFile(configPath, 'config');
      await this.cleanupTempFile(outputPath, 'output');
    }
  }

  /**
   * Helper: Convert range array to TexasSolver format
   * Example: ["AA", "KK", "AKs"] -> "AA,KK,AKs"
   */
  static formatRangeForSolver(hands: string[]): string {
    return hands.join(',');
  }

  /**
   * Cleanup a temporary file created during solver execution
   * Only deletes files in production to avoid disk space issues.
   * In development, files are kept for debugging purposes.
   * Silently handles errors to avoid masking original errors
   */
  private async cleanupTempFile(filePath: string, fileType: string): Promise<void> {
    try {
      const nodeEnv = await this.configurationService.get('NODE_ENV');
      // Only cleanup in production
      if (nodeEnv !== NODE_ENV.PRODUCTION) {
        this.logger.debug(`Keeping ${fileType} file for debugging: ${filePath}`);
        return;
      }
    } catch (error) {
      // If we can't get NODE_ENV, default to keeping files (safer)
      this.logger.warn(`Failed to get NODE_ENV, keeping ${fileType} file: ${error.message}`);
      return;
    }

    try {
      await fs.unlink(filePath);
      this.logger.debug(`Cleaned up ${fileType} file: ${filePath}`);
    } catch (error) {
      // Log but don't throw - cleanup failures shouldn't break the flow
      this.logger.warn(`Failed to cleanup ${fileType} file ${filePath}: ${error.message}`);
    }
  }
}
