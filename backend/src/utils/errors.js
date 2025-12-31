// This file is deprecated. Use ../middleware/errorHandler.js instead.
// Keeping for backward compatibility - re-exports from errorHandler.
export {
    AppError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    LockedError,
    asyncHandler
} from '../middleware/errorHandler.js';
