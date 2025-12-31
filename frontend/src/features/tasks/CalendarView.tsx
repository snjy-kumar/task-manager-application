import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import taskService, { Task as ServiceTask } from '@/services/taskService';

type Task = ServiceTask & { _id: string };

const priorityColors: Record<string, string> = {
    Low: 'bg-gray-200 dark:bg-gray-700',
    Medium: 'bg-yellow-200 dark:bg-yellow-800',
    High: 'bg-red-200 dark:bg-red-800',
};

const statusColors: Record<string, string> = {
    Pending: 'border-l-gray-400',
    'In Progress': 'border-l-blue-400',
    Completed: 'border-l-green-400',
    Archived: 'border-l-purple-400',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'month' | 'week'>('month');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await taskService.getAllTasks({ limit: 500 });
            const tasksWithId = (response.tasks || []).filter((t): t is Task => !!t._id);
            setTasks(tasksWithId);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days: (Date | null)[] = [];

        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const getTasksForDate = (date: Date | null) => {
        if (!date) return [];
        return tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            return taskDate.toDateString() === date.toDateString();
        });
    };

    const isToday = (date: Date | null) => {
        if (!date) return false;
        return date.toDateString() === new Date().toDateString();
    };

    const isPast = (date: Date | null) => {
        if (!date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const days = getDaysInMonth(currentDate);

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl h-[600px]" />
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
                    <p className="text-gray-500 dark:text-gray-400">View tasks by due date</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        <button
                            onClick={() => setView('month')}
                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${view === 'month' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
                        >
                            Month
                        </button>
                        <button
                            onClick={() => setView('week')}
                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${view === 'week' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
                        >
                            Week
                        </button>
                    </div>
                    <Link
                        to="/dashboard/tasks/new"
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Task
                    </Link>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white min-w-[200px] text-center">
                        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <button
                    onClick={goToToday}
                    className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    Today
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    {DAYS.map(day => (
                        <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7">
                    {days.map((date, index) => {
                        const dayTasks = getTasksForDate(date);
                        const isCurrentDay = isToday(date);
                        const isPastDay = isPast(date);

                        return (
                            <div
                                key={index}
                                className={`min-h-[120px] border-b border-r border-gray-100 dark:border-gray-700 p-2 ${!date ? 'bg-gray-50 dark:bg-gray-900/50' : ''} ${isPastDay && !isCurrentDay ? 'bg-gray-50/50 dark:bg-gray-900/30' : ''}`}
                            >
                                {date && (
                                    <>
                                        <div className={`text-sm mb-2 ${isCurrentDay ? 'w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                                            {date.getDate()}
                                        </div>

                                        <div className="space-y-1">
                                            {dayTasks.slice(0, 3).map(task => (
                                                <motion.div
                                                    key={task._id}
                                                    whileHover={{ scale: 1.02 }}
                                                    onClick={() => navigate(`/dashboard/tasks/${task._id}/edit`)}
                                                    className={`text-xs p-1.5 rounded cursor-pointer truncate border-l-2 ${statusColors[task.status]} ${task.status === 'Completed' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 line-through' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                                >
                                                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${priorityColors[task.priority]}`} />
                                                    {task.title}
                                                </motion.div>
                                            ))}

                                            {dayTasks.length > 3 && (
                                                <div className="text-xs text-gray-400 dark:text-gray-500 pl-1">
                                                    +{dayTasks.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gray-400" />
                    <span>Pending</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-400" />
                    <span>In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-400" />
                    <span>Completed</span>
                </div>
            </div>
        </div>
    );
}
