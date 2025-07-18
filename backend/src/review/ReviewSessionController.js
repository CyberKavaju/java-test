const ValidationService = require('../services/ValidationService');

class ReviewSessionController {
    constructor(database, topicQuestionMapper) {
        this.database = database;
        this.topicQuestionMapper = topicQuestionMapper;
    }

    async startSession(userId, topicId) {
        // Validate topic exists
        const topic = this.topicQuestionMapper.getTopicById(topicId);
        if (!topic) {
            throw new Error('Invalid topic');
        }

        // Get questions for the topic
        const questions = await this.topicQuestionMapper.getQuestionsForTopic(topicId, this.database);
        if (questions.length === 0) {
            throw new Error('No questions available for this topic');
        }

        // Create review session
        const sessionId = await this.createReviewSession(userId, topicId, questions.length);

        // Format questions for API response using ValidationService
        const formattedQuestions = ValidationService.formatQuestionsForAPI(questions);

        return {
            sessionId,
            questions: formattedQuestions,
            roundInfo: {
                currentRound: 1,
                totalQuestions: questions.length
            }
        };
    }

    async createReviewSession(userId, topicId, totalQuestions) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO topic_review_sessions 
                (user_id, topic, questions_total_current_round, started_at, last_activity)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `;
            
            this.database.db.run(query, [userId, topicId, totalQuestions], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    async submitRound(sessionId, answers) {
        const session = await this.getReviewSession(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        if (session.session_status === 'completed') {
            throw new Error('Session already completed');
        }

        // Get all questions for this topic to validate answers
        const allQuestions = await this.topicQuestionMapper.getQuestionsForTopic(session.topic, this.database);
        const questionMap = {};
        allQuestions.forEach(q => {
            questionMap[q.id] = q;
        });

        const results = [];
        let correctCount = 0;

        // Process each answer
        for (const answer of answers) {
            const question = questionMap[answer.questionId];
            if (!question) continue;

            // Use ValidationService for proper multi-selection validation
            const isCorrect = ValidationService.validateAnswer(
                answer.selectedAnswer,
                question.correct_answer,
                question.question_type || 'single'
            );
            
            if (isCorrect) correctCount++;

            // Record attempt - for multi-selection, store as JSON string if array
            const storedAnswer = Array.isArray(answer.selectedAnswer) 
                ? JSON.stringify(answer.selectedAnswer) 
                : answer.selectedAnswer;
            await this.recordReviewAttempt(sessionId, answer.questionId, session.current_round, storedAnswer, isCorrect);

            // Format correct answer for response
            const correctAnswerFormatted = question.question_type === 'multiple' 
                ? question.correct_answer.split(',')
                : question.correct_answer;

            results.push({
                questionId: answer.questionId,
                selectedAnswer: answer.selectedAnswer,
                correctAnswer: correctAnswerFormatted,
                isCorrect,
                explanation: question.explanation,
                question_type: question.question_type || 'single'
            });
        }

        // Update session with current round results
        await this.updateSessionRoundResults(sessionId, correctCount, answers.length);

        // Determine if session is complete (100% correct)
        const percentage = Math.round((correctCount / answers.length) * 100);
        const isComplete = percentage === 100;

        if (isComplete) {
            await this.markSessionComplete(sessionId);
            return {
                results,
                roundSummary: {
                    correctCount,
                    totalCount: answers.length,
                    percentage,
                    isComplete: true
                }
            };
        } else {
            // Get questions that were answered incorrectly for next round
            const incorrectQuestions = results
                .filter(r => !r.isCorrect)
                .map(r => r.questionId);

            await this.prepareNextRound(sessionId, incorrectQuestions);

            return {
                results,
                roundSummary: {
                    correctCount,
                    totalCount: answers.length,
                    percentage,
                    isComplete: false,
                    nextRoundQuestions: incorrectQuestions
                }
            };
        }
    }

    async getReviewSession(sessionId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM topic_review_sessions WHERE id = ?';
            this.database.db.get(query, [sessionId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async recordReviewAttempt(sessionId, questionId, roundNumber, selectedAnswer, isCorrect) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO topic_review_attempts 
                (session_id, question_id, round_number, selected_answer, is_correct)
                VALUES (?, ?, ?, ?, ?)
            `;
            
