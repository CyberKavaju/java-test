const Database = require('../src/database/Database');
const ValidationService = require('../src/services/ValidationService');

describe('Multi-Selection Backend API', () => {
    let db;
    let singleQuestionId;
    let multipleQuestionId;

    beforeAll(async () => {
        db = new Database(':memory:');
        await db.init();

        // Create test questions
        const singleQuestion = {
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

        const multipleQuestion = {
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
        };

        singleQuestionId = await db.createQuestion(singleQuestion);
        multipleQuestionId = await db.createQuestion(multipleQuestion);
    });

    afterAll(async () => {
        if (db) {
            db.close();
        }
    });

    describe('Question Model Updates', () => {
        it('should format single questions correctly for API response', async () => {
            const question = await db.getQuestion(singleQuestionId);
            const formattedQuestion = ValidationService.formatQuestionForAPI(question);

            expect(formattedQuestion).toEqual({
                id: singleQuestionId,
                question: 'What is the default value of an int variable?',
                options: [
                    { key: 'A', text: '0' },
                    { key: 'B', text: 'null' },
                    { key: 'C', text: '1' },
                    { key: 'D', text: 'undefined' }
                ],
                question_type: 'single',
                max_selections: 1
            });
            
            // Should not include correct answer in API response
            expect(formattedQuestion).not.toHaveProperty('correct_answer');
        });

        it('should format multiple questions correctly for API response', async () => {
            const question = await db.getQuestion(multipleQuestionId);
            const formattedQuestion = ValidationService.formatQuestionForAPI(question);

            expect(formattedQuestion).toEqual({
                id: multipleQuestionId,
                question: 'Which of the following are valid Java keywords?',
                options: [
                    { key: 'A', text: 'class' },
                    { key: 'B', text: 'interface' },
                    { key: 'C', text: 'goto' },
                    { key: 'D', text: 'const' }
                ],
                question_type: 'multiple',
                max_selections: 2
            });
            
            // Should not include correct answer in API response
            expect(formattedQuestion).not.toHaveProperty('correct_answer');
        });

        it('should calculate max_selections correctly for multiple questions', async () => {
            const multiQuestion = {
                domain: 'Test',
                topic: 'Test',
                question_text: 'Test question with 3 correct answers',
                option_a: 'A', option_b: 'B', option_c: 'C', option_d: 'D',
                correct_answer: 'A,B,C',
                question_type: 'multiple'
            };

            const questionId = await db.createQuestion(multiQuestion);
            const question = await db.getQuestion(questionId);
            const formattedQuestion = ValidationService.formatQuestionForAPI(question);

            expect(formattedQuestion.max_selections).toBe(3);
        });
    });

    describe('Answer Validation Logic', () => {
        it('should validate single question answers correctly', () => {
            const singleAnswer = 'A';
            const correctAnswer = 'A';
            const questionType = 'single';

            const isCorrect = ValidationService.validateAnswer(singleAnswer, correctAnswer, questionType);
            expect(isCorrect).toBe(true);

            const wrongAnswer = 'B';
            const isIncorrect = ValidationService.validateAnswer(wrongAnswer, correctAnswer, questionType);
            expect(isIncorrect).toBe(false);
        });

        it('should validate multiple question answers correctly', () => {
            const multipleAnswer = ['A', 'B'];
            const correctAnswer = 'A,B';
            const questionType = 'multiple';

            const isCorrect = ValidationService.validateAnswer(multipleAnswer, correctAnswer, questionType);
            expect(isCorrect).toBe(true);

            // Partial answers should be incorrect
            const partialAnswer = ['A'];
            const isPartial = ValidationService.validateAnswer(partialAnswer, correctAnswer, questionType);
            expect(isPartial).toBe(false);

            // Wrong order should still be correct
            const reorderedAnswer = ['B', 'A'];
            const isReordered = ValidationService.validateAnswer(reorderedAnswer, correctAnswer, questionType);
            expect(isReordered).toBe(true);

            // Extra answers should be incorrect
            const extraAnswer = ['A', 'B', 'C'];
            const isExtra = ValidationService.validateAnswer(extraAnswer, correctAnswer, questionType);
            expect(isExtra).toBe(false);
        });

        it('should handle empty or invalid answers', () => {
            expect(ValidationService.validateAnswer(null, 'A', 'single')).toBe(false);
            expect(ValidationService.validateAnswer([], 'A,B', 'multiple')).toBe(false);
            expect(ValidationService.validateAnswer('', 'A', 'single')).toBe(false);
        });
    });

    describe('Scoring Algorithm', () => {
        it('should calculate scores correctly for mixed question types', () => {
            const answers = [
                { questionType: 'single', isCorrect: true },
                { questionType: 'single', isCorrect: false },
                { questionType: 'multiple', isCorrect: true },
                { questionType: 'multiple', isCorrect: false }
            ];

            const score = ValidationService.calculateScore(answers);
            expect(score).toEqual({
                correct: 2,
                total: 4,
                percentage: 50
            });
        });

        it('should handle all correct answers', () => {
            const answers = [
                { questionType: 'single', isCorrect: true },
                { questionType: 'multiple', isCorrect: true }
            ];

            const score = ValidationService.calculateScore(answers);
            expect(score).toEqual({
                correct: 2,
                total: 2,
                percentage: 100
            });
        });

        it('should handle all incorrect answers', () => {
            const answers = [
                { questionType: 'single', isCorrect: false },
                { questionType: 'multiple', isCorrect: false }
            ];

            const score = ValidationService.calculateScore(answers);
            expect(score).toEqual({
                correct: 0,
                total: 2,
                percentage: 0
            });
        });
    });

    describe('Question Type Filtering', () => {
        it('should filter questions by type', async () => {
            const singleQuestions = await db.getQuestionsByType('single');
            expect(singleQuestions.length).toBeGreaterThan(0);
            expect(singleQuestions[0].question_type).toBe('single');

            const multipleQuestions = await db.getQuestionsByType('multiple');
            expect(multipleQuestions.length).toBeGreaterThan(0);
            expect(multipleQuestions[0].question_type).toBe('multiple');
        });

        it('should get mixed question types by default', async () => {
            const allQuestions = await db.getRandomQuestions(10);
            expect(allQuestions.length).toBeGreaterThan(0);
            
            const hasMultiple = allQuestions.some(q => q.question_type === 'multiple');
            const hasSingle = allQuestions.some(q => q.question_type === 'single');
            
            expect(hasMultiple || hasSingle).toBe(true);
        });
    });

    describe('CSV Import with Multi-Selection', () => {
        it('should import questions with question_type from CSV', async () => {
            const csvQuestions = [
                {
                    domain: 'Import Test',
                    topic: 'Test',
                    question_text: 'Unique single import question for CSV test?',
                    option_a: 'A', option_b: 'B', option_c: 'C', option_d: 'D',
                    correct_answer: 'A',
                    explanation: 'Test',
                    question_type: 'single'
                },
                {
                    domain: 'Import Test',
                    topic: 'Test',
                    question_text: 'Unique multiple import question for CSV test?',
                    option_a: 'A', option_b: 'B', option_c: 'C', option_d: 'D',
                    correct_answer: 'A,B',
                    explanation: 'Test',
                    question_type: 'multiple'
                }
            ];

            const results = await db.importQuestions(csvQuestions);
            expect(results.imported).toBe(2);
            expect(results.errors).toBe(0);
        });
    });
});
