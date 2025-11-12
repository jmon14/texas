# TexasSolver Integration Guide

**Status:** Phase 0 - Discovery & Basic Integration  
**Last Updated:** Phase 0 Implementation  
**Service:** `apps/backend/src/ranges/services/texas-solver.service.ts`

---

## Overview

This document describes the integration between our Texas Poker application and TexasSolver (a C++ GTO poker solver). The integration allows us to solve poker scenarios programmatically and import GTO ranges into our database.

### What TexasSolver Does

TexasSolver is an open-source poker solver that:
- Solves game theory optimal (GTO) strategies for poker scenarios
- Uses Counterfactual Regret Minimization (CFR) algorithms
- Supports Texas Hold'em (and short deck)
- Exports solutions as JSON files with strategy frequencies

### What Our Integration Does

The `TexasSolverService` provides:
1. **Config Generation** - Creates TexasSolver config files from scenario parameters
2. **Solver Execution** - Runs the `console_solver` binary programmatically
3. **Result Parsing** - Transforms JSON output into our `Range` schema format
4. **Data Transformation** - Maps solver actions to our `ActionType` enum

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TexasSolverService                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. generateConfigFile()                                    │
│     └─> Creates .txt config file                            │
│                                                              │
│  2. executeSolver()                                         │
│     └─> Runs: ./console_solver -i config.txt -r resources   │
│         └─> Outputs: output_result.json                     │
│                                                              │
│  3. parseAndTransform()                                     │
│     └─> Reads JSON                                          │
│     └─> Finds root strategy node                            │
│     └─> Transforms to Range/HandRange/Action schema        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

### Required Files

```
apps/backend/tools/TexasSolver/
├── console_solver          # Executable binary (macOS)
└── resources/              # Runtime data files
    ├── compairer/          # Card comparison dictionaries
    ├── gametree/           # Game tree templates
    ├── text/               # Sample config files (reference)
    └── yamls/              # Rule configurations
```

**Binary Location:**
- Development: `apps/backend/tools/TexasSolver/console_solver`
- Production (Docker): Included in backend container at `/usr/src/app/tools/TexasSolver/console_solver`
- Linux (production): Will need Linux binary from releases

**Resource Directory:**
- Must be accessible at runtime
- Contains dictionaries and templates needed by solver

---

## Config File Format

TexasSolver uses a text-based config file format. Here's what we generate:

### Example Config File

```txt
set_pot 1.5
set_effective_stack 100
set_board
set_range_ip AA,KK,QQ,JJ,TT,AKs,AKo,AQs,AQo
set_range_oop AA,KK,QQ,JJ,TT,99,88,AKs,AKo,AQs,AQo
set_bet_sizes ip,preflop,bet,50
set_bet_sizes ip,preflop,bet,100
set_bet_sizes oop,preflop,bet,50
set_bet_sizes oop,preflop,bet,100
set_allin_threshold 0.67
set_raise_limit 3
build_tree
set_thread_num 8
set_accuracy 0.5
set_max_iteration 200
set_print_interval 10
set_use_isomorphism 1
start_solve
set_dump_rounds 1
dump_result output_result.json
```

### Config Commands Explained

| Command | Description | Example |
|---------|-------------|---------|
| `set_pot` | Pot size in big blinds | `set_pot 1.5` (SB + BB preflop) |
| `set_effective_stack` | Effective stack depth | `set_effective_stack 100` |
| `set_board` | Board cards (empty for preflop) | `set_board` or `set_board As,Kh,7d` |
| `set_range_ip` | In-position player's range | `set_range_ip AA,KK,AKs,AKo` |
| `set_range_oop` | Out-of-position player's range | `set_range_oop AA,KK,QQ,JJ` |
| `set_bet_sizes` | Betting options | `set_bet_sizes ip,preflop,bet,50` |
| `set_allin_threshold` | When to consider all-in | `set_allin_threshold 0.67` |
| `set_raise_limit` | Max raises allowed | `set_raise_limit 3` |
| `build_tree` | Build game tree | `build_tree` |
| `set_thread_num` | Number of CPU threads | `set_thread_num 8` |
| `set_accuracy` | Convergence accuracy | `set_accuracy 0.5` (lower = more accurate) |
| `set_max_iteration` | Max solver iterations | `set_max_iteration 200` |
| `set_use_isomorphism` | Use card isomorphism | `set_use_isomorphism 1` (faster) |
| `start_solve` | Begin solving | `start_solve` |
| `set_dump_rounds` | Which streets to dump | `set_dump_rounds 1` (preflop only) |
| `dump_result` | Output file name | `dump_result output_result.json` |

