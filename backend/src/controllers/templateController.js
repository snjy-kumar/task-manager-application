import TaskTemplate from '../models/taskTemplate.model.js';
import Task from '../models/task.model.js';
import Subtask from '../models/subtask.model.js';
import logger from '../config/logger.js';
import { BadRequestError, NotFoundError, asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get all templates for user
 */
export const getTemplates = asyncHandler(async (req, res) => {
  const templates = await TaskTemplate.find({
    $or: [
      { user: req.User._id, isDeleted: { $ne: true } },
      { isPublic: true, isDeleted: { $ne: true } }
    ]
  }).sort({ useCount: -1, createdAt: -1 });

  return res.status(200).json({
    success: true,
    templates,
    count: templates.length
  });
});

/**
 * Create a new template
 */
export const createTemplate = asyncHandler(async (req, res) => {
  const { name, description, template, isPublic } = req.body;

  if (!name || !template || !template.title) {
    throw new BadRequestError('Template name and title are required');
  }

  const newTemplate = await TaskTemplate.create({
    user: req.User._id,
    name,
    description,
    template,
    isPublic: isPublic || false
  });

  logger.info(`Template created: ${newTemplate._id} by user: ${req.User._id}`);

  return res.status(201).json({
    success: true,
    message: 'Template created successfully',
    template: newTemplate
  });
});

/**
 * Create task from template
 */
export const createTaskFromTemplate = asyncHandler(async (req, res) => {
  const { templateId } = req.params;
  const { dueDate, additionalData } = req.body;

  const template = await TaskTemplate.findOne({
    _id: templateId,
    $or: [
      { user: req.User._id },
      { isPublic: true }
    ],
    isDeleted: { $ne: true }
  });

  if (!template) {
    throw new NotFoundError('Template not found');
  }

  // Create task data from template
  const taskData = template.createTask(dueDate, additionalData);
  taskData.user = req.User._id;

  // Create the task
  const task = await Task.create(taskData);

  // Create subtasks if template has them
  if (template.template.subtasks && template.template.subtasks.length > 0) {
    const subtaskPromises = template.template.subtasks.map(subtask =>
      Subtask.create({
        task: task._id,
        title: subtask.title,
        description: subtask.description,
        order: subtask.order || 0,
        assignedTo: req.User._id
      })
    );
    await Promise.all(subtaskPromises);
  }

  logger.info(`Task created from template: ${task._id}`);

  return res.status(201).json({
    success: true,
    message: 'Task created from template successfully',
    task
  });
});

/**
 * Update a template
 */
export const updateTemplate = asyncHandler(async (req, res) => {
  const { templateId } = req.params;
  const updates = req.body;

  const template = await TaskTemplate.findOne({
    _id: templateId,
    user: req.User._id
  });

  if (!template) {
    throw new NotFoundError('Template not found or unauthorized');
  }

  Object.assign(template, updates);
  await template.save();

  return res.status(200).json({
    success: true,
    message: 'Template updated successfully',
    template
  });
});

/**
 * Delete a template
 */
export const deleteTemplate = asyncHandler(async (req, res) => {
  const { templateId } = req.params;

  const template = await TaskTemplate.findOne({
    _id: templateId,
    user: req.User._id
  });

  if (!template) {
    throw new NotFoundError('Template not found or unauthorized');
  }

  template.isDeleted = true;
  await template.save();

  logger.info(`Template deleted: ${templateId}`);

  return res.status(200).json({
    success: true,
    message: 'Template deleted successfully'
  });
});

/**
 * Get popular public templates
 */
export const getPopularTemplates = asyncHandler(async (req, res) => {
  const templates = await TaskTemplate.find({
    isPublic: true,
    isDeleted: { $ne: true }
  })
    .sort({ useCount: -1 })
    .limit(10);

  return res.status(200).json({
    success: true,
    templates,
    count: templates.length
  });
});
