import { test, expect } from '@playwright/test';
import { loginAsBuyer } from '@/tests/utils/auth-helpers';

test.describe('RFP Direct Publishing', () => {
    test('demo buyer can publish RFP directly from My RFPs page', async ({ page }) => {
        // Login as demo buyer
        await loginAsBuyer(page);

        // Navigate to RFP creation page
        await page.goto('/rfps/create');
        await expect(page.getByTestId('create-rfp-page-title')).toBeVisible();

        // Generate a unique title to avoid conflicts with previous test runs
        const uniqueTitle = `Test Direct Publish RFP ${Date.now()}`;

        // Fill out the RFP form with test data
        await page.getByTestId('rfp-title-input').fill(uniqueTitle);
        await page.getByTestId('rfp-category-select').click();
        await page.getByRole('option', { name: 'Technology' }).click();

        await page.getByTestId('rfp-description-input').fill('We need a simple landing page with contact form.');
        await page.getByTestId('rfp-company-input').fill('Demo Buyer Corp');
        await page.getByTestId('rfp-location-input').fill('Remote');

        await page.getByTestId('rfp-budget-select').click();
        await page.getByRole('option', { name: 'Under $10,000' }).click();

        // Set deadline to next month
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const nextMonthString = nextMonth.toISOString().slice(0, 16);
        await page.getByTestId('rfp-deadline-input').fill(nextMonthString);

        // Fill optional fields
        await page.getByTestId('rfp-requirements-input').fill('HTML, CSS, JavaScript, responsive design');
        await page.getByTestId('rfp-priority-select').click();
        await page.getByRole('option', { name: 'Low' }).click();

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

        // Find and click the Publish button directly on the My RFPs page
        const publishButton = page.locator('button:has-text("Publish")').first();
        await expect(publishButton).toBeVisible();
        await publishButton.click();

        // Wait for success message
        await expect(page.locator('[role="status"]').first()).toContainText('RFP Published Successfully!');

        // Verify the RFP now shows as Published
        await expect(page.locator(`text=${uniqueTitle}`).first()).toBeVisible();
        await expect(page.locator('text=/Published/i').first()).toBeVisible();
    });
}); 