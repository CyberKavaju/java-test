# Test-Driven Development Rules for Java Test Application

## Core TDD Principles

### 1. Red-Green-Refactor Cycle
- **RED**: Write a failing test first - always start with a test that fails
- **GREEN**: Write the minimum code to make the test pass
- **REFACTOR**: Improve the code while keeping tests passing

### 2. Test-First Development Rules

#### **Rule 1: No Production Code Without a Failing Test**
- Never write production code unless it's to make a failing test pass
- Every new feature, bug fix, or enhancement must start with a test
- Example: Before adding a new API endpoint, write the test that expects it to work

#### **Rule 2: Write Only Enough Test to Fail**
- Don't write more of a test than is sufficient to fail
- Compilation failures count as failures
- Focus on one specific behavior per test

#### **Rule 3: Write Only Enough Code to Pass**
- Don't write more production code than necessary to pass the failing test
- Resist the urge to implement everything at once
- Keep implementations simple initially

## Project-Specific TDD Rules

### API Development Rules

#### **API Rule 1: Test Endpoints Before Implementation**
```javascript
// Example: Test before implementing
describe('GET /api/questions/random', () => {
    it('should return 25 random questions', async () => {
        const response = await request(app)
            .get('/api/questions/random?limit=25')
            .expect(200);
        
        expect(response.body.questions).toHaveLength(25);
        expect(response.body.questions[0]).not.toHaveProperty('correct_answer');
    });
});
```

#### **API Rule 2: Test Error Cases First**
- Always test error scenarios before happy paths
- Test validation failures, missing parameters, and edge cases
- Ensure proper HTTP status codes and error messages

#### **API Rule 3: Test Data Transformation**
- Test that sensitive data (correct answers, explanations) is filtered from responses
- Verify data formatting and structure matches API contracts

### Database Development Rules

#### **DB Rule 1: Use In-Memory Database for Tests**
- Always use `:memory:` SQLite database for tests
- Never test against production or shared databases
- Each test should start with a clean database state

#### **DB Rule 2: Test Database Schema First**
```javascript
// Test schema before implementing tables
it('should create all required tables', async () => {
    const tables = await db.getTables();
    expect(tables).toContain('questions');
    expect(tables).toContain('user_attempts');
    expect(tables).toContain('test_sessions');
});
```

#### **DB Rule 3: Test CRUD Operations Independently**
- Test Create, Read, Update, Delete operations separately
- Test constraints, relationships, and data integrity
- Test transaction rollbacks and error handling

### Business Logic Rules

#### **Logic Rule 1: Test Question Randomization**
- Test that questions are truly random and don't repeat
- Test pool reset behavior when all questions are exhausted
- Test user-specific question tracking

#### **Logic Rule 2: Test Performance Calculations**
```javascript
// Test score calculation logic
it('should calculate percentage correctly', () => {
    const correct = 18;
    const total = 25;
    const percentage = calculatePercentage(correct, total);
    expect(percentage).toBe(72);
});
```

#### **Logic Rule 3: Test Time Management**
- Test timer functionality and limits
- Test session timeout handling
- Test time tracking accuracy

### Frontend Testing Rules (React/TypeScript)

#### **Frontend Rule 1: Test Components in Isolation**
- Use React Testing Library for component testing
- Mock API calls and external dependencies
- Test user interactions and state changes

#### **Frontend Rule 2: Test User Workflows**
- Test complete user journeys (start test → answer questions → submit → view results)
- Test navigation and routing
- Test error states and loading states

## Test Organization Standards

### File Structure Rules

#### **Structure Rule 1: Mirror Production Structure**
```
backend/
  src/
    database/
      Database.js
    routes/
      questions.js
  tests/
    database/
      Database.test.js
    routes/
      questions.test.js
```

#### **Structure Rule 2: Group Tests by Feature**
- `api.test.js` - All API endpoint tests
- `database.test.js` - Database operations
- `integration.test.js` - End-to-end workflows
- `utils.test.js` - Utility functions

### Test Naming Rules

#### **Naming Rule 1: Descriptive Test Names**
```javascript
// Good
it('should return 404 when question ID does not exist', () => {});

// Bad  
it('should handle invalid ID', () => {});
```

#### **Naming Rule 2: Follow Given-When-Then Pattern**
```javascript
it('should mark answer as incorrect when user selects wrong option', async () => {
    // Given: A question with correct answer 'B'
    // When: User submits answer 'A'
    // Then: Result should show incorrect
});
```

