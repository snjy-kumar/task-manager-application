import express from 'express';
import {
  getUserReminders,
  markReminderAsSent
} from '../controllers/reminderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all reminders for the authenticated user
router.get('/', getUserReminders);

// Mark reminder as sent (internal/admin use)
router.put('/:reminderId/mark-sent', markReminderAsSent);

export default router;
