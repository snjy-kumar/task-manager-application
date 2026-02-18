import mongoose, { Schema } from 'mongoose';

// Task Template Schema for reusable task patterns
const TaskTemplateSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Template name is required'],
    trim: true,
    maxLength: [100, 'Name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, 'Description cannot exceed 500 characters'],
  },
  // Template data
  template: {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    category: {
      type: String,
      enum: ['Personal', 'Work', 'Shopping', 'Health', 'Finance', 'Learning', 'Other'],
      default: 'Personal',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    estimatedDuration: {
      type: Number, // in hours
    },
    subtasks: [{
      title: String,
      description: String,
      order: Number,
    }],
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      type: String,
      enum: ['daily', 'weekly', 'biweekly', 'monthly', 'yearly', 'custom'],
    },
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  useCount: {
    type: Number,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

// Indexes
TaskTemplateSchema.index({ user: 1, createdAt: -1 });
TaskTemplateSchema.index({ isPublic: 1, useCount: -1 });

// Method to create task from template
TaskTemplateSchema.methods.createTask = function (dueDate, additionalData = {}) {
  const taskData = {
    ...this.template,
    dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
    user: this.user,
    ...additionalData
  };

  // Increment use count
  this.useCount += 1;
  this.save();

  return taskData;
};

const TaskTemplate = mongoose.model('TaskTemplate', TaskTemplateSchema);

export default TaskTemplate;
