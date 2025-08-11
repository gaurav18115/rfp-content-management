import { test, expect } from '@playwright/test';
import { loginAsSupplier, logout } from '../utils/auth-helpers';

test.describe('RFP Page Structure', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsSupplier(page, { waitForDashboard: false });
        await page.goto('/rfps');
        await page.waitForLoadState('networkidle');
    });

    test.afterEach(async ({ page }) => {
        await logout(page);
    });

    test('should display RFP listing page with proper structure', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Available RFPs' })).toBeVisible();
        await expect(page.getByText('Browse and respond to available Request for Proposals')).toBeVisible();
        await expect(page.getByPlaceholder('Search RFPs by title, description, or company...')).toBeVisible();
        await expect(page.getByRole('combobox')).toBeVisible();
    });

    test('should show loading state initially', async ({ page }) => {
        await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    });
});