import { asyncHandler, NotFoundError, BadRequestError } from '../middleware/errorHandler.js';
import Task from '../models/task.model.js';
import Subtask from '../models/subtask.model.js';
import { Parser } from 'json2csv';

// @desc    Export tasks to CSV
// @route   GET /api/v1/tasks/export/csv
// @access  Private
export const exportTasksToCSV = asyncHandler(async (req, res) => {
  const { status, priority, category, dateFrom, dateTo } = req.query;

  // Build filter
  const filter = {
    user: req.User._id,
    isDeleted: false
  };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;
  
  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) filter.createdAt.$lte = new Date(dateTo);
  }

  // Fetch tasks
  const tasks = await Task.find(filter).sort({ createdAt: -1 }).lean();

  if (tasks.length === 0) {
    throw new NotFoundError('No tasks found to export');
  }

  // Format data for CSV
  const csvData = tasks.map(task => ({
    'Task ID': task._id.toString(),
    'Title': task.title,
    'Description': task.description,
    'Status': task.status,
    'Priority': task.priority,
    'Category': task.category,
    'Due Date': task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    'Completed Date': task.completedAt ? new Date(task.completedAt).toISOString().split('T')[0] : '',
    'Tags': Array.isArray(task.tags) ? task.tags.join('; ') : '',
    'Is Recurring': task.isRecurring ? 'Yes' : 'No',
    'Recurring Pattern': task.recurringPattern || '',
    'Created At': new Date(task.createdAt).toISOString(),
    'Updated At': new Date(task.updatedAt).toISOString()
  }));

  try {
    const parser = new Parser();
    const csv = parser.parse(csvData);

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=tasks-export-${Date.now()}.csv`);
    
    res.status(200).send(csv);
  } catch (error) {
    res.status(500);
    throw new Error('Error generating CSV file');
  }
});

// @desc    Export tasks to JSON
// @route   GET /api/v1/tasks/export/json
// @access  Private
export const exportTasksToJSON = asyncHandler(async (req, res) => {
  const { status, priority, category, dateFrom, dateTo, includeSubtasks } = req.query;

  // Build filter
  const filter = {
    user: req.User._id,
    isDeleted: false
  };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;
  
  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) filter.createdAt.$lte = new Date(dateTo);
  }

  // Fetch tasks
  let tasks = await Task.find(filter).sort({ createdAt: -1 }).lean();

  if (tasks.length === 0) {
    throw new NotFoundError('No tasks found to export');
  }

  // Include subtasks if requested
  if (includeSubtasks === 'true') {
    for (let task of tasks) {
      const subtasks = await Subtask.find({ 
        task: task._id, 
        isDeleted: false 
      }).lean();
      task.subtasks = subtasks;
    }
  }

  const exportData = {
    exportDate: new Date().toISOString(),
    taskCount: tasks.length,
    filters: { status, priority, category, dateFrom, dateTo },
    tasks
  };

  // Set headers for file download
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=tasks-export-${Date.now()}.json`);
  
  res.status(200).json(exportData);
});

// @desc    Import tasks from JSON
// @route   POST /api/v1/tasks/import/json
// @access  Private
export const importTasksFromJSON = asyncHandler(async (req, res) => {
  const { tasks, mode = 'add' } = req.body; // mode: 'add' or 'replace'

  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    throw new BadRequestError('Invalid import data. Expected an array of tasks.');
  }

  // If mode is 'replace', delete existing tasks
  if (mode === 'replace') {
    await Task.updateMany(
      { user: req.User._id },
      { isDeleted: true }
    );
  }

  const importedTasks = [];
  const errors = [];

  for (let i = 0; i < tasks.length; i++) {
    try {
      const taskData = tasks[i];

      // Validate required fields
      if (!taskData.title || !taskData.description) {
        errors.push({
          index: i,
          task: taskData.title || 'Untitled',
          error: 'Missing required fields (title or description)'
        });
        continue;
      }

      // Create new task
      const newTask = await Task.create({
        user: req.User._id,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status || 'Pending',
        priority: taskData.priority || 'Medium',
        category: taskData.category || 'Personal',
        dueDate: taskData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
        tags: taskData.tags || [],
        isRecurring: taskData.isRecurring || false,
        recurringPattern: taskData.recurringPattern,
        recurringInterval: taskData.recurringInterval,
        recurringEndDate: taskData.recurringEndDate
      });

      // Import subtasks if present
      if (taskData.subtasks && Array.isArray(taskData.subtasks)) {
        for (const subtaskData of taskData.subtasks) {
          await Subtask.create({
            task: newTask._id,
            title: subtaskData.title,
            description: subtaskData.description || '',
            isCompleted: false
          });
        }
      }

      importedTasks.push(newTask);
    } catch (error) {
      errors.push({
        index: i,
        task: taskData.title || 'Untitled',
        error: error.message
      });
    }
  }

  res.status(201).json({
    success: true,
    imported: importedTasks.length,
    failed: errors.length,
    data: {
      importedTasks,
      errors
    }
  });
});

// @desc    Import tasks from CSV
// @route   POST /api/v1/tasks/import/csv
// @access  Private
export const importTasksFromCSV = asyncHandler(async (req, res) => {
  // This would require multer to handle file upload
  // and csv-parser to parse CSV files
  // For now, return a placeholder
  
  if (!req.file) {
    throw new BadRequestError('No file uploaded');
  }

  res.status(501).json({
    success: false,
    message: 'CSV import not yet implemented. Use JSON import instead.'
  });
});

// @desc    Get export template (example format)
// @route   GET /api/v1/tasks/import/template
// @access  Private
export const getImportTemplate = asyncHandler(async (req, res) => {
  const template = {
    exportDate: new Date().toISOString(),
    taskCount: 2,
    filters: {},
    tasks: [
      {
        title: 'Example Task 1',
        description: 'This is a description of the task',
        status: 'Pending',
        priority: 'High',
        category: 'Work',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['important', 'urgent'],
        isRecurring: false,
        subtasks: [
          {
            title: 'Subtask 1',
            description: 'First step',
            isCompleted: false
          },
          {
            title: 'Subtask 2',
            description: 'Second step',
            isCompleted: false
          }
        ]
      },
      {
        title: 'Example Recurring Task',
        description: 'This task repeats weekly',
        status: 'Pending',
        priority: 'Medium',
        category: 'Personal',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['recurring'],
        isRecurring: true,
        recurringPattern: 'weekly',
        recurringInterval: 1,
        subtasks: []
      }
    ]
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=tasks-import-template.json');
  
  res.status(200).json(template);
});
