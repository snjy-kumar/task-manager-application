import React, { useEffect, useState, useMemo } from 'react';
import {
  CheckCircle,
  Plus,
  ShoppingCart,
  Trash2,
  PieChart,
  ListChecks,
  ArrowUpDown,
  ExternalLink,
  Share2,
  Loader2,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAnimations } from '@/hooks/useAnimations';
import BentoGrid from '@/components/ui/bento/BentoGrid';
import BentoCard from '@/components/ui/bento/BentoCard';
import taskService, { Task } from '@/services/taskService';
import { useToast } from '@/components/ui/Toast';
import { getPriorityColor, getPriorityOrder } from '@/lib/taskUtils';
import { formatDueDate } from '@/lib/dateUtils';

const ShoppingListPage: React.FC = () => {
  const { ref } = useAnimations();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'purchased'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'priority'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [newItemName, setNewItemName] = useState<string>('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchShoppingTasks();
  }, []);

  const fetchShoppingTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllTasks({ limit: 100 });
      // Filter for shopping tasks
      const shoppingTasks = response.tasks.filter(
        task => task.category === 'Shopping' || task.tags?.some(tag => tag.toLowerCase() === 'shopping')
      );
      setTasks(shoppingTasks);
    } catch (error) {
      console.error('Failed to fetch shopping tasks:', error);
      showToast('Failed to load shopping list', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
      await taskService.updateTask(taskId, { status: newStatus });
      setTasks(tasks.map(task =>
        task._id === taskId ? { ...task, status: newStatus as Task['status'] } : task
      ));
      showToast(`Item ${newStatus === 'Completed' ? 'purchased' : 'added back to list'}`, 'success');
    } catch (error) {
      console.error('Failed to update task:', error);
      showToast('Failed to update item', 'error');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
      showToast('Item removed from list', 'success');
    } catch (error) {
      console.error('Failed to delete task:', error);
      showToast('Failed to remove item', 'error');
    }
  };

  const filteredItems = tasks.filter(task => {
    // Filter by purchase status
    if (filter === 'pending' && task.status === 'Completed') return false;
    if (filter === 'purchased' && task.status !== 'Completed') return false;

    // Filter by category/tags
    if (categoryFilter !== 'all') {
      const hasMatchingTag = task.tags?.some(tag =>
        tag.toLowerCase() === categoryFilter.toLowerCase()
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'desc'
        ? b.title.localeCompare(a.title)
        : a.title.localeCompare(b.title);
    }
    if (sortBy === 'priority') {
      const aValue = getPriorityOrder(a.priority);
      const bValue = getPriorityOrder(b.priority);
      return sortDirection === 'desc' ? bValue - aValue : aValue - bValue;
    }
    return 0;
  });

  const handleSortChange = (newSortBy: 'name' | 'price' | 'priority') => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('asc');
    }
  };

  const handleNewItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      const newTask = await taskService.createTask({
        title: newItemName,
        description: 'Shopping item',
        category: 'Shopping',
        priority: 'Medium',
        status: 'Pending',
        dueDate: new Date().toISOString(),
        tags: ['shopping']
      });
      setTasks([...tasks, newTask]);
      setNewItemName('');
      showToast('Item added to list', 'success');
    } catch (error) {
      console.error('Failed to create task:', error);
      showToast('Failed to add item', 'error');
    }
  };

  // Generate category stats from tags
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    tasks.forEach(task => {
      task.tags?.forEach(tag => {
        if (tag.toLowerCase() !== 'shopping') {
          const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
          stats[capitalizedTag] = (stats[capitalizedTag] || 0) + 1;
        }
      });
    });
    return Object.entries(stats).map(([name, count]) => ({ name, count }));
  }, [tasks]);

  const totalItems = tasks.length;
  const purchasedItems = tasks.filter(task => task.status === 'Completed').length;
  const pendingItems = totalItems - purchasedItems;
  const completionRate = totalItems > 0 ? Math.round((purchasedItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shopping List</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your shopping needs efficiently</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" size="sm" className="transition-all duration-300">
            <Share2 className="h-4 w-4 mr-2" /> Share List
          </Button>
          <Button size="sm" asChild className="transition-all duration-300">
            <Link to="/dashboard/tasks/new">
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Link>
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {!loading && (
        <>
          {/* Overview Cards */}
          <BentoGrid cols={3} gap="md" ref={ref}>
            <BentoCard
              title="List Overview"
              icon={<ShoppingCart className="h-5 w-5" />}
              size="sm"
            >
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="bg-primary/10 p-2 rounded-lg text-center">
                  <span className="text-xl font-bold">{totalItems}</span>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
                <div className="bg-green-500/10 p-2 rounded-lg text-center">
                  <span className="text-xl font-bold">{purchasedItems}</span>
                  <p className="text-xs text-gray-500">Purchased</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800/10 p-2 rounded-lg text-center">
                  <span className="text-xl font-bold">{pendingItems}</span>
                  <p className="text-xs text-gray-500">To Buy</p>
                </div>
              </div>
            </BentoCard>

            <BentoCard
              title="Completion Rate"
              icon={<CheckCircle className="h-5 w-5" />}
              size="sm"
            >
              <div className="mt-2">
                <div className="text-center mb-2">
                  <span className="text-2xl font-bold">{completionRate}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Progress:</span>
                  <span className="text-primary font-medium">{purchasedItems} of {totalItems}</span>
                </div>
              </div>
            </BentoCard>

            <BentoCard
              title="Category Breakdown"
              icon={<PieChart className="h-5 w-5" />}
              size="sm"
            >
              <div className="mt-2 space-y-2">
                {categoryStats.slice(0, 3).map(category => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="h-3 w-3 rounded-full bg-gray-400 dark:bg-gray-600 mr-2"></span>
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <span className="text-xs">{category.count} items</span>
                  </div>
                ))}
                {categoryStats.length > 3 && (
                  <button
                    className="text-xs text-gray-600 dark:text-gray-400 hover:underline w-full text-left"
                    onClick={() => setCategoryFilter('all')}
                  >
                    View All Categories
                  </button>
                )}
                {categoryStats.length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-2">No categories yet</p>
                )}
              </div>
            </BentoCard>
          </BentoGrid>

          {/* Quick Add Form */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4">
            <form onSubmit={handleNewItemSubmit} className="flex gap-2">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Add item to shopping list..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300"
              />
              <Button type="submit" size="sm" className="transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </form>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${filter === 'all' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'
                }`}
              onClick={() => setFilter('all')}
            >
              All Items
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${filter === 'pending' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'
                }`}
              onClick={() => setFilter('pending')}
            >
              To Buy
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${filter === 'purchased' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'
                }`}
              onClick={() => setFilter('purchased')}
            >
              Purchased
            </button>
          </div>

          {/* Sort and Category Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-500">Sort by:</span>
              <button
                className={`flex items-center transition-all duration-300 ${sortBy === 'name' ? 'text-gray-900 dark:text-white font-medium' : ''}`}
                onClick={() => handleSortChange('name')}
              >
                Name
                {sortBy === 'name' && <ArrowUpDown className="h-3 w-3 ml-1" />}
              </button>
              <button
                className={`flex items-center transition-all duration-300 ${sortBy === 'priority' ? 'text-gray-900 dark:text-white font-medium' : ''}`}
                onClick={() => handleSortChange('priority')}
              >
                Priority
                {sortBy === 'priority' && <ArrowUpDown className="h-3 w-3 ml-1" />}
              </button>
            </div>

            {categoryStats.length > 0 && (
              <div className="flex items-center space-x-2">
                <label htmlFor="category-filter" className="text-sm text-gray-500">Category:</label>
                <select
                  id="category-filter"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-1 px-2 transition-all duration-300"
                >
                  <option value="all">All Categories</option>
                  {categoryStats.map(category => (
                    <option key={category.name} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Shopping Items List */}
            <div className="lg:col-span-3 space-y-4">
              {sortedItems.map((task) => (
                <ShoppingItem
                  key={task._id}
                  task={task}
                  onToggle={handleTaskToggle}
                  onDelete={handleDeleteTask}
                />
              ))}

              {sortedItems.length === 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <ShoppingCart className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No items found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {filter === 'purchased'
                      ? "You haven't purchased any items yet."
                      : filter === 'pending'
                        ? "No items left to buy. Your shopping is complete!"
                        : "Your shopping list is empty. Add some items to get started."}
                  </p>
                  <Button className="transition-all duration-300" onClick={() => document.querySelector('input[type="text"]')?.focus()}>
                    <Plus className="h-4 w-4 mr-2" /> Add New Item
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Categories */}
              {categoryStats.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4">
                  <h3 className="text-lg font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categoryStats.map((category) => (
                      <div
                        key={category.name}
                        className={`flex items-center justify-between py-1 px-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ${categoryFilter === category.name ? 'bg-gray-100 dark:bg-gray-700' : ''
                          }`}
                        onClick={() => setCategoryFilter(category.name === categoryFilter ? 'all' : category.name)}
                      >
                        <div className="flex items-center">
                          <span className="h-3 w-3 rounded-full bg-gray-400 dark:bg-gray-600 mr-2"></span>
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5">
                          {category.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4">
                <h3 className="text-lg font-medium mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start transition-all duration-300">
                    <CheckCircle className="h-4 w-4 mr-2" /> Mark All as Purchased
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start transition-all duration-300">
                    <ListChecks className="h-4 w-4 mr-2" /> Clear Purchased Items
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start transition-all duration-300">
                    <ExternalLink className="h-4 w-4 mr-2" /> Export List
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Shopping Item Component
interface ShoppingItemProps {
  task: Task;
  onToggle: (taskId: string, currentStatus: string) => void;
  onDelete: (taskId: string) => void;
}

const ShoppingItem: React.FC<ShoppingItemProps> = ({ task, onToggle, onDelete }) => {
  const isPurchased = task.status === 'Completed';
  const priorityColorClass = getPriorityColor(task.priority);
  const additionalTags = task.tags?.filter(tag => tag.toLowerCase() !== 'shopping') || [];

  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${isPurchased
      ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
      }`}>
      <div className="flex items-center min-w-0 flex-1">
        <input
          type="checkbox"
          checked={isPurchased}
          onChange={() => onToggle(task._id, task.status)}
          className="h-5 w-5 text-gray-600 dark:text-gray-400 rounded border-gray-300 focus:ring-gray-500 mr-3 cursor-pointer"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-medium truncate ${isPurchased ? 'text-gray-500 dark:text-gray-400 line-through' : ''
              }`}>
              {task.title}
            </h3>
          </div>
          <div className="flex flex-wrap items-center mt-1 gap-x-3 gap-y-1 text-xs text-gray-500">
            <span className={`h-2 w-2 rounded-full ${priorityColorClass}`}></span>
            {task.dueDate && (
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDueDate(task.dueDate)}
              </span>
            )}
            {additionalTags.map(tag => (
              <span key={tag} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                {tag}
              </span>
            ))}
            {task.isOverdue && !isPurchased && (
              <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                Needed now
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center ml-4 space-x-1">
        <Link
          to={`/dashboard/tasks/${task._id}`}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 transition-all duration-300"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
        <button
          onClick={() => onDelete(task._id)}
          className="text-gray-400 hover:text-red-500 p-1 transition-all duration-300"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ShoppingListPage;
