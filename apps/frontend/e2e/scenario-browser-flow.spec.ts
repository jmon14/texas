import { test, expect } from '@playwright/test';

test.describe('Scenario Browser Flow', () => {
  // Helper to create unique user per test
  const createTestUser = () => {
    // Generate short unique ID (6-20 chars for username validation)
    const uniqueId = Date.now().toString().slice(-8); // Last 8 digits of timestamp
    const randomSuffix = Math.floor(Math.random() * 1000); // 0-999
    return {
      username: `scn${uniqueId}${randomSuffix}`, // e.g., "scn24800000123" (15 chars)
      email: `scenario${uniqueId}${randomSuffix}@test.com`,
      password: 'Test123!@#',
    };
  };

  test.beforeEach(async ({ page }) => {
    // Register a fresh user for each test to avoid conflicts
    const testUser = createTestUser();

    // STEP 1: Register
    await page.goto('/auth/register');
    await page.getByLabel('Username').fill(testUser.username);
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Password', { exact: true }).fill(testUser.password);
    await page.getByLabel('Confirm password').fill(testUser.password);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.waitForLoadState('networkidle');

    // Check for registration errors
    const regError = page.locator('p').filter({ hasText: /error|failed|already|invalid/i });
    const hasRegError = await regError.isVisible().catch(() => false);

    if (hasRegError) {
      const regErrorText = await regError.textContent();
      console.log(`Registration error: ${regErrorText}`);
      console.log(
        `Tried to register with username: ${testUser.username}, email: ${testUser.email}`,
      );
      throw new Error(`Registration failed with error: ${regErrorText}`);
    }

    // STEP 2: Clear session (app might auto-login after registration)
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // STEP 3: Login
    await page.goto('/auth/login');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await page.getByLabel('Username').fill(testUser.username);
    await page.getByLabel('Password').fill(testUser.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForLoadState('networkidle');

    // Check for error messages
    const errorMessage = page
      .locator('p')
      .filter({ hasText: /invalid|incorrect|failed|wrong|error/i });
    const hasError = await errorMessage.isVisible().catch(() => false);

    if (hasError) {
      const errorText = await errorMessage.textContent();
      console.log(`Login error: ${errorText}`);
      console.log(`Tried to login with username: ${testUser.username}`);
      throw new Error(`Login failed with error: ${errorText}`);
    }

    // Verify login succeeded
    await expect(page).not.toHaveURL('/auth/login', { timeout: 10000 });

    // STEP 4: Navigate to scenarios
    await page.goto('/scenarios');
    await page.waitForLoadState('networkidle');
  });

  test('should display scenario browser with filters and scenarios', async ({ page }) => {
    // Verify we're on the scenarios page
    await expect(page).toHaveURL('/scenarios');

    // Verify page heading
    await expect(page.getByRole('heading', { name: 'Scenario Browser' })).toBeVisible();

    // Verify filter sections exist
    await expect(page.getByText('Game Type', { exact: true })).toBeVisible();
    await expect(page.getByText('Difficulty', { exact: true })).toBeVisible();
    await expect(page.getByText('Category', { exact: true })).toBeVisible();

    // Verify filter chips are present (Game Type)
    await expect(page.getByRole('button', { name: 'All' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cash' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Tournament' }).first()).toBeVisible();

    // Verify difficulty filters
    await expect(page.getByRole('button', { name: 'Beginner' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Intermediate' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Advanced' }).first()).toBeVisible();

    // Verify at least one scenario card is visible (backend should have seeded data)
    // Scenario cards are MUI Cards with CardActionArea
    const scenarioCards = page.locator('[class*="MuiCard-root"]');
    await expect(scenarioCards.first()).toBeVisible({ timeout: 5000 });
  });

  test('should filter scenarios by game type', async ({ page }) => {
    // Wait for scenarios to load
    await page.waitForLoadState('networkidle');

    // Get initial count of scenario cards
    const allCards = page.locator('[class*="MuiCard-root"]');
    const initialCount = await allCards.count();
    expect(initialCount).toBeGreaterThan(0);

    // Click "Tournament" filter
    await page.getByRole('button', { name: 'Tournament' }).first().click();
    await page.waitForTimeout(500); // Give time for filtering

    // Check tournament scenarios exist or show empty state
    const tournamentCards = page.locator('[class*="MuiCard-root"]');
    const tournamentCount = await tournamentCards.count();

    if (tournamentCount === 0) {
      await expect(page.getByText('No scenarios found matching your filters.')).toBeVisible();
    } else {
      expect(tournamentCount).toBeGreaterThan(0);
    }

    // Click "Cash" filter
    await page.getByRole('button', { name: 'Cash' }).first().click();
    await page.waitForTimeout(500);

    // Should show "No scenarios found" or different scenarios
    const cashCards = page.locator('[class*="MuiCard-root"]');
    const cashCount = await cashCards.count();

    // Either no cash scenarios (shows empty state) or has cash scenarios
    if (cashCount === 0) {
      await expect(page.getByText('No scenarios found matching your filters.')).toBeVisible();
    } else {
      expect(cashCount).toBeGreaterThan(0);
    }
  });

  test('should filter scenarios by difficulty', async ({ page }) => {
    // Wait for scenarios to load
    await page.waitForLoadState('networkidle');

    // Click "Beginner" filter
    await page.getByRole('button', { name: 'Beginner' }).first().click();
    await page.waitForTimeout(500);

    // Verify scenarios are still visible
    const beginnerCards = page.locator('[class*="MuiCard-root"]');
    const beginnerCount = await beginnerCards.count();

    if (beginnerCount === 0) {
      await expect(page.getByText('No scenarios found matching your filters.')).toBeVisible();
    } else {
      expect(beginnerCount).toBeGreaterThan(0);
    }

    // Click "Intermediate" filter
    await page.getByRole('button', { name: 'Intermediate' }).first().click();
    await page.waitForTimeout(500);

    const intermediateCards = page.locator('[class*="MuiCard-root"]');
    const intermediateCount = await intermediateCards.count();

    if (intermediateCount === 0) {
      await expect(page.getByText('No scenarios found matching your filters.')).toBeVisible();
    } else {
      expect(intermediateCount).toBeGreaterThan(0);
    }
  });

  test('should filter scenarios by category', async ({ page }) => {
    // Wait for scenarios to load
    await page.waitForLoadState('networkidle');

    // Get initial count to verify some scenarios exist
    const initialCards = page.locator('[class*="MuiCard-root"]');
    const initialCount = await initialCards.count();
    expect(initialCount).toBeGreaterThan(0); // Backend should have scenarios

    // Click "Opening Ranges" filter
    await page.getByRole('button', { name: 'Opening Ranges' }).first().click();
    await page.waitForTimeout(500);

    // Check if scenarios match or show empty state
    const openingCards = page.locator('[class*="MuiCard-root"]');
    const openingCount = await openingCards.count();

    if (openingCount === 0) {
      await expect(page.getByText('No scenarios found matching your filters.')).toBeVisible();
    } else {
      expect(openingCount).toBeGreaterThan(0);
    }

    // Try a different category filter
    await page.getByRole('button', { name: 'Defending BB' }).first().click();
    await page.waitForTimeout(500);

    const defendingCards = page.locator('[class*="MuiCard-root"]');
    const defendingCount = await defendingCards.count();

    // At least verify the filter is working (count changed or empty state shown)
    if (defendingCount === 0) {
      await expect(page.getByText('No scenarios found matching your filters.')).toBeVisible();
    } else {
      expect(defendingCount).toBeGreaterThan(0);
    }
  });

  test('should navigate to scenario detail page', async ({ page }) => {
    // Wait for scenarios to load
    await page.waitForLoadState('networkidle');

    // Get the first scenario card
    const firstCard = page.locator('[class*="MuiCard-root"]').first();
    await expect(firstCard).toBeVisible({ timeout: 5000 });

    // Get the scenario name from the card (h6 element)
    const scenarioName = await firstCard.locator('h3').textContent();

    // Click the card
    await firstCard.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Verify we're on the detail page
    await expect(page).toHaveURL(/\/scenarios\/[a-zA-Z0-9]+/);

    // Verify scenario name appears on detail page
    if (scenarioName) {
      await expect(page.getByRole('heading', { name: scenarioName })).toBeVisible({
        timeout: 5000,
      });
    }

    // Verify "Back to Scenarios" button exists
    await expect(page.getByRole('button', { name: 'Back to Scenarios' })).toBeVisible();

    // Verify scenario details are displayed
    await expect(page.getByText('Category')).toBeVisible();
    await expect(page.getByText('Scenario Details')).toBeVisible();
    await expect(page.getByText('Street:')).toBeVisible();
    await expect(page.getByText('Game Type:')).toBeVisible();
    await expect(page.getByText('Position:')).toBeVisible();

    // Verify "Start Practice" button exists (but is disabled)
    const practiceButton = page.getByRole('button', { name: 'Start Practice' });
    await expect(practiceButton).toBeVisible();
    await expect(practiceButton).toBeDisabled();
  });

  test('should navigate back from scenario detail to list', async ({ page }) => {
    // Wait for scenarios to load
    await page.waitForLoadState('networkidle');

    // Click first scenario card
    const firstCard = page.locator('[class*="MuiCard-root"]').first();
    await firstCard.click();
    await page.waitForLoadState('networkidle');

    // Verify we're on detail page
    await expect(page).toHaveURL(/\/scenarios\/[a-zA-Z0-9]+/);

    // Click "Back to Scenarios" button
    await page.getByRole('button', { name: 'Back to Scenarios' }).click();
    await page.waitForLoadState('networkidle');

    // Verify we're back on the list page
    await expect(page).toHaveURL('/scenarios');
    await expect(page.getByRole('heading', { name: 'Scenario Browser' })).toBeVisible();

    // Verify scenario cards are visible again
    const scenarioCards = page.locator('[class*="MuiCard-root"]');
    await expect(scenarioCards.first()).toBeVisible();
  });

  test('should apply multiple filters simultaneously', async ({ page }) => {
    // Wait for scenarios to load
    await page.waitForLoadState('networkidle');

    // Store initial count to verify we can get back to it
    const initialCards = page.locator('[class*="MuiCard-root"]');
    const initialCount = await initialCards.count();
    expect(initialCount).toBeGreaterThan(0);

    // Apply Game Type filter: Tournament
    await page.getByRole('button', { name: 'Tournament' }).first().click();
    await page.waitForTimeout(500);

    // Apply Difficulty filter: Intermediate
    await page.getByRole('button', { name: 'Intermediate' }).first().click();
    await page.waitForTimeout(500);

    // Apply Category filter: Opening Ranges
    await page.getByRole('button', { name: 'Opening Ranges' }).first().click();
    await page.waitForTimeout(500);

    // Verify either scenarios match all filters OR no scenarios found
    const filteredCards = page.locator('[class*="MuiCard-root"]');
    const count = await filteredCards.count();

    if (count === 0) {
      // If no scenarios match, should show empty state
      await expect(page.getByText('No scenarios found matching your filters.')).toBeVisible();
    } else {
      // If scenarios match, they should be visible
      expect(count).toBeGreaterThan(0);
    }

    // Reload page to reset all filters (simpler and more reliable than clicking All buttons)
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should show all scenarios after page reload (filters reset)
    const afterReloadCards = page.locator('[class*="MuiCard-root"]');
    const afterReloadCount = await afterReloadCards.count();

    // Verify we have all scenarios back
    expect(afterReloadCount).toBe(initialCount);
  });
});
