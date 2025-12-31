import express from 'express';
import { authMiddleware as protect } from '../middleware/authMiddleware.js';
import {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    hardDeleteTask,
    getTaskStats,
    bulkUpdateTasks
} from '../controllers/taskController.js';
import validate from '../middleware/validate.js';
import { createTaskSchema, updateTaskSchema } from '../validations/taskValidation.js';

const router = express.Router();

// All routes are protected with authentication

// Task statistics (must be before /:id routes)
router.get("/stats", protect, getTaskStats);

// Bulk operations
router.patch("/bulk", protect, bulkUpdateTasks);

// CRUD operations
router.post("/", protect, validate(createTaskSchema), createTask);
router.get("/", protect, getTasks);
router.get("/:id", protect, getTask);
router.put("/:id", protect, validate(updateTaskSchema), updateTask);
router.delete("/:id", protect, deleteTask); // Soft delete
router.delete("/:id/permanent", protect, hardDeleteTask); // Hard delete

export default router;