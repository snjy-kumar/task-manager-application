import api from './api';
import { Task } from './taskService';

// Search filters interface
export interface SearchFilters {
  query?: string;
  status?: string | string[];
  priority?: string | string[];
  category?: string | string[];
  tags?: string | string[];
  dueDateFrom?: string;
  dueDateTo?: string;
  completedDateFrom?: string;
  completedDateTo?: string;
  isRecurring?: boolean;
  hasAttachments?: boolean;
  hasDependencies?: boolean;
  hasComments?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'status' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  tasks: Task[];
  total: number;
  page: number;
  pages: number;
  count: number;
}

export interface SearchSuggestions {
  categories?: string[];
  statuses?: string[];
  priorities?: string[];
  tags?: string[];
}

// Search service
class SearchService {
  // Advanced search with multiple filters
  async advancedSearch(filters: SearchFilters): Promise<SearchResponse> {
    const response = await api.get('/search', { params: filters });
    return {
      tasks: response.data.data,
      total: response.data.total,
      page: response.data.page,
      pages: response.data.pages,
      count: response.data.count
    };
  }

  // Get search suggestions (tags, categories, etc.)
  async getSearchSuggestions(field?: 'tags' | 'categories' | 'statuses' | 'priorities'): Promise<SearchSuggestions> {
    const response = await api.get('/search/suggestions', {
      params: { field }
    });
    return response.data.data;
  }

  // Quick filters for common searches
  async quickFilter(filterName: 'overdue' | 'today' | 'upcoming' | 'high-priority' | 
                                 'recently-completed' | 'no-due-date' | 'recurring', 
                     limit?: number): Promise<Task[]> {
    const response = await api.get(`/search/quick/${filterName}`, {
      params: { limit }
    });
    return response.data.data;
  }
}

export default new SearchService();
