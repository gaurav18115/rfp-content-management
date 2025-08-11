import { test, expect } from '@playwright/test';
import { loginAsBuyer } from '../utils/auth-helpers';

test.describe('RFP Creation End-to-End', () => {
    test('demo buyer can create RFP and it appears in database', async ({ page }) => {
        // Login as demo buyer
        await loginAsBuyer(page);

        // Navigate to RFP creation page
        await page.goto('/rfps/create');
        await expect(page.getByTestId('create-rfp-page-title')).toBeVisible();

        // Fill out the RFP form with test data
        await page.getByTestId('rfp-title-input').fill('Test Website Development RFP');
        await page.getByTestId('rfp-category-select').click();
        await page.getByRole('option', { name: 'Technology' }).click();

        await page.getByTestId('rfp-description-textarea').fill('We need a modern website with e-commerce functionality, user authentication, and admin dashboard.');
        await page.getByTestId('rfp-company-input').fill('Demo Buyer Corp');
        await page.getByTestId('rfp-location-input').fill('Remote');

        await page.getByTestId('rfp-budget-select').click();
        await page.getByRole('option', { name: '$10,000 - $50,000' }).click();

        // Set deadline to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toISOString().split('T')[0];
        await page.getByTestId('rfp-deadline-input').fill(tomorrowString);

        // Fill optional fields
        await page.getByTestId('rfp-requirements-textarea').fill('React frontend, Node.js backend, PostgreSQL database, responsive design');
        await page.getByTestId('rfp-additional-info-textarea').fill('Project must be completed within 3 months. Prefer team with similar project experience.');

        await page.getByTestId('rfp-priority-select').click();
        await page.getByRole('option', { name: 'High' }).click();

        await page.getByTestId('rfp-status-select').click();
        await page.getByRole('option', { name: 'Draft' }).click();

        await page.getByTestId('rfp-contact-email-input').fill('contact@demobuyer.com');
        await page.getByTestId('rfp-contact-phone-input').fill('+1-555-123-4567');

        // Submit the form
        await page.getByTestId('create-rfp-submit-button').click();

        // Wait for success message using the toast notification
        await expect(page.locator('[role="status"]').first()).toBeVisible();
        await expect(page.locator('[role="status"]').first()).toContainText('RFP Created Successfully!');

        // Wait for redirect to My RFPs page
        await page.waitForURL('/rfps/my');

        // Verify the RFP appears in the list
        await expect(page.locator('text=Test Website Development RFP')).toBeVisible();
        await expect(page.locator('text=Demo Buyer Corp')).toBeVisible();
        await expect(page.locator('text=Technology')).toBeVisible();
        await expect(page.locator('text=Draft')).toBeVisible();

        // Verify the RFP details are correct
        const rfpCard = page.locator('text=Test Website Development RFP').first().locator('..').locator('..').locator('..');
        await expect(rfpCard.locator('text=Demo Buyer Corp')).toBeVisible();
        await expect(rfpCard.locator('text=Technology')).toBeVisible();
        await expect(rfpCard.locator('text=Draft')).toBeVisible();
    });
}); 