---
id: phase-4-scenario-practice-ui
phase: 4
status: planning
---

## Overview

**Description:**

Build the complete frontend user flow for scenario practice, from scenario selection through range building to comparison feedback visualization. This phase implements the UI components for displaying comparison results with color-coded range grids, detailed feedback panels, and accuracy scoring, as well as the container components that orchestrate the practice flow including retry and progression features.

**Deliverables:**

- ComparisonView component with HandDiffGrid, FeedbackPanel, and AccuracyScore subcomponents
- ScenarioPractice component integrating scenario selection, range building, and comparison flow
- Color-coded range grid with legend (correct, missing, extra, frequency error indicators)
- "Try Again" and "Next Scenario" navigation flows
- Loading states for async operations
- Component tests and E2E tests for practice flow

**Scope Boundary:**

**Included:**
- Frontend UI components for comparison results visualization
- Frontend container components for practice flow orchestration
- Integration with existing range builder components
- API integration with comparison and attempt history endpoints from Phase 3
- Client-side state management for practice flow
- Component unit tests
- E2E tests for complete user journey
- Visual feedback system with color indicators

**Excluded:**
- Backend comparison logic (completed in Phase 3)
- Advanced analytics or insights beyond basic accuracy score
- Real-time collaborative features
- Alternative comparison modes (non-GTO ranges)
- Scenario creation or management UI
- Save Progress/local persistence (deferred; tracked via ClickUp 869bdcjub)

---

## Context

### Current State

**Phase 3 Completed:**
- POST /user-range-attempts/compare endpoint available for range comparison
- GET /user-range-attempts/user/:userId/scenario/:scenarioId endpoint for attempt history
- ComparisonResult interface defined with accuracyScore, handsByCategory, overallFeedback
- Backend returns hands categorized as: correct, missing, extra, frequencyError
- Accuracy score calculation: (correctHands / totalGtoHands) * 100

**Existing Frontend Infrastructure:**
- Range builder components exist and are functional
- Redux store with range-slice for state management
- API integration layer with generated OpenAPI client
- Scenario selection components available
- Authentication with JWT tokens implemented
- React + TypeScript setup with testing infrastructure

**Data Flow:**
- User selects scenario → builds range → submits for comparison
- Frontend calls POST /user-range-attempts/compare with scenarioId + userRangeId
- Backend returns ComparisonResult with categorized hands and accuracy score
- Frontend displays results with color-coded grid and detailed feedback
- User can retry same scenario or progress to next scenario

### Requirements

1. Create ComparisonView component as main container for displaying comparison results
2. Create HandDiffGrid component to display 13x13 poker hand grid with color-coded indicators
3. Implement color coding: 🟢 correct, 🔴 missing, 🟡 extra, 🟠 frequency error, ⚪ not in range
4. Create FeedbackPanel component for detailed explanations of errors and suggestions
5. Create AccuracyScore component showing progress indicator for score visualization
6. Implement legend explaining color meanings
7. Create ScenarioPractice component as main container for practice flow
8. Integrate scenario selection, range building, and comparison into cohesive flow
9. Implement "Try Again" functionality (retry same scenario with fresh range)
10. Implement "Next Scenario" functionality (progress to next scenario)
11. Update frontend API client (OpenAPI/SDK layer) to call Phase 3 endpoints: POST /user-range-attempts/compare and GET /user-range-attempts/user/:userId/scenario/:scenarioId
12. Handle loading states during API calls (comparison, scenario loading)
13. Write component tests for all new components
14. Write E2E tests for complete practice flow using Playwright

---

## AgentPlan

### frontend-developer

- [ ] Create ComparisonView component structure and layout
- [ ] Implement HandDiffGrid component with 13x13 grid and color logic
- [ ] Implement FeedbackPanel component for detailed feedback display
- [ ] Implement AccuracyScore component with progress visualization
- [ ] Create color legend component
- [ ] Create ScenarioPractice component structure and flow orchestration
- [ ] Integrate range builder with scenario practice flow
- [ ] Implement "Try Again" flow logic
- [ ] Implement "Next Scenario" flow logic
- [ ] Update frontend API client/SDK to call POST /user-range-attempts/compare and GET /user-range-attempts/user/:userId/scenario/:scenarioId and expose hooks/services for ScenarioPractice
- [ ] Add loading states and error handling
- [ ] Connect components to comparison API endpoints
- [ ] Update Redux state management for practice flow

### test-automator

- [ ] Write unit tests for ComparisonView component
- [ ] Write unit tests for HandDiffGrid component
- [ ] Write unit tests for FeedbackPanel component
- [ ] Write unit tests for AccuracyScore component
- [ ] Write unit tests for ScenarioPractice component
- [ ] Write E2E tests for complete scenario practice flow
- [ ] Write E2E tests for "Try Again" flow
- [ ] Write E2E tests for "Next Scenario" flow
- [ ] Test loading states and error scenarios

