// Apply recommendation schema to the database
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../database/java_test.db');
const schemaPath = path.join(__dirname, '../../database/recommendation_schema.sql');

console.log('Applying recommendation schema to database...');
console.log(`Database path: ${dbPath}`);
console.log(`Schema path: ${schemaPath}`);

// Read schema file
const schema = fs.readFileSync(schemaPath, 'utf8');

// Connect to database and apply schema
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the database.');
  
  // Execute schema in a single transaction
  db.exec(schema, (err) => {
    if (err) {
      console.error('Error applying schema:', err.message);
      process.exit(1);
    }
    console.log('Schema successfully applied.');
    
    // Verify table was created
    db.get("SELECT count(*) as count FROM recommendations", [], (err, row) => {
      if (err) {
        console.error('Error verifying table:', err.message);
      } else {
        console.log(`Table contains ${row.count} recommendations.`);
      }
      
      // Close database connection
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed.');
        }
      });
    });
  });
});
