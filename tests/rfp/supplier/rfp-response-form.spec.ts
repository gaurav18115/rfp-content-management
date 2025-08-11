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
    // Wait for content to load
    await page.waitForTimeout(2000);

    // Look for RFP cards
    const rfpCards = page.locator('[data-testid="rfp-card"]');
    const cardCount = await rfpCards.count();

    if (cardCount > 0) {
      const firstCard = rfpCards.first();
      const viewDetailsButton = firstCard.getByTestId('rfp-view-details');

      // Click view details button
      await viewDetailsButton.click();

      // Wait for page to load
      await page.waitForLoadState('domcontentloaded');

      // Check if the response form is visible
      await expect(page.getByTestId('rfp-response-form')).toBeVisible();

      // Verify form fields are present
      await expect(page.getByTestId('proposal-field')).toBeVisible();
      await expect(page.getByTestId('budget-field')).toBeVisible();
      await expect(page.getByTestId('timeline-field')).toBeVisible();
      await expect(page.getByTestId('experience-field')).toBeVisible();

      // Check submit button is present
      await expect(page.getByTestId('submit-response-btn')).toBeVisible();
    } else {
      // Skip test if no RFPs available
      test.skip();
    }
  });

  test('should validate required fields before submission', async ({ page }) => {
    // Wait for content to load
    await page.waitForTimeout(2000);

    const rfpCards = page.locator('[data-testid="rfp-card"]');
    const cardCount = await rfpCards.count();

    if (cardCount > 0) {
      const firstCard = rfpCards.first();
      const viewDetailsButton = firstCard.getByTestId('rfp-view-details');
      await viewDetailsButton.click();

      // Wait for page to load
      await page.waitForLoadState('domcontentloaded');

      // Try to submit without filling required fields
      await page.getByTestId('submit-response-btn').click();

      // Check for validation errors
      await expect(page.getByTestId('proposal-error')).toBeVisible();
      await expect(page.getByTestId('proposal-error')).toContainText('Proposal is required');

      // Fill in required field
      await page.getByTestId('proposal-field').fill('This is my proposal');

      // Submit again
      await page.getByTestId('submit-response-btn').click();

      // Should not show proposal error anymore
      await expect(page.getByTestId('proposal-error')).not.toBeVisible();
    } else {
      test.skip();
    }
  });
});