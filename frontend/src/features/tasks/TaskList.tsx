import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Edit
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import taskService, { Task } from '@/services/taskService';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [filtersVisible, setFiltersVisible] = useState(false);

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
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
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
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
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
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
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
          <p className="text-gray-500 dark:text-gray-400">Manage and organize your tasks</p>
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

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Search className="h-5 w-5 text-gray-500" />
            </span>
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300"
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
              className="appearance-none pl-4 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300"
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
        {filtersVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
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
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-1">No tasks found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
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
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTasks.map((task) => (
              <TaskItem key={task._id} task={task} onDelete={handleDeleteTask} />
            ))}
          </div>
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
      className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
        active
          ? 'bg-primary text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
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
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete }) => {
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
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
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
        return { icon: <AlertCircle className="h-4 w-4 text-blue-500" />, label: 'In Progress' };
      case 'completed':
        return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, label: 'Completed' };
      case 'archived':
        return { icon: <CheckCircle className="h-4 w-4 text-gray-500" />, label: 'Archived' };
      default:
        return { icon: <Clock className="h-4 w-4 text-gray-500" />, label: status };
    }
  };

  const statusInfo = getStatusInfo(task.status);

  return (
    <div className="relative p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
      <div className="flex items-start">
        {/* Checkbox Button */}
        <button className="mt-1 mr-3 text-gray-400 hover:text-green-500">
          <CheckCircle className="h-5 w-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h3 className="text-base font-medium truncate">{task.title}</h3>
            <span className={`ml-3 h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}></span>
          </div>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{task.description}</p>

          <div className="mt-2 flex items-center flex-wrap gap-2">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
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
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg z-10 transition-all duration-300">
              <div className="py-1">
                <Link
                  to={`/dashboard/tasks/${task._id}/edit`}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  <div className="flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Task
                  </div>
                </Link >
                <button
                  onClick={() => onDelete(task._id)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
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