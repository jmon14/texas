/**
 * Pot Calculation Constants
 * Standard bet sizes and pot calculations for poker scenarios
 */

/**
 * Standard preflop opening bet size in big blinds
 * Common tournament opening sizes: 2.5bb (standard), 2.2bb (small), 3bb (large)
 */
export const STANDARD_OPEN_SIZE = 2.5;

/**
 * Total blinds in big blinds
 * Small Blind (0.5bb) + Big Blind (1.0bb) = 1.5bb
 */
export const BLINDS = 1.5;

/**
 * Maximum stack-to-pot ratio for solver calculations
 * Solver may have issues with very high stack-to-pot ratios
 * Caps effective stack at a reasonable multiple of pot to ensure solver stability
 */
export const MAX_STACK_TO_POT_RATIO = 10;
