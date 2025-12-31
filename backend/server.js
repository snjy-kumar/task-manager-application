import app from "./app.js";
import environment from "./src/config/environment.js";
import logger from "./src/config/logger.js";
import { handleUnhandledRejection, handleUncaughtException } from "./src/middleware/errorHandler.js";

// Handle uncaught exceptions before anything else
handleUncaughtException();

// Start server
const server = app.listen(environment.port, () => {
    logger.info(`🚀 Server running on http://localhost:${environment.port}`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔐 Sentry: ${process.env.SENTRY_DSN ? 'Enabled' : 'Disabled'}`);
});

// Handle unhandled promise rejections
handleUnhandledRejection(server);

// Graceful shutdown
const gracefulShutdown = (signal) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
        logger.error('Forcing shutdown after timeout');
        process.exit(1);
    }, 30000);
};

// Listen for shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default server;