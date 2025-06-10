// Insert all the Java documentation links into the recommendations table
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../../database/java_test.db');
console.log(`Database path: ${dbPath}`);

// Connect to the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the database.');
});

// Function to parse the recommendations SQL file and extract INSERT statements
function extractInsertStatements() {
  const schemaPath = path.join(__dirname, '../../database/recommendation_schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Extract all the topic and URL pairs
  console.log('Extracting topic-URL pairs from schema file...');
  const regex = /INSERT OR IGNORE INTO recommendations[^)]+\('([^']+)',\s*'([^']+)'\)/g;
  const pairs = [];
  let match;
  
  while ((match = regex.exec(schema)) !== null) {
    const topic = match[1];
    const url = match[2];
    pairs.push({ topic, url });
  }
  
  // If no matches found, try a more general regex
  if (pairs.length === 0) {
    console.log('No matches found with first regex, trying more general pattern...');
    const lines = schema.split('\n');
    for (const line of lines) {
      if (line.includes("INSERT") && line.includes("VALUES")) {
        const valueMatch = line.match(/\('([^']+)',\s*'([^']+)'\)/);
        if (valueMatch) {
          pairs.push({ topic: valueMatch[1], url: valueMatch[2] });
        }
      }
    }
  }
  
  return pairs;
}

// Begin a transaction
db.serialize(() => {
  db.run('BEGIN TRANSACTION');
  
  // Prepare the insert statement
  const stmt = db.prepare('INSERT OR IGNORE INTO recommendations (topic, documentation_url) VALUES (?, ?)');
  
  // Extract all the topic-URL pairs from the schema file
  const pairs = extractInsertStatements();
  console.log(`Found ${pairs.length} topic-URL pairs to insert`);
  
  // Insert each pair
  let inserted = 0;
  pairs.forEach(({ topic, url }) => {
    stmt.run(topic, url, function(err) {
      if (err) {
        console.error(`Error inserting "${topic}":`, err.message);
      } else if (this.changes > 0) {
        inserted++;
      }
    });
  });
  
  // Finalize the prepared statement
  stmt.finalize();
  
  // Commit the transaction
  db.run('COMMIT', function(err) {
    if (err) {
      console.error('Error committing transaction:', err.message);
    } else {
      console.log(`Transaction completed. Inserted ${inserted} new recommendations.`);
      
      // Count the total rows in the table
      db.get('SELECT COUNT(*) as count FROM recommendations', (err, row) => {
        if (err) {
          console.error('Error counting rows:', err.message);
        } else {
          console.log(`Total recommendations in table: ${row.count}`);
        }
        
        // Close the database
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
          } else {
            console.log('Database connection closed.');
          }
        });
      });
    }
  });
});
