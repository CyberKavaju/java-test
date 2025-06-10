const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database/java_test.db');

function formatQuestionText(questionText) {
    // If the question already contains code blocks, format them properly
    let formatted = questionText;
    
    // Handle code blocks - ensure proper formatting
    formatted = formatted.replace(/```java\s*/g, '\n```java\n');
    formatted = formatted.replace(/```\s*/g, '\n```\n');
    
    // Add line breaks after question marks for multi-part questions
    formatted = formatted.replace(/\?\s*(?=[A-Z])/g, '?\n\n');
    
    // Format numbered lines in code examples
    formatted = formatted.replace(/(\d+\.\s)/g, '\n$1');
    
    // Add proper spacing around parentheses with instructions
    formatted = formatted.replace(/\.\s*\(/g, '.\n(');
    
    // Clean up extra whitespace but preserve intentional formatting
    formatted = formatted.replace(/\n\s*\n\s*\n/g, '\n\n');
    formatted = formatted.trim();
    
    return formatted;
}

function formatOptions(option) {
    if (!option) return option;
    
    // If option contains code, format it
    let formatted = option;
    
    // Format any inline code
    formatted = formatted.replace(/```java\s*/g, '\n```java\n');
    formatted = formatted.replace(/```\s*/g, '\n```\n');
    
    // Clean up whitespace
    formatted = formatted.trim();
    
    return formatted;
}

function formatExplanation(explanation) {
    if (!explanation) return explanation;
    
    let formatted = explanation;
    
    // Add line breaks after periods for better readability
    formatted = formatted.replace(/\.\s+(?=[A-Z])/g, '.\n\n');
    
    // Format code references
    formatted = formatted.replace(/```java\s*/g, '\n```java\n');
    formatted = formatted.replace(/```\s*/g, '\n```\n');
    
    // Clean up whitespace
    formatted = formatted.replace(/\n\s*\n\s*\n/g, '\n\n');
    formatted = formatted.trim();
    
    return formatted;
}

function formatQuestions() {
    const db = new sqlite3.Database(dbPath);
    
    console.log('Starting question formatting...');
    console.log('Database path:', dbPath);
    
    db.all("SELECT * FROM questions", [], (err, rows) => {
        if (err) {
            console.error('Error fetching questions:', err);
            return;
        }
        
        console.log(`Found ${rows.length} questions to format`);
        
        const updateStmt = db.prepare(`
            UPDATE questions 
            SET question_text = ?, 
                option_a = ?, 
                option_b = ?, 
                option_c = ?, 
                option_d = ?, 
                option_e = ?, 
                explanation = ?
            WHERE id = ?
        `);
        
        let processed = 0;
        
        rows.forEach((row, index) => {
            const formattedQuestion = formatQuestionText(row.question_text);
            const formattedOptionA = formatOptions(row.option_a);
            const formattedOptionB = formatOptions(row.option_b);
            const formattedOptionC = formatOptions(row.option_c);
            const formattedOptionD = formatOptions(row.option_d);
            const formattedOptionE = formatOptions(row.option_e);
            const formattedExplanation = formatExplanation(row.explanation);
            
            updateStmt.run([
                formattedQuestion,
                formattedOptionA,
                formattedOptionB,
                formattedOptionC,
                formattedOptionD,
                formattedOptionE,
                formattedExplanation,
                row.id
            ], function(err) {
                if (err) {
                    console.error(`Error updating question ${row.id}:`, err);
                } else {
                    processed++;
                    if (processed % 10 === 0) {
                        console.log(`Processed ${processed}/${rows.length} questions...`);
                    }
                }
                
                if (processed === rows.length) {
                    console.log('✅ All questions formatted successfully!');
                    updateStmt.finalize();
                    db.close();
                }
            });
        });
    });
}

// Run the formatting
formatQuestions();
