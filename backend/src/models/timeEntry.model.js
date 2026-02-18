import mongoose, { Schema } from 'mongoose';

// Time Entry Schema for time tracking
const TimeEntrySchema = new mongoose.Schema({
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Task is required'],
    index: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required'],
  },
  endTime: {
    type: Date,
  },
  duration: {
    type: Number, // Duration in seconds
    default: 0,
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, 'Description cannot exceed 500 characters'],
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

// Indexes
TimeEntrySchema.index({ task: 1, startTime: -1 });
TimeEntrySchema.index({ user: 1, isActive: 1 });
TimeEntrySchema.index({ user: 1, startTime: -1 });

// Virtual for formatted duration
TimeEntrySchema.virtual('durationFormatted').get(function () {
  const hours = Math.floor(this.duration / 3600);
  const minutes = Math.floor((this.duration % 3600) / 60);
  const seconds = this.duration % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
});

// Middleware to calculate duration
TimeEntrySchema.pre('save', function (next) {
  if (this.startTime && this.endTime) {
    const diffMs = new Date(this.endTime) - new Date(this.startTime);
    this.duration = Math.floor(diffMs / 1000); // Convert to seconds
    this.isActive = false;
  }
  next();
});

// Static method to get total time for a task
TimeEntrySchema.statics.getTotalTime = async function (taskId) {
  const result = await this.aggregate([
    { $match: { task: taskId, isDeleted: { $ne: true } } },
    {
      $group: {
        _id: null,
        totalDuration: { $sum: '$duration' },
        entryCount: { $sum: 1 }
      }
    }
  ]);

  return result[0] || { totalDuration: 0, entryCount: 0 };
};

const TimeEntry = mongoose.model('TimeEntry', TimeEntrySchema);

export default TimeEntry;
