import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  Filter, 
  Plus,
  Tag,
  ShoppingCart,
  Trash2,
  DollarSign,
  PieChart,
  ListChecks,
  ArrowUpDown,
  ExternalLink,
  Edit,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAnimations } from '@/hooks/useAnimations';
import BentoGrid from '@/components/ui/bento/BentoGrid';
import BentoCard from '@/components/ui/bento/BentoCard';

// Sample data for shopping items
const shoppingItems = [
  { id: 1, name: "Milk", category: "Dairy", quantity: 2, unit: "gallon", price: 3.99, store: "Grocery Store", priority: "high", purchased: false },
  { id: 2, name: "Eggs", category: "Dairy", quantity: 1, unit: "dozen", price: 2.49, store: "Grocery Store", priority: "high", purchased: false },
  { id: 3, name: "Bread", category: "Bakery", quantity: 1, unit: "loaf", price: 2.99, store: "Grocery Store", priority: "medium", purchased: false },
  { id: 4, name: "Chicken Breast", category: "Meat", quantity: 2, unit: "lb", price: 5.99, store: "Grocery Store", priority: "medium", purchased: false },
  { id: 5, name: "Apples", category: "Produce", quantity: 5, unit: "lb", price: 3.49, store: "Farmers Market", priority: "low", purchased: false },
  { id: 6, name: "Bananas", category: "Produce", quantity: 1, unit: "bunch", price: 1.29, store: "Grocery Store", priority: "low", purchased: false },
  { id: 7, name: "Laundry Detergent", category: "Household", quantity: 1, unit: "bottle", price: 8.99, store: "Supermarket", priority: "medium", purchased: false },
  { id: 8, name: "Paper Towels", category: "Household", quantity: 1, unit: "pack", price: 7.49, store: "Supermarket", priority: "low", purchased: true },
  { id: 9, name: "Toothpaste", category: "Personal Care", quantity: 2, unit: "tube", price: 3.29, store: "Pharmacy", priority: "medium", purchased: true },
  { id: 10, name: "Coffee", category: "Beverages", quantity: 1, unit: "bag", price: 12.99, store: "Specialty Store", priority: "high", purchased: false },
  { id: 11, name: "Pasta", category: "Dry Goods", quantity: 2, unit: "box", price: 1.49, store: "Grocery Store", priority: "low", purchased: false },
  { id: 12, name: "Tomato Sauce", category: "Canned Goods", quantity: 3, unit: "jar", price: 2.79, store: "Grocery Store", priority: "low", purchased: false },
];

const categories = [
  { name: "Dairy", count: 2, color: "blue" },
  { name: "Bakery", count: 1, color: "yellow" },
  { name: "Meat", count: 1, color: "red" },
  { name: "Produce", count: 2, color: "green" },
  { name: "Household", count: 2, color: "purple" },
  { name: "Personal Care", count: 1, color: "pink" },
  { name: "Beverages", count: 1, color: "orange" },
  { name: "Dry Goods", count: 1, color: "amber" },
  { name: "Canned Goods", count: 1, color: "teal" }
];

const stores = [
  { name: "Grocery Store", count: 7, color: "blue" },
  { name: "Farmers Market", count: 1, color: "green" },
  { name: "Supermarket", count: 2, color: "orange" },
  { name: "Pharmacy", count: 1, color: "red" },
  { name: "Specialty Store", count: 1, color: "purple" }
];

