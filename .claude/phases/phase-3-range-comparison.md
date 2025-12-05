---
id: phase-3-range-comparison
phase: 3
status: completed
---

## Overview

**Description:**

Build the backend comparison engine that analyzes user ranges against GTO reference ranges. This phase implements the core comparison algorithm, API endpoints for comparing ranges and retrieving attempt history, and services for managing user range attempts.

**Deliverables:**

- RangeComparisonService with comparison algorithm
- UserRangeAttemptsService for attempt persistence
- POST /user-range-attempts/compare endpoint
- GET /user-range-attempts/user/:userId/scenario/:scenarioId endpoint
- Comprehensive test coverage for comparison logic and endpoints

**Scope Boundary:**

**Included:**
- Backend comparison algorithm and services
- API endpoints for comparison and attempt retrieval
- DTOs for request/response payloads
- Database operations for saving attempts
- OpenAPI documentation for new endpoints
- Unit and integration tests

**Excluded:**
- Frontend UI components (Phase 4)
- Real-time comparison features
- Advanced analytics or insights
- Comparison against non-GTO ranges

---

## Context

### Current State

**Phase 2 Completed:**
- ReferenceRange schema exists at `apps/backend/src/scenarios/schemas/reference-range.schema.ts`
- Reference range API endpoints available: `GET /reference-ranges/scenario/:scenarioId`
- Reference ranges can be imported and retrieved for scenarios

**Existing Infrastructure:**
- UserRangeAttempt schema exists at `apps/backend/src/scenarios/schemas/user-range-attempt.schema.ts`
  - Fields: userId, scenarioId, rangeId (ObjectId reference), comparisonResult, attemptNumber
  - Schema registered in ScenariosModule
- Range schema exists at `apps/backend/src/ranges/schemas/range.schema.ts`
- RangesService exists for CRUD operations on user ranges
- ScenariosModule configured with Mongoose models

**Data Flow:**
- User builds range → Saves to ranges collection → Compares (creates UserRangeAttempt with rangeId reference)
- UserRangeAttempt stores a reference to Range via rangeId, not duplicate data
- Comparison results cached in UserRangeAttempt.comparisonResult

### Requirements

1. Implement comparison algorithm that categorizes hands as correct, missing, extra, or frequency error
2. Compare user range actions against GTO reference range actions
3. Use 5% frequency threshold to determine correct vs frequency error
4. Calculate accuracy score as (correctHands / totalGtoHands) * 100
5. Generate feedback reasons for missing and extra hands
6. Save comparison results as UserRangeAttempt with auto-incrementing attempt number
7. Expose POST endpoint for comparing ranges
8. Expose GET endpoint for retrieving attempt history by user and scenario
9. Authenticate all endpoints with JWT
10. Validate user ownership of ranges before comparison
11. Document all endpoints with OpenAPI/Swagger annotations

---

## AgentPlan

### backend-architect

- [x] Implement RangeComparisonService with comparison algorithm
- [x] Implement UserRangeAttemptsService for attempt CRUD operations
- [x] Create UserRangeAttemptsController with compare endpoint
- [x] Add attempt history GET endpoint to UserRangeAttemptsController
- [x] Create DTOs for comparison requests and responses
- [x] Update ScenariosModule to register new services and controller

### test-automator

- [x] Write unit tests for RangeComparisonService
- [x] Write unit tests for UserRangeAttemptsService
- [x] Write controller tests for compare endpoint
- [x] Write controller tests for attempt history endpoint
- [x] Write integration tests for full comparison flow

### documentation-expert

- [x] Add OpenAPI documentation for POST /user-range-attempts/compare
- [x] Add OpenAPI documentation for GET /user-range-attempts/user/:userId/scenario/:scenarioId
- [x] Update CHANGELOG with Phase 3 completion

---

## Tasks

### Task 1: Implement RangeComparisonService

**Agent:** backend-architect

**Files Affected:**
- apps/backend/src/scenarios/range-comparison.service.ts (new)
- apps/backend/src/scenarios/scenarios.module.ts

**Requirements:**

- Create RangeComparisonService injectable class
- Inject ReferenceRangesService and RangesService dependencies
- Implement compareRanges(scenarioId, userRangeId) method
- Load reference range and user range from respective services
- Implement compareRangeData private method to categorize hands
- Categorize hands as correct (within 5% frequency threshold), missing (in GTO but not user), extra (in user but not GTO), or frequency error (in both but frequency difference > 5%)
- Implement compareActions private method to calculate frequency differences per action type
- Calculate accuracy score as (correctHands / totalGtoHands) * 100
- Generate static feedback reasons: "Included in GTO range" for missing, "Not in GTO range" for extra
- Return ComparisonResult object with accuracyScore, handsByCategory, overallFeedback
- Use FREQUENCY_THRESHOLD constant set to 5
- Handle NotFoundException for missing reference range or user range

