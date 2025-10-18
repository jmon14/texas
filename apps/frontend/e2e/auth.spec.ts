import { test, expect } from '@playwright/test';

test.describe('Authentication Pages', () => {
  test('should display login page with form elements', async ({ page }) => {
    await page.goto('/auth/login');

    // Check that login form is visible
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

    // Check navigation links are present
    await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Forgot your password?' })).toBeVisible();
  });

  test('should display register page with form elements', async ({ page }) => {
    await page.goto('/auth/register');

    // Check that register form is visible
    await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Confirm password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();

    // Check navigation link is present
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  });

  test('should have Sign up link on login page', async ({ page }) => {
    await page.goto('/auth/login');

    const signUpLink = page.getByRole('link', { name: 'Sign up' });
    await expect(signUpLink).toBeVisible();
    await expect(signUpLink).toHaveAttribute('href', '/auth/register');
  });

  test('should have Sign in link on register page', async ({ page }) => {
    await page.goto('/auth/register');

    const signInLink = page.getByRole('link', { name: 'Sign in' });
    await expect(signInLink).toBeVisible();
    await expect(signInLink).toHaveAttribute('href', '/auth/login');
  });
});
