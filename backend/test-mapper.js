const TopicQuestionMapper = require('./src/review/TopicQuestionMapper');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

async function testMapper() {
    const mapper = new TopicQuestionMapper();
    const dbPath = path.join(__dirname, 'database', 'java_test.db');
    const database = { db: new sqlite3.Database(dbPath) };
    
    try {
        console.log('Testing topic: 20-looping-constructs');
        const questions = await mapper.getQuestionsForTopic('20-looping-constructs', database);
        console.log(`Found ${questions.length} questions:`);
        questions.forEach((q, index) => {
            console.log(`${index + 1}. ${q.topic} - ${q.question_text.substring(0, 50)}...`);
        });
    } catch (error) {
        console.error('Error:', error);
    } finally {
        database.db.close();
    }
}

testMapper();