### documentation-expert

- [ ] Update CHANGELOG with Phase 4 completion
- [ ] Document component props and usage patterns
- [ ] Update user flow documentation if needed

---

## Tasks

### Task 1: Create ComparisonView Component

**Agent:** frontend-developer

**Files Affected:**
- apps/frontend/src/components/ComparisonView/ComparisonView.tsx (new)
- apps/frontend/src/components/ComparisonView/ComparisonView.module.css (new)
- apps/frontend/src/components/ComparisonView/index.ts (new)

**Requirements:**

- Create ComparisonView functional component accepting ComparisonResult prop
- Design responsive layout container for comparison results
- Include HandDiffGrid, FeedbackPanel, and AccuracyScore as child components
- Pass categorized hands data to HandDiffGrid
- Pass feedback data to FeedbackPanel
- Pass accuracy score to AccuracyScore component
- Style with CSS modules for scoped styling
- Ensure proper TypeScript typing for all props

**Acceptance Criteria:**

- [ ] ComparisonView renders all child components correctly
- [ ] Layout is responsive and visually appealing
- [ ] Props properly typed with TypeScript
- [ ] CSS modules applied without style conflicts

---

### Task 2: Implement HandDiffGrid Component

**Agent:** frontend-developer

**Files Affected:**
- apps/frontend/src/components/ComparisonView/HandDiffGrid.tsx (new)
- apps/frontend/src/components/ComparisonView/HandDiffGrid.module.css (new)

**Requirements:**

- Create HandDiffGrid component rendering 13x13 poker hand matrix
- Display hand labels (AA, AKs, AKo, KK, etc.) in grid cells
- Accept handsByCategory prop with correct, missing, extra, frequencyError arrays
- Implement color logic:
  - 🟢 Green for correct hands (within 5% frequency threshold)
  - 🔴 Red for missing hands (in GTO but not user)
  - 🟡 Yellow for extra hands (in user but not GTO)
  - 🟠 Orange for frequency error hands (in both but frequency difference > 5%)
  - ⚪ White/neutral for hands not in either range
- Add hover tooltips showing hand category and frequency details
- Ensure grid is responsive and maintains aspect ratio
- Style cells with appropriate colors and borders

**Acceptance Criteria:**

- [ ] Grid displays all 169 poker hands correctly
- [ ] Color coding matches specification for all categories
- [ ] Hover tooltips provide detailed information
- [ ] Grid is responsive across screen sizes
- [ ] Component properly typed with TypeScript

---

### Task 3: Create FeedbackPanel Component

**Agent:** frontend-developer

**Files Affected:**
- apps/frontend/src/components/ComparisonView/FeedbackPanel.tsx (new)
- apps/frontend/src/components/ComparisonView/FeedbackPanel.module.css (new)

**Requirements:**

- Create FeedbackPanel component for displaying detailed feedback
- Accept overallFeedback and handsByCategory props
- Display summary of errors: count of missing, extra, and frequency error hands
- List specific hands in each error category
- Show feedback reasons for missing hands ("Included in GTO range")
- Show feedback reasons for extra hands ("Not in GTO range")
- Organize feedback by priority: missing > extra > frequency errors
- Style with clear visual hierarchy and readability
- Support expandable/collapsible sections for detailed hand lists

**Acceptance Criteria:**

- [ ] Feedback displays error counts accurately
- [ ] Hands listed in appropriate error categories
- [ ] Feedback reasons displayed clearly
- [ ] Visual hierarchy guides user attention
- [ ] Component properly typed with TypeScript

---

### Task 4: Implement AccuracyScore Component

**Agent:** frontend-developer

**Files Affected:**
- apps/frontend/src/components/ComparisonView/AccuracyScore.tsx (new)
- apps/frontend/src/components/ComparisonView/AccuracyScore.module.css (new)

**Requirements:**

- Create AccuracyScore component accepting accuracyScore prop (0-100)
- Display score as percentage with visual progress indicator
- Implement circular or linear progress bar showing score
- Add color coding: green (>80%), yellow (60-80%), red (<60%)
- Display congratulatory message for high scores
- Display improvement suggestions for low scores
- Animate progress bar on component mount
- Style with clear typography and visual appeal

**Acceptance Criteria:**

- [ ] Score displays as percentage correctly
- [ ] Progress indicator reflects score visually
- [ ] Color coding matches score ranges
- [ ] Animation enhances user experience
- [ ] Component properly typed with TypeScript

