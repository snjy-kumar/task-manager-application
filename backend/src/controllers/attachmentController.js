import { asyncHandler, NotFoundError, BadRequestError } from '../middleware/errorHandler.js';
import Attachment from '../models/attachment.model.js';
import Task from '../models/task.model.js';
import Activity from '../models/activity.model.js';
import path from 'path';
import fs from 'fs/promises';

// @desc    Upload attachment for a task
// @route   POST /api/v1/tasks/:taskId/attachments
// @access  Private
export const uploadAttachment = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  
  // Check if file was uploaded
  if (!req.file) {
    throw new BadRequestError('No file uploaded');
  }

  // Verify task exists and user owns it
  const task = await Task.findOne({ _id: taskId, user: req.User._id, isDeleted: false });
  if (!task) {
    // Delete the uploaded file if task not found
    await fs.unlink(req.file.path);
    throw new NotFoundError('Task not found');
  }

  // Check storage limit (e.g., 100MB per user)
  const MAX_STORAGE = 100 * 1024 * 1024; // 100MB
  const currentUsage = await Attachment.getUserStorageUsed(req.User._id);
  
  if (currentUsage + req.file.size > MAX_STORAGE) {
    await fs.unlink(req.file.path);
    throw new BadRequestError('Storage limit exceeded. Maximum 100MB allowed.');
  }

  // Create attachment record
  const attachment = await Attachment.create({
    task: taskId,
    user: req.User._id,
    fileName: req.file.filename,
    originalName: req.file.originalname,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
    fileUrl: `/uploads/${req.file.filename}`,
    uploadPath: req.file.path,
  });

  // Log activity
  await Activity.logActivity({
    task: taskId,
    user: req.User._id,
    action: 'attachment_added',
    description: `Added attachment "${req.file.originalname}"`
  });

  res.status(201).json({
    success: true,
    data: attachment
  });
});

// @desc    Get all attachments for a task
// @route   GET /api/v1/tasks/:taskId/attachments
// @access  Private
export const getAttachments = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  // Verify task exists and user owns it
  const task = await Task.findOne({ _id: taskId, user: req.User._id, isDeleted: false });
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  const attachments = await Attachment.find({ 
    task: taskId, 
    isDeleted: false 
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: attachments.length,
    data: attachments
  });
});

// @desc    Delete an attachment
// @route   DELETE /api/v1/tasks/:taskId/attachments/:attachmentId
// @access  Private
export const deleteAttachment = asyncHandler(async (req, res) => {
  const { taskId, attachmentId } = req.params;

  // Find attachment
  const attachment = await Attachment.findOne({
    _id: attachmentId,
    task: taskId,
    user: req.User._id,
    isDeleted: false
  });

  if (!attachment) {
    throw new NotFoundError('Attachment not found');
  }

  // Soft delete
  attachment.isDeleted = true;
  await attachment.save();

  // Delete physical file
  try {
    await fs.unlink(attachment.uploadPath);
  } catch (error) {
    console.error('Error deleting file:', error);
    // Continue even if file deletion fails
  }

  // Log activity
  await Activity.logActivity({
    task: taskId,
    user: req.User._id,
    action: 'attachment_deleted',
    description: `Deleted attachment "${attachment.originalName}"`
  });

  res.status(200).json({
    success: true,
    message: 'Attachment deleted successfully'
  });
});

// @desc    Download an attachment
// @route   GET /api/v1/tasks/:taskId/attachments/:attachmentId/download
// @access  Private
export const downloadAttachment = asyncHandler(async (req, res) => {
  const { taskId, attachmentId } = req.params;

  // Find attachment
  const attachment = await Attachment.findOne({
    _id: attachmentId,
    task: taskId,
    user: req.User._id,
    isDeleted: false
  });

  if (!attachment) {
    throw new NotFoundError('Attachment not found');
  }

  // Check if file exists
  try {
    await fs.access(attachment.uploadPath);
  } catch (error) {
    throw new NotFoundError('File not found on server');
  }

  // Send file for download
  res.download(attachment.uploadPath, attachment.originalName);
});

// @desc    Get user storage stats
// @route   GET /api/v1/attachments/storage
// @access  Private
export const getStorageStats = asyncHandler(async (req, res) => {
  const used = await Attachment.getUserStorageUsed(req.User._id);
  const MAX_STORAGE = 100 * 1024 * 1024; // 100MB
  
  const attachmentCount = await Attachment.countDocuments({
    user: req.User._id,
    isDeleted: false
  });

  res.status(200).json({
    success: true,
    data: {
      used,
      max: MAX_STORAGE,
      percentage: Math.round((used / MAX_STORAGE) * 100),
      attachmentCount,
      usedFormatted: formatBytes(used),
      maxFormatted: formatBytes(MAX_STORAGE)
    }
  });
});

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
