import { test } from '@playwright/test';
import {
    generateUniqueEmail,
    fillSignupForm,
    submitSignupForm,
    waitForSignupSuccess,
} from '../utils/auth-helpers';

test.describe('Supplier Signup - Core Features', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the signup page before each test
        await page.goto('/auth/sign-up');
        // Wait for the page to be fully loaded
        await page.waitForLoadState('networkidle');
    });

    test('should successfully sign up a supplier user', async ({ page }) => {
        // Generate test data
        const email = generateUniqueEmail('supplier');
        const password = 'SecurePassword123!';

        // Fill out the form
        await fillSignupForm(page, {
            email,
            role: 'supplier',
            password,
            repeatPassword: password,
        });

        // Submit the form
        await submitSignupForm(page);

        // Wait for success and verify
        await waitForSignupSuccess(page);
    });
}); 