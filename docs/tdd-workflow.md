# TDD Workflow Guide for Java Test Application

## Quick Start TDD Commands

```bash
# Start TDD mode (watch mode with notifications)
npm run tdd

# Run tests for specific feature while developing
npm run test:single -- "your-feature-name"

# Run all tests with coverage
npm run test:coverage

# Run pre-commit checks
npm run pre-commit
```

## Daily TDD Workflow

### 1. Morning Setup (5 minutes)
```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Run full test suite to ensure clean state
npm test

# Start TDD mode
npm run tdd
```

### 2. Feature Development Cycle (Repeat for each feature)

#### Step 1: Write Failing Test (RED)
```bash
# Create test file if it doesn't exist
touch tests/your-feature.test.js

# Write the failing test
# Example structure:
describe('Your Feature', () => {
    it('should do something specific', () => {
        // Arrange
        const input = 'test input';
        
        // Act
        const result = yourFunction(input);
        
        // Assert
        expect(result).toBe('expected output');
    });
});

# Verify the test fails
npm run test:single -- "should do something specific"
```

#### Step 2: Write Minimal Code (GREEN)
```bash
# Create source file if needed
touch src/your-feature.js

# Write minimal implementation
function yourFunction(input) {
    return 'expected output'; // Hardcoded to pass test
}

# Verify test passes
npm run test:single -- "should do something specific"
```

#### Step 3: Refactor (REFACTOR)
```bash
# Improve the implementation
function yourFunction(input) {
    // Proper implementation
    return processInput(input);
}

# Ensure tests still pass
npm run test:single -- "your feature"

# Run all tests to check for regressions
npm test
```

### 3. Pre-Commit Workflow
```bash
# Run all tests and linting
npm run pre-commit

# If everything passes, commit
git add .
git commit -m "feat: add your feature with tests"

# Push changes
git push origin your-branch
```

## TDD Scenarios and Commands

### Scenario 1: Adding New API Endpoint

```bash
# 1. Start with API test
npm run test:api -- --watch

# 2. Add test to tests/api.test.js
describe('GET /api/new-endpoint', () => {
    it('should return expected data', async () => {
        const response = await request(app)
            .get('/api/new-endpoint')
            .expect(200);
        
        expect(response.body.success).toBe(true);
    });
});

# 3. Run test - should fail
# 4. Add minimal endpoint to server.js
app.get('/api/new-endpoint', (req, res) => {
    res.json({ success: true });
});

# 5. Run test - should pass
# 6. Refactor and add more test cases
```

### Scenario 2: Adding Database Functionality

```bash
# 1. Start database tests
npm run test:database -- --watch

# 2. Add test to tests/database.test.js
it('should create new record', async () => {
    const data = { name: 'test' };
    const id = await db.createRecord(data);
    
    expect(id).toBeDefined();
    expect(typeof id).toBe('number');
});

# 3. Add method to Database.js
async createRecord(data) {
    return new Promise((resolve, reject) => {
        this.db.run(
            'INSERT INTO table (name) VALUES (?)',
            [data.name],
            function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
        );
    });
}
```

### Scenario 3: Adding Business Logic

```bash
# 1. Start utility tests
npm run test:utils -- --watch

# 2. Add test to tests/utils.test.js
describe('calculateScore', () => {
    it('should calculate percentage correctly', () => {
        const score = calculateScore(18, 25);
        expect(score).toBe(72);
    });
    
    it('should handle zero total gracefully', () => {
        const score = calculateScore(0, 0);
        expect(score).toBe(0);
    });
});

# 3. Implement in src/utils/scoring.js
function calculateScore(correct, total) {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
}
```

## TDD Testing Patterns

### Pattern 1: Arrange-Act-Assert

