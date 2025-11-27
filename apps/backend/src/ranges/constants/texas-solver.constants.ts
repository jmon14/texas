/**
 * TexasSolver Service Constants
 *
 * Centralized constants for TexasSolver integration to avoid magic numbers
 * and improve maintainability.
 */

/**
 * Solver Configuration Defaults
 */
export const SOLVER_DEFAULTS = {
  /** Convergence accuracy (lower = more accurate) */
  ACCURACY: 0.5,
  /** Maximum solver iterations (more = better convergence) */
  MAX_ITERATIONS: 100,
  /** All-in threshold as fraction of pot */
  ALL_IN_THRESHOLD: 0.67,
  /** Number of CPU threads to use */
  THREAD_COUNT: 8,
  /** Print interval for solver progress updates */
  PRINT_INTERVAL: 10,
  /** Use card isomorphism optimization (1 = enabled, 0 = disabled) */
  USE_ISOMORPHISM: 1,
  /** Default bet size as percentage of pot (50 = 50% pot) */
  DEFAULT_BET_SIZE_PERCENT: 50,
  /** Default raise size as percentage of pot (60 = 60% pot) */
  DEFAULT_RAISE_SIZE_PERCENT: 60,
} as const;

/**
 * Solver Execution Settings
 */
export const SOLVER_EXECUTION = {
  /** Timeout in milliseconds (20 minutes) */
  TIMEOUT_MS: 1800000,
  /** Maximum buffer size for solver output (10MB) */
  MAX_BUFFER_BYTES: 1024 * 1024 * 10,
  /** Maximum characters to log from stdout for debugging */
  STDOUT_LOG_MAX_LENGTH: 500,
} as const;

/**
 * Player Position IDs
 * TexasSolver uses numeric IDs: 0 = In Position (IP), 1 = Out of Position (OOP)
 */
export const PLAYER_IDS = {
  IP: 0,
  OOP: 1,
} as const;

/**
 * Poker Calculation Constants
 */
export const POKER_CONSTANTS = {
  /** Multiplier to convert frequency (0-1) to frequency (0-100) */
  FREQUENCY_MULTIPLIER: 100,
  /** Carryover frequency for preflop scenarios (all combos available) */
  PREFLOP_CARRYOVER_FREQUENCY: 100,
  /** Expected length of combo label (e.g., "AcKc" = 4 characters) */
  COMBO_LABEL_LENGTH: 4,
  /** Card rank order (highest to lowest) */
  RANK_ORDER: 'AKQJT98765432',
} as const;

/**
 * Reference Range Solver Metadata
 * Metadata for reference range imports and storage
 */
export const REFERENCE_RANGE_SOLVER = {
  /** Solver name */
  NAME: 'TexasSolver',
  /** Solver version (TODO: Make configurable or detect from binary) */
  VERSION: 'v1.0.1',
} as const;
