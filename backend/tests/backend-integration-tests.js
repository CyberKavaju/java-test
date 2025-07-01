const Database = require('../src/database/Database');
const ValidationService = require('../src/services/ValidationService');

describe('Backend Integration Tests - Multi-Selection', () => {
    let db;
    let testQuestions = [];

    beforeAll(async () => {
        db = new Database(':memory:');
        await db.init();

        // Create comprehensive test dataset
        const questions = [
            {
                domain: 'Java Basics',
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
                domain: 'Java Basics',
                topic: 'Keywords',
                question_text: 'Which of the following are valid Java keywords?',
                option_a: 'class',
                option_b: 'interface',
                option_c: 'goto',
                option_d: 'const',
                correct_answer: 'A,B',
                explanation: 'class and interface are valid Java keywords',
                question_type: 'multiple'
            },
            {
                domain: 'OOP',
                topic: 'Inheritance',
                question_text: 'Which access modifiers allow inheritance?',
                option_a: 'public',
                option_b: 'private',
                option_c: 'protected',
                option_d: 'default',
                correct_answer: 'A,C,D',
                explanation: 'public, protected, and default allow inheritance',
                question_type: 'multiple'
            },
            {
                domain: 'Collections',
                topic: 'Lists',
                question_text: 'Which is the most efficient for random access?',
                option_a: 'ArrayList',
                option_b: 'LinkedList',
                option_c: 'Vector',
                option_d: 'Stack',
                correct_answer: 'A',
                explanation: 'ArrayList provides O(1) random access',
                question_type: 'single'
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

    describe('End-to-End Question Flow', () => {
        it('should complete full question lifecycle for mixed types', async () => {
            // Step 1: Get random questions
            const questions = await db.getRandomQuestions(4);
            expect(questions).toHaveLength(4);

            // Step 2: Format questions for API
            const formattedQuestions = ValidationService.formatQuestionsForAPI(questions);
            expect(formattedQuestions).toHaveLength(4);

            // Verify formatting
            formattedQuestions.forEach(q => {
                expect(q).toHaveProperty('id');
                expect(q).toHaveProperty('question');
                expect(q).toHaveProperty('options');
                expect(q).toHaveProperty('question_type');
                expect(q).toHaveProperty('max_selections');
                expect(q).not.toHaveProperty('correct_answer'); // Should be filtered out
            });

            // Step 3: Simulate user answers
            const userAnswers = [
                { questionId: questions[0].id, selectedAnswer: 'A' },
                { questionId: questions[1].id, selectedAnswer: ['A', 'B'] },
                { questionId: questions[2].id, selectedAnswer: ['A', 'C'] }, // Partial answer
                { questionId: questions[3].id, selectedAnswer: 'B' } // Wrong answer
            ];

            // Step 4: Validate answers
            const validationResults = [];
            for (const answer of userAnswers) {
                const question = questions.find(q => q.id === answer.questionId);
                const isCorrect = ValidationService.validateAnswer(
                    answer.selectedAnswer,
                    question.correct_answer,
                    question.question_type
                );
                validationResults.push({
                    questionId: answer.questionId,
                    isCorrect,
                    questionType: question.question_type
                });
            }

            // Step 5: Calculate final score
            const score = ValidationService.calculateScore(validationResults);
            expect(score.total).toBe(4);
            expect(score.correct).toBe(2); // Only first two should be correct
            expect(score.percentage).toBe(50);
        });

        it('should handle empty answer scenarios', async () => {
            const questions = await db.getRandomQuestions(2);
            
            // Test empty answers
            const emptyAnswers = [
                { questionId: questions[0].id, selectedAnswer: null },
                { questionId: questions[1].id, selectedAnswer: [] }
            ];

            const validationResults = [];
            for (const answer of emptyAnswers) {
                const question = questions.find(q => q.id === answer.questionId);
                const isCorrect = ValidationService.validateAnswer(
                    answer.selectedAnswer,
                    question.correct_answer,
                    question.question_type
                );
                validationResults.push({
                    questionId: answer.questionId,
                    isCorrect,
                    questionType: question.question_type
                });
            }

            const score = ValidationService.calculateScore(validationResults);
            expect(score.correct).toBe(0);
            expect(score.percentage).toBe(0);
        });
    });

    describe('Performance Tests', () => {
        it('should handle large question sets efficiently', async () => {
            const startTime = Date.now();
            
            // Create 100 questions
            const largeQuestionSet = [];
            for (let i = 0; i < 100; i++) {
                const question = {
                    domain: `Domain ${i % 10}`,
                    topic: `Topic ${i % 20}`,
                    question_text: `Test question ${i}?`,
                    option_a: 'Option A',
                    option_b: 'Option B',
                    option_c: 'Option C',
                    option_d: 'Option D',
                    correct_answer: i % 2 === 0 ? 'A' : 'A,B',
                    explanation: `Explanation ${i}`,
                    question_type: i % 2 === 0 ? 'single' : 'multiple'
                };
                largeQuestionSet.push(question);
            }

            // Import all questions
            const importResults = await db.importQuestions(largeQuestionSet);
            expect(importResults.imported).toBe(100);

            // Get random questions
            const randomQuestions = await db.getRandomQuestions(50);
            expect(randomQuestions).toHaveLength(50);

            // Format for API
            const formatted = ValidationService.formatQuestionsForAPI(randomQuestions);
            expect(formatted).toHaveLength(50);

            const endTime = Date.now();
            const duration = endTime - startTime;
            
            // Should complete within 5 seconds
            expect(duration).toBeLessThan(5000);
            console.log(`Large dataset test completed in ${duration}ms`);
        });

        it('should validate answers quickly', async () => {
            const startTime = Date.now();
            
            // Create many validation scenarios
            const validationTests = [];
            for (let i = 0; i < 1000; i++) {
                validationTests.push({
                    answer: i % 2 === 0 ? 'A' : ['A', 'B'],
                    correct: i % 2 === 0 ? 'A' : 'A,B',
                    type: i % 2 === 0 ? 'single' : 'multiple'
                });
            }

            // Run all validations
            let correctCount = 0;
            for (const test of validationTests) {
                const isCorrect = ValidationService.validateAnswer(
                    test.answer,
                    test.correct,
                    test.type
                );
                if (isCorrect) correctCount++;
            }

            const endTime = Date.now();
            const duration = endTime - startTime;
            
            expect(correctCount).toBe(1000); // All should be correct
            expect(duration).toBeLessThan(1000); // Should complete within 1 second
            console.log(`1000 validations completed in ${duration}ms`);
        });
    });

    describe('Data Integrity Tests', () => {
        it('should maintain referential integrity across operations', async () => {
            const initialCount = await db.getQuestionCount();
            
            // Create and delete questions
            const tempQuestion = {
                domain: 'Test',
                topic: 'Test',
                question_text: 'Temporary question?',
                option_a: 'A', option_b: 'B', option_c: 'C', option_d: 'D',
                correct_answer: 'A',
                explanation: 'Test',
                question_type: 'single'
            };

            const questionId = await db.createQuestion(tempQuestion);
            expect(await db.getQuestionCount()).toBe(initialCount + 1);

            const deleted = await db.deleteQuestion(questionId);
            expect(deleted).toBe(true);
            expect(await db.getQuestionCount()).toBe(initialCount);
        });

        it('should enforce question_type constraints', async () => {
            const invalidQuestion = {
                domain: 'Test',
                topic: 'Test',
                question_text: 'Invalid question?',
                option_a: 'A', option_b: 'B', option_c: 'C', option_d: 'D',
                correct_answer: 'A',
                explanation: 'Test',
                question_type: 'invalid_type'
            };

            await expect(db.createQuestion(invalidQuestion)).rejects.toThrow();
        });

        it('should handle concurrent operations safely', async () => {
            // Simulate concurrent question creation
            const promises = [];
            for (let i = 0; i < 10; i++) {
                const question = {
                    domain: 'Concurrent',
                    topic: 'Test',
                    question_text: `Concurrent question ${i}?`,
                    option_a: 'A', option_b: 'B', option_c: 'C', option_d: 'D',
                    correct_answer: 'A',
                    explanation: 'Test',
                    question_type: 'single'
                };
                promises.push(db.createQuestion(question));
            }

            const results = await Promise.all(promises);
            expect(results).toHaveLength(10);
            expect(results.every(id => typeof id === 'number')).toBe(true);
        });
    });

    describe('Error Handling Tests', () => {
        it('should handle database connection errors gracefully', async () => {
            // Close database connection
            db.close();
            
            // Attempt operations on closed database
            await expect(db.getRandomQuestions(5)).rejects.toThrow();
            
            // Reconnect for cleanup
            await db.init();
        });

        it('should validate input parameters', () => {
            // Test validation service with invalid inputs
            expect(ValidationService.validateAnswer(null, 'A', 'single')).toBe(false);
            expect(ValidationService.validateAnswer('', 'A', 'single')).toBe(false);
            expect(ValidationService.validateAnswer([], 'A,B', 'multiple')).toBe(false);
            expect(ValidationService.validateAnswer(['A'], 'A,B', 'invalid_type')).toBe(false);
        });

        it('should handle malformed question data', () => {
            const malformedQuestion = {
                domain: 'Test',
                topic: 'Test',
                question_text: 'Test?',
                // Missing required options
                correct_answer: 'A',
                question_type: 'single'
            };

            expect(() => ValidationService.formatQuestionForAPI(malformedQuestion))
                .not.toThrow(); // Should handle gracefully
        });
    });

    describe('Backward Compatibility Tests', () => {
        it('should work with legacy questions without question_type', async () => {
            // Create question without question_type (should default to 'single')
            const legacyQuestion = {
                domain: 'Legacy',
                topic: 'Test',
                question_text: 'Legacy question?',
                option_a: 'A', option_b: 'B', option_c: 'C', option_d: 'D',
                correct_answer: 'A',
                explanation: 'Test'
                // No question_type specified
            };

            const questionId = await db.createQuestion(legacyQuestion);
            const retrieved = await db.getQuestion(questionId);
            
            expect(retrieved.question_type).toBe('single');
            
            const formatted = ValidationService.formatQuestionForAPI(retrieved);
            expect(formatted.question_type).toBe('single');
            expect(formatted.max_selections).toBe(1);
        });

        it('should maintain existing API response format', async () => {
            const questions = await db.getRandomQuestions(1);
            const formatted = ValidationService.formatQuestionForAPI(questions[0]);

            // Check that all expected fields are present
            expect(formatted).toHaveProperty('id');
            expect(formatted).toHaveProperty('question');
            expect(formatted).toHaveProperty('options');
            expect(Array.isArray(formatted.options)).toBe(true);
            
            // Check option format
            formatted.options.forEach(option => {
                expect(option).toHaveProperty('key');
                expect(option).toHaveProperty('text');
                expect(typeof option.key).toBe('string');
                expect(typeof option.text).toBe('string');
            });
        });
    });
});
