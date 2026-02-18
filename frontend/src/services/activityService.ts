import api from './api';

export interface Activity {
  _id: string;
  task: string | { _id: string; title: string };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  action: string;
  field?: string;
  oldValue?: any;
  newValue?: any;
  description?: string;
  createdAt: string;
}

export interface ActivityPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

class ActivityService {
  /**
   * Get activity log for a task
   */
  async getTaskActivity(
    taskId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ activities: Activity[]; pagination: ActivityPagination }> {
    const response = await api.get<{
      success: boolean;
      activities: Activity[];
      pagination: ActivityPagination;
    }>(`/tasks/${taskId}/activity?page=${page}&limit=${limit}`);
    return {
      activities: response.data.activities,
      pagination: response.data.pagination
    };
  }

  /**
   * Get activity log for all user tasks
   */
  async getUserActivity(
    page: number = 1,
    limit: number = 50
  ): Promise<{ activities: Activity[]; pagination: ActivityPagination }> {
    const response = await api.get<{
      success: boolean;
      activities: Activity[];
      pagination: ActivityPagination;
    }>(`/activity/user?page=${page}&limit=${limit}`);
    return {
      activities: response.data.activities,
      pagination: response.data.pagination
    };
  }

  /**
   * Get activity statistics
   */
  async getActivityStats(days: number = 7): Promise<{
    byAction: { _id: string; count: number }[];
    total: number;
    period: string;
  }> {
    const response = await api.get<{
      success: boolean;
      stats: {
        byAction: { _id: string; count: number }[];
        total: number;
        period: string;
      };
    }>(`/activity/user/stats?days=${days}`);
    return response.data.stats;
  }
}

export default new ActivityService();