**Acceptance Criteria:**

- [x] RangeComparisonService correctly categorizes hands into four categories
- [x] Frequency threshold logic correctly identifies correct vs frequency error hands
- [x] Accuracy score calculation matches specification
- [x] Service handles missing reference range or user range errors
- [x] Service registered in ScenariosModule providers

---

### Task 2: Implement UserRangeAttemptsService

**Agent:** backend-architect

**Files Affected:**
- apps/backend/src/scenarios/user-range-attempts.service.ts (new)
- apps/backend/src/scenarios/scenarios.module.ts

**Requirements:**

- Create UserRangeAttemptsService injectable class
- Inject UserRangeAttempt Mongoose model
- Implement createAttempt(userId, scenarioId, rangeId, comparisonResult) method
- Calculate attemptNumber by counting existing attempts for user/scenario and incrementing
- Save UserRangeAttempt document with userId, scenarioId, rangeId reference, comparisonResult, attemptNumber
- Implement findByUserAndScenario(userId, scenarioId) method
- Sort attempts by attemptNumber ascending
- Implement private getAttemptNumber(userId, scenarioId) helper method

**Acceptance Criteria:**

- [x] UserRangeAttemptsService creates attempts with correct attemptNumber
- [x] createAttempt saves document to database successfully
- [x] findByUserAndScenario returns attempts sorted by attemptNumber
- [x] attemptNumber increments correctly for multiple attempts
- [x] Service registered in ScenariosModule providers

---

### Task 3: Create Comparison API Endpoint

**Agent:** backend-architect

**Files Affected:**
- apps/backend/src/scenarios/user-range-attempts.controller.ts (new)
- apps/backend/src/scenarios/dtos/compare-ranges.dto.ts (new)
- apps/backend/src/scenarios/dtos/comparison-result.dto.ts (new)
- apps/backend/src/scenarios/scenarios.module.ts

**Requirements:**

- Create UserRangeAttemptsController with @Controller('user-range-attempts')
- Add @UseGuards(JwtAuthGuard) and @ApiBearerAuth() decorators
- Inject RangeComparisonService, UserRangeAttemptsService, RangesService
- Implement POST /compare endpoint
- Accept CompareRangesDto with scenarioId and userRangeId
- Extract userId from JWT request object
- Verify user owns the range via RangesService.findById
- Throw NotFoundException if range not found or userId mismatch
- Call RangeComparisonService.compareRanges
- Save attempt via UserRangeAttemptsService.createAttempt
- Return ComparisonResultDto including attemptId and attemptNumber
- Create CompareRangesDto with validation decorators (@IsString, @IsNotEmpty)
- Create ComparisonResultDto matching ComparisonResult interface
- Register controller in ScenariosModule controllers array

**Acceptance Criteria:**

- [x] POST /user-range-attempts/compare endpoint accepts scenarioId and userRangeId
- [x] Endpoint requires JWT authentication
- [x] Endpoint validates user owns the range before comparison
- [x] Endpoint returns comparison results with attemptId and attemptNumber
- [x] Endpoint handles errors for missing scenario, range, or reference range
- [x] DTOs have proper validation decorators
- [x] Controller registered in ScenariosModule

---

### Task 4: Create Attempt History API Endpoint

**Agent:** backend-architect

**Files Affected:**
- apps/backend/src/scenarios/user-range-attempts.controller.ts
- apps/backend/src/scenarios/dtos/user-range-attempt-response.dto.ts (new)

**Requirements:**

- Add GET /user/:userId/scenario/:scenarioId endpoint to UserRangeAttemptsController
- Use @Param decorators for userId and scenarioId
- Require JWT authentication
- Extract authenticated userId from request object
- Verify authenticated userId matches route userId parameter
- Throw ForbiddenException if userId mismatch
- Call UserRangeAttemptsService.findByUserAndScenario
- Map attempts to UserRangeAttemptResponseDto
- Create UserRangeAttemptResponseDto with _id, userId, scenarioId, rangeId, comparisonResult, attemptNumber, createdAt, updatedAt

**Acceptance Criteria:**

- [x] GET /user-range-attempts/user/:userId/scenario/:scenarioId returns attempt history
- [x] Endpoint requires JWT authentication
- [x] Endpoint validates user can only access own attempts
- [x] Attempts returned sorted by attemptNumber ascending
- [x] UserRangeAttemptResponseDto includes all necessary fields

