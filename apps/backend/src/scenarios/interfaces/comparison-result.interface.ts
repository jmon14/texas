import { Action } from '../../ranges/schemas/action.schema';
import { ActionType } from '../../ranges/enums/action-type.enum';

/**
 * Comparison result for a single hand in the "correct" category
 */
export interface CorrectHand {
  hand: string;
  userAction: Action[];
  gtoAction: Action[];
}

/**
 * Comparison result for a single hand in the "missing" category
 */
export interface MissingHand {
  hand: string;
  gtoAction: Action[];
  reason: string;
}

/**
 * Comparison result for a single hand in the "extra" category
 */
export interface ExtraHand {
  hand: string;
  userAction: Action[];
  reason: string;
}

/**
 * Comparison result for a single hand in the "frequencyError" category
 */
export interface FrequencyErrorHand {
  hand: string;
  userAction: Action[];
  gtoAction: Action[];
  /**
   * Max absolute difference across all action types
   */
  maxDifference: number;
  /**
   * Per-action frequency deltas for clarity
   */
  actions: FrequencyErrorActionDifference[];
}

export interface FrequencyErrorActionDifference {
  type: ActionType;
  userFrequency: number;
  gtoFrequency: number;
  difference: number;
}

/**
 * Complete comparison result structure
 */
export interface ComparisonResult {
  accuracyScore: number; // 0-100 percentage match
  handsByCategory: {
    correct: CorrectHand[];
    missing: MissingHand[];
    extra: ExtraHand[];
    frequencyError: FrequencyErrorHand[];
  };
  overallFeedback: string;
}
