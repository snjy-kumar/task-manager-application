import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Tag, 
  X, 
  ChevronDown,
  Plus
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface TaskFormProps {
  editMode?: boolean;
  initialTask?: Task;
}

interface Task {
  id?: number;
  title: string;
  description: string;
  dueDate: string;
  dueTime?: string;
  priority: string;
  status: string;
  category: string;
  labels: string[];
  assignees?: string[];
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  editMode = false, 
  initialTask = {
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium',
    status: 'todo',
    category: 'work',
    labels: [],
    assignees: []
  }
}) => {
  const [task, setTask] = useState<Task>(initialTask);
  const [newLabel, setNewLabel] = useState('');
  const [labelInputVisible, setLabelInputVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addLabel = () => {
    if (newLabel.trim() && !task.labels.includes(newLabel.trim())) {
      setTask(prev => ({
        ...prev,
        labels: [...prev.labels, newLabel.trim()]
      }));
      setNewLabel('');
      setLabelInputVisible(false);
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setTask(prev => ({
      ...prev,
      labels: prev.labels.filter(label => label !== labelToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically save the task to your state management or API
    console.log('Task submitted:', task);
    
    // Navigate back to tasks list
    navigate('/dashboard/tasks');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{editMode ? 'Edit Task' : 'Create New Task'}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {editMode 
              ? 'Update the details of your task' 
              : 'Add a new task to your list'
            }
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/dashboard/tasks">Cancel</Link>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
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
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={task.description}
            onChange={handleChange}
            placeholder="Describe your task"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Due Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={task.dueDate}
                onChange={handleChange}
                className="pl-10 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="dueTime"
                name="dueTime"
                type="time"
                value={task.dueTime}
                onChange={handleChange}
                className="pl-10 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
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
                className="appearance-none w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
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
                className="appearance-none w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Category */}
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
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="errands">Errands</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Labels
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {task.labels.map((label, index) => (
              <div 
                key={index} 
                className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
              >
                <Tag className="h-3 w-3 mr-2 text-gray-500" />
                <span className="text-sm">{label}</span>
                <button 
                  type="button"
                  onClick={() => removeLabel(label)}
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {labelInputVisible ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addLabel()}
                  placeholder="Add label"
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={addLabel}
                  className="ml-2 text-primary"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button 
                  type="button"
                  onClick={() => setLabelInputVisible(false)}
                  className="ml-1 text-gray-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button 
                type="button"
                onClick={() => setLabelInputVisible(true)}
                className="flex items-center text-sm text-primary hover:text-primary-dark"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Label
              </button>
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="outline" 
            type="button" 
            asChild
          >
            <Link to="/dashboard/tasks">Cancel</Link>
          </Button>
          <Button type="submit">
            {editMode ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm; 