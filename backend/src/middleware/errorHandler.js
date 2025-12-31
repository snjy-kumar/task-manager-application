import logger from '../config/logger.js';
import * as Sentry from '@sentry/node';

/**
 * Base Application Error
 * All custom errors extend this class
 */
export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Common error classes (keeping class syntax for throw new compatibility)
export class BadRequestError extends AppError {
    constructor(message = 'Bad request') { super(message, 400); }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') { super(message, 401); }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') { super(message, 403); }
}

export class NotFoundError extends AppError {
    constructor(message = 'Not found') { super(message, 404); }
}

export class ConflictError extends AppError {
    constructor(message = 'Conflict') { super(message, 409); }
}

export class LockedError extends AppError {
    constructor(message = 'Account locked') { super(message, 423); }
}

/**
 * Async handler wrapper - eliminates try/catch boilerplate
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    // Log error
    logger.error({
        message: err.message,
        statusCode,
        url: req.originalUrl,
        method: req.method,
        userId: req.User?._id?.toString() || 'anonymous',
    });

    // Send to Sentry for unexpected errors only
    if (!err.isOperational && process.env.SENTRY_DSN) {
        Sentry.captureException(err);
    }

    // Response
    res.status(statusCode).json({
        success: false,
        message: err.isOperational ? err.message : 'Something went wrong',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

/**
 * Handle unhandled promise rejections
 */
export const handleUnhandledRejection = (server) => {
    process.on('unhandledRejection', (reason) => {
        logger.error('UNHANDLED REJECTION:', reason);
        if (process.env.SENTRY_DSN) Sentry.captureException(reason);
        server.close(() => process.exit(1));
    });
};

/**
 * Handle uncaught exceptions
 */
export const handleUncaughtException = () => {
    process.on('uncaughtException', (error) => {
        logger.error('UNCAUGHT EXCEPTION:', error);
        if (process.env.SENTRY_DSN) Sentry.captureException(error);
        process.exit(1);
    });
};

export default errorHandler;
