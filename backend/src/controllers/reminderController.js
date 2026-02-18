import asyncHandler from 'express-async-handler';
import Reminder from '../models/reminder.model.js';
import Task from '../models/task.model.js';

// @desc    Create a reminder for a task
// @route   POST /api/v1/tasks/:taskId/reminders
// @access  Private
export const createReminder = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { reminderTime, type, message } = req.body;

  // Verify task exists and user owns it
  const task = await Task.findOne({ _id: taskId, user: req.user._id, isDeleted: false });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Validate reminder time is in the future
  if (new Date(reminderTime) <= new Date()) {
    res.status(400);
    throw new Error('Reminder time must be in the future');
  }

  const reminder = await Reminder.create({
    task: taskId,
    user: req.user._id,
    reminderTime,
    type: type || 'in-app',
    message: message || `Reminder for task: ${task.title}`
  });

  res.status(201).json({
    success: true,
    data: reminder
  });
});

// @desc    Get all reminders for a task
// @route   GET /api/v1/tasks/:taskId/reminders
// @access  Private
export const getTaskReminders = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  // Verify task exists and user owns it
  const task = await Task.findOne({ _id: taskId, user: req.user._id, isDeleted: false });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const reminders = await Reminder.find({ 
    task: taskId,
    isActive: true
  }).sort({ reminderTime: 1 });

  res.status(200).json({
    success: true,
    count: reminders.length,
    data: reminders
  });
});

// @desc    Get all reminders for the authenticated user
// @route   GET /api/v1/reminders
// @access  Private
export const getUserReminders = asyncHandler(async (req, res) => {
  const { status } = req.query; // pending, sent, all
  
  let filter = { user: req.user._id, isActive: true };
  
  if (status === 'pending') {
    filter.isSent = false;
    filter.reminderTime = { $gt: new Date() };
  } else if (status === 'sent') {
    filter.isSent = true;
  } else if (status === 'due') {
    filter.isSent = false;
    filter.reminderTime = { $lte: new Date() };
  }

  const reminders = await Reminder.find(filter)
    .populate('task', 'title status priority dueDate')
    .sort({ reminderTime: 1 });

  res.status(200).json({
    success: true,
    count: reminders.length,
    data: reminders
  });
});

// @desc    Update a reminder
// @route   PUT /api/v1/tasks/:taskId/reminders/:reminderId
// @access  Private
export const updateReminder = asyncHandler(async (req, res) => {
  const { taskId, reminderId } = req.params;
  const { reminderTime, type, message, isActive } = req.body;

  const reminder = await Reminder.findOne({
    _id: reminderId,
    task: taskId,
    user: req.user._id
  });

  if (!reminder) {
    res.status(404);
    throw new Error('Reminder not found');
  }

  // Don't allow updating sent reminders unless just changing isActive
  if (reminder.isSent && (reminderTime || type || message)) {
    res.status(400);
    throw new Error('Cannot update sent reminders');
  }

  if (reminderTime !== undefined) {
    if (new Date(reminderTime) <= new Date()) {
      res.status(400);
      throw new Error('Reminder time must be in the future');
    }
    reminder.reminderTime = reminderTime;
  }
  if (type !== undefined) reminder.type = type;
  if (message !== undefined) reminder.message = message;
  if (isActive !== undefined) reminder.isActive = isActive;

  await reminder.save();

  res.status(200).json({
    success: true,
    data: reminder
  });
});

// @desc    Delete a reminder
// @route   DELETE /api/v1/tasks/:taskId/reminders/:reminderId
// @access  Private
export const deleteReminder = asyncHandler(async (req, res) => {
  const { taskId, reminderId } = req.params;

  const reminder = await Reminder.findOne({
    _id: reminderId,
    task: taskId,
    user: req.user._id
  });

  if (!reminder) {
    res.status(404);
    throw new Error('Reminder not found');
  }

  // Soft delete by setting isActive to false
  reminder.isActive = false;
  await reminder.save();

  res.status(200).json({
    success: true,
    message: 'Reminder deleted successfully'
  });
});

// @desc    Mark reminder as sent (internal use, can be triggered by cron job)
// @route   PUT /api/v1/reminders/:reminderId/mark-sent
// @access  Private
export const markReminderAsSent = asyncHandler(async (req, res) => {
  const { reminderId } = req.params;

  const reminder = await Reminder.markAsSent(reminderId);

  if (!reminder) {
    res.status(404);
    throw new Error('Reminder not found');
  }

  res.status(200).json({
    success: true,
    data: reminder
  });
});
