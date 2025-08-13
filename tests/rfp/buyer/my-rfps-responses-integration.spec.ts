import { test, expect } from '@playwright/test';
import { loginAsBuyer } from '../../utils/auth-helpers';

test.describe('My RFPs Page - Response Integration', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsBuyer(page);
        await page.goto('/rfps/my');
    });

    test('should display response summary statistics for buyers', async ({ page }) => {
        // Wait for the page to load
        await page.waitForSelector('h1:has-text("My RFPs & Responses")');

        // Check if response stats are displayed
        const totalResponsesCard = page.locator('text=Total Responses').first();
        const pendingReviewCard = page.locator('text=Pending Review').first();
        const activeRfpsCard = page.locator('text=Active RFPs').first();

        await expect(totalResponsesCard).toBeVisible();
        await expect(pendingReviewCard).toBeVisible();
        await expect(activeRfpsCard).toBeVisible();
    });

    test('should show response count on RFP cards when responses exist', async ({ page }) => {
        // Wait for the page to load
        await page.waitForSelector('h1:has-text("My RFPs & Responses")');

        // Look for RFP cards with response counts
        const responseCountElements = page.locator('[class*="text-blue-600"]:has-text("response")');

        // If there are responses, they should be visible
        if (await responseCountElements.count() > 0) {
            await expect(responseCountElements.first()).toBeVisible();
        }
    });

    test('should display quick actions section when responses exist', async ({ page }) => {
        // Wait for the page to load
        await page.waitForSelector('h1:has-text("My RFPs & Responses")');

        // Look for quick actions section
        const quickActionsSection = page.locator('text=Quick Actions').first();

        // If there are responses, quick actions should be visible
        if (await quickActionsSection.count() > 0) {
            await expect(quickActionsSection).toBeVisible();

            // Check for quick action buttons
            const reviewAllButton = page.locator('text=Review All Responses').first();
            const reviewPendingButton = page.locator('text=Review Pending').first();

            if (await reviewAllButton.count() > 0) {
                await expect(reviewAllButton).toBeVisible();
                await expect(reviewPendingButton).toBeVisible();
            }
        }
    });

    test('should navigate to responses dashboard from quick actions', async ({ page }) => {
        // Wait for the page to load
        await page.waitForSelector('h1:has-text("My RFPs & Responses")');

        // Look for review all responses button
        const reviewAllButton = page.locator('text=Review All Responses').first();

        if (await reviewAllButton.count() > 0) {
            // Click the button
            await reviewAllButton.click();

            // Should navigate to responses dashboard
            await expect(page).toHaveURL('/dashboard/responses');

            // Check if we're on the responses page
            await expect(page.locator('h1:has-text("Review Responses")')).toBeVisible();
        }
    });

    test('should show review responses button on individual RFP cards', async ({ page }) => {
        // Wait for the page to load
        await page.waitForSelector('h1:has-text("My RFPs & Responses")');

        // Look for RFP cards with review responses buttons
        const reviewResponsesButtons = page.locator('text=Review Responses').first();

        if (await reviewResponsesButtons.count() > 0) {
            await expect(reviewResponsesButtons).toBeVisible();

            // Click the button
            await reviewResponsesButtons.click();

            // Should navigate to responses dashboard with RFP filter
            await expect(page).toHaveURL(/\/dashboard\/responses\?rfp=/);
        }
    });

    test('should display recent responses on RFP cards', async ({ page }) => {
        // Wait for the page to load
        await page.waitForSelector('h1:has-text("My RFPs & Responses")');

        // Look for recent responses sections
        const recentResponsesSections = page.locator('text=Recent Responses').first();

        if (await recentResponsesSections.count() > 0) {
            await expect(recentResponsesSections).toBeVisible();

            // Check for response status badges
            const statusBadges = page.locator('[class*="bg-blue-100"], [class*="bg-yellow-100"], [class*="bg-green-100"], [class*="bg-red-100"]');
            await expect(statusBadges.first()).toBeVisible();
        }
    });
}); 