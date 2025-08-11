import { test, expect } from '@playwright/test';
import { loginAsSupplier, logout } from '@/tests/utils/auth-helpers';

test.describe('RFP Navigation and Interaction', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsSupplier(page, { waitForDashboard: false });
        await page.goto('/rfps');
        await page.waitForLoadState('networkidle');
    });

    test.afterEach(async ({ page }) => {
        await logout(page);
    });

    test('should navigate to RFP detail page when card is clicked', async ({ page }) => {
        await page.waitForTimeout(2000);

        const rfpCards = page.locator('[data-testid="rfp-card"]');
        const cardCount = await rfpCards.count();

        if (cardCount > 0) {
            const firstCard = rfpCards.first();
            const viewDetailsButton = firstCard.getByRole('button', { name: 'View Details' });
            await viewDetailsButton.click();
            await expect(page).toHaveURL(/\/rfps\/[^\/]+$/);
        }
    });

    test('should clear filters when clear button is clicked', async ({ page }) => {
        const searchInput = page.getByPlaceholder('Search RFPs by title, description, or company...');
        const clearButton = page.getByRole('button', { name: 'Clear' });

        await searchInput.fill('test');
        await page.waitForTimeout(500);

        if (await clearButton.isVisible()) {
            await clearButton.click();
            await expect(searchInput).toHaveValue('');
        }
    });
});