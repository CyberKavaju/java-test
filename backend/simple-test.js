const request = require('supertest');
const Database = require('./src/database/Database');
const createTestServer = require('./tests/testServer');

async function runSimpleTest() {
    console.log('Starting simple test...');
    
    try {
        // Create in-memory database
        console.log('1. Creating test database...');
        const testDb = new Database(':memory:');
        await testDb.init();
        console.log('✓ Database initialized');
        
        // Create test server
        console.log('2. Creating test server...');
        const app = createTestServer(testDb);
        console.log('✓ Test server created');
        
        // Test health endpoint
        console.log('3. Testing health endpoint...');
        const response = await request(app)
            .get('/api/health')
            .expect(200);
            
        console.log('Health response:', response.body);
        console.log('✓ Health endpoint test passed');
        
        // Close database
        testDb.close();
        console.log('✓ Test completed successfully');
        
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

runSimpleTest();
