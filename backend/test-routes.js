const createReviewRoutes = require('./src/review/reviewRoutes');
const Database = require('./src/database/Database');

async function testRoutes() {
    try {
        const testDb = new Database(':memory:');
        await testDb.init();
        
        const routes = createReviewRoutes(testDb);
        console.log('Review routes created successfully');
        console.log('Routes:', routes.stack.length, 'routes found');
        
        testDb.close();
    } catch (error) {
        console.error('Error creating routes:', error);
    }
}

testRoutes();
