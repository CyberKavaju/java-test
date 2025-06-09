// Test utility functions and edge cases

describe('API Utility Functions', () => {
    describe('Parameter Validation', () => {
        it('should validate pagination parameters', () => {
            // Test pagination parameter validation
            const validatePagination = (page, limit) => {
                const parsedPage = parseInt(page) || 1;
                const parsedLimit = Math.min(parseInt(limit) || 20, 100);
                
                return {
                    page: Math.max(parsedPage, 1),
                    limit: Math.max(parsedLimit, 1)
                };
            };

            expect(validatePagination('1', '20')).toEqual({ page: 1, limit: 20 });
            expect(validatePagination('0', '0')).toEqual({ page: 1, limit: 20 });
            expect(validatePagination('-1', '-5')).toEqual({ page: 1, limit: 20 });
            expect(validatePagination('abc', 'xyz')).toEqual({ page: 1, limit: 20 });
            expect(validatePagination('5', '200')).toEqual({ page: 5, limit: 100 }); // Max limit
        });

        it('should validate question answer options', () => {
            const validateAnswer = (answer) => {
                const validOptions = ['A', 'B', 'C', 'D', 'E'];
                return validOptions.includes(answer?.toUpperCase());
            };

            expect(validateAnswer('A')).toBe(true);
            expect(validateAnswer('a')).toBe(true);
            expect(validateAnswer('B')).toBe(true);
            expect(validateAnswer('E')).toBe(true);
            expect(validateAnswer('F')).toBe(false);
            expect(validateAnswer('1')).toBe(false);
            expect(validateAnswer('')).toBe(false);
            expect(validateAnswer(null)).toBe(false);
            expect(validateAnswer(undefined)).toBe(false);
        });

        it('should validate required question fields', () => {
            const validateQuestionFields = (question) => {
                const required = [
                    'domain', 'topic', 'question_text', 
                    'option_a', 'option_b', 'option_c', 'option_d', 
                    'correct_answer'
                ];
                
                const missing = required.filter(field => !question[field]);
                return {
                    isValid: missing.length === 0,
                    missing
                };
            };

            const validQuestion = {
                domain: 'Test',
                topic: 'Test',
                question_text: 'Test?',
                option_a: 'A',
                option_b: 'B',
                option_c: 'C',
                option_d: 'D',
                correct_answer: 'A'
            };

            const invalidQuestion = {
                domain: 'Test',
                // Missing other required fields
            };

            expect(validateQuestionFields(validQuestion).isValid).toBe(true);
            expect(validateQuestionFields(invalidQuestion).isValid).toBe(false);
            expect(validateQuestionFields(invalidQuestion).missing.length).toBeGreaterThan(0);
        });
    });

    describe('Data Sanitization', () => {
        it('should sanitize CSV data', () => {
            const escapeCSV = (value) => {
                if (value === null || value === undefined) return '';
                const str = String(value);
                if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                    return `"${str.replace(/"/g, '""')}"`;
                }
                return str;
            };

            expect(escapeCSV('simple text')).toBe('simple text');
            expect(escapeCSV('text, with comma')).toBe('"text, with comma"');
            expect(escapeCSV('text "with quotes"')).toBe('"text ""with quotes"""');
            expect(escapeCSV('text\nwith newline')).toBe('"text\nwith newline"');
            expect(escapeCSV(null)).toBe('');
            expect(escapeCSV(undefined)).toBe('');
            expect(escapeCSV(123)).toBe('123');
        });

        it('should sanitize user input', () => {
            const sanitizeInput = (input) => {
                if (typeof input !== 'string') return '';
                return input.trim().substring(0, 1000); // Limit length and trim
            };

            expect(sanitizeInput('  test  ')).toBe('test');
            expect(sanitizeInput('a'.repeat(1500))).toHaveLength(1000);
            expect(sanitizeInput(123)).toBe('');
            expect(sanitizeInput(null)).toBe('');
            expect(sanitizeInput(undefined)).toBe('');
        });
    });

    describe('Score Calculation', () => {
        it('should calculate percentage correctly', () => {
            const calculatePercentage = (correct, total) => {
                if (total === 0) return 0;
                return Math.round((correct / total) * 100);
            };

            expect(calculatePercentage(5, 10)).toBe(50);
            expect(calculatePercentage(10, 10)).toBe(100);
            expect(calculatePercentage(0, 10)).toBe(0);
            expect(calculatePercentage(1, 3)).toBe(33);
            expect(calculatePercentage(2, 3)).toBe(67);
            expect(calculatePercentage(0, 0)).toBe(0);
        });

        it('should calculate time-based scoring', () => {
            const calculateTimeBonus = (timeSpent, maxTime) => {
                if (timeSpent >= maxTime) return 0;
                const timeRatio = timeSpent / maxTime;
                return Math.max(0, Math.round((1 - timeRatio) * 10)); // 0-10 bonus points
            };

            expect(calculateTimeBonus(1500, 3000)).toBe(5); // 50% time used = 5 bonus
            expect(calculateTimeBonus(3000, 3000)).toBe(0); // 100% time used = 0 bonus
            expect(calculateTimeBonus(4000, 3000)).toBe(0); // Over time = 0 bonus
            expect(calculateTimeBonus(0, 3000)).toBe(10); // Instant = max bonus
        });
    });

    describe('Error Response Formatting', () => {
        it('should format error responses consistently', () => {
            const formatError = (message, statusCode = 500) => {
                return {
                    success: false,
                    error: message,
                    statusCode,
                    timestamp: new Date().toISOString()
                };
            };

            const error400 = formatError('Bad Request', 400);
            const error500 = formatError('Internal Server Error');

            expect(error400.success).toBe(false);
            expect(error400.statusCode).toBe(400);
            expect(error400.timestamp).toBeDefined();

            expect(error500.statusCode).toBe(500);
            expect(error500.error).toBe('Internal Server Error');
        });
    });

    describe('Data Transformation', () => {
        it('should transform question data for frontend', () => {
            const transformQuestionForTest = (question) => {
                const { correct_answer, explanation, ...publicQuestion } = question;
                return publicQuestion;
            };

            const dbQuestion = {
                id: 1,
                domain: 'Test',
                topic: 'Test',
                question_text: 'Test?',
                option_a: 'A',
                option_b: 'B',
                option_c: 'C',
                option_d: 'D',
                correct_answer: 'A',
                explanation: 'Test explanation'
            };

            const transformed = transformQuestionForTest(dbQuestion);
            
            expect(transformed).not.toHaveProperty('correct_answer');
            expect(transformed).not.toHaveProperty('explanation');
            expect(transformed).toHaveProperty('id');
            expect(transformed).toHaveProperty('question_text');
        });

        it('should format test results', () => {
            const formatTestResults = (answers, questions) => {
                return answers.map(answer => {
                    const question = questions.find(q => q.id === answer.questionId);
                    const isCorrect = question?.correct_answer === answer.selectedAnswer;
                    
                    return {
                        questionId: answer.questionId,
                        selectedAnswer: answer.selectedAnswer,
                        correctAnswer: question?.correct_answer,
                        isCorrect,
                        explanation: question?.explanation,
                        question_text: question?.question_text
                    };
                });
            };

            const answers = [
                { questionId: 1, selectedAnswer: 'A' },
                { questionId: 2, selectedAnswer: 'B' }
            ];

            const questions = [
                { 
                    id: 1, 
                    correct_answer: 'A', 
                    explanation: 'Explanation 1',
                    question_text: 'Question 1?' 
                },
                { 
                    id: 2, 
                    correct_answer: 'C', 
                    explanation: 'Explanation 2',
                    question_text: 'Question 2?' 
                }
            ];

            const results = formatTestResults(answers, questions);
            
            expect(results).toHaveLength(2);
            expect(results[0].isCorrect).toBe(true);
            expect(results[1].isCorrect).toBe(false);
            expect(results[0].explanation).toBe('Explanation 1');
        });
    });
});
