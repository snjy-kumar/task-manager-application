import api from './api';

// Notification types
export interface Notification {
  _id: string;
  user: string;
  task?: {
    _id: string;
    title: string;
    status: string;
    priority: string;
  };
  type: 'task_created' | 'task_updated' | 'task_completed' | 'task_overdue' | 'reminder' | 
        'comment_added' | 'dependency_completed' | 'assignment' | 'mention' | 'system';
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  readAt?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationQueryParams {
  status?: 'unread' | 'read' | 'all';
  type?: string;
  limit?: number;
  page?: number;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  pages: number;
}

// Notification service
class NotificationService {
  // Get all notifications for the user
  async getNotifications(params?: NotificationQueryParams): Promise<NotificationResponse> {
    const response = await api.get('/notifications', { params });
    return {
      notifications: response.data.data,
      total: response.data.total,
      unreadCount: response.data.unreadCount,
      page: response.data.page,
      pages: response.data.pages
    };
  }

  // Mark a notification as read
  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data.data;
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read-all');
  }

  // Delete a notification
  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  }

  // Delete all read notifications
  async deleteReadNotifications(): Promise<void> {
    await api.delete('/notifications/read');
  }

  // Get unread notification count
  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread/count');
    return response.data.count;
  }
}

export default new NotificationService();
