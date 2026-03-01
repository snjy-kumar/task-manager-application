import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Filter,
  Search,
  Plus,
  MoreVertical,
  ChevronDown,
  Calendar,
  Clock,
  AlertCircle,
  Trash,
  Edit,
  CheckSquare,
  Square,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import taskService, { Task } from '@/services/taskService';
import { useToast } from '@/components/ui/Toast';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const toast = useToast();

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await taskService.getAllTasks();
      setTasks(response.tasks || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map(task => task._id));
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`)) return;

    try {
      setBulkActionLoading(true);
      await Promise.all(selectedTasks.map(taskId => taskService.deleteTask(taskId)));
      setTasks(tasks.filter(task => !selectedTasks.includes(task._id)));
      setSelectedTasks([]);
      toast.success(`${selectedTasks.length} tasks deleted successfully`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete tasks');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkStatusChange = async (status: string) => {
    try {
      setBulkActionLoading(true);
      const updates = selectedTasks.map(taskId => ({ taskId, updates: { status } }));
      await taskService.bulkUpdate(selectedTasks, { status });

      // Update local state
      setTasks(tasks.map(task =>
        selectedTasks.includes(task._id) ? { ...task, status: status as Task['status'] } : task
      ));
      setSelectedTasks([]);
      toast.success(`${selectedTasks.length} tasks updated successfully`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update tasks');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkPriorityChange = async (priority: string) => {
    try {
      setBulkActionLoading(true);
      const updates = selectedTasks.map(taskId => ({ taskId, updates: { priority } }));
      await taskService.bulkUpdate(selectedTasks, { priority });

      // Update local state
      setTasks(tasks.map(task =>
        selectedTasks.includes(task._id) ? { ...task, priority: priority as Task['priority'] } : task
      ));
      setSelectedTasks([]);
      toast.success(`${selectedTasks.length} tasks updated successfully`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update tasks');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedTasks([]);
  };

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    // Search filter
    const matchesSearch =
      searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === 'all' ||
      task.status.toLowerCase().replace(' ', '-') === statusFilter;

    // Priority filter
    const matchesPriority =
      priorityFilter === 'all' ||
      task.priority.toLowerCase() === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  }).sort((a, b) => {
    // Sort by selected criteria
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'priority':
        const priorityOrder = { High: 0, Medium: 1, Low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-medium mb-1">Error Loading Tasks</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchTasks}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground">Manage and organize your tasks</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link to="/dashboard/tasks/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Link>
          </Button>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      <AnimatePresence>
      {selectedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-amber-500/10 border-2 border-amber-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={clearSelection}
                className="h-8"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Status Change Dropdown */}
              <select
                className="px-3 py-1.5 text-sm border border-border rounded-lg bg-card transition-all duration-300"
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkStatusChange(e.target.value);
                    e.target.value = '';
                  }
                }}
                disabled={bulkActionLoading}
                defaultValue=""
              >
                <option value="" disabled>Change Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              {/* Priority Change Dropdown */}
              <select
                className="px-3 py-1.5 text-sm border border-border rounded-lg bg-card transition-all duration-300"
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkPriorityChange(e.target.value);
                    e.target.value = '';
                  }
                }}
                disabled={bulkActionLoading}
                defaultValue=""
              >
                <option value="" disabled>Change Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              {/* Delete Button */}
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={bulkActionLoading}
                className="h-8"
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Search and Filter Bar */}
      <div className="bg-card rounded-xl shadow-sm p-4 border border-border transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Search className="h-5 w-5 text-gray-500" />
            </span>
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 w-full border border-border rounded-lg bg-card text-foreground transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Toggle Button */}
          <Button
            variant="outline"
            onClick={() => setFiltersVisible(!filtersVisible)}
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown className={`h - 4 w - 4 ml - 2 transition - transform ${filtersVisible ? 'rotate-180' : ''} `} />
          </Button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              className="appearance-none pl-4 pr-8 py-2 border border-border rounded-lg bg-card text-foreground transition-all duration-300"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
        {filtersVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Status</label>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  label="All"
                  active={statusFilter === 'all'}
                  onClick={() => setStatusFilter('all')}
                />
                <FilterButton
                  label="To Do"
                  active={statusFilter === 'todo'}
                  onClick={() => setStatusFilter('todo')}
                />
                <FilterButton
                  label="In Progress"
                  active={statusFilter === 'in-progress'}
                  onClick={() => setStatusFilter('in-progress')}
                />
                <FilterButton
                  label="Completed"
                  active={statusFilter === 'completed'}
                  onClick={() => setStatusFilter('completed')}
                />
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">Priority</label>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  label="All"
                  active={priorityFilter === 'all'}
                  onClick={() => setPriorityFilter('all')}
                />
                <FilterButton
                  label="High"
                  active={priorityFilter === 'high'}
                  onClick={() => setPriorityFilter('high')}
                />
                <FilterButton
                  label="Medium"
                  active={priorityFilter === 'medium'}
                  onClick={() => setPriorityFilter('medium')}
                />
                <FilterButton
                  label="Low"
                  active={priorityFilter === 'low'}
                  onClick={() => setPriorityFilter('low')}
                />
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* Task List */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-1">No tasks found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Create your first task to get started.'}
            </p>
            <Button asChild>
              <Link to="/dashboard/tasks/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Select All Header */}
            <div className="p-4 border-b border-border bg-muted/30/50">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-amber-500 transition-colors"
              >
                {selectedTasks.length === filteredTasks.length ? (
                  <CheckSquare className="h-5 w-5 text-amber-500" />
                ) : (
                  <Square className="h-5 w-5" />
                )}
                Select All ({filteredTasks.length})
              </button>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onDelete={handleDeleteTask}
                  isSelected={selectedTasks.includes(task._id)}
                  onToggleSelect={toggleTaskSelection}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Filter Button Component
interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${active
        ? 'bg-amber-500 text-white'
        : 'bg-muted text-foreground hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
    >
      {label}
    </button>
  );
};

// Task Item Component
interface TaskItemProps {
  task: Task;
  onDelete: (taskId: string) => void;
  isSelected: boolean;
  onToggleSelect: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, isSelected, onToggleSelect }) => {
  const [actionsOpen, setActionsOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-emerald-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusInfo = (status: string) => {
    const normalizedStatus = status.toLowerCase().replace(' ', '-');
    switch (normalizedStatus) {
      case 'pending':
        return { icon: <Clock className="h-4 w-4 text-gray-500" />, label: 'Pending' };
      case 'in-progress':
        return { icon: <AlertCircle className="h-4 w-4 text-amber-400" />, label: 'In Progress' };
      case 'completed':
        return { icon: <CheckCircle className="h-4 w-4 text-emerald-400" />, label: 'Completed' };
      case 'archived':
        return { icon: <CheckCircle className="h-4 w-4 text-gray-500" />, label: 'Archived' };
      default:
        return { icon: <Clock className="h-4 w-4 text-gray-500" />, label: status };
    }
  };

  const statusInfo = getStatusInfo(task.status);

  return (
    <div className={`relative p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 ${isSelected ? 'bg-amber-500/5 dark:bg-amber-500/10' : ''}`}>
      <div className="flex items-start">
        {/* Selection Checkbox */}
        <button
          onClick={() => onToggleSelect(task._id)}
          className="mt-1 mr-3 text-gray-400 hover:text-amber-500 transition-colors"
        >
          {isSelected ? (
            <CheckSquare className="h-5 w-5 text-amber-500" />
          ) : (
            <Square className="h-5 w-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h3 className="text-base font-medium truncate">{task.title}</h3>
            <span className={`ml-3 h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}></span>
          </div>

          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{task.description}</p>

          <div className="mt-2 flex items-center flex-wrap gap-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(task.dueDate)}</span>
            </div>

            <div className="flex items-center text-xs">
              {statusInfo.icon}
              <span className="ml-1">{statusInfo.label}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="relative ml-2">
          <button
            onClick={() => setActionsOpen(!actionsOpen)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>

          {actionsOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-xl shadow-sm z-10 transition-all duration-300">
              <div className="py-1">
                <Link
                  to={`/dashboard/tasks/${task._id}/edit`}
                  className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted transition-all duration-300"
                >
                  <div className="flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Task
                  </div>
                </Link >
                <button
                  onClick={() => onDelete(task._id)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-muted transition-all duration-300"
                >
                  <div className="flex items-center">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </div>
                </button>
              </div >
            </div >
          )}
        </div >
      </div >
    </div >
  );
};

export default TaskList; 