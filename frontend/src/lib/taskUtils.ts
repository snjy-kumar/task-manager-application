/**
 * Task utility functions for consistent handling across the application
 */

export const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'low':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
};

export const getPriorityBadgeColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
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

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Completed':
      return 'text-green-600 dark:text-green-400';
    case 'In Progress':
      return 'text-blue-600 dark:text-blue-400';
    case 'Pending':
      return 'text-gray-600 dark:text-gray-400';
    case 'Archived':
      return 'text-gray-500 dark:text-gray-500';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

export const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'In Progress':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'Pending':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    case 'Archived':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
};

export const getStatusBorderColor = (status: string): string => {
  switch (status) {
    case 'Completed':
      return 'border-l-green-400';
    case 'In Progress':
      return 'border-l-blue-400';
    case 'Pending':
      return 'border-l-gray-400';
    case 'Archived':
      return 'border-l-gray-300';
    default:
      return 'border-l-gray-400';
  }
};

export const getCategoryColor = (category?: string): string => {
  switch (category?.toLowerCase()) {
    case 'personal':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'work':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'shopping':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'health':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'finance':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'learning':
      return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
};

export const getPriorityOrder = (priority: string): number => {
  const order = { high: 3, medium: 2, low: 1 };
  return order[priority.toLowerCase() as keyof typeof order] || 0;
};

export const isTaskOverdue = (dueDate: string, status: string): boolean => {
  if (status === 'Completed' || status === 'Archived') return false;
  return new Date(dueDate) < new Date();
};

export const getTaskStatusIcon = (status: string): string => {
  switch (status) {
    case 'Completed':
      return '✓';
    case 'In Progress':
      return '⟳';
    case 'Pending':
      return '○';
    case 'Archived':
      return '□';
    default:
      return '○';
  }
};
