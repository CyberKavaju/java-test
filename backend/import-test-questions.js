const Database = require('./src/database/Database');
const fs = require('fs');
const path = require('path');

async function importTestQuestions() {
    const db = new Database();
    await db.init();

    try {
        // Read and parse CSV with proper handling of quoted fields
        const csvContent = fs.readFileSync(path.join(__dirname, 'questions-test.csv'), 'utf8');
        const questions = parseCSV(csvContent);

        console.log(`Importing ${questions.length} test questions...`);
        const results = await db.importQuestions(questions);
        
        console.log('Import Results:');
        console.log(`- Imported: ${results.imported}`);
        console.log(`- Skipped: ${results.skipped}`);
        console.log(`- Errors: ${results.errors}`);
        
        if (results.errors > 0) {
            console.log('Error details:', results.errorRows);
        }

        // Verify import
        const totalQuestions = await db.getQuestionCount();
        const singleQuestions = await db.getQuestionsByType('single');
        const multipleQuestions = await db.getQuestionsByType('multiple');
        
        console.log('\nDatabase Summary:');
        console.log(`Total questions: ${totalQuestions}`);
        console.log(`Single choice: ${singleQuestions.length}`);
        console.log(`Multiple choice: ${multipleQuestions.length}`);
        
    } catch (error) {
        console.error('Import failed:', error);
    } finally {
        db.close();
    }
}

function parseCSV(csvContent) {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = parseCSVLine(lines[0]);
    const questions = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const question = {};
        
        headers.forEach((header, index) => {
            const key = header.trim();
            const value = values[index] ? values[index].trim() : '';
            question[key] = value || null;
        });
        
        questions.push(question);
    }
    
    return questions;
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"' && !inQuotes) {
            inQuotes = true;
        } else if (char === '"' && inQuotes && nextChar === '"') {
            current += '"';
            i++; // Skip next quote
        } else if (char === '"' && inQuotes) {
            inQuotes = false;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current);
    return result;
}

if (require.main === module) {
    importTestQuestions();
}

module.exports = importTestQuestions;
