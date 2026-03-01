import React, { useEffect, useState } from 'react';
import {
  Clock,
  Calendar,
  ChevronRight,
  CheckCircle,
  Filter,
  Plus,
  User,
  ArrowUp,
  ArrowDown,
  ListFilter,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import taskService, { Task } from '@/services/taskService';
import { useToast } from '@/components/ui/Toast';
import { getPriorityColor, getStatusColor, getPriorityOrder } from '@/lib/taskUtils';
import { formatDueDate, getDaysUntilDue, isToday, isTomorrow } from '@/lib/dateUtils';

const PersonalTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'category'>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { showToast } = useToast();

  useEffect(() => {
    fetchPersonalTasks();
  }, []);

  const fetchPersonalTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllTasks({ limit: 100 });
      // Filter for personal tasks (tasks with 'Personal' category or 'personal' tag)
      const personalTasks = response.tasks.filter(
        task => task.category === 'Personal' || task.tags?.some(tag => tag.toLowerCase() === 'personal')
      );
      setTasks(personalTasks);
    } catch (error) {
      console.error('Failed to fetch personal tasks:', error);
      showToast('Failed to load personal tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
      await taskService.updateTask(taskId, { status: newStatus });
      setTasks(tasks.map(task =>
        task._id === taskId ? { ...task, status: newStatus as Task['status'] } : task
      ));
      showToast(`Task ${newStatus === 'Completed' ? 'completed' : 'reopened'}`, 'success');
    } catch (error) {
      console.error('Failed to update task:', error);
      showToast('Failed to update task', 'error');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return task.status !== 'Completed';
    if (filter === 'completed') return task.status === 'Completed';
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const aValue = getPriorityOrder(a.priority);
      const bValue = getPriorityOrder(b.priority);
      return sortDirection === 'desc' ? bValue - aValue : aValue - bValue;
    }
    if (sortBy === 'dueDate') {
      const aDate = new Date(a.dueDate).getTime();
      const bDate = new Date(b.dueDate).getTime();
      return sortDirection === 'desc' ? bDate - aDate : aDate - bDate;
    }
    if (sortBy === 'category') {
      const aCategory = a.category || '';
      const bCategory = b.category || '';
      return sortDirection === 'desc'
        ? bCategory.localeCompare(aCategory)
        : aCategory.localeCompare(bCategory);
    }
    return 0;
  });

  // Generate category stats from actual tasks
  const categoryStats = React.useMemo(() => {
    const stats: Record<string, number> = {};
    tasks.forEach(task => {
      if (task.category) {
        stats[task.category] = (stats[task.category] || 0) + 1;
      }
      // Also count from tags
      task.tags?.forEach(tag => {
        if (tag !== 'personal' && tag !== 'Personal') {
          const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
          stats[capitalizedTag] = (stats[capitalizedTag] || 0) + 1;
        }
      });
    });
    return Object.entries(stats).map(([name, count]) => ({ name, count }));
  }, [tasks]);

  // Generate upcoming date stats
  const upcomingStats = React.useMemo(() => {
    const today = new Date();
    const stats = {
      today: 0,
      tomorrow: 0,
      thisWeek: 0,
      later: 0
    };

    tasks.forEach(task => {
      if (task.status === 'Completed') return;
      const dueDate = new Date(task.dueDate);
      const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntil === 0) stats.today++;
      else if (daysUntil === 1) stats.tomorrow++;
      else if (daysUntil > 1 && daysUntil <= 7) stats.thisWeek++;
      else if (daysUntil > 7) stats.later++;
    });

    return [
      { label: 'Today', count: stats.today, day: today.getDate() },
      { label: 'Tomorrow', count: stats.tomorrow, day: today.getDate() + 1 },
      { label: 'This Week', count: stats.thisWeek, day: today.getDate() + 3 },
      { label: 'Later', count: stats.later, day: today.getDate() + 7 },
    ].filter(item => item.count > 0);
  }, [tasks]);

  const handleSortChange = (newSortBy: 'priority' | 'dueDate' | 'category') => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Personal Tasks</h1>
          <p className="text-muted-foreground">Manage your personal to-dos and errands</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" size="sm" className="transition-all duration-300">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button size="sm" asChild className="transition-all duration-300">
            <Link to="/dashboard/tasks/new">
              <Plus className="h-4 w-4 mr-2" /> Add Task
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${filter === 'all' ? 'bg-card shadow-sm' : 'text-muted-foreground'
            }`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${filter === 'active' ? 'bg-card shadow-sm' : 'text-muted-foreground'
            }`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${filter === 'completed' ? 'bg-card shadow-sm' : 'text-muted-foreground'
            }`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center space-x-4 text-sm">
        <span className="text-gray-500">Sort by:</span>
        <button
          className={`flex items-center transition-all duration-300 ${sortBy === 'priority' ? 'text-foreground font-medium' : ''}`}
          onClick={() => handleSortChange('priority')}
        >
          Priority
          {sortBy === 'priority' && (
            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
          )}
        </button>
        <button
          className={`flex items-center transition-all duration-300 ${sortBy === 'dueDate' ? 'text-foreground font-medium' : ''}`}
          onClick={() => handleSortChange('dueDate')}
        >
          Due Date
          {sortBy === 'dueDate' && (
            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
          )}
        </button>
        <button
          className={`flex items-center transition-all duration-300 ${sortBy === 'category' ? 'text-foreground font-medium' : ''}`}
          onClick={() => handleSortChange('category')}
        >
          Category
          {sortBy === 'category' && (
            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
          )}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {/* Main Content */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tasks List */}
          <div className="lg:col-span-3 space-y-4">
            {sortedTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={handleTaskToggle}
              />
            ))}

            {sortedTasks.length === 0 && (
              <div className="bg-card rounded-xl shadow-sm p-8 text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                <p className="text-muted-foreground mb-4">
                  {filter === 'completed'
                    ? "You haven't completed any personal tasks yet."
                    : "You don't have any personal tasks. Create one to get started."}
                </p>
                <Button asChild className="transition-all duration-300">
                  <Link to="/dashboard/tasks/new">
                    <Plus className="h-4 w-4 mr-2" /> Add New Task
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            {categoryStats.length > 0 && (
              <div className="bg-card rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categoryStats.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full bg-gray-400 dark:bg-gray-600 mr-2"></span>
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-xs bg-muted rounded-full px-2 py-0.5">
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Dates */}
            {upcomingStats.length > 0 && (
              <div className="bg-card rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-medium mb-3">Upcoming</h3>
                <div className="space-y-3">
                  {upcomingStats.map((item) => (
                    <div key={item.label} className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center mr-3">
                        <span className="font-medium">{item.day}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.count} task{item.count !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-card rounded-xl shadow-sm p-4">
              <h3 className="text-lg font-medium mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start transition-all duration-300">
                  <Calendar className="h-4 w-4 mr-2" /> View in Calendar
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start transition-all duration-300">
                  <ListFilter className="h-4 w-4 mr-2" /> Group by Category
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start transition-all duration-300">
                  <User className="h-4 w-4 mr-2" /> Assign to Someone
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Task Item Component
interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string, currentStatus: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
  const isCompleted = task.status === 'Completed';
  const priorityColorClass = getPriorityColor(task.priority);
  const statusColorClass = getStatusColor(task.status);

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${isCompleted
      ? 'bg-muted/50 border-border'
      : 'bg-card border-border'
      }`}>
      <div className="flex items-center min-w-0">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggle(task._id, task.status)}
          className="h-5 w-5 text-muted-foreground rounded border-gray-300 focus:ring-gray-500 mr-3 cursor-pointer"
        />
        <div className="min-w-0">
          <h3 className={`text-sm font-medium truncate ${isCompleted ? 'text-muted-foreground line-through' : ''
            }`}>
            {task.title}
          </h3>
          <div className="flex items-center mt-1 space-x-2 text-xs text-gray-500">
            <span className={`h-2 w-2 rounded-full ${priorityColorClass}`}></span>
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatDueDate(task.dueDate, task.status).text}
            </span>
            {task.category && (
              <span className="px-1.5 py-0.5 rounded bg-muted text-foreground">
                {task.category}
              </span>
            )}
            {task.isOverdue && !isCompleted && (
              <span className="px-1.5 py-0.5 rounded bg-red-500/10 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                Overdue
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center ml-4">
        <Link
          to={`/dashboard/tasks/${task._id}`}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default PersonalTasksPage;
