# Supplier RFP Response Test Suite

This directory contains comprehensive test cases for the supplier RFP response functionality as described in [Issue #7](https://github.com/gaurav18115/rfp-content-management/issues/7).

## Test Coverage

### 1. RFP Response Form (`rfp-response-form.spec.ts`)
- **Test 1**: Display response form for published RFPs
- **Test 2**: Validate required fields before submission

### 2. RFP Response Submission (`rfp-response-submission.spec.ts`)
- **Test 1**: Successfully submit RFP response
- **Test 2**: Prevent duplicate responses from same supplier

### 3. RFP Response Access Control (`rfp-response-access-control.spec.ts`)
- **Test 1**: Only show response form for published RFPs
- **Test 2**: Enforce supplier role access to response form

### 4. RFP Response Persistence (`rfp-response-persistence.spec.ts`)
- **Test 1**: Persist response data with correct timestamp and status
- **Test 2**: Handle server errors gracefully during submission

### 5. RFP Response Validation (`rfp-response-validation.spec.ts`)
- **Test 1**: Validate field length constraints
- **Test 2**: Clear validation errors when fields are corrected

### 6. RFP Response Workflow (`rfp-response-workflow.spec.ts`)
- **Test 1**: Provide clear feedback throughout response process
- **Test 2**: Allow response editing before final submission

## Test Data Requirements

All tests use the `loginAsSupplier()` helper function from `../../utils/auth-helpers.ts` to authenticate as a supplier user.

## Running the Tests

```bash
# Run all supplier RFP response tests
pnpm test:playwright tests/rfp/supplier/

# Run specific test file
pnpm test:playwright tests/rfp/supplier/rfp-response-form.spec.ts

# Run tests with UI
pnpm test:playwright:ui tests/rfp/supplier/
```

## Test Data Test IDs

The tests use the following `data-testid` attributes that need to be implemented in the UI components:

### Form Elements
- `rfp-response-form` - Main response form container
- `proposal-field` - Proposal text input
- `budget-field` - Budget input
- `timeline-field` - Timeline input
- `experience-field` - Experience input
- `submit-response-btn` - Submit button
- `save-draft-btn` - Save draft button

### Validation Elements
- `proposal-error` - Proposal validation error
- `proposal-length-error` - Proposal length validation error
- `budget-format-error` - Budget format validation error
- `proposal-required-error` - Required field error

### Status Elements
- `response-success-message` - Success message after submission
- `response-error-message` - Error message on failure
- `already-responded-message` - Message when already responded
- `draft-rfp-message` - Message for draft RFPs
- `response-instructions` - Instructions text
- `form-progress` - Form completion progress
- `response-id` - Submitted response ID

### Display Elements
- `submitted-proposal` - Display of submitted proposal
- `submitted-budget` - Display of submitted budget
- `submitted-timeline` - Display of submitted timeline
- `submitted-experience` - Display of submitted experience
- `supplier-response-section` - Supplier-specific response section

## Implementation Notes

These tests cover the complete workflow for suppliers to submit responses to published RFPs, including:

1. **Form Display**: Showing the response form only for published RFPs
2. **Validation**: Client-side and server-side validation
3. **Submission**: Successful submission with proper error handling
4. **Access Control**: Ensuring only suppliers can access the form
5. **Data Persistence**: Saving responses to the database
6. **Duplicate Prevention**: Enforcing unique constraint per supplier per RFP
7. **User Experience**: Clear feedback and workflow guidance

The tests follow the requirements specified in the issue and use the existing auth helper patterns established in the codebase.