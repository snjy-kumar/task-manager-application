import express from 'express';
import {
  createReminder,
  getTaskReminders,
  getUserReminders,
  updateReminder,
  deleteReminder,
  markReminderAsSent
} from '../controllers/reminderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

// Task-specific reminder routes (nested under /api/v1/tasks/:taskId/reminders)
router.post('/', protect, createReminder);
router.get('/', protect, getTaskReminders);
router.put('/:reminderId', protect, updateReminder);
router.delete('/:reminderId', protect, deleteReminder);

export default router;
