# Playwright Tests for RFP Content Management

This directory contains organized end-to-end tests for the RFP Content Management application using Playwright. Tests are organized by feature area and follow strict guidelines for maintainability and focus.

## Test Organization Guidelines

### Directory Structure

All tests must be organized into logical directories by feature area:

- **`auth/`** - Authentication and user management tests
- **`rfp/`** - RFP creation and management tests  
- **`demo/`** - Demo account functionality tests
- **`utils/`** - Test utility functions and helpers

### Test File Rules

Each test file must follow these strict guidelines:

1. **Maximum 2 tests per file** - Keep files focused and maintainable
2. **Core features only** - Focus on happy flow and essential functionality
3. **Skip corner cases** - Avoid edge cases and complex scenarios for now
4. **Single responsibility** - Each file should test one specific feature area

## Test Structure

### Authentication Tests (`auth/`)

- **`signup-form.spec.ts`** - Signup form display and buyer registration (2 tests)
- **`supplier-signup.spec.ts`** - Supplier registration flow (1 test)
- **`basic-auth.spec.ts`** - User registration and role-based access (2 tests)

### RFP Management Tests (`rfp/`)

- **`form-display.spec.ts`** - RFP form navigation and field display (2 tests)
- **`form-submission.spec.ts`** - RFP form submission and success handling (2 tests)

### Demo Account Tests (`demo/`)

- **`buyer-access.spec.ts`** - Demo buyer login and core features (2 tests)
- **`supplier-access.spec.ts`** - Demo supplier login and core features (2 tests)

### Test Utilities (`utils/`)

- **`auth-helpers.ts`** - Essential authentication test utility functions

## Test Coverage

The tests cover the core functionality with focus on happy flow:

#### Authentication

- ✅ User registration (buyer and supplier roles)
- ✅ Form display and validation
- ✅ Successful signup flows
- ✅ Role-based access control

#### RFP Management

- ✅ Form navigation and field display
- ✅ Successful form submission
- ✅ Required field handling
- ✅ Success message verification

#### Demo Accounts

- ✅ Demo user login flows
- ✅ Role-specific feature access
- ✅ Logout functionality

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

#### Run specific test directory

```bash
npx playwright test tests/auth/
npx playwright test tests/rfp/
npx playwright test tests/demo/
```

#### Run specific test file

```bash
npx playwright test tests/auth/signup-form.spec.ts
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

The `auth-helpers.ts` file provides essential functions:

- `generateUniqueEmail()` - Creates unique test emails
- `fillSignupForm()` - Fills out the signup form
- `submitSignupForm()` - Submits the form
- `waitForSignupSuccess()` - Waits for signup completion
- `loginAsBuyer()` - Login as demo buyer
- `loginAsSupplier()` - Login as demo supplier
- `logout()` - Logout from current session

## Writing New Tests

### Test File Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name - Core Features', () => {
    test.beforeEach(async ({ page }) => {
        // Setup code
    });

    test('should do something specific', async ({ page }) => {
        // Test implementation - focus on core functionality
    });

    test('should handle another core scenario', async ({ page }) => {
        // Second test - keep it simple and focused
    });
});
```

### Guidelines for New Tests

1. **Create new directory** if testing a new feature area
2. **Maximum 2 tests per file** - split into multiple files if needed
3. **Focus on happy flow** - avoid edge cases and complex scenarios
4. **Use descriptive test names** that explain the core functionality
5. **Keep tests simple** - one assertion per test when possible
6. **Use existing utilities** - leverage helper functions for common operations

### Example: Adding New Feature Tests

```typescript
// tests/new-feature/basic-functionality.spec.ts
test.describe('New Feature - Core Functionality', () => {
    test('should display new feature correctly', async ({ page }) => {
        // Test basic display
    });

    test('should handle basic interaction', async ({ page }) => {
        // Test basic interaction
    });
});

// tests/new-feature/advanced-functionality.spec.ts
test.describe('New Feature - Advanced Functionality', () => {
    test('should process user input', async ({ page }) => {
        // Test input processing
    });

    test('should show success state', async ({ page }) => {
        // Test success handling
    });
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

## Maintenance

### Regular Cleanup

- Remove tests that are no longer relevant
- Split files that exceed 2 tests
- Consolidate similar test logic into utilities
- Update this README when adding new test areas

### Code Review Checklist

- [ ] Maximum 2 tests per file
- [ ] Tests focus on core functionality
- [ ] No complex edge case testing
- [ ] Clear, descriptive test names
- [ ] Proper use of test utilities
- [ ] Tests are in appropriate directories
