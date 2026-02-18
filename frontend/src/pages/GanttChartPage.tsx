import React, { useState, useEffect, useRef } from 'react';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import taskService, { Task } from '@/services/taskService';
import { Link } from 'react-router-dom';

type ViewMode = 'day' | 'week' | 'month';

const GanttChartPage: React.FC = () => {
    const { error } = useToast();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('week');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterPriority, setFilterPriority] = useState<string>('');
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadTasks();
    }, [filterStatus, filterPriority]);

    const loadTasks = async () => {
        setLoading(true);
        try {
            const filters: any = {};
            if (filterStatus) filters.status = filterStatus;
            if (filterPriority) filters.priority = filterPriority;

            const response = await taskService.getAllTasks(filters);
            // Only show tasks with due dates
            const tasksWithDates = response.tasks.filter((task: Task) => task.dueDate);
            setTasks(tasksWithDates);
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const getDateRange = () => {
        const start = new Date(currentDate);
        let end = new Date(currentDate);
        let days = 7;

        switch (viewMode) {
            case 'day':
                days = 1;
                break;
            case 'week':
                start.setDate(start.getDate() - start.getDay()); // Start of week
                days = 7;
                break;
            case 'month':
                start.setDate(1); // Start of month
                end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
                days = end.getDate();
                break;
        }

        end = new Date(start);
        end.setDate(start.getDate() + days - 1);

        return { start, end, days };
    };

    const getTimelineColumns = () => {
        const { start, days } = getDateRange();
        const columns = [];

        for (let i = 0; i < days; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            columns.push(date);
        }

        return columns;
    };

    const calculateTaskPosition = (task: Task) => {
        const { start, end } = getDateRange();
        const taskStart = new Date(task.createdAt);
        const taskEnd = new Date(task.dueDate);

        // Calculate position as percentage
        const totalMs = end.getTime() - start.getTime();
        const taskStartMs = Math.max(taskStart.getTime() - start.getTime(), 0);
        const taskEndMs = Math.min(taskEnd.getTime() - start.getTime(), totalMs);

        const left = (taskStartMs / totalMs) * 100;
        const width = ((taskEndMs - taskStartMs) / totalMs) * 100;

        return {
            left: `${Math.max(0, left)}%`,
            width: `${Math.max(1, Math.min(width, 100 - left))}%`,
            isVisible: taskEndMs > 0 && taskStartMs < totalMs
        };
    };

    const navigateDate = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);

        switch (viewMode) {
            case 'day':
                newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
                break;
            case 'week':
                newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
                break;
            case 'month':
                newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
                break;
        }

        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High':
                return 'bg-red-500 hover:bg-red-600';
            case 'Medium':
                return 'bg-yellow-500 hover:bg-yellow-600';
            case 'Low':
                return 'bg-green-500 hover:bg-green-600';
            default:
                return 'bg-gray-500 hover:bg-gray-600';
        }
    };

    const getStatusOpacity = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'opacity-50';
            case 'Archived':
                return 'opacity-30';
            default:
                return '';
        }
    };

    const formatDateHeader = (date: Date) => {
        switch (viewMode) {
            case 'day':
                return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            case 'week':
                return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
            case 'month':
                return date.getDate().toString();
            default:
                return '';
        }
    };

    const columns = getTimelineColumns();
    const { start } = getDateRange();

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Gantt Chart
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Visual timeline view of your tasks
                </p>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Date Navigation */}
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={goToToday}>
                            Today
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
                            {start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                    </div>

                    {/* View Mode */}
                    <div className="flex gap-1 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
                        {(['day', 'week', 'month'] as ViewMode[]).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${viewMode === mode
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 ml-auto">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        >
                            <option value="">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Archived">Archived</option>
                        </select>

                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        >
                            <option value="">All Priority</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Gantt Chart */}
            {loading ? (
                <div className="flex items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No tasks with due dates found</p>
                </div>
            ) : (
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-auto h-full" ref={chartRef}>
                        <div className="min-w-[800px]">
                            {/* Timeline Header */}
                            <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                                <div className="w-64 flex-shrink-0 p-3 border-r border-gray-200 dark:border-gray-700 font-medium text-sm text-gray-700 dark:text-gray-300">
                                    Task Name
                                </div>
                                <div className="flex-1 flex">
                                    {columns.map((date, index) => (
                                        <div
                                            key={index}
                                            className="flex-1 p-3 text-center text-xs font-medium text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700"
                                            style={{ minWidth: '80px' }}
                                        >
                                            {formatDateHeader(date)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Task Rows */}
                            <div className="relative">
                                {tasks.map((task) => {
                                    const position = calculateTaskPosition(task);

                                    if (!position.isVisible) return null;

                                    return (
                                        <div
                                            key={task._id}
                                            className="flex border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                        >
                                            {/* Task Name */}
                                            <div className="w-64 flex-shrink-0 p-3 border-r border-gray-200 dark:border-gray-700">
                                                <Link
                                                    to={`/dashboard/tasks/${task._id}`}
                                                    className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1"
                                                >
                                                    {task.title}
                                                </Link>
                                                <div className="flex gap-1 mt-1">
                                                    <span className={`text-xs px-1.5 py-0.5 rounded ${task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                                                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                                            'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                        }`}>
                                                        {task.priority}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Timeline */}
                                            <div className="flex-1 relative p-3">
                                                <div
                                                    className={`absolute top-1/2 -translate-y-1/2 h-8 rounded ${getPriorityColor(task.priority)} ${getStatusOpacity(task.status)} text-white text-xs flex items-center px-2 shadow-sm cursor-pointer group`}
                                                    style={{ left: position.left, width: position.width }}
                                                    title={`${task.title}\n${new Date(task.createdAt).toLocaleDateString()} - ${new Date(task.dueDate).toLocaleDateString()}`}
                                                >
                                                    <span className="truncate">{task.title}</span>
                                                    {task.status === 'Completed' && (
                                                        <span className="ml-auto">✓</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Legend:</h3>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-3 bg-red-500 rounded"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">High Priority</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-3 bg-yellow-500 rounded"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Medium Priority</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-3 bg-green-500 rounded"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Low Priority</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-3 bg-gray-500 opacity-50 rounded"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GanttChartPage;
