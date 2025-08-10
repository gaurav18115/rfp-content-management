import { Page, expect } from '@playwright/test';

/**
 * Generate a unique email address for testing
 * @param prefix - Optional prefix for the email
 * @returns A unique email address
 */
export function generateUniqueEmail(prefix: string = 'test'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}-${timestamp}-${random}@example.com`;
}

/**
 * Fill out the signup form with provided data
 * @param page - Playwright page object
 * @param data - Form data to fill
 */
export async function fillSignupForm(
    page: Page,
    data: {
        email: string;
        role: 'buyer' | 'supplier';
        password: string;
        repeatPassword: string;
    }
) {
    await page.getByLabel('Email').fill(data.email);
    await page.getByLabel('Role').selectOption(data.role);
    await page.locator('#password').fill(data.password);
    await page.locator('#repeat-password').fill(data.repeatPassword);
}

/**
 * Submit the signup form
 * @param page - Playwright page object
 */
export async function submitSignupForm(page: Page) {
    await page.getByRole('button', { name: 'Sign up' }).click();
}

/**
 * Wait for signup to complete and verify success
 * @param page - Playwright page object
 */
export async function waitForSignupSuccess(page: Page) {
    // Wait for loading state
    await expect(page.getByRole('button', { name: 'Creating an account...' })).toBeVisible();

    // Wait for redirect to success page
    await page.waitForURL('/auth/sign-up-success');

    // Verify success page content
    await expect(page.getByRole('heading', { name: 'Thank you for signing up!' })).toBeVisible();
    await expect(page.getByText('Check your email to confirm')).toBeVisible();
} 