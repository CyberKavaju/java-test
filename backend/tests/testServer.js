const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const createReviewRoutes = require('../src/review/reviewRoutes');

// Test server factory function
function createTestServer(testDatabase) {
    const app = express();
    
    // Middleware
    app.use(cors());
    app.use(express.json());
    
    // Use the provided test database
    const db = testDatabase;
    
    // Configure multer for file uploads
    const upload = multer({
        dest: path.join(__dirname, '../uploads/'),
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'text/csv') {
                cb(null, true);
            } else {
                cb(new Error('Only CSV files are allowed'), false);
            }
        },
        limits: {
            fileSize: 10 * 1024 * 1024 // 10MB limit
        }
    });
    
    // Validation function for question data
    const validateQuestion = (question, rowIndex) => {
        const errors = [];
        const requiredFields = ['domain', 'topic', 'question_text', 'option_a', 'option_b', 'option_c', 'correct_answer'];
        
        requiredFields.forEach(field => {
            if (!question[field] || question[field].trim() === '') {
                errors.push(`Missing required field: ${field}`);
            }
        });
        
        // Validate correct_answer is one of A, B, C, D, E
        const validAnswers = ['A', 'B', 'C', 'D', 'E'];
        if (question.correct_answer && !question.correct_answer.split(',').map(a => a.trim().toUpperCase()).every(a => validAnswers.includes(a))) {
            errors.push('Correct answer must be a comma-separated list of A, B, C, D, or E');
        }
        
        return errors;
    };

    // Routes

    // Health check endpoint
    app.get('/api/health', (req, res) => {
        res.json({
            success: true,
            message: 'Server is running'
        });
    });

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

    // Get total question count
    app.get('/api/questions/count', async (req, res) => {
        try {
            const count = await db.getQuestionCount();
            
            res.json({
                success: true,
                count: count
            });
        } catch (error) {
            console.error('Error fetching question count:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch question count'
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
                percentage: Math.round((correctCount / answers.length) * 100),
                timeSpent: timeSpent || 0
            });
        } catch (error) {
            console.error('Error submitting answers:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to submit answers'
            });
        }
    });

    // Get user history and stats
    app.get('/api/user-history', async (req, res) => {
        try {
            const userId = req.query.userId || 'default_user';
            
            // Get user stats
            const userStats = await db.getUserStats(userId);
            
            // Get test sessions
            const testSessions = await new Promise((resolve, reject) => {
                db.db.all(
                    `SELECT * FROM test_sessions WHERE user_id = ? ORDER BY completed_at DESC LIMIT 10`,
                    [userId],
                    (err, rows) => {
                        if (err) reject(err);
                        else resolve(rows);
                    }
                );
            });
            
            // Calculate total tests
            const totalTests = testSessions.length;
            
            // Calculate accuracy
            const accuracy = userStats.total_attempts > 0 
                ? Math.round((userStats.correct_answers / userStats.total_attempts) * 100) 
                : 0;
            
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
                userStats: {
                    totalAttempts: userStats.total_attempts || 0,
                    correctAnswers: userStats.correct_answers || 0,
                    totalTests: totalTests,
                    accuracy: accuracy,
                    uniqueQuestions: userStats.unique_questions_attempted || 0
                },
                testSessions: testSessions.map(session => ({
                    id: session.id,
                    score: session.score,
                    totalQuestions: session.total_questions,
                    percentage: Math.round((session.score / session.total_questions) * 100),
                    timeSpent: session.time_taken,
                    completedAt: session.completed_at,
                    status: session.status
                })),
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

    // Get detailed performance report
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
            
            // Get question details with user attempts
            const questionDetails = [];
            for (let question of questionPerformance) {
                const attempts = await new Promise((resolve, reject) => {
                    db.db.all(
                        `SELECT 
                            ua.selected_answer,
                            ua.is_correct,
                            ua.attempt_timestamp
                         FROM user_attempts ua
                         WHERE ua.user_id = ? AND ua.question_id = ?
                         ORDER BY ua.attempt_timestamp DESC
                         LIMIT 10`,
                        [userId, question.id],
                        (err, rows) => {
                            if (err) reject(err);
                            else resolve(rows);
                        }
                    );
                });
                
                questionDetails.push({
                    ...question,
                    attempts: attempts
                });
            }
            
            // Get topic-wise performance
            const topicPerformance = await new Promise((resolve, reject) => {
                db.db.all(
                    `SELECT 
                        q.topic,
                        SUM(qs.correct_count) as total_correct,
                        SUM(qs.wrong_count) as total_wrong,
                        SUM(qs.total_attempts) as total_attempts,
                        ROUND(SUM(qs.correct_count) * 100.0 / NULLIF(SUM(qs.total_attempts), 0), 2) as success_rate
                     FROM questions q
                     JOIN question_stats qs ON q.id = qs.question_id
                     WHERE qs.total_attempts > 0
                     GROUP BY q.topic
                     ORDER BY success_rate DESC`,
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
                        ROUND(AVG(CASE WHEN is_correct = 1.0 THEN 1.0 ELSE 0.0 END) * 100, 2) as daily_success_rate
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
                questionPerformance: questionDetails,
                performanceTrend,
                topicPerformance,
                summary: {
                    totalQuestions: questionDetails.length,
                    greenQuestions: questionDetails.filter(q => q.performance_color === 'green').length,
                    yellowQuestions: questionDetails.filter(q => q.performance_color === 'yellow').length,
                    redQuestions: questionDetails.filter(q => q.performance_color === 'red').length
                }
            });
        } catch (error) {
            console.error('Error generating report:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate report'
            });
        }
    });

    // Get detailed question performance with user attempts
    app.get('/api/question-details', async (req, res) => {
        try {
            const userId = req.query.userId || 'default_user';
            
            // Get detailed question performance with user attempts
            const questionDetails = await new Promise((resolve, reject) => {
                db.db.all(
                    `SELECT 
                        q.id,
                        q.domain,
                        q.topic,
                        q.question_text,
                        q.option_a,
                        q.option_b,
                        q.option_c,
                        q.option_d,
                        q.option_e,
                        q.correct_answer,
                        q.explanation,
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
            
            // Get user attempts for each question
            for (let question of questionDetails) {
                const attempts = await new Promise((resolve, reject) => {
                    db.db.all(
                        `SELECT 
                            ua.selected_answer,
                            ua.is_correct,
                            ua.attempt_timestamp
                         FROM user_attempts ua
                         WHERE ua.user_id = ? AND ua.question_id = ?
                         ORDER BY ua.attempt_timestamp DESC
                         LIMIT 10`,
                        [userId, question.id],
                        (err, rows) => {
                            if (err) reject(err);
                            else resolve(rows);
                        }
                    );
                });
                question.user_attempts = attempts;
            }
            
            res.json({
                success: true,
                questionDetails
            });
            
        } catch (error) {
            console.error('Error fetching detailed question performance:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch detailed question performance'
            });
        }
    });

    // Get question details including correct answer and explanation
    app.get('/api/question-details/:id', async (req, res) => {
        try {
            const questionId = parseInt(req.params.id);
            
            if (isNaN(questionId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid question ID'
                });
            }
            
            const question = await db.getQuestionById(questionId);
            
            if (!question) {
                return res.status(404).json({
                    success: false,
                    error: 'Question not found'
                });
            }
            
            res.json({
                success: true,
                question
            });
        } catch (error) {
            console.error('Error fetching question details:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch question details'
            });
        }
    });

    // Get all questions with pagination and filtering
    app.get('/api/questions', async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const domain = req.query.domain;
            const topic = req.query.topic;
            const search = req.query.search;

            let whereClause = '';
            let queryParams = [];

            if (domain || topic || search) {
                const conditions = [];
                if (domain) {
                    conditions.push('domain = ?');
                    queryParams.push(domain);
                }
                if (topic) {
                    conditions.push('topic = ?');
                    queryParams.push(topic);
                }
                if (search) {
                    conditions.push('(question_text LIKE ? OR explanation LIKE ?)');
                    queryParams.push(`%${search}%`, `%${search}%`);
                }
                whereClause = 'WHERE ' + conditions.join(' AND ');
            }

            // Get total count
            const countQuery = `SELECT COUNT(*) as total FROM questions ${whereClause}`;
            const totalResult = await new Promise((resolve, reject) => {
                db.db.get(countQuery, queryParams, (err, row) => {
                    if (err) reject(err);
                    else resolve(row.total);
                });
            });

            // Get questions with pagination
            const questionsQuery = `
                SELECT * FROM questions 
                ${whereClause}
                ORDER BY created_at DESC 
                LIMIT ? OFFSET ?
            `;
            const questions = await new Promise((resolve, reject) => {
                db.db.all(questionsQuery, [...queryParams, limit, offset], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });

            res.json({
                success: true,
                questions,
                pagination: {
                    currentPage: page,
                    itemsPerPage: limit,
                    totalItems: totalResult,
                    totalPages: Math.ceil(totalResult / limit)
                }
            });
        } catch (error) {
            console.error('Error fetching questions:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch questions'
            });
        }
    });

    // Get a single question by ID
    app.get('/api/questions/:id', async (req, res) => {
        try {
            const questionId = parseInt(req.params.id);
            
            if (isNaN(questionId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid question ID'
                });
            }
            
            const question = await db.getQuestionById(questionId);

            if (!question) {
                return res.status(404).json({
                    success: false,
                    error: 'Question not found'
                });
            }

            res.json({
                success: true,
                question
            });
        } catch (error) {
            console.error('Error fetching question:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch question'
            });
        }
    });

    // Create a new question
    app.post('/api/questions', async (req, res) => {
        try {
            const {
                domain,
                topic,
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                option_e,
                correct_answer,
                explanation
            } = req.body;

            // Validate required fields
            const requiredFields = ['domain', 'topic', 'question_text', 'option_a', 'option_b', 'option_c', 'correct_answer'];
            const missingFields = requiredFields.filter(field => !req.body[field] || req.body[field].trim() === '');
            
            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Missing required fields: ${missingFields.join(', ')}`
                });
            }

            // Validate correct_answer
            const validAnswers = ['A', 'B', 'C', 'D', 'E'];
            if (!correct_answer.split(',').map(a => a.trim().toUpperCase()).every(a => validAnswers.includes(a))) {
                return res.status(400).json({
                    success: false,
                    error: 'Correct answer must be a comma-separated list of A, B, C, D, or E'
                });
            }

            // Check for duplicate question
            const exists = await db.questionExists(question_text);
            if (exists) {
                return res.status(400).json({
                    success: false,
                    error: 'A question with this text already exists'
                });
            }

            // Create question object
            const questionData = {
                domain: domain.trim(),
                topic: topic.trim(),
                question_text: question_text.trim(),
                option_a: option_a.trim(),
                option_b: option_b.trim(),
                option_c: option_c.trim(),
                option_d: option_d ? option_d.trim() : null,
                option_e: option_e ? option_e.trim() : null,
                correct_answer: correct_answer.toUpperCase().trim(),
                explanation: explanation ? explanation.trim() : null
            };

            const questionId = await db.createQuestion(questionData);

            res.status(201).json({
                success: true,
                questionId,
                message: 'Question created successfully'
            });
        } catch (error) {
            console.error('Error creating question:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create question'
            });
        }
    });

    // Update an existing question
    app.put('/api/questions/:id', async (req, res) => {
        try {
            const questionId = parseInt(req.params.id);
            const {
                domain,
                topic,
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                option_e,
                correct_answer,
                explanation
            } = req.body;

            // Check if question exists
            const existingQuestion = await db.getQuestionById(questionId);

            if (!existingQuestion) {
                return res.status(404).json({
                    success: false,
                    error: 'Question not found'
                });
            }

            // Validate required fields
            const requiredFields = ['domain', 'topic', 'question_text', 'option_a', 'option_b', 'option_c', 'correct_answer'];
            const missingFields = requiredFields.filter(field => !req.body[field] || req.body[field].trim() === '');
            
            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Missing required fields: ${missingFields.join(', ')}`
                });
            }

            // Validate correct_answer
            const validAnswers = ['A', 'B', 'C', 'D', 'E'];
            if (!correct_answer.split(',').map(a => a.trim().toUpperCase()).every(a => validAnswers.includes(a))) {
                return res.status(400).json({
                    success: false,
                    error: 'Correct answer must be a comma-separated list of A, B, C, D, or E'
                });
            }

            // Check for duplicate question text (excluding current question)
            const duplicateExists = await new Promise((resolve, reject) => {
                db.db.get('SELECT id FROM questions WHERE question_text = ? AND id != ?', [question_text, questionId], (err, row) => {
                    if (err) reject(err);
                    else resolve(!!row);
                });
            });

            if (duplicateExists) {
                return res.status(400).json({
                    success: false,
                    error: 'A question with this text already exists'
                });
            }

            // Create question object
            const questionData = {
                domain: domain.trim(),
                topic: topic.trim(),
                question_text: question_text.trim(),
                option_a: option_a.trim(),
                option_b: option_b.trim(),
                option_c: option_c.trim(),
                option_d: option_d ? option_d.trim() : null,
                option_e: option_e ? option_e.trim() : null,
                correct_answer: correct_answer.toUpperCase().trim(),
                explanation: explanation ? explanation.trim() : null
            };

            const updated = await db.updateQuestion(questionId, questionData);

            if (!updated) {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to update question'
                });
            }

            res.json({
                success: true,
                message: 'Question updated successfully'
            });
        } catch (error) {
            console.error('Error updating question:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update question'
            });
        }
    });

    // Delete a question
    app.delete('/api/questions/:id', async (req, res) => {
        try {
            const questionId = parseInt(req.params.id);

            // Check if question exists
            const existingQuestion = await db.getQuestionById(questionId);

            if (!existingQuestion) {
                return res.status(404).json({
                    success: false,
                    error: 'Question not found'
                });
            }

            // Check if question has been used in tests
            const hasAttempts = await new Promise((resolve, reject) => {
                db.db.get('SELECT COUNT(*) as count FROM user_attempts WHERE question_id = ?', [questionId], (err, row) => {
                    if (err) reject(err);
                    else resolve(row.count > 0);
                });
            });

            if (hasAttempts) {
                return res.status(400).json({
                    success: false,
                    error: 'Cannot delete question that has been used in tests. Consider disabling it instead.'
                });
            }

            // Delete question
            const deleted = await db.deleteQuestion(questionId);

            if (!deleted) {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to delete question'
                });
            }

            // Also clean up any question stats
            await new Promise((resolve, reject) => {
                db.db.run('DELETE FROM question_stats WHERE question_id = ?', [questionId], function(err) {
                    if (err) reject(err);
                    else resolve();
                });
            });

            res.json({
                success: true,
                message: 'Question deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting question:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to delete question'
            });
        }
    });

    // Get unique domains and topics for filters
    app.get('/api/questions/meta/filters', async (req, res) => {
        try {
            const domains = await new Promise((resolve, reject) => {
                db.db.all('SELECT DISTINCT domain FROM questions ORDER BY domain', [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows.map(row => row.domain));
                });
            });

            const topics = await new Promise((resolve, reject) => {
                db.db.all('SELECT DISTINCT topic FROM questions ORDER BY topic', [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows.map(row => row.topic));
                });
            });

            res.json({
                success: true,
                domains,
                topics
            });
        } catch (error) {
            console.error('Error fetching filter options:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch filter options'
            });
        }
    });

    // Export questions as CSV
    app.get('/api/questions/export/csv', async (req, res) => {
        try {
            const domain = req.query.domain;
            const topic = req.query.topic;
            const search = req.query.search;

            let query = 'SELECT * FROM questions';
            let params = [];

            if (domain || topic || search) {
                const conditions = [];
                if (domain) {
                    conditions.push('domain = ?');
                    params.push(domain);
                }
                if (topic) {
                    conditions.push('topic = ?');
                    params.push(topic);
                }
                if (search) {
                    conditions.push('(question_text LIKE ? OR explanation LIKE ?)');
                    params.push(`%${search}%`, `%${search}%`);
                }
                query += ' WHERE ' + conditions.join(' AND ');
            }

            query += ' ORDER BY id';
            
            const questions = await new Promise((resolve, reject) => {
                db.db.all(query, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
            
            // Generate CSV content
            const csvHeader = 'ID,Domain,Topic,Question,Option A,Option B,Option C,Option D,Option E,Correct Answer,Explanation,Created At\n';
            
            const csvRows = questions.map(q => {
                // Escape CSV values that contain commas, quotes, or newlines
                const escapeCSV = (value) => {
                    if (value == null) return '';
                    const str = String(value);
                    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
                        return '"' + str.replace(/"/g, '""') + '"';
                    }
                    return str;
                };
                
                return [
                    q.id,
                    escapeCSV(q.domain),
                    escapeCSV(q.topic),
                    escapeCSV(q.question_text),
                    escapeCSV(q.option_a),
                    escapeCSV(q.option_b),
                    escapeCSV(q.option_c),
                    escapeCSV(q.option_d),
                    escapeCSV(q.option_e),
                    q.correct_answer,
                    escapeCSV(q.explanation),
                    q.created_at
                ].join(',');
            });
            
            const csvContent = csvHeader + csvRows.join('\n');
            
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="questions_export_${new Date().toISOString().split('T')[0]}.csv"`);
            res.send(csvContent);
        } catch (error) {
            console.error('Error exporting questions:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to export questions'
            });
        }
    });

    // Preview CSV import endpoint
    app.post('/api/import/preview', upload.single('file'), async (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        try {
            const questions = [];
            const errors = [];
            const duplicates = [];
            
            // Parse CSV file
            const csvData = [];
            
            // First, collect all CSV data
            await new Promise((resolve, reject) => {
                fs.createReadStream(req.file.path)
                    .pipe(csv())
                    .on('data', (data) => {
                        csvData.push(data);
                    })
                    .on('end', () => {
                        resolve();
                    })
                    .on('error', (error) => {
                        reject(error);
                    });
            });

            // Then process each row with proper async handling
            for (let i = 0; i < csvData.length; i++) {
                const data = csvData[i];
                const rowIndex = i;
                
                const questionErrors = validateQuestion(data, rowIndex);
                
                if (questionErrors.length > 0) {
                    errors.push({
                        rowIndex,
                        errors: questionErrors
                    });
                } else {
                    // Check for duplicates in database
                    try {
                        const exists = await db.questionExists(data.question_text);
                        if (exists) {
                            duplicates.push({
                                rowIndex,
                                question_text: data.question_text,
                                reason: 'Question already exists in database'
                            });
                        } else {
                            questions.push({
                                domain: data.domain.trim(),
                                topic: data.topic.trim(),
                                question_text: data.question_text.trim(),
                                option_a: data.option_a.trim(),
                                option_b: data.option_b.trim(),
                                option_c: data.option_c.trim(),
                                option_d: data.option_d ? data.option_d.trim() : null,
                                option_e: data.option_e ? data.option_e.trim() : null,
                                correct_answer: data.correct_answer.toUpperCase().trim(),
                                explanation: data.explanation ? data.explanation.trim() : ''
                            });
                        }
                    } catch (dbError) {
                        errors.push({
                            rowIndex,
                            errors: [`Database error: ${dbError.message}`]
                        });
                    }
                }
            }

            // Clean up uploaded file
            fs.unlinkSync(req.file.path);

            res.json({
                success: true,
                preview: questions.slice(0, 10), // Preview first 10 questions
                totalRows: questions.length,
                valid: questions.length,
                duplicates: duplicates.length,
                errors: errors.length,
                errorDetails: errors,
                duplicateDetails: duplicates
            });

        } catch (error) {
            console.error('Error previewing import:', error);
            
            // Clean up uploaded file
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            
            res.status(500).json({
                success: false,
                error: 'Failed to preview file'
            });
        }
    });

    // Import CSV questions endpoint
    app.post('/api/import/questions', upload.single('file'), async (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        try {
            const questions = [];
            const errors = [];
            let rowIndex = 0;

            // Parse CSV file
            await new Promise((resolve, reject) => {
                fs.createReadStream(req.file.path)
                    .pipe(csv())
                    .on('data', (data) => {
                        const questionErrors = validateQuestion(data, rowIndex);
                        
                        if (questionErrors.length > 0) {
                            errors.push({
                                rowIndex,
                                errors: questionErrors
                            });
                        } else {
                            questions.push({
                                domain: data.domain.trim(),
                                topic: data.topic.trim(),
                                question_text: data.question_text.trim(),
                                option_a: data.option_a.trim(),
                                option_b: data.option_b.trim(),
                                option_c: data.option_c.trim(),
                                option_d: data.option_d ? data.option_d.trim() : null,
                                option_e: data.option_e ? data.option_e.trim() : null,
                                correct_answer: data.correct_answer.toUpperCase().trim(),
                                explanation: data.explanation ? data.explanation.trim() : ''
                            });
                        }
                        rowIndex++;
                    })
                    .on('end', () => {
                        resolve();
                    })
                    .on('error', (error) => {
                        reject(error);
                    });
            });

            // Import valid questions
            const results = await db.importQuestions(questions);
            
            // Add validation errors to results
            results.errorRows = [...results.errorRows, ...errors];
            results.errors += errors.length;

            // Clean up uploaded file
            fs.unlinkSync(req.file.path);

            const success = results.imported > 0;
            let message = '';
            
            if (success) {
                message = `Successfully imported ${results.imported} questions.`;
                if (results.skipped > 0) {
                    message += ` Skipped ${results.skipped} duplicates.`;
                }
                if (results.errors > 0) {
                    message += ` ${results.errors} rows had errors.`;
                }
            } else {
                message = 'No questions were imported. Please check your file format and content.';
            }

            res.json({
                success,
                imported: results.imported,
                skipped: results.skipped,
                errors: results.errors,
                message,
                details: {
                    importedQuestions: results.imported,
                    skippedDuplicates: results.skipped,
                    errorRows: results.errorRows
                }
            });

        } catch (error) {
            console.error('Error importing questions:', error);
            
            // Clean up uploaded file
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            
            res.status(500).json({
                success: false,
                error: 'Failed to import questions'
            });
        }
    });

    // Mount review routes
    const reviewRoutes = createReviewRoutes(db);
    app.use('/api', reviewRoutes);

    return app;
}

module.exports = createTestServer;
