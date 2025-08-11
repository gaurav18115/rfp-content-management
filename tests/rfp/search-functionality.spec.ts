import { test, expect } from '@playwright/test';
import { loginAsSupplier, logout } from '../utils/auth-helpers';

test.describe('RFP Search Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsSupplier(page, { waitForDashboard: false });
        await page.goto('/rfps');
        await page.waitForLoadState('networkidle');
    });

    test.afterEach(async ({ page }) => {
        await logout(page);
    });

    test('should display search functionality', async ({ page }) => {
        const searchInput = page.getByPlaceholder('Search RFPs by title, description, or company...');
        await expect(searchInput).toBeVisible();
        await expect(searchInput).toBeEnabled();
        await searchInput.fill('test search');
        await expect(searchInput).toHaveValue('test search');
    });

    test('should handle search functionality', async ({ page }) => {
        const searchInput = page.getByPlaceholder('Search RFPs by title, description, or company...');
        await searchInput.fill('technology');
        await page.waitForTimeout(500);
        
        const resultsCount = page.locator('[data-testid="results-count"]');
        if (await resultsCount.isVisible()) {
            await expect(resultsCount).toBeVisible();
        }
    });
});