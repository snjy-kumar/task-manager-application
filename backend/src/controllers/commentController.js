import Comment from '../models/comment.model.js';
import Task from '../models/task.model.js';
import Activity from '../models/activity.model.js';
import logger from '../config/logger.js';
import { BadRequestError, NotFoundError, asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get all comments for a task
 */
export const getComments = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findOne({ _id: taskId, user: req.User._id });
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  const comments = await Comment.find({
    task: taskId,
    isDeleted: { $ne: true }
  })
    .populate('user', 'name email')
    .populate('parentComment')
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    comments,
    count: comments.length
  });
});

/**
 * Create a new comment
 */
export const createComment = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { content, parentComment } = req.body;

  if (!content || content.trim().length === 0) {
    throw new BadRequestError('Comment content is required');
  }

  const task = await Task.findOne({ _id: taskId, user: req.User._id });
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  const comment = await Comment.create({
    task: taskId,
    user: req.User._id,
    content,
    parentComment
  });

  await comment.populate('user', 'name email');

  // Log activity
  await Activity.logActivity({
    task: taskId,
    user: req.User._id,
    action: 'comment_added',
    description: `Added a comment`
  });

  logger.info(`Comment created: ${comment._id} for task: ${taskId}`);

  return res.status(201).json({
    success: true,
    message: 'Comment created successfully',
    comment
  });
});

/**
 * Update a comment
 */
export const updateComment = asyncHandler(async (req, res) => {
  const { taskId, commentId } = req.params;
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    throw new BadRequestError('Comment content is required');
  }

  const comment = await Comment.findOne({
    _id: commentId,
    task: taskId,
    user: req.User._id
  });

  if (!comment) {
    throw new NotFoundError('Comment not found or unauthorized');
  }

  comment.content = content;
  await comment.save();

  await comment.populate('user', 'name email');

  return res.status(200).json({
    success: true,
    message: 'Comment updated successfully',
    comment
  });
});

/**
 * Delete a comment
 */
export const deleteComment = asyncHandler(async (req, res) => {
  const { taskId, commentId } = req.params;

  const comment = await Comment.findOne({
    _id: commentId,
    task: taskId,
    user: req.User._id
  });

  if (!comment) {
    throw new NotFoundError('Comment not found or unauthorized');
  }

  comment.isDeleted = true;
  await comment.save();

  logger.info(`Comment deleted: ${commentId} from task: ${taskId}`);

  return res.status(200).json({
    success: true,
    message: 'Comment deleted successfully'
  });
});
