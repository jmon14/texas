import { test, expect } from '@playwright/test';

test.describe('Complete Authentication Flow', () => {
  // Create unique test user for each run to avoid conflicts
  // Username must be 6-20 chars
  const uniqueId = Date.now().toString().slice(-8); // Last 8 digits
  const testUser = {
    username: `e2e${uniqueId}`, // e.g., "e2e24800000" (11 chars)
    email: `e2e${uniqueId}@test.com`,
    password: 'Test123!@#',
  };

  test('should complete register → login → protected route flow', async ({ page }) => {
    // ========================================
    // STEP 1: Register new user with real backend
    // ========================================
    await page.goto('/auth/register');
    await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();

    // Fill registration form
    await page.getByLabel('Username').fill(testUser.username);
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Password', { exact: true }).fill(testUser.password);
    await page.getByLabel('Confirm password').fill(testUser.password);

    // Submit registration
    await page.getByRole('button', { name: 'Sign up' }).click();

    // Wait for registration to complete
    await page.waitForLoadState('networkidle');

    // Registration should succeed (check for success message or redirect)
    // Note: App might auto-login after registration, so we need to clear session

    // ========================================
    // STEP 2: Clear session to test login flow
    // ========================================
    // Clear all storage (localStorage, sessionStorage, cookies) to simulate logout
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // ========================================
    // STEP 3: Login with registered credentials
    // ========================================
    await page.goto('/auth/login');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();

    // Fill login form with newly registered user
    await page.getByLabel('Username').fill(testUser.username);
    await page.getByLabel('Password').fill(testUser.password);

    // Submit login
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Wait for login response
    await page.waitForLoadState('networkidle');

    // Verify successful login - should redirect away from login page
    await expect(page).not.toHaveURL('/auth/login', { timeout: 10000 });

    // Verify we're on a protected page with navigation elements
    const hasNav = await page
      .locator('nav')
      .isVisible()
      .catch(() => false);
    const hasHeader = await page
      .locator('header')
      .isVisible()
      .catch(() => false);

    // Should have navigation after successful login
    expect(hasNav || hasHeader).toBeTruthy();

    // ========================================
    // STEP 4: Verify Session Persistence
    // ========================================
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should still be authenticated after refresh
    await expect(page).not.toHaveURL('/auth/login');

    // ========================================
    // STEP 5: Access Protected Route
    // ========================================
    await page.goto('/range');
    await page.waitForLoadState('networkidle');

    // Should successfully access protected route
    await expect(page).not.toHaveURL('/auth/login');
    expect(page.url()).toContain('/range');
  });

  test('should display registration form', async ({ page }) => {
    await page.goto('/auth/register');

    // Verify all form fields are present
    await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Confirm password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  });

  test('should handle login with invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    await page.getByLabel('Username').fill('nonexistent');
    await page.getByLabel('Password').fill('wrongpassword');

    await page.getByRole('button', { name: 'Sign in' }).click();

    // Should show error message (displayed as Typography with error color, not role="alert")
    // MSW should return error for invalid credentials
    await expect(
      page.locator('p').filter({ hasText: /invalid|incorrect|failed|wrong/i }),
    ).toBeVisible({ timeout: 5000 });

    // Should stay on login page
    await expect(page).toHaveURL('/auth/login');
  });

  test('should validate password confirmation on registration', async ({ page }) => {
    await page.goto('/auth/register');

    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password', { exact: true }).fill('Password123!');
    await page.getByLabel('Confirm password').fill('DifferentPassword123!');

    await page.getByRole('button', { name: 'Sign up' }).click();

    // Should show validation error
    // Note: Error might appear before submit or after, adjust accordingly
    await expect(page.locator('text=/password.*match|must match/i')).toBeVisible({
      timeout: 3000,
    });
  });

  test('should validate required fields on registration', async ({ page }) => {
    await page.goto('/auth/register');

    // Try to submit empty form
    await page.getByRole('button', { name: 'Sign up' }).click();

    // Should show validation errors (displayed as helper text in TextFields)
    // MUI TextField shows errors as helper text with Mui-error class
    const errorMessages = page.locator('.MuiFormHelperText-root.Mui-error, p.Mui-error');
    await expect(errorMessages.first()).toBeVisible({ timeout: 3000 });

    // Verify specific required field errors appear
    await expect(page.getByText('Username is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });
});