### Range Format

Ranges use standard poker notation:
- **Pairs**: `AA`, `KK`, `QQ`, etc.
- **Suited**: `AKs`, `AQs`, `JTs` (suited connector)
- **Offsuit**: `AKo`, `AQo`, `JTo` (offsuit)
- **With frequency**: `99:0.75` (75% frequency)

Example: `AA,KK,QQ:0.5,AKs,AKo` = AA always, KK always, QQ 50%, AKs always, AKo always

---

## JSON Output Structure

TexasSolver outputs a deeply nested JSON structure representing the game tree.

### Structure Overview

```json
{
  "node_type": "action_node",
  "player": 0,
  "childrens": {
    "RAISE": {
      "node_type": "action_node",
      "player": 1,
      "childrens": { ... },
      "strategy": {
        "strategy": {
          "AsAh": [0.8, 0.2],
          "KsKh": [0.6, 0.4]
        },
        "actions": ["CALL", "FOLD"]
      }
    }
  },
  "strategy": {
    "strategy": {
      "AsAh": [0.0, 0.3, 0.7],
      "KsKh": [0.0, 0.5, 0.5]
    },
    "actions": ["FOLD", "CALL", "RAISE"]
  }
}
```

### Key Fields

- **`node_type`**: Type of node (`action_node`, `chance_node`, `terminal_node`)
- **`player`**: Player ID (0 = IP, 1 = OOP)
- **`strategy.strategy`**: Object mapping hand labels to frequency arrays
- **`strategy.actions`**: Array of action names corresponding to frequencies
- **`childrens`**: Child nodes in the game tree

**Note:** The JSON output does NOT contain EV (Expected Value) or equity fields. TexasSolver only outputs strategy frequencies for Nash Equilibrium computation.

### Example Hand Entry

```json
"AsAh": [0.0, 0.3, 0.7]
```

This means:
- **Hand**: AsAh (Ace of spades, Ace of hearts)
- **Frequencies**: 
  - 0% FOLD (actions[0])
  - 30% CALL (actions[1])
  - 70% RAISE (actions[2])

---

## Data Transformation

### Input → Output Mapping

| TexasSolver | Our Schema |
|-------------|------------|
| `"AsAh": [0.3, 0.7]` | `{ label: "AsAh", rangeFraction: 100, actions: [{ type: "call", percentage: 30 }, { type: "raise", percentage: 70 }] }` |
| `"FOLD"` action | `ActionType.FOLD` |
| `"CALL"` action | `ActionType.CALL` |
| `"RAISE"` or `"BET"` | `ActionType.RAISE` |
| `"CHECK"` action | `ActionType.CHECK` |

### Transformation Process

1. **Find Root Strategy**: Recursively traverse JSON tree to find root action node
2. **Extract Strategy Data**: Get `strategy.strategy` object and `strategy.actions` array
3. **Map Hands**: For each hand label, create `HandRange` object
4. **Convert Frequencies**: Transform 0-1 floats to 0-100 percentages
5. **Filter Actions**: Only include actions with frequency > 0

---

## Usage Examples

### Basic Usage

