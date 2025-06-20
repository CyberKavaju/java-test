class ReviewReportService {
    constructor(database) {
        this.database = database;
    }

    async generateUserReport(userId) {
        // Check if user has any review sessions
        const sessionCount = await this._getSessionCount(userId);
        
        if (sessionCount === 0) {
            throw new Error('No review sessions found for this user');
        }

        // Get completed sessions for the user
        const sessions = await this._getCompletedSessions(userId);
        
        // Calculate performance metrics
        const topics = this._calculateTopicMetrics(sessions);
        
        // Calculate time analysis
        const timeAnalysis = this._calculateTimeAnalysis(sessions);
        
        // Generate recommendations
        const recommendations = this._generateRecommendations(topics);
        
        // Calculate difficulty breakdown
        const difficultyBreakdown = this._calculateDifficultyBreakdown(topics);

        return {
            userId,
            totalSessions: sessions.length,
            topics,
            recommendations,
            timeAnalysis,
            difficultyBreakdown
        };
    }

    async _getSessionCount(userId) {
        return new Promise((resolve, reject) => {
            this.database.db.get(
                'SELECT COUNT(*) as count FROM topic_review_sessions WHERE user_id = ?',
                [userId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row.count);
                }
            );
        });
    }

    async _getCompletedSessions(userId) {
        return new Promise((resolve, reject) => {
            this.database.db.all(`
                SELECT 
                    topic,
                    session_status,
                    current_round as roundsToComplete,
                    questions_correct_current_round,
                    questions_total_current_round,
                    started_at,
                    completed_at
                FROM topic_review_sessions 
                WHERE user_id = ? AND session_status = 'completed'
                ORDER BY completed_at DESC
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    _calculateTopicMetrics(sessions) {
        return sessions.map(session => {
            const finalAccuracy = session.questions_total_current_round > 0 
                ? Math.round((session.questions_correct_current_round / session.questions_total_current_round) * 100)
                : 0;
            
            const difficulty = this._categorizeDifficulty(session.roundsToComplete);

            return {
                topic: session.topic,
                roundsToComplete: session.roundsToComplete,
                finalAccuracy,
                difficulty,
                completedAt: session.completed_at
            };
        });
    }

    _categorizeDifficulty(rounds) {
        if (rounds === 1) {
            return 'mastered';
        } else if (rounds <= 2) {
            return 'good';
        } else if (rounds <= 3) {
            return 'needsWork';
        } else {
            return 'struggling';
        }
    }

    _calculateTimeAnalysis(sessions) {
        // Calculate actual session durations
        const sessionsWithDuration = sessions.filter(s => s.started_at && s.completed_at).map(session => {
            const startTime = new Date(session.started_at).getTime();
            const endTime = new Date(session.completed_at).getTime();
            return {
                ...session,
                duration: Math.round((endTime - startTime) / (1000 * 60)) // duration in minutes
            };
        });

        const averageSessionDuration = sessionsWithDuration.length > 0
            ? Math.round(sessionsWithDuration.reduce((sum, s) => sum + s.duration, 0) / sessionsWithDuration.length)
            : 0;

        const totalStudyTime = sessionsWithDuration.reduce((sum, s) => sum + s.duration, 0);

        // Count sessions in different time periods
        const now = Date.now();
        const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

        const sessionsLast7Days = sessions.filter(s => {
            const completedDate = new Date(s.completed_at).getTime();
            return completedDate > sevenDaysAgo;
        }).length;

        const sessionsLast30Days = sessions.filter(s => {
            const completedDate = new Date(s.completed_at).getTime();
            return completedDate > thirtyDaysAgo;
        }).length;

        return {
            averageSessionDuration,
            totalStudyTime,
            sessionsLast7Days,
            sessionsLast30Days
        };
    }

    _generateRecommendations(topics) {
        const recommendations = [];
        const strugglingTopics = topics.filter(t => t.difficulty === 'struggling');
        const needsWorkTopics = topics.filter(t => t.difficulty === 'needsWork');
        
        if (strugglingTopics.length > 0) {
            recommendations.push({
                type: 'focus_on_struggling',
                message: 'Focus on topics that required multiple rounds',
                topics: strugglingTopics.map(t => t.topic)
            });
        }

        if (needsWorkTopics.length > 0) {
            recommendations.push({
                type: 'review_needs_work',
                message: 'Consider reviewing these topics to strengthen understanding',
                topics: needsWorkTopics.map(t => t.topic)
            });
        }

        const masteredTopics = topics.filter(t => t.difficulty === 'mastered');
        if (masteredTopics.length > 0) {
            recommendations.push({
                type: 'maintain_mastery',
                message: 'Great job! Keep practicing these mastered topics occasionally',
                topics: masteredTopics.map(t => t.topic)
            });
        }

        return recommendations;
    }

    _calculateDifficultyBreakdown(topics) {
        return {
            mastered: topics.filter(t => t.difficulty === 'mastered').length,
            good: topics.filter(t => t.difficulty === 'good').length,
            needsWork: topics.filter(t => t.difficulty === 'needsWork').length,
            struggling: topics.filter(t => t.difficulty === 'struggling').length
        };
    }
}

module.exports = ReviewReportService;
