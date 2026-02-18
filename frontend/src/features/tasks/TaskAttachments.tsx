import React, { useState, useEffect, useRef } from 'react';
import { Upload, File, Download, Trash2, Paperclip, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import attachmentService, { Attachment, StorageStats } from '@/services/attachmentService';

interface TaskAttachmentsProps {
  taskId: string;
}

const TaskAttachments: React.FC<TaskAttachmentsProps> = ({ taskId }) => {
  const { success, error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    loadAttachments();
    loadStorageStats();
  }, [taskId]);

  const loadAttachments = async () => {
    try {
      setLoading(true);
      const data = await attachmentService.getAttachments(taskId);
      setAttachments(data);
    } catch (error: any) {
      error(error.response?.data?.message || 'Failed to load attachments');
    } finally {
      setLoading(false);
    }
  };

  const loadStorageStats = async () => {
    try {
      const stats = await attachmentService.getStorageStats();
      setStorageStats(stats);
    } catch (error: any) {
      console.error('Failed to load storage stats:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      error('File size exceeds 10MB limit');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Simulate progress (since we don't have real progress tracking)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      await attachmentService.uploadAttachment(taskId, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      success('File uploaded successfully');
      loadAttachments();
      loadStorageStats();

      // Reset
      setTimeout(() => {
        setUploadProgress(0);
        setUploading(false);
      }, 1000);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (uploadError: any) {
      setUploading(false);
      setUploadProgress(0);
      error(uploadError.response?.data?.message || 'Failed to upload file');
    }
  };

  const handleDownload = async (attachment: Attachment) => {
    try {
      const blob = await attachmentService.downloadAttachment(taskId, attachment._id);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      success('File downloaded');
    } catch (downloadError: any) {
      error(downloadError.response?.data?.message || 'Failed to download file');
    }
  };

  const handleDelete = async (attachmentId: string) => {
    if (!confirm('Are you sure you want to delete this attachment?')) return;

    try {
      await attachmentService.deleteAttachment(taskId, attachmentId);
      success('Attachment deleted successfully');
      loadAttachments();
      loadStorageStats();
    } catch (deleteError: any) {
      error(deleteError.response?.data?.message || 'Failed to delete attachment');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '🗜️';
    return '📎';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Storage Stats */}
      {storageStats && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Storage Used
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {storageStats.usedFormatted} / {storageStats.maxFormatted}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(storageStats.percentage, 100)}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {storageStats.attachmentCount} file{storageStats.attachmentCount !== 1 ? 's' : ''} uploaded
          </div>
          {storageStats.percentage > 90 && (
            <div className="mt-3 flex items-start gap-2 text-sm text-orange-700 dark:text-orange-400">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <span>Storage almost full. Consider deleting old attachments.</span>
            </div>
          )}
        </div>
      )}

      {/* Upload Section */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
        />

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || (storageStats?.percentage ?? 0) >= 100}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? `Uploading... ${uploadProgress}%` : 'Upload File'}
        </Button>

        {uploading && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Max file size: 10MB. Supported: Images, PDFs, Documents, Archives
        </p>
      </div>

      {/* Attachments List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Paperclip className="w-5 h-5 mr-2" />
          Attachments ({attachments.length})
        </h3>

        {attachments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
            <File className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No attachments yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Upload files to attach them to this task
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {attachments.map((attachment) => (
              <div
                key={attachment._id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="text-3xl">{getFileIcon(attachment.mimeType)}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {attachment.originalName}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatFileSize(attachment.fileSize)}</span>
                        <span>•</span>
                        <span>{new Date(attachment.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleDownload(attachment)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(attachment._id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskAttachments;
