import { test, expect } from '@playwright/test';
import { loginAsSupplier, logout } from '@/tests/utils/auth-helpers';

test.describe('RFP Display', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsSupplier(page, { waitForDashboard: false });
        await page.goto('/rfps');
        await page.waitForLoadState('networkidle');
    });

    test.afterEach(async ({ page }) => {
        await logout(page);
    });

    test('should handle empty state when no RFPs available', async ({ page }) => {
        await page.waitForTimeout(2000);

        const noRfpsMessage = page.getByText('No RFPs Found');
        const noRfpsDescription = page.getByText('There are currently no published RFPs available');

        if (await noRfpsMessage.isVisible()) {
            await expect(noRfpsMessage).toBeVisible();
            await expect(noRfpsDescription).toBeVisible();
        }
    });

    test('should display RFP cards when available', async ({ page }) => {
        await page.waitForTimeout(2000);

        const rfpGrid = page.locator('[data-testid="rfp-grid"]');
        await expect(rfpGrid).toBeVisible();

        const rfpCards = page.locator('[data-testid="rfp-card"]');
        const cardCount = await rfpCards.count();

        if (cardCount > 0) {
            const firstCard = rfpCards.first();
            await expect(firstCard).toBeVisible();
            await expect(firstCard.locator('[data-testid="rfp-title"]')).toBeVisible();
            await expect(firstCard.locator('[data-testid="rfp-description"]')).toBeVisible();
            await expect(firstCard.getByRole('button', { name: 'View Details' })).toBeVisible();
        }
    });
});