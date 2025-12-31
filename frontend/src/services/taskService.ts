import api from './api';

export interface Task {
    _id?: string;
    title: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Archived';
    priority: 'Low' | 'Medium' | 'High';
    dueDate: string;
    user?: string;
    category?: 'Personal' | 'Work' | 'Shopping' | 'Health' | 'Finance' | 'Learning' | 'Other';
    tags?: string[];
    isRecurring?: boolean;
    recurringPattern?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'custom';
    recurringInterval?: number;
    recurringEndDate?: string;
    parentTaskId?: string;
    completedAt?: string;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    // Virtual fields
    isOverdue?: boolean;
    daysUntilDue?: number;
}

export interface CreateTaskData {
    title: string;
    description: string;
    status?: string;
    priority?: string;
    dueDate: string;
    category?: string;
    tags?: string[];
    isRecurring?: boolean;
    recurringPattern?: string;
    recurringInterval?: number;
}

export interface UpdateTaskData extends Partial<CreateTaskData> { }

export interface TasksResponse {
    success: boolean;
    tasks: Task[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface TaskStats {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    archived: number;
    highPriority: number;
    overdue: number;
}

export interface TaskFilters {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    overdue?: boolean;
}

class TaskService {
    /**
     * Get all tasks with pagination and filters
     */
    async getAllTasks(filters: TaskFilters = {}): Promise<TasksResponse> {
        const params = new URLSearchParams();

        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.status) params.append('status', filters.status);
        if (filters.priority) params.append('priority', filters.priority);
        if (filters.search) params.append('search', filters.search);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
        if (filters.overdue) params.append('overdue', 'true');

        const response = await api.get<TasksResponse>(`/tasks?${params.toString()}`);
        return response.data;
    }

    /**
     * Get task statistics
     */
    async getStats(): Promise<TaskStats> {
        const response = await api.get<{ success: boolean; stats: TaskStats }>('/tasks/stats');
        return response.data.stats;
    }

    /**
     * Get single task by ID
     */
    async getTaskById(id: string): Promise<Task> {
        const response = await api.get<{ success: boolean; task: Task }>(`/tasks/${id}`);
        return response.data.task;
    }

    /**
     * Create new task
     */
    async createTask(taskData: CreateTaskData): Promise<Task> {
        const response = await api.post<{ success: boolean; task: Task }>('/tasks', taskData);
        return response.data.task;
    }

    /**
     * Update task
     */
    async updateTask(id: string, taskData: UpdateTaskData): Promise<Task> {
        const response = await api.put<{ success: boolean; task: Task }>(`/tasks/${id}`, taskData);
        return response.data.task;
    }

    /**
     * Delete task (soft delete)
     */
    async deleteTask(id: string): Promise<void> {
        await api.delete(`/tasks/${id}`);
    }

    /**
     * Permanently delete task
     */
    async permanentlyDeleteTask(id: string): Promise<void> {
        await api.delete(`/tasks/${id}/permanent`);
    }

    /**
     * Bulk update tasks
     */
    async bulkUpdate(taskIds: string[], updates: { status?: string; priority?: string }): Promise<number> {
        const response = await api.patch<{ success: boolean; modifiedCount: number }>('/tasks/bulk', {
            taskIds,
            updates
        });
        return response.data.modifiedCount;
    }

    /**
     * Duplicate task
     */
    async duplicateTask(id: string): Promise<Task> {
        const task = await this.getTaskById(id);
        const newTask = await this.createTask({
            title: `${task.title} (Copy)`,
            description: task.description,
            status: 'Pending',
            priority: task.priority,
            dueDate: task.dueDate,
            tags: task.tags
        });
        return newTask;
    }
}

export default new TaskService();
