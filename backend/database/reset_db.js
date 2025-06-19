const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Connect to the database (this will create a new file if it doesn't exist)
const db = new sqlite3.Database(path.join(__dirname, 'java_test.db'), (err) => {
    if (err) {
        console.error('Error creating database:', err);
        process.exit(1);
    }
    console.log('Created fresh database successfully');
});

// Read and execute the schema only (no data insertion)
const schemaSQL = fs.readFileSync(path.join(__dirname, 'recommendation_schema.sql'), 'utf8');

// Create the schema
db.exec(schemaSQL, (err) => {
    if (err) {
        console.error('Error creating schema:', err);
        db.close();
        process.exit(1);
    }
    console.log('Schema created successfully');
    
    // Verify the table is empty
    db.get('SELECT COUNT(*) as count FROM recommendations', (err, row) => {
        if (err) {
            console.error('Error checking table:', err);
        } else {
            console.log(`Table created with ${row.count} records (should be 0)`);
        }
        db.close();
        console.log('Database reset complete - fresh install ready!');
    });
});
