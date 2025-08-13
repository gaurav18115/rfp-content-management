# RFP Supplier Tests

This directory contains Playwright tests for supplier RFP functionality, organized into focused, maintainable test files.

## Test File Organization

### 1. `rfp-response-form.spec.ts` - Basic Form Display

- **Purpose**: Tests basic RFP response form display and navigation
- **Tests**:
  - `should display response form for published RFP`
- **Focus**: Form visibility, field presence, basic navigation

### 2. `rfp-response-form-display.spec.ts` - Form Display & Validation

- **Purpose**: Tests form display and client-side validation
- **Tests**:
  - `should display response form for published RFP`
  - `should validate required fields before submission`
- **Focus**: Form rendering, field validation, user interaction

### 3. `rfp-response-form-submission.spec.ts` - Form Submission

- **Purpose**: Tests actual form submission functionality
- **Tests**:
  - `should handle form submission successfully`
  - `should test form submission with fresh RFP`
- **Focus**: Form submission, API integration, success/error handling

### 4. `rfp-response-persistence.spec.ts` - Data Persistence

- **Purpose**: Tests response data persistence and storage
- **Tests**:
  - `should persist response data with correct timestamp and status`
  - `should handle server errors gracefully during submission`
- **Focus**: Database persistence, error handling, data integrity

### 5. `rfp-response-submission.spec.ts` - Submission Workflow

- **Purpose**: Tests the complete submission workflow
- **Tests**:
  - `should successfully submit RFP response`
  - `should prevent duplicate responses from same supplier`
- **Focus**: End-to-end submission, duplicate prevention, workflow validation

### 6. `rfp-response-validation.spec.ts` - Form Validation

- **Purpose**: Tests form validation and error handling
- **Tests**:
  - `should validate required fields before submission`
  - `should allow valid form submission with all fields filled`
- **Focus**: Field validation, error states, form completion

### 7. `rfp-response-workflow.spec.ts` - User Workflow

- **Purpose**: Tests the complete user workflow experience
- **Tests**:
  - `should provide clear feedback throughout response process`
  - `should handle form submission workflow correctly`
- **Focus**: User experience, workflow steps, feedback mechanisms

## Test Coverage

### ✅ **What's Fully Tested:**

- RFP browsing and navigation
- Form display and field visibility
- Form validation and error handling
- Form submission and API integration
- Response persistence and storage
- Duplicate submission prevention
- User workflow and feedback
- Error handling and edge cases

### 🎯 **Key Test Patterns:**

- **Navigation Flow**: Login → Browse RFPs → View Details → Submit Response
- **Form Testing**: Field visibility → Data entry → Validation → Submission
- **Error Handling**: Network errors, validation errors, duplicate submissions
- **Data Verification**: Form field values, submission states, persistence

## Running Tests

### Run All Supplier Tests

```bash
npx playwright test tests/rfp/supplier/
```

### Run Specific Test Files

```bash
# Basic form display
npx playwright test tests/rfp/supplier/rfp-response-form.spec.ts

# Form validation
npx playwright test tests/rfp/supplier/rfp-response-validation.spec.ts

# Form submission
npx playwright test tests/rfp/supplier/rfp-response-form-submission.spec.ts
```

### Run Specific Tests

```bash
# Run only form submission tests
npx playwright test --grep "should handle form submission successfully"

# Run only validation tests
npx playwright test --grep "should validate required fields"
```

## Test Data Requirements

- **Authentication**: Tests require a supplier user account
- **RFPs**: Tests need at least one published RFP in the system
- **Database**: Tests may create/update RFP responses
- **Cleanup**: Tests handle their own cleanup via `afterEach` hooks

## Maintenance

- **File Organization**: Each file focuses on a specific aspect of functionality
- **Test Independence**: Tests can run independently without dependencies
- **Consistent Patterns**: All tests follow the same navigation and setup patterns
- **Error Handling**: Tests gracefully handle missing data or system issues
- **Documentation**: Each test file has clear purpose and focus areas
