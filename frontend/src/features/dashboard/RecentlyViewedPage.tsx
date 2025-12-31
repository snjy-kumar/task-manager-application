import { useState, useEffect } from 'react';
import {
  Clock,
  ChevronRight,
  Calendar,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BentoGrid from '@/components/ui/bento/BentoGrid';
import BentoCard from '@/components/ui/bento/BentoCard';
import taskService, { Task } from '@/services/taskService';

const RecentlyViewedPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [recentlyCreated, setRecentlyCreated] = useState<Task[]>([]);
  const [recentlyCompleted, setRecentlyCompleted] = useState<Task[]>([]);

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
      processRecentTasks(taskList);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const processRecentTasks = (taskList: Task[]) => {
    // Sort by updatedAt or createdAt (most recent first)
    const sortedByUpdate = [...taskList].sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt);
      const dateB = new Date(b.updatedAt || b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    // Recently created (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const created = taskList
      .filter(t => new Date(t.createdAt) >= weekAgo)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Recently completed
    const completed = taskList
      .filter(t => t.status === 'Completed')
      .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());

    setRecentTasks(sortedByUpdate);
    setRecentlyCreated(created);
    setRecentlyCompleted(completed);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600';
      case 'In Progress': return 'text-blue-600';
      case 'Pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Loading recent activity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Recent Activity</h1>
          <p className="text-gray-500 dark:text-gray-400">Your recently created and modified tasks</p>
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

      {/* Recent Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentTasks.slice(0, 9).map((task) => (
          <Link
            key={task._id}
            to={`/dashboard/tasks/${task._id}/edit`}
            className="block"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium truncate">{task.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                    <div className="flex items-center mt-2">
                      <Clock className="h-3 w-3 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">{formatTimeAgo(task.updatedAt || task.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <span className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}></span>
                    <span className={`text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {recentTasks.length === 0 && !loading && (
        <div className="text-center py-12">
          <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No recent activity</p>
          <Button className="mt-4" asChild>
            <Link to="/dashboard/tasks/new">Create Your First Task</Link>
          </Button>
        </div>
      )}

      {/* Additional Sections */}
      <BentoGrid cols={3} gap="md">
        {/* Recently Created */}
        <BentoCard
          title="Recently Created"
          icon={<TrendingUp className="h-5 w-5" />}
          size="md"
          gradient
          gradientFrom="from-green-600/20"
          gradientTo="to-emerald-600/20"
        >
          <div className="space-y-2 mt-2">
            {recentlyCreated.length > 0 ? (
              recentlyCreated.slice(0, 5).map((task) => (
                <Link
                  key={task._id}
                  to={`/dashboard/tasks/${task._id}/edit`}
                  className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <p className="text-xs text-gray-500">{formatTimeAgo(task.createdAt)}</p>
                    </div>
                    <span className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)} mt-1.5 ml-2`}></span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No recent tasks</p>
              </div>
            )}
          </div>
        </BentoCard>

        {/* Recently Completed */}
        <BentoCard
          title="Recently Completed"
          icon={<CheckCircle2 className="h-5 w-5" />}
          size="md"
        >
          <div className="space-y-2 mt-2">
            {recentlyCompleted.length > 0 ? (
              recentlyCompleted.slice(0, 5).map((task) => (
                <Link
                  key={task._id}
                  to={`/dashboard/tasks/${task._id}/edit`}
                  className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate line-through text-gray-500">{task.title}</p>
                      <p className="text-xs text-gray-500">{formatTimeAgo(task.updatedAt || task.createdAt)}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No completed tasks</p>
              </div>
            )}
          </div>
        </BentoCard>

        {/* Activity Timeline */}
        <BentoCard
          title="Activity Summary"
          icon={<Calendar className="h-5 w-5" />}
          size="md"
        >
          <div className="space-y-3 mt-3">
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <span className="text-sm font-medium">Total Tasks</span>
              <span className="text-lg font-bold text-primary">{tasks.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <span className="text-sm font-medium">Created This Week</span>
              <span className="text-lg font-bold text-green-600">{recentlyCreated.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <span className="text-sm font-medium">Recently Completed</span>
              <span className="text-lg font-bold text-blue-600">{recentlyCompleted.length}</span>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
};

export default RecentlyViewedPage;
