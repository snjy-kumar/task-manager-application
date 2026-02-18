import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Edit2, Trash, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import subtaskService, { Subtask } from '@/services/subtaskService';

interface TaskSubtasksProps {
    taskId: string;
}

const TaskSubtasks: React.FC<TaskSubtasksProps> = ({ taskId }) => {
    const [subtasks, setSubtasks] = useState<Subtask[]>([]);
    const [loading, setLoading] = useState(true);
    const [newSubtask, setNewSubtask] = useState({ title: '', description: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ title: '', description: '' });
    const toast = useToast();

    useEffect(() => {
        fetchSubtasks();
    }, [taskId]);

    const fetchSubtasks = async () => {
        try {
            setLoading(true);
            const data = await subtaskService.getSubtasks(taskId);
            setSubtasks(data);
        } catch (error: any) {
            console.error('Failed to fetch subtasks:', error);
            toast.error(error.response?.data?.message || 'Failed to load subtasks');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newSubtask.title.trim()) {
            toast.error('Subtask title is required');
            return;
        }

        try {
            const created = await subtaskService.createSubtask(taskId, newSubtask);
            setSubtasks([...subtasks, created]);
            setNewSubtask({ title: '', description: '' });
            setIsAdding(false);
            toast.success('Subtask created successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create subtask');
        }
    };

    const handleToggle = async (subtaskId: string) => {
        try {
            const updated = await subtaskService.toggleSubtask(taskId, subtaskId);
            setSubtasks(subtasks.map(st => st._id === subtaskId ? updated : st));
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update subtask');
        }
    };

    const handleUpdate = async (subtaskId: string) => {
        if (!editForm.title.trim()) {
            toast.error('Subtask title is required');
            return;
        }

        try {
            const updated = await subtaskService.updateSubtask(taskId, subtaskId, editForm);
            setSubtasks(subtasks.map(st => st._id === subtaskId ? updated : st));
            setEditingId(null);
            toast.success('Subtask updated successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update subtask');
        }
    };

    const handleDelete = async (subtaskId: string) => {
        if (!window.confirm('Are you sure you want to delete this subtask?')) return;

        try {
            await subtaskService.deleteSubtask(taskId, subtaskId);
            setSubtasks(subtasks.filter(st => st._id !== subtaskId));
            toast.success('Subtask deleted successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete subtask');
        }
    };

    const completedCount = subtasks.filter(st => st.isCompleted).length;
    const progressPercentage = subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0;

    if (loading) {
        return <div className="text-center py-4">Loading subtasks...</div>;
    }

    return (
        <div className="space-y-4">
            {/* Progress Bar */}
            {subtasks.length > 0 && (
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Progress</span>
                        <span className="text-gray-600 dark:text-gray-400">
                            {completedCount} of {subtasks.length} completed
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Subtasks List */}
            <div className="space-y-2">
                {subtasks.map((subtask) => (
                    <div
                        key={subtask._id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <button
                            onClick={() => handleToggle(subtask._id)}
                            className="mt-1 text-gray-400 hover:text-green-500 transition-colors"
                        >
                            {subtask.isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                                <Circle className="h-5 w-5" />
                            )}
                        </button>

                        {editingId === subtask._id ? (
                            <div className="flex-1 space-y-2">
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                                    placeholder="Subtask title"
                                />
                                <input
                                    type="text"
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                                    placeholder="Description (optional)"
                                />
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleUpdate(subtask._id)}>
                                        <Check className="h-4 w-4 mr-1" />
                                        Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEditingId(null)}
                                    >
                                        <X className="h-4 w-4 mr-1" />
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1">
                                <p className={`font-medium ${subtask.isCompleted ? 'line-through text-gray-500' : ''}`}>
                                    {subtask.title}
                                </p>
                                {subtask.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {subtask.description}
                                    </p>
                                )}
                            </div>
                        )}

                        {editingId !== subtask._id && (
                            <div className="flex gap-1">
                                <button
                                    onClick={() => {
                                        setEditingId(subtask._id);
                                        setEditForm({ title: subtask.title, description: subtask.description || '' });
                                    }}
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                >
                                    <Edit2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                </button>
                                <button
                                    onClick={() => handleDelete(subtask._id)}
                                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                >
                                    <Trash className="h-4 w-4 text-red-600 dark:text-red-400" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Add New Subtask */}
            {isAdding ? (
                <div className="space-y-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <input
                        type="text"
                        value={newSubtask.title}
                        onChange={(e) => setNewSubtask({ ...newSubtask, title: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                        placeholder="Subtask title"
                        autoFocus
                    />
                    <input
                        type="text"
                        value={newSubtask.description}
                        onChange={(e) => setNewSubtask({ ...newSubtask, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                        placeholder="Description (optional)"
                    />
                    <div className="flex gap-2">
                        <Button size="sm" onClick={handleCreate}>
                            <Check className="h-4 w-4 mr-1" />
                            Add Subtask
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                setIsAdding(false);
                                setNewSubtask({ title: '', description: '' });
                            }}
                        >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <Button
                    variant="outline"
                    onClick={() => setIsAdding(true)}
                    className="w-full border-dashed"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subtask
                </Button>
            )}
        </div>
    );
};

export default TaskSubtasks;
