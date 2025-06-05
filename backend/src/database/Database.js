const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
    constructor(dbPath = null) {
        this.dbPath = dbPath || path.join(__dirname, '../../database/java_test.db');
        this.db = null;
    }

    async init() {
        try {
            // Ensure database directory exists
            const dbDir = path.dirname(this.dbPath);
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }

            // Connect to database
            this.db = new sqlite3.Database(this.dbPath);
            
            // Enable foreign keys
            this.db.run("PRAGMA foreign_keys = ON");
            
            // Create tables
            await this.createTables();
            
            console.log('Database initialized successfully');
            return this.db;
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw error;
        }
    }

    async createTables() {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        return new Promise((resolve, reject) => {
            this.db.exec(schema, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async seedQuestions(questions) {
        const stmt = this.db.prepare(`
            INSERT INTO questions (domain, topic, question_text, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("BEGIN TRANSACTION");
                
                questions.forEach(question => {
                    stmt.run([
                        question.domain,
                        question.topic,
                        question.question_text,
                        question.option_a,
                        question.option_b,
                        question.option_c,
                        question.option_d || null,
                        question.option_e || null,
                        question.correct_answer,
                        question.explanation
                    ]);
                });
                
                this.db.run("COMMIT", (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            
            stmt.finalize();
        });
    }

    async getRandomQuestions(userId = 'default_user', limit = 25) {
        const query = `
            SELECT q.* FROM questions q
            WHERE q.id NOT IN (
                SELECT DISTINCT ua.question_id 
                FROM user_attempts ua 
                WHERE ua.user_id = ? 
                AND ua.attempt_timestamp > datetime('now', '-30 days')
            )
            ORDER BY RANDOM()
            LIMIT ?
        `;

        return new Promise((resolve, reject) => {
            this.db.all(query, [userId, limit], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    // If we don't have enough unused questions, get random ones
                    if (rows.length < limit) {
                        const fallbackQuery = `
                            SELECT * FROM questions 
                            ORDER BY RANDOM() 
                            LIMIT ?
                        `;
                        this.db.all(fallbackQuery, [limit], (err, fallbackRows) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(fallbackRows);
                            }
                        });
                    } else {
                        resolve(rows);
                    }
                }
            });
        });
    }

    async recordAttempt(userId, questionId, selectedAnswer, isCorrect) {
        const query = `
            INSERT INTO user_attempts (user_id, question_id, selected_answer, is_correct)
            VALUES (?, ?, ?, ?)
        `;

        return new Promise((resolve, reject) => {
            this.db.run(query, [userId, questionId, selectedAnswer, isCorrect], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    async updateQuestionStats(questionId, isCorrect) {
        const upsertQuery = `
            INSERT INTO question_stats (question_id, correct_count, wrong_count, total_attempts, last_updated)
            VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
            ON CONFLICT(question_id) DO UPDATE SET
                correct_count = correct_count + ?,
                wrong_count = wrong_count + ?,
                total_attempts = total_attempts + 1,
                last_updated = CURRENT_TIMESTAMP
        `;

        const correctIncrement = isCorrect ? 1 : 0;
        const wrongIncrement = isCorrect ? 0 : 1;

        return new Promise((resolve, reject) => {
            this.db.run(upsertQuery, [
                questionId, 
                correctIncrement, 
                wrongIncrement,
                correctIncrement,
                wrongIncrement
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async getUserStats(userId = 'default_user') {
        const query = `
            SELECT 
                COUNT(*) as total_attempts,
                SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct_answers,
                COUNT(DISTINCT question_id) as unique_questions_attempted
            FROM user_attempts 
            WHERE user_id = ?
        `;

        return new Promise((resolve, reject) => {
            this.db.get(query, [userId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

module.exports = Database;
