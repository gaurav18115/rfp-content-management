# Playwright Tests for RFP Content Management

This directory contains focused end-to-end tests for the core signup functionality of the RFP Content Management application using Playwright.

## Test Structure

### Core Test Files

- **`signup.spec.ts`** - Core signup feature tests covering all essential scenarios
- **`utils/test-helpers.ts`** - Essential test utility functions for signup testing

### Test Coverage

The signup tests cover the core functionality:

#### Form Display

- ✅ Form renders with all required fields (email, role, password, repeat password)
- ✅ Submit button is present and functional

#### User Registration

- ✅ Buyer user signup flow
- ✅ Supplier user signup flow
- ✅ Unique email generation for testing
- ✅ Successful redirect to confirmation page

#### Validation

- ✅ Password mismatch validation
- ✅ Error message display for validation failures

## Running Tests

### Prerequisites

1. Install dependencies:

   ```bash
   npm install
   ```

2. Install Playwright browsers:

   ```bash
   npm run test:install
   ```

### Test Commands

#### Run all tests

```bash
npm run test
```

#### Run specific test file

```bash
npx playwright test signup.spec.ts
```

#### Run tests in headed mode (see browser)

```bash
npm run test:headed
```

#### Run tests in debug mode

```bash
npm run test:debug
```

### Test Reports

After running tests, view the HTML report:

```bash
npm run test:report
```

## Test Configuration

The tests are configured in `playwright.config.ts` with:

- **Base URL**: `http://localhost:3000`
- **Web Server**: Automatically starts `npm run dev` before tests
- **Browser**: Chrome (Chromium) for focused testing
- **Screenshots**: Captured on test failure
- **Videos**: Recorded on test failure

## Test Utilities

The `test-helpers.ts` file provides essential functions:

- `generateUniqueEmail()` - Creates unique test emails
- `fillSignupForm()` - Fills out the signup form
- `submitSignupForm()` - Submits the form
- `waitForSignupSuccess()` - Waits for signup completion

## Writing New Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Test implementation
  });
});
```

### Using Test Utilities

```typescript
import { generateUniqueEmail, fillSignupForm } from './utils/test-helpers';

test('should test signup', async ({ page }) => {
  const email = generateUniqueEmail('test');
  await fillSignupForm(page, { email, role: 'buyer', password: 'test123', repeatPassword: 'test123' });
});
```

## Debugging Tests

### Debug Mode

```bash
npm run test:debug
```

### Screenshots and Videos

Check the `test-results/` directory for:

- Screenshots of failed tests
- Video recordings of test runs

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure port 3000 is available
2. **Browser installation**: Run `npm run test:install` if browsers are missing
3. **Network timeouts**: Check if the dev server is starting correctly

### Getting Help

- Check Playwright documentation: <https://playwright.dev/>
- Review test output and error messages
- Use debug mode to step through tests
