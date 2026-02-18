import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    CheckCircle,
    Clock,
    AlertCircle,
    BarChart3,
    PieChart,
    Activity as ActivityIcon
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import taskService, { TaskStats } from '@/services/taskService';
import activityService from '@/services/activityService';

const AnalyticsDashboard: React.FC = () => {
    const [stats, setStats] = useState<TaskStats | null>(null);
    const [activityStats, setActivityStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState(7);
    const toast = useToast();

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [taskStats, actStats] = await Promise.all([
                taskService.getStats(),
                activityService.getActivityStats(timeRange)
            ]);
            setStats(taskStats);
            setActivityStats(actStats);
        } catch (error: any) {
            console.error('Failed to fetch analytics:', error);
            toast.error(error.response?.data?.message || 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!stats) return null;

    const completionRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : '0';
    const activeTasksRate = stats.total > 0 ? (((stats.pending + stats.inProgress) / stats.total) * 100).toFixed(1) : '0';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Track your productivity and task metrics
                    </p>
                </div>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                >
                    <option value={7}>Last 7 days</option>
                    <option value={14}>Last 14 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={90}>Last 90 days</option>
                </select>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{stats.total}</h3>
                    <p className="text-blue-100">Total Tasks</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{stats.completed}</h3>
                    <p className="text-green-100">Completed</p>
                    <p className="text-sm text-green-100 mt-1">{completionRate}% completion rate</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                            <Clock className="h-6 w-6" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{stats.pending + stats.inProgress}</h3>
                    <p className="text-yellow-100">Active Tasks</p>
                    <p className="text-sm text-yellow-100 mt-1">{activeTasksRate}% of total</p>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{stats.overdue}</h3>
                    <p className="text-red-100">Overdue Tasks</p>
                    <p className="text-sm text-red-100 mt-1">Need attention</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <PieChart className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-bold">Task Status Distribution</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Pending</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{stats.pending}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                <div
                                    className="bg-yellow-500 h-3 rounded-full"
                                    style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">In Progress</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{stats.inProgress}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                <div
                                    className="bg-blue-500 h-3 rounded-full"
                                    style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Completed</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{stats.completed}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                <div
                                    className="bg-green-500 h-3 rounded-full"
                                    style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Archived</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{stats.archived}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                <div
                                    className="bg-gray-500 h-3 rounded-full"
                                    style={{ width: `${stats.total > 0 ? (stats.archived / stats.total) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Priority Distribution */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-bold">Priority Breakdown</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <div>
                                <p className="text-sm text-red-600 dark:text-red-400 font-medium">High Priority</p>
                                <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.highPriority}</p>
                            </div>
                            <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
                                <p className="text-2xl font-bold mt-1">{stats.overdue}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-600 dark:text-gray-400">On Track</p>
                                <p className="text-2xl font-bold mt-1">{stats.total - stats.overdue - stats.completed - stats.archived}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Stats */}
            {activityStats && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <ActivityIcon className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-bold">Activity Summary ({activityStats.period})</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <p className="text-3xl font-bold text-primary mb-1">{activityStats.total}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Activities</p>
                        </div>
                        {activityStats.byAction.slice(0, 3).map((item: any) => (
                            <div key={item._id} className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                                <p className="text-3xl font-bold text-primary mb-1">{item.count}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                    {item._id.replace('_', ' ')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Insights */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-4">📊 Productivity Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                        <p className="text-sm text-purple-100 mb-1">Completion Rate</p>
                        <p className="text-2xl font-bold">{completionRate}%</p>
                        <p className="text-xs text-purple-100 mt-1">
                            {Number(completionRate) >= 70 ? '🎉 Excellent!' : Number(completionRate) >= 50 ? '👍 Good progress' : '💪 Keep going!'}
                        </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                        <p className="text-sm text-purple-100 mb-1">Task Load</p>
                        <p className="text-2xl font-bold">{stats.pending + stats.inProgress}</p>
                        <p className="text-xs text-purple-100 mt-1">
                            {stats.pending + stats.inProgress > 20 ? '⚠️ High workload' : '✅ Manageable'}
                        </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                        <p className="text-sm text-purple-100 mb-1">Overdue Items</p>
                        <p className="text-2xl font-bold">{stats.overdue}</p>
                        <p className="text-xs text-purple-100 mt-1">
                            {stats.overdue === 0 ? '🌟 All caught up!' : '⏰ Needs attention'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
