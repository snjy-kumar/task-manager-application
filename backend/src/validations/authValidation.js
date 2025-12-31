import Joi from 'joi';

// Password must be at least 8 characters with uppercase, lowercase, number, and special char
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const passwordMessages = {
    'string.pattern.base': 'Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)',
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required'
};

// Registration validation schema
export const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name cannot exceed 50 characters',
            'any.required': 'Name is required'
        }),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(8)
        .max(128)
        .pattern(passwordPattern)
        .required()
        .messages(passwordMessages)
});

// Login validation schema
export const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        })
});

// Password reset request
export const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        })
});

// Reset password with new password
export const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string()
        .min(8)
        .max(128)
        .pattern(passwordPattern)
        .required()
        .messages(passwordMessages)
});
