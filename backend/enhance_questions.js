const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database/java_test.db');

function enhancedFormatQuestionText(questionText) {
    if (!questionText) return questionText;
    
    let formatted = questionText;
    
    // Ensure proper code block formatting
    formatted = formatted.replace(/```java\s*/g, '\n```java\n');
    formatted = formatted.replace(/```\s*(?!\w)/g, '\n```\n');
    
    // Format numbered lines in code examples with proper indentation
    formatted = formatted.replace(/^(\d+\.\s)/gm, '$1');
    
    // Add line breaks after question marks followed by capital letters (new questions/parts)
    formatted = formatted.replace(/\?\s*(?=[A-Z][a-z])/g, '?\n\n');
    
    // Add line breaks before parenthetical instructions
    formatted = formatted.replace(/\.\s*(\([^)]+\))/g, '.\n$1');
    
    // Format "Select X options" instructions
    formatted = formatted.replace(/(\(Select \d+ options?\.\))/g, '\n$1');
    
    // Clean up multiple newlines but preserve intentional spacing
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    formatted = formatted.trim();
    
    return formatted;
}

function enhancedFormatExplanation(explanation) {
    if (!explanation) return explanation;
    
    let formatted = explanation;
    
    // Add line breaks after sentences for better readability
    formatted = formatted.replace(/\.\s+(?=[A-Z])/g, '.\n\n');
    
    // Format code references and exceptions
    formatted = formatted.replace(/(java\.lang\.\w+)/g, '`$1`');
    formatted = formatted.replace(/(\w+Exception)/g, '`$1`');
    
    // Clean up extra whitespace
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    formatted = formatted.trim();
    
    return formatted;
}

function enhanceFormatting() {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('❌ Error opening database:', err);
            return;
        }
        console.log('✅ Database opened successfully');
    });
    
    console.log('🔄 Starting enhanced question formatting...');
    
    db.all("SELECT * FROM questions", [], (err, rows) => {
        if (err) {
            console.error('❌ Error fetching questions:', err);
            return;
        }
        
        console.log(`📋 Found ${rows.length} questions to enhance`);
        
        const updateStmt = db.prepare(`
            UPDATE questions 
            SET question_text = ?, 
                explanation = ?
            WHERE id = ?
        `);
        
        let processed = 0;
        
        rows.forEach((row) => {
            const enhancedQuestion = enhancedFormatQuestionText(row.question_text);
            const enhancedExplanation = enhancedFormatExplanation(row.explanation);
            
            updateStmt.run([
                enhancedQuestion,
                enhancedExplanation,
                row.id
            ], function(err) {
                if (err) {
                    console.error(`❌ Error updating question ${row.id}:`, err);
                } else {
                    processed++;
                    if (processed % 50 === 0) {
                        console.log(`✅ Processed ${processed}/${rows.length} questions...`);
                    }
                }
                
                if (processed === rows.length) {
                    console.log('🎉 All questions enhanced successfully!');
                    console.log(`✨ Total questions processed: ${processed}`);
                    updateStmt.finalize();
                    db.close();
                }
            });
        });
    });
}

// Run the enhanced formatting
enhanceFormatting();
