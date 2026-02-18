import express from 'express';
import { authMiddleware as protect } from '../middleware/authMiddleware.js';
import {
  getTaskActivity,
  getUserActivity,
  getActivityStats
} from '../controllers/activityController.js';

const router = express.Router();

// All routes are protected with authentication

// User activity routes
router.get('/user', protect, getUserActivity);
router.get('/user/stats', protect, getActivityStats);

// Task activity (nested routes will be defined in taskRouter)
router.get('/task/:taskId', protect, getTaskActivity);

export default router;
