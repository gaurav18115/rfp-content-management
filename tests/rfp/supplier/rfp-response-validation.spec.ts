import { test, expect } from '@playwright/test';
import { loginAsSupplier } from '../../utils/auth-helpers';

test.describe('RFP Response Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSupplier(page);
  });

  test('should validate field length constraints', async ({ page }) => {
    await page.goto('/rfps/1');
    
    // Test proposal field length validation
    const longProposal = 'a'.repeat(10001); // Exceed 10k character limit
    await page.getByTestId('proposal-field').fill(longProposal);
    
    // Should show length validation error
    await expect(page.getByTestId('proposal-length-error')).toBeVisible();
    await expect(page.getByTestId('proposal-length-error')).toContainText('Proposal must be under 10,000 characters');
    
    // Test budget field format validation
    await page.getByTestId('budget-field').fill('invalid-budget');
    await page.getByTestId('budget-field').blur();
    
    // Should show format validation error
    await expect(page.getByTestId('budget-format-error')).toBeVisible();
    await expect(page.getByTestId('budget-format-error')).toContainText('Budget must be a valid number');
  });

  test('should clear validation errors when fields are corrected', async ({ page }) => {
    await page.goto('/rfps/1');
    
    // Trigger validation error
    await page.getByTestId('proposal-field').fill('');
    await page.getByTestId('proposal-field').blur();
    
    // Should show error
    await expect(page.getByTestId('proposal-error')).toBeVisible();
    
    // Correct the field
    await page.getByTestId('proposal-field').fill('Valid proposal content');
    await page.getByTestId('proposal-field').blur();
    
    // Error should be cleared
    await expect(page.getByTestId('proposal-error')).not.toBeVisible();
    
    // Form should be valid for submission
    await expect(page.getByTestId('submit-response-btn')).toBeEnabled();
  });
});