import { Injectable, NotFoundException } from '@nestjs/common';
import { ReferenceRangesService } from './reference-ranges.service';
import { RangesService } from '../ranges/ranges.service';
import { HandRange } from '../ranges/schemas/hand-range.schema';
import { Action } from '../ranges/schemas/action.schema';
import { ActionType } from '../ranges/enums/action-type.enum';
import {
  ComparisonResult,
  CorrectHand,
  MissingHand,
  ExtraHand,
  FrequencyErrorHand,
  FrequencyErrorActionDifference,
} from './interfaces/comparison-result.interface';
import { FREQUENCY_THRESHOLD } from './constants';

@Injectable()
export class RangeComparisonService {
  constructor(
    private readonly referenceRangesService: ReferenceRangesService,
    private readonly rangesService: RangesService,
  ) {}

  /**
   * Compare user range to GTO reference range for a scenario
   */
  async compareRanges(scenarioId: string, userRangeId: string): Promise<ComparisonResult> {
    // 1. Load reference range (GTO)
    const referenceRange = await this.referenceRangesService.findByScenarioId(scenarioId);
    if (!referenceRange) {
      throw new NotFoundException(`Reference range not found for scenario ${scenarioId}`);
    }

    // 2. Load user range
    const userRange = await this.rangesService.getRangeById(userRangeId);
    if (!userRange) {
      throw new NotFoundException(`Range with ID ${userRangeId} not found`);
    }

    // 3. Compare ranges and ensure we return plain JSON-safe objects
    const result = this.compareRangeData(userRange.handsRange, referenceRange.rangeData.handsRange);
    return this.toPlainComparisonResult(result);
  }

  /**
   * Core comparison algorithm
   */
  private compareRangeData(
    userHandsRange: HandRange[],
    gtoHandsRange: HandRange[],
  ): ComparisonResult {
    const results = {
      correct: [] as CorrectHand[],
      missing: [] as MissingHand[],
      extra: [] as ExtraHand[],
      frequencyError: [] as FrequencyErrorHand[],
    };

    // Filter out empty/zero-frequency user hands and create maps for efficient lookup
    const validUserHandsRange = userHandsRange.filter((handRange) =>
      this.hasMeaningfulActions(handRange.actions),
    );
    const userHandsMap = new Map(
      validUserHandsRange.map((handRange) => [handRange.label, handRange]),
    );
    const gtoHandsMap = new Map(gtoHandsRange.map((handRange) => [handRange.label, handRange]));

    // Check all GTO hands
    for (const gtoHand of gtoHandsRange) {
      const userHand = userHandsMap.get(gtoHand.label);

      if (!userHand) {
        results.missing.push({
          hand: gtoHand.label,
          gtoAction: gtoHand.actions,
          reason: 'Included in GTO range', // Simple reason for MVP
        });
        continue;
      }

      // Compare actions
      const actionMatch = this.compareActions(userHand.actions, gtoHand.actions);

      // If frequency difference is within threshold, it's correct
      // Otherwise, it's a frequency error
      if (actionMatch.maxDifference <= FREQUENCY_THRESHOLD) {
        results.correct.push({
          hand: gtoHand.label,
          userAction: userHand.actions,
          gtoAction: gtoHand.actions,
        });
      } else {
        results.frequencyError.push({
          hand: gtoHand.label,
          userAction: userHand.actions,
          gtoAction: gtoHand.actions,
          maxDifference: actionMatch.maxDifference,
          actions: actionMatch.actions,
        });
      }
    }

    // Check for extra hands (in user range but not GTO)
    for (const userHand of validUserHandsRange) {
      if (!gtoHandsMap.has(userHand.label)) {
        results.extra.push({
          hand: userHand.label,
          userAction: userHand.actions,
          reason: 'Not in GTO range', // Simple reason for MVP
        });
      }
    }

    // Calculate accuracy score
    const totalHands = gtoHandsRange.length;
    const correctHands = results.correct.length;
    const accuracyScore = totalHands > 0 ? (correctHands / totalHands) * 100 : 0;

    return {
      accuracyScore,
      handsByCategory: results,
      overallFeedback: this.generateOverallFeedback(results, accuracyScore),
    };
  }

