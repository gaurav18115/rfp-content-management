import { test, expect } from '@playwright/test';

test.describe('RFP Creation', () => {
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

    test('should validate required fields', async ({ page }) => {
        await page.goto('/rfps/create');

        // Try to submit empty form
        await page.getByRole('button', { name: 'Create RFP' }).click();

        // Should show validation errors for required fields
        // Note: HTML5 validation will prevent submission, so we check if form is still on page
        await expect(page.locator('h1')).toContainText('Create New RFP');
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

    test('should show loading state during submission', async ({ page }) => {
        await page.goto('/rfps/create');

        // Fill out required fields
        await page.getByLabel('RFP Title *').fill('Loading Test RFP');
        await page.getByLabel('Category *').selectOption('consulting');
        await page.getByLabel('Description *').fill('Testing loading state');
        await page.getByLabel('Company Name *').fill('Loading Test Corp');

        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekString = nextWeek.toISOString().split('T')[0];
        await page.getByLabel('Submission Deadline *').fill(nextWeekString);

        // Submit form and check loading state
        await page.getByRole('button', { name: 'Create RFP' }).click();

        // Button should show loading state briefly
        await expect(page.getByRole('button', { name: 'Creating...' })).toBeVisible();

        // Wait for success message
        await expect(page.locator('text=RFP Created Successfully!')).toBeVisible();
    });

    test('should navigate back to My RFPs page', async ({ page }) => {
        await page.goto('/rfps/create');

        // Click back button
        await page.getByRole('button', { name: 'Back to My RFPs' }).click();

        // Should navigate to My RFPs page
        await expect(page).toHaveURL('/rfps/my');
        await expect(page.locator('h1')).toContainText('My RFPs');
    });

    test('should cancel RFP creation', async ({ page }) => {
        await page.goto('/rfps/create');

        // Fill some data
        await page.getByLabel('RFP Title *').fill('Cancel Test RFP');

        // Click cancel button
        await page.getByRole('button', { name: 'Cancel' }).click();

        // Should navigate to My RFPs page
        await expect(page).toHaveURL('/rfps/my');
        await expect(page.locator('h1')).toContainText('My RFPs');
    });

    test('should handle different category selections', async ({ page }) => {
        await page.goto('/rfps/create');

        // Test different categories
        const categories = ['technology', 'marketing', 'design', 'consulting', 'manufacturing', 'services', 'other'];

        for (const category of categories) {
            await page.getByLabel('Category *').selectOption(category);
            await expect(page.getByLabel('Category *')).toHaveValue(category);
        }
    });

    test('should handle different budget range selections', async ({ page }) => {
        await page.goto('/rfps/create');

        // Test different budget ranges
        const budgetRanges = ['under-10k', '10k-50k', '50k-100k', '100k-500k', 'over-500k', 'negotiable'];

        for (const budget of budgetRanges) {
            await page.getByLabel('Budget Range').selectOption(budget);
            await expect(page.getByLabel('Budget Range')).toHaveValue(budget);
        }
    });
}); 