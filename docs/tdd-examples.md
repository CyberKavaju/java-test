# TDD Examples for Java Test Application

This document provides practical examples of applying TDD principles to the Java Test Application.

## Example 1: Adding a New API Endpoint

### Scenario: Add endpoint to get questions by topic

#### Step 1: Write the failing test first (RED)

```javascript
// tests/api.test.js
describe('GET /api/questions/by-topic', () => {
    it('should return questions filtered by topic', async () => {
        // Arrange: Seed questions with different topics
        await testDb.createQuestion({
            domain: 'Java Basics',
            topic: 'Variables',
            question_text: 'What is a variable?',
            option_a: 'A storage location',
            option_b: 'A method',
            option_c: 'A class',
            option_d: 'A package',
            correct_answer: 'A',
            explanation: 'Variables store data'
        });

        await testDb.createQuestion({
            domain: 'Java Basics',
            topic: 'Methods',
            question_text: 'What is a method?',
            option_a: 'A storage location',
            option_b: 'A function',
            option_c: 'A class',
            option_d: 'A package',
            correct_answer: 'B',
            explanation: 'Methods are functions'
        });

        // Act & Assert
        const response = await request(app)
            .get('/api/questions/by-topic?topic=Variables')
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.questions).toHaveLength(1);
        expect(response.body.questions[0].topic).toBe('Variables');
        expect(response.body.questions[0]).not.toHaveProperty('correct_answer');
    });

    it('should return empty array for non-existent topic', async () => {
        const response = await request(app)
            .get('/api/questions/by-topic?topic=NonExistent')
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.questions).toHaveLength(0);
    });

    it('should return 400 for missing topic parameter', async () => {
        const response = await request(app)
            .get('/api/questions/by-topic')
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('topic parameter is required');
    });
});
```

#### Step 2: Run test - should FAIL (RED)
```bash
npm test -- --testNamePattern="by-topic"
# Expected: Tests should fail because endpoint doesn't exist
```

#### Step 3: Write minimum code to pass (GREEN)

```javascript
// src/server.js or testServer.js
app.get('/api/questions/by-topic', async (req, res) => {
    try {
        const { topic } = req.query;
        
        if (!topic) {
            return res.status(400).json({
                success: false,
                error: 'topic parameter is required'
            });
        }

        const questions = await db.getQuestionsByTopic(topic);
        
        // Remove sensitive data
        const sanitizedQuestions = questions.map(q => {
            const { correct_answer, explanation, ...safeQuestion } = q;
            return safeQuestion;
        });

        res.json({
            success: true,
            questions: sanitizedQuestions
        });
    } catch (error) {
        console.error('Error fetching questions by topic:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch questions'
        });
    }
});
```

#### Step 4: Add database method (still GREEN phase)

```javascript
// src/database/Database.js
async getQuestionsByTopic(topic) {
    return new Promise((resolve, reject) => {
        this.db.all(
            'SELECT * FROM questions WHERE topic = ?',
            [topic],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}
```

#### Step 5: Run tests - should PASS (GREEN)
```bash
npm test -- --testNamePattern="by-topic"
# Expected: All tests should now pass
```

#### Step 6: Refactor while keeping tests green (REFACTOR)

```javascript
// Refactor: Extract validation middleware
const validateTopicParameter = (req, res, next) => {
    const { topic } = req.query;
    
    if (!topic || topic.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'topic parameter is required'
        });
    }
    
    next();
};

// Refactor: Use middleware
app.get('/api/questions/by-topic', validateTopicParameter, async (req, res) => {
    try {
        const { topic } = req.query;
        const questions = await db.getQuestionsByTopic(topic.trim());
        
        res.json({
            success: true,
            questions: sanitizeQuestions(questions)
        });
    } catch (error) {
        handleDatabaseError(res, error, 'Failed to fetch questions by topic');
    }
});
```

## Example 2: Adding Business Logic with TDD

### Scenario: Implement question difficulty scoring

#### Step 1: Write tests for the business logic (RED)

```javascript
// tests/utils.test.js
describe('Question Difficulty Scoring', () => {
    describe('calculateDifficultyScore', () => {
        it('should return high difficulty for low success rate', () => {
            const attempts = 100;
            const correctAnswers = 20; // 20% success rate
            
            const difficulty = calculateDifficultyScore(attempts, correctAnswers);
            
            expect(difficulty).toBe('hard');
        });

        it('should return medium difficulty for moderate success rate', () => {
            const attempts = 100;
            const correctAnswers = 65; // 65% success rate
            
            const difficulty = calculateDifficultyScore(attempts, correctAnswers);
            
            expect(difficulty).toBe('medium');
        });

        it('should return easy difficulty for high success rate', () => {
            const attempts = 100;
            const correctAnswers = 85; // 85% success rate
            
            const difficulty = calculateDifficultyScore(attempts, correctAnswers);
            
            expect(difficulty).toBe('easy');
        });

        it('should handle zero attempts gracefully', () => {
            const difficulty = calculateDifficultyScore(0, 0);
            
            expect(difficulty).toBe('unknown');
        });

        it('should handle edge case of 100% success rate', () => {
            const attempts = 50;
            const correctAnswers = 50;
            
            const difficulty = calculateDifficultyScore(attempts, correctAnswers);
            
            expect(difficulty).toBe('easy');
        });
    });
});
```

