import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

// Connect to in-memory database before tests
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

// Clear database between tests
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

// Disconnect and stop server after all tests
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

// Suppress console logs during tests (optional - comment out to see logs)
const originalConsole = { ...console };
global.console = {
    ...console,
    log: () => {},
    debug: () => {},
    info: () => {},
    // Keep warn and error for debugging
    warn: originalConsole.warn,
    error: originalConsole.error,
};
