import { test, expect } from '@playwright/test';

test.describe('Auth pages', () => {
	test('login page renders', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('h2')).toHaveText('Welcome back');
		await expect(page.locator('input[name="email"]')).toBeVisible();
		await expect(page.locator('input[name="password"]')).toBeVisible();
	});

	test('register page renders', async ({ page }) => {
		await page.goto('/register');
		await expect(page.locator('h2')).toHaveText('Create your account');
		await expect(page.locator('input[name="name"]')).toBeVisible();
		await expect(page.locator('input[name="email"]')).toBeVisible();
		await expect(page.locator('input[name="password"]')).toBeVisible();
		await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
	});

	test('forgot-password page renders and shows success on submit', async ({ page }) => {
		await page.goto('/forgot-password');
		await expect(page.locator('h2')).toHaveText('Reset your password');
		await page.locator('input[name="email"]').fill('test@example.com');
		await page.locator('button[type="submit"]').click();
		await expect(page.getByRole('status')).toContainText('reset link');
	});

	test('reset-password redirects without token', async ({ page }) => {
		await page.goto('/reset-password');
		await expect(page).toHaveURL(/\/forgot-password/);
	});

	test('verify-email page renders', async ({ page }) => {
		await page.goto('/verify-email');
		await expect(page.locator('h2')).toHaveText('Check your email');
	});
});

test.describe('Route protection', () => {
	test('unauthenticated user is redirected from dashboard to login', async ({ page }) => {
		await page.goto('/dashboard');
		await expect(page).toHaveURL(/\/login\?redirectTo=%2Fdashboard/);
	});

	test('login page is accessible for unauthenticated users', async ({ page }) => {
		await page.goto('/login');
		await expect(page).toHaveURL('/login');
	});

	test('register page is accessible for unauthenticated users', async ({ page }) => {
		await page.goto('/register');
		await expect(page).toHaveURL('/register');
	});
});