---

### Task 5: Write Unit Tests for RangeComparisonService

**Agent:** test-automator

**Files Affected:**
- apps/backend/src/scenarios/range-comparison.service.spec.ts (new)

**Requirements:**

- Write unit tests for compareRanges method
- Test correct hands detection (within 5% frequency threshold)
- Test missing hands detection (in GTO but not user)
- Test extra hands detection (in user but not GTO)
- Test frequency error detection (in both but difference > 5%)
- Test accuracy score calculation
- Test edge cases: empty ranges, perfect match, no matches
- Mock ReferenceRangesService and RangesService
- Test NotFoundException for missing reference range
- Test NotFoundException for missing user range

**Acceptance Criteria:**

- [x] All comparison algorithm tests pass
- [x] Edge cases covered with tests
- [x] Mocks properly configured
- [x] Test coverage meets project standards

---

### Task 6: Write Unit Tests for UserRangeAttemptsService

**Agent:** test-automator

**Files Affected:**
- apps/backend/src/scenarios/user-range-attempts.service.spec.ts (new)

**Requirements:**

- Write unit tests for createAttempt method
- Write unit tests for findByUserAndScenario method
- Test attemptNumber calculation with no existing attempts
- Test attemptNumber increments correctly with existing attempts
- Test sorting by attemptNumber ascending
- Mock UserRangeAttempt Mongoose model

**Acceptance Criteria:**

- [x] All service method tests pass
- [x] attemptNumber logic validated with tests
- [x] Sorting behavior tested
- [x] Mocks properly configured

---

### Task 7: Write Controller Tests for Comparison Endpoint

**Agent:** test-automator

**Files Affected:**
- apps/backend/src/scenarios/user-range-attempts.controller.spec.ts (new)

**Requirements:**

