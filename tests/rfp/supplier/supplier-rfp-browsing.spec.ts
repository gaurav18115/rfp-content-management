import { test, expect } from '@playwright/test';
import { loginAsSupplier, logout } from '@/tests/utils/auth-helpers';

test.describe('Supplier RFP Browsing - Smoke Tests', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsSupplier(page, { waitForDashboard: false });
        await page.goto('/rfps');
        await page.waitForLoadState('networkidle');
    });

    test.afterEach(async ({ page }) => {
        await logout(page);
    });

    test('should load RFP page successfully', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Available RFPs' })).toBeVisible();
        await expect(page.locator('[data-testid="rfp-grid"]')).toBeVisible();
    });

    test('should have working search and filters', async ({ page }) => {
        const searchInput = page.getByPlaceholder('Search RFPs by title, description, or company...');
        const categorySelect = page.getByRole('combobox');

        await expect(searchInput).toBeVisible();
        await expect(categorySelect).toBeVisible();

        await searchInput.fill('test');
        await expect(searchInput).toHaveValue('test');
    });
});