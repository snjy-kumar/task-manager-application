import dotenv from 'dotenv';

dotenv.config();

const environment = {
    port: process.env.PORT || 5000,                // Server port (default 5000)
    mongoURI: process.env.MONGO_URI,              // MongoDB connection URI
    jwtSecret: process.env.JWT_SECRET,            // Secret key for JWT signing
    jwtExpiration: process.env.JWT_EXPIRATION || '1h', // JWT token expiration time (default 1 hour)
    logLevel: process.env.LOG_LEVEL || 'info',    // Logging level (default 'info')
}

export default environment;