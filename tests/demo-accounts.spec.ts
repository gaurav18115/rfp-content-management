import { test, expect } from '@playwright/test';

test.describe('Demo Account Seeding - Issue #5', () => {
    const demoAccounts = [
        {
            email: 'buyer@test.com',
            password: 'password123',
            role: 'buyer',
            company: 'Demo Buyer Corp'
        },
        {
            email: 'supplier@test.com',
            password: 'password123',
            role: 'supplier',
            company: 'Demo Supplier Inc'
        }
    ];

    test.beforeEach(async ({ page }) => {
        // Navigate to the home page before each test
        await page.goto('/');
    });

    test.describe('Demo Account Creation and Login', () => {
        test('should be able to login with buyer demo account', async ({ page }) => {
            // Navigate to login page
            await page.goto('/auth/login');

            // Fill in buyer demo credentials
            await page.fill('[data-testid="email-input"]', 'buyer@test.com');
            await page.fill('[data-testid="password-input"]', 'password123');

            // Submit login form
            await page.click('[data-testid="login-submit"]');

            // Wait for successful login and redirect
            await page.waitForURL('/dashboard');

            // Verify we're logged in and on the dashboard page
            await expect(page.locator('text=Dashboard')).toBeVisible();

            // Check if role-specific content is visible (Create New RFP button for buyers)
            await expect(page.locator('text=Create RFP')).toBeVisible();
        });

        test('should be able to login with supplier demo account', async ({ page }) => {
            // Navigate to login page
            await page.goto('/auth/login');

            // Fill in supplier demo credentials
            await page.fill('[data-testid="email-input"]', 'supplier@test.com');
            await page.fill('[data-testid="password-input"]', 'password123');

            // Submit login form
            await page.click('[data-testid="login-submit"]');

            // Wait for successful login and redirect
            await page.waitForURL('/dashboard');

            // Verify we're logged in and on the dashboard page
            await expect(page.locator('text=Dashboard')).toBeVisible();

            // Check if role-specific content is visible (Browse RFPs button for suppliers)
            await expect(page.locator('text=Browse RFPs')).toBeVisible();
        });

        test('should reject invalid credentials', async ({ page }) => {
            // Navigate to login page
            await page.goto('/auth/login');

            // Fill in invalid credentials
            await page.fill('[data-testid="email-input"]', 'invalid@test.com');
            await page.fill('[data-testid="password-input"]', 'wrongpassword');

            // Submit login form
            await page.click('[data-testid="login-submit"]');

            // Verify error message is displayed
            await expect(page.locator('text=Invalid login credentials')).toBeVisible();
        });
    });

    test.describe('Role-Based Access Control (RBAC)', () => {
        test('buyer should have access to buyer-specific features', async ({ page }) => {
            // Login as buyer
            await page.goto('/auth/login');
            await page.fill('[data-testid="email-input"]', 'buyer@test.com');
            await page.fill('[data-testid="password-input"]', 'password123');
            await page.click('[data-testid="login-submit"]');
            await page.waitForURL('/dashboard');

            // Navigate to buyer-specific pages
            await page.goto('/rfps/create');
            await expect(page.locator('h1')).toContainText('Create New RFP');

            await page.goto('/rfps/my');
            await expect(page.locator('h1')).toContainText('My RFPs');
        });

        test('supplier should have access to supplier-specific features', async ({ page }) => {
            // Login as supplier
            await page.goto('/auth/login');
            await page.fill('[data-testid="email-input"]', 'supplier@test.com');
            await page.fill('[data-testid="password-input"]', 'password123');
            await page.click('[data-testid="login-submit"]');
            await page.waitForURL('/dashboard');

            // Navigate to supplier-specific pages
            await page.goto('/rfps');
            await expect(page.locator('h1')).toContainText('Available RFPs');

            await page.goto('/responses');
            await expect(page.locator('h1')).toContainText('My Responses');
        });

        test('buyer should not have access to supplier features', async ({ page }) => {
            // Login as buyer
            await page.goto('/auth/login');
            await page.fill('[data-testid="email-input"]', 'buyer@test.com');
            await page.fill('[data-testid="password-input"]', 'password123');
            await page.click('[data-testid="login-submit"]');
            await page.waitForURL('/dashboard');

            // Try to access supplier-specific page
            await page.goto('/responses');

            // Should be redirected or show access denied
            await expect(page.locator('text=Access Denied')).toBeVisible();
        });

        test('supplier should not have access to buyer features', async ({ page }) => {
            // Login as supplier
            await page.goto('/auth/login');
            await page.fill('[data-testid="email-input"]', 'supplier@test.com');
            await page.fill('[data-testid="password-input"]', 'password123');
            await page.click('[data-testid="login-submit"]');
            await page.waitForURL('/dashboard');

            // Try to access buyer-specific page
            await page.goto('/rfps/create');

            // Should be redirected or show access denied
            await expect(page.locator('text=Access Denied')).toBeVisible();
        });
    });

    test.describe('User Profile Management', () => {
        test('should display correct user profile information', async ({ page }) => {
            // Login as buyer
            await page.goto('/auth/login');
            await page.fill('[data-testid="email-input"]', 'buyer@test.com');
            await page.fill('[data-testid="password-input"]', 'password123');
            await page.click('[data-testid="login-submit"]');
            await page.waitForURL('/dashboard');

            // Navigate to profile page
            await page.goto('/profile');

            // Verify profile information
            await expect(page.locator('text=buyer@test.com')).toBeVisible();
            await expect(page.locator('text=Demo Buyer')).toBeVisible();
            await expect(page.locator('text=Demo Buyer Corp')).toBeVisible();
            await expect(page.locator('text=buyer')).toBeVisible();
        });

        test('should allow profile updates', async ({ page }) => {
            // Login as supplier
            await page.goto('/auth/login');
            await page.fill('[data-testid="email-input"]', 'supplier@test.com');
            await page.fill('[data-testid="password-input"]', 'password123');
            await page.click('[data-testid="login-submit"]');
            await page.waitForURL('/dashboard');

            // Navigate to profile page
            await page.goto('/profile');

            // Update profile information
            await page.fill('[data-testid="first-name-input"]', 'Updated');
            await page.fill('[data-testid="last-name-input"]', 'Supplier');
            await page.fill('[data-testid="company-name-input"]', 'Updated Supplier Inc');

            // Save changes
            await page.click('[data-testid="profile-submit"]');

            // Verify success message
            await expect(page.locator('text=Profile updated successfully')).toBeVisible();

            // Verify updated information is displayed
            await expect(page.locator('text=Updated Supplier')).toBeVisible();
            await expect(page.locator('text=Updated Supplier Inc')).toBeVisible();
        });
    });

    test.describe('Session Management', () => {
        test('should maintain session across page navigation', async ({ page }) => {
            // Login as buyer
            await page.goto('/auth/login');
            await page.fill('[data-testid="email-input"]', 'buyer@test.com');
            await page.fill('[data-testid="password-input"]', 'password123');
            await page.click('[data-testid="login-submit"]');
            await page.waitForURL('/dashboard');

            // Navigate to different pages
            await page.goto('/rfps');
            await expect(page.locator('text=Available RFPs')).toBeVisible();

            await page.goto('/profile');
            await expect(page.locator('text=buyer@test.com')).toBeVisible();

            await page.goto('/dashboard');
            await expect(page.locator('text=Dashboard')).toBeVisible();
        });

        test('should logout successfully', async ({ page }) => {
            // Login as supplier
            await page.goto('/auth/login');
            await page.fill('[data-testid="email-input"]', 'supplier@test.com');
            await page.fill('[data-testid="password-input"]', 'password123');
            await page.click('[data-testid="login-submit"]');
            await page.waitForURL('/dashboard');

            // Click logout button
            await page.click('button[aria-label="Logout"]');

            // Should be redirected to login page
            await page.waitForURL('/auth/login');
            await expect(page.locator('text=Sign In')).toBeVisible();
        });
    });

    test.describe('API Endpoint Testing', () => {
        test('should access protected API endpoints with valid session', async ({ page }) => {
            // Login as buyer
            await page.goto('/auth/login');
            await page.fill('[data-testid="email-input"]', 'buyer@test.com');
            await page.fill('[data-testid="password-input"]', 'password123');
            await page.click('[data-testid="login-submit"]');
            await page.waitForURL('/dashboard');

            // Test API endpoint access
            const response = await page.request.get('/api/profile/me');
            expect(response.status()).toBe(200);

            const profileData = await response.json();
            expect(profileData.user.email).toBe('buyer@test.com');
            expect(profileData.user.user_metadata.role).toBe('buyer');
        });

        test('should reject API access without authentication', async ({ page }) => {
            // Try to access protected endpoint without login
            const response = await page.request.get('/api/profile/me');
            expect(response.status()).toBe(401);
        });
    });

    test.describe('Idempotency Testing', () => {
        test('should handle multiple login attempts gracefully', async ({ page }) => {
            // Login as buyer multiple times
            for (let i = 0; i < 3; i++) {
                await page.goto('/auth/login');
                await page.fill('[data-testid="email-input"]', 'buyer@test.com');
                await page.fill('[data-testid="password-input"]', 'password123');
                await page.click('[data-testid="login-submit"]');
                await page.waitForURL('/dashboard');

                // Verify successful login
                await expect(page.locator('text=Dashboard')).toBeVisible();

                // Logout for next iteration
                await page.click('button[aria-label="Logout"]');
                await page.waitForURL('/auth/login');
            }
        });
    });

    test.describe('Error Handling', () => {
        test('should handle network errors gracefully', async ({ page }) => {
            // Simulate offline mode by blocking network requests
            await page.route('**/*', route => route.abort());

            // Try to login
            await page.goto('/auth/login');
            await page.fill('[data-testid="email-input"]', 'buyer@test.com');
            await page.fill('[data-testid="password-input"]', 'password123');
            await page.click('[data-testid="login-submit"]');

            // Should show appropriate error message
            await expect(page.locator('text=Network error')).toBeVisible();
        });

        test('should handle server errors gracefully', async ({ page }) => {
            // Mock server error response
            await page.route('/api/auth/login', route =>
                route.fulfill({ status: 500, body: 'Internal Server Error' })
            );

            // Try to login
            await page.goto('/auth/login');
            await page.fill('[data-testid="email-input"]', 'buyer@test.com');
            await page.fill('[data-testid="password-input"]', 'password123');
            await page.click('[data-testid="login-submit"]');

            // Should show appropriate error message
            await expect(page.locator('text=Server error')).toBeVisible();
        });
    });
}); 