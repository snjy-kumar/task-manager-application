import React, { useState, useEffect } from 'react';
import { Link, GitBranch, AlertCircle, CheckCircle2, Clock, X, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import dependencyService, { Dependency } from '@/services/dependencyService';
import taskService, { Task } from '@/services/taskService';

interface TaskDependenciesProps {
  taskId: string;
}

const TaskDependencies: React.FC<TaskDependenciesProps> = ({ taskId }) => {
  const { success, error } = useToast();
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [dependents, setDependents] = useState<Dependency[]>([]);
  const [canStart, setCanStart] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    loadDependencies();
    loadDependents();
  }, [taskId]);

  const loadDependencies = async () => {
    try {
      setLoading(true);
      const data = await dependencyService.getDependencies(taskId);
      setDependencies(data.dependencies);
      setCanStart(data.canStart);
    } catch (error: any) {
      error(error.response?.data?.message || 'Failed to load dependencies');
    } finally {
      setLoading(false);
    }
  };

  const loadDependents = async () => {
    try {
      const data = await dependencyService.getDependents(taskId);
      setDependents(data);
    } catch (error: any) {
      console.error('Failed to load dependents:', error);
    }
  };

  const searchTasks = async () => {
    if (!searchQuery.trim()) {
      setAvailableTasks([]);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await taskService.getAllTasks({ search: searchQuery, limit: 20 });
      const tasks = response.tasks;
      // Filter out current task and already added dependencies
      const filtered = tasks.filter(
        (t: Task) => t._id !== taskId && !dependencies.some((d) => d._id === t._id)
      );
      setAvailableTasks(filtered);
    } catch (searchError: any) {
      error(searchError.response?.data?.message || 'Failed to search tasks');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddDependency = async (dependencyId: string) => {
    try {
      await dependencyService.addDependency(taskId, dependencyId);
      success('Dependency added successfully');
      setShowAddModal(false);
      setSearchQuery('');
      setAvailableTasks([]);
      loadDependencies();
    } catch (addError: any) {
      error(addError.response?.data?.message || 'Failed to add dependency');
    }
  };

  const handleRemoveDependency = async (dependencyId: string) => {
    if (!confirm('Are you sure you want to remove this dependency?')) return;

    try {
      await dependencyService.removeDependency(taskId, dependencyId);
      success('Dependency removed successfully');
      loadDependencies();
    } catch (removeError: any) {
      error(removeError.response?.data?.message || 'Failed to remove dependency');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      Pending: 'bg-muted text-muted-foreground',
      'In Progress': 'bg-amber-500/15 text-amber-400',
      Completed: 'bg-emerald-500/15 text-emerald-400',
      Archived: 'bg-gray-100 text-gray-800 dark:bg-gray-800 '
    };
    return colors[status as keyof typeof colors] || colors.Pending;
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      Low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 ',
      Medium: 'bg-amber-500/10 text-amber-400',
      High: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[priority as keyof typeof colors] || colors.Medium;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Blocking Status Alert */}
      {dependencies.length > 0 && !canStart && (
        <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-500 mr-3 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-400">
                Task is Blocked
              </h4>
              <p className="text-sm text-foreground/70 mt-1">
                This task cannot be started until all dependencies are completed.
              </p>
            </div>
          </div>
        </div>
      )}

      {dependencies.length > 0 && canStart && (
        <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4">
          <div className="flex items-start">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-emerald-400">
                Ready to Start
              </h4>
              <p className="text-sm text-foreground/70 mt-1">
                All dependencies have been completed. This task can be started.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dependencies Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <GitBranch className="w-5 h-5 mr-2" />
            Dependencies ({dependencies.length})
          </h3>
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Dependency
          </Button>
        </div>

        {dependencies.length === 0 ? (
          <div className="text-center py-8 bg-muted/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
            <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              No dependencies added yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dependencies.map((dep) => (
              <div
                key={dep._id}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {dep.isBlocking ? (
                        <Clock className="w-4 h-4 text-amber-400" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                      <h4 className="font-medium text-foreground">
                        {dep.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(dep.status)}`}>
                        {dep.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(dep.priority)}`}>
                        {dep.priority}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Due: {new Date(dep.dueDate).toLocaleDateString()}
                      </span>
                      {dep.isBlocking && (
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          Blocking
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveDependency(dep._id)}
                    className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dependent Tasks Section */}
      {dependents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Link className="w-5 h-5 mr-2" />
            Dependent Tasks ({dependents.length})
          </h3>
          <div className="bg-muted/50 border border-border rounded-xl p-4">
            <p className="text-sm text-foreground/80 mb-3">
              These tasks are waiting for this task to be completed:
            </p>
            <div className="space-y-2">
              {dependents.map((dep) => (
                <div
                  key={dep._id}
                  className="bg-muted/50 rounded-lg p-3 flex items-center justify-between"
                >
                  <span className="font-medium text-foreground">{dep.title}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(dep.status)}`}>
                      {dep.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Dependency Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Add Dependency
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSearchQuery('');
                    setAvailableTasks([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Search for a task that must be completed before this task can start
              </p>
            </div>

            <div className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchTasks()}
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:border-amber-500 dark:bg-gray-700 "
                />
              </div>
              <Button onClick={searchTasks} className="mt-3 w-full" disabled={searchLoading}>
                {searchLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pt-0">
              {availableTasks.length === 0 && searchQuery ? (
                <p className="text-center text-muted-foreground py-8">
                  No tasks found
                </p>
              ) : (
                <div className="space-y-3">
                  {availableTasks.map((task) => (
                    <div
                      key={task._id}
                      className="rounded-lg p-4 hover:bg-muted cursor-pointer transition-colors border border-transparent hover:border-border"
                      onClick={() => handleAddDependency(task._id)}
                    >
                      <h4 className="font-medium text-foreground mb-2">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(task.status)}`}>
                          {task.status}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {task.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDependencies;
