class MasteryCalculator {
    static calculateMasteryLevel(sessions) {
        if (!sessions || sessions.length === 0) {
            return 'beginner';
        }

        const recentSessions = sessions.slice(-5); // Last 5 sessions
        const averageRounds = recentSessions.reduce((sum, s) => sum + s.rounds, 0) / recentSessions.length;
        const averageScore = recentSessions.reduce((sum, s) => sum + s.finalScore, 0) / recentSessions.length;

        if (averageScore === 100 && averageRounds <= 1.2) return 'mastered';
        if (averageScore >= 90 && averageRounds <= 2) return 'advanced';
        if (averageScore >= 70 && averageRounds <= 3) return 'intermediate';
        return 'beginner';
    }

    static async getMasteryOverview(userId, database, topicQuestionMapper) {
        // Get all mastery records for user
        const masteryRecords = await this.getUserMasteryRecords(userId, database);
        
        // Get all available topics
        const allTopics = topicQuestionMapper.getAllTopics();
        
        // Build mastery overview
        const mastery = [];
        let topicsMastered = 0;
        let topicsInProgress = 0;
        let totalTimeSpent = 0;

        for (const topic of allTopics) {
            const masteryRecord = masteryRecords.find(m => m.topic === topic.id);
            
            if (masteryRecord) {
                const masteryLevel = this.determineMasteryLevel(masteryRecord);
                
                mastery.push({
                    topic: topic.id,
                    title: topic.title,
                    masteryLevel,
                    totalSessions: masteryRecord.total_sessions,
                    averageRounds: masteryRecord.average_rounds_to_mastery,
                    lastPracticed: masteryRecord.last_practiced
                });

                if (masteryLevel === 'mastered') {
                    topicsMastered++;
                } else {
                    topicsInProgress++;
                }

                // Estimate time spent (rough calculation)
                totalTimeSpent += masteryRecord.total_sessions * masteryRecord.average_rounds_to_mastery * 60; // 60 seconds per round estimate
            }
        }

        const topicsNotStarted = allTopics.length - mastery.length;

        return {
            mastery,
            overallStats: {
                topicsMastered,
                topicsInProgress,
                topicsNotStarted,
                totalTimeSpent: Math.floor(totalTimeSpent)
            }
        };
    }

    static async getUserMasteryRecords(userId, database) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM topic_mastery WHERE user_id = ? ORDER BY last_practiced DESC';
            database.db.all(query, [userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            });
        });
    }

    static determineMasteryLevel(masteryRecord) {
        const averageRounds = masteryRecord.average_rounds_to_mastery;
        const totalSessions = masteryRecord.total_sessions;

        // Simple mastery calculation based on performance consistency
        if (totalSessions >= 3 && averageRounds <= 1.5) return 'mastered';
        if (totalSessions >= 2 && averageRounds <= 2.5) return 'advanced';
        if (totalSessions >= 1 && averageRounds <= 4) return 'intermediate';
        return 'beginner';
    }

    static async getSessionHistory(userId, topicId, database) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    id as sessionId,
                    started_at as startedAt,
                    completed_at as completedAt,
                    current_round as rounds,
                    100 as finalScore,
                    CAST((JULIANDAY(completed_at) - JULIANDAY(started_at)) * 86400 AS INTEGER) as timeSpent
                FROM topic_review_sessions 
                WHERE user_id = ? AND topic = ? AND session_status = 'completed'
                ORDER BY completed_at DESC
            `;
            
            database.db.all(query, [userId, topicId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            });
        });
    }
}

module.exports = MasteryCalculator;
