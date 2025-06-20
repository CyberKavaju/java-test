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

    describe('GET /api/review/report/:userId', () => {
        let testUserId;
        let completedSessionId;
        
        beforeEach(async () => {
            testUserId = 'test-user-report';
            
            // Create test data for report - simulate multiple review sessions with different performance
            const sessionData = [
                {
                    user_id: testUserId,
                    topic: '01-main-characteristics-of-java',
                    session_status: 'completed',
                    current_round: 3,
                    total_rounds: 3,
                    questions_correct_current_round: 2,
                    questions_total_current_round: 2,
                    started_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
                    completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 30).toISOString() // 30min later
                },
                {
                    user_id: testUserId,
                    topic: '04-variable',
                    session_status: 'completed',
                    current_round: 1,
                    total_rounds: 1,
                    questions_correct_current_round: 3,
                    questions_total_current_round: 3,
                    started_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
                    completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 15).toISOString() // 15min later
                },
                {
                    user_id: testUserId,
                    topic: '12-if-else-statement',
                    session_status: 'completed',
                    current_round: 5,
                    total_rounds: 5,
                    questions_correct_current_round: 4,
                    questions_total_current_round: 4,
                    started_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
                    completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 45).toISOString() // 45min later
                }
            ];

            // Insert test sessions directly into database
            for (const session of sessionData) {
                await new Promise((resolve, reject) => {
                    testDb.db.run(`
                        INSERT INTO topic_review_sessions (
                            user_id, topic, session_status, current_round, total_rounds,
                            questions_correct_current_round, questions_total_current_round,
                            started_at, completed_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                        session.user_id, session.topic, session.session_status,
                        session.current_round, session.total_rounds,
                        session.questions_correct_current_round, session.questions_total_current_round,
                        session.started_at, session.completed_at
                    ], function(err) {
                        if (err) reject(err);
                        else resolve(this.lastID);
                    });
                });
            }
        });

        afterEach(async () => {
            // Clean up test data
            await new Promise((resolve) => {
                testDb.db.run('DELETE FROM topic_review_sessions WHERE user_id = ?', [testUserId], () => resolve());
            });
            await new Promise((resolve) => {
                testDb.db.run('DELETE FROM topic_review_attempts WHERE session_id IN (SELECT id FROM topic_review_sessions WHERE user_id = ?)', [testUserId], () => resolve());
            });
        });

        it('should return review report with topic performance analysis', async () => {
            const response = await request(app)
                .get(`/api/review/report/${testUserId}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.report).toBeDefined();
            expect(response.body.report.userId).toBe(testUserId);
            expect(response.body.report.totalSessions).toBe(3);
            expect(response.body.report.topics).toBeInstanceOf(Array);
            expect(response.body.report.topics.length).toBe(3);
        });

        it('should identify struggling topics based on round count', async () => {
            const response = await request(app)
                .get(`/api/review/report/${testUserId}`)
                .expect(200);

            const strugglingTopics = response.body.report.topics.filter(topic => topic.difficulty === 'struggling');
            const masteredTopics = response.body.report.topics.filter(topic => topic.difficulty === 'mastered');

            // Topic with 5 rounds should be marked as struggling
            expect(strugglingTopics.length).toBeGreaterThan(0);
            expect(strugglingTopics.some(topic => topic.topic === '12-if-else-statement')).toBe(true);
            
            // Topic with 1 round should be marked as mastered
            expect(masteredTopics.length).toBeGreaterThan(0);
            expect(masteredTopics.some(topic => topic.topic === '04-variable')).toBe(true);
        });

        it('should calculate correct performance metrics for each topic', async () => {
            const response = await request(app)
                .get(`/api/review/report/${testUserId}`)
                .expect(200);

            const topics = response.body.report.topics;
            
            // Find the struggling topic (if-else with 5 rounds)
            const strugglingTopic = topics.find(t => t.topic === '12-if-else-statement');
            expect(strugglingTopic).toBeDefined();
            expect(strugglingTopic.roundsToComplete).toBe(5);
            expect(strugglingTopic.finalAccuracy).toBe(100); // 4/4 questions correct in final round
            expect(strugglingTopic.difficulty).toBe('struggling');

            // Find the mastered topic (variable with 1 round)
            const masteredTopic = topics.find(t => t.topic === '04-variable');
            expect(masteredTopic).toBeDefined();
            expect(masteredTopic.roundsToComplete).toBe(1);
            expect(masteredTopic.finalAccuracy).toBe(100); // 3/3 questions correct
            expect(masteredTopic.difficulty).toBe('mastered');
        });

        it('should provide recommendations based on performance', async () => {
            const response = await request(app)
                .get(`/api/review/report/${testUserId}`)
                .expect(200);

            expect(response.body.report.recommendations).toBeInstanceOf(Array);
            expect(response.body.report.recommendations.length).toBeGreaterThan(0);
            
            // Should recommend focusing on struggling topics
            const strugglingRecommendation = response.body.report.recommendations.find(
                rec => rec.type === 'focus_on_struggling'
            );
            expect(strugglingRecommendation).toBeDefined();
            expect(strugglingRecommendation.topics).toContain('12-if-else-statement');
        });

        it('should return 404 for user with no review sessions', async () => {
            const response = await request(app)
                .get('/api/review/report/non-existent-user')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toContain('No review sessions found');
        });

        it('should handle invalid user ID parameter', async () => {
            const response = await request(app)
                .get('/api/review/report/')
                .expect(404); // Express will return 404 for missing route parameter
        });

        it('should include time-based analysis in report', async () => {
            const response = await request(app)
                .get(`/api/review/report/${testUserId}`)
                .expect(200);

            expect(response.body.report.timeAnalysis).toBeDefined();
            expect(response.body.report.timeAnalysis.averageSessionDuration).toBeGreaterThan(0);
            expect(response.body.report.timeAnalysis.totalStudyTime).toBeGreaterThan(0);
            expect(response.body.report.timeAnalysis.sessionsLast7Days).toBeDefined();
            expect(response.body.report.timeAnalysis.sessionsLast30Days).toBeDefined();
        });

        it('should categorize topics by difficulty level correctly', async () => {
            const response = await request(app)
                .get(`/api/review/report/${testUserId}`)
                .expect(200);

            const topics = response.body.report.topics;
            const difficultyCategories = response.body.report.difficultyBreakdown;

            expect(difficultyCategories).toBeDefined();
            expect(difficultyCategories.mastered).toBeDefined();
            expect(difficultyCategories.good).toBeDefined();
            expect(difficultyCategories.needsWork).toBeDefined();
            expect(difficultyCategories.struggling).toBeDefined();

            // Verify counts match actual categorization
            const masteredCount = topics.filter(t => t.difficulty === 'mastered').length;
            const strugglingCount = topics.filter(t => t.difficulty === 'struggling').length;
            
            expect(difficultyCategories.mastered).toBe(masteredCount);
            expect(difficultyCategories.struggling).toBe(strugglingCount);
        });
    });
});
