import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ChevronDown,
  Tag,
  Repeat,
  X,
  Plus
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import taskService from '@/services/taskService';
import RecurringTaskForm from './RecurringTaskForm';

interface TaskFormProps {
  editMode?: boolean;
}

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Archived';
  category: string;
  tags: string[];
  isRecurring: boolean;
  recurringPattern: string;
  recurringInterval: number;
  recurringEndDate?: string;
}

const CATEGORIES = ['Personal', 'Work', 'Shopping', 'Health', 'Finance', 'Learning', 'Other'];
const RECURRING_PATTERNS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const TaskForm: React.FC<TaskFormProps> = ({ editMode = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Pending',
    category: 'Personal',
    tags: [],
    isRecurring: false,
    recurringPattern: 'weekly',
    recurringInterval: 1,
    recurringEndDate: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTask, setLoadingTask] = useState(editMode);
  const [error, setError] = useState<string>('');

  // Load task if in edit mode
  useEffect(() => {
    if (editMode && id) {
      loadTask(id);
    }
  }, [editMode, id]);

  const loadTask = async (taskId: string) => {
    try {
      setLoadingTask(true);
      const data = await taskService.getTaskById(taskId);
      setTask({
        title: data.title,
        description: data.description,
        dueDate: data.dueDate.split('T')[0],
        priority: data.priority,
        status: data.status,
        category: data.category || 'Personal',
        tags: data.tags || [],
        isRecurring: data.isRecurring || false,
        recurringPattern: data.recurringPattern || 'weekly',
        recurringInterval: data.recurringInterval || 1,
        recurringEndDate: data.recurringEndDate ? data.recurringEndDate.split('T')[0] : '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load task');
    } finally {
      setLoadingTask(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setTask(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !task.tags.includes(trimmedTag) && task.tags.length < 5) {
      setTask(prev => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTask(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRecurringChange = (data: {
    isRecurring: boolean;
    recurringPattern?: string;
    recurringInterval?: number;
    recurringEndDate?: string;
  }) => {
    setTask(prev => ({
      ...prev,
      isRecurring: data.isRecurring,
      recurringPattern: data.recurringPattern || 'weekly',
      recurringInterval: data.recurringInterval || 1,
      recurringEndDate: data.recurringEndDate || '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task.title || !task.description || !task.dueDate) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const taskData = {
        ...task,
        recurringPattern: task.isRecurring ? task.recurringPattern : undefined,
        recurringInterval: task.isRecurring ? task.recurringInterval : undefined,
        recurringEndDate: task.isRecurring && task.recurringEndDate ? task.recurringEndDate : undefined,
      };

      if (editMode && id) {
        await taskService.updateTask(id, taskData);
      } else {
        await taskService.createTask(taskData);
      }
      navigate('/dashboard/tasks');
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${editMode ? 'update' : 'create'} task`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingTask) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{editMode ? 'Edit Task' : 'Create New Task'}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {editMode ? 'Update the details of your task' : 'Add a new task to your list'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/dashboard/tasks">Cancel</Link>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300">
        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={task.title}
            onChange={handleChange}
            placeholder="Task title"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            value={task.description}
            onChange={handleChange}
            placeholder="Describe your task"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300"
          />
        </div>

        {/* Due Date and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                required
                value={task.dueDate}
                onChange={handleChange}
                className="pl-10 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={task.category}
                onChange={handleChange}
                className="appearance-none w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Priority and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <div className="relative">
              <select
                id="priority"
                name="priority"
                value={task.priority}
                onChange={handleChange}
                className="appearance-none w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <div className="relative">
              <select
                id="status"
                name="status"
                value={task.status}
                onChange={handleChange}
                className="appearance-none w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags <span className="text-gray-400 text-xs">(max 5)</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {task.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-800/30 text-gray-900 dark:text-gray-100 rounded-full text-sm"
              >
                <Tag className="w-3 h-3" />
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-gray-800 dark:hover:text-gray-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add a tag"
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300"
              disabled={task.tags.length >= 5}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddTag}
              disabled={task.tags.length >= 5}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Recurring Task */}
        <RecurringTaskForm
          isRecurring={task.isRecurring}
          recurringPattern={task.recurringPattern}
          recurringInterval={task.recurringInterval}
          recurringEndDate={task.recurringEndDate}
          onChange={handleRecurringChange}
        />

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" type="button" asChild>
            <Link to="/dashboard/tasks">Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                {editMode ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              editMode ? 'Update Task' : 'Create Task'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;