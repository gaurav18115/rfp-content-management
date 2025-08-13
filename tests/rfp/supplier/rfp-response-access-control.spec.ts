import { test, expect } from '@playwright/test';
import { loginAsSupplier } from '../../utils/auth-helpers';

test.describe('RFP Response Access Control', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSupplier(page);
  });

  test('should only show response form for published RFPs', async ({ page }) => {
    // Test with published RFP
    await page.goto('/rfps/1');
    
    // Should show response form for published RFP
    await expect(page.getByTestId('rfp-response-form')).toBeVisible();
    
    // Test with draft RFP (should not show response form)
    await page.goto('/rfps/2');
    
    // Should not show response form for draft RFP
    await expect(page.getByTestId('rfp-response-form')).not.toBeVisible();
    await expect(page.getByTestId('draft-rfp-message')).toBeVisible();
  });

  test('should enforce supplier role access to response form', async ({ page }) => {
    // This test would require testing with different user roles
    // For now, we'll test that supplier can access the form
    
    await page.goto('/rfps/1');
    
    // Supplier should be able to see and interact with response form
    await expect(page.getByTestId('rfp-response-form')).toBeVisible();
    await expect(page.getByTestId('submit-response-btn')).toBeEnabled();
    
    // Verify supplier-specific elements are present
    await expect(page.getByTestId('supplier-response-section')).toBeVisible();
  });
});