```typescript
import { TexasSolverService } from './ranges/services/texas-solver.service';
import { PlayerPosition } from './ranges/schemas/player-position.enum';

// Inject service (in controller or another service)
constructor(private texasSolverService: TexasSolverService) {}

// Solve a scenario
const result = await this.texasSolverService.solveScenario({
  name: 'UTG Open - 100bb Tournament',
  effectiveStack: 100,
  pot: 1.5, // SB + BB
  rangeIp: 'AA,KK,QQ,JJ,TT,99,AKs,AKo,AQs,AQo,AJs,AJo',
  rangeOop: 'AA,KK,QQ,JJ,TT,99,88,77,AKs,AKo',
  playerPosition: PlayerPosition.IP, // Extract IP player's strategy
});

// result is a Range object:
// {
//   name: 'UTG Open - 100bb Tournament',
//   handsRange: [
//     { label: 'AA', rangeFraction: 100, actions: [{ type: 'raise', percentage: 100 }] },
//     { label: 'KK', rangeFraction: 100, actions: [{ type: 'raise', percentage: 100 }] },
//     ...
//   ],
//   userId: 'system' // Note: System user enhancement planned for Phase 2+
// }
```

### Example: UTG Opening Range

```typescript
const utgOpenRange = await texasSolverService.solveScenario({
  name: 'UTG Open - 100bb Tournament',
  effectiveStack: 100,
  pot: 1.5,
  rangeIp: TexasSolverService.formatRangeForSolver([
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88',
    'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'AJo',
    'KQs', 'KQo', 'KJs', 'KJo',
    'QJs', 'QJo',
    'JTs'
  ]),
  rangeOop: 'AA,KK,QQ,JJ,TT,99,88,77,66,55,AKs,AKo,AQs,AQo',
  playerPosition: PlayerPosition.IP,
});
```

### Example: BTN vs CO Open

```typescript
const btn3betRange = await texasSolverService.solveScenario({
  name: 'BTN vs CO Open - 3-Bet Range',
  effectiveStack: 100,
  pot: 1.5,
  rangeIp: 'AA,KK,QQ,JJ,TT,99,88,77,66,55,AKs,AKo,AQs,AQo,AJs,AJo,ATs,ATo,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KQo,KJs,KJo,KTs,KTo,QJs,QJo,QTs,QTo,JTs,J9s,T9s,98s,87s,76s,65s,54s',
  rangeOop: 'AA,KK,QQ,JJ,TT,99,88,77,AKs,AKo,AQs,AQo,AJs,AJo,ATs,ATo,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KQo,KJs,KJo,KTs,KTo,QJs,QJo,QTs,QTo,JTs,J9s,T9s,98s,87s,76s,65s,54s',
  playerPosition: PlayerPosition.IP,
});
```

---

## Service API Reference

### `solveScenario(params)`

Main method to solve a scenario.

**Parameters:**
```typescript
{
  name: string;              // Scenario name
  effectiveStack: number;    // Stack depth in big blinds
  pot: number;               // Pot size in big blinds
  rangeIp: string;           // IP player's range (comma-separated)
  rangeOop: string;         // OOP player's range (comma-separated)
  playerPosition: PlayerPosition; // Which player's strategy to extract ('ip' | 'oop')
}
```

**Note:** Use `SolveScenarioDto` for type safety and validation. Import `PlayerPosition` enum for `playerPosition` field.

**Returns:** `Promise<Range>`

**Throws:** Error if solver execution fails or output parsing fails

### `formatRangeForSolver(hands: string[]): string`

Static helper to convert array of hands to comma-separated string.

**Example:**
```typescript
TexasSolverService.formatRangeForSolver(['AA', 'KK', 'AKs'])
// Returns: "AA,KK,AKs"
```

---

## Workflow

### Complete Flow

```
1. User/System calls solveScenario()
   ↓
2. generateConfigFile() creates .txt config file
   ↓
3. executeSolver() runs console_solver binary
   ├─> Executes: ./console_solver -i config.txt -r resources
   └─> Outputs: output_result.json
   ↓
4. parseAndTransform() reads JSON
   ├─> Finds root strategy node recursively
   ├─> Extracts strategy data
   └─> Transforms to Range schema
   ↓
5. Returns Range object
```

