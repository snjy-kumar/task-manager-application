import asyncHandler from 'express-async-handler';
import Notification from '../models/notification.model.js';

// @desc    Get all notifications for the authenticated user
// @route   GET /api/v1/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
  const { status, type, limit = 50, page = 1 } = req.query;
  
  let filter = { user: req.user._id };
  
  if (status === 'unread') {
    filter.isRead = false;
  } else if (status === 'read') {
    filter.isRead = true;
  }
  
  if (type) {
    filter.type = type;
  }

  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('task', 'title status priority'),
    Notification.countDocuments(filter),
    Notification.getUnreadCount(req.user._id)
  ]);

  res.status(200).json({
    success: true,
    count: notifications.length,
    total,
    unreadCount,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: notifications
  });
});

// @desc    Create a notification (can be used internally)
// @route   POST /api/v1/notifications
// @access  Private
export const createNotification = asyncHandler(async (req, res) => {
  const { type, title, message, task, actionUrl, priority, metadata } = req.body;

  const notification = await Notification.createNotification({
    user: req.user._id,
    task,
    type,
    title,
    message,
    actionUrl,
    priority: priority || 'medium',
    metadata
  });

  res.status(201).json({
    success: true,
    data: notification
  });
});

// @desc    Mark a notification as read
// @route   PUT /api/v1/notifications/:notificationId/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  const notification = await Notification.markAsRead(req.user._id, notificationId);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/v1/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.markAllAsRead(req.user._id);

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// @desc    Delete a notification
// @route   DELETE /api/v1/notifications/:notificationId
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    user: req.user._id
  });

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully'
  });
});

// @desc    Delete all read notifications
// @route   DELETE /api/v1/notifications/read
// @access  Private
export const deleteReadNotifications = asyncHandler(async (req, res) => {
  const result = await Notification.deleteMany({
    user: req.user._id,
    isRead: true
  });

  res.status(200).json({
    success: true,
    message: `${result.deletedCount} notifications deleted`
  });
});

// @desc    Get unread notification count
// @route   GET /api/v1/notifications/unread/count
// @access  Private
export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.getUnreadCount(req.user._id);

  res.status(200).json({
    success: true,
    count
  });
});
