import { Position } from '../enums/position.enum';

/**
 * Standard Poker Ranges Constants
 * Realistic input ranges for TexasSolver based on standard poker theory.
 * These ranges are used as input constraints for the solver, not final GTO solutions.
 */

/**
 * Opening Ranges by Position
 * Based on common GTO theory: UTG tight → BTN wide
 */
export const OPENING_RANGES: Record<Position, string> = {
  [Position.UTG]:
    // ~15% - Tight opening range
    'AA,KK,QQ,JJ,TT,99,88,AKs,AKo,AQs,AQo,AJs,AJo,KQs,KQo,KJs',

  [Position.MP]:
    // ~20% - Slightly wider than UTG
    'AA,KK,QQ,JJ,TT,99,88,77,AKs,AKo,AQs,AQo,AJs,AJo,ATs,ATo,KQs,KQo,KJs,KJo,QJs,QJo,JTs',

  [Position.CO]:
    // ~28% - Wide opening range from cutoff
    'AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AKo,AQs,AQo,AJs,AJo,' +
    'ATs,ATo,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KQo,KJs,KJo,KTs,K9s,' +
    'K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QJo,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,' +
    'Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,' +
    'T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,' +
    '76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s',

  [Position.BTN]:
    // ~45% - Very wide opening range from button (best position)
    'AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AKo,AQs,AQo,AJs,AJo,' +
    'ATs,ATo,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KQo,KJs,KJo,KTs,KTo,' +
    'K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QJo,QTs,QTo,Q9s,Q8s,Q7s,Q6s,' +
    'Q5s,Q4s,Q3s,Q2s,JTs,JTo,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,' +
    'T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,' +
    '84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s',

  [Position.SB]:
    // ~28% - Wide opening from small blind (but tighter than BTN/CO due to OOP post-flop)
    'AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AKo,AQs,AQo,AJs,AJo,' +
    'ATs,ATo,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KQo,KJs,KJo,KTs,K9s,' +
    'K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QJo,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,' +
    'Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,' +
    'T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,' +
    '76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s',

  [Position.BB]:
    // BB doesn't "open" (it's already in the pot), but can raise vs limpers or 3-bet vs opener
    // This should never be accessed for opening ranges - use defending/3-betting ranges instead
    '',
};

/**
 * Defending/Calling Ranges by Position vs an Opener
 * These are calling ranges (not including 3-betting ranges).
 * Position-dependent: IP positions can call wider, OOP positions tighter.
 * BB has the widest calling range since they already have money in the pot.
 *
 * Note: UTG cannot defend vs an opener (acts first in 6-max, no limping strategies).
 * Only positions that act after an opener can defend: MP, CO, BTN, SB, BB.
 */
export const DEFENDING_RANGES: Record<Position, string> = {
  [Position.BB]:
    // ~35% - BB calling range vs opener (widest since already invested)
    'AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AKo,AQs,AQo,AJs,AJo,' +
    'ATs,ATo,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KQo,KJs,KJo,KTs,K9s,' +
    'K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QJo,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,' +
    'Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,' +
    'T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,' +
    '76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s',

  [Position.BTN]:
    // ~45% - BTN calling range vs opener (very wide, best position IP)
    'AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AKo,AQs,AQo,AJs,AJo,' +
    'ATs,ATo,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KQo,KJs,KJo,KTs,KTo,' +
    'K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QJo,QTs,QTo,Q9s,Q8s,Q7s,Q6s,' +
    'Q5s,Q4s,Q3s,Q2s,JTs,JTo,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,' +
    'T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,' +
    '84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s',

  [Position.CO]:
    // ~40% - CO calling range vs opener (wide, IP)
    'AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AKo,AQs,AQo,AJs,AJo,' +
    'ATs,ATo,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KQo,KJs,KJo,KTs,K9s,' +
    'K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QJo,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,' +
    'Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,' +
    'T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,' +
    '76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s',

  [Position.SB]:
    // ~30% - SB calling range vs opener (moderate, OOP)
    'AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AKo,AQs,AQo,AJs,AJo,' +
    'ATs,ATo,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KQo,KJs,KJo,KTs,K9s,' +
    'K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QJo,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,' +
    'Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,' +
    'T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,' +
    '76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s',

  [Position.MP]:
    // ~28% - MP calling range vs opener (moderate, OOP)
    'AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AKo,AQs,AQo,AJs,AJo,' +
    'ATs,ATo,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KQo,KJs,KJo,KTs,K9s,' +
    'K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QJo,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,' +
    'Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,' +
    'T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,' +
    '76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s',

  [Position.UTG]:
    // UTG cannot defend vs an opener (acts first in 6-max, no limping strategies)
    '',
};

/**
 * 3-Betting Ranges by Position
 * ~10-15% of hands - polarized (premiums + bluffs)
 * 3-betting range is typically polarized:
 * - Premium hands (AA, KK, QQ, AKs, AKo)
 * - Suited connectors and suited aces (bluffs)
 * - Position-dependent: BTN wider than UTG
 */
export const THREE_BETTING_RANGES: Record<Position, string> = {
  [Position.BTN]:
    // BTN 3-betting range vs opener (~15%)
    'AA,KK,QQ,JJ,TT,AKs,AKo,AQs,AQo,AJs,AJo,ATs,A9s,A8s,A7s,A6s,A5s,' +
    'A4s,A3s,A2s,KQs,KJs,KTs,QJs,QTs,JTs,T9s,98s,87s,76s,65s,54s',

  [Position.SB]:
    // SB 3-betting range vs opener (~12%)
    'AA,KK,QQ,JJ,TT,AKs,AKo,AQs,AQo,AJs,AJo,ATs,A9s,A8s,A7s,A6s,A5s,' +
    'A4s,A3s,A2s,KQs,KJs,KTs,QJs,QTs,JTs',

  [Position.BB]:
    // BB 3-betting range vs opener (~10%)
    'AA,KK,QQ,JJ,AKs,AKo,AQs,AQo,AJs,AJo,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,QJs',

  [Position.CO]:
    // CO 3-betting range vs opener (~12%)
    'AA,KK,QQ,JJ,TT,AKs,AKo,AQs,AQo,AJs,AJo,ATs,A9s,A8s,A7s,A6s,A5s,' +
    'A4s,A3s,A2s,KQs,KJs,KTs,QJs,QTs,JTs',

  [Position.MP]:
    // MP 3-betting range vs opener (~10%)
    'AA,KK,QQ,JJ,AKs,AKo,AQs,AQo,AJs,AJo,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,QJs',

  [Position.UTG]:
    // UTG 3-betting range vs opener (~8%)
    'AA,KK,QQ,JJ,AKs,AKo,AQs,AQo,AJs,AJo,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs',
};
