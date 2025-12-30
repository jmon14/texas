---
id: phase-3-5-range-comparison-fix
phase: 3.5
status: proposed
---

## Overview

**Description:**

Stabilize the range comparison outputs from Phase 3 by (1) treating hands with zero/empty actions as absent instead of frequency errors, and (2) making frequency error details actionable by reporting per-action differences instead of opaque totals.

**Deliverables:**

- Updated comparison algorithm that ignores empty hands/actions and classifies zero-frequency GTO hands as missing.
- Refined frequency error shape with per-action breakdowns in service, DTO, and persistence.
- Backward-compatible transformation/storage for existing attempts (or a migration plan).
- Tests covering empty/zero-action hands and per-action frequency reporting.

**Scope Boundary:**

**Included:**
- RangeComparisonService logic adjustments.
- Comparison result interface/DTO/schema shape for frequency errors.
- UserRangeAttemptsService transform logic and stored comparisonResult shape.
- Tests (unit + controller) updated for new behavior/shape.

**Excluded:**
- Frontend UI changes (Phase 4).
- Changes to unrelated scenario seeding or solver logic.

---

## Context

- Current behavior counts any labeled hand as present even if actions are empty/zero, producing frequency errors instead of missing. Extra hands also include empty hands that shouldn’t count.
- Stored frequencyErrors expose `userFrequency`, `gtoFrequency`, `difference` as totals, which do not convey per-action gaps and can mislead (e.g., AA shows 100/100 with a “difference” derived from max per-action delta).
- Desired: treat empty/zero-action hands as absent; provide per-action differences so consumers understand what is off.

---

## Plan

### Backend changes

- Adjust comparison algorithm to:
  - Skip user hands with no actions or total frequency 0.
  - Treat a GTO hand as missing when the user total frequency is 0 or actions array is empty.
  - Exclude empty/zero-frequency user hands from extra-hand reporting.
- Redefine frequency error payload to include per-action differences (e.g., array of `{ actionType, userFrequency, gtoFrequency, difference }` plus a max difference summary).
- Propagate shape changes through interfaces and controller DTOs.
- Handle backward compatibility for existing stored attempts (either via migration note or tolerant read/response mapping).

### Testing

- Add unit coverage for:
  - Empty/zero-action user hands → missing, not frequency error.
  - Extra-hand detection ignores empty/zero-frequency entries.
  - Frequency errors return per-action breakdown.
- Update controller tests to assert the new response shape.
- Add regression test for the reported sample scenario (user all-empty vs. populated GTO).

### Documentation

- Update OpenAPI DTO annotations for the new frequency error structure.
- Note behavior change in CHANGELOG (Phase 3.5) and emphasize the empty-hand handling rule.

---

## Tasks

### Task 1: Comparison logic fixes
**Files:** `apps/backend/src/scenarios/range-comparison.service.ts`, `apps/backend/src/scenarios/interfaces/comparison-result.interface.ts`, `apps/backend/src/scenarios/constants.ts` (if thresholds clarified)  
**Details:**
- Filter user hands with no actions or total frequency 0 from consideration.
- When iterating GTO hands, if user hand is missing or user total frequency 0, categorize as missing.
- When computing extra, ignore user hands with empty/zero actions; only include non-empty labels absent from GTO.
- Ensure compareActions returns both max difference and per-action diffs.

### Task 2: Frequency error shape & persistence
**Files:** `apps/backend/src/scenarios/interfaces/comparison-result.interface.ts`, `apps/backend/src/scenarios/dtos/comparison-result.dto.ts`, `apps/backend/src/scenarios/schemas/user-range-attempt.schema.ts`, `apps/backend/src/scenarios/user-range-attempts.service.ts`  
**Details:**
- Redefine frequency error item to include an actions array: `{ hand, actions: [{ type, userFrequency, gtoFrequency, difference }], maxDifference }`.
- Update DTOs and schema transform to persist the new structure (or transform old records when reading/responding).
- Consider adding a lightweight response mapper that tolerates legacy shape for existing attempts.

### Task 3: Tests
**Files:** `apps/backend/src/scenarios/__tests__/range-comparison.service.spec.ts`, `apps/backend/src/scenarios/__tests__/user-range-attempts.controller.spec.ts` (and related)  
**Details:**
- Add cases: empty user actions → missing; extra ignores empty; per-action diffs asserted.
- Add regression for the provided sample (user empty vs. GTO populated) expecting many missing, no frequency errors for empty hands, and accuracy 0 accordingly.
- Update controller tests to assert the new frequency error schema.

### Task 4: Documentation
**Files:** `apps/backend/src/scenarios/user-range-attempts.controller.ts`, `CHANGELOG.md`  
**Details:**
- Update Swagger DTOs to document the new frequency error shape.
- Add Phase 3.5 changelog entry summarizing empty-hand handling and per-action frequency reporting.

---

## Notes/Decisions

- Empty or zero-frequency user hands are treated as absent (count as missing if in GTO; ignored for extras).
- Frequency error reporting moves to per-action breakdown plus max difference; legacy totals are deprecated. If migration is deferred, response mapping should still serve legacy records gracefully.
- Accuracy calculation remains: correct / total GTO hands; missing vs. frequency error counts adjust with the new rules.

