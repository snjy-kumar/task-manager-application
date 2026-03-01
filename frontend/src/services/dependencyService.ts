import api from './api';

// Dependency types
export interface Dependency {
  _id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
  completedAt?: string;
  isBlocking?: boolean;
}

// Dependency service
class DependencyService {
  // Add a dependency to a task
  async addDependency(taskId: string, dependencyId: string): Promise<any> {
    const response = await api.post(`/tasks/${taskId}/dependencies`, { dependencyId });
    return response.data.data;
  }

  // Remove a dependency from a task
  async removeDependency(taskId: string, dependencyId: string): Promise<void> {
    await api.delete(`/tasks/${taskId}/dependencies/${dependencyId}`);
  }

  // Get all dependencies for a task
  async getDependencies(taskId: string): Promise<{ canStart: boolean; dependencies: Dependency[] }> {
    const response = await api.get(`/tasks/${taskId}/dependencies`);
    return {
      canStart: response.data.canStart,
      dependencies: response.data.data
    };
  }

  // Get tasks that depend on this task
  async getDependents(taskId: string): Promise<Dependency[]> {
    const response = await api.get(`/tasks/${taskId}/dependencies/dependents`);
    return response.data.data;
  }

  // Check if task can be started
  async canStartTask(taskId: string): Promise<{ canStart: boolean; blockingCount: number }> {
    const response = await api.get(`/tasks/${taskId}/dependencies/can-start`);
    return {
      canStart: response.data.canStart,
      blockingCount: response.data.blockingCount
    };
  }
}

export default new DependencyService();
