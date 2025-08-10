import { test, expect } from '@playwright/test';
import {
    loginAsSupplier,
    logout
} from '../utils/auth-helpers';

test.describe('Demo Supplier Access - Core Features', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('supplier can login and access core features', async ({ page }) => {
        // Login as supplier
        await loginAsSupplier(page);

        // Verify access to responses page
        await page.goto('/responses');
        await expect(page.locator('h1')).toContainText('My Responses');
    });

    test('supplier can logout successfully', async ({ page }) => {
        // Login first
        await loginAsSupplier(page);

        // Verify logout works
        await logout(page);
        await expect(page.locator('text=Login')).toBeVisible();
    });
}); 