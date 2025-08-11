import { test, expect } from '@playwright/test';
import {
    loginAsBuyer,
    loginAsSupplier,
    loginWithCredentials,
    logout,
    isLoggedIn,
    ensureLoggedIn,
    DEMO_ACCOUNTS
} from './auth-helpers';

// Example test file showing how to use the auth helpers

test.describe('Example Usage of Auth Helpers', () => {

    test('simple buyer login example', async ({ page }) => {
        // Simple login as buyer - will navigate to /auth/login by default
        await loginAsBuyer(page);

        // Now you're logged in and on the dashboard
        await expect(page.locator('text=Dashboard')).toBeVisible();
    });

    test('buyer login with custom options', async ({ page }) => {
        // Login as buyer but start from a different page
        await loginAsBuyer(page, {
            redirectTo: '/',
            waitForDashboard: true
        });

        // You'll be redirected to dashboard after login
        await expect(page.locator('text=Dashboard')).toBeVisible();
    });

    test('supplier login example', async ({ page }) => {
        // Login as supplier
        await loginAsSupplier(page);

        // Verify supplier-specific content
        await expect(page.locator('text=Browse RFPs')).toBeVisible();
    });

    test('custom credentials example', async ({ page }) => {
        // Login with any credentials
        await loginWithCredentials(page, {
            email: 'custom@example.com',
            password: 'custompass'
        });

        // Note: This will only work if the credentials are valid
        await expect(page.locator('text=Dashboard')).toBeVisible();
    });

    test('conditional login example', async ({ page }) => {
        // Check if already logged in
        if (!(await isLoggedIn(page))) {
            // Only login if not already logged in
            await loginAsBuyer(page);
        }

        // Now you're guaranteed to be logged in
        await expect(page.locator('text=Dashboard')).toBeVisible();
    });

    test('ensure logged in helper example', async ({ page }) => {
        // This helper will check if logged in and login if needed
        await ensureLoggedIn(page, 'buyer');

        // Guaranteed to be logged in as buyer
        await expect(page.locator('text=Dashboard')).toBeVisible();
    });

    test('logout example', async ({ page }) => {
        // First login
        await loginAsBuyer(page);

        // Do some work...
        await expect(page.locator('text=Dashboard')).toBeVisible();

        // Then logout
        await logout(page);

        // Should be on login page
        await expect(page.locator('text=Sign In')).toBeVisible();
    });

    test('logout without waiting for redirect', async ({ page }) => {
        // Login first
        await loginAsSupplier(page);

        // Logout but don't wait for redirect
        await logout(page, false);

        // You might want to check something else before the redirect
        // or handle the redirect manually
    });

    test('using demo account constants', async ({ page }) => {
        // Access demo account credentials
        console.log('Buyer email:', DEMO_ACCOUNTS.buyer.email);
        console.log('Supplier company:', DEMO_ACCOUNTS.supplier.company);

        // Use them in tests
        await loginAsBuyer(page);

        // Verify the email matches
        await page.goto('/profile');
        await expect(page.locator(`text=${DEMO_ACCOUNTS.buyer.email}`)).toBeVisible();
    });

    test('multiple role testing example', async ({ page }) => {
        // Test buyer functionality
        await loginAsBuyer(page);
        await expect(page.locator('text=Create RFP')).toBeVisible();
        await logout(page);

        // Test supplier functionality
        await loginAsSupplier(page);
        await expect(page.locator('text=Browse RFPs')).toBeVisible();
        await logout(page);
    });
}); 