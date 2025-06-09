# Backend Testing Documentation

## Overview

This project includes comprehensive unit and integration tests for all API endpoints using Jest and Supertest. The test suite covers all functionality of the Java Test Application backend.

## Test Structure

### Test Files

1. **`api.test.js`** - Complete API endpoint testing
   - Tests all 16 API endpoints
   - Covers success cases, error cases, and edge cases
   - Tests request/response formats and data validation

2. **`database.test.js`** - Database operations testing
   - Tests database initialization and schema
   - Tests CRUD operations for questions
   - Tests user attempts and statistics tracking
   - Tests error handling for database operations

3. **`integration.test.js`** - Complete workflow testing
   - Tests full user workflows from start to finish
   - Tests question management workflows
   - Tests concurrent requests and data consistency
   - Tests performance under load

4. **`utils.test.js`** - Utility functions testing
   - Tests parameter validation
   - Tests data sanitization
   - Tests score calculation
   - Tests data transformation functions

5. **`setup.js`** - Test environment setup
   - Configures test timeouts
   - Sets up test database
   - Handles cleanup

## API Endpoints Tested

### Core Test Functionality
- `GET /api/health` - Health check
- `GET /api/questions/random` - Get random questions for test
- `GET /api/questions/count` - Get total question count
- `POST /api/submit-answers` - Submit test answers
- `GET /api/user-history` - Get user statistics and history
- `GET /api/report` - Get performance reports
- `GET /api/question-details` - Get detailed question performance

### Question Management
- `GET /api/questions` - List questions with pagination/filtering
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create new question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question
- `GET /api/questions/meta/filters` - Get filter options

### Import/Export
- `POST /api/import/preview` - Preview CSV import
- `POST /api/import/questions` - Import questions from CSV
- `GET /api/questions/export/csv` - Export questions to CSV

## Test Coverage

The test suite covers:

### ✅ Success Cases
- All endpoints return correct responses for valid requests
- Data is properly formatted and includes required fields
- Database operations complete successfully
- File uploads and downloads work correctly

### ✅ Error Handling
- Invalid input data returns appropriate error codes
- Missing required fields are caught and reported
- Non-existent resources return 404 errors
- Database errors are handled gracefully

### ✅ Edge Cases
- Empty datasets are handled correctly
- Large datasets are processed efficiently
- Concurrent requests maintain data consistency
- Invalid file formats are rejected

### ✅ Data Validation
- Question answers are validated (A-E only)
- Required fields are enforced
- Input sanitization prevents injection attacks
- Pagination parameters are validated

## Running Tests

### All Tests
```bash
npm test
```

### Individual Test Suites
```bash
npm run test:api          # API endpoint tests
npm run test:database     # Database tests
npm run test:integration  # Integration tests
npm run test:utils        # Utility function tests
```

### Test Options
```bash
npm run test:watch        # Watch mode for development
npm run test:coverage     # Generate coverage report
npm run test:verbose      # Verbose output with detailed results
```

## Test Database

Tests use an in-memory SQLite database (`:memory:`) that:
- Is created fresh for each test run
- Includes the same schema as production
- Is automatically seeded with test data
- Is cleaned up after tests complete

## Mock Data

Tests use realistic mock data including:
- Sample Java questions across different topics
- Various question formats and difficulty levels
- Multiple user test sessions
- Different answer patterns and scores

## Configuration

### Jest Configuration (`jest.config.json`)
- Node.js test environment
- 30-second timeout for database operations
- Coverage reporting enabled
- Setup file for common test configuration

### Test Environment Variables
- Uses in-memory database for isolation
- Disables console output during tests
- Sets appropriate timeouts for async operations

## Performance Testing

The integration test suite includes:
- Concurrent request testing (10 simultaneous users)
- Large dataset handling (100+ questions)
- Data consistency under load
- Response time validation

## Best Practices

### Test Organization
- Each test file focuses on a specific area
- Tests are grouped by functionality
- Setup and teardown are properly handled
- Tests are independent and can run in any order

### Data Management
- Fresh database for each test run
- No test pollution between runs
- Proper cleanup of created resources
- Realistic test data that mirrors production

### Error Testing
- All error conditions are tested
- HTTP status codes are validated
- Error messages are meaningful
- Edge cases are covered

## Coverage Report

Run `npm run test:coverage` to generate a detailed coverage report showing:
- Line coverage percentage
- Function coverage percentage
- Branch coverage percentage
- Statement coverage percentage

The report is generated in HTML format in the `coverage/` directory.

## Continuous Integration

These tests are designed to run in CI/CD pipelines:
- No external dependencies required
- Self-contained test database
- Deterministic results
- Fast execution (< 30 seconds)

## Adding New Tests

When adding new API endpoints or features:

1. Add endpoint tests to `api.test.js`
2. Add database tests to `database.test.js` if needed
3. Add integration workflow tests to `integration.test.js`
4. Add utility function tests to `utils.test.js`
5. Update this documentation

## Troubleshooting

### Common Issues

**Database connection errors:**
- Tests use in-memory database, should not have connection issues
- Check that Database class is properly imported

**Timeout errors:**
- Increase timeout in jest.config.json if needed
- Check for hanging promises in async operations

**Test isolation issues:**
- Ensure proper cleanup in afterAll/afterEach hooks
- Use fresh database for each test suite

**File upload test failures:**
- Check that test files are properly formatted
- Verify multipart form data is correctly structured
