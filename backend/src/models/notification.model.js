import mongoose, { Schema } from 'mongoose';

// Notification Schema
const NotificationSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    index: true,
  },
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
  },
  type: {
    type: String,
    enum: {
      values: [
        'task_created',
        'task_updated',
        'task_completed',
        'task_overdue',
        'reminder',
        'comment_added',
        'dependency_completed',
        'assignment',
        'mention',
        'system'
      ],
      message: '{VALUE} is not a valid notification type'
    },
    required: [true, 'Notification type is required'],
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxLength: 200,
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxLength: 1000,
  },
  actionUrl: {
    type: String,
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  readAt: {
    type: Date,
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'urgent'],
      message: '{VALUE} is not a valid priority'
    },
    default: 'medium',
  },
  metadata: {
    type: Schema.Types.Mixed,
  }
}, {
  timestamps: true,
});

// Indexes for efficient queries
NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ task: 1 });

// Middleware to set readAt when isRead is true
NotificationSchema.pre('save', function (next) {
  if (this.isModified('isRead') && this.isRead && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

// Static method to create notification
NotificationSchema.statics.createNotification = async function (data) {
  return this.create(data);
};

// Static method to mark as read
NotificationSchema.statics.markAsRead = async function (userId, notificationId) {
  return this.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

// Static method to mark all as read
NotificationSchema.statics.markAllAsRead = async function (userId) {
  return this.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

// Static method to get unread count
NotificationSchema.statics.getUnreadCount = async function (userId) {
  return this.countDocuments({ user: userId, isRead: false });
};

// Static method to delete old read notifications
NotificationSchema.statics.deleteOldNotifications = async function (daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return this.deleteMany({
    isRead: true,
    readAt: { $lte: cutoffDate }
  });
};

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification;
