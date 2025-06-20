const Database = require('../src/database/Database');
const ReviewReportService = require('../src/review/ReviewReportService');

describe('ReviewReportService', () => {
    let testDb;
    let reportService;
    const testUserId = 'test-user-service';

    beforeAll(async () => {
        // Use in-memory database for testing
        testDb = new Database(':memory:');
        await testDb.init();
        reportService = new ReviewReportService(testDb);
    }, 15000);

    afterAll(async () => {
        if (testDb) {
            testDb.close();
        }
    });

    beforeEach(async () => {
        // Clean up before each test
        await new Promise((resolve) => {
            testDb.db.run('DELETE FROM topic_review_sessions WHERE user_id = ?', [testUserId], () => resolve());
        });
    });

    describe('generateUserReport', () => {
        it('should throw error when no sessions exist', async () => {
            await expect(reportService.generateUserReport('non-existent-user'))
                .rejects.toThrow('No review sessions found for this user');
        });

        it('should generate report with correct topic difficulty categorization', async () => {
            // Insert test sessions with different round counts
            const sessions = [
                { rounds: 1, topic: 'mastered-topic' },
                { rounds: 2, topic: 'good-topic' },
                { rounds: 3, topic: 'needs-work-topic' },
                { rounds: 5, topic: 'struggling-topic' }
            ];

            for (const session of sessions) {
                await new Promise((resolve) => {
                    testDb.db.run(`
                        INSERT INTO topic_review_sessions (
                            user_id, topic, session_status, current_round, total_rounds,
                            questions_correct_current_round, questions_total_current_round,
                            started_at, completed_at
                        ) VALUES (?, ?, 'completed', ?, ?, 3, 3, datetime('now', '-1 hour'), datetime('now'))
                    `, [testUserId, session.topic, session.rounds, session.rounds], () => resolve());
                });
            }

            const report = await reportService.generateUserReport(testUserId);

            expect(report.totalSessions).toBe(4);
            expect(report.difficultyBreakdown.mastered).toBe(1);
            expect(report.difficultyBreakdown.good).toBe(1);
            expect(report.difficultyBreakdown.needsWork).toBe(1);
            expect(report.difficultyBreakdown.struggling).toBe(1);
        });

        it('should calculate accurate time analysis', async () => {
            // Insert session with known duration
            const startTime = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago
            const endTime = new Date(); // now

            await new Promise((resolve) => {
                testDb.db.run(`
                    INSERT INTO topic_review_sessions (
                        user_id, topic, session_status, current_round, total_rounds,
                        questions_correct_current_round, questions_total_current_round,
                        started_at, completed_at
                    ) VALUES (?, 'test-topic', 'completed', 2, 2, 5, 5, ?, ?)
                `, [testUserId, startTime.toISOString(), endTime.toISOString()], () => resolve());
            });

            const report = await reportService.generateUserReport(testUserId);

            expect(report.timeAnalysis.averageSessionDuration).toBe(30);
            expect(report.timeAnalysis.totalStudyTime).toBe(30);
            expect(report.timeAnalysis.sessionsLast7Days).toBe(1);
            expect(report.timeAnalysis.sessionsLast30Days).toBe(1);
        });

        it('should generate appropriate recommendations', async () => {
            // Insert sessions with different difficulty levels
            const sessions = [
                { rounds: 1, topic: 'mastered-topic' },
                { rounds: 3, topic: 'needs-work-topic' },
                { rounds: 5, topic: 'struggling-topic' }
            ];

            for (const session of sessions) {
                await new Promise((resolve) => {
                    testDb.db.run(`
                        INSERT INTO topic_review_sessions (
                            user_id, topic, session_status, current_round, total_rounds,
                            questions_correct_current_round, questions_total_current_round,
                            started_at, completed_at
                        ) VALUES (?, ?, 'completed', ?, ?, 4, 4, datetime('now', '-2 hour'), datetime('now', '-1 hour'))
                    `, [testUserId, session.topic, session.rounds, session.rounds], () => resolve());
                });
            }

            const report = await reportService.generateUserReport(testUserId);

            const recommendationTypes = report.recommendations.map(r => r.type);
            expect(recommendationTypes).toContain('focus_on_struggling');
            expect(recommendationTypes).toContain('review_needs_work');
            expect(recommendationTypes).toContain('maintain_mastery');

            const strugglingRec = report.recommendations.find(r => r.type === 'focus_on_struggling');
            expect(strugglingRec.topics).toContain('struggling-topic');
        });

        it('should calculate final accuracy correctly', async () => {
            await new Promise((resolve) => {
                testDb.db.run(`
                    INSERT INTO topic_review_sessions (
                        user_id, topic, session_status, current_round, total_rounds,
                        questions_correct_current_round, questions_total_current_round,
                        started_at, completed_at
                    ) VALUES (?, 'accuracy-test', 'completed', 2, 2, 8, 10, datetime('now', '-1 hour'), datetime('now'))
                `, [testUserId], () => resolve());
            });

            const report = await reportService.generateUserReport(testUserId);
            const topic = report.topics.find(t => t.topic === 'accuracy-test');
            
            expect(topic.finalAccuracy).toBe(80); // 8/10 = 80%
        });
    });

    describe('_categorizeDifficulty', () => {
        it('should categorize rounds correctly', () => {
            expect(reportService._categorizeDifficulty(1)).toBe('mastered');
            expect(reportService._categorizeDifficulty(2)).toBe('good');
            expect(reportService._categorizeDifficulty(3)).toBe('needsWork');
            expect(reportService._categorizeDifficulty(4)).toBe('struggling');
            expect(reportService._categorizeDifficulty(5)).toBe('struggling');
        });
    });
});
