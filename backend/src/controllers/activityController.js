import Activity from '../models/activity.model.js';
import Task from '../models/task.model.js';
import { NotFoundError, asyncHandler } from '../middleware/errorHandler.js';

/**
 * Get activity log for a task
 */
export const getTaskActivity = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const task = await Task.findOne({ _id: taskId, user: req.User._id });
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  const skip = (page - 1) * limit;

  const [activities, total] = await Promise.all([
    Activity.find({ task: taskId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Activity.countDocuments({ task: taskId })
  ]);

  return res.status(200).json({
    success: true,
    activities,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

/**
 * Get activity log for user (all tasks)
 */
export const getUserActivity = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;

  const skip = (page - 1) * limit;

  // First, get all task IDs for the user
  const userTasks = await Task.find({ user: req.User._id }).select('_id');
  const taskIds = userTasks.map(task => task._id);

  const [activities, total] = await Promise.all([
    Activity.find({ task: { $in: taskIds } })
      .populate('user', 'name email')
      .populate('task', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Activity.countDocuments({ task: { $in: taskIds } })
  ]);

  return res.status(200).json({
    success: true,
    activities,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

/**
 * Get activity statistics
 */
export const getActivityStats = asyncHandler(async (req, res) => {
  const { days = 7 } = req.query;

  // Get user's task IDs
  const userTasks = await Task.find({ user: req.User._id }).select('_id');
  const taskIds = userTasks.map(task => task._id);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  const stats = await Activity.aggregate([
    {
      $match: {
        task: { $in: taskIds },
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 }
      }
    }
  ]);

  const totalActivities = stats.reduce((sum, stat) => sum + stat.count, 0);

  return res.status(200).json({
    success: true,
    stats: {
      byAction: stats,
      total: totalActivities,
      period: `Last ${days} days`
    }
  });
});
