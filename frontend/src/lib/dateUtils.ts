/**
 * Date utility functions for consistent date formatting across the application
 */

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatShortDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTimeAgo = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;

  return formatShortDate(dateString);
};

export const formatDueDate = (dateString: string, status: string): { text: string; color: string } => {
  const date = new Date(dateString);
  const today = new Date();
  const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (status === 'Completed') {
    return { text: 'Completed', color: 'text-green-500' };
  }

  if (diffDays < 0) {
    return { text: `${Math.abs(diffDays)}d overdue`, color: 'text-red-500' };
  }
  if (diffDays === 0) {
    return { text: 'Today', color: 'text-orange-500' };
  }
  if (diffDays === 1) {
    return { text: 'Tomorrow', color: 'text-yellow-500' };
  }
  if (diffDays <= 7) {
    return { text: `${diffDays}d left`, color: 'text-blue-500' };
  }

  return {
    text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    color: 'text-gray-500'
  };
};

export const getDaysUntilDue = (dueDate: string): number => {
  const date = new Date(dueDate);
  const today = new Date();
  return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isTomorrow = (dateString: string): boolean => {
  const date = new Date(dateString);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
};

export const isThisWeek = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(today.getDate() + 7);
  return date >= today && date <= weekFromNow;
};

export const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

export const getRelativeTimeString = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) return `${Math.abs(diffInDays)} days ago`;
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Tomorrow';
  if (diffInDays < 7) return `In ${diffInDays} days`;
  if (diffInDays < 30) return `In ${Math.floor(diffInDays / 7)} weeks`;
  
  return formatShortDate(dateString);
};
