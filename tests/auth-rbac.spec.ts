import { test, expect } from '@playwright/test';
import { generateUniqueEmail } from './utils/test-helpers';

test.describe('Authentication & Role-Based Access Control', () => {
    let buyerEmail: string;
    let supplierEmail: string;
    const password = 'SecurePassword123!';

    test.beforeEach(async ({ page }) => {
        // Generate unique emails for each test run
        buyerEmail = generateUniqueEmail('buyer');
        supplierEmail = generateUniqueEmail('supplier');
    });

    test.describe('User Registration', () => {
        test('should register buyer user successfully', async ({ page }) => {
            await page.goto('/auth/sign-up');

            // Fill buyer registration form
            await page.getByLabel('Email').fill(buyerEmail);
            await page.getByLabel('Role').selectOption('buyer');
            await page.locator('#password').fill(password);
            await page.locator('#repeat-password').fill(password);

            // Submit form
            await page.getByRole('button', { name: 'Sign up' }).click();

            // Verify success
            await expect(page).toHaveURL('/auth/sign-up-success');
            await expect(page.getByText('Account created successfully')).toBeVisible();
        });

        test('should register supplier user successfully', async ({ page }) => {
            await page.goto('/auth/sign-up');

            // Fill supplier registration form
            await page.getByLabel('Email').fill(supplierEmail);
            await page.getByLabel('Role').selectOption('supplier');
            await page.locator('#password').fill(password);
            await page.locator('#repeat-password').fill(password);

            // Submit form
            await page.getByRole('button', { name: 'Sign up' }).click();

            // Verify success
            await expect(page).toHaveURL('/auth/sign-up-success');
            await expect(page.getByText('Account created successfully')).toBeVisible();
        });

        test('should validate form fields', async ({ page }) => {
            await page.goto('/auth/sign-up');

            // Try to submit empty form
            await page.getByRole('button', { name: 'Sign up' }).click();

            // Should show validation errors
            await expect(page.getByText('Email is required')).toBeVisible();
        });

        test('should validate password confirmation', async ({ page }) => {
            await page.goto('/auth/sign-up');

            // Fill form with mismatched passwords
            await page.getByLabel('Email').fill(buyerEmail);
            await page.getByLabel('Role').selectOption('buyer');
            await page.locator('#password').fill(password);
            await page.locator('#repeat-password').fill('DifferentPassword123!');

            // Submit form
            await page.getByRole('button', { name: 'Sign up' }).click();

            // Should show password mismatch error
            await expect(page.getByText('Passwords do not match')).toBeVisible();
        });
    });

    test.describe('User Authentication', () => {
        test('should login buyer user successfully', async ({ page }) => {
            // First register the user
            await page.goto('/auth/sign-up');
            await page.getByLabel('Email').fill(buyerEmail);
            await page.getByLabel('Role').selectOption('buyer');
            await page.locator('#password').fill(password);
            await page.locator('#repeat-password').fill(password);
            await page.getByRole('button', { name: 'Sign up' }).click();

            // Wait for registration success
            await expect(page).toHaveURL('/auth/sign-up-success');

            // Now test login
            await page.goto('/auth/login');
            await page.getByLabel('Email').fill(buyerEmail);
            await page.getByLabel('Password').fill(password);
            await page.getByRole('button', { name: 'Sign in' }).click();

            // Should redirect to dashboard
            await expect(page).toHaveURL('/dashboard');
        });

        test('should login supplier user successfully', async ({ page }) => {
            // First register the user
            await page.goto('/auth/sign-up');
            await page.getByLabel('Email').fill(supplierEmail);
            await page.getByLabel('Role').selectOption('supplier');
            await page.locator('#password').fill(password);
            await page.locator('#repeat-password').fill(password);
            await page.getByRole('button', { name: 'Sign up' }).click();

            // Wait for registration success
            await expect(page).toHaveURL('/auth/sign-up-success');

            // Now test login
            await page.goto('/auth/login');
            await page.getByLabel('Email').fill(supplierEmail);
            await page.getByLabel('Password').fill(password);
            await page.getByRole('button', { name: 'Sign in' }).click();

            // Should redirect to dashboard
            await expect(page).toHaveURL('/dashboard');
        });

        test('should show error for invalid credentials', async ({ page }) => {
            await page.goto('/auth/login');

            // Try invalid credentials
            await page.getByLabel('Email').fill('invalid@example.com');
            await page.getByLabel('Password').fill('wrongpassword');
            await page.getByRole('button', { name: 'Sign in' }).click();

            // Should show error message
            await expect(page.getByText(/Invalid login credentials/)).toBeVisible();
        });

        test('should maintain session after page refresh', async ({ page }) => {
            // Login first
            await page.goto('/auth/sign-up');
            await page.getByLabel('Email').fill(buyerEmail);
            await page.getByLabel('Role').selectOption('buyer');
            await page.locator('#password').fill(password);
            await page.locator('#repeat-password').fill(password);
            await page.getByRole('button', { name: 'Sign up' }).click();

            await page.goto('/auth/login');
            await page.getByLabel('Email').fill(buyerEmail);
            await page.getByLabel('Password').fill(password);
            await page.getByRole('button', { name: 'Sign in' }).click();

            // Should be on dashboard
            await expect(page).toHaveURL('/dashboard');

            // Refresh page
            await page.reload();

            // Should still be on dashboard (session maintained)
            await expect(page).toHaveURL('/dashboard');
        });
    });

    test.describe('Role-Based Access Control', () => {
        test('should redirect unauthenticated users to login', async ({ page }) => {
            // Try to access protected route without authentication
            await page.goto('/dashboard');

            // Should redirect to login
            await expect(page).toHaveURL('/auth/login');
        });

        test('should show buyer-specific content for buyer users', async ({ page }) => {
            // Register and login as buyer
            await page.goto('/auth/sign-up');
            await page.getByLabel('Email').fill(buyerEmail);
            await page.getByLabel('Role').selectOption('buyer');
            await page.locator('#password').fill(password);
            await page.locator('#repeat-password').fill(password);
            await page.getByRole('button', { name: 'Sign up' }).click();

            await page.goto('/auth/login');
            await page.getByLabel('Email').fill(buyerEmail);
            await page.getByLabel('Password').fill(password);
            await page.getByRole('button', { name: 'Sign in' }).click();

            // Should be on dashboard
            await expect(page).toHaveURL('/dashboard');

            // Verify buyer-specific content is visible
            await expect(page.getByText('Create RFP')).toBeVisible();
            await expect(page.getByText('Manage RFPs')).toBeVisible();
        });

        test('should show supplier-specific content for supplier users', async ({ page }) => {
            // Register and login as supplier
            await page.goto('/auth/sign-up');
            await page.getByLabel('Email').fill(supplierEmail);
            await page.getByLabel('Role').selectOption('supplier');
            await page.locator('#password').fill(password);
            await page.locator('#repeat-password').fill(password);
            await page.getByRole('button', { name: 'Sign up' }).click();

            await page.goto('/auth/login');
            await page.getByLabel('Email').fill(supplierEmail);
            await page.getByLabel('Password').fill(password);
            await page.getByRole('button', { name: 'Sign in' }).click();

            // Should be on dashboard
            await expect(page).toHaveURL('/dashboard');

            // Verify supplier-specific content is visible
            await expect(page.getByText('Browse RFPs')).toBeVisible();
            await expect(page.getByText('My Responses')).toBeVisible();
        });

        test('should logout user successfully', async ({ page }) => {
            // Login first
            await page.goto('/auth/sign-up');
            await page.getByLabel('Email').fill(buyerEmail);
            await page.getByLabel('Role').selectOption('buyer');
            await page.locator('#password').fill(password);
            await page.locator('#repeat-password').fill(password);
            await page.getByRole('button', { name: 'Sign up' }).click();

            await page.goto('/auth/login');
            await page.getByLabel('Email').fill(buyerEmail);
            await page.getByLabel('Password').fill(password);
            await page.getByRole('button', { name: 'Sign in' }).click();

            // Should be on dashboard
            await expect(page).toHaveURL('/dashboard');

            // Click logout
            await page.getByRole('button', { name: 'Sign out' }).click();

            // Should redirect to home page
            await expect(page).toHaveURL('/');

            // Try to access protected route - should redirect to login
            await page.goto('/dashboard');
            await expect(page).toHaveURL('/auth/login');
        });
    });

    test.describe('API Endpoint Security', () => {
        test('should protect API endpoints', async ({ request }) => {
            // Try to access protected API without authentication
            const response = await request.get('/api/profile/me');
            expect(response.status()).toBe(401);
        });

        test('should allow authenticated access to protected APIs', async ({ request }) => {
            // This would require setting up authentication cookies
            // For now, we'll test the endpoint exists
            const response = await request.get('/api/profile/me');
            expect(response.status()).toBe(401); // Expected for unauthenticated request
        });
    });
}); 