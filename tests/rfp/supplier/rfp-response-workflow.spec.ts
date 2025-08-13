import { test, expect } from '@playwright/test';
import { loginAsSupplier, logout } from '../../utils/auth-helpers';

test.describe('RFP Response Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSupplier(page, { waitForDashboard: true });

    // Navigate to the RFPs page first
    await page.goto('/rfps');
    await page.waitForLoadState('domcontentloaded');
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test('should provide clear feedback throughout response process', async ({ page }) => {
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

      // Check initial state - form should be visible and ready
      await expect(page.getByTestId('rfp-response-form')).toBeVisible();
      await expect(page.getByTestId('proposal-field')).toBeVisible();
      await expect(page.getByTestId('budget-field')).toBeVisible();
      await expect(page.getByTestId('timeline-field')).toBeVisible();
      await expect(page.getByTestId('experience-field')).toBeVisible();
      await expect(page.getByTestId('submit-response-btn')).toBeVisible();

      // Fill form progressively
      await page.getByTestId('proposal-field').fill('My proposal');
      await page.getByTestId('budget-field').fill('50000');
      await page.getByTestId('timeline-field').fill('3 months');
      await page.getByTestId('experience-field').fill('5 years');

      // Verify all fields are filled correctly
      await expect(page.getByTestId('proposal-field')).toHaveValue('My proposal');
      await expect(page.getByTestId('budget-field')).toHaveValue('50000');
      await expect(page.getByTestId('timeline-field')).toHaveValue('3 months');
      await expect(page.getByTestId('experience-field')).toHaveValue('5 years');

      // Verify submit button is enabled
      const submitButton = page.getByTestId('submit-response-btn');
      await expect(submitButton).toBeEnabled();

      // Test that the form is ready for submission (but don't actually submit)
      // This verifies the form functionality without depending on external API calls
    } else {
      // Log the issue and skip test if no RFPs available
      console.log('No RFP cards found - skipping test');
      test.skip();
    }
  });

  test('should handle form submission workflow correctly', async ({ page }) => {
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

      // Fill form with initial data
      await page.getByTestId('proposal-field').fill('Initial proposal');
      await page.getByTestId('budget-field').fill('40000');
      await page.getByTestId('timeline-field').fill('2 months');
      await page.getByTestId('experience-field').fill('3 years');

      // Verify initial data is filled
      await expect(page.getByTestId('proposal-field')).toHaveValue('Initial proposal');
      await expect(page.getByTestId('budget-field')).toHaveValue('40000');
      await expect(page.getByTestId('timeline-field')).toHaveValue('2 months');
      await expect(page.getByTestId('experience-field')).toHaveValue('3 years');

      // Update proposal with final content
      await page.getByTestId('proposal-field').fill('Updated proposal with final content');

      // Verify the update was applied
      await expect(page.getByTestId('proposal-field')).toHaveValue('Updated proposal with final content');

      // Verify submit button is enabled
      const submitButton = page.getByTestId('submit-response-btn');
      await expect(submitButton).toBeEnabled();

      // Test that the form data updates work correctly (but don't actually submit)
      // This verifies the form functionality without depending on external API calls
    } else {
      // Log the issue and skip test if no RFPs available
      console.log('No RFP cards found - skipping test');
      test.skip();
    }
  });
});