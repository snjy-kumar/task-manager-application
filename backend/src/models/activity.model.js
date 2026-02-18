import mongoose, { Schema } from 'mongoose';

// Activity Log Schema for tracking changes
const ActivitySchema = new mongoose.Schema({
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
  action: {
    type: String,
    enum: {
      values: [
        'created',
        'updated',
        'deleted',
        'completed',
        'reopened',
        'status_changed',
        'priority_changed',
        'assigned',
        'unassigned',
        'comment_added',
        'subtask_added',
        'subtask_completed',
        'due_date_changed',
        'tags_changed',
        'archived',
        'restored'
      ],
      message: '{VALUE} is not a valid action'
    },
    required: true,
  },
  field: {
    type: String,
  },
  oldValue: {
    type: Schema.Types.Mixed,
  },
  newValue: {
    type: Schema.Types.Mixed,
  },
  description: {
    type: String,
    maxLength: 500,
  }
}, {
  timestamps: true
});

// Indexes
ActivitySchema.index({ task: 1, createdAt: -1 });
ActivitySchema.index({ user: 1, createdAt: -1 });
ActivitySchema.index({ action: 1 });

// Static method to log activity
ActivitySchema.statics.logActivity = async function (data) {
  try {
    const activity = await this.create(data);
    return activity;
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw error to prevent disrupting main operations
    return null;
  }
};

const Activity = mongoose.model('Activity', ActivitySchema);

export default Activity;
