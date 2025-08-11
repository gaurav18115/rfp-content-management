import { test, expect } from '@playwright/test';
import { loginAsBuyer } from '@/tests/utils/auth-helpers';

test.describe('RFP Publishing', () => {
    test('demo buyer can publish draft RFP from edit page', async ({ page }) => {
        // Login as demo buyer
        await loginAsBuyer(page);

        // Navigate to RFP creation page
        await page.goto('/rfps/create');
        await expect(page.getByTestId('create-rfp-page-title')).toBeVisible();

        // Generate a unique title to avoid conflicts with previous test runs
        const uniqueTitle = `Test Publish RFP ${Date.now()}`;

        // Fill out the RFP form with test data
        await page.getByTestId('rfp-title-input').fill(uniqueTitle);
        await page.getByTestId('rfp-category-select').click();
        await page.getByRole('option', { name: 'Technology' }).click();

        await page.getByTestId('rfp-description-input').fill('We need a mobile app development project with React Native.');
        await page.getByTestId('rfp-company-input').fill('Demo Buyer Corp');
        await page.getByTestId('rfp-location-input').fill('Remote');

        await page.getByTestId('rfp-budget-select').click();
        await page.getByRole('option', { name: '$25,000 - $50,000' }).click();

        // Set deadline to next week
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekString = nextWeek.toISOString().slice(0, 16);
        await page.getByTestId('rfp-deadline-input').fill(nextWeekString);

        // Fill optional fields
        await page.getByTestId('rfp-requirements-input').fill('React Native, TypeScript, Firebase backend, iOS and Android support');
        await page.getByTestId('rfp-priority-select').click();
        await page.getByRole('option', { name: 'Medium' }).click();

        // Ensure status is set to draft
        await page.getByTestId('rfp-status-select').click();
        await page.getByRole('option', { name: 'Draft' }).click();

        await page.getByTestId('rfp-contact-email-input').fill('contact@demobuyer.com');

        // Submit the form to create draft RFP
        await page.getByRole('button', { name: 'Create RFP' }).click();

        // Wait for success message
        await expect(page.locator('[role="status"]').first()).toContainText('RFP Created Successfully!');

        // Wait for redirect to My RFPs page
        await page.waitForURL('/rfps/my');

        // Verify the RFP appears in the list with Draft status
        await expect(page.locator(`text=${uniqueTitle}`).first()).toBeVisible();
        await expect(page.locator('text=/Draft/i').first()).toBeVisible();

        // Click on Edit button to go to edit page
        await page.locator('a[href*="/rfps/"][href*="/edit"]').first().click();

        // Wait for edit page to load
        await page.waitForURL(/\/rfps\/.*\/edit/);
        await expect(page.locator('h1:has-text("Edit RFP")')).toBeVisible();

        // Verify the Publish button is visible (since it's a draft)
        await expect(page.getByRole('button', { name: 'Publish RFP' })).toBeVisible();

        // Click the Publish button
        await page.getByRole('button', { name: 'Publish RFP' }).click();

        // Wait for success message
        await expect(page.locator('[role="status"]').first()).toContainText('RFP Published Successfully!');

        // Wait for redirect to My RFPs page
        await page.waitForURL('/rfps/my');

        // Verify the RFP now shows as Published
        await expect(page.locator(`text=${uniqueTitle}`).first()).toBeVisible();
        await expect(page.locator('text=/Published/i').first()).toBeVisible();

        // Verify the RFP is now visible in the browse page (published RFPs)
        await page.goto('/rfps');
        await expect(page.locator('h1:has-text("Available RFPs")')).toBeVisible();

        // Search for our published RFP (search is debounced, so we wait a bit)
        await page.getByTestId('search-input').fill(uniqueTitle);
        // Wait for the debounced search to trigger (300ms + buffer)
        await page.waitForTimeout(400);

        // Verify the published RFP appears in search results
        await expect(page.locator(`text=${uniqueTitle}`).first()).toBeVisible();
        await expect(page.locator('text=/Demo Buyer Corp/i').first()).toBeVisible();
    });
}); 