## Code Quality Rules

### File Length and Maintainability Rules

#### **⚠️ CRITICAL RULE: Maximum File Length 400 Lines**
- **All source files must not exceed 400 lines** (JS, TS, CSS, HTML, etc.)
- **If a file reaches 400+ lines, it MUST be broken down immediately**
- **This rule applies to ALL code files without exception**

**Why this rule is critical:**
- **Readability**: Files over 400 lines become difficult to understand and navigate
- **Maintainability**: Large files are harder to debug, test, and modify
- **Code Review**: Smaller files make code reviews more effective
- **Single Responsibility**: Large files often violate the Single Responsibility Principle
- **Team Collaboration**: Multiple developers can work on different files without conflicts

**How to break down large files:**
```javascript
// Example: Large API route file breakdown
// BEFORE: routes/api.js (500+ lines)
// AFTER: Break into multiple files:
routes/
  questions.js        // Question-related endpoints
  users.js           // User-related endpoints  
  tests.js           // Test session endpoints
  statistics.js      // Analytics endpoints
  upload.js          // File upload endpoints
```

**File breakdown strategies:**
- **By Feature**: Group related functionality together
- **By Component**: Separate components into individual files
- **By Layer**: Separate data access, business logic, and presentation
- **By Domain**: Group by business domain (users, questions, tests, etc.)

**Enforcement:**
- **Pre-commit hook**: Automatically check file lengths before commits
- **Code Review**: Reject PRs with files over 400 lines
- **Continuous Integration**: Fail builds if file length rules are violated
- **Regular Audits**: Monthly file length audits to catch growing files

### Coverage Requirements

#### **Coverage Rule 1: Minimum 80% Code Coverage**
- All new features must maintain or improve coverage
- Use `npm run test:coverage` to verify
- Focus on meaningful coverage, not just numbers

#### **Coverage Rule 2: 100% Critical Path Coverage**
- Question selection logic: 100% coverage
- Answer validation: 100% coverage
- Score calculation: 100% coverage
- User data persistence: 100% coverage

### Test Quality Rules

#### **⚠️ CRITICAL RULE: Don't Modify Passing Tests**
- **Once a test is passing and error-free, DO NOT modify it unless absolutely necessary**
- **Passing tests are your safety net - breaking them defeats the purpose of TDD**
- **This rule is FUNDAMENTAL to maintaining code confidence and preventing regression**

**Why this rule is critical:**
- **Regression Prevention**: Passing tests catch when you break existing functionality
- **Test Integrity**: Modified tests may no longer test what they were designed to test
- **False Confidence**: Changed tests might pass but no longer validate the original requirement
- **TDD Foundation**: The whole TDD cycle depends on tests remaining stable once they pass
- **Debugging Clarity**: When a previously passing test fails, you know exactly what broke

**When you CAN modify a passing test:**
- **Refactoring for clarity**: Improve test readability without changing what it tests
- **Updating assertions**: Only when the business requirements have officially changed
- **Fixing flaky tests**: When tests fail intermittently due to timing or environment issues
- **Adding more assertions**: To make the test more comprehensive (but never remove existing ones)

**When you CANNOT modify a passing test:**
- **Because it's "inconvenient"**: Tests should constrain your implementation, not accommodate it
- **To make new code pass**: Write new tests for new behavior instead
- **Because it's "too strict"**: Strict tests prevent bugs and maintain quality
- **To speed up development**: Shortcuts in testing lead to bugs in production

**The Golden Rule:**
```javascript
// ❌ WRONG - Modifying a passing test to make new code work
it('should return user data', () => {
    // Original test was checking for specific fields
    // expect(user).toHaveProperty('name');
    // expect(user).toHaveProperty('email');
    
    // Developer changed it because new code doesn't return email
    expect(user).toHaveProperty('name'); // Modified test = broken safety net
});

// ✅ CORRECT - Keep the original test, write new tests for new behavior
it('should return user data with name and email', () => {
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
});

it('should return user data with additional profile info', () => {
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('profile');
});
```

**Enforcement:**
- **Code Review**: Reject any PR that modifies existing passing tests without clear justification
- **Git History**: Track test changes and question any modifications to previously passing tests
- **Team Policy**: Require explicit approval from senior developers for test modifications
- **Documentation**: All test changes must be documented with reasoning

#### **Quality Rule 1: Independent Tests**
- Each test should be able to run in isolation
- Tests should not depend on execution order
- Use proper setup and teardown

