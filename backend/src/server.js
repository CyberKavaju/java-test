const express = require('express');
const cors = require('cors');
const Database = require('./database/Database');
const initialQuestions = require('./data/questions');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
let db;

const initializeDatabase = async () => {
    try {
        db = new Database();
        await db.init();
        
        // Check if questions exist, if not seed them
        const existingQuestions = await new Promise((resolve, reject) => {
            db.db.get("SELECT COUNT(*) as count FROM questions", (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        });
        
        if (existingQuestions === 0) {
            console.log('Seeding initial questions...');
            await db.seedQuestions(initialQuestions);
            console.log('Questions seeded successfully');
        }
        
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }
};

// Routes

// Get random questions for a new test
app.get('/api/questions/random', async (req, res) => {
    try {
        const userId = req.query.userId || 'default_user';
        const limit = parseInt(req.query.limit) || 25;
        
        const questions = await db.getRandomQuestions(userId, limit);
        
        // Remove correct answers from response
        const questionsForTest = questions.map(q => ({
            id: q.id,
            domain: q.domain,
            topic: q.topic,
            question_text: q.question_text,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            option_e: q.option_e
        }));
        
        res.json({
            success: true,
            questions: questionsForTest,
            total: questionsForTest.length
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch questions'
        });
    }
});

// Submit answers for a test
app.post('/api/submit-answers', async (req, res) => {
    try {
        const { userId = 'default_user', answers, timeSpent } = req.body;
        
        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid answers format'
            });
        }
        
        // Get the original questions to check answers
        const questionIds = answers.map(a => a.questionId);
        const questions = await new Promise((resolve, reject) => {
            const placeholders = questionIds.map(() => '?').join(',');
            db.db.all(
                `SELECT * FROM questions WHERE id IN (${placeholders})`,
                questionIds,
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
        
        // Process each answer
        const results = [];
        let correctCount = 0;
        
        for (const answer of answers) {
            const question = questions.find(q => q.id === answer.questionId);
            if (!question) continue;
            
            const isCorrect = question.correct_answer === answer.selectedAnswer;
            if (isCorrect) correctCount++;
            
            // Record attempt
            await db.recordAttempt(userId, answer.questionId, answer.selectedAnswer, isCorrect);
            
            // Update question stats
            await db.updateQuestionStats(answer.questionId, isCorrect);
            
            results.push({
                questionId: answer.questionId,
                selectedAnswer: answer.selectedAnswer,
                correctAnswer: question.correct_answer,
                isCorrect,
                explanation: question.explanation,
                question_text: question.question_text
            });
        }
        
        // Create test session record
        const sessionData = {
            userId,
            questionIds: JSON.stringify(questionIds),
            score: correctCount,
            totalQuestions: answers.length,
            timeSpent: timeSpent || 0
        };
        
        await new Promise((resolve, reject) => {
            db.db.run(
                `INSERT INTO test_sessions (user_id, question_ids, score, total_questions, time_taken, status)
                 VALUES (?, ?, ?, ?, ?, 'completed')`,
                [sessionData.userId, sessionData.questionIds, sessionData.score, sessionData.totalQuestions, sessionData.timeSpent],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
        
        res.json({
            success: true,
            results,
            score: correctCount,
            total: answers.length,
            percentage: Math.round((correctCount / answers.length) * 100)
        });
        
    } catch (error) {
        console.error('Error submitting answers:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to submit answers'
        });
    }
});

// Get user history and statistics
app.get('/api/user-history', async (req, res) => {
    try {
        const userId = req.query.userId || 'default_user';
        
        // Get user stats
        const userStats = await db.getUserStats(userId);
        
        // Get recent test sessions
        const testSessions = await new Promise((resolve, reject) => {
            db.db.all(
                `SELECT * FROM test_sessions 
                 WHERE user_id = ? 
                 ORDER BY completed_at DESC 
                 LIMIT 10`,
                [userId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
        
        // Get topic-wise performance
        const topicStats = await new Promise((resolve, reject) => {
            db.db.all(
                `SELECT 
                    q.topic,
                    COUNT(*) as total_attempts,
                    SUM(CASE WHEN ua.is_correct = 1 THEN 1 ELSE 0 END) as correct_answers,
                    ROUND(AVG(CASE WHEN ua.is_correct = 1 THEN 1.0 ELSE 0.0 END) * 100, 2) as success_rate
                 FROM user_attempts ua
                 JOIN questions q ON ua.question_id = q.id
                 WHERE ua.user_id = ?
                 GROUP BY q.topic
                 ORDER BY success_rate ASC`,
                [userId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
        
        res.json({
            success: true,
            userStats,
            testSessions,
            topicStats
        });
        
    } catch (error) {
        console.error('Error fetching user history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user history'
        });
    }
});

// Get performance report
app.get('/api/report', async (req, res) => {
    try {
        const userId = req.query.userId || 'default_user';
        
        // Get question-wise performance with color coding
        const questionPerformance = await new Promise((resolve, reject) => {
            db.db.all(
                `SELECT 
                    q.id,
                    q.topic,
                    q.question_text,
                    qs.correct_count,
                    qs.wrong_count,
                    qs.total_attempts,
                    CASE 
                        WHEN qs.total_attempts = 0 THEN 'gray'
                        WHEN qs.correct_count * 1.0 / qs.total_attempts >= 0.8 THEN 'green'
                        WHEN qs.correct_count * 1.0 / qs.total_attempts >= 0.5 THEN 'yellow'
                        ELSE 'red'
                    END as performance_color,
                    ROUND(qs.correct_count * 100.0 / NULLIF(qs.total_attempts, 0), 2) as success_rate
                 FROM questions q
                 LEFT JOIN question_stats qs ON q.id = qs.question_id
                 WHERE qs.total_attempts > 0
                 ORDER BY success_rate ASC`,
                [],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
        
        // Get overall performance trends
        const performanceTrend = await new Promise((resolve, reject) => {
            db.db.all(
                `SELECT 
                    DATE(attempt_timestamp) as date,
                    COUNT(*) as total_attempts,
                    SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct_answers,
                    ROUND(AVG(CASE WHEN is_correct = 1 THEN 1.0 ELSE 0.0 END) * 100, 2) as daily_success_rate
                 FROM user_attempts
                 WHERE user_id = ?
                 GROUP BY DATE(attempt_timestamp)
                 ORDER BY date DESC
                 LIMIT 30`,
                [userId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
        
        res.json({
            success: true,
            questionPerformance,
            performanceTrend
        });
        
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate report'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

// Start server
const startServer = async () => {
    await initializeDatabase();
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer().catch(console.error);

module.exports = app;
