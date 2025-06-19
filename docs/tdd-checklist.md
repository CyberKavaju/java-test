# TDD Checklist for Java Test Application

## Pre-Development Checklist

### Before Starting Any Feature

- [ ] **Understand the requirement** - Can you explain what needs to be built?
- [ ] **Identify the interface** - What will the API/function signature look like?
- [ ] **Consider edge cases** - What could go wrong?
- [ ] **Plan test structure** - Which test file will this belong to?

## Red-Green-Refactor Checklist

### RED Phase: Write Failing Test

- [ ] **Test is focused** - Tests exactly one behavior
- [ ] **Test name is descriptive** - Clearly states what should happen
- [ ] **Test actually fails** - Run the test to confirm it fails for the right reason
- [ ] **Failure message is clear** - You understand why it's failing
- [ ] **Test is complete** - Includes setup, action, and assertion

### GREEN Phase: Make Test Pass

- [ ] **Minimal implementation** - Write only enough code to pass
- [ ] **All tests pass** - Both new and existing tests
- [ ] **No broken functionality** - Existing features still work
- [ ] **Implementation matches test** - Code does exactly what test expects

### REFACTOR Phase: Improve Code

- [ ] **All tests still pass** - No regression during refactoring
- [ ] **Code is cleaner** - More readable, maintainable
- [ ] **No duplication** - DRY principle applied
- [ ] **Good naming** - Variables and functions have clear names
- [ ] **Proper separation of concerns** - Each function has single responsibility

## Test Quality Checklist

### Individual Test Quality

- [ ] **Test is independent** - Can run in isolation
- [ ] **Test is deterministic** - Always produces same result
- [ ] **Test is fast** - Runs in < 100ms (unit tests)
- [ ] **Test is readable** - Clear arrange-act-assert structure
- [ ] **Test uses meaningful data** - Test data reflects real scenarios

### Test Suite Quality

- [ ] **Good coverage** - Critical paths are 100% covered
- [ ] **Tests are organized** - Logical grouping and file structure
- [ ] **Tests run quickly** - Full suite completes in reasonable time
- [ ] **Tests are maintainable** - Easy to update when requirements change

## API Development Checklist

### Before Writing API Endpoint

- [ ] **API contract defined** - Request/response format documented
- [ ] **Error scenarios identified** - All possible error cases listed
- [ ] **Authentication considered** - Security requirements understood
- [ ] **Validation rules defined** - Input validation requirements clear

### API Test Checklist

- [ ] **Happy path tested** - Normal successful operation
- [ ] **Error cases tested** - All error scenarios covered
- [ ] **Edge cases tested** - Boundary conditions verified
- [ ] **Data validation tested** - Invalid input handling verified
- [ ] **Response format tested** - Correct JSON structure returned
- [ ] **HTTP status codes tested** - Appropriate status codes returned
- [ ] **No sensitive data leaked** - Passwords, tokens, etc. not exposed

### API Implementation Checklist

- [ ] **Error handling implemented** - Graceful error responses
- [ ] **Input validation implemented** - All inputs properly validated
- [ ] **Logging added** - Important events logged for debugging
- [ ] **Database transactions used** - Data consistency maintained
- [ ] **Response sanitization** - Sensitive data filtered out

## Database Development Checklist

### Before Database Changes

- [ ] **Schema changes planned** - Migration strategy defined
- [ ] **Data integrity considered** - Constraints and relationships defined
- [ ] **Performance impact assessed** - Indexes and query performance considered
- [ ] **Backup strategy confirmed** - Data can be recovered if needed

### Database Test Checklist

- [ ] **Schema tested** - All tables and constraints work correctly
- [ ] **CRUD operations tested** - Create, Read, Update, Delete all work
- [ ] **Constraints tested** - Foreign keys, unique constraints enforced
- [ ] **Transaction rollback tested** - Data consistency on errors
- [ ] **Query performance tested** - No N+1 queries or slow operations
- [ ] **Concurrent access tested** - Multiple users can access safely

## Business Logic Checklist

### Before Implementing Business Rules

- [ ] **Rules clearly understood** - Business requirements are clear
- [ ] **Examples provided** - Concrete examples of expected behavior
- [ ] **Edge cases identified** - Unusual scenarios considered
- [ ] **Performance requirements known** - Speed/memory constraints understood

### Business Logic Test Checklist

- [ ] **Core logic tested** - Main business rules verified
- [ ] **Edge cases tested** - Boundary conditions handled
- [ ] **Invalid input tested** - Bad data handled gracefully
- [ ] **Complex scenarios tested** - Real-world use cases covered
- [ ] **Performance tested** - Meets speed requirements

## Integration Test Checklist

### End-to-End Workflow Testing

