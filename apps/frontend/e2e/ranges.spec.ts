import { test, expect } from '@playwright/test';

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    // Try to access the range builder (protected route)
    await page.goto('/range');

    // Should be redirected to login page
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('should redirect to login when accessing root without auth', async ({ page }) => {
    // Try to access root (protected route)
    await page.goto('/');

    // Should be redirected to login page
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  // Note: Full authenticated flow tests would require:
  // - Running backend server
  // - Test database with seeded users
  // - Login with test credentials
  // These are skipped for the basic E2E setup
});
