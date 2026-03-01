import api from './api';

// Attachment types
export interface Attachment {
  _id: string;
  task: string;
  user: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  fileUrl: string;
  uploadPath: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StorageStats {
  used: number;
  max: number;
  percentage: number;
  attachmentCount: number;
  usedFormatted: string;
  maxFormatted: string;
}

// Attachment service
class AttachmentService {
  // Upload a file attachment
  async uploadAttachment(taskId: string, file: File): Promise<Attachment> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/tasks/${taskId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  }

  // Get all attachments for a task
  async getAttachments(taskId: string): Promise<Attachment[]> {
    const response = await api.get(`/tasks/${taskId}/attachments`);
    return response.data.data;
  }

  // Delete an attachment
  async deleteAttachment(taskId: string, attachmentId: string): Promise<void> {
    await api.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
  }

  // Download an attachment
  async downloadAttachment(taskId: string, attachmentId: string): Promise<Blob> {
    const response = await api.get(`/tasks/${taskId}/attachments/${attachmentId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Get storage stats
  async getStorageStats(): Promise<StorageStats> {
    const response = await api.get('/tasks/storage-stats');
    return response.data.data;
  }
}

export default new AttachmentService();
