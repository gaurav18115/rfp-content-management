import { test, expect } from '@playwright/test';
import { generateUniqueEmail } from '../utils/auth-helpers';

test.describe('Basic Authentication - Core Features', () => {
    let buyerEmail: string;
    let supplierEmail: string;
    const password = 'SecurePassword123!';

    test.beforeEach(async () => {
        // Generate unique emails for each test run
        buyerEmail = generateUniqueEmail('buyer');
        supplierEmail = generateUniqueEmail('supplier');
    });

    test('buyer can register and access buyer features', async ({ page }) => {
        // Register buyer
        await page.goto('/auth/sign-up');
        await page.getByTestId('email-input').fill(buyerEmail);
        await page.getByTestId('role-select').selectOption('buyer');
        await page.getByTestId('password-input').fill(password);
        await page.getByTestId('repeat-password-input').fill(password);
        await page.getByTestId('signup-submit').click();

        // Verify registration success
        await expect(page).toHaveURL('/auth/sign-up-success');

        // Login and verify buyer access
        await page.goto('/auth/login');
        await page.getByTestId('email-input').fill(buyerEmail);
        await page.getByTestId('password-input').fill(password);
        await page.getByTestId('login-submit').click();

        // Should redirect to dashboard with buyer features
        await expect(page).toHaveURL('/dashboard');
        await expect(page.getByTestId('create-rfp-header')).toBeVisible();
    });

    test('supplier can register and access supplier features', async ({ page }) => {
        // Register supplier
        await page.goto('/auth/sign-up');
        await page.getByTestId('email-input').fill(supplierEmail);
        await page.getByTestId('role-select').selectOption('supplier');
        await page.getByTestId('password-input').fill(password);
        await page.getByTestId('repeat-password-input').fill(password);
        await page.getByTestId('signup-submit').click();

        // Verify registration success
        await expect(page).toHaveURL('/auth/sign-up-success');

        // Login and verify supplier access
        await page.goto('/auth/login');
        await page.getByTestId('email-input').fill(supplierEmail);
        await page.getByTestId('password-input').fill(password);
        await page.getByTestId('login-submit').click();

        // Should redirect to dashboard with supplier features
        await expect(page).toHaveURL('/dashboard');
        await expect(page.getByTestId('browse-rfps')).toBeVisible();
    });
}); 