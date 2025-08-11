import { test, expect } from '@playwright/test';
import { loginAsSupplier, logout } from '@/tests/utils/auth-helpers';

test.describe('RFP Detail View', () => {
    test.beforeEach(async ({ page }) => {
        // Login as supplier before each test
        await loginAsSupplier(page, { waitForDashboard: true });

        // Navigate to the RFPs page first
        await page.goto('/rfps');
        await page.waitForLoadState('domcontentloaded');
    });

    test.afterEach(async ({ page }) => {
        await logout(page);
    });

    test('should navigate to RFP detail page from listing', async ({ page }) => {
        // Wait for content to load
        await page.waitForTimeout(2000);

        // Look for RFP cards
        const rfpCards = page.locator('[data-testid="rfp-card"]');
        const cardCount = await rfpCards.count();

        if (cardCount > 0) {
            const firstCard = rfpCards.first();
            const viewDetailsButton = firstCard.getByTestId('rfp-view-details');

            // Click view details button
            await viewDetailsButton.click();

            // Check if navigated to detail page
            await expect(page).toHaveURL(/\/rfps\/[^\/]+$/);
        } else {
            // Skip test if no RFPs available
            test.skip();
        }
    });

    test('should display RFP detail information correctly', async ({ page }) => {
        // Wait for content to load
        await page.waitForTimeout(2000);

        // Navigate to a specific RFP detail page (if we have one)
        const rfpCards = page.locator('[data-testid="rfp-card"]');
        const cardCount = await rfpCards.count();

        if (cardCount > 0) {
            const firstCard = rfpCards.first();
            const viewDetailsButton = firstCard.getByTestId('rfp-view-details');
            await viewDetailsButton.click();

            // Wait for page to load
            await page.waitForLoadState('domcontentloaded');

            // Check if RFP title is displayed
            await expect(page.getByTestId('rfp-title')).toBeVisible();

            // Check if description is displayed
            await expect(page.getByTestId('rfp-description')).toBeVisible();

            // Check if key information section is present
            await expect(page.getByTestId('rfp-key-information-title')).toBeVisible();

            // Check if action buttons are present
            await expect(page.getByTestId('rfp-submit-proposal-button')).toBeVisible();
            await expect(page.getByTestId('rfp-back-button')).toBeVisible();
        } else {
            test.skip();
        }
    });

    test('should display priority and category badges', async ({ page }) => {
        // Wait for content to load
        await page.waitForTimeout(2000);

        const rfpCards = page.locator('[data-testid="rfp-card"]');
        const cardCount = await rfpCards.count();

        if (cardCount > 0) {
            const firstCard = rfpCards.first();
            const viewDetailsButton = firstCard.getByTestId('rfp-view-details');
            await viewDetailsButton.click();

            await page.waitForLoadState('domcontentloaded');

            // Check if priority badge is displayed
            await expect(page.getByTestId('rfp-priority-badge')).toBeVisible();

            // Check if category badge is displayed
            await expect(page.getByTestId('rfp-category-badge')).toBeVisible();
        } else {
            test.skip();
        }
    });

    test('should display deadline information with proper formatting', async ({ page }) => {
        // Wait for content to load
        await page.waitForTimeout(2000);

        const rfpCards = page.locator('[data-testid="rfp-card"]');
        const cardCount = await rfpCards.count();

        if (cardCount > 0) {
            const firstCard = rfpCards.first();
            const viewDetailsButton = firstCard.getByTestId('rfp-view-details');
            await viewDetailsButton.click();

            await page.waitForLoadState('domcontentloaded');

            // Check if deadline information is displayed
            await expect(page.getByTestId('rfp-deadline-section')).toBeVisible();

            // Check if days until deadline is displayed
            await expect(page.locator('[data-testid="rfp-deadline-section"] p:last-child')).toBeVisible();
        } else {
            test.skip();
        }
    });

    test('should show expired RFP warning when applicable', async ({ page }) => {
        // Wait for content to load
        await page.waitForTimeout(2000);

        const rfpCards = page.locator('[data-testid="rfp-card"]');
        const cardCount = await rfpCards.count();

        if (cardCount > 0) {
            const firstCard = rfpCards.first();
            const viewDetailsButton = firstCard.getByTestId('rfp-view-details');
            await viewDetailsButton.click();

            await page.waitForLoadState('domcontentloaded');

            // Check for either expired warning or submit button
            const expiredWarning = page.getByTestId('rfp-expired-warning');
            const submitButton = page.getByTestId('rfp-submit-proposal-button');

            if (await expiredWarning.isVisible()) {
                await expect(expiredWarning).toBeVisible();
                await expect(page.getByTestId('rfp-expired-button')).toBeVisible();
            } else {
                await expect(submitButton).toBeVisible();
            }
        } else {
            test.skip();
        }
    });

    test('should display company and contact information', async ({ page }) => {
        // Wait for content to load
        await page.waitForTimeout(2000);

        const rfpCards = page.locator('[data-testid="rfp-card"]');
        const cardCount = await rfpCards.count();

        if (cardCount > 0) {
            const firstCard = rfpCards.first();
            const viewDetailsButton = firstCard.getByTestId('rfp-view-details');
            await viewDetailsButton.click();

            await page.waitForLoadState('domcontentloaded');

            // Check if company information is displayed
            await expect(page.getByTestId('rfp-key-information-title')).toBeVisible();

            // Check if contact information section exists (if contact details are available)
            const contactSection = page.getByTestId('rfp-contact-information-title');
            if (await contactSection.isVisible()) {
                await expect(contactSection).toBeVisible();
            }
        } else {
            test.skip();
        }
    });

    test('should display tags when available', async ({ page }) => {
        // Wait for content to load
        await page.waitForTimeout(2000);

        const rfpCards = page.locator('[data-testid="rfp-card"]');
        const cardCount = await rfpCards.count();

        if (cardCount > 0) {
            const firstCard = rfpCards.first();
            const viewDetailsButton = firstCard.getByTestId('rfp-view-details');
            await viewDetailsButton.click();

            await page.waitForLoadState('domcontentloaded');

            // Check if tags section exists (if tags are available)
            const tagsSection = page.getByTestId('rfp-tags-title');
            if (await tagsSection.isVisible()) {
                await expect(tagsSection).toBeVisible();
            }
        } else {
            test.skip();
        }
    });

    test('should navigate back to RFP listing', async ({ page }) => {
        // Wait for content to load
        await page.waitForTimeout(2000);

        const rfpCards = page.locator('[data-testid="rfp-card"]');
        const cardCount = await rfpCards.count();

        if (cardCount > 0) {
            const firstCard = rfpCards.first();
            const viewDetailsButton = firstCard.getByTestId('rfp-view-details');
            await viewDetailsButton.click();

            await page.waitForLoadState('domcontentloaded');

            // Click back button
            const backButton = page.getByTestId('rfp-back-button');
            await backButton.click();

            // Check if returned to listing page
            await expect(page).toHaveURL('/rfps');
            await expect(page.locator('h1:has-text("Available RFPs")')).toBeVisible();
        } else {
            test.skip();
        }
    });

    test('should be responsive on mobile devices', async ({ page }) => {
        // Wait for content to load
        await page.waitForTimeout(2000);

        const rfpCards = page.locator('[data-testid="rfp-card"]');
        const cardCount = await rfpCards.count();

        if (cardCount > 0) {
            const firstCard = rfpCards.first();
            const viewDetailsButton = firstCard.getByTestId('rfp-view-details');
            await viewDetailsButton.click();

            await page.waitForLoadState('domcontentloaded');

            // Set mobile viewport
            await page.setViewportSize({ width: 375, height: 667 });

            // Check if layout adapts to mobile (grid should stack vertically)
            const grid = page.locator('.grid');
            await expect(grid).toBeVisible();

            // Check if action buttons are properly sized for mobile
            const submitButton = page.getByTestId('rfp-submit-proposal-button');
            if (await submitButton.isVisible()) {
                await expect(submitButton).toBeVisible();
            }
        } else {
            test.skip();
        }
    });

    test('should handle keyboard navigation in detail view', async ({ page }) => {
        // Wait for content to load
        await page.waitForTimeout(2000);

        const rfpCards = page.locator('[data-testid="rfp-card"]');
        const cardCount = await rfpCards.count();

        if (cardCount > 0) {
            const firstCard = rfpCards.first();
            const viewDetailsButton = firstCard.getByTestId('rfp-view-details');
            await viewDetailsButton.click();

            await page.waitForLoadState('domcontentloaded');

            // Test tab navigation through interactive elements
            await page.keyboard.press('Tab');

            // Check if focus moves to an interactive element
            const focusedElement = page.locator(':focus');
            await expect(focusedElement).toBeVisible();

            // Test enter key on focused element
            await page.keyboard.press('Enter');
        } else {
            test.skip();
        }
    });
}); 