// Auth handlers
import { authHandlers, authErrorHandlers } from './auth.handlers';

// User handlers
import { userHandlers, userErrorHandlers } from './user.handlers';

// Range handlers
import { rangeHandlers, rangeErrorHandlers } from './range.handlers';

// Scenario handlers
import { scenarioHandlers, scenarioErrorHandlers } from './scenario.handlers';

/**
 * Default handlers for all API endpoints
 * These provide happy-path responses for all tests by default
 */
export const handlers = [...authHandlers, ...userHandlers, ...rangeHandlers, ...scenarioHandlers];

/**
 * Export error handlers for test-specific overrides
 */
export { authErrorHandlers, userErrorHandlers, rangeErrorHandlers, scenarioErrorHandlers };

/**
 * Export mock data for tests
 */
export { mockRange, mockRanges } from './range.handlers';
export { mockScenarios } from './scenario.handlers';
