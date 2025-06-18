const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Connect to the database
const db = new sqlite3.Database(path.join(__dirname, 'java_test.db'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
    console.log('Connected to database successfully');
});

// Read and execute the schema
const schemaSQL = fs.readFileSync(path.join(__dirname, 'recommendation_schema.sql'), 'utf8');

// Drop existing table if it exists and run the new schema
db.run('DROP TABLE IF EXISTS recommendations', (err) => {
    if (err) {
        console.error('Error dropping table:', err);
        db.close();
        process.exit(1);
    }
    console.log('Existing table dropped successfully');
    
    // Run the schema
    db.exec(schemaSQL, (err) => {
        if (err) {
            console.error('Error creating schema:', err);
            db.close();
            process.exit(1);
        }
        console.log('Schema created successfully');

        // Read and execute the insert recommendations
        const insertSQL = fs.readFileSync(path.join(__dirname, 'insert_recommendations.sql'), 'utf8');
        db.exec(insertSQL, (err) => {
            if (err) {
                console.error('Error inserting recommendations:', err);
                db.close();
                process.exit(1);
            }
            console.log('Recommendations inserted successfully');
            db.close();
        });
    });
});