- Write controller tests for POST /user-range-attempts/compare
- Test successful comparison with valid inputs
- Test authentication requirement (401 without JWT)
- Test authorization (404 when user doesn't own range)
- Test error handling for missing scenario
- Test error handling for missing reference range
- Test error handling for missing user range
- Mock RangeComparisonService, UserRangeAttemptsService, RangesService
- Verify attempt is saved after comparison
- Verify response includes attemptId and attemptNumber

**Acceptance Criteria:**

- [x] All controller tests pass
- [x] Authentication and authorization tested
- [x] Error scenarios covered
- [x] Mocks properly configured

---

### Task 8: Write Controller Tests for Attempt History Endpoint

**Agent:** test-automator

**Files Affected:**
- apps/backend/src/scenarios/user-range-attempts.controller.spec.ts

**Requirements:**

- Write controller tests for GET /user-range-attempts/user/:userId/scenario/:scenarioId
- Test successful retrieval of attempt history
- Test authentication requirement (401 without JWT)
- Test authorization (403 when userId doesn't match authenticated user)
- Test empty array returned when no attempts exist
- Verify attempts sorted by attemptNumber
- Mock UserRangeAttemptsService

**Acceptance Criteria:**

- [x] All history endpoint tests pass
- [x] Authentication and authorization tested
- [x] Empty result scenario tested
- [x] Mocks properly configured

---

### Task 9: Write Integration Tests for Comparison Flow

**Agent:** test-automator

**Files Affected:**
- apps/backend/src/scenarios/user-range-attempts.integration.spec.ts (new)

**Requirements:**

- Write integration tests for full comparison flow
- Test end-to-end: create range, compare, retrieve attempt history
- Use test database for integration tests
- Test with real Mongoose models (no mocking services)
- Verify UserRangeAttempt documents saved correctly
- Test multiple attempts increment attemptNumber correctly
- Test comparison results structure matches specification

**Acceptance Criteria:**

- [x] Integration tests cover full comparison workflow
- [x] Tests use real database and models
- [x] Multiple attempt scenarios tested
- [x] All integration tests pass (requires MongoDB connection)

---

### Task 10: Add OpenAPI Documentation

**Agent:** documentation-expert

**Files Affected:**
- apps/backend/src/scenarios/user-range-attempts.controller.ts

**Requirements:**

- Add @ApiTags('user-range-attempts') to controller
- Add @ApiOperation to POST /compare endpoint with summary and description
- Add @ApiResponse decorators for 200, 404, 401, 403 status codes to POST endpoint
- Add @ApiOperation to GET history endpoint with summary and description
- Add @ApiParam decorators for userId and scenarioId parameters
- Add @ApiResponse decorators for 200, 401, 403 status codes to GET endpoint
- Ensure DTOs have @ApiProperty decorators on all fields
- Verify OpenAPI spec generates correctly

**Acceptance Criteria:**

- [x] OpenAPI documentation complete for both endpoints
- [x] All DTOs documented with @ApiProperty
- [x] Swagger UI displays endpoints correctly
- [x] Response types properly documented

---

### Task 11: Update CHANGELOG

**Agent:** documentation-expert

**Files Affected:**
- CHANGELOG.md

**Requirements:**

- Add Phase 3 section to CHANGELOG
- Document new RangeComparisonService
- Document new UserRangeAttemptsService
- Document new POST /user-range-attempts/compare endpoint
- Document new GET /user-range-attempts/user/:userId/scenario/:scenarioId endpoint
- Note frequency threshold of 5%
- Note accuracy score calculation method

**Acceptance Criteria:**

- [x] CHANGELOG updated with Phase 3 completion
- [x] All new services and endpoints documented
- [x] Technical details included (threshold, accuracy formula)

---

## ProgressLog

- 2025-01-XX - backend-architect - Implemented RangeComparisonService with comparison algorithm
  - Files modified: apps/backend/src/scenarios/range-comparison.service.ts, apps/backend/src/scenarios/scenarios.module.ts

- 2025-01-XX - test-automator - Wrote unit tests for RangeComparisonService
  - Files modified: apps/backend/src/scenarios/range-comparison.service.spec.ts

- 2025-01-XX - backend-architect - Implemented UserRangeAttemptsService and UserRangeAttemptsController
  - Files modified: apps/backend/src/scenarios/user-range-attempts.service.ts, apps/backend/src/scenarios/user-range-attempts.controller.ts, apps/backend/src/scenarios/scenarios.module.ts

- 2025-01-XX - backend-architect - Created comparison DTOs
  - Files modified: apps/backend/src/scenarios/dtos/compare-ranges.dto.ts, apps/backend/src/scenarios/dtos/comparison-result.dto.ts, apps/backend/src/scenarios/dtos/user-range-attempt-response.dto.ts, apps/backend/src/scenarios/dtos/index.ts

- 2025-01-XX - test-automator - Wrote unit tests for UserRangeAttemptsService
  - Files modified: apps/backend/src/scenarios/__tests__/user-range-attempts.service.spec.ts

- 2025-01-XX - test-automator - Wrote controller tests for comparison endpoints
  - Files modified: apps/backend/src/scenarios/__tests__/user-range-attempts.controller.spec.ts

- 2025-01-XX - test-automator - Wrote integration tests for comparison flow
  - Files modified: apps/backend/src/scenarios/__tests__/user-range-attempts.integration.spec.ts

- 2025-01-XX - documentation-expert - Added OpenAPI documentation and updated CHANGELOG
  - Files modified: apps/backend/src/scenarios/user-range-attempts.controller.ts, CHANGELOG.md

- 2025-01-XX - backend-architect - Fixed TypeScript strictness and lint compliance
  - Files modified: apps/backend/src/scenarios/user-range-attempts.controller.ts, apps/backend/src/scenarios/__tests__/user-range-attempts.service.spec.ts, apps/backend/src/scenarios/__tests__/user-range-attempts.controller.spec.ts
  - Replaced `any` types with proper TypeScript types, fixed lint errors

---

## Notes/Decisions

**API Design Decision:**
- Sequential two-step flow: Frontend calls POST /ranges to create range (get rangeId), then calls POST /user-range-attempts/compare with rangeId + scenarioId
- Rationale: Follows REST principles, single-responsibility endpoints, more flexible (ranges exist independently), easier to test and maintain
- Alternative considered: Bulk endpoint (create range + attempt in one call) - rejected due to coupling and REST violation

**Frequency Threshold:**
- Default: 5% difference threshold (FREQUENCY_THRESHOLD = 5)
- Hands with frequency difference ≤ 5% categorized as "correct"
- Hands with frequency difference > 5% categorized as "frequency error"
- Configurable in future phases if needed

**Action Comparison Logic:**
- Actions compared by type (FOLD, CALL, RAISE, CHECK)
- Frequencies summed per action type
- Maximum frequency difference across all action types determines category
- Mixed strategies supported (multiple actions with frequencies)

**Data Architecture:**
- UserRangeAttempt stores reference to Range via rangeId, not duplicate range data
- Range must exist in ranges collection before creating attempt
- Comparison results cached in UserRangeAttempt.comparisonResult for performance

**Scope Constraint:**
- Phase 3 is backend-only
- Frontend UI for comparison results deferred to Phase 4
- Focus on API correctness and test coverage

**Future Consideration (Phase 4):**
- Combine scenario practice flow so users see scenario details while building range
- Automatically link range to scenario when saving from practice flow