### Temporary Files

- Config files: `tmp/texas-solver/config-{timestamp}.txt`
- Output files: `tmp/texas-solver/output_result.json`

**Note:** Temp files are automatically cleaned up after solver execution in production environments. In development, files are kept for debugging purposes.

---

## Configuration

### Paths

Paths are resolved relative to backend root (`apps/backend/`):

```typescript
// From apps/backend/src/ranges/ -> go up 2 levels to apps/backend/
const backendRoot = path.resolve(__dirname, '../..');
this.solverBinary = path.join(backendRoot, 'tools/TexasSolver/console_solver');
this.resourcesDir = path.join(backendRoot, 'tools/TexasSolver/resources');
this.tempDir = path.join(backendRoot, 'tmp/texas-solver');
```

**Why Backend Root?**
- TexasSolver is backend-specific, so it lives within the backend service directory
- This ensures it's included in the Docker build context for production deployments
- Simpler path resolution using `__dirname` relative paths (matches NestJS patterns)

### System User for Reference Ranges

**Current Implementation:**
- Reference ranges created by `solveScenario()` use `userId: 'system'`
- This is a string literal, not a UUID from the users table

**Future Enhancement:**
- Create a system user seeded in all environments (dev, test, production)
- Use the system user's UUID instead of the string `'system'`
- Benefits:
  - Proper referential integrity with users table
  - Ability to query/join system ranges correctly
  - Consistent with user-owned ranges pattern

**Migration Path:**
- When implementing system user, create migration to update existing `userId: 'system'` entries
- Seed system user in all environments with consistent UUID
- Update `solveScenario()` to use system user UUID

**Note:** This enhancement is planned for Phase 2+ when scenarios are fully modeled.

### Solver Settings

Default settings (can be customized in `generateConfigFile`):

| Setting | Default | Description |
|---------|---------|-------------|
| `thread_num` | 8 | CPU threads |
| `accuracy` | 0.5 | Convergence threshold (lower = more accurate) |
| `max_iteration` | 200 | Max solver iterations |
| `use_isomorphism` | 1 | Use card isomorphism (faster) |
| `dump_rounds` | 1 | Preflop only (for MVP) |

---

## Troubleshooting

### Common Issues

#### 1. Binary Not Found

**Error:** `ENOENT: no such file or directory`

**Solution:**
- Verify `apps/backend/tools/TexasSolver/console_solver` exists
- Check file permissions: `chmod +x apps/backend/tools/TexasSolver/console_solver`
- For production, ensure Linux binary is downloaded

#### 2. Resources Directory Missing

**Error:** `Solver execution failed`

**Solution:**
- Verify `apps/backend/tools/TexasSolver/resources/` directory exists
- Check all subdirectories are present (compairer, gametree, etc.)

#### 3. Output File Not Generated

**Error:** `Output file not found at ...`

**Possible Causes:**
- Solver crashed or timed out
- Config file format error
- Insufficient memory/resources

**Debug:**
- Check `tmp/texas-solver/config-*.txt` for syntax errors
- Review solver stderr logs in service logs
- Try running solver manually: `./console_solver -i config.txt -r resources`

#### 4. JSON Parsing Failed

**Error:** `Could not find root strategy in solver output`

**Possible Causes:**
- JSON structure different than expected
- Wrong player ID (0 vs 1)
- Solver didn't complete successfully

**Debug:**
- Inspect `output_result.json` structure
- Check if `strategy` field exists at root or nested levels
- Verify player IDs match (IP = 0, OOP = 1)

#### 5. Timeout Errors

**Error:** `Solver execution failed: timeout`

**Solution:**
- Increase timeout in `executeSolver()` (default: 5 minutes)
- Reduce `max_iteration` or `accuracy` for faster solves
- Use simpler scenarios (fewer hands, fewer bet sizes)

---

## Limitations (Phase 0)

### Current Scope

