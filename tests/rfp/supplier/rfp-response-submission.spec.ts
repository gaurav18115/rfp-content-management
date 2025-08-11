import { test, expect } from '@playwright/test';
import { loginAsSupplier } from '../../utils/auth-helpers';

test.describe('Supplier RFP Response Submission', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSupplier(page);
  });

  test('should successfully submit RFP response', async ({ page }) => {
    await page.goto('/rfps/1');
    
    // Fill in the response form
    await page.getByTestId('proposal-field').fill('This is my comprehensive proposal for the RFP');
    await page.getByTestId('budget-field').fill('50000');
    await page.getByTestId('timeline-field').fill('3 months');
    await page.getByTestId('experience-field').fill('5 years of relevant experience');
    
    // Submit the response
    await page.getByTestId('submit-response-btn').click();
    
    // Check for success message
    await expect(page.getByTestId('response-success-message')).toBeVisible();
    await expect(page.getByTestId('response-success-message')).toContainText('Response submitted successfully');
    
    // Verify form is no longer visible (replaced with success state)
    await expect(page.getByTestId('rfp-response-form')).not.toBeVisible();
  });

  test('should prevent duplicate responses from same supplier', async ({ page }) => {
    await page.goto('/rfps/1');
    
    // Check if already responded (should show different UI)
    const responseForm = page.getByTestId('rfp-response-form');
    const alreadyResponded = page.getByTestId('already-responded-message');
    
    // Either the form should be visible (not responded yet) or already responded message
    if (await responseForm.isVisible()) {
      // Fill and submit first response
      await page.getByTestId('proposal-field').fill('First response');
      await page.getByTestId('budget-field').fill('40000');
      await page.getByTestId('timeline-field').fill('2 months');
      await page.getByTestId('experience-field').fill('3 years experience');
      await page.getByTestId('submit-response-btn').click();
      
      // Wait for success and refresh page
      await expect(page.getByTestId('response-success-message')).toBeVisible();
      await page.reload();
      
      // Now should show already responded message
      await expect(page.getByTestId('already-responded-message')).toBeVisible();
      await expect(page.getByTestId('rfp-response-form')).not.toBeVisible();
    } else {
      // Already responded, should show appropriate message
      await expect(alreadyResponded).toBeVisible();
      await expect(alreadyResponded).toContainText('You have already responded to this RFP');
    }
  });
});