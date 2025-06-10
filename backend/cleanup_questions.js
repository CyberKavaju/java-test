const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database/java_test.db');

function finalCleanup() {
    const db = new sqlite3.Database(dbPath);
    
    console.log('🧹 Starting final cleanup...');
    
    db.all("SELECT * FROM questions", [], (err, rows) => {
        if (err) {
            console.error('❌ Error fetching questions:', err);
            return;
        }
        
        console.log(`🔍 Cleaning up ${rows.length} questions`);
        
        const updateStmt = db.prepare(`
            UPDATE questions 
            SET explanation = ?
            WHERE id = ?
        `);
        
        let processed = 0;
        
        rows.forEach((row) => {
            let cleanExplanation = row.explanation || '';
            
            // Fix double backticks and malformed code formatting
            cleanExplanation = cleanExplanation.replace(/`{2,}/g, '`');
            cleanExplanation = cleanExplanation.replace(/`java\.lang\.`(\w+)`/g, '`java.lang.$1`');
            cleanExplanation = cleanExplanation.replace(/(\w+)Exception`{2,}/g, '$1Exception`');
            
            updateStmt.run([cleanExplanation, row.id], function(err) {
                if (err) {
                    console.error(`❌ Error updating question ${row.id}:`, err);
                } else {
                    processed++;
                }
                
                if (processed === rows.length) {
                    console.log('✨ Final cleanup completed!');
                    updateStmt.finalize();
                    db.close();
                }
            });
        });
    });
}

finalCleanup();
