import { test, expect } from '@playwright/test';
import { loginAsBuyer, loginAsSupplier } from '@/tests/utils/auth-helpers';

test.describe('RFP Role-Based Access Control', () => {
    test('supplier cannot access RFP creation page', async ({ page }) => {
        // Login as supplier
        await loginAsSupplier(page);

        // Try to access RFP creation page
        await page.goto('/rfps/create');

        // Should be redirected to dashboard with access denied message
        await expect(page).toHaveURL('/dashboard');

        // Check for access denied toast message
        await expect(page.locator('[role="status"]').first()).toContainText('Access Denied');
        await expect(page.locator('[role="status"]').first()).toContainText('Only buyers can create RFPs');
    });

    test('supplier cannot access RFP edit page', async ({ page }) => {
        // Login as supplier
        await loginAsSupplier(page);

        // Try to access RFP edit page (using a dummy ID)
        await page.goto('/rfps/123/edit');

        // Should be redirected to dashboard with access denied message
        await expect(page).toHaveURL('/dashboard');

        // Check for access denied toast message
        await expect(page.locator('[role="status"]').first()).toContainText('Access Denied');
        await expect(page.locator('[role="status"]').first()).toContainText('Only buyers can edit RFPs');
    });

    test('buyer can access RFP creation page', async ({ page }) => {
        // Login as buyer
        await loginAsBuyer(page);

        // Navigate to RFP creation page
        await page.goto('/rfps/create');

        // Should be able to access the page
        await expect(page.getByTestId('create-rfp-page-title')).toBeVisible();
        await expect(page.getByTestId('rfp-title-input')).toBeVisible();
        await expect(page.getByTestId('rfp-description-input')).toBeVisible();
        await expect(page.getByTestId('rfp-deadline-input')).toBeVisible();
    });

    test('buyer can access RFP edit page', async ({ page }) => {
        // Login as buyer
        await loginAsBuyer(page);

        // First create an RFP to edit
        await page.goto('/rfps/create');

        // Fill out minimal required fields
        await page.getByTestId('rfp-title-input').fill('Test RFP for Editing');
        await page.getByTestId('rfp-description-input').fill('This is a test RFP that will be edited.');
        await page.getByTestId('rfp-company-input').fill('Test Company');
        await page.getByTestId('rfp-deadline-input').fill('2025-12-31T23:59');

        // Submit the form
        await page.getByRole('button', { name: 'Create RFP' }).click();

        // Wait for success and redirect
        await expect(page.locator('[role="status"]').first()).toContainText('RFP Created Successfully!');
        await page.waitForURL('/rfps/my');

        // Find the edit link for the created RFP
        const editLink = page.locator('a[href*="/edit"]').first();
        await expect(editLink).toBeVisible();

        // Click edit link
        await editLink.click();

        // Should be able to access the edit page
        await expect(page.locator('h1')).toContainText('Edit RFP');
        await expect(page.getByTestId('rfp-title-input')).toBeVisible();
        await expect(page.getByTestId('rfp-description-input')).toBeVisible();
    });

    test('unauthenticated user cannot access RFP creation page', async ({ page }) => {
        // Try to access RFP creation page without logging in
        await page.goto('/rfps/create');

        // Should be redirected to login page
        await expect(page).toHaveURL('/auth/login');
    });

    test('unauthenticated user cannot access RFP edit page', async ({ page }) => {
        // Try to access RFP edit page without logging in
        await page.goto('/rfps/123/edit');

        // Should be redirected to login page
        await expect(page).toHaveURL('/auth/login');
    });
}); 