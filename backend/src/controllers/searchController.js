import { asyncHandler, BadRequestError } from '../middleware/errorHandler.js';
import Task from '../models/task.model.js';

// @desc    Advanced search for tasks with multiple filters
// @route   GET /api/v1/tasks/search
// @access  Private
export const advancedSearch = asyncHandler(async (req, res) => {
  const {
    query, // Text search
    status,
    priority,
    category,
    tags,
    dueDateFrom,
    dueDateTo,
    completedDateFrom,
    completedDateTo,
    isRecurring,
    hasAttachments,
    hasDependencies,
    hasComments,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 20
  } = req.query;

  // Build filter object
  const filter = {
    user: req.User._id,
    isDeleted: false
  };

  // Text search
  if (query) {
    filter.$text = { $search: query };
  }

  // Status filter (multiple values supported)
  if (status) {
    filter.status = Array.isArray(status) ? { $in: status } : status;
  }

  // Priority filter (multiple values supported)
  if (priority) {
    filter.priority = Array.isArray(priority) ? { $in: priority } : priority;
  }

  // Category filter
  if (category) {
    filter.category = Array.isArray(category) ? { $in: category } : category;
  }

  // Tags filter (tasks with ANY of the specified tags)
  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    filter.tags = { $in: tagArray };
  }

  // Due date range filter
  if (dueDateFrom || dueDateTo) {
    filter.dueDate = {};
    if (dueDateFrom) filter.dueDate.$gte = new Date(dueDateFrom);
    if (dueDateTo) filter.dueDate.$lte = new Date(dueDateTo);
  }

  // Completed date range filter
  if (completedDateFrom || completedDateTo) {
    filter.completedAt = {};
    if (completedDateFrom) filter.completedAt.$gte = new Date(completedDateFrom);
    if (completedDateTo) filter.completedAt.$lte = new Date(completedDateTo);
  }

  // Recurring tasks filter
  if (isRecurring !== undefined) {
    filter.isRecurring = isRecurring === 'true';
  }

  // Has attachments filter
  if (hasAttachments === 'true') {
    // This requires a lookup/aggregation, handled separately below
  }

  // Has dependencies filter
  if (hasDependencies === 'true') {
    filter.dependencies = { $exists: true, $ne: [] };
  }

  // Build sort object
  const sort = {};
  const validSortFields = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'status', 'title'];
  
  if (validSortFields.includes(sortBy)) {
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    sort.createdAt = -1;
  }

  // Handle text search score sorting
  if (query) {
    sort.score = { $meta: 'textScore' };
  }

  // Execute query
  const skip = (page - 1) * limit;
  
  let queryBuilder = Task.find(filter);

  // Add text score projection if text search is used
  if (query) {
    queryBuilder = queryBuilder.select({ score: { $meta: 'textScore' } });
  }

  const [tasks, total] = await Promise.all([
    queryBuilder
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('dependencies', 'title status'),
    Task.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    count: tasks.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    filter,
    data: tasks
  });
});

// @desc    Get saved search filters for user (can be extended to save/load filters)
// @route   GET /api/v1/tasks/search/suggestions
// @access  Private
export const getSearchSuggestions = asyncHandler(async (req, res) => {
  const { field } = req.query;

  const suggestions = {
    categories: ['Personal', 'Work', 'Shopping', 'Health', 'Finance', 'Learning', 'Other'],
    statuses: ['Pending', 'In Progress', 'Completed', 'Archived'],
    priorities: ['Low', 'Medium', 'High']
  };

  // Get unique tags used by this user
  if (field === 'tags' || !field) {
    const tagsResult = await Task.distinct('tags', { 
      user: req.User._id, 
      isDeleted: false 
    });
    suggestions.tags = tagsResult;
  }

  res.status(200).json({
    success: true,
    data: field ? suggestions[field] : suggestions
  });
});

// @desc    Quick filters for common searches
// @route   GET /api/v1/tasks/quick-filters/:filterName
// @access  Private
export const quickFilter = asyncHandler(async (req, res) => {
  const { filterName } = req.params;
  const { limit = 20 } = req.query;

  const baseFilter = {
    user: req.User._id,
    isDeleted: false
  };

  let filter = { ...baseFilter };
  let sort = { createdAt: -1 };
  let description = '';

  switch (filterName) {
    case 'overdue':
      filter.dueDate = { $lt: new Date() };
      filter.status = { $nin: ['Completed', 'Archived'] };
      sort = { dueDate: 1 };
      description = 'Tasks that are past their due date';
      break;

    case 'today':
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      filter.dueDate = { $gte: todayStart, $lte: todayEnd };
      sort = { dueDate: 1 };
      description = 'Tasks due today';
      break;

    case 'upcoming':
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      filter.dueDate = { $gte: tomorrow, $lte: nextWeek };
      filter.status = { $nin: ['Completed', 'Archived'] };
      sort = { dueDate: 1 };
      description = 'Tasks due in the next 7 days';
      break;

    case 'high-priority':
      filter.priority = 'High';
      filter.status = { $nin: ['Completed', 'Archived'] };
      sort = { dueDate: 1 };
      description = 'High priority incomplete tasks';
      break;

    case 'recently-completed':
      filter.status = 'Completed';
      sort = { completedAt: -1 };
      description = 'Recently completed tasks';
      break;

    case 'no-due-date':
      filter.dueDate = { $exists: false };
      description = 'Tasks without a due date';
      break;

    case 'recurring':
      filter.isRecurring = true;
      description = 'Recurring tasks';
      break;

    default:
      throw new BadRequestError('Invalid filter name');
  }

  const tasks = await Task.find(filter)
    .sort(sort)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    filterName,
    description,
    count: tasks.length,
    data: tasks
  });
});
