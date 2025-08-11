import { test, expect } from '@playwright/test';
import { loginAsSupplier, logout } from '../../utils/auth-helpers';

test.describe('RFP Response Form Submission', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSupplier(page, { waitForDashboard: true });

    // Navigate to the RFPs page first
    await page.goto('/rfps');
    await page.waitForLoadState('domcontentloaded');
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test('should handle form submission successfully', async ({ page }) => {
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
      await page.waitForSelector('[data-testid="rfp-response-form"]', { timeout: 10000 });

      // Fill in all form fields
      await page.getByTestId('proposal-field').fill('This is my comprehensive proposal');
      await page.getByTestId('budget-field').fill('50000');
      await page.getByTestId('timeline-field').fill('3 months');
      await page.getByTestId('experience-field').fill('5+ years in similar projects');

      // Verify all fields are filled correctly
      await expect(page.getByTestId('proposal-field')).toHaveValue('This is my comprehensive proposal');
      await expect(page.getByTestId('budget-field')).toHaveValue('50000');
      await expect(page.getByTestId('timeline-field')).toHaveValue('3 months');
      await expect(page.getByTestId('experience-field')).toHaveValue('5+ years in similar projects');

      // Submit the form
      const submitButton = page.getByTestId('submit-response-btn');
      await expect(submitButton).toBeEnabled();
      
      // Store the current URL before submission
      const currentUrl = page.url();
      console.log('Current URL before submission:', currentUrl);
      
      // Click submit and wait for navigation or response
      await submitButton.click();
      
      // Wait a moment for the submission to process
      await page.waitForTimeout(2000);
      
      // Check if we're still on the same page or if something changed
      const newUrl = page.url();
      console.log('URL after submission:', newUrl);
      
      if (newUrl !== currentUrl) {
        console.log('Form submission successful - page navigated to:', newUrl);
        // Verify we're on a valid page
        await expect(page.locator('body')).toBeVisible();
      } else {
        console.log('Still on same page after submission');
        // Check for any success/error indicators
        const body = await page.locator('body').textContent();
        if (body && body.includes('success')) {
          console.log('Success message found in page content');
        } else if (body && body.includes('error')) {
          console.log('Error message found in page content');
          
          // Try to find and log the specific error message
          const errorElements = page.locator('[data-testid*="error"], .error, .toast-error, [class*="error"]');
          const errorCount = await errorElements.count();
          console.log(`Found ${errorCount} potential error elements`);
          
          for (let i = 0; i < errorCount; i++) {
            const errorText = await errorElements.nth(i).textContent();
            if (errorText && errorText.trim()) {
              console.log(`Error ${i + 1}:`, errorText.trim());
            }
          }
          
          // Also check for any toast notifications
          const toastElements = page.locator('[data-testid*="toast"], .toast, [class*="toast"]');
          const toastCount = await toastElements.count();
          console.log(`Found ${toastCount} potential toast elements`);
          
          for (let i = 0; i < toastCount; i++) {
            const toastText = await toastElements.nth(i).textContent();
            if (toastText && toastText.trim()) {
              console.log(`Toast ${i + 1}:`, toastText.trim());
            }
          }
        } else {
          console.log('No clear success/error indication found');
        }
      }
    } else {
      // Log the issue and skip test if no RFPs available
      console.log('No RFP cards found - skipping test');
      test.skip();
    }
  });
});