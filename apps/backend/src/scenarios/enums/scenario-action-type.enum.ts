/**
 * ScenarioActionType Enum
 * Type-safe scenario action type definitions
 * These represent the type of scenario (what decision is being made), not the poker action itself
 *
 * Note: Currently only postflop action types are supported in the MVP.
 * Preflop action types are reserved for future use.
 */
export enum ScenarioActionType {
  // Postflop action types (currently supported)
  CBET = 'cbet', // Continuation bet: Hero opened preflop, now betting postflop
  VS_CBET_CALL = 'vs_cbet_call', // Calling a cbet: Hero called preflop, now calling cbet postflop
  VS_CBET_RAISE = 'vs_cbet_raise', // Raising a cbet: Hero called preflop, now raising cbet postflop

  // Preflop action types (reserved for future use, not currently supported)
  OPEN = 'open', // Opening range scenario (preflop)
  VS_OPEN_CALL = 'vs_open_call', // Calling vs an open (preflop)
  VS_OPEN_3BET = 'vs_open_3bet', // 3-betting vs an open (preflop)
  VS_3BET = 'vs_3bet', // Responding to a 3-bet (preflop)
  VS_4BET = 'vs_4bet', // Responding to a 4-bet (preflop)
}
