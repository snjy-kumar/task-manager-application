import { useState, useEffect } from 'react';
import {
  ChevronRight,
  Zap,
  Calendar,
  BarChart3,
  Sparkles,
  Target,
  ListTodo,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BentoGrid from '@/components/ui/bento/BentoGrid';
import BentoCard from '@/components/ui/bento/BentoCard';
import taskService, { Task } from '@/services/taskService';
import { useAuth } from '@/context/AuthContext';

interface DashboardStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  overdue: number;
  completionRate: number;
}

const DashboardHome = () => {
  const { user } = useAuth();
  const [_tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await taskService.getAllTasks();
      const taskList = response.tasks || [];
      setTasks(taskList);
      calculateStats(taskList);
      filterTasks(taskList);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (taskList: Task[]) => {
    const now = new Date();
    const completed = taskList.filter(t => t.status === 'Completed').length;
    const inProgress = taskList.filter(t => t.status === 'In Progress').length;
    const pending = taskList.filter(t => t.status === 'Pending').length;
    const overdue = taskList.filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate < now && t.status !== 'Completed';
    }).length;

    const completionRate = taskList.length > 0
      ? Math.round((completed / taskList.length) * 100)
      : 0;

    setStats({
      total: taskList.length,
      completed,
      inProgress,
      pending,
      overdue,
      completionRate
    });
  };

  const filterTasks = (taskList: Task[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Tasks due today
    const todayTasks = taskList.filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate >= today && dueDate < tomorrow && t.status !== 'Completed';
    }).slice(0, 5);

    // Upcoming tasks (next 7 days, excluding today)
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcoming = taskList.filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate >= tomorrow && dueDate <= nextWeek && t.status !== 'Completed';
    }).slice(0, 5);

    setTodaysTasks(todayTasks);
    setUpcomingTasks(upcoming);
  };

  const getPriorityBadgeColor = (priority: string) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays < 7) return `In ${diffDays} days`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {stats.total === 0
              ? "You have no tasks yet. Start by creating one!"
              : `You have ${stats.pending + stats.inProgress} active tasks today.`
            }
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" onClick={fetchDashboardData} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button asChild>
            <Link to="/dashboard/tasks/new">
              Create New Task
            </Link>
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

      {/* Primary Bento Grid */}
      <BentoGrid cols={4} gap="md">
        {/* Task Overview */}
        <BentoCard
          title="Task Overview"
          icon={<ListTodo className="h-5 w-5" />}
          size="md"
          gradient
          gradientFrom="from-blue-600/20"
          gradientTo="to-emerald-600/20"
        >
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white dark:bg-gray-800 p-4 text-center shadow-sm">
              <span className="text-3xl font-bold text-green-600">{stats.completed}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 p-4 text-center shadow-sm">
              <span className="text-3xl font-bold text-blue-600">{stats.inProgress}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">In Progress</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 p-4 text-center shadow-sm">
              <span className="text-3xl font-bold text-yellow-600">{stats.pending}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 p-4 text-center shadow-sm">
              <span className="text-3xl font-bold text-red-600">{stats.overdue}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Overdue</p>
            </div>
          </div>
        </BentoCard>

        {/* Completion Rate */}
        <BentoCard
          title="Completion Rate"
          icon={<Target className="h-5 w-5" />}
          size="sm"
        >
          <div className="mt-2 flex justify-center">
            <div className="relative h-24 w-24">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{stats.completionRate}%</span>
              </div>
              <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeOpacity="0.1"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * stats.completionRate) / 100}
                  className="text-primary transition-all duration-500"
                />
              </svg>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-3">
            {stats.completed} of {stats.total} tasks
          </p>
        </BentoCard>

        {/* Calendar Snapshot */}
        <BentoCard
          title="Calendar"
          icon={<Calendar className="h-5 w-5" />}
          size="sm"
        >
          <div className="mt-2 flex justify-center">
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <div className="text-xs uppercase font-bold text-gray-500">Today</div>
              <div className="text-4xl font-bold">{new Date().getDate()}</div>
              <div className="text-xs">{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            {todaysTasks.slice(0, 2).map(task => (
              <div key={task._id} className="flex justify-between items-center px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-xs">
                <span className="truncate">{task.title}</span>
                <span className={`h-2 w-2 rounded-full ${getPriorityBadgeColor(task.priority)}`}></span>
              </div>
            ))}
            {todaysTasks.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-2">No tasks due today</p>
            )}
          </div>
        </BentoCard>

        {/* Quick Stats */}
        <BentoCard
          title="Total Tasks"
          icon={<BarChart3 className="h-5 w-5" />}
          size="sm"
        >
          <div className="mt-4 text-center">
            <div className="text-5xl font-bold text-primary">{stats.total}</div>
            <p className="text-sm text-gray-500 mt-2">All time</p>
          </div>
          <div className="mt-4 flex items-center justify-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">
              {stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}%` : '0%'} done
            </span>
          </div>
        </BentoCard>

        {/* Today's Tasks */}
        <BentoCard
          title="Today's Tasks"
          icon={<ListTodo className="h-5 w-5" />}
          size="lg"
        >
          <div className="space-y-2 mt-3">
            {todaysTasks.length > 0 ? (
              todaysTasks.map((task) => (
                <Link
                  key={task._id}
                  to={`/dashboard/tasks/${task._id}/edit`}
                  className="block"
                >
                  <div className="flex items-center p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className={`h-2 w-2 rounded-full ${getPriorityBadgeColor(task.priority)}`}></span>
                        <span className="text-xs text-gray-500">{task.priority} priority</span>
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
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No tasks due today!</p>
                <p className="text-xs text-gray-400 mt-1">Enjoy your day 🎉</p>
              </div>
            )}
          </div>
          <Button variant="outline" className="w-full mt-3" asChild>
            <Link to="/dashboard/tasks">
              View All Tasks
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </BentoCard>

        {/* Upcoming Tasks */}
        <BentoCard
          title="Upcoming This Week"
          icon={<Clock className="h-5 w-5" />}
          size="md"
          gradient
          gradientFrom="from-purple-600/20"
          gradientTo="to-pink-600/20"
        >
          <div className="space-y-2 mt-3">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <p className="text-xs text-gray-500">{formatDate(task.dueDate)}</p>
                  </div>
                  <span className={`h-2 w-2 rounded-full ${getPriorityBadgeColor(task.priority)}`}></span>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No upcoming tasks</p>
              </div>
            )}
          </div>
        </BentoCard>

        {/* AI Suggestions */}
        <BentoCard
          title="Smart Insights"
          icon={<Sparkles className="h-5 w-5" />}
          size="md"
          gradient
          gradientFrom="from-blue-600/20"
          gradientTo="to-blue-400/20"
        >
          <div className="space-y-3 mt-3">
            {stats.overdue > 0 && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  You have {stats.overdue} overdue task{stats.overdue > 1 ? 's' : ''}. Consider prioritizing them.
                </p>
              </div>
            )}

            {stats.inProgress > 5 && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <Zap className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  You have {stats.inProgress} tasks in progress. Focus on completing a few before starting new ones.
                </p>
              </div>
            )}

            {stats.completionRate >= 80 && stats.total > 0 && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  Great job! You've completed {stats.completionRate}% of your tasks. Keep it up!
                </p>
              </div>
            )}

            {stats.total === 0 && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <Sparkles className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Start organizing your day by creating your first task!
                </p>
              </div>
            )}
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
};

export default DashboardHome;