-- Java Test Application Database Schema

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT NOT NULL,
    topic TEXT NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT,
    option_e TEXT,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    question_type TEXT DEFAULT 'single' CHECK(question_type IN ('single', 'multiple')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User attempts table
CREATE TABLE IF NOT EXISTS user_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL DEFAULT 'default_user',
    question_id INTEGER NOT NULL,
    selected_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    attempt_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Test sessions table
CREATE TABLE IF NOT EXISTS test_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL DEFAULT 'default_user',
    question_ids TEXT NOT NULL, -- JSON array of question IDs
    score INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 25,
    time_taken INTEGER, -- in seconds
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'in_progress' -- 'in_progress', 'completed', 'expired'
);

-- Question statistics table
CREATE TABLE IF NOT EXISTS question_stats (
    question_id INTEGER PRIMARY KEY,
    correct_count INTEGER DEFAULT 0,
    wrong_count INTEGER DEFAULT 0,
    total_attempts INTEGER DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Topic review sessions to track review progress
CREATE TABLE IF NOT EXISTS topic_review_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL DEFAULT 'default_user',
    topic TEXT NOT NULL,
    session_status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'paused'
    current_round INTEGER DEFAULT 1,
    total_rounds INTEGER DEFAULT 1,
    questions_correct_current_round INTEGER DEFAULT 0,
    questions_total_current_round INTEGER DEFAULT 0,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME NULL,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Track question attempts within review sessions
CREATE TABLE IF NOT EXISTS topic_review_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    round_number INTEGER NOT NULL,
    selected_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    attempt_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES topic_review_sessions(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Topic mastery tracking
CREATE TABLE IF NOT EXISTS topic_mastery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL DEFAULT 'default_user',
    topic TEXT NOT NULL,
    mastery_level TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced', 'mastered'
    total_sessions INTEGER DEFAULT 0,
    average_rounds_to_mastery DECIMAL(3,1) DEFAULT 0.0,
    last_practiced DATETIME DEFAULT CURRENT_TIMESTAMP,
    mastered_at DATETIME NULL,
    UNIQUE(user_id, topic)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_attempts_user_id ON user_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_attempts_question_id ON user_attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_user_id ON test_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic);
CREATE INDEX IF NOT EXISTS idx_questions_domain ON questions(domain);
CREATE INDEX IF NOT EXISTS idx_topic_review_sessions_user_id ON topic_review_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_review_sessions_topic ON topic_review_sessions(topic);
CREATE INDEX IF NOT EXISTS idx_topic_review_attempts_session_id ON topic_review_attempts(session_id);
CREATE INDEX IF NOT EXISTS idx_topic_mastery_user_topic ON topic_mastery(user_id, topic);
