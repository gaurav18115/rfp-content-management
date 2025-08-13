import { test, expect } from '@playwright/test';
import { loginAsSupplier, generateUniqueEmail } from '../../utils/auth-helpers';

test.describe('Supplier RFP Response Submission', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSupplier(page);
  });

  test('should display response form for published RFP', async ({ page }) => {
    // Navigate to a published RFP
    await page.goto('/rfps');

    // Click on the first published RFP
    await page.click('text=Submit Proposal');

    // Verify we're on the response form page
    await expect(page.locator('h1')).toContainText('Submit Response to RFP');

    // Verify form fields are present
    await expect(page.getByLabel('Proposal')).toBeVisible();
    await expect(page.getByLabel('Budget (USD)')).toBeVisible();
    await expect(page.getByLabel('Timeline')).toBeVisible();
    await expect(page.getByLabel('Relevant Experience')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/rfps/1/respond');

    // Try to submit without filling required fields
    await page.click('text=Submit Response');

    // Verify validation errors
    await expect(page.getByText('Proposal is required')).toBeVisible();
    await expect(page.getByText('Budget is required')).toBeVisible();
    await expect(page.getByText('Timeline is required')).toBeVisible();
    await expect(page.getByText('Experience is required')).toBeVisible();
  });

  test('should submit response successfully', async ({ page }) => {
    await page.goto('/rfps/1/respond');

    // Fill out the form
    await page.getByLabel('Proposal').fill('This is our comprehensive proposal for your project. We have extensive experience in this area and can deliver within your timeline and budget.');
    await page.getByLabel('Budget (USD)').fill('75000');
    await page.getByLabel('Timeline').fill('3 months');
    await page.getByLabel('Relevant Experience').fill('We have successfully completed 15+ similar projects over the past 5 years. Our team includes certified professionals with expertise in the required technologies.');

    // Submit the form
    await page.click('text=Submit Response');

    // Verify success message
    await expect(page.getByText('Your response has been submitted successfully!')).toBeVisible();
  });

  test('should prevent duplicate responses', async ({ page }) => {
    // First, submit a response
    await page.goto('/rfps/1/respond');
    await page.getByLabel('Proposal').fill('First response');
    await page.getByLabel('Budget (USD)').fill('50000');
    await page.getByLabel('Timeline').fill('2 months');
    await page.getByLabel('Relevant Experience').fill('We have experience');
    await page.click('text=Submit Response');

    // Try to submit another response to the same RFP
    await page.goto('/rfps/1/respond');

    // Should be redirected with error message
    await expect(page.getByText('You have already submitted a response to this RFP.')).toBeVisible();
  });

  test('should show appropriate UI for expired RFPs', async ({ page }) => {
    // Navigate to an expired RFP
    await page.goto('/rfps/expired-rfp-id');

    // Should show expired message and disabled submit button
    await expect(page.getByText('This RFP has expired and is no longer accepting submissions.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'RFP Expired' })).toBeDisabled();
  });

  test('should display RFP summary on response form', async ({ page }) => {
    await page.goto('/rfps/1/respond');

    // Verify RFP summary is displayed
    await expect(page.getByText('RFP Summary')).toBeVisible();
    await expect(page.getByText('Submission Guidelines')).toBeVisible();

    // Verify key information is shown
    await expect(page.getByText('Budget Range')).toBeVisible();
    await expect(page.getByText('Deadline')).toBeVisible();
  });
});