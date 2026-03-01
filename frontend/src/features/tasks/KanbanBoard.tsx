import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, Clock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import taskService, { Task as ServiceTask } from '@/services/taskService';

type Task = ServiceTask & { _id: string };

const statusColumns = [
    { id: 'Pending', title: 'To Do', color: 'bg-gray-500', bgColor: 'bg-muted/50' },
    { id: 'In Progress', title: 'In Progress', color: 'bg-amber-500', bgColor: 'bg-amber-500/5' },
    { id: 'Completed', title: 'Done', color: 'bg-emerald-500', bgColor: 'bg-emerald-500/5' },
];

const priorityColors = {
    Low: 'bg-gray-100 text-gray-600 dark:bg-gray-700 ',
    Medium: 'bg-amber-500/15 text-amber-400',
    High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function KanbanBoard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await taskService.getAllTasks({ limit: 100 });
            const tasksWithId = (response.tasks || []).filter((t): t is Task => !!t._id);
            setTasks(tasksWithId);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (e: React.DragEvent, task: Task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        if (!draggedTask || draggedTask.status === newStatus) {
            setDraggedTask(null);
            return;
        }

        // Optimistic update
        setTasks(prev => prev.map(t =>
            t._id === draggedTask._id ? { ...t, status: newStatus as Task['status'] } : t
        ));

        try {
            await taskService.updateTask(draggedTask._id, { status: newStatus });
        } catch (error) {
            console.error('Error updating task:', error);
            // Revert on error
            fetchTasks();
        }

        setDraggedTask(null);
    };

    const getTasksByStatus = (status: string) => {
        return tasks.filter(task => task.status === status);
    };

    const formatDate = (date: string) => {
        const d = new Date(date);
        const today = new Date();
        const diffDays = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, color: 'text-red-500' };
        if (diffDays === 0) return { text: 'Today', color: 'text-amber-500' };
        if (diffDays === 1) return { text: 'Tomorrow', color: 'text-amber-400' };
        if (diffDays <= 7) return { text: `${diffDays}d left`, color: 'text-foreground/60' };
        return { text: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: 'text-gray-500' };
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-muted rounded-xl p-4 animate-pulse h-96" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-background">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Kanban Board</h1>
                    <p className="text-muted-foreground">Drag and drop to update task status</p>
                </div>
                <Link
                    to="/dashboard/tasks/new"
                    className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Task
                </Link>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statusColumns.map(column => (
                    <div
                        key={column.id}
                        className={`rounded-xl ${column.bgColor} border border-border min-h-[500px] transition-all duration-300`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, column.id)}
                    >
                        {/* Column Header */}
                        <div className="p-4 border-b border-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${column.color}`} />
                                    <h2 className="font-semibold text-foreground">{column.title}</h2>
                                    <span className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-800 rounded-full text-gray-600 ">
                                        {getTasksByStatus(column.id).length}
                                    </span>
                                </div>
                                <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-all duration-300">
                                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Tasks */}
                        <div className="p-3 space-y-3">
                            {getTasksByStatus(column.id).map(task => {
                                const dueInfo = formatDate(task.dueDate);
                                return (
                                    <motion.div
                                        key={task._id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, task)}
                                        onClick={() => navigate(`/dashboard/tasks/${task._id}/edit`)}
                                        className={`p-4 bg-card rounded-xl border border-border shadow-sm cursor-pointer hover:shadow-md transition-all duration-300 ${draggedTask?._id === task._id ? 'opacity-50 scale-95' : ''
                                            }`}
                                    >
                                        {/* Priority Badge */}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded ${priorityColors[task.priority]}`}>
                                                {task.priority}
                                            </span>
                                            {task.category && (
                                                <span className="text-xs text-muted-foreground">{task.category}</span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                                            {task.title}
                                        </h3>

                                        {/* Description */}
                                        {task.description && (
                                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                {task.description}
                                            </p>
                                        )}

                                        {/* Tags */}
                                        {task.tags && task.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {task.tags.slice(0, 3).map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-800/30 text-foreground rounded"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                                            <div className={`flex items-center gap-1 text-xs ${dueInfo.color}`}>
                                                <Clock className="w-3 h-3" />
                                                {dueInfo.text}
                                            </div>
                                            <button className="p-1 hover:bg-muted rounded transition-all duration-300">
                                                <ArrowRight className="w-3 h-3 text-gray-400" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Empty State */}
                            {getTasksByStatus(column.id).length === 0 && (
                                <div className="text-center py-8 text-gray-400">
                                    <p className="text-sm">No tasks</p>
                                    <p className="text-xs">Drag tasks here or add new</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
