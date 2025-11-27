import { Injectable } from '@nestjs/common';
import { Position } from './enums/position.enum';
import { OPENING_RANGES, DEFENDING_RANGES, THREE_BETTING_RANGES } from './constants';

/**
 * Standard Poker Ranges Service
 *
 * Provides realistic input ranges for TexasSolver based on standard poker theory.
 * These ranges are used as input constraints for the solver, not final GTO solutions.
 *
 * Performance Note: Using narrower, realistic ranges (vs all 169 hands) results in
 * faster solve times (10-30 seconds vs 2-5 minutes).
 */
@Injectable()
export class StandardRangesService {
  /**
   * Get standard opening range for a position
   * See OPENING_RANGES constant for position-specific ranges and details.
   */
  getOpeningRange(position: Position): string {
    if (position === Position.BB) {
      throw new Error(
        'BB position does not have an opening range. Use getDefendingRange() instead.',
      );
    }

    const range = OPENING_RANGES[position];
    if (!range) {
      throw new Error(`Unknown position: ${position}`);
    }

    return range;
  }

  /**
   * Get standard defending/calling range vs an opener
   * See DEFENDING_RANGES constant for position-specific ranges and details.
   *
   * Note: vsPosition parameter is reserved for future enhancement to provide
   * position-aware ranges (e.g., BB vs UTG tighter than BB vs BTN).
   */
  getDefendingRange(position: Position, _vsPosition: Position): string {
    if (position === Position.UTG) {
      throw new Error(
        'UTG position cannot defend vs an opener (acts first in 6-max). ' +
          'UTG can only open or fold. No limping strategies.',
      );
    }

    const range = DEFENDING_RANGES[position];
    if (!range) {
      throw new Error(`Unknown position for defending range: ${position}`);
    }

    return range;
  }

  /**
   * Get standard 3-betting range vs an opener
   * See THREE_BETTING_RANGES constant for position-specific ranges and details.
   *
   * Note: vsPosition parameter is reserved for future enhancement to provide
   * position-aware ranges (e.g., BTN 3-bet vs UTG tighter than BTN 3-bet vs CO).
   */
  getThreeBettingRange(position: Position, _vsPosition: Position): string {
    const range = THREE_BETTING_RANGES[position];
    if (!range) {
      throw new Error(`Unknown position for 3-betting range: ${position}`);
    }

    return range;
  }
}
