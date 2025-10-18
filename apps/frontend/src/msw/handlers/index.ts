// Auth handlers
import { authHandlers, authErrorHandlers } from './auth.handlers';

// User handlers
import { userHandlers, userErrorHandlers } from './user.handlers';

/**
 * Default handlers for all API endpoints
 * These provide happy-path responses for all tests by default
 */
export const handlers = [...authHandlers, ...userHandlers];

/**
 * Export error handlers for test-specific overrides
 */
export { authErrorHandlers, userErrorHandlers };