---

### Task 5: Create Color Legend Component

**Agent:** frontend-developer

**Files Affected:**
- apps/frontend/src/components/ComparisonView/ColorLegend.tsx (new)
- apps/frontend/src/components/ComparisonView/ColorLegend.module.css (new)

**Requirements:**

- Create ColorLegend component explaining color meanings
- Display legend items for: correct (🟢), missing (🔴), extra (🟡), frequency error (🟠), not in range (⚪)
- Include short description for each category
- Position legend near HandDiffGrid for easy reference
- Style with clear icons and text
- Support both horizontal and vertical layout modes

**Acceptance Criteria:**

- [ ] Legend displays all five categories
- [ ] Colors match HandDiffGrid implementation
- [ ] Descriptions are clear and concise
- [ ] Layout options work correctly
- [ ] Component properly typed with TypeScript

---

### Task 6: Create ScenarioPractice Component

**Agent:** frontend-developer

**Files Affected:**
- apps/frontend/src/components/ScenarioPractice/ScenarioPractice.tsx (new)
- apps/frontend/src/components/ScenarioPractice/ScenarioPractice.module.css (new)
- apps/frontend/src/components/ScenarioPractice/index.ts (new)

**Requirements:**

- Create ScenarioPractice component as main container for practice flow
- Manage state for: currentScenario, currentRange, comparisonResult, isLoading
- Implement step-based flow: scenario selection → range building → comparison results
- Display scenario details while user builds range
- Integrate existing range builder component
- Update frontend API client/SDK to use POST /user-range-attempts/compare and GET /user-range-attempts/user/:userId/scenario/:scenarioId (Phase 3), and connect ScenarioPractice to these calls
- Display ComparisonView when comparison results received
- Add "Try Again" button to reset range and retry same scenario
- Add "Next Scenario" button to progress to next scenario
- Handle loading states during API calls
- Handle error states with user-friendly messages

**Acceptance Criteria:**

- [ ] Flow progresses through all steps correctly
- [ ] Range builder integration works seamlessly
- [ ] API integration calls comparison endpoint correctly
- [ ] ComparisonView displays results properly
- [ ] "Try Again" resets range while keeping scenario
- [ ] "Next Scenario" loads next scenario and resets range
- [ ] Frontend API client/SDK updated to Phase 3 endpoints and consumed in ScenarioPractice
- [ ] Loading and error states handled gracefully
- [ ] Component properly typed with TypeScript

---

### Task 7: Implement Flow Navigation Logic

**Agent:** frontend-developer

**Files Affected:**
- apps/frontend/src/components/ScenarioPractice/ScenarioPractice.tsx
- apps/frontend/src/store/slices/practice-slice.ts (new)

**Requirements:**

- Create practice-slice in Redux for practice flow state management
- Implement "Try Again" logic:
  - Clear current range
  - Keep same scenario
  - Reset comparison results
  - Return to range building step
- Implement "Next Scenario" logic:
  - Load next scenario from scenario list
  - Clear current range
  - Reset comparison results
  - Return to range building step
- Handle edge cases: last scenario reached, no scenarios available

**Acceptance Criteria:**

- [ ] "Try Again" flow works correctly
- [ ] "Next Scenario" flow works correctly
- [ ] Edge cases handled with appropriate messaging
- [ ] Redux state management follows project patterns
- [ ] TypeScript types properly defined

---

### Task 8: Add Loading States and Error Handling

**Agent:** frontend-developer

**Files Affected:**
- apps/frontend/src/components/ScenarioPractice/ScenarioPractice.tsx
- apps/frontend/src/components/ScenarioPractice/LoadingSpinner.tsx (new)
- apps/frontend/src/components/ScenarioPractice/ErrorMessage.tsx (new)

**Requirements:**

- Create LoadingSpinner component for async operations
- Create ErrorMessage component for error display
- Show loading spinner during:
  - Scenario loading
  - Range comparison API call
  - Scenario list fetching
- Handle errors for:
  - Network failures
  - API errors (404, 500, etc.)
  - Invalid comparison results
  - Missing scenario data
- Display user-friendly error messages
- Provide retry mechanism for failed operations
- Ensure loading states don't block UI unnecessarily

**Acceptance Criteria:**

- [ ] Loading spinner appears during async operations
- [ ] Error messages display user-friendly text
- [ ] Retry mechanism works for failed operations
- [ ] UI remains responsive during loading
- [ ] All error scenarios handled gracefully
- [ ] Components properly typed with TypeScript

---

### Task 9: Write Component Unit Tests

**Agent:** test-automator