- [ ] **Complete user journeys tested** - From start to finish
- [ ] **Cross-component integration tested** - Components work together
- [ ] **External dependencies mocked** - External APIs, services isolated
- [ ] **Error propagation tested** - Errors handled across components
- [ ] **Data flow tested** - Data correctly passed between layers

## Error Handling Checklist

### Error Scenario Testing

- [ ] **All error types tested** - Validation, business logic, system errors
- [ ] **Error messages tested** - Clear, helpful error messages
- [ ] **Error codes tested** - Appropriate HTTP status codes
- [ ] **Graceful degradation tested** - System continues working when possible
- [ ] **Error logging tested** - Errors properly logged for debugging

## Performance Checklist

### Performance Testing

- [ ] **Load testing done** - System handles expected traffic
- [ ] **Memory usage tested** - No memory leaks
- [ ] **Database performance tested** - Queries execute efficiently
- [ ] **Response time tested** - APIs respond within time limits
- [ ] **Concurrent user tested** - Multiple users don't interfere

## Security Checklist

### Security Testing

- [ ] **Input sanitization tested** - SQL injection, XSS prevented
- [ ] **Authentication tested** - Only authorized users can access
- [ ] **Authorization tested** - Users can only access allowed data
- [ ] **Sensitive data protected** - Passwords, tokens properly handled
- [ ] **Error information limited** - Errors don't leak sensitive info

## Pre-Commit Checklist

### Before Every Commit

- [ ] **All tests pass** - No failing tests
- [ ] **Code formatted** - Consistent code style
- [ ] **Linting passes** - No linting errors
- [ ] **Type checking passes** - No TypeScript errors (if applicable)
- [ ] **No TODO comments** - All TODOs resolved or properly tracked
- [ ] **Commit message clear** - Descriptive commit message

## Pre-Deployment Checklist

### Before Deploying to Production

- [ ] **Full test suite passes** - All tests green
- [ ] **Integration tests pass** - End-to-end tests successful
- [ ] **Performance tests pass** - System meets performance requirements
- [ ] **Security tests pass** - No security vulnerabilities
- [ ] **Database migrations tested** - Schema changes work correctly
- [ ] **Rollback plan ready** - Can revert if deployment fails
- [ ] **Monitoring configured** - Can detect issues in production

## Debugging Failed Tests Checklist

### When Tests Fail

- [ ] **Read error message carefully** - Understand what's actually failing
- [ ] **Check test isolation** - Test doesn't depend on other tests
- [ ] **Verify test data** - Test setup creates expected data
- [ ] **Check timing issues** - Async operations completed
- [ ] **Verify mocks/stubs** - External dependencies properly mocked
- [ ] **Check environment** - Test runs in clean environment

## Code Review Checklist

### Reviewing Test Code

- [ ] **Tests follow TDD principles** - Written before implementation
- [ ] **Tests are comprehensive** - Cover happy path and edge cases
- [ ] **Tests are maintainable** - Easy to understand and modify
- [ ] **Tests are efficient** - Run quickly and use resources wisely
- [ ] **Test names are clear** - Describe what's being tested
- [ ] **No test code duplication** - Common setup properly shared

## Maintenance Checklist

### Regular Test Maintenance

- [ ] **Remove obsolete tests** - Delete tests for removed features
- [ ] **Update test data** - Keep test data current and realistic
- [ ] **Refactor slow tests** - Optimize tests that run slowly
- [ ] **Review test coverage** - Ensure adequate coverage maintained
- [ ] **Update test documentation** - Keep test README current

## Quick Commands Reference

```bash
# Run TDD cycle
npm test -- --testNamePattern="your-new-feature" --watch

# Check coverage
npm run test:coverage

# Run specific test file
npm test tests/api.test.js

# Debug specific test
npm test -- --testNamePattern="specific test name" --verbose

# Run tests in CI mode
npm test -- --ci --coverage --watchAll=false
```

## Common TDD Mistakes to Avoid

### ❌ Anti-Patterns

- [ ] **Writing tests after code** - Breaks TDD cycle
- [ ] **Testing implementation details** - Makes tests brittle
- [ ] **Writing one giant test** - Hard to debug when it fails
- [ ] **Ignoring test failures** - Letting tests stay red
- [ ] **Not refactoring** - Skipping the refactor phase
- [ ] **Mocking everything** - Over-mocking makes tests meaningless
- [ ] **Not running tests frequently** - Missing quick feedback

### ✅ Best Practices

- [ ] **Test-first development** - Always write test before code
- [ ] **Test behavior, not implementation** - Focus on what, not how
- [ ] **One assertion per test** - Each test verifies one thing
- [ ] **Keep tests fast** - Quick feedback loop
- [ ] **Refactor regularly** - Improve code quality continuously
- [ ] **Mock external dependencies only** - Don't mock your own code
- [ ] **Run tests constantly** - Get immediate feedback
