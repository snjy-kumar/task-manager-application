import mongoose, { Schema } from 'mongoose';

// Task Schema with optimized indexes
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxLength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxLength: [2000, 'Description cannot exceed 2000 characters'],
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'In Progress', 'Completed', 'Archived'],
      message: '{VALUE} is not a valid status'
    },
    default: 'Pending',
  },
  priority: {
    type: String,
    enum: {
      values: ['Low', 'Medium', 'High'],
      message: '{VALUE} is not a valid priority'
    },
    default: 'Medium',
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  // Category for organization
  category: {
    type: String,
    enum: {
      values: ['Personal', 'Work', 'Shopping', 'Health', 'Finance', 'Learning', 'Other'],
      message: '{VALUE} is not a valid category'
    },
    default: 'Personal',
  },
  // Tags for flexible labeling
  tags: [{
    type: String,
    trim: true,
    maxLength: 30
  }],
  // Recurring task fields
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurringPattern: {
    type: String,
    enum: {
      values: ['daily', 'weekly', 'biweekly', 'monthly', 'yearly', 'custom'],
      message: '{VALUE} is not a valid recurring pattern'
    },
  },
  recurringInterval: {
    type: Number,
    min: 1,
    max: 365,
    default: 1,
  },
  recurringEndDate: {
    type: Date,
  },
  parentTaskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
  },
  // Task dependencies - tasks that must be completed before this task can start
  dependencies: [{
    type: Schema.Types.ObjectId,
    ref: 'Task',
  }],
  completedAt: {
    type: Date,
  },
  order: {
    type: Number,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ===== INDEXES FOR PERFORMANCE =====

// Primary query pattern: Get all tasks for a user
TaskSchema.index({ user: 1, createdAt: -1 });

// Filter by status and due date (common dashboard queries)
TaskSchema.index({ user: 1, status: 1, dueDate: 1 });

// Filter by priority
TaskSchema.index({ user: 1, priority: 1 });

// Filter by due date (for calendar views and overdue detection)
TaskSchema.index({ user: 1, dueDate: 1 });

// Soft delete queries
TaskSchema.index({ user: 1, isDeleted: 1 });

// Text search on title and description
TaskSchema.index({ title: 'text', description: 'text' });

// ===== VIRTUAL FIELDS =====

// Check if task is overdue
TaskSchema.virtual('isOverdue').get(function () {
  if (this.status === 'Completed' || this.status === 'Archived') return false;
  return this.dueDate < new Date();
});

// Days until due (negative if overdue)
TaskSchema.virtual('daysUntilDue').get(function () {
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// ===== MIDDLEWARE =====

// Set completedAt when status changes to Completed
TaskSchema.pre('save', function () {
  if (this.isModified('status') && this.status === 'Completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
});

// ===== STATIC METHODS =====

// Get tasks with pagination
TaskSchema.statics.findPaginated = async function (filter, options = {}) {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    select = '',
    populate = ''
  } = options;

  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    this.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(select)
      .populate(populate)
      .lean(), // Use lean for read-only queries (faster)
    this.countDocuments(filter)
  ]);

  return {
    tasks,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  };
};

// Get task statistics for a user
TaskSchema.statics.getStats = async function (userId) {
  const stats = await this.aggregate([
    { $match: { user: userId, isDeleted: { $ne: true } } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
        archived: { $sum: { $cond: [{ $eq: ['$status', 'Archived'] }, 1, 0] } },
        highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'High'] }, 1, 0] } },
        overdue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $lt: ['$dueDate', new Date()] },
                  { $ne: ['$status', 'Completed'] },
                  { $ne: ['$status', 'Archived'] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ]);

  return stats[0] || {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    archived: 0,
    highPriority: 0,
    overdue: 0
  };
};

const Task = mongoose.model('Task', TaskSchema);

export default Task;