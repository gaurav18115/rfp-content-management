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
        email: 'supplier@test.com',
        password: 'password123',
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
    await page.fill('[data-testid="email-input"]', DEMO_ACCOUNTS.buyer.email);
    await page.fill('[data-testid="password-input"]', DEMO_ACCOUNTS.buyer.password);
    await page.click('[data-testid="login-submit"]');

    if (waitForDashboard) {
        await page.waitForURL('/dashboard');
        await expect(page.locator('text=Dashboard')).toBeVisible();
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
    await page.fill('[data-testid="email-input"]', DEMO_ACCOUNTS.supplier.email);
    await page.fill('[data-testid="password-input"]', DEMO_ACCOUNTS.supplier.password);
    await page.click('[data-testid="login-submit"]');

    if (waitForDashboard) {
        await page.waitForURL('/dashboard');
        await expect(page.locator('text=Dashboard')).toBeVisible();
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
    await page.fill('[data-testid="email-input"]', credentials.email);
    await page.fill('[data-testid="password-input"]', credentials.password);
    await page.click('[data-testid="login-submit"]');

    if (waitForDashboard) {
        await page.waitForURL('/dashboard');
        await expect(page.locator('text=Dashboard')).toBeVisible();
    }
}

/**
 * Logout from the current session
 * @param page - Playwright page object
 * @param waitForRedirect - Whether to wait for redirect to login page
 */
export async function logout(page: Page, waitForRedirect: boolean = true) {
    await page.click('button[aria-label="Logout"]');

    if (waitForRedirect) {
        await page.waitForURL('/auth/login');
        await expect(page.locator('text=Sign In')).toBeVisible();
    }
}

/**
 * Check if user is logged in by verifying dashboard presence
 * @param page - Playwright page object
 * @returns Promise<boolean> - True if logged in, false otherwise
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
    try {
        await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 2000 });
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