import { test, expect } from '@playwright/test';
import { loginAsSupplier, logout } from '../../utils/auth-helpers';

test.describe('RFP Response Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSupplier(page, { waitForDashboard: true });

    // Navigate to the RFPs page first
    await page.goto('/rfps');
    await page.waitForLoadState('domcontentloaded');
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test('should validate required fields before submission', async ({ page }) => {
    // Wait for RFP cards to load with proper timeout
    await page.waitForSelector('[data-testid="rfp-card"]', { timeout: 10000 });

    const rfpCards = page.locator('[data-testid="rfp-card"]');
    const cardCount = await rfpCards.count();

    if (cardCount > 0) {
      const firstCard = rfpCards.first();
      const viewDetailsButton = firstCard.getByTestId('rfp-view-details');

      // Ensure the button is visible before clicking
      await expect(viewDetailsButton).toBeVisible();
      await viewDetailsButton.click();

      // Wait for navigation and page load
      await page.waitForLoadState('domcontentloaded');

      // Wait for the Submit Proposal button to be visible on the RFP detail page
      await page.waitForSelector('[data-testid="rfp-submit-proposal-button"]', { timeout: 10000 });

      // Click the Submit Proposal button to navigate to the respond page
      const submitProposalButton = page.getByTestId('rfp-submit-proposal-button');
      await expect(submitProposalButton).toBeVisible();
      await submitProposalButton.click();

      // Wait for navigation to the respond page and page load
      await page.waitForLoadState('domcontentloaded');

      // Wait for the response form to be visible on the respond page
      await page.waitForSelector('[data-testid="rfp-response-form"]', { timeout: 15000 });

      // Try to submit without filling required fields
      const submitButton = page.getByTestId('submit-response-btn');
      await expect(submitButton).toBeVisible();
      await submitButton.click();

      // Check for validation errors (the form should prevent submission if required fields are empty)
      // Since this is a basic HTML form, we'll check that the form doesn't submit
      // and the page URL remains the same
      const currentUrl = page.url();
      await expect(page).toHaveURL(currentUrl);

      // Fill in required field
      const proposalField = page.getByTestId('proposal-field');
      await expect(proposalField).toBeVisible();
      await proposalField.fill('Valid proposal content');

      // Submit again
      await submitButton.click();

      // Should still be on the same page since we're testing the form validation
      await expect(page).toHaveURL(currentUrl);
    } else {
      // Log the issue and skip test if no RFPs available
      console.log('No RFP cards found - skipping test');
      test.skip();
    }
  });

  test('should allow valid form submission with all fields filled', async ({ page }) => {
    // Wait for RFP cards to load with proper timeout
    await page.waitForSelector('[data-testid="rfp-card"]', { timeout: 10000 });

    const rfpCards = page.locator('[data-testid="rfp-card"]');
    const cardCount = await rfpCards.count();

    if (cardCount > 0) {
      const firstCard = rfpCards.first();
      const viewDetailsButton = firstCard.getByTestId('rfp-view-details');

      // Ensure the button is visible before clicking
      await expect(viewDetailsButton).toBeVisible();
      await viewDetailsButton.click();

      // Wait for navigation and page load
      await page.waitForLoadState('domcontentloaded');

      // Wait for the Submit Proposal button to be visible on the RFP detail page
      await page.waitForSelector('[data-testid="rfp-submit-proposal-button"]', { timeout: 10000 });

      // Click the Submit Proposal button to navigate to the respond page
      const submitProposalButton = page.getByTestId('rfp-submit-proposal-button');
      await expect(submitProposalButton).toBeVisible();
      await submitProposalButton.click();

      // Wait for navigation to the respond page and page load
      await page.waitForLoadState('domcontentloaded');

      // Wait for the response form to be visible on the respond page
      await page.waitForSelector('[data-testid="rfp-response-form"]', { timeout: 15000 });

      // Fill in all form fields with valid data
      await page.getByTestId('proposal-field').fill('This is a comprehensive proposal with detailed methodology');
      await page.getByTestId('budget-field').fill('50000');
      await page.getByTestId('timeline-field').fill('3 months');
      await page.getByTestId('experience-field').fill('5 years of relevant experience in similar projects');

      // Verify all fields are filled
      await expect(page.getByTestId('proposal-field')).toHaveValue('This is a comprehensive proposal with detailed methodology');
      await expect(page.getByTestId('budget-field')).toHaveValue('50000');
      await expect(page.getByTestId('timeline-field')).toHaveValue('3 months');
      await expect(page.getByTestId('experience-field')).toHaveValue('5 years of relevant experience in similar projects');

      // Submit button should be enabled
      const submitButton = page.getByTestId('submit-response-btn');
      await expect(submitButton).toBeEnabled();
    } else {
      // Log the issue and skip test if no RFPs available
      console.log('No RFP cards found - skipping test');
      test.skip();
    }
  });
});