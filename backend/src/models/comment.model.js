import mongoose, { Schema } from 'mongoose';

// Comment Schema for task discussions and notes
const CommentSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxLength: [2000, 'Comment cannot exceed 2000 characters'],
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  editedAt: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

// Indexes
CommentSchema.index({ task: 1, createdAt: -1 });
CommentSchema.index({ user: 1 });
CommentSchema.index({ parentComment: 1 });

// Middleware to set editedAt
CommentSchema.pre('save', function (next) {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    this.editedAt = new Date();
  }
  next();
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
