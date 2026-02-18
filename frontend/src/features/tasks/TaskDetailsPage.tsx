import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Clock, Calendar, CheckCircle,
    MessageSquare, Activity as ActivityIcon, Timer,
    Edit, Trash, GitBranch, Paperclip, Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import taskService, { Task } from '@/services/taskService';
import TaskTags from './TaskTags';
import TaskSubtasks from './TaskSubtasks';
import TaskComments from './TaskComments';
import TaskTimeTracking from './TaskTimeTracking';
import TaskActivityLog from './TaskActivityLog';
import TaskDependencies from './TaskDependencies';
import TaskAttachments from './TaskAttachments';
import TaskReminders from './TaskReminders';
import { getPriorityColor, getStatusColor } from '@/lib/taskUtils';
import { formatDate } from '@/lib/dateUtils';

const TaskDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'subtasks' | 'comments' | 'time' | 'activity' | 'dependencies' | 'attachments' | 'reminders'>('subtasks');

    useEffect(() => {
        if (id) {
            fetchTask();
        }
    }, [id]);

    const fetchTask = async () => {
        try {
            setLoading(true);
            const fetchedTask = await taskService.getTaskById(id!);
            setTask(fetchedTask);
        } catch (error: any) {
            console.error('Failed to fetch task:', error);
            toast.error(error.response?.data?.message || 'Failed to load task');
            navigate('/dashboard/tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await taskService.deleteTask(id!);
            toast.success('Task deleted successfully');
            navigate('/dashboard/tasks');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete task');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-semibold mb-2">Task Not Found</h2>
                <Button onClick={() => navigate('/dashboard/tasks')}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard/tasks')}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Tasks
                </Button>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/dashboard/tasks/${id}/edit`)}
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Task Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Task Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">{task.title}</h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className={`px-3 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                                    {task.priority} Priority
                                </span>
                                <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                                {task.category && (
                                    <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 font-medium">
                                        {task.category}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="h-5 w-5" />
                            <div>
                                <p className="text-xs text-gray-500">Due Date</p>
                                <p className="font-medium">{formatDate(task.dueDate)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Clock className="h-5 w-5" />
                            <div>
                                <p className="text-xs text-gray-500">Created</p>
                                <p className="font-medium">{formatDate(task.createdAt)}</p>
                            </div>
                        </div>
                        {task.completedAt && (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <CheckCircle className="h-5 w-5" />
                                <div>
                                    <p className="text-xs text-gray-500">Completed</p>
                                    <p className="font-medium">{formatDate(task.completedAt)}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {task.description}
                        </p>
                    </div>

                    {/* Tags Section */}
                    <div className="mt-4">
                        <TaskTags taskId={task._id} initialTags={task.tags || []} onUpdate={fetchTask} />
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('subtasks')}
                            className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'subtasks'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                        >
                            <CheckCircle className="h-4 w-4 inline mr-2" />
                            Subtasks
                        </button>
                        <button
                            onClick={() => setActiveTab('comments')}
                            className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'comments'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                        >
                            <MessageSquare className="h-4 w-4 inline mr-2" />
                            Comments
                        </button>
                        <button
                            onClick={() => setActiveTab('time')}
                            className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'time'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                        >
                            <Timer className="h-4 w-4 inline mr-2" />
                            Time Tracking
                        </button>
                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'activity'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                        >
                            <ActivityIcon className="h-4 w-4 inline mr-2" />
                            Activity Log
                        </button>
                        <button
                            onClick={() => setActiveTab('dependencies')}
                            className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'dependencies'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                        >
                            <GitBranch className="h-4 w-4 inline mr-2" />
                            Dependencies
                        </button>
                        <button
                            onClick={() => setActiveTab('attachments')}
                            className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'attachments'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                        >
                            <Paperclip className="h-4 w-4 inline mr-2" />
                            Attachments
                        </button>
                        <button
                            onClick={() => setActiveTab('reminders')}
                            className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'reminders'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                        >
                            <Bell className="h-4 w-4 inline mr-2" />
                            Reminders
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'subtasks' && <TaskSubtasks taskId={task._id} />}
                    {activeTab === 'comments' && <TaskComments taskId={task._id} />}
                    {activeTab === 'time' && <TaskTimeTracking taskId={task._id} />}
                    {activeTab === 'activity' && <TaskActivityLog taskId={task._id} />}
                    {activeTab === 'dependencies' && <TaskDependencies taskId={task._id} />}
                    {activeTab === 'attachments' && <TaskAttachments taskId={task._id} />}
                    {activeTab === 'reminders' && <TaskReminders taskId={task._id} taskTitle={task.title} />}
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsPage;
