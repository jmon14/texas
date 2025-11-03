/**
 * ScenarioActionType Enum
 * Type-safe scenario action type definitions
 * These represent the type of scenario (what decision is being made), not the poker action itself
 */
export enum ScenarioActionType {
  OPEN = 'open', // Opening range scenario
  VS_OPEN_CALL = 'vs_open_call', // Calling vs an open
  VS_OPEN_3BET = 'vs_open_3bet', // 3-betting vs an open
  VS_3BET = 'vs_3bet', // Responding to a 3-bet
  VS_4BET = 'vs_4bet', // Responding to a 4-bet
}
