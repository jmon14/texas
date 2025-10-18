# E2E Testing with Playwright

## Overview

This directory contains end-to-end (E2E) tests for the Texas Poker application using Playwright.

## Running E2E Tests

### Prerequisites

- Frontend dev server will be automatically started by Playwright
- **For full authenticated tests**: Backend server must be running on `http://localhost:3000`

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

## Notes

- E2E tests are meant for **critical user journeys only**
- Keep E2E tests minimal - prefer unit/component tests for detailed testing
- Currently configured for Chromium only (can add Firefox/WebKit as needed)
- Tests run sequentially to avoid conflicts

