import api from './api';

export interface TimeEntry {
  _id: string;
  task: string;
  user: string;
  startTime: string;
  endTime?: string;
  duration: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimeEntryData {
  startTime: string;
  endTime: string;
  description?: string;
}

export interface StartTimerData {
  description?: string;
}

class TimeEntryService {
  /**
   * Get all time entries for a task
   */
  async getTimeEntries(taskId: string): Promise<{
    entries: TimeEntry[];
    totalTime: number;
    totalTimeFormatted: string;
  }> {
    const response = await api.get<{
      success: boolean;
      entries: TimeEntry[];
      totalTime: number;
      totalTimeFormatted: string;
    }>(`/tasks/${taskId}/time`);
    return {
      entries: response.data.entries,
      totalTime: response.data.totalTime,
      totalTimeFormatted: response.data.totalTimeFormatted
    };
  }

  /**
   * Start a timer for a task
   */
  async startTimer(taskId: string, data?: StartTimerData): Promise<TimeEntry> {
    const response = await api.post<{ success: boolean; entry: TimeEntry }>(
      `/tasks/${taskId}/time/start`,
      data
    );
    return response.data.entry;
  }

  /**
   * Stop a running timer
   */
  async stopTimer(taskId: string, entryId: string): Promise<TimeEntry> {
    const response = await api.patch<{
      success: boolean;
      entry: TimeEntry;
      durationFormatted: string;
    }>(`/tasks/${taskId}/time/${entryId}/stop`);
    return response.data.entry;
  }

  /**
   * Create a manual time entry
   */
  async createTimeEntry(taskId: string, data: CreateTimeEntryData): Promise<TimeEntry> {
    const response = await api.post<{
      success: boolean;
      entry: TimeEntry;
      durationFormatted: string;
    }>(`/tasks/${taskId}/time`, data);
    return response.data.entry;
  }

  /**
   * Delete a time entry
   */
  async deleteTimeEntry(taskId: string, entryId: string): Promise<void> {
    await api.delete(`/tasks/${taskId}/time/${entryId}`);
  }

  /**
   * Get active timer for the logged-in user
   */
  async getActiveTimer(): Promise<TimeEntry | null> {
    const response = await api.get<{ success: boolean; activeTimer: TimeEntry | null }>(
      '/tasks/time/active'
    );
    return response.data.activeTimer;
  }
}

export default new TimeEntryService();
