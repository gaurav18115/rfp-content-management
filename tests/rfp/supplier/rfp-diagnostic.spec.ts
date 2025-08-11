import { test, expect } from '@playwright/test';
import { loginAsSupplier } from '@/tests/utils/auth-helpers';

test.describe('RFP Diagnostic', () => {
    test('should check what is on the RFP page', async ({ page }) => {
        // Listen for console errors
        const consoleErrors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        // Listen for page errors
        const pageErrors: string[] = [];
        page.on('pageerror', error => {
            pageErrors.push(error.message);
        });

        // Listen for request failures
        const failedRequests: string[] = [];
        page.on('requestfailed', request => {
            failedRequests.push(`${request.method()} ${request.url()} - ${request.failure()?.errorText || 'Unknown error'}`);
        });

        // Login as supplier
        await loginAsSupplier(page, { waitForDashboard: true });

        // Navigate to the RFPs page
        await page.goto('/rfps');
        await page.waitForLoadState('networkidle');

        // Wait a bit more for any dynamic content
        await page.waitForTimeout(3000);

        // Take a screenshot to see what's there
        await page.screenshot({ path: 'rfp-page-diagnostic.png', fullPage: true });

        // Check what elements are actually present
        console.log('Page URL:', page.url());
        console.log('Page title:', await page.title());

        // Look for any content on the page
        const bodyText = await page.locator('body').textContent();
        console.log('Body text (first 500 chars):', bodyText?.substring(0, 500));

        // Check for RFP cards
        const rfpCards = page.locator('[data-testid="rfp-card"]');
        const cardCount = await rfpCards.count();
        console.log('RFP card count:', cardCount);

        // Check for any other elements that might indicate RFPs
        const rfpElements = page.locator('text=/RFP|rfp/i');
        const rfpElementCount = await rfpElements.count();
        console.log('RFP text elements count:', rfpElementCount);

        // Check for any loading states or error messages
        const loadingElements = page.locator('text=/loading|Loading|Loading.../i');
        const loadingCount = await loadingElements.count();
        console.log('Loading elements count:', loadingCount);

        const errorElements = page.locator('text=/error|Error|No data|No RFPs/i');
        const errorCount = await errorElements.count();
        console.log('Error elements count:', errorCount);

        // Get the actual error messages
        for (let i = 0; i < errorCount; i++) {
            const errorElement = errorElements.nth(i);
            const errorText = await errorElement.textContent();
            console.log(`Error ${i}:`, errorText);
        }

        // Check for Select component errors specifically
        const selectElements = page.locator('select, [role="combobox"], [data-testid*="select"], [class*="select"]');
        const selectCount = await selectElements.count();
        console.log('Select elements count:', selectCount);

        // Check for any Select-related error messages
        const selectErrors = page.locator('text=/select|Select|SELECT|dropdown|Dropdown|DROPDOWN/i');
        const selectErrorCount = await selectErrors.count();
        console.log('Select-related text elements count:', selectErrorCount);

        // Look for any error styling or error classes
        const errorStyledElements = page.locator('[class*="error"], [class*="Error"], [class*="invalid"], [class*="Invalid"]');
        const errorStyledCount = await errorStyledElements.count();
        console.log('Error-styled elements count:', errorStyledCount);

        // Check for any aria-invalid attributes
        const ariaInvalidElements = page.locator('[aria-invalid="true"]');
        const ariaInvalidCount = await ariaInvalidElements.count();
        console.log('Aria-invalid elements count:', ariaInvalidCount);

        // Check if there are any buttons or interactive elements
        const buttons = page.locator('button');
        const buttonCount = await buttons.count();
        console.log('Button count:', buttonCount);

        // List all button texts
        for (let i = 0; i < buttonCount; i++) {
            const button = buttons.nth(i);
            const buttonText = await button.textContent();
            console.log(`Button ${i}:`, buttonText);
        }

        // Check for any data-testid attributes
        const testIds = page.locator('[data-testid]');
        const testIdCount = await testIds.count();
        console.log('Data-testid elements count:', testIdCount);

        // List all data-testid values
        for (let i = 0; i < testIdCount; i++) {
            const element = testIds.nth(i);
            const testId = await element.getAttribute('data-testid');
            console.log(`Data-testid ${i}:`, testId);
        }

        // Look for any console errors or network errors in the DOM
        const consoleErrorElements = page.locator('text=/console|Console|CONSOLE|network|Network|NETWORK/i');
        const consoleErrorElementCount = await consoleErrorElements.count();
        console.log('Console/Network error text count:', consoleErrorElementCount);

        // Log captured console errors
        console.log('=== CONSOLE ERRORS ===');
        consoleErrors.forEach((error, index) => {
            console.log(`Console Error ${index}:`, error);
        });

        // Log captured page errors
        console.log('=== PAGE ERRORS ===');
        pageErrors.forEach((error, index) => {
            console.log(`Page Error ${index}:`, error);
        });

        // Log failed requests
        console.log('=== FAILED REQUESTS ===');
        failedRequests.forEach((request, index) => {
            console.log(`Failed Request ${index}:`, request);
        });

        // Check if there are any network requests to the API
        const apiRequests = page.locator('text=/api\/rfps|rfps\/browse/i');
        const apiRequestCount = await apiRequests.count();
        console.log('API request text count:', apiRequestCount);

        // This test should always pass - it's just for diagnosis
        expect(true).toBe(true);
    });
}); 