#### Step 2: Write the implementation (GREEN)

```javascript
// src/utils/scoring.js
function calculateDifficultyScore(totalAttempts, correctAnswers) {
    if (totalAttempts === 0) {
        return 'unknown';
    }
    
    const successRate = (correctAnswers / totalAttempts) * 100;
    
    if (successRate >= 80) {
        return 'easy';
    } else if (successRate >= 50) {
        return 'medium';
    } else {
        return 'hard';
    }
}

module.exports = {
    calculateDifficultyScore
};
```

#### Step 3: Refactor with more sophisticated logic (REFACTOR)

```javascript
// Refactor: Add confidence intervals based on sample size
function calculateDifficultyScore(totalAttempts, correctAnswers) {
    if (totalAttempts === 0) {
        return { level: 'unknown', confidence: 0 };
    }
    
    const successRate = (correctAnswers / totalAttempts) * 100;
    const confidence = Math.min(totalAttempts / 30, 1); // 30+ attempts = full confidence
    
    let level;
    if (successRate >= 80) {
        level = 'easy';
    } else if (successRate >= 50) {
        level = 'medium';
    } else {
        level = 'hard';
    }
    
    return { level, confidence, successRate };
}
```

## Example 3: Database Integration Testing

### Scenario: Test user attempt tracking with complex queries

#### Step 1: Write integration test (RED)

```javascript
// tests/integration.test.js
describe('User Attempt Tracking Integration', () => {
    it('should track user attempts and calculate statistics correctly', async () => {
        // Arrange: Create test questions
        const questionIds = [];
        for (let i = 0; i < 3; i++) {
            const id = await testDb.createQuestion({
                domain: 'Test',
                topic: 'Integration',
                question_text: `Question ${i + 1}?`,
                option_a: 'A', option_b: 'B', option_c: 'C', option_d: 'D',
                correct_answer: 'A',
                explanation: `Explanation ${i + 1}`
            });
            questionIds.push(id);
        }

        const userId = 'integration_test_user';

        // Act: Simulate multiple test sessions
        // Session 1: 2/3 correct
        await testDb.recordUserAttempts(userId, [
            { questionId: questionIds[0], selectedAnswer: 'A', isCorrect: true },
            { questionId: questionIds[1], selectedAnswer: 'A', isCorrect: true },
            { questionId: questionIds[2], selectedAnswer: 'B', isCorrect: false }
        ]);

        // Session 2: 1/3 correct
        await testDb.recordUserAttempts(userId, [
            { questionId: questionIds[0], selectedAnswer: 'B', isCorrect: false },
            { questionId: questionIds[1], selectedAnswer: 'C', isCorrect: false },
            { questionId: questionIds[2], selectedAnswer: 'A', isCorrect: true }
        ]);

        // Assert: Check statistics
        const userStats = await testDb.getUserStats(userId);
        
        expect(userStats.totalAttempts).toBe(6); // 2 sessions × 3 questions
        expect(userStats.correctAnswers).toBe(3); // Total correct
        expect(userStats.totalTests).toBe(2); // Number of sessions
        expect(userStats.averageScore).toBe(50); // (66.67 + 33.33) / 2

        // Check per-question statistics
        const questionStats = await testDb.getQuestionStats(questionIds[0]);
        expect(questionStats.totalAttempts).toBe(2);
        expect(questionStats.correctAnswers).toBe(1);
        expect(questionStats.successRate).toBe(50);
    });
});
```

#### Step 2: Implement database methods (GREEN)

