import logger from '../config/logger.js';
import * as Sentry from '@sentry/node';

/**
 * Global error handler middleware
 * Catches all errors and sends appropriate responses
 */
const errorHandler = (err, req, res, next) => {
    // Log error details
    logger.error({
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode || 500,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userId: req.User?._id?.toString() || 'anonymous',
        body: req.method !== 'GET' ? req.body : undefined,
    });

    // Send to Sentry (for unexpected errors)
    if (!err.isOperational && process.env.SENTRY_DSN) {
        Sentry.captureException(err, {
            extra: {
                url: req.originalUrl,
                method: req.method,
                userId: req.User?._id?.toString(),
            },
        });
    }

    // Default error values
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Development: detailed error response
    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
            stack: err.stack,
            errors: err.errors || undefined,
        });
    }

    // Production: sanitized error response
    if (err.isOperational) {
        // Operational errors: send message to client
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || undefined,
        });
    }

    // Programming or unknown errors: don't leak details
    logger.error('UNEXPECTED ERROR:', err);
    return res.status(500).json({
        success: false,
        message: 'Something went wrong. Please try again later.',
    });
};

/**
 * Handle unhandled promise rejections
 */
export const handleUnhandledRejection = (server) => {
    process.on('unhandledRejection', (reason, promise) => {
        logger.error('UNHANDLED REJECTION:', { reason, promise });

        if (process.env.SENTRY_DSN) {
            Sentry.captureException(reason);
        }

        // Graceful shutdown
        server.close(() => {
            process.exit(1);
        });
    });
};

/**
 * Handle uncaught exceptions
 */
export const handleUncaughtException = () => {
    process.on('uncaughtException', (error) => {
        logger.error('UNCAUGHT EXCEPTION:', error);

        if (process.env.SENTRY_DSN) {
            Sentry.captureException(error);
        }

        process.exit(1);
    });
};

export default errorHandler;
