import React, { useState } from 'react';
import { X, Plus, Tag as TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import taskService from '@/services/taskService';

interface TaskTagsProps {
    taskId: string;
    initialTags: string[];
    onUpdate?: () => void;
}

const TaskTags: React.FC<TaskTagsProps> = ({ taskId, initialTags, onUpdate }) => {
    const [tags, setTags] = useState<string[]>(initialTags);
    const [newTag, setNewTag] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [saving, setSaving] = useState(false);
    const toast = useToast();

    const handleAddTag = async () => {
        if (!newTag.trim()) {
            toast.error('Tag cannot be empty');
            return;
        }

        if (tags.includes(newTag.trim())) {
            toast.error('Tag already exists');
            return;
        }

        try {
            setSaving(true);
            const updatedTags = [...tags, newTag.trim()];
            await taskService.updateTask(taskId, { tags: updatedTags });
            setTags(updatedTags);
            setNewTag('');
            setIsAdding(false);
            toast.success('Tag added successfully');
            onUpdate?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add tag');
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveTag = async (tagToRemove: string) => {
        try {
            setSaving(true);
            const updatedTags = tags.filter(tag => tag !== tagToRemove);
            await taskService.updateTask(taskId, { tags: updatedTags });
            setTags(updatedTags);
            toast.success('Tag removed successfully');
            onUpdate?.();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to remove tag');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="flex items-center gap-2 mb-2">
                <TagIcon className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-medium text-gray-500">Tags</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                    >
                        {tag}
                        <button
                            onClick={() => handleRemoveTag(tag)}
                            disabled={saving}
                            className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}

                {isAdding ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                            placeholder="Enter tag name"
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                            autoFocus
                        />
                        <Button
                            size="sm"
                            onClick={handleAddTag}
                            disabled={saving || !newTag.trim()}
                            className="h-7"
                        >
                            Add
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                setIsAdding(false);
                                setNewTag('');
                            }}
                            disabled={saving}
                            className="h-7"
                        >
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors"
                    >
                        <Plus className="h-3 w-3" />
                        Add Tag
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskTags;