const ShoppingListPage: React.FC = () => {
  const { ref, isInView } = useAnimations();
  const [filter, setFilter] = React.useState<'all' | 'pending' | 'purchased'>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<'name' | 'price' | 'priority'>('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [newItemName, setNewItemName] = React.useState<string>('');
  
  const filteredItems = shoppingItems.filter(item => {
    // Filter by purchase status
    if (filter === 'pending' && item.purchased) return false;
    if (filter === 'purchased' && !item.purchased) return false;
    
    // Filter by category
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    
    return true;
  });
  
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'desc' 
        ? b.name.localeCompare(a.name) 
        : a.name.localeCompare(b.name);
    }
    if (sortBy === 'price') {
      return sortDirection === 'desc' 
        ? b.price - a.price 
        : a.price - b.price;
    }
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
      const bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
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
  
  const handleNewItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    
    // In a real app, you'd add the item to the list
    setNewItemName('');
  };
  
  const totalItems = shoppingItems.length;
  const purchasedItems = shoppingItems.filter(item => item.purchased).length;
  const totalEstimatedCost = shoppingItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shopping List</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your shopping needs efficiently</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" /> Share List
          </Button>
          <Button size="sm" asChild>
            <Link to="/dashboard/tasks/new">
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Link>
          </Button>
        </div>
      </div>
      
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
            <div className="bg-yellow-500/10 p-2 rounded-lg text-center">
              <span className="text-xl font-bold">{totalItems - purchasedItems}</span>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </BentoCard>
        
        <BentoCard
          title="Estimated Cost"
          icon={<DollarSign className="h-5 w-5" />}
          size="sm"
        >
          <div className="mt-2">
            <div className="text-center mb-2">
              <span className="text-2xl font-bold">${totalEstimatedCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Budget:</span>
              <span className="text-green-500">$100.00</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${Math.min(100, (totalEstimatedCost/100)*100)}%` }} 
              />
            </div>
          </div>
        </BentoCard>
        
        <BentoCard
          title="Category Breakdown"
          icon={<PieChart className="h-5 w-5" />}
          size="sm"
        >
          <div className="mt-2 space-y-2">
            {categories.slice(0, 3).map(category => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`h-3 w-3 rounded-full bg-${category.color}-500 mr-2`}></span>
                  <span className="text-sm">{category.name}</span>
                </div>
                <span className="text-xs">{category.count} items</span>
              </div>
            ))}
            <button 
              className="text-xs text-primary hover:underline"
              onClick={() => setCategoryFilter('all')}
            >
              View All Categories
            </button>
          </div>
        </BentoCard>
      </BentoGrid>
      
      {/* Quick Add Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <form onSubmit={handleNewItemSubmit} className="flex gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add item to shopping list..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <Button type="submit" size="sm">
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </form>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            filter === 'all' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setFilter('all')}
        >
          All Items
        </button>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            filter === 'pending' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setFilter('pending')}
        >
          To Buy
        </button>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            filter === 'purchased' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'
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
            className={`flex items-center ${sortBy === 'name' ? 'text-primary font-medium' : ''}`}
            onClick={() => handleSortChange('name')}
          >
            Name
            {sortBy === 'name' && <ArrowUpDown className="h-3 w-3 ml-1" />}
          </button>
          <button 
            className={`flex items-center ${sortBy === 'price' ? 'text-primary font-medium' : ''}`}
            onClick={() => handleSortChange('price')}
          >
            Price
            {sortBy === 'price' && <ArrowUpDown className="h-3 w-3 ml-1" />}
          </button>
          <button 
            className={`flex items-center ${sortBy === 'priority' ? 'text-primary font-medium' : ''}`}
            onClick={() => handleSortChange('priority')}
          >
            Priority
            {sortBy === 'priority' && <ArrowUpDown className="h-3 w-3 ml-1" />}
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="category-filter" className="text-sm text-gray-500">Category:</label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-1 px-2"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.name} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Shopping Items List */}
        <div className="lg:col-span-3 space-y-4">
          {sortedItems.map((item) => (
            <ShoppingItem
              key={item.id}
              item={item}
            />
          ))}
          
          {sortedItems.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
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
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add New Item
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
                <div 
                  key={category.name} 
                  className={`flex items-center justify-between py-1 px-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    categoryFilter === category.name ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                  onClick={() => setCategoryFilter(category.name === categoryFilter ? 'all' : category.name)}
                >
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
          
          {/* Stores */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium mb-3">Stores</h3>
            <div className="space-y-2">
              {stores.map((store) => (
                <div key={store.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`h-3 w-3 rounded-full bg-${store.color}-500 mr-2`}></span>
                    <span className="text-sm">{store.name}</span>
                  </div>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5">
                    {store.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <CheckCircle className="h-4 w-4 mr-2" /> Mark All as Purchased
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <ListChecks className="h-4 w-4 mr-2" /> Clear Purchased Items
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" /> Export List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shopping Item Component
interface ShoppingItemProps {
  item: {
    id: number;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    price: number;
    store: string;
    priority: string;
    purchased: boolean;
  };
}

const ShoppingItem: React.FC<ShoppingItemProps> = ({ item }) => {
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
      "Dairy": 'bg-blue-100 text-blue-800',
      "Bakery": 'bg-yellow-100 text-yellow-800',
      "Meat": 'bg-red-100 text-red-800',
      "Produce": 'bg-green-100 text-green-800',
      "Household": 'bg-purple-100 text-purple-800',
      "Personal Care": 'bg-pink-100 text-pink-800',
      "Beverages": 'bg-orange-100 text-orange-800',
      "Dry Goods": 'bg-amber-100 text-amber-800',
      "Canned Goods": 'bg-teal-100 text-teal-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${
      item.purchased 
        ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex items-center min-w-0 flex-1">
        <input
          type="checkbox"
          checked={item.purchased}
          readOnly
          className="h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary mr-3"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-medium truncate ${
              item.purchased ? 'text-gray-500 dark:text-gray-400 line-through' : ''
            }`}>
              {item.name}
            </h3>
            <span className="ml-2 text-sm font-medium">${item.price.toFixed(2)}</span>
          </div>
          <div className="flex flex-wrap items-center mt-1 gap-x-3 gap-y-1 text-xs text-gray-500">
            <span>
              {item.quantity} {item.unit}
            </span>
            <span className={`h-2 w-2 rounded-full ${getPriorityColor(item.priority)}`}></span>
            <span className={`px-1.5 py-0.5 rounded ${getCategoryColor(item.category)}`}>
              {item.category}
            </span>
            <span>
              {item.store}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center ml-4 space-x-1">
        <button className="text-gray-400 hover:text-primary p-1">
          <Edit className="h-4 w-4" />
        </button>
        <button className="text-gray-400 hover:text-red-500 p-1">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ShoppingListPage;
