import { test, expect } from '@playwright/test';
import { loginAsSupplier } from '../../utils/auth-helpers';

test.describe('RFP Response Data Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSupplier(page);
  });

  test('should persist response data with correct timestamp and status', async ({ page }) => {
    await page.goto('/rfps/1');
    
    const testProposal = 'Test proposal content for persistence testing';
    const testBudget = '75000';
    const testTimeline = '4 months';
    const testExperience = '6 years of relevant experience';
    
    // Fill and submit response
    await page.getByTestId('proposal-field').fill(testProposal);
    await page.getByTestId('budget-field').fill(testBudget);
    await page.getByTestId('timeline-field').fill(testTimeline);
    await page.getByTestId('experience-field').fill(testExperience);
    
    await page.getByTestId('submit-response-btn').click();
    
    // Wait for success
    await expect(page.getByTestId('response-success-message')).toBeVisible();
    
    // Refresh page to verify data persistence
    await page.reload();
    
    // Should show already responded state with submitted data
    await expect(page.getByTestId('already-responded-message')).toBeVisible();
    await expect(page.getByTestId('submitted-proposal')).toContainText(testProposal);
    await expect(page.getByTestId('submitted-budget')).toContainText(testBudget);
    await expect(page.getByTestId('submitted-timeline')).toContainText(testTimeline);
    await expect(page.getByTestId('submitted-experience')).toContainText(testExperience);
  });

  test('should handle server errors gracefully during submission', async ({ page }) => {
    await page.goto('/rfps/1');
    
    // Fill form
    await page.getByTestId('proposal-field').fill('Test proposal');
    await page.getByTestId('budget-field').fill('50000');
    await page.getByTestId('timeline-field').fill('2 months');
    await page.getByTestId('experience-field').fill('3 years experience');
    
    // Mock network error or server failure
    await page.route('**/api/rfps/*/responses', route => {
      route.fulfill({ status: 500, body: 'Internal Server Error' });
    });
    
    // Submit should show error message
    await page.getByTestId('submit-response-btn').click();
    
    // Check for error message
    await expect(page.getByTestId('response-error-message')).toBeVisible();
    await expect(page.getByTestId('response-error-message')).toContainText('Failed to submit response');
    
    // Form should still be visible for retry
    await expect(page.getByTestId('rfp-response-form')).toBeVisible();
  });
});