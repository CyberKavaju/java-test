const Database = require('../src/database/Database');

describe('Database', () => {
    let db;

    beforeAll(async () => {
        db = new Database(':memory:');
        await db.init();
    });

    afterAll(async () => {
        if (db) {
            db.close();
        }
    });

    describe('Database Initialization', () => {
        it('should initialize database with proper schema', async () => {
            const tables = await new Promise((resolve, reject) => {
                db.db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows.map(row => row.name));
                });
            });

            expect(tables).toContain('questions');
            expect(tables).toContain('user_attempts');
            expect(tables).toContain('test_sessions');
            expect(tables).toContain('question_stats');
        });
    });

    describe('Question Operations', () => {
        let questionId;

        it('should create a new question', async () => {
            const questionData = {
                domain: 'Test Domain',
                topic: 'Test Topic',
                question_text: 'What is a test question?',
                option_a: 'Option A',
                option_b: 'Option B',
                option_c: 'Option C',
                option_d: 'Option D',
                option_e: null,
                correct_answer: 'A',
                explanation: 'Test explanation'
            };

            questionId = await db.createQuestion(questionData);
            expect(questionId).toBeDefined();
            expect(typeof questionId).toBe('number');
        });

        it('should retrieve random questions', async () => {
            const questions = await db.getRandomQuestions('test_user', 1);
            expect(Array.isArray(questions)).toBe(true);
            expect(questions.length).toBe(1);
            expect(questions[0]).toHaveProperty('id');
            expect(questions[0]).toHaveProperty('question_text');
        });

        it('should seed initial questions', async () => {
            const initialQuestions = [
                {
                    domain: 'Seed Domain',
                    topic: 'Seed Topic',
                    question_text: 'Seed question?',
                    option_a: 'A',
                    option_b: 'B',
                    option_c: 'C',
                    option_d: 'D',
                    correct_answer: 'A',
                    explanation: 'Seed explanation'
                }
            ];

            await db.seedQuestions(initialQuestions);
            
            const count = await new Promise((resolve, reject) => {
                db.db.get("SELECT COUNT(*) as count FROM questions", (err, row) => {
                    if (err) reject(err);
                    else resolve(row.count);
                });
            });

            expect(count).toBeGreaterThan(1); // Should have more than just the seeded question
        });
    });

    describe('User Attempts', () => {
        let testQuestionId;

        beforeAll(async () => {
            const questionData = {
                domain: 'Attempt Test',
                topic: 'Attempt Test',
                question_text: 'Attempt test question?',
                option_a: 'A',
                option_b: 'B',
                option_c: 'C',
                option_d: 'D',
                correct_answer: 'B',
                explanation: 'Test explanation'
            };

            testQuestionId = await db.createQuestion(questionData);
        });

        it('should record user attempts', async () => {
            await db.recordAttempt('test_user', testQuestionId, 'A', false);
            
            const attempts = await new Promise((resolve, reject) => {
                db.db.all('SELECT * FROM user_attempts WHERE user_id = ? AND question_id = ?', 
                    ['test_user', testQuestionId], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });

            expect(attempts.length).toBeGreaterThan(0);
            expect(attempts[0].selected_answer).toBe('A');
            expect(attempts[0].is_correct).toBe(0); // SQLite stores boolean as 0/1
        });

        it('should update question statistics', async () => {
            await db.updateQuestionStats(testQuestionId, true);
            
            const stats = await new Promise((resolve, reject) => {
                db.db.get('SELECT * FROM question_stats WHERE question_id = ?', 
                    [testQuestionId], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });

            expect(stats).toBeDefined();
            expect(stats.correct_count).toBeGreaterThan(0);
        });
    });

    describe('Database Error Handling', () => {
        it('should handle database connection errors gracefully', async () => {
            const badDb = new Database('/invalid/path/database.db');
            
            await expect(badDb.init()).rejects.toThrow();
        });

        it('should handle invalid SQL operations', async () => {
            await expect(
                new Promise((resolve, reject) => {
                    db.db.run('INVALID SQL STATEMENT', (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                })
            ).rejects.toThrow();
        });
    });
});
