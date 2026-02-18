import express from 'express';
import {
  addDependency,
  removeDependency,
  getDependencies,
  getDependents,
  canStartTask
} from '../controllers/dependencyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

// All routes are protected and nested under /api/v1/tasks/:taskId/dependencies
router.post('/', protect, addDependency);
router.get('/', protect, getDependencies);
router.get('/dependents', protect, getDependents);
router.get('/can-start', protect, canStartTask);
router.delete('/:dependencyId', protect, removeDependency);

export default router;