#### **Quality Rule 2: Fast Test Execution**
- Unit tests should run in < 5 seconds
- Integration tests should run in < 30 seconds
- Use `beforeAll` for expensive setup operations

#### **Quality Rule 3: Clear Assertions**
```javascript
// Good - specific assertion
expect(response.body.questions).toHaveLength(25);
expect(response.body.success).toBe(true);

// Avoid - vague assertion
expect(response.body).toBeTruthy();
```

## Continuous Integration Rules

### Pre-commit Rules

#### **CI Rule 1: All Tests Must Pass**
- No commits allowed with failing tests
- Run `npm test` before every commit
- Fix broken tests immediately

#### **CI Rule 2: Linting and Type Checking**
- All code must pass ESLint rules
- TypeScript code must have no type errors
- Use pre-commit hooks to enforce standards

### Deployment Rules

#### **Deploy Rule 1: Full Test Suite Success**
- All tests (unit + integration) must pass
- Coverage thresholds must be met
- No known bugs or failing scenarios

## Development Workflow

### Daily Development Flow

1. **Morning**: Run full test suite to ensure clean state
2. **Feature Development**: 
   - Write failing test
   - Implement minimum code to pass
   - Refactor while keeping tests green
3. **Before Commits**: Run affected tests
4. **End of Day**: Run full test suite

### Bug Fix Workflow

1. **Reproduce**: Write a test that demonstrates the bug
2. **Fix**: Implement fix to make test pass
3. **Verify**: Ensure no regression in existing tests
4. **Deploy**: Push fix with new test coverage

### New Feature Workflow

1. **Design**: Write tests that describe desired behavior
2. **Implement**: Build feature to satisfy tests
3. **Integration**: Add integration tests for complete workflows
4. **Documentation**: Update API docs and examples

## Testing Best Practices

### Mock and Stub Guidelines

#### **Mock Rule 1: Mock External Dependencies**
```javascript
// Mock file system operations
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;
```

#### **Mock Rule 2: Don't Mock What You Own**
- Don't mock your own database layer
- Don't mock internal business logic
- Focus mocks on external APIs and services

### Test Data Management

#### **Data Rule 1: Use Factory Functions**
```javascript
const createTestQuestion = (overrides = {}) => ({
    domain: 'Test Domain',
    topic: 'Test Topic',
    question_text: 'Test question?',
    option_a: 'A',
    option_b: 'B',
    option_c: 'C',
    option_d: 'D',
    correct_answer: 'A',
    explanation: 'Test explanation',
    ...overrides
});
```

#### **Data Rule 2: Clean Test Data**
- Use meaningful test data that reflects real scenarios
- Avoid magic numbers and unclear test values
- Reset database state between tests

## Monitoring and Maintenance

### Test Maintenance Rules

#### **Maintenance Rule 1: Regular Test Review**
- Review and update tests monthly
- Remove obsolete tests for removed features
- Refactor tests that become unclear or brittle

#### **Maintenance Rule 2: Performance Monitoring**
- Monitor test execution time
- Identify and optimize slow tests
- Keep test suite fast and reliable

### Documentation Rules

#### **Doc Rule 1: Test Documentation**
- Document complex test scenarios
- Explain why certain mocks or setups are needed
- Keep test README up to date

#### **Doc Rule 2: API Contract Testing**
- Document expected request/response formats
- Test API contracts don't break
- Version API changes properly

## Summary and Quick Reference

### Essential TDD Commands for This Project

```bash
# Start TDD development mode
npm run tdd

# Run specific test while developing
npm run test:single -- "your-test-name"

# Check test coverage
npm run test:coverage

# Run pre-commit checks
npm run pre-commit

# Run all tests in CI mode
npm run test:ci
```

### Key TDD Files in This Project

1. **`/docs/dev-rules.md`** - This file: Complete TDD rules and principles
2. **`/docs/tdd-examples.md`** - Practical TDD examples for this codebase
3. **`/docs/tdd-checklist.md`** - Step-by-step TDD checklist
4. **`/docs/tdd-workflow.md`** - Daily TDD workflow and commands
5. **`/backend/jest.config.json`** - Jest configuration optimized for TDD
6. **`/backend/tests/`** - All test files following TDD principles

### Current Test Coverage Status

- **API Tests**: ✅ Comprehensive coverage of all endpoints
- **Database Tests**: ✅ CRUD operations and schema validation
- **Integration Tests**: ✅ End-to-end workflows
- **Utility Tests**: ✅ Business logic and helper functions

