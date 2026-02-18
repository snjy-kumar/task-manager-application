import mongoose, { Schema } from 'mongoose';

// Subtask Schema for breaking down tasks into smaller items
const SubtaskSchema = new mongoose.Schema({
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Parent task is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Subtask title is required'],
    trim: true,
    maxLength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, 'Description cannot exceed 500 characters'],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  order: {
    type: Number,
    default: 0,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

// Indexes
SubtaskSchema.index({ task: 1, order: 1 });
SubtaskSchema.index({ task: 1, isCompleted: 1 });

// Middleware to set completedAt
SubtaskSchema.pre('save', function (next) {
  if (this.isModified('isCompleted') && this.isCompleted && !this.completedAt) {
    this.completedAt = new Date();
  } else if (this.isModified('isCompleted') && !this.isCompleted) {
    this.completedAt = null;
  }
  next();
});

const Subtask = mongoose.model('Subtask', SubtaskSchema);

export default Subtask;
