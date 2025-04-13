import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Filter, 
  Search, 
  Plus, 
  MoreVertical, 
  ChevronDown,
  Calendar,
  Clock,
  AlertCircle,
  Tag,
  Star,
  Trash,
  Edit,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Mock data for tasks
const mockTasks = [
  {
    id: 1,
    title: 'Complete project proposal',
    description: 'Draft the proposal for the new client project',
    dueDate: '2023-05-15',
    priority: 'high',
    status: 'in-progress',
    category: 'work',
    labels: ['client', 'proposal'],
    starred: true
  },
  {
    id: 2,
    title: 'Schedule team meeting',
    description: 'Coordinate with team members for weekly sync',
    dueDate: '2023-05-10',
    priority: 'medium',
    status: 'todo',
    category: 'work',
    labels: ['team', 'meeting'],
    starred: false
  },
  {
    id: 3,
    title: 'Prepare presentation slides',
    description: 'Create slides for the upcoming client presentation',
    dueDate: '2023-05-20',
    priority: 'high',
    status: 'todo',
    category: 'work',
    labels: ['presentation', 'client'],
    starred: true
  },
  {
    id: 4,
    title: 'Review design mockups',
    description: 'Provide feedback on the new design mockups',
    dueDate: '2023-05-12',
    priority: 'medium',
    status: 'in-progress',
    category: 'work',
    labels: ['design', 'feedback'],
    starred: false
  },
  {
    id: 5,
    title: 'Update documentation',
    description: 'Update the project documentation with latest changes',
    dueDate: '2023-05-18',
    priority: 'low',
    status: 'todo',
    category: 'work',
    labels: ['documentation'],
    starred: false
  },
  {
    id: 6,
    title: 'Call client for requirements',
    description: 'Discuss project requirements with the client',
    dueDate: '2023-05-09',
    priority: 'high',
    status: 'completed',
    category: 'work',
    labels: ['client', 'call'],
    starred: false
  },
  {
    id: 7,
    title: 'Buy groceries',
    description: 'Get items for the week',
    dueDate: '2023-05-08',
    priority: 'medium',
    status: 'completed',
    category: 'personal',
    labels: ['shopping'],
    starred: false
  },
  {
    id: 8,
    title: 'Plan vacation',
    description: 'Research destinations and accommodations',
    dueDate: '2023-05-25',
    priority: 'low',
    status: 'todo',
    category: 'personal',
    labels: ['vacation', 'planning'],
    starred: true
  },
];

const TaskList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Filter and sort tasks
  const filteredTasks = mockTasks.filter(task => {
    // Search filter
    const matchesSearch = 
      searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      statusFilter === 'all' || 
      task.status === statusFilter;
    
    // Priority filter
    const matchesPriority = 
      priorityFilter === 'all' || 
      task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  }).sort((a, b) => {
    // Sort by selected criteria
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage and organize your tasks</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link to="/dashboard/tasks/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Search className="h-5 w-5 text-gray-500" />
            </span>
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filter Toggle Button */}
          <Button 
            variant="outline" 
            onClick={() => setFiltersVisible(!filtersVisible)}
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${filtersVisible ? 'rotate-180' : ''}`} />
          </Button>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              className="appearance-none pl-4 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
        
        {/* Expanded Filters */}
        {filtersVisible && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <div className="flex flex-wrap gap-2">
                <FilterButton 
                  label="All" 
                  active={statusFilter === 'all'} 
                  onClick={() => setStatusFilter('all')}
                />
                <FilterButton 
                  label="To Do" 
                  active={statusFilter === 'todo'} 
                  onClick={() => setStatusFilter('todo')}
                />
                <FilterButton 
                  label="In Progress" 
                  active={statusFilter === 'in-progress'} 
                  onClick={() => setStatusFilter('in-progress')}
                />
                <FilterButton 
                  label="Completed" 
                  active={statusFilter === 'completed'} 
                  onClick={() => setStatusFilter('completed')}
                />
              </div>
            </div>
            
            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <div className="flex flex-wrap gap-2">
                <FilterButton 
                  label="All" 
                  active={priorityFilter === 'all'} 
                  onClick={() => setPriorityFilter('all')}
                />
                <FilterButton 
                  label="High" 
                  active={priorityFilter === 'high'} 
                  onClick={() => setPriorityFilter('high')}
                />
                <FilterButton 
                  label="Medium" 
                  active={priorityFilter === 'medium'} 
                  onClick={() => setPriorityFilter('medium')}
                />
                <FilterButton 
                  label="Low" 
                  active={priorityFilter === 'low'} 
                  onClick={() => setPriorityFilter('low')}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-1">No tasks found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
                ? 'Try adjusting your filters to see more results.' 
                : 'Create your first task to get started.'}
            </p>
            <Button asChild>
              <Link to="/dashboard/tasks/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Filter Button Component
interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm rounded-full ${
        active 
          ? 'bg-primary text-white' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );
};

// Task Item Component
interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  category: string;
  labels: string[];
  starred: boolean;
}

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [actionsOpen, setActionsOpen] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'todo':
        return { icon: <Clock className="h-4 w-4 text-gray-500" />, label: 'To Do' };
      case 'in-progress':
        return { icon: <AlertCircle className="h-4 w-4 text-blue-500" />, label: 'In Progress' };
      case 'completed':
        return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, label: 'Completed' };
      default:
        return { icon: <Clock className="h-4 w-4 text-gray-500" />, label: 'To Do' };
    }
  };
  
  const statusInfo = getStatusInfo(task.status);
  
  return (
    <div className="relative p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
      <div className="flex items-start">
        {/* Star Button */}
        <button className="mt-1 mr-3 text-gray-400 hover:text-yellow-500">
          <Star className={`h-5 w-5 ${task.starred ? 'fill-yellow-500 text-yellow-500' : ''}`} />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h3 className="text-base font-medium truncate">{task.title}</h3>
            <span className={`ml-3 h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}></span>
          </div>
          
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{task.description}</p>
          
          <div className="mt-2 flex items-center flex-wrap gap-2">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
            
            <div className="flex items-center text-xs">
              {statusInfo.icon}
              <span className="ml-1">{statusInfo.label}</span>
            </div>
            
            {task.labels.map((label, index) => (
              <div key={index} className="flex items-center text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                <Tag className="h-3 w-3 mr-1 text-gray-500" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Action Button */}
        <div className="relative ml-2">
          <button 
            onClick={() => setActionsOpen(!actionsOpen)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>
          
          {actionsOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
              <div className="py-1">
                <Link
                  to={`/dashboard/tasks/${task.id}/view`}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </div>
                </Link>
                <Link
                  to={`/dashboard/tasks/${task.id}/edit`}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Task
                  </div>
                </Link>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList; 