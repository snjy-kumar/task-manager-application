import express from 'express';
import {
  exportTasksToCSV,
  exportTasksToJSON,
  importTasksFromJSON,
  importTasksFromCSV,
  getImportTemplate
} from '../controllers/importExportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Export routes
router.get('/export/csv', exportTasksToCSV);
router.get('/export/json', exportTasksToJSON);

// Import routes
router.post('/import/json', importTasksFromJSON);
router.post('/import/csv', importTasksFromCSV);
router.get('/import/template', getImportTemplate);

export default router;
