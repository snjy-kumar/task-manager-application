import mongoose from "mongoose";
import environment from "./environment.js";
import logger from "./logger.js";

/**
 * MongoDB connection configuration with optimization
 */
const dbConfig = async () => {
    try {
        if (!environment.mongoURI) {
            logger.error("MONGO_URI is not defined in environment variables");
            process.exit(1);
        }

        // Connection options for production
        const options = {
            // Connection pool settings
            maxPoolSize: 10, // Maximum number of connections in the pool
            minPoolSize: 2,  // Minimum number of connections in the pool

            // Timeouts
            serverSelectionTimeoutMS: 5000, // Timeout for server selection
            socketTimeoutMS: 45000, // Socket timeout

            // Keep alive
            family: 4, // Use IPv4

            // Auto index (disable in production for performance)
            autoIndex: process.env.NODE_ENV !== 'production',
        };

        const conn = await mongoose.connect(environment.mongoURI, options);

        logger.info(`MongoDB connected: ${conn.connection.host}`);
        logger.info(`Database: ${conn.connection.name}`);
        logger.info(`Connection pool: min=${options.minPoolSize}, max=${options.maxPoolSize}`);

        // Connection event handlers
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            logger.info('MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        logger.error("Error connecting to database:", error.message);
        process.exit(1);
    }
};

/**
 * Get database health status
 */
export const getDbHealth = async () => {
    try {
        const state = mongoose.connection.readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting',
        };

        // Ping the database
        if (state === 1) {
            await mongoose.connection.db.admin().ping();
        }

        return {
            status: states[state] || 'unknown',
            host: mongoose.connection.host,
            database: mongoose.connection.name,
            readyState: state,
        };
    } catch (error) {
        return {
            status: 'error',
            error: error.message,
        };
    }
};

export default dbConfig;