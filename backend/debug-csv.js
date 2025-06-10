const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

console.log('Testing CSV parsing...');

const csvPath = path.join(__dirname, '..', 'simple-test.csv');
console.log('Looking for CSV at:', csvPath);

if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found at:', csvPath);
    process.exit(1);
}

const results = [];

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (data) => {
    console.log('Parsed row:', data);
    results.push(data);
  })
  .on('end', () => {
    console.log('Total rows parsed:', results.length);
    console.log('All results:', JSON.stringify(results, null, 2));
  })
  .on('error', (error) => {
    console.error('CSV parsing error:', error);
  });
