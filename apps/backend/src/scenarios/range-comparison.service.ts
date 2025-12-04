import { Injectable, NotFoundException } from '@nestjs/common';
import { ReferenceRangesService } from './reference-ranges.service';
import { RangesService } from '../ranges/ranges.service';
import { HandRange } from '../ranges/schemas/hand-range.schema';
import { Action } from '../ranges/schemas/action.schema';
import {
  ComparisonResult,
  CorrectHand,
  MissingHand,
  ExtraHand,
  FrequencyErrorHand,
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

    // 3. Compare ranges
    return this.compareRangeData(userRange.handsRange, referenceRange.rangeData.handsRange);
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

    // Create maps for efficient lookup
    const userHandsMap = new Map(userHandsRange.map((handRange) => [handRange.label, handRange]));
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
      if (actionMatch.frequencyDifference <= FREQUENCY_THRESHOLD) {
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
          difference: actionMatch.frequencyDifference,
        });
      }
    }

    // Check for extra hands (in user range but not GTO)
    for (const userHand of userHandsRange) {
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
   * Returns the maximum frequency difference across all action types
   */
  private compareActions(
    userActions: Action[],
    gtoActions: Action[],
  ): {
    frequencyDifference: number;
  } {
    // Normalize actions: Sum frequencies per action type
    // Example: User has [{type: CALL, frequency: 50}, {type: RAISE, frequency: 50}]
    //          GTO has [{type: CALL, frequency: 100}]
    //          User CALL total: 50%, GTO CALL total: 100% → difference: 50%

    // Create maps of action type → total frequency
    const userFreqs = this.sumFrequenciesByType(userActions);
    const gtoFreqs = this.sumFrequenciesByType(gtoActions);

    // Calculate maximum frequency difference across all action types
    const allActionTypes = new Set([...Object.keys(userFreqs), ...Object.keys(gtoFreqs)]);
    let maxDifference = 0;

    for (const actionType of allActionTypes) {
      const userFreq = userFreqs[actionType] || 0;
      const gtoFreq = gtoFreqs[actionType] || 0;
      const difference = Math.abs(userFreq - gtoFreq);
      maxDifference = Math.max(maxDifference, difference);
    }

    return { frequencyDifference: maxDifference };
  }

  /**
   * Sum frequencies by action type
   */
  private sumFrequenciesByType(actions: Action[]): Record<string, number> {
    const result: Record<string, number> = {};
    for (const action of actions) {
      result[action.type] = (result[action.type] || 0) + action.frequency;
    }
    return result;
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
