import mongoose, { Schema } from 'mongoose';

// Attachment Schema for file uploads
const AttachmentSchema = new mongoose.Schema({
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
  },
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true,
  },
  originalName: {
    type: String,
    required: [true, 'Original file name is required'],
    trim: true,
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required'],
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required'],
  },
  uploadPath: {
    type: String,
    required: [true, 'Upload path is required'],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

// Indexes
AttachmentSchema.index({ task: 1, isDeleted: 1 });
AttachmentSchema.index({ user: 1, createdAt: -1 });

// Virtual for file size in human-readable format
AttachmentSchema.virtual('fileSizeFormatted').get(function () {
  const bytes = this.fileSize;
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
});

// Static method to get total storage used by user
AttachmentSchema.statics.getUserStorageUsed = async function (userId) {
  const result = await this.aggregate([
    { $match: { user: userId, isDeleted: false } },
    { $group: { _id: null, totalSize: { $sum: '$fileSize' } } }
  ]);
  return result[0]?.totalSize || 0;
};

const Attachment = mongoose.model('Attachment', AttachmentSchema);

export default Attachment;
