import api from './api';

// Import/Export service
class ImportExportService {
  // Export tasks to CSV
  async exportToCSV(filters?: {
    status?: string;
    priority?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Blob> {
    const response = await api.get('/tasks/export/csv', {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  }

  // Export tasks to JSON
  async exportToJSON(filters?: {
    status?: string;
    priority?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    includeSubtasks?: boolean;
  }): Promise<Blob> {
    const response = await api.get('/tasks/export/json', {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  }

  // Import tasks from JSON
  async importFromJSON(tasks: any[], mode: 'add' | 'replace' = 'add'): Promise<{
    imported: number;
    failed: number;
    errors: any[];
  }> {
    const response = await api.post('/tasks/import/json', {
      tasks,
      mode
    });
    return {
      imported: response.data.imported,
      failed: response.data.failed,
      errors: response.data.data.errors
    };
  }

  // Get import template
  async getImportTemplate(): Promise<Blob> {
    const response = await api.get('/tasks/import/template', {
      responseType: 'blob'
    });
    return response.data;
  }

  // Helper to download blob as file
  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export default new ImportExportService();
