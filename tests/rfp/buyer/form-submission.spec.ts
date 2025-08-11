import { test, expect } from '@playwright/test';

test.describe('RFP Form Submission - Core Features', () => {
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

    test('should fill out and submit RFP form successfully', async ({ page }) => {
        await page.goto('/rfps/create');

        // Fill out the form with test data
        await page.getByLabel('RFP Title *').fill('Test Website Development Project');
        await page.getByLabel('Category *').selectOption('technology');
        await page.getByLabel('Description *').fill('We need a modern website for our company with e-commerce functionality.');
        await page.getByLabel('Company Name *').fill('Test Company Inc.');
        await page.getByLabel('Location').fill('Remote');
        await page.getByLabel('Budget Range').selectOption('10k-50k');

        // Set deadline to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toISOString().split('T')[0];
        await page.getByLabel('Submission Deadline *').fill(tomorrowString);

        await page.getByLabel('Requirements & Specifications').fill('React frontend, Node.js backend, PostgreSQL database');
        await page.getByLabel('Additional Information').fill('Must be completed within 3 months');

        // Submit the form
        await page.getByRole('button', { name: 'Create RFP' }).click();

        // Wait for success message
        await expect(page.locator('text=RFP Created Successfully!')).toBeVisible();
        await expect(page.locator('text=Your RFP has been created and is now visible to suppliers.')).toBeVisible();

        // Verify form is reset
        await expect(page.getByLabel('RFP Title *')).toHaveValue('');
    });

    test('should handle form submission with minimal data', async ({ page }) => {
        await page.goto('/rfps/create');

        // Fill only required fields
        await page.getByLabel('RFP Title *').fill('Minimal RFP Test');
        await page.getByLabel('Category *').selectOption('services');
        await page.getByLabel('Description *').fill('Basic service requirement');
        await page.getByLabel('Company Name *').fill('Minimal Corp');

        // Set deadline to next week
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekString = nextWeek.toISOString().split('T')[0];
        await page.getByLabel('Submission Deadline *').fill(nextWeekString);

        // Submit form
        await page.getByRole('button', { name: 'Create RFP' }).click();

        // Should show success message
        await expect(page.locator('text=RFP Created Successfully!')).toBeVisible();
    });
}); 