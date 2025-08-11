import { test, expect } from '@playwright/test';
import { loginAsBuyer } from '../utils/auth-helpers';

test.describe('RFP Edit End-to-End', () => {
    test('demo buyer can edit draft RFP', async ({ page }) => {
        // Login as demo buyer
        await loginAsBuyer(page);

        // First, create an RFP to edit
        await page.goto('/rfps/create');
        await expect(page.getByTestId('create-rfp-page-title')).toBeVisible();

        const uniqueTitle = `Test RFP for Editing ${Date.now()}`;
        const updatedTitle = `Updated ${uniqueTitle}`;

        // Fill out the RFP form with test data
        await page.getByTestId('rfp-title-input').fill(uniqueTitle);
        await page.getByTestId('rfp-category-select').click();
        await page.getByRole('option', { name: 'Technology' }).click();
        await page.getByTestId('rfp-description-input').fill('Test description for editing');
        await page.getByTestId('rfp-company-input').fill('Demo Buyer Corp');
        await page.getByTestId('rfp-budget-select').click();
        await page.getByRole('option', { name: 'Under $10,000' }).click();

        // Set deadline to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toISOString().slice(0, 16);
        await page.getByTestId('rfp-deadline-input').fill(tomorrowString);

        // Submit the form
        await page.getByRole('button', { name: 'Create RFP' }).click();

        // Wait for success message and redirect
        await expect(page.locator('[role="status"]').first()).toContainText('RFP Created Successfully!');
        await page.waitForURL('/rfps/my');

        // Find the RFP we just created and click edit
        await page.locator(`text=${uniqueTitle}`).first().click();
        await page.locator('a[href*="/edit"]').first().click();

        // Verify we're on the edit page
        await expect(page.locator('h1')).toContainText('Edit RFP');

        // Update the title
        await page.getByTestId('rfp-title-input').clear();
        await page.getByTestId('rfp-title-input').fill(updatedTitle);

        // Submit the update
        await page.getByRole('button', { name: 'Update RFP' }).click();

        // Wait for success message
        await expect(page.locator('[role="status"]').first()).toContainText('RFP Updated Successfully!');

        // Verify redirect back to My RFPs
        await page.waitForURL('/rfps/my');

        // Verify the updated title is visible
        await expect(page.locator(`text=${updatedTitle}`).first()).toBeVisible();
    });
}); 