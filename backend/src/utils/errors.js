/**
 * Custom error classes for better error handling
 */

// Base application error
export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Distinguishes from programming errors
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

        Error.captureStackTrace(this, this.constructor);
    }
}

// 400 Bad Request
export class BadRequestError extends AppError {
    constructor(message = 'Bad request') {
        super(message, 400);
    }
}

// 401 Unauthorized
export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

// 403 Forbidden
export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

// 404 Not Found
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

// 409 Conflict
export class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super(message, 409);
    }
}

// 422 Unprocessable Entity (validation errors)
export class ValidationError extends AppError {
    constructor(message = 'Validation failed', errors = []) {
        super(message, 422);
        this.errors = errors;
    }
}

// 423 Locked (account locked)
export class LockedError extends AppError {
    constructor(message = 'Account is locked') {
        super(message, 423);
    }
}

// 429 Too Many Requests
export class TooManyRequestsError extends AppError {
    constructor(message = 'Too many requests') {
        super(message, 429);
    }
}

// 500 Internal Server Error
export class InternalError extends AppError {
    constructor(message = 'Internal server error') {
        super(message, 500);
        this.isOperational = false; // Programming error
    }
}

// Helper to wrap async route handlers
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default {
    AppError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    ValidationError,
    LockedError,
    TooManyRequestsError,
    InternalError,
    asyncHandler,
};
