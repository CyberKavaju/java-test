-- Database Migration Script for Multi-Selection Questions Support
-- This script adds the question_type column to existing questions table

-- Start transaction to ensure atomic migration
BEGIN TRANSACTION;

-- Create backup table
CREATE TABLE questions_backup AS SELECT * FROM questions;

-- Add the new question_type column with default value and constraint
ALTER TABLE questions ADD COLUMN question_type TEXT DEFAULT 'single' CHECK(question_type IN ('single', 'multiple'));

-- Update existing questions to have proper question_type based on correct_answer format
-- Questions with comma-separated answers are considered multiple choice
UPDATE questions 
SET question_type = 'multiple' 
WHERE correct_answer LIKE '%,%';

-- Verify the migration
-- Check that all questions have valid question_type values
SELECT CASE 
    WHEN COUNT(*) = 0 THEN 'MIGRATION SUCCESS: All questions have valid question_type'
    ELSE 'MIGRATION ERROR: ' || COUNT(*) || ' questions have invalid question_type'
END as migration_status
FROM questions 
WHERE question_type NOT IN ('single', 'multiple');

-- Check question type distribution
SELECT 
    question_type,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM questions), 2) as percentage
FROM questions 
GROUP BY question_type
ORDER BY question_type;

-- Commit the transaction if no errors
COMMIT;

-- Rollback instructions (run manually if needed):
-- BEGIN TRANSACTION;
-- DROP TABLE questions;
-- ALTER TABLE questions_backup RENAME TO questions;
-- COMMIT;
