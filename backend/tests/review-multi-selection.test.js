const Database = require('../src/database/Database');
const ReviewSessionController = require('../src/review/ReviewSessionController');
const TopicQuestionMapper = require('../src/review/TopicQuestionMapper');
const ValidationService = require('../src/services/ValidationService');

describe('Review Session Multi-Selection Support', () => {
    let db;
    let reviewController;
    let topicMapper;
    let testQuestions = [];

    beforeAll(async () => {
        db = new Database(':memory:');
        await db.init();
        
        topicMapper = new TopicQuestionMapper();
        reviewController = new ReviewSessionController(db, topicMapper);

        // Create test questions with both single and multiple choice
        const questions = [
            {
                domain: 'Working With Java Data Types',
                topic: 'Variables',
                question_text: 'What is the default value of an int variable?',
                option_a: '0',
                option_b: 'null',
                option_c: '1',
                option_d: 'undefined',
                correct_answer: 'A',
                explanation: 'The default value of an int is 0',
                question_type: 'single'
            },
            {
                domain: 'Working With Java Data Types',
                topic: 'Variables',
                question_text: 'Which are valid primitive types in Java?',
                option_a: 'int',
                option_b: 'String',
                option_c: 'boolean',
                option_d: 'char',
                correct_answer: 'A,C,D',
                explanation: 'int, boolean, and char are primitive types',
                question_type: 'multiple'
            },
            {
                domain: 'Working With Java Data Types',
                topic: 'Variables',
                question_text: 'Which keywords are access modifiers?',
                option_a: 'public',
                option_b: 'static',
                option_c: 'private',
                option_d: 'protected',
                correct_answer: 'A,C,D',
                explanation: 'public, private, and protected are access modifiers',
                question_type: 'multiple'
            }
        ];

        for (const question of questions) {
            const id = await db.createQuestion(question);
            testQuestions.push({ id, ...question });
        }
    });

    afterAll(async () => {
        if (db) {
            db.close();
        }
    });

    describe('Review Session Creation', () => {
        it('should start a review session with formatted multi-selection questions', async () => {
            const userId = 'test_user';
            const topicId = '04-variable'; // Use valid topic ID from TopicQuestionMapper

            const session = await reviewController.startSession(userId, topicId);

            expect(session).toHaveProperty('sessionId');
            expect(session).toHaveProperty('questions');
            expect(session).toHaveProperty('roundInfo');

            // Check that questions are properly formatted
            expect(session.questions).toHaveLength(3);
            
            session.questions.forEach(question => {
                expect(question).toHaveProperty('id');
                expect(question).toHaveProperty('question');
                expect(question).toHaveProperty('options');
                expect(question).toHaveProperty('question_type');
                expect(question).toHaveProperty('max_selections');
                
                // Should not include correct answers
                expect(question).not.toHaveProperty('correct_answer');
                
                // Check question type specific properties
                if (question.question_type === 'single') {
                    expect(question.max_selections).toBe(1);
                } else if (question.question_type === 'multiple') {
                    expect(question.max_selections).toBeGreaterThan(1);
                }
            });
        });
    });

    describe('Answer Submission and Validation', () => {
        let sessionId;

        beforeEach(async () => {
            const session = await reviewController.startSession('test_user', '04-variable');
            sessionId = session.sessionId;
        });

        it('should correctly validate single choice answers', async () => {
            const answers = [
                {
                    questionId: testQuestions[0].id, // Single choice question
                    selectedAnswer: 'A' // Correct answer
                }
            ];

            const result = await reviewController.submitRound(sessionId, answers);

            expect(result.results).toHaveLength(1);
            expect(result.results[0].isCorrect).toBe(true);
            expect(result.results[0].selectedAnswer).toBe('A');
            expect(result.results[0].correctAnswer).toBe('A');
            expect(result.results[0].question_type).toBe('single');
        });

        it('should correctly validate multiple choice answers', async () => {
            const answers = [
                {
                    questionId: testQuestions[1].id, // Multiple choice question
                    selectedAnswer: ['A', 'C', 'D'] // Correct answer
                }
            ];

            const result = await reviewController.submitRound(sessionId, answers);

            expect(result.results).toHaveLength(1);
            expect(result.results[0].isCorrect).toBe(true);
            expect(result.results[0].selectedAnswer).toEqual(['A', 'C', 'D']);
            expect(result.results[0].correctAnswer).toEqual(['A', 'C', 'D']);
            expect(result.results[0].question_type).toBe('multiple');
        });

        it('should handle incorrect multiple choice answers', async () => {
            const answers = [
                {
                    questionId: testQuestions[1].id, // Multiple choice question
                    selectedAnswer: ['A', 'B'] // Incorrect - missing C and D, includes B
                }
            ];

            const result = await reviewController.submitRound(sessionId, answers);

            expect(result.results).toHaveLength(1);
            expect(result.results[0].isCorrect).toBe(false);
            expect(result.results[0].selectedAnswer).toEqual(['A', 'B']);
            expect(result.results[0].correctAnswer).toEqual(['A', 'C', 'D']);
        });

        it('should handle partial multiple choice answers', async () => {
            const answers = [
                {
                    questionId: testQuestions[1].id, // Multiple choice question
                    selectedAnswer: ['A'] // Partial answer
                }
            ];

            const result = await reviewController.submitRound(sessionId, answers);

            expect(result.results).toHaveLength(1);
            expect(result.results[0].isCorrect).toBe(false);
            expect(result.results[0].selectedAnswer).toEqual(['A']);
            expect(result.results[0].correctAnswer).toEqual(['A', 'C', 'D']);
        });

        it('should handle mixed question types in one round', async () => {
            const answers = [
                {
                    questionId: testQuestions[0].id, // Single choice
                    selectedAnswer: 'A' // Correct
                },
                {
                    questionId: testQuestions[1].id, // Multiple choice
                    selectedAnswer: ['A', 'C', 'D'] // Correct
                },
                {
                    questionId: testQuestions[2].id, // Multiple choice
                    selectedAnswer: ['A', 'C'] // Incorrect - missing D
                }
            ];

            const result = await reviewController.submitRound(sessionId, answers);

            expect(result.results).toHaveLength(3);
            expect(result.results[0].isCorrect).toBe(true);  // Single choice correct
            expect(result.results[1].isCorrect).toBe(true);  // Multiple choice correct
            expect(result.results[2].isCorrect).toBe(false); // Multiple choice incorrect

            expect(result.roundSummary.correctCount).toBe(2);
            expect(result.roundSummary.totalCount).toBe(3);
            expect(result.roundSummary.percentage).toBe(67); // 2/3 = 66.67 -> 67
        });

        it('should handle wrong order in multiple choice answers', async () => {
            const answers = [
                {
                    questionId: testQuestions[1].id, // Multiple choice question
                    selectedAnswer: ['D', 'A', 'C'] // Correct answers in wrong order
                }
            ];

            const result = await reviewController.submitRound(sessionId, answers);

            expect(result.results).toHaveLength(1);
            expect(result.results[0].isCorrect).toBe(true); // Order shouldn't matter
            expect(result.results[0].selectedAnswer).toEqual(['D', 'A', 'C']);
            expect(result.results[0].correctAnswer).toEqual(['A', 'C', 'D']);
        });
    });

    describe('Round Progression with Multi-Selection', () => {
        let sessionId;

        beforeEach(async () => {
            const session = await reviewController.startSession('test_user', '04-variable');
            sessionId = session.sessionId;
        });

        it('should complete session when all multi-selection questions are correct', async () => {
            const answers = [
                {
                    questionId: testQuestions[0].id,
                    selectedAnswer: 'A'
                },
                {
                    questionId: testQuestions[1].id,
                    selectedAnswer: ['A', 'C', 'D']
                },
                {
                    questionId: testQuestions[2].id,
                    selectedAnswer: ['A', 'C', 'D']
                }
            ];

            const result = await reviewController.submitRound(sessionId, answers);

            expect(result.roundSummary.correctCount).toBe(3);
            expect(result.roundSummary.totalCount).toBe(3);
            expect(result.roundSummary.percentage).toBe(100);
            expect(result.roundSummary.isComplete).toBe(true);
        });

        it('should require next round when multi-selection questions are incorrect', async () => {
            const answers = [
                {
                    questionId: testQuestions[0].id,
                    selectedAnswer: 'B' // Wrong
                },
                {
                    questionId: testQuestions[1].id,
                    selectedAnswer: ['A', 'B'] // Wrong
                },
                {
                    questionId: testQuestions[2].id,
                    selectedAnswer: ['A', 'C', 'D'] // Correct
                }
            ];

            const result = await reviewController.submitRound(sessionId, answers);

            expect(result.roundSummary.correctCount).toBe(1);
            expect(result.roundSummary.totalCount).toBe(3);
            expect(result.roundSummary.percentage).toBe(33);
            expect(result.roundSummary.isComplete).toBe(false);
            expect(result.roundSummary.nextRoundQuestions).toEqual([
                testQuestions[0].id,
                testQuestions[1].id
            ]);
        });
    });

    describe('Data Storage for Multi-Selection', () => {
        it('should store multi-selection answers properly in database', async () => {
            const session = await reviewController.startSession('test_user', '04-variable');
            const sessionId = session.sessionId;

            const answers = [
                {
                    questionId: testQuestions[1].id,
                    selectedAnswer: ['A', 'C', 'D']
                }
            ];

            await reviewController.submitRound(sessionId, answers);

            // Verify answer was stored correctly
            const storedAttempts = await new Promise((resolve, reject) => {
                db.db.all(
                    'SELECT * FROM topic_review_attempts WHERE session_id = ?',
                    [sessionId],
                    (err, rows) => {
                        if (err) reject(err);
                        else resolve(rows);
                    }
                );
            });

            expect(storedAttempts).toHaveLength(1);
            expect(storedAttempts[0].question_id).toBe(testQuestions[1].id);
            expect(storedAttempts[0].is_correct).toBe(1); // SQLite stores boolean as 1/0
            
            // Multi-selection answers should be stored as JSON string
            const storedAnswer = storedAttempts[0].selected_answer;
            expect(storedAnswer).toBe('["A","C","D"]');
        });
    });
});
