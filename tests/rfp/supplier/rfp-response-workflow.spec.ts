import { test, expect } from '@playwright/test';
import { loginAsSupplier } from '../../utils/auth-helpers';

test.describe('RFP Response Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSupplier(page);
  });

  test('should provide clear feedback throughout response process', async ({ page }) => {
    await page.goto('/rfps/1');
    
    // Check initial state
    await expect(page.getByTestId('response-instructions')).toBeVisible();
    await expect(page.getByTestId('response-instructions')).toContainText('Submit your response to this RFP');
    
    // Fill form progressively
    await page.getByTestId('proposal-field').fill('My proposal');
    await expect(page.getByTestId('form-progress')).toContainText('25% complete');
    
    await page.getByTestId('budget-field').fill('50000');
    await expect(page.getByTestId('form-progress')).toContainText('50% complete');
    
    await page.getByTestId('timeline-field').fill('3 months');
    await expect(page.getByTestId('form-progress')).toContainText('75% complete');
    
    await page.getByTestId('experience-field').fill('5 years');
    await expect(page.getByTestId('form-progress')).toContainText('100% complete');
    
    // Submit and verify success flow
    await page.getByTestId('submit-response-btn').click();
    await expect(page.getByTestId('response-success-message')).toBeVisible();
    await expect(page.getByTestId('response-id')).toBeVisible();
  });

  test('should allow response editing before final submission', async ({ page }) => {
    await page.goto('/rfps/1');
    
    // Fill form
    await page.getByTestId('proposal-field').fill('Initial proposal');
    await page.getByTestId('budget-field').fill('40000');
    await page.getByTestId('timeline-field').fill('2 months');
    await page.getByTestId('experience-field').fill('3 years');
    
    // Save as draft
    await page.getByTestId('save-draft-btn').click();
    await expect(page.getByTestId('draft-saved-message')).toBeVisible();
    
    // Edit proposal
    await page.getByTestId('proposal-field').fill('Updated proposal');
    
    // Submit final response
    await page.getByTestId('submit-response-btn').click();
    await expect(page.getByTestId('response-success-message')).toBeVisible();
    
    // Verify final content was saved
    await page.reload();
    await expect(page.getByTestId('submitted-proposal')).toContainText('Updated proposal');
  });
});