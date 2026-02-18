import api from './api';

export interface Subtask {
  _id: string;
  task: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  completedAt?: string;
  order: number;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubtaskData {
  title: string;
  description?: string;
  order?: number;
}

export interface UpdateSubtaskData {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  order?: number;
}

class SubtaskService {
  /**
   * Get all subtasks for a task
   */
  async getSubtasks(taskId: string): Promise<Subtask[]> {
    const response = await api.get<{ success: boolean; subtasks: Subtask[] }>(
      `/tasks/${taskId}/subtasks`
    );
    return response.data.subtasks;
  }

  /**
   * Create a new subtask
   */
  async createSubtask(taskId: string, data: CreateSubtaskData): Promise<Subtask> {
    const response = await api.post<{ success: boolean; subtask: Subtask }>(
      `/tasks/${taskId}/subtasks`,
      data
    );
    return response.data.subtask;
  }

  /**
   * Update a subtask
   */
  async updateSubtask(
    taskId: string,
    subtaskId: string,
    data: UpdateSubtaskData
  ): Promise<Subtask> {
    const response = await api.put<{ success: boolean; subtask: Subtask }>(
      `/tasks/${taskId}/subtasks/${subtaskId}`,
      data
    );
    return response.data.subtask;
  }

  /**
   * Toggle subtask completion status
   */
  async toggleSubtask(taskId: string, subtaskId: string): Promise<Subtask> {
    const response = await api.patch<{ success: boolean; subtask: Subtask }>(
      `/tasks/${taskId}/subtasks/${subtaskId}/toggle`
    );
    return response.data.subtask;
  }

  /**
   * Delete a subtask
   */
  async deleteSubtask(taskId: string, subtaskId: string): Promise<void> {
    await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
  }
}

export default new SubtaskService();
