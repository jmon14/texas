/**
 * BoardTexture Enum
 * Type-safe board texture definitions for post-flop scenarios
 * Note: Currently post-MVP, but enum created for consistency and future use
 */
export enum BoardTexture {
  DRY = 'dry', // Low cards, no flush/straight draws, low connectivity
  WET = 'wet', // Many draws possible, flush/straight potential, high connectivity
  PAIRED = 'paired', // Board contains a pair
  MONOTONE = 'monotone', // All cards same suit (flush possible)
  RAINBOW = 'rainbow', // All cards different suits (no flush possible)
  HIGH = 'high', // High cards (A, K, Q, etc.)
  LOW = 'low', // Low cards (2-7, etc.)
}
