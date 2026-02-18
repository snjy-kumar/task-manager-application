import api from './api';

export interface TaskTemplate {
  _id: string;
  user: string;
  name: string;
  description?: string;
  template: {
    title: string;
    description?: string;
    priority: 'Low' | 'Medium' | 'High';
    category: 'Personal' | 'Work' | 'Shopping' | 'Health' | 'Finance' | 'Learning' | 'Other';
    tags?: string[];
    estimatedDuration?: number;
    subtasks?: {
      title: string;
      description?: string;
      order?: number;
    }[];
    isRecurring?: boolean;
    recurringPattern?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'custom';
  };
  isPublic: boolean;
  useCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateData {
  name: string;
  description?: string;
  template: TaskTemplate['template'];
  isPublic?: boolean;
}

export interface CreateTaskFromTemplateData {
  dueDate?: string;
  additionalData?: any;
}

class TemplateService {
  /**
   * Get all templates (user's + public)
   */
  async getTemplates(): Promise<TaskTemplate[]> {
    const response = await api.get<{ success: boolean; templates: TaskTemplate[] }>(
      '/templates'
    );
    return response.data.templates;
  }

  /**
   * Get popular public templates
   */
  async getPopularTemplates(): Promise<TaskTemplate[]> {
    const response = await api.get<{ success: boolean; templates: TaskTemplate[] }>(
      '/templates/popular'
    );
    return response.data.templates;
  }

  /**
   * Create a new template
   */
  async createTemplate(data: CreateTemplateData): Promise<TaskTemplate> {
    const response = await api.post<{ success: boolean; template: TaskTemplate }>(
      '/templates',
      data
    );
    return response.data.template;
  }

  /**
   * Create a task from a template
   */
  async createTaskFromTemplate(
    templateId: string,
    data: CreateTaskFromTemplateData
  ): Promise<any> {
    const response = await api.post<{ success: boolean; task: any }>(
      `/templates/${templateId}/create-task`,
      data
    );
    return response.data.task;
  }

  /**
   * Update a template
   */
  async updateTemplate(
    templateId: string,
    data: Partial<CreateTemplateData>
  ): Promise<TaskTemplate> {
    const response = await api.put<{ success: boolean; template: TaskTemplate }>(
      `/templates/${templateId}`,
      data
    );
    return response.data.template;
  }

  /**
   * Delete a template
   */
  async deleteTemplate(templateId: string): Promise<void> {
    await api.delete(`/templates/${templateId}`);
  }
}

export default new TemplateService();