  /**
   * Compare actions between user and GTO ranges
   * Returns the maximum frequency difference across all action types and per-action deltas
   */
  private compareActions(
    userActions: Action[],
    gtoActions: Action[],
  ): {
    maxDifference: number;
    actions: FrequencyErrorActionDifference[];
  } {
    // Normalize actions: Sum frequencies per action type
    // Example: User has [{type: CALL, frequency: 50}, {type: RAISE, frequency: 50}]
    //          GTO has [{type: CALL, frequency: 100}]
    //          User CALL total: 50%, GTO CALL total: 100% → difference: 50%

    // Create maps of action type → total frequency
    const userFreqs = this.sumFrequenciesByType(userActions);
    const gtoFreqs = this.sumFrequenciesByType(gtoActions);

    // Calculate maximum frequency difference across all action types
    const allActionTypes = new Set<ActionType>([
      ...userActions.map((action) => action.type),
      ...gtoActions.map((action) => action.type),
    ]);
    let maxDifference = 0;
    const actions: FrequencyErrorActionDifference[] = [];

    for (const actionType of allActionTypes) {
      const userFreq = userFreqs[actionType] || 0;
      const gtoFreq = gtoFreqs[actionType] || 0;
      const difference = Math.abs(userFreq - gtoFreq);
      maxDifference = Math.max(maxDifference, difference);
      actions.push({
        type: actionType,
        userFrequency: userFreq,
        gtoFrequency: gtoFreq,
        difference,
      });
    }

    return { maxDifference, actions };
  }

  /**
   * Convert comparison result to plain objects to avoid class-transformer recursion
   */
  private toPlainComparisonResult(result: ComparisonResult): ComparisonResult {
    const cloneActions = (actions: Action[]): Action[] =>
      actions.map((action) => ({
        type: action.type,
        frequency: action.frequency,
        ev: action.ev,
        equity: action.equity,
      }));

    return {
      accuracyScore: result.accuracyScore,
      handsByCategory: {
        correct: result.handsByCategory.correct.map((hand) => ({
          hand: hand.hand,
          userAction: cloneActions(hand.userAction),
          gtoAction: cloneActions(hand.gtoAction),
        })),
        missing: result.handsByCategory.missing.map((hand) => ({
          hand: hand.hand,
          gtoAction: cloneActions(hand.gtoAction),
          reason: hand.reason,
        })),
        extra: result.handsByCategory.extra.map((hand) => ({
          hand: hand.hand,
          userAction: cloneActions(hand.userAction),
          reason: hand.reason,
        })),
        frequencyError: result.handsByCategory.frequencyError.map((hand) => ({
          hand: hand.hand,
          userAction: cloneActions(hand.userAction),
          gtoAction: cloneActions(hand.gtoAction),
          maxDifference: hand.maxDifference,
          actions: hand.actions.map((action) => ({
            type: action.type,
            userFrequency: action.userFrequency,
            gtoFrequency: action.gtoFrequency,
            difference: action.difference,
          })),
        })),
      },
      overallFeedback: result.overallFeedback,
    };
  }

  /**
   * Sum frequencies by action type
   */
  private sumFrequenciesByType(actions: Action[]): Partial<Record<ActionType, number>> {
    const result: Partial<Record<ActionType, number>> = {};
    for (const action of actions) {
      result[action.type] = (result[action.type] || 0) + action.frequency;
    }
    return result;
  }

  /**
   * Determine whether a hand has any non-zero action frequencies
   */
  private hasMeaningfulActions(actions: Action[]): boolean {
    if (!actions || actions.length === 0) {
      return false;
    }
    return this.calculateTotalFrequency(actions) > 0;
  }

  /**
   * Calculate total frequency from actions array
   */
  private calculateTotalFrequency(actions: Action[]): number {
    return actions.reduce((sum, action) => sum + action.frequency, 0);
  }

  /**
   * Generate overall feedback summary
   */
  private generateOverallFeedback(
    results: {
      correct: CorrectHand[];
      missing: MissingHand[];
      extra: ExtraHand[];
      frequencyError: FrequencyErrorHand[];
    },
    accuracyScore: number,
  ): string {
    const correctCount = results.correct.length;
    const missingCount = results.missing.length;
    const extraCount = results.extra.length;
    const frequencyErrorCount = results.frequencyError.length;

    const parts: string[] = [];

    const totalHands = correctCount + missingCount + frequencyErrorCount;
    const accuracyPercent = accuracyScore.toFixed(1);
    parts.push(
      `You matched ${correctCount} out of ${totalHands} hands correctly (${accuracyPercent}%).`,
    );

    if (missingCount > 0) {
      const handText = missingCount === 1 ? 'hand' : 'hands';
      parts.push(`Missing ${missingCount} ${handText} that should be included.`);
    }

    if (extraCount > 0) {
      const handText = extraCount === 1 ? 'hand' : 'hands';
      parts.push(`Included ${extraCount} ${handText} that should not be in your range.`);
    }

    if (frequencyErrorCount > 0) {
      const handText = frequencyErrorCount === 1 ? 'hand has' : 'hands have';
      const thresholdText = `action frequencies differ by more than ${FREQUENCY_THRESHOLD}%`;
      parts.push(`${frequencyErrorCount} ${handText} frequency errors (${thresholdText}).`);
    }

    return parts.join(' ');
  }
}