**Files Affected:**
- apps/frontend/src/components/ComparisonView/ComparisonView.test.tsx (new)
- apps/frontend/src/components/ComparisonView/HandDiffGrid.test.tsx (new)
- apps/frontend/src/components/ComparisonView/FeedbackPanel.test.tsx (new)
- apps/frontend/src/components/ComparisonView/AccuracyScore.test.tsx (new)
- apps/frontend/src/components/ScenarioPractice/ScenarioPractice.test.tsx (new)

**Requirements:**

- Write unit tests for ComparisonView rendering and prop passing
- Write unit tests for HandDiffGrid color logic and grid rendering
- Write unit tests for FeedbackPanel feedback display and categorization
- Write unit tests for AccuracyScore score display and color coding
- Write unit tests for ScenarioPractice flow logic and state management
- Mock API calls and Redux store
- Test loading states, error states, and success states
- Test user interactions: button clicks, navigation
- Achieve >80% code coverage for new components

**Acceptance Criteria:**

- [ ] All component tests pass
- [ ] Color logic tested thoroughly
- [ ] Flow navigation tested
- [ ] API mocking works correctly
- [ ] Code coverage meets project standards (>80%)
- [ ] Tests follow project testing patterns

---

### Task 10: Write E2E Tests for Practice Flow

**Agent:** test-automator

**Files Affected:**
- apps/frontend/tests/e2e/scenario-practice.spec.ts (new)

**Requirements:**

- Write E2E test for complete practice flow:
  - User logs in
  - User selects scenario
  - User builds range
  - User submits for comparison
  - Comparison results display correctly
  - User clicks "Try Again" and flow resets
- Write E2E test for "Next Scenario" flow:
  - User completes comparison
  - User clicks "Next Scenario"
  - New scenario loads
  - Range resets
- Test error scenarios: network failure, invalid scenario
- Use Playwright for E2E testing

**Acceptance Criteria:**

- [ ] E2E tests cover complete user journey
- [ ] "Try Again" flow tested end-to-end
- [ ] "Next Scenario" flow tested end-to-end
- [ ] Error scenarios tested
- [ ] All E2E tests pass consistently
- [ ] Tests use proper selectors and assertions

---

### Task 11: Update CHANGELOG

**Agent:** documentation-expert

**Files Affected:**
- CHANGELOG.md

**Requirements:**

- Add Phase 4 section to CHANGELOG
- Document new ComparisonView component and subcomponents
- Document new ScenarioPractice component
- Document color-coded range grid feature
- Document "Try Again" and "Next Scenario" features
- Note integration with Phase 3 comparison API
- Note E2E test coverage

**Acceptance Criteria:**

- [ ] CHANGELOG updated with Phase 4 completion
- [ ] All new components documented
- [ ] New features and flows documented
- [ ] Technical integration details included

---

## ProgressLog

- 2025-12-06 - orchestrator - Created Phase 4 phase file from ClickUp tasks
  - Files created: .claude/phases/phase-4.md
  - Source: ClickUp tasks 869b0v5k1 (Build Scenario Practice Flow) and 869b0v5j7 (Build Comparison View Components)

---

## Notes/Decisions

**Frontend Architecture:**
- React functional components with hooks for state management
- CSS modules for component styling to avoid global style conflicts
- Redux for global state management (practice flow state)
- Component composition: ComparisonView and ScenarioPractice as containers

**Color Coding System:**
- 🟢 Green: Correct hands (within 5% frequency threshold)
- 🔴 Red: Missing hands (in GTO but not user)
- 🟡 Yellow: Extra hands (in user but not GTO)
- 🟠 Orange: Frequency error hands (in both but difference > 5%)
- ⚪ White/Neutral: Not in range

**Flow Design:**
- Linear flow: scenario selection → range building → comparison → results
- "Try Again" keeps scenario, resets range, returns to building step
- "Next Scenario" advances to next scenario, resets range
- Save Progress deferred (tracked in ClickUp 869bdcjub)

**API Integration:**
- POST /user-range-attempts/compare called on range submission
- Response includes categorized hands (correct, missing, extra, frequencyError)
- Accuracy score calculated by backend: (correctHands / totalGtoHands) * 100
- Frontend displays results, does not recalculate
- Frontend API client/SDK updated to Phase 3 endpoints and exposed to ScenarioPractice

**Testing Strategy:**
- Unit tests for individual components with mocked dependencies
- E2E tests for complete user flows using Playwright
- Coverage target: >80% for new components
- Test loading states, error states, and success paths

**Future Considerations:**
- Advanced feedback with strategic explanations (Phase 5+)
- Scenario difficulty progression algorithm (Phase 5+)
- Social features: leaderboards, sharing results (Phase 6+)
- Mobile responsive design optimization (Phase 6+)
