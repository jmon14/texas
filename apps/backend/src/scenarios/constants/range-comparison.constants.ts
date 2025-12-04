/**
 * Range Comparison Constants
 * Constants used for comparing user ranges against GTO reference ranges
 */

/**
 * Frequency threshold for considering actions "correct"
 * Actions with frequency differences within this threshold (≤5%) are considered correct
 * Actions exceeding this threshold are categorized as frequency errors
 * Default: 5% difference threshold
 */
export const FREQUENCY_THRESHOLD = 5;
