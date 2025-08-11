import { test, expect } from '@playwright/test';

test.describe('RFP Form Display - Core Features', () => {
    const buyerCredentials = {
        email: 'testbuyer@gmail.com',
        password: 'SecurePassword123!'
    };

    test.beforeEach(async ({ page }) => {
        // Login as buyer before each test
        await page.goto('/auth/login');

        // Fill in buyer credentials
        await page.fill('[data-testid="email-input"]', buyerCredentials.email);
        await page.fill('[data-testid="password-input"]', buyerCredentials.password);

        // Submit login form
        await page.click('[data-testid="login-submit"]');

        // Wait for successful login and redirect to dashboard
        await page.waitForURL('/dashboard');

        // Verify we're logged in
        await expect(page.locator('text=Dashboard')).toBeVisible();
    });

    test('should navigate to RFP creation page', async ({ page }) => {
        // Navigate to RFP creation page
        await page.goto('/rfps/create');

        // Verify we're on the correct page
        await expect(page.locator('h1')).toContainText('Create New RFP');
        await expect(page.locator('text=RFP Details')).toBeVisible();
    });

    test('should display all required form fields', async ({ page }) => {
        await page.goto('/rfps/create');

        // Check for required fields
        await expect(page.getByLabel('RFP Title *')).toBeVisible();
        await expect(page.getByLabel('Category *')).toBeVisible();
        await expect(page.getByLabel('Description *')).toBeVisible();
        await expect(page.getByLabel('Company Name *')).toBeVisible();
        await expect(page.getByLabel('Submission Deadline *')).toBeVisible();

        // Check for optional fields
        await expect(page.getByLabel('Location')).toBeVisible();
        await expect(page.getByLabel('Budget Range')).toBeVisible();
        await expect(page.getByLabel('Requirements & Specifications')).toBeVisible();
        await expect(page.getByLabel('Additional Information')).toBeVisible();
    });
}); 