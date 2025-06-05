const request = require('supertest');
const Database = require('../src/database/Database');
const app = require('../src/server');

describe('Java Test API', () => {
    let testDb;

    beforeAll(async () => {
        // Use in-memory database for testing
        testDb = new Database(':memory:');
        await testDb.init();
    });

    afterAll(async () => {
        if (testDb) {
            testDb.close();
        }
    });

    describe('GET /api/health', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                message: 'Server is running'
            });
        });
    });

    describe('GET /api/questions/random', () => {
        it('should return random questions', async () => {
            const response = await request(app)
                .get('/api/questions/random')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.questions).toBeDefined();
            expect(Array.isArray(response.body.questions)).toBe(true);
            expect(response.body.total).toBeGreaterThan(0);
        });

        it('should not include correct answers in response', async () => {
            const response = await request(app)
                .get('/api/questions/random?limit=1')
                .expect(200);

            const question = response.body.questions[0];
            expect(question.correct_answer).toBeUndefined();
            expect(question.explanation).toBeUndefined();
        });
    });

    describe('POST /api/submit-answers', () => {
        it('should process submitted answers correctly', async () => {
            // First get a question
            const questionsResponse = await request(app)
                .get('/api/questions/random?limit=1');
            
            const questionId = questionsResponse.body.questions[0].id;
            
            const response = await request(app)
                .post('/api/submit-answers')
                .send({
                    userId: 'test_user',
                    answers: [
                        {
                            questionId: questionId,
                            selectedAnswer: 'A'
                        }
                    ],
                    timeSpent: 300
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.results).toBeDefined();
            expect(response.body.score).toBeDefined();
            expect(response.body.total).toBe(1);
            expect(response.body.percentage).toBeDefined();
        });

        it('should return 400 for invalid answers format', async () => {
            const response = await request(app)
                .post('/api/submit-answers')
                .send({
                    userId: 'test_user',
                    answers: 'invalid'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Invalid answers format');
        });
    });
});
