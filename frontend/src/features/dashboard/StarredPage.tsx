import { useState, useEffect } from 'react';
import {
  Star,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BentoGrid from '@/components/ui/bento/BentoGrid';
import BentoCard from '@/components/ui/bento/BentoCard';
import taskService from '@/services/taskService';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Archived';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  createdAt: string;
}

const StarredPage = () => {
  const [_tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [highPriorityTasks, setHighPriorityTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await taskService.getAllTasks();
      const taskList = response.tasks || [];
      setTasks(taskList);
      filterTasks(taskList);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = (taskList: Task[]) => {
    // High priority tasks (not completed)
    const highPriority = taskList.filter(t =>
      t.priority === 'High' && t.status !== 'Completed'
    );

    // Upcoming tasks (next 7 days, not completed)
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcoming = taskList.filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate >= now && dueDate <= nextWeek && t.status !== 'Completed';
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    // In progress tasks
    const inProgress = taskList.filter(t => t.status === 'In Progress');

    setHighPriorityTasks(highPriority);
    setUpcomingTasks(upcoming);
    setInProgressTasks(inProgress);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Overdue';
    if (diffDays < 7) return `In ${diffDays} days`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Loading important tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Important Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400">Your high-priority and upcoming tasks</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" onClick={fetchTasks} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button asChild>
            <Link to="/dashboard/tasks/new">Create Task</Link>
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Bento Grid Layout */}
      <BentoGrid cols={3} gap="md">
        {/* High Priority Tasks */}
        <BentoCard
          title="High Priority"
          icon={<Star className="h-5 w-5 text-red-500" />}
          size="lg"
          gradient
          gradientFrom="from-red-600/20"
          gradientTo="to-orange-600/20"
        >
          <div className="space-y-3 mt-3">
            {highPriorityTasks.length > 0 ? (
              highPriorityTasks.slice(0, 8).map((task) => (
                <Link
                  key={task._id}
                  to={`/dashboard/tasks/${task._id}/edit`}
                  className="block"
                >
                  <div className="flex items-center p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-red-500 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}></span>
                        <span className="text-xs text-gray-500">{formatDate(task.dueDate)}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{task.status}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No high-priority tasks</p>
              </div>
            )}
          </div>
          {highPriorityTasks.length > 0 && (
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/dashboard/tasks">
                View All Tasks
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}
        </BentoCard>

        {/* Upcoming This Week */}
        <BentoCard
          title="Due This Week"
          icon={<Calendar className="h-5 w-5" />}
          size="md"
          gradient
          gradientFrom="from-blue-600/20"
          gradientTo="to-purple-600/20"
        >
          <div className="space-y-2 mt-3">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.slice(0, 6).map((task) => (
                <Link
                  key={task._id}
                  to={`/dashboard/tasks/${task._id}/edit`}
                  className="block"
                >
                  <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{formatDate(task.dueDate)}</span>
                      <span className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}></span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-6">
                <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Nothing due this week</p>
              </div>
            )}
          </div>
        </BentoCard>

        {/* In Progress */}
        <BentoCard
          title="In Progress"
          icon={<TrendingUp className="h-5 w-5" />}
          size="md"
        >
          <div className="space-y-2 mt-3">
            {inProgressTasks.length > 0 ? (
              inProgressTasks.slice(0, 6).map((task) => (
                <Link
                  key={task._id}
                  to={`/dashboard/tasks/${task._id}/edit`}
                  className="block"
                >
                  <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{formatDate(task.dueDate)}</span>
                      <span className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}></span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-6">
                <Clock className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No tasks in progress</p>
              </div>
            )}
          </div>
        </BentoCard>

        {/* Stats Card */}
        <BentoCard
          title="Summary"
          icon={<Star className="h-5 w-5" />}
          size="full"
        >
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-3xl font-bold text-red-600">{highPriorityTasks.length}</div>
              <div className="text-xs text-gray-500 mt-1">High Priority</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{upcomingTasks.length}</div>
              <div className="text-xs text-gray-500 mt-1">Due This Week</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{inProgressTasks.length}</div>
              <div className="text-xs text-gray-500 mt-1">In Progress</div>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
};

export default StarredPage;