            this.database.db.run(query, [sessionId, questionId, roundNumber, selectedAnswer, isCorrect ? 1 : 0], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    async updateSessionRoundResults(sessionId, correctCount, totalCount) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE topic_review_sessions 
                SET questions_correct_current_round = ?, 
                    questions_total_current_round = ?,
                    last_activity = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            
            this.database.db.run(query, [correctCount, totalCount, sessionId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async prepareNextRound(sessionId, incorrectQuestionIds) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE topic_review_sessions 
                SET current_round = current_round + 1,
                    questions_total_current_round = ?,
                    questions_correct_current_round = 0,
                    last_activity = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            
            this.database.db.run(query, [incorrectQuestionIds.length, sessionId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async markSessionComplete(sessionId) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE topic_review_sessions 
                SET session_status = 'completed',
                    completed_at = CURRENT_TIMESTAMP,
                    last_activity = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            
            this.database.db.run(query, [sessionId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async getNextRoundQuestions(sessionId) {
        const session = await this.getReviewSession(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        if (session.session_status === 'completed') {
            throw new Error('Session already completed');
        }

        // Get questions that were answered incorrectly in the previous round
        const incorrectQuestionIds = await this.getIncorrectQuestions(sessionId, session.current_round - 1);
        
        if (incorrectQuestionIds.length === 0) {
            throw new Error('No questions available for next round');
        }

        // Get the full question data
        const questions = await this.getQuestionsByIds(incorrectQuestionIds);
        
        // Format questions for API response using ValidationService
        const formattedQuestions = ValidationService.formatQuestionsForAPI(questions);

        return {
            questions: formattedQuestions,
            roundInfo: {
                currentRound: session.current_round,
                totalQuestions: questions.length
            }
        };
    }

    async getIncorrectQuestions(sessionId, roundNumber) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT DISTINCT question_id 
                FROM topic_review_attempts 
                WHERE session_id = ? AND round_number = ? AND is_correct = 0
            `;
            
            this.database.db.all(query, [sessionId, roundNumber], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => row.question_id));
                }
            });
        });
    }

    async getQuestionsByIds(questionIds) {
        if (questionIds.length === 0) {
            return [];
        }

        const placeholders = questionIds.map(() => '?').join(',');
        const query = `SELECT * FROM questions WHERE id IN (${placeholders})`;

        return new Promise((resolve, reject) => {
            this.database.db.all(query, questionIds, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            });
        });
    }

    async completeSession(sessionId) {
        const session = await this.getReviewSession(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        // Mark session as completed
        await this.markSessionComplete(sessionId);

        // Update topic mastery
        await this.updateTopicMastery(session.user_id, session.topic, session.current_round);

        // Calculate session summary
        const timeSpent = this.calculateTimeSpent(session.started_at, new Date());
        
        return {
            topic: session.topic,
            totalRounds: session.current_round,
            finalScore: 100, // Session is only completed when 100% is achieved
            timeSpent,
            masteryAchieved: true
        };
    }

    calculateTimeSpent(startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        return Math.floor((end - start) / 1000); // Return seconds
    }

    async updateTopicMastery(userId, topicId, totalRounds) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT OR REPLACE INTO topic_mastery 
                (user_id, topic, total_sessions, average_rounds_to_mastery, last_practiced, mastered_at)
                VALUES (
                    ?, 
                    ?, 
                    COALESCE((SELECT total_sessions FROM topic_mastery WHERE user_id = ? AND topic = ?), 0) + 1,
                    (
                        COALESCE((SELECT average_rounds_to_mastery * total_sessions FROM topic_mastery WHERE user_id = ? AND topic = ?), 0) + ?
                    ) / (COALESCE((SELECT total_sessions FROM topic_mastery WHERE user_id = ? AND topic = ?), 0) + 1),
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP
                )
            `;
            
            this.database.db.run(query, [
                userId, topicId, userId, topicId, 
                userId, topicId, totalRounds,
                userId, topicId
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = ReviewSessionController;
