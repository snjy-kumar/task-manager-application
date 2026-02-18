import TimeEntry from '../models/timeEntry.model.js';
import Task from '../models/task.model.js';
import logger from '../config/logger.js';
import { BadRequestError, NotFoundError, asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get all time entries for a task
 */
export const getTimeEntries = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findOne({ _id: taskId, user: req.User._id });
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  const entries = await TimeEntry.find({
    task: taskId,
    isDeleted: { $ne: true }
  })
    .populate('user', 'name email')
    .sort({ startTime: -1 });

  const totalTime = await TimeEntry.getTotalTime(taskId);

  return res.status(200).json({
    success: true,
    entries,
    count: entries.length,
    totalTime: totalTime.totalDuration,
    totalTimeFormatted: formatDuration(totalTime.totalDuration)
  });
});

/**
 * Start a timer for a task
 */
export const startTimer = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { description } = req.body;

  const task = await Task.findOne({ _id: taskId, user: req.User._id });
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  // Check if there's already an active timer
  const activeTimer = await TimeEntry.findOne({
    user: req.User._id,
    isActive: true
  });

  if (activeTimer) {
    throw new BadRequestError('You already have an active timer. Please stop it first.');
  }

  const entry = await TimeEntry.create({
    task: taskId,
    user: req.User._id,
    startTime: new Date(),
    description,
    isActive: true
  });

  logger.info(`Timer started: ${entry._id} for task: ${taskId}`);

  return res.status(201).json({
    success: true,
    message: 'Timer started successfully',
    entry
  });
});

/**
 * Stop a timer
 */
export const stopTimer = asyncHandler(async (req, res) => {
  const { taskId, entryId } = req.params;

  const entry = await TimeEntry.findOne({
    _id: entryId,
    task: taskId,
    user: req.User._id,
    isActive: true
  });

  if (!entry) {
    throw new NotFoundError('Active timer not found');
  }

  entry.endTime = new Date();
  await entry.save();

  logger.info(`Timer stopped: ${entryId} for task: ${taskId}`);

  return res.status(200).json({
    success: true,
    message: 'Timer stopped successfully',
    entry,
    durationFormatted: formatDuration(entry.duration)
  });
});

/**
 * Create a manual time entry
 */
export const createTimeEntry = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { startTime, endTime, description } = req.body;

  if (!startTime || !endTime) {
    throw new BadRequestError('Start time and end time are required');
  }

  const task = await Task.findOne({ _id: taskId, user: req.User._id });
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  const entry = await TimeEntry.create({
    task: taskId,
    user: req.User._id,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    description
  });

  logger.info(`Manual time entry created: ${entry._id} for task: ${taskId}`);

  return res.status(201).json({
    success: true,
    message: 'Time entry created successfully',
    entry,
    durationFormatted: formatDuration(entry.duration)
  });
});

/**
 * Delete a time entry
 */
export const deleteTimeEntry = asyncHandler(async (req, res) => {
  const { taskId, entryId } = req.params;

  const entry = await TimeEntry.findOne({
    _id: entryId,
    task: taskId,
    user: req.User._id
  });

  if (!entry) {
    throw new NotFoundError('Time entry not found');
  }

  entry.isDeleted = true;
  await entry.save();

  logger.info(`Time entry deleted: ${entryId} from task: ${taskId}`);

  return res.status(200).json({
    success: true,
    message: 'Time entry deleted successfully'
  });
});

/**
 * Get active timer for user
 */
export const getActiveTimer = asyncHandler(async (req, res) => {
  const activeTimer = await TimeEntry.findOne({
    user: req.User._id,
    isActive: true
  }).populate('task', 'title');

  return res.status(200).json({
    success: true,
    activeTimer
  });
});

// Helper function to format duration
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}h ${minutes}m ${secs}s`;
}
