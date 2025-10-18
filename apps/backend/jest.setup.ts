/**
 * Jest setup file - runs before each test
 * Automatically resets mocks to maintain test isolation
 */

import { resetConfigurationServiceMock } from './src/utils/mocks';

beforeEach(() => {
  // Reset ConfigurationService mock to default implementation
  // This ensures tests start with a clean, predictable state
  resetConfigurationServiceMock();
});
