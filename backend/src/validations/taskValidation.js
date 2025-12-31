import Joi from 'joi';

// Task validation schema
export const createTaskSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(1)
        .max(200)
        .required()
        .messages({
            'string.empty': 'Title is required',
            'string.max': 'Title cannot exceed 200 characters',
            'any.required': 'Title is required'
        }),

    description: Joi.string()
        .trim()
        .max(2000)
        .default('')
        .messages({
            'string.max': 'Description cannot exceed 2000 characters'
        }),

    status: Joi.string()
        .valid('Pending', 'In Progress', 'Completed', 'Archived')
        .default('Pending')
        .messages({
            'any.only': 'Status must be Pending, In Progress, Completed, or Archived'
        }),

    priority: Joi.string()
        .valid('Low', 'Medium', 'High')
        .default('Medium')
        .messages({
            'any.only': 'Priority must be Low, Medium, or High'
        }),

    dueDate: Joi.date()
        .iso()
        .required()
        .messages({
            'date.base': 'Due date must be a valid date',
            'any.required': 'Due date is required'
        })
});

export const updateTaskSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(1)
        .max(200)
        .messages({
            'string.max': 'Title cannot exceed 200 characters'
        }),

    description: Joi.string()
        .trim()
        .max(2000)
        .messages({
            'string.max': 'Description cannot exceed 2000 characters'
        }),

    status: Joi.string()
        .valid('Pending', 'In Progress', 'Completed', 'Archived')
        .messages({
            'any.only': 'Status must be Pending, In Progress, Completed, or Archived'
        }),

    priority: Joi.string()
        .valid('Low', 'Medium', 'High')
        .messages({
            'any.only': 'Priority must be Low, Medium, or High'
        }),

    dueDate: Joi.date()
        .iso()
        .messages({
            'date.base': 'Due date must be a valid date'
        })
});
