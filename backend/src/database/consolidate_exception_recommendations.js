// Consolidate Exception Handling recommendations
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

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

// Exception handling related topics that should be consolidated
const exceptionTopics = [
  'Exception Hierarchy',
  'Catch Order', 
  'Catching Multiple Exceptions',
  'Checked vs Unchecked',
  'Custom Exceptions',
  'Finally Always Executes',
  'Catching RuntimeException',
  'Exception Handling Advantages',
  'Finally Overrides Return',
  'Handling Exceptions',
  'Method Signature and Throws',
  'Method Throwing Exception',
  'Exceptions'
];

// Begin a transaction
db.serialize(() => {
  db.run('BEGIN TRANSACTION');
  
  console.log('Removing duplicate exception handling recommendations...');
  
  // Remove all the duplicate exception handling topics
  const placeholders = exceptionTopics.map(() => '?').join(',');
  const stmt = db.prepare(`DELETE FROM recommendations WHERE topic IN (${placeholders})`);
  
  stmt.run(exceptionTopics, function(err) {
    if (err) {
      console.error('Error removing duplicates:', err.message);
      db.run('ROLLBACK');
      return;
    }
    console.log(`Removed ${this.changes} duplicate exception handling recommendations`);
    
    // Update the main Exception Handling recommendation to point to local file
    const updateStmt = db.prepare('UPDATE recommendations SET documentation_url = ? WHERE topic = ?');
    updateStmt.run('/docs/tutorial/26-exception-handling.md', 'Exception Handling', function(err) {
      if (err) {
        console.error('Error updating Exception Handling recommendation:', err.message);
        db.run('ROLLBACK');
        return;
      }
      
      console.log(`Updated Exception Handling recommendation to point to local tutorial`);
      
      // Commit the transaction
      db.run('COMMIT', function(err) {
        if (err) {
          console.error('Error committing transaction:', err.message);
        } else {
          console.log('Successfully consolidated exception handling recommendations!');
          
          // Verify the results
          db.get('SELECT * FROM recommendations WHERE topic = ?', ['Exception Handling'], (err, row) => {
            if (err) {
              console.error('Error verifying update:', err.message);
            } else if (row) {
              console.log('Verified: Exception Handling now points to:', row.documentation_url);
            } else {
              console.log('Warning: Exception Handling recommendation not found');
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
    
    updateStmt.finalize();
  });
  
  stmt.finalize();
});