```javascript
it('should format question text correctly', () => {
    // Arrange
    const rawText = 'What is Java?```java\ncode here\n```More text';
    
    // Act
    const formatted = formatQuestionText(rawText);
    
    // Assert
    expect(formatted).toContain('\n```java\n');
    expect(formatted).toContain('\n```\n');
});
```

### Pattern 2: Given-When-Then

```javascript
it('should mark answer as incorrect when wrong option selected', async () => {
    // Given: A question with correct answer 'B'
    const questionId = await testDb.createQuestion({
        question_text: 'Test?',
        option_a: 'Wrong', option_b: 'Correct', 
        option_c: 'Wrong', option_d: 'Wrong',
        correct_answer: 'B'
    });
    
    // When: User submits answer 'A'
    const result = await db.checkAnswer(questionId, 'A');
    
    // Then: Result should be incorrect
    expect(result.isCorrect).toBe(false);
    expect(result.correctAnswer).toBe('B');
});
```

### Pattern 3: Parameterized Tests

```javascript
describe('Answer validation', () => {
    const testCases = [
        { input: 'A', expected: true },
        { input: 'B', expected: true },
        { input: 'C', expected: true },
        { input: 'D', expected: true },
        { input: 'E', expected: true },
        { input: 'F', expected: false },
        { input: '1', expected: false },
        { input: '', expected: false },
        { input: null, expected: false }
    ];
    
    testCases.forEach(({ input, expected }) => {
        it(`should return ${expected} for input "${input}"`, () => {
            expect(isValidAnswer(input)).toBe(expected);
        });
    });
});
```

## Debugging TDD Tests

### Debug Failing Tests

```bash
# Run specific failing test with verbose output
npm run test:single -- "failing test name" -- --verbose

# Debug with Node inspector
npm run test:debug -- --testNamePattern="failing test"

# Run test with coverage to see what's not tested
npm run test:coverage -- --testNamePattern="your test"
```

### Common TDD Issues and Solutions

#### Issue: Test passes but shouldn't
```bash
# Check if test is actually running
npm run test:verbose -- --testNamePattern="your test"

# Verify test assertions
console.log('Test data:', testData);
console.log('Actual result:', actualResult);
```

#### Issue: Tests are slow
```bash
# Profile test performance
npm test -- --detectSlowTests

# Run tests in parallel
npm test -- --maxWorkers=4

# Check for database connections not being closed
# Ensure proper cleanup in afterEach/afterAll
```

#### Issue: Tests are flaky
```bash
# Run test multiple times
for i in {1..10}; do npm run test:single -- "flaky test"; done

# Check for async timing issues
# Use proper await/async patterns
# Mock time-dependent code
```

## Advanced TDD Techniques

### Mocking External Dependencies

```javascript
// Mock file system
jest.mock('fs');
const mockFs = require('fs');

// Mock database
const mockDb = {
    query: jest.fn(),
    close: jest.fn()
};

// Mock HTTP requests
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;
```

### Testing Async Code

```javascript
// Promise-based
it('should handle async operations', async () => {
    const result = await asyncFunction();
    expect(result).toBe('expected');
});

// Callback-based
it('should handle callbacks', (done) => {
    callbackFunction((err, result) => {
        expect(err).toBeNull();
        expect(result).toBe('expected');
        done();
    });
});

// Error handling
it('should handle async errors', async () => {
    await expect(asyncFunction()).rejects.toThrow('Expected error');
});
```

### Integration Test Setup

```javascript
describe('Integration Tests', () => {
    let testDb;
    let app;
    
    beforeAll(async () => {
        testDb = new Database(':memory:');
        await testDb.init();
        app = createTestServer(testDb);
    });
    
    beforeEach(async () => {
        // Clean database between tests
        await testDb.clearAllTables();
    });
    
    afterAll(async () => {
        if (testDb) {
            testDb.close();
        }
    });
});
```

## TDD Metrics and Goals

### Coverage Goals
- **Unit Tests**: 95% coverage for business logic
- **Integration Tests**: 80% coverage for API endpoints
- **Critical Paths**: 100% coverage for core features

### Performance Goals
- **Unit Tests**: < 5 seconds total execution
- **Integration Tests**: < 30 seconds total execution
- **Individual Tests**: < 100ms per unit test

### Quality Goals
- **Test Reliability**: < 1% flaky tests
- **Test Maintenance**: Update tests within 1 day of code changes
- **Bug Detection**: Tests catch 90% of bugs before deployment

## Continuous Improvement

### Weekly TDD Review
1. Review test coverage reports
2. Identify slow or flaky tests
3. Refactor complex test setups
4. Update TDD documentation

### Monthly TDD Assessment
1. Analyze bug reports - were they caught by tests?
2. Review test code quality and maintainability
3. Update TDD practices based on learnings
4. Share TDD successes and challenges with team

Remember: TDD is a discipline that requires practice. Start small, be consistent, and gradually build the habit of test-first development!