```javascript
// src/database/Database.js
async recordUserAttempts(userId, attempts) {
    return new Promise((resolve, reject) => {
        this.db.serialize(() => {
            this.db.run("BEGIN TRANSACTION");

            const insertAttempt = this.db.prepare(`
                INSERT INTO user_attempts (user_id, question_id, selected_answer, is_correct, attempted_at)
                VALUES (?, ?, ?, ?, datetime('now'))
            `);

            const updateStats = this.db.prepare(`
                INSERT OR REPLACE INTO question_stats 
                (question_id, total_attempts, correct_answers, last_updated)
                VALUES (?, 
                    COALESCE((SELECT total_attempts FROM question_stats WHERE question_id = ?), 0) + 1,
                    COALESCE((SELECT correct_answers FROM question_stats WHERE question_id = ?), 0) + ?,
                    datetime('now'))
            `);

            try {
                attempts.forEach(attempt => {
                    insertAttempt.run([
                        userId, 
                        attempt.questionId, 
                        attempt.selectedAnswer, 
                        attempt.isCorrect ? 1 : 0
                    ]);

                    updateStats.run([
                        attempt.questionId,
                        attempt.questionId,
                        attempt.questionId,
                        attempt.isCorrect ? 1 : 0
                    ]);
                });

                this.db.run("COMMIT", (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } catch (error) {
                this.db.run("ROLLBACK");
                reject(error);
            } finally {
                insertAttempt.finalize();
                updateStats.finalize();
            }
        });
    });
}
```

## Example 4: Error Handling with TDD

### Scenario: Robust error handling for file uploads

#### Step 1: Write tests for all error scenarios (RED)

```javascript
// tests/api.test.js
describe('CSV Import Error Handling', () => {
    it('should reject non-CSV files', async () => {
        const textContent = 'This is not a CSV file';
        
        const response = await request(app)
            .post('/api/import/questions')
            .attach('file', Buffer.from(textContent), 'test.txt')
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('Only CSV files are allowed');
    });

    it('should handle CSV with missing required columns', async () => {
        const invalidCsv = 'Domain,Topic\nTest,Test'; // Missing required columns
        
        const response = await request(app)
            .post('/api/import/questions')
            .attach('file', Buffer.from(invalidCsv), 'invalid.csv')
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('Missing required columns');
        expect(response.body.missingColumns).toContain('Question');
    });

    it('should handle CSV with invalid data types', async () => {
        const invalidCsv = `Domain,Topic,Question,A,B,C,D,Correct Answer,Explanation
Test,Test,Question?,A,B,C,D,InvalidAnswer,Explanation`; // Invalid correct answer
        
        const response = await request(app)
            .post('/api/import/questions')
            .attach('file', Buffer.from(invalidCsv), 'invalid.csv')
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.validationErrors).toHaveLength(1);
        expect(response.body.validationErrors[0]).toContain('Correct answer must be A, B, C, D, or E');
    });

    it('should handle file size limits', async () => {
        // Create a large CSV that exceeds the limit
        const largeCsv = 'Domain,Topic,Question,A,B,C,D,Correct Answer,Explanation\n' +
            'x'.repeat(15 * 1024 * 1024); // 15MB content
        
        const response = await request(app)
            .post('/api/import/questions')
            .attach('file', Buffer.from(largeCsv), 'large.csv')
            .expect(413);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('File too large');
    });
});
```

#### Step 2: Implement comprehensive error handling (GREEN)

```javascript
// src/middleware/uploadMiddleware.js
const multer = require('multer');

const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'text/csv') {
            return cb(new Error('Only CSV files are allowed'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

const handleUploadErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                success: false,
                error: 'File too large. Maximum size is 10MB.'
            });
        }
    }
    
    if (err.message === 'Only CSV files are allowed') {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }
    
    next(err);
};

module.exports = { upload, handleUploadErrors };
```

## TDD Anti-Patterns to Avoid

### ❌ Don't Do This

```javascript
// Anti-pattern: Testing implementation details
it('should call database.query with specific SQL', () => {
    const spy = jest.spyOn(database, 'query');
    service.getQuestions();
    expect(spy).toHaveBeenCalledWith('SELECT * FROM questions');
});

// Anti-pattern: One giant test
it('should handle everything', async () => {
    // 100 lines of test code testing multiple behaviors
});

// Anti-pattern: Testing multiple things in one test
it('should create question and update stats and send notification', () => {
    // Testing three different responsibilities
});
```

### ✅ Do This Instead

```javascript
// Good: Test behavior, not implementation
it('should return all questions', async () => {
    const questions = await service.getQuestions();
    expect(questions).toHaveLength(100);
    expect(questions[0]).toHaveProperty('question_text');
});

// Good: Focused, single-responsibility tests
describe('Question Creation', () => {
    it('should create a question with valid data', () => {});
    it('should reject question with missing required fields', () => {});
    it('should validate option format', () => {});
});

// Good: Test one behavior per test
it('should increment question stats when answer is submitted', () => {
    // Focus on just the stats increment behavior
});
```

## Quick Reference Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- api.test.js

# Run tests matching pattern
npm test -- --testNamePattern="question"

# Run tests with coverage
npm run test:coverage

# Run tests verbosely
npm run test:verbose
```

Remember: **Red → Green → Refactor** - always start with a failing test!
