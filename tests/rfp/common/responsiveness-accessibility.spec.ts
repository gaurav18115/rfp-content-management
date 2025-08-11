import { test, expect } from '@playwright/test';
import { loginAsSupplier, logout } from '@/tests/utils/auth-helpers';

test.describe('RFP Responsiveness and Accessibility', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsSupplier(page, { waitForDashboard: false });
        await page.goto('/rfps');
        await page.waitForLoadState('networkidle');
    });

    test.afterEach(async ({ page }) => {
        await logout(page);
    });

    test('should be responsive on mobile devices', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        const searchInput = page.getByPlaceholder('Search RFPs by title, description, or company...');
        const categorySelect = page.getByRole('combobox');

        await expect(searchInput).toBeVisible();
        await expect(categorySelect).toBeVisible();
    });

    test('should handle keyboard navigation', async ({ page }) => {
        const searchInput = page.getByPlaceholder('Search RFPs by title, description, or company...');
        const categorySelect = page.getByRole('combobox');

        await searchInput.focus();
        await page.keyboard.press('Tab');
        await expect(categorySelect).toBeFocused();

        await searchInput.focus();
        await searchInput.fill('test');
        await page.keyboard.press('Enter');
        await expect(searchInput).toHaveValue('test');
    });
});