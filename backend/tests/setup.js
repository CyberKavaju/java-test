// Test setup file

// Increase timeout for database operations
jest.setTimeout(30000);

// Mock console.log to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Clean up after tests
afterAll(async () => {
  // Force close any remaining connections
  await new Promise(resolve => setTimeout(resolve, 100));
});
