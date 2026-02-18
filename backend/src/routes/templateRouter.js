import express from 'express';
import { authMiddleware as protect } from '../middleware/authMiddleware.js';
import {
  getTemplates,
  createTemplate,
  createTaskFromTemplate,
  updateTemplate,
  deleteTemplate,
  getPopularTemplates
} from '../controllers/templateController.js';

const router = express.Router();

// All routes are protected with authentication

// Popular templates (public)
router.get('/popular', protect, getPopularTemplates);

// Template CRUD
router.get('/', protect, getTemplates);
router.post('/', protect, createTemplate);
router.post('/:templateId/create-task', protect, createTaskFromTemplate);
router.put('/:templateId', protect, updateTemplate);
router.delete('/:templateId', protect, deleteTemplate);

export default router;
