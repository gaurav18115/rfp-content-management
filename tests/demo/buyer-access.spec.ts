import { test, expect } from '@playwright/test';
import {
    loginAsBuyer,
    logout
} from '../utils/auth-helpers';

test.describe('Demo Buyer Access - Core Features', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('buyer can login and access core features', async ({ page }) => {
        // Login as buyer
        await loginAsBuyer(page);

        // Verify access to RFP creation
        await page.goto('/rfps/create');
        await expect(page.locator('h1')).toContainText('Create New RFP');
    });

    test('buyer can logout successfully', async ({ page }) => {
        // Login first
        await loginAsBuyer(page);

        // Verify logout works
        await logout(page);
        await expect(page.locator('text=Login')).toBeVisible();
    });
}); 