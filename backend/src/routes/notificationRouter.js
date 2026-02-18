import express from 'express';
import {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  getUnreadCount
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getNotifications);
router.post('/', createNotification);
router.get('/unread/count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.delete('/read', deleteReadNotifications);
router.put('/:notificationId/read', markAsRead);
router.delete('/:notificationId', deleteNotification);

export default router;
