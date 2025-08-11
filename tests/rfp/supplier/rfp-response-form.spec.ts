import { test, expect } from '@playwright/test';
import { loginAsSupplier, logout } from '../../utils/auth-helpers';

test.describe('Supplier RFP Response Form', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSupplier(page, { waitForDashboard: true });

    // Navigate to the RFPs page first
    await page.goto('/rfps');
    await page.waitForLoadState('domcontentloaded');
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test('should display response form for published RFP', async ({ page }) => {
    // Wait for RFP cards to load with proper timeout
    await page.waitForSelector('[data-testid="rfp-card"]', { timeout: 10000 });

    // Look for RFP cards
    const rfpCards = page.locator('[data-testid="rfp-card"]');
    const cardCount = await rfpCards.count();

    if (cardCount > 0) {
      const firstCard = rfpCards.first();
      const viewDetailsButton = firstCard.getByTestId('rfp-view-details');

      // Ensure the button is visible before clicking
      await expect(viewDetailsButton).toBeVisible();

      // Click view details button
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
      await page.waitForSelector('[data-testid="rfp-response-form"]', { timeout: 10000 });

      // Check if the response form is visible
      await expect(page.getByTestId('rfp-response-form')).toBeVisible();

      // Verify form fields are present (using the proper test IDs)
      await expect(page.getByTestId('proposal-field')).toBeVisible();
      await expect(page.getByTestId('budget-field')).toBeVisible();
      await expect(page.getByTestId('timeline-field')).toBeVisible();
      await expect(page.getByTestId('experience-field')).toBeVisible();

      // Check submit button is present
      await expect(page.getByTestId('submit-response-btn')).toBeVisible();
    } else {
      // Log the issue and skip test if no RFPs available
      console.log('No RFP cards found - skipping test');
      test.skip();
    }
  });
});