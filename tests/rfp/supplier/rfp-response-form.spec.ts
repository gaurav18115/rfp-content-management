import { test, expect } from '@playwright/test';
import { loginAsSupplier } from '../../utils/auth-helpers';

test.describe('Supplier RFP Response Form', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSupplier(page);
  });

  test('should display response form for published RFP', async ({ page }) => {
    // Navigate to a published RFP
    await page.goto('/rfps/1');
    
    // Check if the response form is visible
    await expect(page.getByTestId('rfp-response-form')).toBeVisible();
    
    // Verify form fields are present
    await expect(page.getByTestId('proposal-field')).toBeVisible();
    await expect(page.getByTestId('budget-field')).toBeVisible();
    await expect(page.getByTestId('timeline-field')).toBeVisible();
    await expect(page.getByTestId('experience-field')).toBeVisible();
    
    // Check submit button is present
    await expect(page.getByTestId('submit-response-btn')).toBeVisible();
  });

  test('should validate required fields before submission', async ({ page }) => {
    await page.goto('/rfps/1');
    
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
  });
});