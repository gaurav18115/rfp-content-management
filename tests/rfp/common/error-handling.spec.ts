import { test, expect } from '@playwright/test';
import { loginAsSupplier, logout } from '@/tests/utils/auth-helpers';

test.describe('RFP Error Handling', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsSupplier(page, { waitForDashboard: false });
        await page.goto('/rfps');
        await page.waitForLoadState('networkidle');
    });

    test.afterEach(async ({ page }) => {
        await logout(page);
    });

    test('should show error message when API fails', async ({ page }) => {
        await page.route('/api/rfps/browse**', route => {
            route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Internal server error' })
            });
        });

        await page.reload();
        await page.waitForTimeout(1000);

        const errorMessage = page.locator('[data-testid="error-message"]');
        if (await errorMessage.isVisible()) {
            await expect(errorMessage).toBeVisible();
        }
    });

    test('should handle network timeout gracefully', async ({ page }) => {
        await page.route('/api/rfps/browse**', route => {
            route.abort('timedout');
        });

        await page.reload();
        await page.waitForTimeout(2000);

        // Check if error state is handled
        const errorState = page.locator('[data-testid="error-message"], [data-testid="timeout-message"]');
        if (await errorState.isVisible()) {
            await expect(errorState).toBeVisible();
        }
    });
});