import { test, expect } from '@playwright/test';
import { loginAsBuyer } from '../../utils/auth-helpers';

test.describe('RFP Form Submission - Core Features', () => {
    test.beforeEach(async ({ page }) => {
        // Login as buyer before each test using the helper
        await loginAsBuyer(page);
    });

    test('should fill out and submit RFP form successfully', async ({ page }) => {
        await page.goto('/rfps/create');

        // Fill out the form with test data using data-testid selectors
        await page.getByTestId('rfp-title-input').fill('Test Website Development Project');

        // Handle Radix UI Select for category
        await page.getByTestId('rfp-category-select').click();
        await page.getByRole('option', { name: 'Technology' }).click();

        await page.getByTestId('rfp-description-input').fill('We need a modern website for our company with e-commerce functionality.');
        await page.getByTestId('rfp-company-input').fill('Test Company Inc.');
        await page.getByTestId('rfp-location-input').fill('Remote');

        // Handle Radix UI Select for budget range
        await page.getByTestId('rfp-budget-select').click();
        await page.getByRole('option', { name: '$25,000 - $50,000' }).click();

        // Set deadline to tomorrow (datetime-local format)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0); // Set to noon
        const tomorrowString = tomorrow.toISOString().slice(0, 16); // Format for datetime-local
        await page.getByTestId('rfp-deadline-input').fill(tomorrowString);

        await page.getByTestId('rfp-requirements-input').fill('React frontend, Node.js backend, PostgreSQL database');
        await page.getByTestId('rfp-additional-info-input').fill('Must be completed within 3 months');

        // Submit the form using the button text since it doesn't have a test ID
        await page.getByRole('button', { name: 'Create RFP' }).click();

        // Wait for success message - use more specific selector for toast
        await expect(page.locator('[data-state="open"]')).toContainText('RFP Created Successfully!');
        await expect(page.locator('[data-state="open"]')).toContainText('Your RFP has been created and is now visible to suppliers.');

        // Verify success by checking the toast is visible
        await expect(page.locator('[data-state="open"]')).toBeVisible();
    });

    test('should handle form submission with minimal data', async ({ page }) => {
        await page.goto('/rfps/create');

        // Fill only required fields using data-testid selectors
        await page.getByTestId('rfp-title-input').fill('Minimal RFP Test');

        // Handle Radix UI Select for category
        await page.getByTestId('rfp-category-select').click();
        await page.getByRole('option', { name: 'Services' }).click();

        await page.getByTestId('rfp-description-input').fill('Basic service requirement');
        await page.getByTestId('rfp-company-input').fill('Minimal Corp');

        // Set deadline to next week (datetime-local format)
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(12, 0, 0, 0); // Set to noon
        const nextWeekString = nextWeek.toISOString().slice(0, 16); // Format for datetime-local
        await page.getByTestId('rfp-deadline-input').fill(nextWeekString);

        // Submit form
        await page.getByRole('button', { name: 'Create RFP' }).click();

        // Should show success message - use more specific selector for toast
        await expect(page.locator('[data-state="open"]')).toContainText('RFP Created Successfully!');
    });
}); 