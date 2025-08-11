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
    await page.getByTestId('email-input').fill(data.email);
    await page.getByTestId('role-select').selectOption(data.role);
    await page.getByTestId('password-input').fill(data.password);
    await page.getByTestId('repeat-password-input').fill(data.repeatPassword);
}

/**
 * Submit the signup form
 * @param page - Playwright page object
 */
export async function submitSignupForm(page: Page) {
    await page.getByTestId('signup-submit').click();
}

/**
 * Wait for signup to complete and verify success
 * @param page - Playwright page object
 */
export async function waitForSignupSuccess(page: Page) {
    // Wait for loading state
    await expect(page.getByTestId('signup-submit')).toBeVisible();

    // Wait for redirect to success page
    await page.waitForURL('/auth/sign-up-success');

    // Verify success page content
    await expect(page.getByTestId('signup-success-heading')).toBeVisible();
    await expect(page.getByTestId('signup-success-message')).toBeVisible();
}

/**
 * Demo account credentials for testing
 */
export const DEMO_ACCOUNTS = {
    buyer: {
        email: 'buyer@test.com',
        password: 'password123',
        role: 'buyer',
        company: 'Demo Buyer Corp'
    },
    supplier: {
        email: 'testsupplier2@test.com',
        password: 'SecurePassword123!',
        role: 'supplier',
        company: 'Demo Supplier Inc'
    }
} as const;

/**
 * Login as a demo buyer
 * @param page - Playwright page object
 * @param options - Optional configuration
 */
export async function loginAsBuyer(
    page: Page,
    options: {
        redirectTo?: string;
        waitForDashboard?: boolean;
    } = {}
) {
    const { redirectTo = '/auth/login', waitForDashboard = true } = options;

    await page.goto(redirectTo);
    await page.getByTestId('email-input').fill(DEMO_ACCOUNTS.buyer.email);
    await page.getByTestId('password-input').fill(DEMO_ACCOUNTS.buyer.password);
    await page.getByTestId('login-submit').click();

    if (waitForDashboard) {
        await page.waitForURL('/dashboard');
        await expect(page.getByTestId('dashboard-heading')).toBeVisible();
    }
}

/**
 * Login as a demo supplier
 * @param page - Playwright page object
 * @param options - Optional configuration
 */
export async function loginAsSupplier(
    page: Page,
    options: {
        redirectTo?: string;
        waitForDashboard?: boolean;
    } = {}
) {
    const { redirectTo = '/auth/login', waitForDashboard = true } = options;

    await page.goto(redirectTo);
    await page.getByTestId('email-input').fill(DEMO_ACCOUNTS.supplier.email);
    await page.getByTestId('password-input').fill(DEMO_ACCOUNTS.supplier.password);
    await page.getByTestId('login-submit').click();

    if (waitForDashboard) {
        await page.waitForURL('/dashboard');
        await expect(page.getByTestId('dashboard-heading')).toBeVisible();
    }
}

/**
 * Login with custom credentials
 * @param page - Playwright page object
 * @param credentials - Login credentials
 * @param options - Optional configuration
 */
export async function loginWithCredentials(
    page: Page,
    credentials: {
        email: string;
        password: string;
    },
    options: {
        redirectTo?: string;
        waitForDashboard?: boolean;
    } = {}
) {
    const { redirectTo = '/auth/login', waitForDashboard = true } = options;

    await page.goto(redirectTo);
    await page.getByTestId('email-input').fill(credentials.email);
    await page.getByTestId('password-input').fill(credentials.password);
    await page.getByTestId('login-submit').click();

    if (waitForDashboard) {
        await page.waitForURL('/dashboard');
        await expect(page.getByTestId('dashboard-heading')).toBeVisible();
    }
}

/**
 * Logout from the current session
 * @param page - Playwright page object
 * @param waitForRedirect - Whether to wait for redirect to login page
 */
export async function logout(page: Page, waitForRedirect: boolean = true) {
    await page.getByTestId('logout-button').click();

    if (waitForRedirect) {
        await page.waitForURL('/auth/login');
        await expect(page.getByTestId('login-page-heading')).toBeVisible();
    }
}

/**
 * Check if user is logged in by verifying dashboard presence
 * @param page - Playwright page object
 * @returns Promise<boolean> - True if logged in, false otherwise
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
    try {
        await expect(page.getByTestId('dashboard-heading')).toBeVisible({ timeout: 2000 });
        return true;
    } catch {
        return false;
    }
}

/**
 * Ensure user is logged in, login if not
 * @param page - Playwright page object
 * @param role - Role to login as ('buyer' or 'supplier')
 */
export async function ensureLoggedIn(page: Page, role: 'buyer' | 'supplier') {
    if (!(await isLoggedIn(page))) {
        if (role === 'buyer') {
            await loginAsBuyer(page);
        } else {
            await loginAsSupplier(page);
        }
    }
} 