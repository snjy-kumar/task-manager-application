import Task from '../models/task.model.js';
import User from '../models/user.model.js';
import logger from '../config/logger.js';
import { BadRequestError, NotFoundError, UnauthorizedError, asyncHandler } from '../utils/errors.js';
import mongoose from 'mongoose';

/**
 * Create a new task
 */
export const createTask = asyncHandler(async (req, res) => {
    const { description, title, status = 'Pending', dueDate, priority = 'Medium', tags } = req.body;

    if (!title || !description || !dueDate) {
        throw new BadRequestError('Title, description, and due date are required');
    }

    if (!req.User || !req.User._id) {
        throw new UnauthorizedError('Authentication required');
    }

    // Create task with authenticated user
    const task = await Task.create({
        title,
        description,
        status,
        priority,
        user: req.User._id,
        dueDate,
        tags: tags || []
    });

    // Update user's tasks array
    await User.findByIdAndUpdate(req.User._id, {
        $push: { tasks: task._id }
    });

    logger.info(`Task created: ${task._id} by user: ${req.User._id}`);

    return res.status(201).json({
        success: true,
        message: 'Task created successfully',
        task
    });
});

/**
 * Get all tasks for authenticated user with pagination
 */
export const getTasks = asyncHandler(async (req, res) => {
    const userId = req.User._id;

    // Parse query parameters
    const {
        page = 1,
        limit = 10,
        status,
        priority,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        overdue
    } = req.query;

    // Build filter
    const filter = {
        user: userId,
        isDeleted: { $ne: true }
    };

    // Filter by status
    if (status && ['Pending', 'In Progress', 'Completed', 'Archived'].includes(status)) {
        filter.status = status;
    }

    // Filter by priority
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
        filter.priority = priority;
    }

    // Filter overdue tasks
    if (overdue === 'true') {
        filter.dueDate = { $lt: new Date() };
        filter.status = { $nin: ['Completed', 'Archived'] };
    }

    // Text search
    if (search) {
        filter.$text = { $search: search };
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Use optimized pagination method
    const result = await Task.findPaginated(filter, {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        populate: { path: 'user', select: 'name email' }
    });

    logger.debug(`Fetched ${result.tasks.length} tasks for user: ${userId}`);

    return res.status(200).json({
        success: true,
        ...result
    });
});

/**
 * Get task statistics for dashboard
 */
export const getTaskStats = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.User._id);
    const stats = await Task.getStats(userId);

    return res.status(200).json({
        success: true,
        stats
    });
});

/**
 * Get a single task by ID
 */
export const getTask = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Use lean for faster read
    const task = await Task.findById(id).lean();

    if (!task) {
        throw new NotFoundError('Task not found');
    }

    // Verify ownership
    if (task.user.toString() !== req.User._id.toString()) {
        throw new UnauthorizedError('Not authorized to access this task');
    }

    return res.status(200).json({
        success: true,
        task
    });
});

/**
 * Update a task
 */
export const updateTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, tags } = req.body;

    const task = await Task.findById(id);

    if (!task) {
        throw new NotFoundError('Task not found');
    }

    // Verify ownership
    if (task.user.toString() !== req.User._id.toString()) {
        throw new UnauthorizedError('Not authorized to update this task');
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (tags !== undefined) task.tags = tags;

    await task.save();

    logger.info(`Task updated: ${id} by user: ${req.User._id}`);

    return res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        task
    });
});

/**
 * Delete a task (soft delete)
 */
export const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
        throw new NotFoundError('Task not found');
    }

    // Verify ownership
    if (task.user.toString() !== req.User._id.toString()) {
        throw new UnauthorizedError('Not authorized to delete this task');
    }

    // Soft delete
    task.isDeleted = true;
    await task.save();

    logger.info(`Task soft-deleted: ${id} by user: ${req.User._id}`);

    return res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
    });
});

/**
 * Permanently delete a task
 */
export const hardDeleteTask = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
        throw new NotFoundError('Task not found');
    }

    // Verify ownership
    if (task.user.toString() !== req.User._id.toString()) {
        throw new UnauthorizedError('Not authorized to delete this task');
    }

    await task.deleteOne();

    // Remove from user's tasks array
    await User.findByIdAndUpdate(req.User._id, {
        $pull: { tasks: task._id }
    });

    logger.info(`Task permanently deleted: ${id} by user: ${req.User._id}`);

    return res.status(200).json({
        success: true,
        message: 'Task permanently deleted'
    });
});

/**
 * Bulk update tasks
 */
export const bulkUpdateTasks = asyncHandler(async (req, res) => {
    const { taskIds, updates } = req.body;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
        throw new BadRequestError('Task IDs are required');
    }

    // Verify ownership of all tasks
    const tasks = await Task.find({
        _id: { $in: taskIds },
        user: req.User._id
    });

    if (tasks.length !== taskIds.length) {
        throw new UnauthorizedError('Not authorized to update some tasks');
    }

    // Allowed updates
    const allowedUpdates = {};
    if (updates.status) allowedUpdates.status = updates.status;
    if (updates.priority) allowedUpdates.priority = updates.priority;

    const result = await Task.updateMany(
        { _id: { $in: taskIds }, user: req.User._id },
        { $set: allowedUpdates }
    );

    logger.info(`Bulk update: ${result.modifiedCount} tasks updated by user: ${req.User._id}`);

    return res.status(200).json({
        success: true,
        message: `${result.modifiedCount} tasks updated`,
        modifiedCount: result.modifiedCount
    });
});