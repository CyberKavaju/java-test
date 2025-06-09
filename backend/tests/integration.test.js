const request = require('supertest');
const Database = require('../src/database/Database');
const createTestServer = require('./testServer');

describe('Integration Tests - Complete User Workflows', () => {
    let testDb;
    let app;
    let userId = 'integration_test_user';

    beforeAll(async () => {
        // Use in-memory database for testing
        testDb = new Database(':memory:');
        await testDb.init();
        
        // Create test server with our test database
        app = createTestServer(testDb);
        
        // Seed with test questions
        const testQuestions = [
            {
                domain: 'Java Basics',
                topic: 'Variables',
                question_text: 'Which of the following is a valid variable name in Java?',
                option_a: '123variable',
                option_b: 'variable123',
                option_c: 'variable-name',
                option_d: 'class',
                correct_answer: 'B',
                explanation: 'Variable names must start with a letter, underscore, or dollar sign.'
            },
            {
                domain: 'Java Basics',
                topic: 'Data Types',
                question_text: 'What is the default value of a boolean variable in Java?',
                option_a: 'true',
                option_b: 'false',
                option_c: 'null',
                option_d: '0',
                correct_answer: 'B',
                explanation: 'The default value of a boolean variable is false.'
            },
            {
                domain: 'OOP',
                topic: 'Classes',
                question_text: 'Which keyword is used to create a class in Java?',
                option_a: 'class',
                option_b: 'Class',
                option_c: 'new',
                option_d: 'create',
                correct_answer: 'A',
                explanation: 'The "class" keyword is used to define a class in Java.'
            }
        ];
        
        for (const question of testQuestions) {
            await testDb.createQuestion(question);
        }
    }, 15000);

    afterAll(async () => {
        if (testDb) {
            testDb.close();
        }
    });

    describe('Complete Test Taking Workflow', () => {
        let testQuestions;
        let testAnswers;

        it('should complete a full test workflow from start to finish', async () => {
            // Step 1: Check server health
            const healthResponse = await request(app)
                .get('/api/health')
                .expect(200);
            
            expect(healthResponse.body.success).toBe(true);

            // Step 2: Get question count
            const countResponse = await request(app)
                .get('/api/questions/count')
                .expect(200);
            
            expect(countResponse.body.count).toBeGreaterThan(0);

            // Step 3: Start a new test (get random questions)
            const questionsResponse = await request(app)
                .get(`/api/questions/random?userId=${userId}&limit=3`)
                .expect(200);
            
            testQuestions = questionsResponse.body.questions;
            expect(testQuestions).toHaveLength(3);
            expect(testQuestions[0]).not.toHaveProperty('correct_answer');

            // Step 4: Answer all questions
            testAnswers = testQuestions.map(q => ({
                questionId: q.id,
                selectedAnswer: 'A' // Always choose A for testing
            }));

            // Step 5: Submit answers
            const submitResponse = await request(app)
                .post('/api/submit-answers')
                .send({
                    userId,
                    answers: testAnswers,
                    timeSpent: 1800 // 30 minutes
                })
                .expect(200);

            expect(submitResponse.body.success).toBe(true);
            expect(submitResponse.body.results).toHaveLength(3);
            expect(submitResponse.body.total).toBe(3);
            expect(submitResponse.body.percentage).toBeDefined();

            // Step 6: Get user history
            const historyResponse = await request(app)
                .get(`/api/user-history?userId=${userId}`)
                .expect(200);

            expect(historyResponse.body.success).toBe(true);
            expect(historyResponse.body.userStats.totalAttempts).toBeGreaterThan(0);
            expect(historyResponse.body.testSessions.length).toBeGreaterThan(0);

            // Step 7: Get performance report
            const reportResponse = await request(app)
                .get(`/api/report?userId=${userId}`)
                .expect(200);

            expect(reportResponse.body.success).toBe(true);
            expect(Array.isArray(reportResponse.body.questionPerformance)).toBe(true);
            expect(Array.isArray(reportResponse.body.performanceTrend)).toBe(true);
        });

        it('should handle multiple test sessions for the same user', async () => {
            // Take another test
            const questionsResponse = await request(app)
                .get(`/api/questions/random?userId=${userId}&limit=2`)
                .expect(200);

            const questions = questionsResponse.body.questions;
            const answers = questions.map(q => ({
                questionId: q.id,
                selectedAnswer: 'B' // Different answers this time
            }));

            await request(app)
                .post('/api/submit-answers')
                .send({
                    userId,
                    answers,
                    timeSpent: 900 // 15 minutes
                })
                .expect(200);

            // Check updated history
            const historyResponse = await request(app)
                .get(`/api/user-history?userId=${userId}`)
                .expect(200);

            expect(historyResponse.body.testSessions.length).toBe(2);
            expect(historyResponse.body.userStats.totalTests).toBe(2);
        });
    });

    describe('Question Management Workflow', () => {
        let createdQuestionId;

        it('should complete question CRUD operations', async () => {
            // Step 1: Get filter options
            const filtersResponse = await request(app)
                .get('/api/questions/meta/filters')
                .expect(200);

            expect(filtersResponse.body.domains).toBeDefined();
            expect(filtersResponse.body.topics).toBeDefined();

            // Step 2: Create a new question
            const newQuestion = {
                domain: 'Integration Test',
                topic: 'CRUD Operations',
                question_text: 'What is the result of this integration test?',
                option_a: 'Success',
                option_b: 'Failure',
                option_c: 'Error',
                option_d: 'Unknown',
                correct_answer: 'A',
                explanation: 'This test should succeed if all operations work correctly.'
            };

            const createResponse = await request(app)
                .post('/api/questions')
                .send(newQuestion)
                .expect(201);

            createdQuestionId = createResponse.body.questionId;
            expect(createdQuestionId).toBeDefined();

            // Step 3: Read the created question
            const getResponse = await request(app)
                .get(`/api/questions/${createdQuestionId}`)
                .expect(200);

            expect(getResponse.body.question.question_text).toBe(newQuestion.question_text);

            // Step 4: Update the question
            const updatedQuestion = {
                ...newQuestion,
                question_text: 'What is the updated result of this integration test?',
                explanation: 'This question was updated during the integration test.'
            };

            await request(app)
                .put(`/api/questions/${createdQuestionId}`)
                .send(updatedQuestion)
                .expect(200);

            // Verify update
            const updatedGetResponse = await request(app)
                .get(`/api/questions/${createdQuestionId}`)
                .expect(200);

            expect(updatedGetResponse.body.question.question_text).toBe(updatedQuestion.question_text);

            // Step 5: List questions with filtering
            const listResponse = await request(app)
                .get('/api/questions?domain=Integration Test')
                .expect(200);

            expect(listResponse.body.questions.length).toBeGreaterThan(0);
            expect(listResponse.body.questions[0].domain).toBe('Integration Test');
        });

        it('should export and import questions', async () => {
            // Export questions
            const exportResponse = await request(app)
                .get('/api/questions/export/csv?domain=Integration Test')
                .expect(200);

            expect(exportResponse.headers['content-type']).toContain('text/csv');
            expect(exportResponse.text).toContain('Integration Test');

            // Preview import
            const csvContent = `Domain,Topic,Question,A,B,C,D,E,Correct Answer,Explanation
Import Test,Import Topic,Sample import question?,Option A,Option B,Option C,Option D,,A,Sample explanation`;

            const previewResponse = await request(app)
                .post('/api/import/preview')
                .attach('file', Buffer.from(csvContent), 'test.csv')
                .expect(200);

            expect(previewResponse.body.preview).toHaveLength(1);

            // Import questions
            const importResponse = await request(app)
                .post('/api/import/questions')
                .attach('file', Buffer.from(csvContent), 'test.csv')
                .expect(200);

            expect(importResponse.body.imported).toBe(1);
        });

        afterAll(async () => {
            // Clean up - delete the created question
            if (createdQuestionId) {
                await request(app)
                    .delete(`/api/questions/${createdQuestionId}`)
                    .expect(200);
            }
        });
    });

    describe('Error Handling and Edge Cases', () => {
        it('should handle non-existent resources gracefully', async () => {
            // Non-existent question
            await request(app)
                .get('/api/questions/99999')
                .expect(404);

            // Non-existent user history
            const historyResponse = await request(app)
                .get('/api/user-history?userId=non_existent_user')
                .expect(200);

            expect(historyResponse.body.userStats.totalAttempts).toBe(0);
        });

        it('should validate input data properly', async () => {
            // Invalid question data
            await request(app)
                .post('/api/questions')
                .send({
                    domain: 'Test'
                    // Missing required fields
                })
                .expect(400);

            // Invalid answer submission
            await request(app)
                .post('/api/submit-answers')
                .send({
                    userId: 'test',
                    answers: 'not an array'
                })
                .expect(400);
        });

        it('should handle large datasets efficiently', async () => {
            // Request many questions
            const response = await request(app)
                .get('/api/questions/random?limit=100')
                .expect(200);

            expect(response.body.questions.length).toBeLessThanOrEqual(100);
        });
    });

    describe('Performance and Load Testing', () => {
        it('should handle concurrent requests', async () => {
            const promises = [];
            
            // Simulate 10 concurrent users taking tests
            for (let i = 0; i < 10; i++) {
                const promise = request(app)
                    .get(`/api/questions/random?userId=concurrent_user_${i}&limit=5`)
                    .expect(200);
                promises.push(promise);
            }

            const responses = await Promise.all(promises);
            
            responses.forEach(response => {
                expect(response.body.success).toBe(true);
                expect(response.body.questions).toHaveLength(5);
            });
        });

        it('should maintain data consistency under load', async () => {
            const userId = 'consistency_test_user';
            
            // Submit multiple answers simultaneously
            const questionsResponse = await request(app)
                .get(`/api/questions/random?userId=${userId}&limit=3`)
                .expect(200);

            const questions = questionsResponse.body.questions;
            const promises = questions.map((question, index) => 
                request(app)
                    .post('/api/submit-answers')
                    .send({
                        userId,
                        answers: [{
                            questionId: question.id,
                            selectedAnswer: 'A'
                        }],
                        timeSpent: 60
                    })
                    .expect(200)
            );

            const responses = await Promise.all(promises);
            
            responses.forEach(response => {
                expect(response.body.success).toBe(true);
            });

            // Verify all attempts were recorded
            const historyResponse = await request(app)
                .get(`/api/user-history?userId=${userId}`)
                .expect(200);

            expect(historyResponse.body.userStats.totalAttempts).toBe(3);
        });
    });
});
