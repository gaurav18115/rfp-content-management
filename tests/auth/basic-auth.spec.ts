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
        await page.getByLabel('Email').fill(buyerEmail);
        await page.getByLabel('Role').selectOption('buyer');
        await page.locator('#password').fill(password);
        await page.locator('#repeat-password').fill(password);
        await page.getByRole('button', { name: 'Sign up' }).click();

        // Verify registration success
        await expect(page).toHaveURL('/auth/sign-up-success');

        // Login and verify buyer access
        await page.goto('/auth/login');
        await page.getByLabel('Email').fill(buyerEmail);
        await page.getByLabel('Password').fill(password);
        await page.getByRole('button', { name: 'Sign in' }).click();

        // Should redirect to dashboard with buyer features
        await expect(page).toHaveURL('/dashboard');
        await expect(page.locator('text=Create RFP')).toBeVisible();
    });

    test('supplier can register and access supplier features', async ({ page }) => {
        // Register supplier
        await page.goto('/auth/sign-up');
        await page.getByLabel('Email').fill(supplierEmail);
        await page.getByLabel('Role').selectOption('supplier');
        await page.locator('#password').fill(password);
        await page.locator('#repeat-password').fill(password);
        await page.getByRole('button', { name: 'Sign up' }).click();

        // Verify registration success
        await expect(page).toHaveURL('/auth/sign-up-success');

        // Login and verify supplier access
        await page.goto('/auth/login');
        await page.getByLabel('Email').fill(supplierEmail);
        await page.getByLabel('Password').fill(password);
        await page.getByRole('button', { name: 'Sign in' }).click();

        // Should redirect to dashboard with supplier features
        await expect(page).toHaveURL('/dashboard');
        await expect(page.locator('text=View RFPs')).toBeVisible();
    });
}); 