- ✅ Post-flop scenarios (flop, turn, river) - **TexasSolver is designed for post-flop solving**
- ✅ Tournament format
- ✅ Fixed bet sizes
- ✅ Heads-up (2 players)

### Not Supported Yet

- ❌ Preflop scenarios - **TexasSolver does NOT solve preflop, only post-flop**
- ❌ Cash game format
- ❌ Multi-way scenarios (3+ players)
- ❌ Custom bet sizing per street
- ❌ EV/equity extraction (TexasSolver does not provide EV/equity in JSON output by default)

**Note on EV/Equity:**
After investigation, TexasSolver's JSON output only contains strategy frequencies, not Expected Value (EV) or equity calculations. The solver focuses on Nash Equilibrium strategy computation. 

**MVP Decision:** EV/equity will be omitted from MVP. Strategy frequencies are sufficient for range comparison and learning features.

**Future Enhancement (Post-MVP):** As noted in [GitHub Issue #202](https://github.com/bupticybee/TexasSolver/issues/202), since TexasSolver is open-source (AGPL v3), it's possible to modify the source code to include EV/equity data in the JSON output. CFR solvers typically calculate EV during the solving process as part of the algorithm, so this data may be available in memory but not currently exported.

**Approach for future EV/equity implementation:**
- Fork the TexasSolver repository
- Modify the JSON dump functions to include EV data
- Rebuild the binary
- Maintain your own fork (or submit PR back to upstream)
- See `docs/mvp-poker-calculator.md` for more context on this decision

### Future Enhancements

- Support post-flop scenarios
- Support multi-way scenarios
- Dynamic bet sizing configuration
- Progress callbacks for long solves
- **Modify TexasSolver source code to export EV/equity data** (post-MVP, see GitHub Issue #202)

---

## Performance Considerations

### Solve Time

Typical solve times (depends on scenario complexity):
- Simple preflop (tight ranges): 10-30 seconds
- Complex preflop (wide ranges): 30-120 seconds
- Very complex: 2-5 minutes

### Memory Usage

- Solver binary: ~3.3MB
- Resources: ~83MB
- Runtime memory: Varies with scenario complexity

### Optimization Tips

1. **Reduce Range Sizes**: Narrower ranges solve faster
2. **Lower Accuracy**: `set_accuracy 1.0` faster than `0.5`
3. **Fewer Iterations**: `set_max_iteration 100` vs `200`
4. **Use Isomorphism**: Always enabled (`set_use_isomorphism 1`)
5. **Parallel Solves**: Can run multiple solves concurrently (be careful with resources)

---

## Testing

### Manual Testing

1. Create a simple test scenario
2. Call `solveScenario()` with test parameters
3. Verify output Range structure
4. Check that hands are correctly transformed

### Test Scenario Example

```typescript
// Simple test: Pocket pairs only
const testRange = await texasSolverService.solveScenario({
  name: 'Test - Pocket Pairs',
  effectiveStack: 100,
  pot: 1.5,
  rangeIp: 'AA,KK,QQ,JJ',
  rangeOop: 'AA,KK,QQ,JJ,TT',
  playerPosition: 'ip',
});

console.log('Hands found:', testRange.handsRange.length);
console.log('First hand:', testRange.handsRange[0]);
```

---

## Next Steps (Phase 1+)

1. **Create Scenario Models**: Define `Scenario` schema from MVP spec
2. **Build Import Pipeline**: Import solved ranges into `ReferenceRange` collection
3. **API Endpoints**: Expose scenario solving via REST API
4. **Batch Processing**: Solve multiple scenarios automatically
5. **Caching**: Cache solved ranges to avoid re-solving

---

## References

- **TexasSolver GitHub**: https://github.com/bupticybee/TexasSolver
- **TexasSolver Documentation**: See `apps/backend/tools/TexasSolver/resources/text/` for examples
- **MVP Specification**: `docs/mvp-poker-calculator.md`
- **Service Code**: `apps/backend/src/ranges/services/texas-solver.service.ts`

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | Phase 0 | Initial implementation - Config generation, solver execution, JSON parsing |

