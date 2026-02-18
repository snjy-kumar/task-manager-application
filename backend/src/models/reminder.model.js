import mongoose, { Schema } from 'mongoose';

// Reminder Schema
const ReminderSchema = new mongoose.Schema({
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Task reference is required'],
    index: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    index: true,
  },
  reminderTime: {
    type: Date,
    required: [true, 'Reminder time is required'],
    index: true,
  },
  type: {
    type: String,
    enum: {
      values: ['email', 'in-app', 'both'],
      message: '{VALUE} is not a valid reminder type'
    },
    default: 'in-app',
  },
  message: {
    type: String,
    trim: true,
    maxLength: 500,
  },
  isSent: {
    type: Boolean,
    default: false,
  },
  sentAt: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

// Indexes for querying
ReminderSchema.index({ user: 1, isSent: 1, isActive: 1 });
ReminderSchema.index({ reminderTime: 1, isSent: 1, isActive: 1 });
ReminderSchema.index({ task: 1, isActive: 1 });

// Virtual to check if reminder is due
ReminderSchema.virtual('isDue').get(function () {
  return !this.isSent && this.isActive && this.reminderTime <= new Date();
});

// Middleware to set sentAt when isSent is true
ReminderSchema.pre('save', function (next) {
  if (this.isModified('isSent') && this.isSent && !this.sentAt) {
    this.sentAt = new Date();
  }
  next();
});

// Static method to find due reminders
ReminderSchema.statics.findDueReminders = async function () {
  return this.find({
    reminderTime: { $lte: new Date() },
    isSent: false,
    isActive: true
  }).populate('task user');
};

// Static method to mark reminder as sent
ReminderSchema.statics.markAsSent = async function (reminderId) {
  return this.findByIdAndUpdate(
    reminderId,
    { isSent: true, sentAt: new Date() },
    { new: true }
  );
};

const Reminder = mongoose.model('Reminder', ReminderSchema);

export default Reminder;
