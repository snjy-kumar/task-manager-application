/**
 * Validation middleware factory
 * Creates a middleware that validates request body against a Joi schema
 */
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false, // Return all errors, not just the first
        stripUnknown: true // Remove unknown fields
    });

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    // Replace body with sanitized/validated values
    req.body = value;
    next();
};

export default validate;
