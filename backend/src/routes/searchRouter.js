import express from 'express';
import {
  advancedSearch,
  getSearchSuggestions,
  quickFilter
} from '../controllers/searchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', advancedSearch);
router.get('/suggestions', getSearchSuggestions);
router.get('/quick/:filterName', quickFilter);

export default router;
