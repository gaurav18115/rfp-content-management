import { test, expect } from '@playwright/test';
import {
    generateUniqueEmail,
    fillSignupForm,
    submitSignupForm,
    waitForSignupSuccess,
} from '../utils/auth-helpers';

test.describe('Signup Form - Core Features', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the signup page before each test
        await page.goto('/auth/sign-up');
        // Wait for the page to be fully loaded
        await page.waitForLoadState('networkidle');
    });

    test('should display signup form with all required fields', async ({ page }) => {
        // Wait for the form to render
        await page.waitForTimeout(2000);

        // Check if the signup form is visible
        await expect(page.getByText('Sign up')).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('Create a new account')).toBeVisible({ timeout: 10000 });

        // Check if all form fields are present
        await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible({ timeout: 10000 });
        await expect(page.getByRole('combobox', { name: 'Role' })).toBeVisible({ timeout: 10000 });
        await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible({ timeout: 10000 });
        await expect(page.getByRole('textbox', { name: 'Repeat Password' })).toBeVisible({ timeout: 10000 });
        await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible({ timeout: 10000 });
    });

    test('should successfully sign up a buyer user', async ({ page }) => {
        // Generate test data
        const email = generateUniqueEmail('buyer');
        const password = 'SecurePassword123!';

        // Fill out the form
        await fillSignupForm(page, {
            email,
            role: 'buyer',
            password,
            repeatPassword: password,
        });

        // Submit the form
        await submitSignupForm(page);

        // Wait for success and verify
        await waitForSignupSuccess(page);

        // Additional verification that we're on the correct page
        await expect(page).toHaveURL('/auth/sign-up-success');
    });
}); 