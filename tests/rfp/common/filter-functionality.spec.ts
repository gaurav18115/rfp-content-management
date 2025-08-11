import { test, expect } from '@playwright/test';
import { loginAsSupplier, logout } from '@/tests/utils/auth-helpers';

test.describe('RFP Filter Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsSupplier(page, { waitForDashboard: false });
        await page.goto('/rfps');
        await page.waitForLoadState('networkidle');
    });

    test.afterEach(async ({ page }) => {
        await logout(page);
    });

    test('should display category filter dropdown', async ({ page }) => {
        const categorySelect = page.getByRole('combobox');
        await expect(categorySelect).toBeVisible();
        await expect(categorySelect).toBeEnabled();
        await categorySelect.click();
        await expect(page.getByRole('option', { name: 'All Categories' })).toBeVisible();
    });

    test('should handle category filtering', async ({ page }) => {
        const categorySelect = page.getByRole('combobox');
        await categorySelect.click();

        const categoryOptions = page.locator('[role="option"]');
        const optionCount = await categoryOptions.count();

        if (optionCount > 1) {
            const firstCategory = categoryOptions.nth(1);
            const categoryName = await firstCategory.textContent();
            await firstCategory.click();
            await expect(page.getByText(`Category: ${categoryName}`)).toBeVisible();
        }
    });
});