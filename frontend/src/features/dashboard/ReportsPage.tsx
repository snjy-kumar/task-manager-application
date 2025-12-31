import { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import BentoGrid from '@/components/ui/bento/BentoGrid';
import BentoCard from '@/components/ui/bento/BentoCard';
import taskService from '@/services/taskService';

interface Task {
  _id: string;
  title: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Archived';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  createdAt: string;
}

interface Stats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  overdue: number;
  completionRate: number;
  byPriority: { high: number; medium: number; low: number };
}

const ReportsPage = () => {
  const [_tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<Stats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0,
    byPriority: { high: 0, medium: 0, low: 0 }
  });

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
      calculateStats(taskList);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tasks');
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

    const high = taskList.filter(t => t.priority === 'High').length;
    const medium = taskList.filter(t => t.priority === 'Medium').length;
    const low = taskList.filter(t => t.priority === 'Low').length;

    const completionRate = taskList.length > 0
      ? Math.round((completed / taskList.length) * 100)
      : 0;

    setStats({
      total: taskList.length,
      completed,
      inProgress,
      pending,
      overdue,
      completionRate,
      byPriority: { high, medium, low }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">Insights about your task productivity</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Button variant="outline" onClick={fetchTasks}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Report Visualizations */}
      <BentoGrid cols={4} gap="md">
        {/* Completion Rate */}
        <BentoCard
          title="Completion Rate"
          icon={<BarChart3 className="h-5 w-5" />}
          size="md"
          gradient
          gradientFrom="from-blue-600/20"
          gradientTo="to-emerald-600/20"
        >
          <div className="mt-4 flex flex-col items-center">
            <div className="relative h-32 w-32">
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-bold">{stats.completionRate}</span>
                <span className="text-sm text-gray-500">%</span>
              </div>
              <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeOpacity="0.1"
                />
                <circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * stats.completionRate) / 100}
                  className="text-primary"
                />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full mt-4">
              <div className="text-center bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
              <div className="text-center bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Task Status */}
        <BentoCard
          title="Task Status"
          icon={<BarChart3 className="h-5 w-5" />}
          size="md"
        >
          <div className="space-y-3 mt-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Completed</span>
                <span className="text-sm font-medium">{stats.completed}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">In Progress</span>
                <span className="text-sm font-medium">{stats.inProgress}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Pending</span>
                <span className="text-sm font-medium">{stats.pending}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Overdue</span>
                <span className="text-sm font-medium">{stats.overdue}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${stats.total > 0 ? (stats.overdue / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Priority Distribution */}
        <BentoCard
          title="Priority Distribution"
          icon={<TrendingUp className="h-5 w-5" />}
          size="sm"
        >
          <div className="space-y-3 mt-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">High</span>
                <span className="text-sm font-medium">{stats.byPriority.high}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${stats.total > 0 ? (stats.byPriority.high / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Medium</span>
                <span className="text-sm font-medium">{stats.byPriority.medium}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${stats.total > 0 ? (stats.byPriority.medium / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Low</span>
                <span className="text-sm font-medium">{stats.byPriority.low}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${stats.total > 0 ? (stats.byPriority.low / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Summary Stats */}
        <BentoCard
          title="Summary"
          icon={<CheckCircle className="h-5 w-5" />}
          size="sm"
        >
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <div className="text-2xl font-bold">{stats.completed}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <div className="text-xs text-gray-500">In Progress</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600 mx-auto mb-1" />
              <div className="text-2xl font-bold">{stats.overdue}</div>
              <div className="text-xs text-gray-500">Overdue</div>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
};

export default ReportsPage;
