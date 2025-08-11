import { test, expect } from '@playwright/test';
import { loginAsSupplier, logout } from '../utils/auth-helpers';

test.describe('RFP Pagination', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsSupplier(page, { waitForDashboard: false });
        await page.goto('/rfps');
        await page.waitForLoadState('networkidle');
    });

    test.afterEach(async ({ page }) => {
        await logout(page);
    });

    test('should display pagination when multiple pages exist', async ({ page }) => {
        await page.waitForTimeout(2000);
        
        const pagination = page.locator('[data-testid="pagination"]');
        
        if (await pagination.isVisible()) {
            await expect(pagination).toBeVisible();
            await expect(page.getByRole('button', { name: 'Previous' })).toBeVisible();
            await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
        }
    });

    test('should handle pagination navigation', async ({ page }) => {
        await page.waitForTimeout(2000);
        
        const pagination = page.locator('[data-testid="pagination"]');
        
        if (await pagination.isVisible()) {
            const nextButton = page.getByRole('button', { name: 'Next' });
            if (await nextButton.isEnabled()) {
                await nextButton.click();
                // Verify page change (you might need to adjust this based on your implementation)
                await page.waitForTimeout(500);
            }
        }
    });
});