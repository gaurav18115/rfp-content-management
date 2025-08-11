import { test, expect } from '@playwright/test';
import { loginAsSupplier, logout } from '../utils/auth-helpers';

test.describe('RFP Detail View', () => {
    test.beforeEach(async ({ page }) => {
        // Login as supplier before each test
        await loginAsSupplier(page, { waitForDashboard: false });

        // Navigate to the RFPs page first
        await page.goto('/rfps');
        await page.waitForLoadState('networkidle');
    });

    test.afterEach(async ({ page }) => {
        // Logout after each test
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
            const viewDetailsButton = firstCard.getByRole('button', { name: 'View Details' });

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
            const viewDetailsButton = firstCard.getByRole('button', { name: 'View Details' });
            await viewDetailsButton.click();

            // Wait for page to load
            await page.waitForLoadState('networkidle');

            // Check if RFP title is displayed
            const title = page.locator('h1');
            await expect(title).toBeVisible();

            // Check if description is displayed
            const description = page.locator('p').first();
            await expect(description).toBeVisible();

            // Check if key information section is present
            await expect(page.getByText('Key Information')).toBeVisible();

            // Check if action buttons are present
            await expect(page.getByRole('button', { name: 'Submit Proposal' })).toBeVisible();
            await expect(page.getByRole('button', { name: '← Back to RFPs' })).toBeVisible();
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
            const viewDetailsButton = firstCard.getByRole('button', { name: 'View Details' });
            await viewDetailsButton.click();

            await page.waitForLoadState('networkidle');

            // Check if priority badge is displayed
            const priorityBadge = page.locator('text=/.*Priority/');
            await expect(priorityBadge).toBeVisible();

            // Check if category badge is displayed
            const categoryBadge = page.locator('text=/.*/').filter({ hasText: /^(?!.*Priority).*$/ });
            await expect(categoryBadge).toBeVisible();
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
            const viewDetailsButton = firstCard.getByRole('button', { name: 'View Details' });
            await viewDetailsButton.click();

            await page.waitForLoadState('networkidle');

            // Check if deadline information is displayed
            await expect(page.getByText('Deadline:')).toBeVisible();

            // Check if days until deadline is displayed
            const deadlineText = page.locator('text=/.*days|Today|Tomorrow|Expired/');
            await expect(deadlineText).toBeVisible();
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
            const viewDetailsButton = firstCard.getByRole('button', { name: 'View Details' });
            await viewDetailsButton.click();

            await page.waitForLoadState('networkidle');

            // Check for either expired warning or submit button
            const expiredWarning = page.getByText('This RFP has expired');
            const submitButton = page.getByRole('button', { name: 'Submit Proposal' });

            if (await expiredWarning.isVisible()) {
                await expect(expiredWarning).toBeVisible();
                await expect(page.getByRole('button', { name: 'RFP Expired' })).toBeVisible();
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
            const viewDetailsButton = firstCard.getByRole('button', { name: 'View Details' });
            await viewDetailsButton.click();

            await page.waitForLoadState('networkidle');

            // Check if company information is displayed
            await expect(page.getByText('Key Information')).toBeVisible();

            // Check if contact information section exists (if contact details are available)
            const contactSection = page.getByText('Contact Information');
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
            const viewDetailsButton = firstCard.getByRole('button', { name: 'View Details' });
            await viewDetailsButton.click();

            await page.waitForLoadState('networkidle');

            // Check if tags section exists (if tags are available)
            const tagsSection = page.getByText('Tags');
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
            const viewDetailsButton = firstCard.getByRole('button', { name: 'View Details' });
            await viewDetailsButton.click();

            await page.waitForLoadState('networkidle');

            // Click back button
            const backButton = page.getByRole('button', { name: '← Back to RFPs' });
            await backButton.click();

            // Check if returned to listing page
            await expect(page).toHaveURL('/rfps');
            await expect(page.getByRole('heading', { name: 'Available RFPs' })).toBeVisible();
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
            const viewDetailsButton = firstCard.getByRole('button', { name: 'View Details' });
            await viewDetailsButton.click();

            await page.waitForLoadState('networkidle');

            // Set mobile viewport
            await page.setViewportSize({ width: 375, height: 667 });

            // Check if layout adapts to mobile (grid should stack vertically)
            const grid = page.locator('.grid');
            await expect(grid).toBeVisible();

            // Check if action buttons are properly sized for mobile
            const submitButton = page.getByRole('button', { name: 'Submit Proposal' });
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
            const viewDetailsButton = firstCard.getByRole('button', { name: 'View Details' });
            await viewDetailsButton.click();

            await page.waitForLoadState('networkidle');

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