# E2E Testing with Playwright

## Overview

This directory contains end-to-end (E2E) tests for the Texas Poker application using Playwright.

## How It Works

E2E tests run in a **real browser** with:
- **MSW (Mock Service Worker)**: Intercepts API calls and returns mock responses
- **No backend required**: All API responses are mocked via MSW browser worker
- **Automatic setup**: MSW is enabled automatically via `REACT_APP_ENABLE_MSW=true` environment variable

This approach ensures:
- ✅ Tests work in CI/CD without backend infrastructure
- ✅ Fast, reliable tests with consistent mock data
- ✅ No database dependencies
- ✅ Same mock handlers as unit tests (defined in `src/msw/handlers/`)

## Running E2E Tests

### Prerequisites

- Frontend dev server will be automatically started by Playwright
- MSW browser worker will be initialized automatically
- **No backend required** - all API calls are mocked

### Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (great for development)
npm run test:e2e:ui

# Run with debugger
npm run test:e2e:debug

# List all tests
npx playwright test --list
```

## Test Files

### `auth.spec.ts` (4 tests)
Tests authentication pages rendering:
- Login page displays with all form elements
- Register page displays with all form elements  
- Navigation links are present and have correct hrefs

These are basic smoke tests to ensure pages load correctly.

### `ranges.spec.ts` (2 tests)
Tests protected routes:
- Unauthenticated users are redirected to login
- Root route redirects when not authenticated

## Philosophy

E2E tests focus on **critical smoke tests only**:
- ✅ Pages render correctly
- ✅ Auth redirects work
- ❌ Form validation (covered in unit tests)
- ❌ Authenticated flows (require backend setup)

## Adding New Tests

1. Create a new `.spec.ts` file in the `e2e/` directory
2. Use the Page Object pattern for complex flows
3. Follow the existing test structure

Example:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/your-route');
  });

  test('should do something', async ({ page }) => {
    // Your test here
  });
});
```

## Configuration

See `playwright.config.ts` for:
- Base URL configuration
- Browser settings
- Test timeouts
- Reporter options
- **MSW enablement**: `REACT_APP_ENABLE_MSW=true` in webServer environment

## MSW Integration

The E2E tests use MSW (Mock Service Worker) to intercept API calls:

### How MSW is Enabled

1. **Playwright config** sets `REACT_APP_ENABLE_MSW=true` in `webServer.env`
2. **App initialization** (`src/index.tsx`) checks this variable
3. **MSW browser worker** is started before rendering the app
4. **API calls** are intercepted and return mock data from `src/msw/handlers/`

### Mock Handlers

All mock handlers are defined in `src/msw/handlers/`:
- `auth.handlers.ts` - Authentication endpoints
- `user.handlers.ts` - User management endpoints  
- `range.handlers.ts` - Range management endpoints

These are the **same handlers** used in unit tests, ensuring consistency across test types.

## Notes

- E2E tests are meant for **critical user journeys only**
- Keep E2E tests minimal - prefer unit/component tests for detailed testing
- Currently configured for Chromium only (can add Firefox/WebKit as needed)
- Tests run sequentially to avoid conflicts

