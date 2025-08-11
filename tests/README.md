# Playwright Tests - RFP Content Management

## Test Results Summary

### ✅ Passing Tests (3/14)

- **RFP Form Navigation**: Successfully navigates to RFP creation page
- **Form Field Display**: All required and optional fields are properly displayed
- **Demo Buyer Access**: Buyer can login and access core features

### ❌ Failing Tests (11/14)

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
- **RFP Creation**: Form display and field validation
- **Navigation**: Page routing and component rendering
- **Demo Accounts**: Login flows and feature access

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run test:install

# Run all tests
npm run test

# Run specific test
npx playwright test tests/rfp/buyer/form-display.spec.ts
```

## Test Structure

```
tests/
├── rfp/buyer/
│   └── form-display.spec.ts     # RFP form display tests (2/2 passing)
├── auth/
│   ├── basic-auth.spec.ts       # Basic auth tests (2/2 passing)
│   ├── signup-form.spec.ts      # Signup form tests (0/2 passing)
│   └── supplier-signup.spec.ts  # Supplier signup tests (0/1 passing)
├── demo/
│   ├── buyer-access.spec.ts     # Demo buyer tests (1/2 passing)
│   └── supplier-access.spec.ts  # Demo supplier tests (0/2 passing)
└── README.md
```

## Configuration

- **Base URL**: `http://localhost:3000`
- **Browser**: Chrome (Chromium)
- **Auto-start**: Dev server starts before tests
- **Reports**: Screenshots and videos on failure

## Recent Fixes

- ✅ Added `data-testid` attributes to Select components
- ✅ Updated tests to use proper selectors for form fields
- ✅ Fixed field label mismatches between test and implementation

## Current Issues

- **Auth Flow**: Success page not displaying after signup
- **Logout**: Logout button not found in UI
- **Supplier Routes**: 404 errors on supplier-specific pages
- **Strict Mode**: Multiple elements matching text selectors
