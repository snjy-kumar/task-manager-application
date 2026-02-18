import express from 'express';
import { authMiddleware as protect } from '../middleware/authMiddleware.js';
import {
  getSubtasks,
  createSubtask,
  updateSubtask,
  deleteSubtask,
  toggleSubtask
} from '../controllers/subtaskController.js';

const router = express.Router({ mergeParams: true }); // mergeParams to access taskId from parent route

// All routes are protected with authentication

// Subtask routes (nested under /api/v1/tasks/:taskId/subtasks)
router.get('/', protect, getSubtasks);
router.post('/', protect, createSubtask);
router.put('/:subtaskId', protect, updateSubtask);
router.patch('/:subtaskId/toggle', protect, toggleSubtask);
router.delete('/:subtaskId', protect, deleteSubtask);

export default router;
