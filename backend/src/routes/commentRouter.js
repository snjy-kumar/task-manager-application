import express from 'express';
import { authMiddleware as protect } from '../middleware/authMiddleware.js';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment
} from '../controllers/commentController.js';

const router = express.Router({ mergeParams: true }); // mergeParams to access taskId from parent route

// All routes are protected with authentication

// Comment routes (nested under /api/v1/tasks/:taskId/comments)
router.get('/', protect, getComments);
router.post('/', protect, createComment);
router.put('/:commentId', protect, updateComment);
router.delete('/:commentId', protect, deleteComment);

export default router;
