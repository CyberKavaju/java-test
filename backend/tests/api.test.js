const request = require('supertest');
const Database = require('../src/database/Database');
const createTestServer = require('./testServer');
const fs = require('fs');
const path = require('path');

describe('Java Test API', () => {
    let testDb;
    let testQuestionId;
    let app;

    beforeAll(async () => {
        // Use in-memory database for testing
        testDb = new Database(':memory:');
        await testDb.init();
        
        // Create test server with our test database
        app = createTestServer(testDb);
        
        // Seed with a test question
        const testQuestion = {
            domain: 'Test Domain',
            topic: 'Test Topic',
            question_text: 'What is 2 + 2?',
            option_a: '3',
            option_b: '4',
            option_c: '5',
            option_d: '6',
            option_e: null,
            correct_answer: 'B',
            explanation: 'Basic arithmetic: 2 + 2 = 4'
        };
        
        testQuestionId = await testDb.createQuestion(testQuestion);
    }, 15000);

    afterAll(async () => {
        if (testDb) {
            testDb.close();
        }
    });

    describe('GET /api/health', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                message: 'Server is running'
            });
        });
    });

    describe('GET /api/questions/random', () => {
        it('should return random questions', async () => {
            const response = await request(app)
                .get('/api/questions/random')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.questions).toBeDefined();
            expect(Array.isArray(response.body.questions)).toBe(true);
            expect(response.body.total).toBeGreaterThan(0);
        });

        it('should respect limit parameter', async () => {
            const response = await request(app)
                .get('/api/questions/random?limit=1')
                .expect(200);

            expect(response.body.questions).toHaveLength(1);
            expect(response.body.total).toBe(1);
        });

        it('should not include correct answers in response', async () => {
            const response = await request(app)
                .get('/api/questions/random?limit=1')
                .expect(200);

            const question = response.body.questions[0];
            expect(question.correct_answer).toBeUndefined();
            expect(question.explanation).toBeUndefined();
        });

        it('should include required question fields', async () => {
            const response = await request(app)
                .get('/api/questions/random?limit=1')
                .expect(200);

            const question = response.body.questions[0];
            expect(question).toHaveProperty('id');
            expect(question).toHaveProperty('domain');
            expect(question).toHaveProperty('topic');
            expect(question).toHaveProperty('question_text');
            expect(question).toHaveProperty('option_a');
            expect(question).toHaveProperty('option_b');
            expect(question).toHaveProperty('option_c');
            expect(question).toHaveProperty('option_d');
        });
    });

    describe('GET /api/questions/count', () => {
        it('should return total question count', async () => {
            const response = await request(app)
                .get('/api/questions/count')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBeDefined();
            expect(typeof response.body.count).toBe('number');
            expect(response.body.count).toBeGreaterThan(0);
        });
    });

    describe('POST /api/submit-answers', () => {
        it('should process submitted answers correctly', async () => {
            // First get a question
            const questionsResponse = await request(app)
                .get('/api/questions/random?limit=1');
            
            const questionId = questionsResponse.body.questions[0].id;
            
            const response = await request(app)
                .post('/api/submit-answers')
                .send({
                    userId: 'test_user',
                    answers: [
                        {
                            questionId: questionId,
                            selectedAnswer: 'A'
                        }
                    ],
                    timeSpent: 300
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.results).toBeDefined();
            expect(Array.isArray(response.body.results)).toBe(true);
            expect(response.body.score).toBeDefined();
            expect(response.body.total).toBe(1);
            expect(response.body.percentage).toBeDefined();
            
            // Check result structure
            const result = response.body.results[0];
            expect(result).toHaveProperty('questionId');
            expect(result).toHaveProperty('selectedAnswer');
            expect(result).toHaveProperty('correctAnswer');
            expect(result).toHaveProperty('isCorrect');
            expect(result).toHaveProperty('explanation');
        });

        it('should return 400 for invalid answers format', async () => {
            const response = await request(app)
                .post('/api/submit-answers')
                .send({
                    userId: 'test_user',
                    answers: 'invalid'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Invalid answers format');
        });

        it('should return 400 for missing answers', async () => {
            const response = await request(app)
                .post('/api/submit-answers')
                .send({
                    userId: 'test_user'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Invalid answers format');
        });

        it('should calculate percentage correctly', async () => {
            const questionsResponse = await request(app)
                .get('/api/questions/random?limit=1');
            
            const questionId = questionsResponse.body.questions[0].id;
            
            const response = await request(app)
                .post('/api/submit-answers')
                .send({
                    userId: 'test_user_calc',
                    answers: [
                        {
                            questionId: questionId,
                            selectedAnswer: 'B' // Correct answer
                        }
                    ],
                    timeSpent: 300
                })
                .expect(200);

            expect(response.body.percentage).toBe(100);
            expect(response.body.score).toBe(1);
            expect(response.body.total).toBe(1);
        });
    });

    describe('GET /api/user-history', () => {
        beforeAll(async () => {
            // Create some test data first
            const questionsResponse = await request(app)
                .get('/api/questions/random?limit=1');
            
            const questionId = questionsResponse.body.questions[0].id;
            
            await request(app)
                .post('/api/submit-answers')
                .send({
                    userId: 'history_test_user',
                    answers: [
                        {
                            questionId: questionId,
                            selectedAnswer: 'A'
                        }
                    ],
                    timeSpent: 300
                });
        });

        it('should return user history and statistics', async () => {
            const response = await request(app)
                .get('/api/user-history?userId=history_test_user')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.userStats).toBeDefined();
            expect(response.body.testSessions).toBeDefined();
            expect(response.body.topicStats).toBeDefined();
            
            expect(Array.isArray(response.body.testSessions)).toBe(true);
            expect(Array.isArray(response.body.topicStats)).toBe(true);
        });

        it('should handle non-existent user', async () => {
            const response = await request(app)
                .get('/api/user-history?userId=non_existent_user')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.userStats.totalAttempts).toBe(0);
        });
    });

    describe('GET /api/report', () => {
        it('should return performance report data', async () => {
            const response = await request(app)
                .get('/api/report?userId=history_test_user')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.questionPerformance).toBeDefined();
            expect(response.body.performanceTrend).toBeDefined();
            
            expect(Array.isArray(response.body.questionPerformance)).toBe(true);
            expect(Array.isArray(response.body.performanceTrend)).toBe(true);
        });
    });

    describe('GET /api/question-details', () => {
        it('should return detailed question performance', async () => {
            const response = await request(app)
                .get('/api/question-details?userId=history_test_user')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.questionDetails).toBeDefined();
            expect(Array.isArray(response.body.questionDetails)).toBe(true);
        });
    });

    describe('GET /api/questions', () => {
        it('should return paginated questions', async () => {
            const response = await request(app)
                .get('/api/questions')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.questions).toBeDefined();
            expect(response.body.pagination).toBeDefined();
            expect(Array.isArray(response.body.questions)).toBe(true);
            
            expect(response.body.pagination).toHaveProperty('currentPage');
            expect(response.body.pagination).toHaveProperty('totalPages');
            expect(response.body.pagination).toHaveProperty('totalItems');
            expect(response.body.pagination).toHaveProperty('itemsPerPage');
        });

        it('should support filtering by domain', async () => {
            const response = await request(app)
                .get('/api/questions?domain=Test Domain')
                .expect(200);

            expect(response.body.success).toBe(true);
            // All returned questions should have the specified domain
            response.body.questions.forEach(question => {
                expect(question.domain).toBe('Test Domain');
            });
        });

        it('should support filtering by topic', async () => {
            const response = await request(app)
                .get('/api/questions?topic=Test Topic')
                .expect(200);

            expect(response.body.success).toBe(true);
            // All returned questions should have the specified topic
            response.body.questions.forEach(question => {
                expect(question.topic).toBe('Test Topic');
            });
        });

        it('should support search functionality', async () => {
            const response = await request(app)
                .get('/api/questions?search=2 + 2')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.questions.length).toBeGreaterThan(0);
        });

        it('should support pagination parameters', async () => {
            const response = await request(app)
                .get('/api/questions?page=1&limit=5')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.questions.length).toBeLessThanOrEqual(5);
            expect(response.body.pagination.currentPage).toBe(1);
            expect(response.body.pagination.itemsPerPage).toBe(5);
        });
    });

    describe('GET /api/questions/:id', () => {
        it('should return a single question by ID', async () => {
            const response = await request(app)
                .get(`/api/questions/${testQuestionId}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.question).toBeDefined();
            expect(response.body.question.id).toBe(testQuestionId);
            expect(response.body.question.question_text).toBe('What is 2 + 2?');
        });

        it('should return 404 for non-existent question', async () => {
            const response = await request(app)
                .get('/api/questions/99999')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Question not found');
        });

        it('should return 400 for invalid question ID', async () => {
            const response = await request(app)
                .get('/api/questions/invalid')
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Invalid question ID');
        });
    });

    describe('POST /api/questions', () => {
        it('should create a new question', async () => {
            const newQuestion = {
                domain: 'New Domain',
                topic: 'New Topic',
                question_text: 'What is 3 + 3?',
                option_a: '5',
                option_b: '6',
                option_c: '7',
                option_d: '8',
                option_e: null,
                correct_answer: 'B',
                explanation: 'Basic arithmetic: 3 + 3 = 6'
            };

            const response = await request(app)
                .post('/api/questions')
                .send(newQuestion)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.questionId).toBeDefined();
            expect(typeof response.body.questionId).toBe('number');
        });

        it('should return 400 for missing required fields', async () => {
            const incompleteQuestion = {
                domain: 'Test Domain',
                // Missing required fields
            };

            const response = await request(app)
                .post('/api/questions')
                .send(incompleteQuestion)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toContain('Missing required fields');
        });

        it('should return 400 for invalid correct answer', async () => {
            const invalidQuestion = {
                domain: 'Test Domain',
                topic: 'Test Topic',
                question_text: 'What is 4 + 4?',
                option_a: '7',
                option_b: '8',
                option_c: '9',
                option_d: '10',
                correct_answer: 'Z', // Invalid option
                explanation: 'Test explanation'
            };

            const response = await request(app)
                .post('/api/questions')
                .send(invalidQuestion)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Invalid correct answer. Must be A, B, C, D, or E');
        });
    });

    describe('PUT /api/questions/:id', () => {
        let questionToUpdate;

        beforeAll(async () => {
            // Create a question to update
            const newQuestion = {
                domain: 'Update Domain',
                topic: 'Update Topic',
                question_text: 'What is 5 + 5?',
                option_a: '9',
                option_b: '10',
                option_c: '11',
                option_d: '12',
                correct_answer: 'B',
                explanation: 'Basic arithmetic: 5 + 5 = 10'
            };

            const response = await request(app)
                .post('/api/questions')
                .send(newQuestion);

            questionToUpdate = response.body.questionId;
        });

        it('should update an existing question', async () => {
            const updatedQuestion = {
                domain: 'Updated Domain',
                topic: 'Updated Topic',
                question_text: 'What is 6 + 6?',
                option_a: '11',
                option_b: '12',
                option_c: '13',
                option_d: '14',
                correct_answer: 'B',
                explanation: 'Basic arithmetic: 6 + 6 = 12'
            };

            const response = await request(app)
                .put(`/api/questions/${questionToUpdate}`)
                .send(updatedQuestion)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Question updated successfully');

            // Verify the update
            const getResponse = await request(app)
                .get(`/api/questions/${questionToUpdate}`)
                .expect(200);

            expect(getResponse.body.question.question_text).toBe('What is 6 + 6?');
            expect(getResponse.body.question.domain).toBe('Updated Domain');
        });

        it('should return 404 for non-existent question', async () => {
            const updatedQuestion = {
                domain: 'Test Domain',
                topic: 'Test Topic',
                question_text: 'Updated question?',
                option_a: 'A',
                option_b: 'B',
                option_c: 'C',
                option_d: 'D',
                correct_answer: 'A',
                explanation: 'Test explanation'
            };

            const response = await request(app)
                .put('/api/questions/99999')
                .send(updatedQuestion)
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Question not found');
        });
    });

    describe('DELETE /api/questions/:id', () => {
        let questionToDelete;

        beforeAll(async () => {
            // Create a question to delete
            const newQuestion = {
                domain: 'Delete Domain',
                topic: 'Delete Topic',
                question_text: 'What is 7 + 7?',
                option_a: '13',
                option_b: '14',
                option_c: '15',
                option_d: '16',
                correct_answer: 'B',
                explanation: 'Basic arithmetic: 7 + 7 = 14'
            };

            const response = await request(app)
                .post('/api/questions')
                .send(newQuestion);

            questionToDelete = response.body.questionId;
        });

        it('should delete an existing question', async () => {
            const response = await request(app)
                .delete(`/api/questions/${questionToDelete}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Question deleted successfully');

            // Verify deletion
            await request(app)
                .get(`/api/questions/${questionToDelete}`)
                .expect(404);
        });

        it('should return 404 for non-existent question', async () => {
            const response = await request(app)
                .delete('/api/questions/99999')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Question not found');
        });
    });

    describe('GET /api/questions/meta/filters', () => {
        it('should return available filter options', async () => {
            const response = await request(app)
                .get('/api/questions/meta/filters')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.domains).toBeDefined();
            expect(response.body.topics).toBeDefined();
            expect(Array.isArray(response.body.domains)).toBe(true);
            expect(Array.isArray(response.body.topics)).toBe(true);
        });
    });

    describe('GET /api/questions/export/csv', () => {
        it('should export questions as CSV', async () => {
            const response = await request(app)
                .get('/api/questions/export/csv')
                .expect(200);

            expect(response.headers['content-type']).toContain('text/csv');
            expect(response.headers['content-disposition']).toContain('attachment');
            expect(response.text).toContain('Domain,Topic,Question'); // CSV header
        });

        it('should support filtering in CSV export', async () => {
            const response = await request(app)
                .get('/api/questions/export/csv?domain=Test Domain')
                .expect(200);

            expect(response.headers['content-type']).toContain('text/csv');
            expect(response.text).toContain('Test Domain');
        });
    });

    describe('POST /api/import/preview', () => {
        it('should preview CSV import', async () => {
            const csvContent = `Domain,Topic,Question,A,B,C,D,E,Correct Answer,Explanation
Test Domain,Test Topic,Sample Question?,Option A,Option B,Option C,Option D,,B,Sample explanation`;

            const response = await request(app)
                .post('/api/import/preview')
                .attach('file', Buffer.from(csvContent), 'test.csv')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.preview).toBeDefined();
            expect(Array.isArray(response.body.preview)).toBe(true);
            expect(response.body.totalRows).toBe(1);
        });

        it('should return 400 for missing file', async () => {
            const response = await request(app)
                .post('/api/import/preview')
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('No file uploaded');
        });
    });

    describe('POST /api/import/questions', () => {
        it('should import questions from CSV', async () => {
            const csvContent = `Domain,Topic,Question,A,B,C,D,E,Correct Answer,Explanation
Import Domain,Import Topic,What is 8 + 8?,15,16,17,18,,B,Basic arithmetic`;

            const response = await request(app)
                .post('/api/import/questions')
                .attach('file', Buffer.from(csvContent), 'import.csv')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.imported).toBe(1);
            expect(response.body.skipped).toBe(0);
        });

        it('should handle duplicate questions during import', async () => {
            const csvContent = `Domain,Topic,Question,A,B,C,D,E,Correct Answer,Explanation
Test Domain,Test Topic,What is 2 + 2?,3,4,5,6,,B,Basic arithmetic: 2 + 2 = 4`;

            const response = await request(app)
                .post('/api/import/questions')
                .attach('file', Buffer.from(csvContent), 'duplicate.csv')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.skipped).toBeGreaterThan(0);
        });
    });
});
