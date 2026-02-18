import Subtask from '../models/subtask.model.js';
import Task from '../models/task.model.js';
import Activity from '../models/activity.model.js';
import logger from '../config/logger.js';
import { BadRequestError, NotFoundError, asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get all subtasks for a task
 */
export const getSubtasks = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findOne({ _id: taskId, user: req.User._id });
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  const subtasks = await Subtask.find({
    task: taskId,
    isDeleted: { $ne: true }
  }).sort({ order: 1, createdAt: 1 });

  return res.status(200).json({
    success: true,
    subtasks,
    count: subtasks.length
  });
});

/**
 * Create a new subtask
 */
export const createSubtask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, order } = req.body;

  if (!title) {
    throw new BadRequestError('Subtask title is required');
  }

  const task = await Task.findOne({ _id: taskId, user: req.User._id });
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  const subtask = await Subtask.create({
    task: taskId,
    title,
    description,
    order,
    assignedTo: req.User._id
  });

  // Log activity
  await Activity.logActivity({
    task: taskId,
    user: req.User._id,
    action: 'subtask_added',
    description: `Added subtask: ${title}`,
    newValue: title
  });

  logger.info(`Subtask created: ${subtask._id} for task: ${taskId}`);

  return res.status(201).json({
    success: true,
    message: 'Subtask created successfully',
    subtask
  });
});

/**
 * Update a subtask
 */
export const updateSubtask = asyncHandler(async (req, res) => {
  const { taskId, subtaskId } = req.params;
  const updates = req.body;

  const task = await Task.findOne({ _id: taskId, user: req.User._id });
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  const subtask = await Subtask.findOne({ _id: subtaskId, task: taskId });
  if (!subtask) {
    throw new NotFoundError('Subtask not found');
  }

  // Track completion status change
  const wasCompleted = subtask.isCompleted;
  
  Object.assign(subtask, updates);
  await subtask.save();

  // Log activity if completion status changed
  if (wasCompleted !== subtask.isCompleted && subtask.isCompleted) {
    await Activity.logActivity({
      task: taskId,
      user: req.User._id,
      action: 'subtask_completed',
      description: `Completed subtask: ${subtask.title}`
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Subtask updated successfully',
    subtask
  });
});

/**
 * Delete a subtask
 */
export const deleteSubtask = asyncHandler(async (req, res) => {
  const { taskId, subtaskId } = req.params;

  const task = await Task.findOne({ _id: taskId, user: req.User._id });
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  const subtask = await Subtask.findOne({ _id: subtaskId, task: taskId });
  if (!subtask) {
    throw new NotFoundError('Subtask not found');
  }

  subtask.isDeleted = true;
  await subtask.save();

  logger.info(`Subtask deleted: ${subtaskId} from task: ${taskId}`);

  return res.status(200).json({
    success: true,
    message: 'Subtask deleted successfully'
  });
});

/**
 * Toggle subtask completion status
 */
export const toggleSubtask = asyncHandler(async (req, res) => {
  const { taskId, subtaskId } = req.params;

  const task = await Task.findOne({ _id: taskId, user: req.User._id });
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  const subtask = await Subtask.findOne({ _id: subtaskId, task: taskId });
  if (!subtask) {
    throw new NotFoundError('Subtask not found');
  }

  subtask.isCompleted = !subtask.isCompleted;
  await subtask.save();

  if (subtask.isCompleted) {
    await Activity.logActivity({
      task: taskId,
      user: req.User._id,
      action: 'subtask_completed',
      description: `Completed subtask: ${subtask.title}`
    });
  }

  return res.status(200).json({
    success: true,
    subtask
  });
});
