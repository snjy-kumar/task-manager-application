import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  ChevronRight, 
  CheckCircle, 
  Filter, 
  Plus,
  User,
  Tag,
  ArrowUp,
  ArrowDown,
  ListFilter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAnimations } from '@/hooks/useAnimations';
import BentoGrid from '@/components/ui/bento/BentoGrid';
import BentoCard from '@/components/ui/bento/BentoCard';

// Sample data for personal tasks
const personalTasks = [
  { id: 1, title: "Call dentist to schedule appointment", priority: "high", dueDate: "Today, 3:00 PM", category: "Health", completed: false },
  { id: 2, title: "Renew driver's license", priority: "medium", dueDate: "Tomorrow", category: "Admin", completed: false },
  { id: 3, title: "Book flight tickets for vacation", priority: "high", dueDate: "Friday", category: "Travel", completed: false },
  { id: 4, title: "Pay electricity bill", priority: "medium", dueDate: "Next Monday", category: "Bills", completed: false },
  { id: 5, title: "Organize home office", priority: "low", dueDate: "This weekend", category: "Home", completed: false },
  { id: 6, title: "Buy groceries", priority: "medium", dueDate: "Tomorrow", category: "Shopping", completed: false },
  { id: 7, title: "Schedule car maintenance", priority: "low", dueDate: "Next week", category: "Auto", completed: false },
  { id: 8, title: "Plan birthday party", priority: "medium", dueDate: "July 10", category: "Events", completed: false },
  { id: 9, title: "Research gym memberships", priority: "low", dueDate: "No due date", category: "Health", completed: true },
  { id: 10, title: "Update personal budget", priority: "medium", dueDate: "Last Sunday", category: "Finance", completed: true },
];

const categories = [
  { name: "Health", count: 2, color: "green" },
  { name: "Admin", count: 1, color: "gray" },
  { name: "Travel", count: 1, color: "blue" },
  { name: "Bills", count: 1, color: "red" },
  { name: "Home", count: 1, color: "purple" },
  { name: "Shopping", count: 1, color: "yellow" },
  { name: "Auto", count: 1, color: "orange" },
  { name: "Events", count: 1, color: "pink" },
  { name: "Finance", count: 1, color: "teal" },
];

const upcomingDates = [
  { date: "Today", day: new Date().getDate(), tasks: 2 },
  { date: "Tomorrow", day: new Date().getDate() + 1, tasks: 2 },
  { date: "Friday", day: new Date().getDate() + 3, tasks: 1 },
  { date: "This weekend", day: new Date().getDate() + 5, tasks: 1 },
  { date: "Next week", day: new Date().getDate() + 7, tasks: 2 },
];

const PersonalTasksPage: React.FC = () => {
  const { ref, isInView } = useAnimations();
  const [filter, setFilter] = React.useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = React.useState<'priority' | 'dueDate' | 'category'>('dueDate');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  
  const filteredTasks = personalTasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
      const bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
      return sortDirection === 'desc' ? bValue - aValue : aValue - bValue;
    }
    if (sortBy === 'dueDate') {
      return sortDirection === 'desc' 
        ? b.dueDate.localeCompare(a.dueDate) 
        : a.dueDate.localeCompare(b.dueDate);
    }
    if (sortBy === 'category') {
      return sortDirection === 'desc' 
        ? b.category.localeCompare(a.category) 
        : a.category.localeCompare(b.category);
    }
    return 0;
  });
  
  const handleSortChange = (newSortBy: 'priority' | 'dueDate' | 'category') => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('asc');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Personal Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your personal to-dos and errands</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button size="sm" asChild>
            <Link to="/dashboard/tasks/new">
              <Plus className="h-4 w-4 mr-2" /> Add Task
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            filter === 'all' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            filter === 'active' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            filter === 'completed' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>
      
      {/* Sort Controls */}
      <div className="flex items-center space-x-4 text-sm">
        <span className="text-gray-500">Sort by:</span>
        <button 
          className={`flex items-center ${sortBy === 'priority' ? 'text-primary font-medium' : ''}`}
          onClick={() => handleSortChange('priority')}
        >
          Priority
          {sortBy === 'priority' && (
            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
          )}
        </button>
        <button 
          className={`flex items-center ${sortBy === 'dueDate' ? 'text-primary font-medium' : ''}`}
          onClick={() => handleSortChange('dueDate')}
        >
          Due Date
          {sortBy === 'dueDate' && (
            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
          )}
        </button>
        <button 
          className={`flex items-center ${sortBy === 'category' ? 'text-primary font-medium' : ''}`}
          onClick={() => handleSortChange('category')}
        >
          Category
          {sortBy === 'category' && (
            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
          )}
        </button>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tasks List */}
        <div className="lg:col-span-3 space-y-4">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              priority={task.priority as 'low' | 'medium' | 'high'}
              dueDate={task.dueDate}
              category={task.category}
              completed={task.completed}
            />
          ))}
          
          {sortedTasks.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">No tasks found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {filter === 'completed' 
                  ? "You haven't completed any personal tasks yet." 
                  : "You don't have any personal tasks. Create one to get started."}
              </p>
              <Button asChild>
                <Link to="/dashboard/tasks/new">
                  <Plus className="h-4 w-4 mr-2" /> Add New Task
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`h-3 w-3 rounded-full bg-${category.color}-500 mr-2`}></span>
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5">
                    {category.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Upcoming Dates */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium mb-3">Upcoming</h3>
            <div className="space-y-3">
              {upcomingDates.map((date) => (
                <div key={date.date} className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="font-medium">{date.day}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{date.date}</p>
                    <p className="text-xs text-gray-500">{date.tasks} task{date.tasks !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" /> View in Calendar
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <ListFilter className="h-4 w-4 mr-2" /> Group by Category
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" /> Assign to Someone
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Task Item Component
interface TaskItemProps {
  id: number;
  title: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  category: string;
  completed: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ id, title, priority, dueDate, category, completed }) => {
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
  
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Health: 'bg-green-100 text-green-800',
      Admin: 'bg-gray-100 text-gray-800',
      Travel: 'bg-blue-100 text-blue-800',
      Bills: 'bg-red-100 text-red-800',
      Home: 'bg-purple-100 text-purple-800',
      Shopping: 'bg-yellow-100 text-yellow-800',
      Auto: 'bg-orange-100 text-orange-800',
      Events: 'bg-pink-100 text-pink-800',
      Finance: 'bg-teal-100 text-teal-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${
      completed 
        ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex items-center min-w-0">
        <input
          type="checkbox"
          checked={completed}
          readOnly
          className="h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary mr-3"
        />
        <div className="min-w-0">
          <h3 className={`text-sm font-medium truncate ${
            completed ? 'text-gray-500 dark:text-gray-400 line-through' : ''
          }`}>
            {title}
          </h3>
          <div className="flex items-center mt-1 space-x-2 text-xs text-gray-500">
            <span className={`h-2 w-2 rounded-full ${getPriorityColor(priority)}`}></span>
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {dueDate}
            </span>
            <span className={`px-1.5 py-0.5 rounded ${getCategoryColor(category)}`}>
              {category}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center ml-4">
        <Link 
          to={`/dashboard/tasks/${id}`}
          className="text-gray-400 hover:text-primary"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default PersonalTasksPage;
