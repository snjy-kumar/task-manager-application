import express from 'express';
import { authMiddleware as protect } from '../middleware/authMiddleware.js';
import {
  getTimeEntries,
  createTimeEntry,
  startTimer,
  stopTimer,
  deleteTimeEntry,
  getActiveTimer
} from '../controllers/timeEntryController.js';

const router = express.Router({ mergeParams: true }); // mergeParams to access taskId from parent route

// All routes are protected with authentication

// Get active timer for the user (not task-specific)
router.get('/active', protect, getActiveTimer);

// Time entry routes (nested under /api/v1/tasks/:taskId/time)
router.get('/', protect, getTimeEntries);
router.post('/', protect, createTimeEntry);
router.post('/start', protect, startTimer);
router.patch('/:entryId/stop', protect, stopTimer);
router.delete('/:entryId', protect, deleteTimeEntry);

export default router;
