# Playwright Tests - RFP Content Management

## Test Results Summary

### ✅ Passing Tests (5/14)

- **RFP Form Navigation**: Successfully navigates to RFP creation page
- **Form Field Display**: All required and optional fields are properly displayed
- **Demo Buyer Access**: Buyer can login and access core features
- **RFP Form Submission - Full Form**: Successfully fills out and submits complete RFP form
- **RFP Form Submission - Minimal Data**: Successfully submits RFP with only required fields

### ❌ Failing Tests (9/14)

- **Auth Tests (3/5 failing)**:
  - Signup form display (strict mode violation)
  - Buyer signup success (missing success page)
  - Supplier signup success (missing success page)
- **Demo Tests (3/4 failing)**:
  - Buyer logout (timeout - logout button not found)
  - Supplier login access (404 on responses page)
  - Supplier logout (timeout - logout button not found)

### 🧪 Test Coverage

- **Authentication**: Buyer login and role verification
- **RFP Creation**: Form display, field validation, and form submission
- **Navigation**: Page routing and component rendering
- **Demo Accounts**: Login flows and feature access
- **Form Interactions**: Radix UI Select components, form submission, success handling

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run test:install

# Run all tests
npm run test

# Run specific test
npx playwright test tests/rfp/buyer/form-submission.spec.ts

# Run tests with UI
npx playwright test --headed
```

## Test Structure

```
tests/
├── rfp/buyer/
│   ├── form-display.spec.ts     # RFP form display tests (2/2 passing)
│   └── form-submission.spec.ts  # RFP form submission tests (2/2 passing) ✨ NEW
├── auth/
│   ├── basic-auth.spec.ts       # Basic auth tests (2/2 passing)
│   ├── signup-form.spec.ts      # Signup form tests (0/2 passing)
│   └── supplier-signup.spec.ts  # Supplier signup tests (0/1 passing)
├── demo/
│   ├── buyer-access.spec.ts     # Demo buyer tests (1/2 passing)
│   └── supplier-access.spec.ts  # Demo supplier tests (0/2 passing)
├── utils/
│   ├── auth-helpers.ts          # Authentication helper functions
│   └── auth-helpers-example.ts  # Examples of using auth helpers
└── README.md
```

## Testing Best Practices

### ✅ Using Data Test IDs

Our tests now use `data-testid` selectors instead of label-based selectors for better reliability:

```typescript
// ✅ Good - Using data-testid
await page.getByTestId('rfp-title-input').fill('Test RFP');

// ❌ Avoid - Using labels (can break with UI changes)
await page.getByLabel('RFP Title *').fill('Test RFP');
```

### ✅ Authentication Helpers

Use the provided auth helper functions for consistent login/logout:

```typescript
import { loginAsBuyer, loginAsSupplier } from '../utils/auth-helpers';

test.beforeEach(async ({ page }) => {
    await loginAsBuyer(page);
});
```

### ✅ Radix UI Select Components

For custom select components, use click-then-select pattern:

```typescript
// Handle Radix UI Select for category
await page.getByTestId('rfp-category-select').click();
await page.getByRole('option', { name: 'Technology' }).click();
```

### ✅ Toast Notifications

Use specific selectors for toast messages to avoid strict mode violations:

```typescript
// Wait for success message in toast
await expect(page.locator('[data-state="open"]')).toContainText('RFP Created Successfully!');
```

## Configuration

- **Base URL**: `http://localhost:3000`
- **Browser**: Chrome (Chromium)
- **Auto-start**: Dev server starts before tests
- **Reports**: Screenshots and videos on failure
- **Test IDs**: All form components use `data-testid` attributes

## Recent Improvements

### ✨ RFP Form Submission Tests

- **Full Form Test**: Tests complete RFP creation with all fields
- **Minimal Data Test**: Tests RFP submission with only required fields
- **Proper Component Handling**: Correctly interacts with Radix UI Select components
- **Stable Selectors**: Uses `data-testid` instead of label-based selectors
- **Toast Handling**: Properly verifies success messages in toast notifications

### 🔧 Testing Infrastructure

- **Auth Helpers**: Centralized authentication functions
- **Data Test IDs**: Consistent test selector strategy
- **Component Patterns**: Standardized interaction patterns for UI components

## Current Issues

- **Auth Flow**: Success page not displaying after signup
- **Logout**: Logout button not found in UI
- **Supplier Routes**: 404 errors on supplier-specific pages
- **Strict Mode**: Multiple elements matching text selectors (resolved in form submission tests)

## Next Steps

1. **Add data-testid attributes** to remaining form components
2. **Update other tests** to use the new testing patterns
3. **Fix remaining failing tests** using the improved approaches
4. **Expand test coverage** for supplier functionality
5. **Add integration tests** for complete user workflows
