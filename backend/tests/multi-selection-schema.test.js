const Database = require('../src/database/Database');

describe('Multi-Selection Database Schema', () => {
    let db;

    beforeAll(async () => {
        db = new Database(':memory:');
        await db.init();
    });

    afterAll(async () => {
        if (db) {
            db.close();
        }
    });

    describe('Schema Migration', () => {
        it('should have question_type column in questions table', async () => {
            const columns = await new Promise((resolve, reject) => {
                db.db.all("PRAGMA table_info(questions)", (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows.map(row => row.name));
                });
            });

            expect(columns).toContain('question_type');
        });

        it('should default question_type to single for existing questions', async () => {
            // Insert a test question without specifying question_type
            const questionData = {
                domain: 'Test Domain',
                topic: 'Test Topic',
                question_text: 'What is a test question?',
                option_a: 'Option A',
                option_b: 'Option B',
                option_c: 'Option C',
                option_d: 'Option D',
                correct_answer: 'A',
                explanation: 'Test explanation'
            };

            const questionId = await db.createQuestion(questionData);
            const question = await db.getQuestion(questionId);
            
            expect(question.question_type).toBe('single');
        });

        it('should support multiple question type for new questions', async () => {
            const multiQuestionData = {
                domain: 'Test Domain',
                topic: 'Test Topic',
                question_text: 'Select all valid Java keywords:',
                option_a: 'class',
                option_b: 'interface',
                option_c: 'goto',
                option_d: 'const',
                correct_answer: 'A,B',
                explanation: 'class and interface are valid Java keywords',
                question_type: 'multiple'
            };

            const questionId = await db.createQuestion(multiQuestionData);
            const question = await db.getQuestion(questionId);
            
            expect(question.question_type).toBe('multiple');
            expect(question.correct_answer).toBe('A,B');
        });

        it('should validate question_type values', async () => {
            const invalidQuestionData = {
                domain: 'Test Domain',
                topic: 'Test Topic',
                question_text: 'Invalid question type test',
                option_a: 'Option A',
                option_b: 'Option B',
                option_c: 'Option C',
                option_d: 'Option D',
                correct_answer: 'A',
                explanation: 'Test explanation',
                question_type: 'invalid_type'
            };

            await expect(db.createQuestion(invalidQuestionData)).rejects.toThrow();
        });
    });

    describe('Multi-Selection Data Handling', () => {
        it('should store comma-separated correct answers for multiple questions', async () => {
            const multiQuestionData = {
                domain: 'Java Basics',
                topic: 'Keywords',
                question_text: 'Which of the following are valid Java access modifiers?',
                option_a: 'public',
                option_b: 'private',
                option_c: 'goto',
                option_d: 'protected',
                correct_answer: 'A,B,D',
                explanation: 'public, private, and protected are valid access modifiers',
                question_type: 'multiple'
            };

            const questionId = await db.createQuestion(multiQuestionData);
            const question = await db.getQuestion(questionId);
            
            expect(question.correct_answer).toBe('A,B,D');
            expect(question.question_type).toBe('multiple');
        });

        it('should handle single answers for single questions', async () => {
            const singleQuestionData = {
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
            };

            const questionId = await db.createQuestion(singleQuestionData);
            const question = await db.getQuestion(questionId);
            
            expect(question.correct_answer).toBe('A');
            expect(question.question_type).toBe('single');
        });
    });

    describe('Backward Compatibility', () => {
        it('should not break existing question queries', async () => {
            // Insert questions with both types
            const singleQuestion = {
                domain: 'Test',
                topic: 'Test',
                question_text: 'Single question?',
                option_a: 'A', option_b: 'B', option_c: 'C', option_d: 'D',
                correct_answer: 'A',
                explanation: 'Test'
            };

            const multiQuestion = {
                domain: 'Test',
                topic: 'Test',
                question_text: 'Multi question?',
                option_a: 'A', option_b: 'B', option_c: 'C', option_d: 'D',
                correct_answer: 'A,B',
                explanation: 'Test',
                question_type: 'multiple'
            };

            const singleId = await db.createQuestion(singleQuestion);
            const multiId = await db.createQuestion(multiQuestion);

            // Test that we can retrieve all questions
            const allQuestions = await db.getRandomQuestions(10);
            expect(allQuestions.length).toBeGreaterThan(0);
            
            // Test that individual questions can be retrieved
            const single = await db.getQuestion(singleId);
            const multi = await db.getQuestion(multiId);
            
            expect(single).toBeDefined();
            expect(multi).toBeDefined();
            expect(single.question_type).toBe('single');
            expect(multi.question_type).toBe('multiple');
        });
    });
});
