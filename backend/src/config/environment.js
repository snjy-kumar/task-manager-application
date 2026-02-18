import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const required = ['MONGO_URI', 'JWT_SECRET'];
const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('Please check your .env file and ensure all required variables are set.');
    process.exit(1);
}

// Validate JWT_SECRET strength
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  Warning: JWT_SECRET should be at least 32 characters long for security.');
}

const environment = {
    port: process.env.PORT || 5000,                // Server port (default 5000)
    mongoURI: process.env.MONGO_URI,              // MongoDB connection URI
    jwtSecret: process.env.JWT_SECRET,            // Secret key for JWT signing
    jwtExpiration: process.env.JWT_EXPIRATION || '1h', // JWT token expiration time (default 1 hour)
    logLevel: process.env.LOG_LEVEL || 'info',    // Logging level (default 'info')
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000',
}

export default environment;