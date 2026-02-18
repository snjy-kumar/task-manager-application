import api from './api';

// Reminder types
export interface Reminder {
  _id: string;
  task: string | { _id: string; title: string; status: string; priority: string; dueDate: string };
  user: string;
  reminderTime: string;
  type: 'email' | 'in-app' | 'both';
  message?: string;
  isSent: boolean;
  sentAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderData {
  reminderTime: string;
  type?: 'email' | 'in-app' | 'both';
  message?: string;
}

export interface UpdateReminderData {
  reminderTime?: string;
  type?: 'email' | 'in-app' | 'both';
  message?: string;
  isActive?: boolean;
}

// Reminder service
class ReminderService {
  // Create a reminder for a task
  async createReminder(taskId: string, data: CreateReminderData): Promise<Reminder> {
    const response = await api.post(`/tasks/${taskId}/reminders`, data);
    return response.data.data;
  }

  // Get all reminders for a task
  async getTaskReminders(taskId: string): Promise<Reminder[]> {
    const response = await api.get(`/tasks/${taskId}/reminders`);
    return response.data.data;
  }

  // Get all reminders for the authenticated user
  async getUserReminders(status?: 'pending' | 'sent' | 'due' | 'all'): Promise<Reminder[]> {
    const response = await api.get('/reminders', {
      params: { status }
    });
    return response.data.data;
  }

  // Update a reminder
  async updateReminder(taskId: string, reminderId: string, data: UpdateReminderData): Promise<Reminder> {
    const response = await api.put(`/tasks/${taskId}/reminders/${reminderId}`, data);
    return response.data.data;
  }

  // Delete a reminder
  async deleteReminder(taskId: string, reminderId: string): Promise<void> {
    await api.delete(`/tasks/${taskId}/reminders/${reminderId}`);
  }
}

export default new ReminderService();
