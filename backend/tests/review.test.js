const request = require('supertest');
const Database = require('../src/database/Database');
const createTestServer = require('./testServer');

describe('Topic Review API', () => {
    let testDb;
    let app;
    let testQuestions = [];

    beforeAll(async () => {
        // Use in-memory database for testing
        testDb = new Database(':memory:');
        await testDb.init();
        
        // Create test server with our test database
        app = createTestServer(testDb);
        
        // Seed with test questions for multiple topics
        const questionsData = [
            {
                domain: 'Java Basics',
                topic: 'Main Characteristics of Java',
                question_text: 'What is Java?',
                option_a: 'A programming language',
                option_b: 'A coffee brand',
                option_c: 'An island',
                option_d: 'A framework',
                correct_answer: 'A',
                explanation: 'Java is a programming language'
            },
            {
                domain: 'Java Basics',
                topic: 'Main Characteristics of Java',
                question_text: 'Is Java platform independent?',
                option_a: 'Yes',
                option_b: 'No',
                option_c: 'Sometimes',
                option_d: 'Depends',
                correct_answer: 'A',
                explanation: 'Java is platform independent'
            },
            {
                domain: 'Data Types',
                topic: 'Variable',
                question_text: 'What is a variable?',
                option_a: 'A constant',
                option_b: 'A container for values',
                option_c: 'A method',
                option_d: 'A class',
                correct_answer: 'B',
                explanation: 'Variables store values'
            },
            {
                domain: 'Control Flow',
                topic: 'Flow Control',
                question_text: 'What is if-else?',
                option_a: 'A loop',
                option_b: 'A conditional statement',
                option_c: 'A variable',
                option_d: 'A method',
                correct_answer: 'B',
                explanation: 'If-else is for conditional execution'
            }
        ];

        for (const questionData of questionsData) {
            const questionId = await testDb.createQuestion(questionData);
            testQuestions.push({ id: questionId, ...questionData });
        }
    }, 15000);

    afterAll(async () => {
        if (testDb) {
            testDb.close();
        }
    });

    describe('GET /api/topics', () => {
        it('should return all available topics from tutorial', async () => {
            const response = await request(app)
                .get('/api/topics')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.topics).toBeInstanceOf(Array);
            expect(response.body.topics.length).toBeGreaterThan(0);
            expect(response.body.topics[0]).toHaveProperty('id');
            expect(response.body.topics[0]).toHaveProperty('title');
            expect(response.body.topics[0]).toHaveProperty('description');
            expect(response.body.topics[0]).toHaveProperty('questionCount');
        });

        it('should include question count for each topic', async () => {
            const response = await request(app)
                .get('/api/topics')
                .expect(200);

            const topicWithQuestions = response.body.topics.find(t => t.questionCount > 0);
            expect(topicWithQuestions).toBeDefined();
            expect(topicWithQuestions.questionCount).toBeGreaterThan(0);
        });
    });

    describe('GET /api/topics/:topicId', () => {
        it('should return topic details with question count', async () => {
            const response = await request(app)
                .get('/api/topics/01-main-characteristics-of-java')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.topic).toHaveProperty('id', '01-main-characteristics-of-java');
            expect(response.body.topic).toHaveProperty('title');
            expect(response.body.topic).toHaveProperty('description');
            expect(response.body.topic).toHaveProperty('questionCount');
        });

        it('should return 404 for non-existent topic', async () => {
            const response = await request(app)
                .get('/api/topics/non-existent-topic')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toContain('Topic not found');
        });
    });

    describe('POST /api/review/start', () => {
        it('should start a new review session for a topic', async () => {
            const response = await request(app)
                .post('/api/review/start')
                .send({
                    userId: 'test-user',
                    topic: '01-main-characteristics-of-java'
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.sessionId).toBeDefined();
            expect(response.body.questions).toBeInstanceOf(Array);
            expect(response.body.questions.length).toBeGreaterThan(0);
            expect(response.body.roundInfo).toEqual({
                currentRound: 1,
                totalQuestions: response.body.questions.length
            });

            // Verify questions don't include correct answers
            response.body.questions.forEach(question => {
                expect(question).not.toHaveProperty('correct_answer');
                expect(question).toHaveProperty('question_text');
                expect(question).toHaveProperty('option_a');
                expect(question).toHaveProperty('option_b');
            });
        });

        it('should return error for invalid topic', async () => {
            const response = await request(app)
                .post('/api/review/start')
                .send({
                    userId: 'test-user',
                    topic: 'invalid-topic'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toContain('Invalid topic');
        });

        it('should require userId and topic', async () => {
            const response = await request(app)
                .post('/api/review/start')
                .send({})
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toContain('userId and topic are required');
        });
    });

    describe('POST /api/review/submit-round', () => {
        let sessionId;

        beforeEach(async () => {
            // Start a session first
            const startResponse = await request(app)
                .post('/api/review/start')
                .send({
                    userId: 'test-user',
                    topic: '01-main-characteristics-of-java'
                });
            sessionId = startResponse.body.sessionId;
        });

        it('should submit answers and return results with explanations', async () => {
            const answers = [
                { questionId: testQuestions[0].id, selectedAnswer: 'A' },
                { questionId: testQuestions[1].id, selectedAnswer: 'B' } // Wrong answer
            ];

            const response = await request(app)
                .post('/api/review/submit-round')
                .send({
                    sessionId,
                    answers
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.results).toBeInstanceOf(Array);
            expect(response.body.results).toHaveLength(answers.length);
            
            response.body.results.forEach(result => {
                expect(result).toHaveProperty('questionId');
                expect(result).toHaveProperty('selectedAnswer');
                expect(result).toHaveProperty('correctAnswer');
                expect(result).toHaveProperty('isCorrect');
                expect(result).toHaveProperty('explanation');
            });

            expect(response.body.roundSummary).toHaveProperty('correctCount');
            expect(response.body.roundSummary).toHaveProperty('totalCount');
            expect(response.body.roundSummary).toHaveProperty('percentage');
            expect(response.body.roundSummary).toHaveProperty('isComplete');
        });

        it('should continue session when score is less than 100%', async () => {
            const answers = [
                { questionId: testQuestions[0].id, selectedAnswer: 'B' }, // Wrong
                { questionId: testQuestions[1].id, selectedAnswer: 'B' }  // Wrong
            ];

            const response = await request(app)
                .post('/api/review/submit-round')
                .send({
                    sessionId,
                    answers
                })
                .expect(200);

            expect(response.body.roundSummary.isComplete).toBe(false);
            expect(response.body.roundSummary.nextRoundQuestions).toBeInstanceOf(Array);
            expect(response.body.roundSummary.nextRoundQuestions.length).toBeGreaterThan(0);
        });

        it('should complete session when score is 100%', async () => {
            const answers = [
                { questionId: testQuestions[0].id, selectedAnswer: 'A' }, // Correct
                { questionId: testQuestions[1].id, selectedAnswer: 'A' }  // Correct
            ];

            const response = await request(app)
                .post('/api/review/submit-round')
                .send({
                    sessionId,
                    answers
                })
                .expect(200);

            expect(response.body.roundSummary.isComplete).toBe(true);
            expect(response.body.roundSummary.percentage).toBe(100);
        });

        it('should return error for invalid session', async () => {
            const response = await request(app)
                .post('/api/review/submit-round')
                .send({
                    sessionId: 99999,
                    answers: []
                })
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toContain('Session not found');
        });
    });

    describe('GET /api/review/next-round/:sessionId', () => {
        let sessionId;
        let incorrectQuestionIds;

        beforeEach(async () => {
            // Start session and submit with some wrong answers
            const startResponse = await request(app)
                .post('/api/review/start')
                .send({
                    userId: 'test-user',
                    topic: '01-main-characteristics-of-java'
                });
            sessionId = startResponse.body.sessionId;

            const answers = [
                { questionId: testQuestions[0].id, selectedAnswer: 'B' }, // Wrong
                { questionId: testQuestions[1].id, selectedAnswer: 'A' }  // Correct
            ];

            const submitResponse = await request(app)
                .post('/api/review/submit-round')
                .send({ sessionId, answers });
            
            incorrectQuestionIds = submitResponse.body.roundSummary.nextRoundQuestions;
        });

        it('should return only incorrect questions for next round', async () => {
            const response = await request(app)
                .get(`/api/review/next-round/${sessionId}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.questions).toBeInstanceOf(Array);
            expect(response.body.questions.length).toBe(incorrectQuestionIds.length);
            expect(response.body.roundInfo.currentRound).toBe(2);
            expect(response.body.roundInfo.totalQuestions).toBe(incorrectQuestionIds.length);

            // Verify only incorrect questions are returned
            response.body.questions.forEach(question => {
                expect(incorrectQuestionIds).toContain(question.id);
            });
        });

        it('should return error for completed session', async () => {
            // Complete the session first by getting all answers correct
            const answers = incorrectQuestionIds.map(id => ({
                questionId: id,
                selectedAnswer: 'A'
            }));

            await request(app)
                .post('/api/review/submit-round')
                .send({ sessionId, answers });

            const response = await request(app)
                .get(`/api/review/next-round/${sessionId}`)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toContain('Session already completed');
        });
    });

    describe('POST /api/review/complete/:sessionId', () => {
        let sessionId;

        beforeEach(async () => {
            // Start session and complete it with 100% score
            const startResponse = await request(app)
                .post('/api/review/start')
                .send({
                    userId: 'test-user',
                    topic: '01-main-characteristics-of-java'
                });
            sessionId = startResponse.body.sessionId;

            const answers = [
                { questionId: testQuestions[0].id, selectedAnswer: 'A' },
                { questionId: testQuestions[1].id, selectedAnswer: 'A' }
            ];

            await request(app)
                .post('/api/review/submit-round')
                .send({ sessionId, answers });
        });

        it('should complete session and return summary', async () => {
            const response = await request(app)
                .post(`/api/review/complete/${sessionId}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.sessionSummary).toHaveProperty('topic');
            expect(response.body.sessionSummary).toHaveProperty('totalRounds');
            expect(response.body.sessionSummary).toHaveProperty('finalScore');
            expect(response.body.sessionSummary).toHaveProperty('timeSpent');
            expect(response.body.sessionSummary).toHaveProperty('masteryAchieved');
            expect(response.body.sessionSummary.finalScore).toBe(100);
            expect(response.body.sessionSummary.masteryAchieved).toBe(true);
        });

        it('should update topic mastery', async () => {
            await request(app)
                .post(`/api/review/complete/${sessionId}`)
                .expect(200);

            // Check that mastery was updated by calling mastery endpoint
            const masteryResponse = await request(app)
                .get('/api/review/mastery/test-user')
                .expect(200);

            const topic = masteryResponse.body.mastery.find(
                m => m.topic === '01-main-characteristics-of-java'
            );
            expect(topic).toBeDefined();
            expect(topic.totalSessions).toBeGreaterThan(0);
        });
    });

    describe('GET /api/review/mastery/:userId', () => {
        beforeEach(async () => {
            // Complete a session to generate mastery data
            const startResponse = await request(app)
                .post('/api/review/start')
                .send({
                    userId: 'mastery-test-user',
                    topic: '01-main-characteristics-of-java'
                });

            const answers = [
                { questionId: testQuestions[0].id, selectedAnswer: 'A' },
                { questionId: testQuestions[1].id, selectedAnswer: 'A' }
            ];

            await request(app)
                .post('/api/review/submit-round')
                .send({
                    sessionId: startResponse.body.sessionId,
                    answers
                });

            await request(app)
                .post(`/api/review/complete/${startResponse.body.sessionId}`);
        });

        it('should return user mastery overview', async () => {
            const response = await request(app)
                .get('/api/review/mastery/mastery-test-user')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.mastery).toBeInstanceOf(Array);
            expect(response.body.overallStats).toHaveProperty('topicsMastered');
            expect(response.body.overallStats).toHaveProperty('topicsInProgress');
            expect(response.body.overallStats).toHaveProperty('topicsNotStarted');
            expect(response.body.overallStats).toHaveProperty('totalTimeSpent');

            // Check mastery data structure
            if (response.body.mastery.length > 0) {
                const masteredTopic = response.body.mastery[0];
                expect(masteredTopic).toHaveProperty('topic');
                expect(masteredTopic).toHaveProperty('title');
                expect(masteredTopic).toHaveProperty('masteryLevel');
                expect(masteredTopic).toHaveProperty('totalSessions');
                expect(masteredTopic).toHaveProperty('averageRounds');
                expect(masteredTopic).toHaveProperty('lastPracticed');
            }
        });

        it('should return empty mastery for new user', async () => {
            const response = await request(app)
                .get('/api/review/mastery/new-user')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.mastery).toEqual([]);
            expect(response.body.overallStats.topicsMastered).toBe(0);
            expect(response.body.overallStats.topicsInProgress).toBe(0);
            expect(response.body.overallStats.topicsNotStarted).toBe(59); // Total tutorial topics
        });
    });

    describe('GET /api/review/history/:userId/:topic', () => {
        beforeEach(async () => {
            // Complete multiple sessions for history
            for (let i = 0; i < 2; i++) {
                const startResponse = await request(app)
                    .post('/api/review/start')
                    .send({
                        userId: 'history-test-user',
                        topic: '01-main-characteristics-of-java'
                    });

                const answers = [
                    { questionId: testQuestions[0].id, selectedAnswer: 'A' },
                    { questionId: testQuestions[1].id, selectedAnswer: 'A' }
                ];

                await request(app)
                    .post('/api/review/submit-round')
                    .send({
                        sessionId: startResponse.body.sessionId,
                        answers
                    });

                await request(app)
                    .post(`/api/review/complete/${startResponse.body.sessionId}`);
            }
        });

        it('should return session history for user and topic', async () => {
            const response = await request(app)
                .get('/api/review/history/history-test-user/01-main-characteristics-of-java')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.history).toBeInstanceOf(Array);
            expect(response.body.history.length).toBeGreaterThan(0);

            response.body.history.forEach(session => {
                expect(session).toHaveProperty('sessionId');
                expect(session).toHaveProperty('startedAt');
                expect(session).toHaveProperty('completedAt');
                expect(session).toHaveProperty('rounds');
                expect(session).toHaveProperty('finalScore');
                expect(session).toHaveProperty('timeSpent');
            });
        });

        it('should return empty history for user with no sessions', async () => {
            const response = await request(app)
                .get('/api/review/history/no-sessions-user/01-main-characteristics-of-java')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.history).toEqual([]);
        });
    });
});
