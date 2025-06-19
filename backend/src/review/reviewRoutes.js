const express = require('express');
const TopicQuestionMapper = require('./TopicQuestionMapper');
const ReviewSessionController = require('./ReviewSessionController');
const MasteryCalculator = require('./MasteryCalculator');

function createReviewRoutes(database) {
    const router = express.Router();
    const topicQuestionMapper = new TopicQuestionMapper();
    const reviewController = new ReviewSessionController(database, topicQuestionMapper);

    // GET /api/topics - Get all available topics from tutorial
    router.get('/topics', async (req, res) => {
        try {
            const topics = await topicQuestionMapper.getAllTopicsWithQuestionCounts(database);
            res.json({
                success: true,
                topics
            });
        } catch (error) {
            console.error('Error fetching topics:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch topics'
            });
        }
    });

    // GET /api/topics/:topicId - Get specific topic details
    router.get('/topics/:topicId', async (req, res) => {
        try {
            const { topicId } = req.params;
            const topic = await topicQuestionMapper.getTopicWithQuestionCount(topicId, database);
            
            if (!topic) {
                return res.status(404).json({
                    success: false,
                    error: 'Topic not found'
                });
            }

            res.json({
                success: true,
                topic
            });
        } catch (error) {
            console.error('Error fetching topic:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch topic'
            });
        }
    });

    // POST /api/review/start - Start a new review session
    router.post('/review/start', async (req, res) => {
        try {
            const { userId, topic } = req.body;

            if (!userId || !topic) {
                return res.status(400).json({
                    success: false,
                    error: 'userId and topic are required'
                });
            }

            const sessionData = await reviewController.startSession(userId, topic);
            res.json({
                success: true,
                ...sessionData
            });
        } catch (error) {
            console.error('Error starting review session:', error);
            
            if (error.message === 'Invalid topic') {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid topic'
                });
            }

            res.status(500).json({
                success: false,
                error: 'Failed to start review session'
            });
        }
    });

    // POST /api/review/submit-round - Submit answers for current round
    router.post('/review/submit-round', async (req, res) => {
        try {
            const { sessionId, answers } = req.body;

            if (!sessionId || !answers) {
                return res.status(400).json({
                    success: false,
                    error: 'sessionId and answers are required'
                });
            }

            const result = await reviewController.submitRound(sessionId, answers);
            res.json({
                success: true,
                ...result
            });
        } catch (error) {
            console.error('Error submitting round:', error);
            
            if (error.message === 'Session not found') {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found'
                });
            }

            res.status(500).json({
                success: false,
                error: 'Failed to submit round'
            });
        }
    });

    // GET /api/review/next-round/:sessionId - Get next round questions
    router.get('/review/next-round/:sessionId', async (req, res) => {
        try {
            const { sessionId } = req.params;
            const result = await reviewController.getNextRoundQuestions(parseInt(sessionId));
            
            res.json({
                success: true,
                ...result
            });
        } catch (error) {
            console.error('Error getting next round:', error);
            
            if (error.message === 'Session not found') {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found'
                });
            }

            if (error.message === 'Session already completed') {
                return res.status(400).json({
                    success: false,
                    error: 'Session already completed'
                });
            }

            res.status(500).json({
                success: false,
                error: 'Failed to get next round'
            });
        }
    });

    // POST /api/review/complete/:sessionId - Complete review session
    router.post('/review/complete/:sessionId', async (req, res) => {
        try {
            const { sessionId } = req.params;
            const sessionSummary = await reviewController.completeSession(parseInt(sessionId));
            
            res.json({
                success: true,
                sessionSummary
            });
        } catch (error) {
            console.error('Error completing session:', error);
            
            if (error.message === 'Session not found') {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found'
                });
            }

            res.status(500).json({
                success: false,
                error: 'Failed to complete session'
            });
        }
    });

    // GET /api/review/mastery/:userId - Get user's topic mastery overview
    router.get('/review/mastery/:userId', async (req, res) => {
        try {
            const { userId } = req.params;
            const masteryData = await MasteryCalculator.getMasteryOverview(userId, database, topicQuestionMapper);
            
            res.json({
                success: true,
                ...masteryData
            });
        } catch (error) {
            console.error('Error fetching mastery data:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch mastery data'
            });
        }
    });

    // GET /api/review/history/:userId/:topic - Get session history for user and topic
    router.get('/review/history/:userId/:topic', async (req, res) => {
        try {
            const { userId, topic } = req.params;
            const history = await MasteryCalculator.getSessionHistory(userId, topic, database);
            
            res.json({
                success: true,
                history
            });
        } catch (error) {
            console.error('Error fetching session history:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch session history'
            });
        }
    });

    return router;
}

module.exports = createReviewRoutes;
