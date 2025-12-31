/**
 * Standardized API Response Helpers
 */

export class ApiResponse {
    /**
     * Success response
     */
    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Created response (201)
     */
    static created(res, data, message = 'Created successfully') {
        return this.success(res, data, message, 201);
    }

    /**
     * No content response (204)
     */
    static noContent(res) {
        return res.status(204).send();
    }

    /**
     * Error response
     */
    static error(res, message, statusCode = 500, errors = null) {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString()
        };

        if (errors) {
            response.errors = errors;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Paginated response
     */
    static paginated(res, data, pagination, message = 'Success') {
        return res.status(200).json({
            success: true,
            message,
            data,
            pagination,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Validation error response
     */
    static validationError(res, errors) {
        return this.error(res, 'Validation failed', 400, errors);
    }

    /**
     * Not found response
     */
    static notFound(res, message = 'Resource not found') {
        return this.error(res, message, 404);
    }

    /**
     * Unauthorized response
     */
    static unauthorized(res, message = 'Unauthorized') {
        return this.error(res, message, 401);
    }

    /**
     * Forbidden response
     */
    static forbidden(res, message = 'Forbidden') {
        return this.error(res, message, 403);
    }
}

export default ApiResponse;
