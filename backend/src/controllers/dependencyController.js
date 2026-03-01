import { asyncHandler, NotFoundError, BadRequestError } from '../middleware/errorHandler.js';
import Task from '../models/task.model.js';
import Activity from '../models/activity.model.js';

// @desc    Add dependency to a task
// @route   POST /api/v1/tasks/:taskId/dependencies
// @access  Private
export const addDependency = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { dependencyId } = req.body;

  // Verify both tasks exist and user owns them
  const [task, dependencyTask] = await Promise.all([
    Task.findOne({ _id: taskId, user: req.User._id, isDeleted: false }),
    Task.findOne({ _id: dependencyId, user: req.User._id, isDeleted: false })
  ]);

  if (!task) {
    throw new NotFoundError('Task not found');
  }

  if (!dependencyTask) {
    throw new NotFoundError('Dependency task not found');
  }

  // Check if dependency already exists
  if (task.dependencies.includes(dependencyId)) {
    throw new BadRequestError('Dependency already exists');
  }

  // Check for circular dependency
  const hasCircularDependency = await checkCircularDependency(dependencyId, taskId);
  if (hasCircularDependency) {
    throw new BadRequestError('Circular dependency detected. A task cannot depend on a task that depends on it.');
  }

  // Add dependency
  task.dependencies.push(dependencyId);
  await task.save();

  // Log activity
  await Activity.logActivity({
    task: taskId,
    user: req.User._id,
    action: 'dependency_added',
    description: `Added dependency on task "${dependencyTask.title}"`
  });

  await task.populate('dependencies', 'title status priority dueDate');

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Remove dependency from a task
// @route   DELETE /api/v1/tasks/:taskId/dependencies/:dependencyId
// @access  Private
export const removeDependency = asyncHandler(async (req, res) => {
  const { taskId, dependencyId } = req.params;

  const task = await Task.findOne({ 
    _id: taskId, 
    user: req.User._id, 
    isDeleted: false 
  });

  if (!task) {
    throw new NotFoundError('Task not found');
  }

  // Check if dependency exists
  if (!task.dependencies.includes(dependencyId)) {
    throw new BadRequestError('Dependency does not exist');
  }

  // Remove dependency
  task.dependencies = task.dependencies.filter(
    dep => dep.toString() !== dependencyId
  );
  await task.save();

  // Log activity
  await Activity.logActivity({
    task: taskId,
    user: req.User._id,
    action: 'dependency_removed',
    description: `Removed task dependency`
  });

  await task.populate('dependencies', 'title status priority dueDate');

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Get all dependencies for a task
// @route   GET /api/v1/tasks/:taskId/dependencies
// @access  Private
export const getDependencies = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findOne({ 
    _id: taskId, 
    user: req.User._id, 
    isDeleted: false 
  }).populate('dependencies', 'title status priority dueDate completedAt');

  if (!task) {
    throw new NotFoundError('Task not found');
  }

  // Check which dependencies are blocking (not completed)
  const dependencies = task.dependencies.map(dep => ({
    ...dep.toObject(),
    isBlocking: dep.status !== 'Completed'
  }));

  const canStart = dependencies.every(dep => !dep.isBlocking);

  res.status(200).json({
    success: true,
    count: dependencies.length,
    canStart,
    data: dependencies
  });
});

// @desc    Get tasks that depend on this task (reverse dependencies)
// @route   GET /api/v1/tasks/:taskId/dependents
// @access  Private
export const getDependents = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  // Verify task exists and user owns it
  const task = await Task.findOne({ 
    _id: taskId, 
    user: req.User._id, 
    isDeleted: false 
  });

  if (!task) {
    throw new NotFoundError('Task not found');
  }

  // Find all tasks that have this task as a dependency
  const dependents = await Task.find({
    user: req.User._id,
    dependencies: taskId,
    isDeleted: false
  }).select('title status priority dueDate');

  res.status(200).json({
    success: true,
    count: dependents.length,
    data: dependents
  });
});

// Helper function to check for circular dependencies using DFS
async function checkCircularDependency(dependencyId, originalTaskId, visited = new Set()) {
  // If we've come back to the original task, we have a circular dependency
  if (dependencyId.toString() === originalTaskId.toString()) {
    return true;
  }

  // If we've already visited this dependency, no circular dependency in this path
  if (visited.has(dependencyId.toString())) {
    return false;
  }

  visited.add(dependencyId.toString());

  // Get the dependency task
  const dependencyTask = await Task.findById(dependencyId).select('dependencies');
  
  if (!dependencyTask || !dependencyTask.dependencies || dependencyTask.dependencies.length === 0) {
    return false;
  }

  // Recursively check all dependencies of the dependency
  for (const subDependency of dependencyTask.dependencies) {
    const hasCircular = await checkCircularDependency(subDependency, originalTaskId, visited);
    if (hasCircular) {
      return true;
    }
  }

  return false;
}

// @desc    Validate if a task can be started (all dependencies completed)
// @route   GET /api/v1/tasks/:taskId/can-start
// @access  Private
export const canStartTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findOne({ 
    _id: taskId, 
    user: req.User._id, 
    isDeleted: false 
  }).populate('dependencies', 'status');

  if (!task) {
    throw new NotFoundError('Task not found');
  }

  const canStart = task.dependencies.every(dep => dep.status === 'Completed');
  const blockingDependencies = task.dependencies.filter(dep => dep.status !== 'Completed');

  res.status(200).json({
    success: true,
    canStart,
    blockingCount: blockingDependencies.length,
    blockingDependencies
  });
});
