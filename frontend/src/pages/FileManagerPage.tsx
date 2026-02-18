import React, { useState, useEffect } from 'react';
import {
    File,
    FileText,
    Image,
    FileSpreadsheet,
    Archive,
    Download,
    Trash2,
    HardDrive,
    Loader2,
    ExternalLink,
    Filter,
    Calendar,
    Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import attachmentService, { Attachment, StorageStats } from '@/services/attachmentService';
import { Link } from 'react-router-dom';

const FileManagerPage: React.FC = () => {
    const { success, error, info } = useToast();
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>('');
    const [sortBy, setSortBy] = useState<'name' | 'size' | 'date'>('date');

    useEffect(() => {
        loadAllAttachments();
        loadStorageStats();
    }, []);

    const loadAllAttachments = async () => {
        setLoading(true);
        try {
            // Note: This would need a backend endpoint to get all user attachments
            // For now, we'll show a message that this needs implementation
            info('Loading all attachments...');
            // const data = await attachmentService.getAllUserAttachments();
            // setAttachments(data);
            setAttachments([]); // Temporary
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to load attachments');
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

    const handleDelete = async (taskId: string, attachmentId: string) => {
        if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
            return;
        }

        try {
            await attachmentService.deleteAttachment(taskId, attachmentId);
            success('File deleted successfully');
            loadAllAttachments();
            loadStorageStats();
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to delete file');
        }
    };

    const handleDownload = async (taskId: string, attachmentId: string, fileName: string) => {
        try {
            const blob = await attachmentService.downloadAttachment(taskId, attachmentId);

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            success('Download started');
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to download file');
        }
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) {
            return <Image className="w-5 h-5 text-purple-600" />;
        } else if (mimeType.includes('pdf')) {
            return <FileText className="w-5 h-5 text-red-600" />;
        } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
            return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
        } else if (mimeType.includes('zip') || mimeType.includes('rar')) {
            return <Archive className="w-5 h-5 text-orange-600" />;
        } else {
            return <File className="w-5 h-5 text-blue-600" />;
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const getStoragePercentage = () => {
        if (!storageStats) return 0;
        return (storageStats.used / storageStats.max) * 100;
    };

    const getStorageBarColor = () => {
        const percentage = getStoragePercentage();
        if (percentage >= 90) return 'bg-red-600';
        if (percentage >= 75) return 'bg-orange-600';
        if (percentage >= 50) return 'bg-yellow-600';
        return 'bg-green-600';
    };

    const filterAndSortAttachments = () => {
        let filtered = [...attachments];

        // Apply type filter
        if (filterType) {
            filtered = filtered.filter(att => att.mimeType.includes(filterType));
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.originalName.localeCompare(b.originalName);
                case 'size':
                    return b.fileSize - a.fileSize;
                case 'date':
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

        return filtered;
    };

    const filteredAttachments = filterAndSortAttachments();

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    File Manager
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage all your task attachments and files
                </p>
            </div>

            {/* Storage Stats */}
            {storageStats && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                <HardDrive className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Storage Usage</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {storageStats.usedFormatted} of {storageStats.maxFormatted} used
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {Math.round(getStoragePercentage())}%
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {storageStats.attachmentCount} files
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-full ${getStorageBarColor()} transition-all duration-300 rounded-full`}
                            style={{ width: `${Math.min(getStoragePercentage(), 100)}%` }}
                        ></div>
                    </div>

                    {/* Warning */}
                    {getStoragePercentage() >= 90 && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-800 dark:text-red-300">
                                ⚠️ Your storage is almost full. Consider deleting unused files.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Filters and Sort */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter & Sort:</span>
                    </div>

                    {/* File Type Filter */}
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    >
                        <option value="">All File Types</option>
                        <option value="image">Images</option>
                        <option value="pdf">PDF Documents</option>
                        <option value="spreadsheet">Spreadsheets</option>
                        <option value="zip">Archives</option>
                        <option value="text">Text Files</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    >
                        <option value="date">Sort by Date</option>
                        <option value="name">Sort by Name</option>
                        <option value="size">Sort by Size</option>
                    </select>
                </div>
            </div>

            {/* Files List */}
            {loading ? (
                <div className="flex items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : filteredAttachments.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <Database className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        No files found
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Note: Backend endpoint for all user attachments needs to be implemented
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredAttachments.map((attachment) => (
                            <div
                                key={attachment._id}
                                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    {/* File Icon */}
                                    <div className="flex-shrink-0">
                                        {getFileIcon(attachment.mimeType)}
                                    </div>

                                    {/* File Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                                {attachment.originalName}
                                            </h4>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                            <span>{formatFileSize(attachment.fileSize)}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(attachment.createdAt).toLocaleDateString()}
                                            </span>
                                            <span>•</span>
                                            <Link
                                                to={`/dashboard/tasks/${attachment.task}`}
                                                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                            >
                                                View Task <ExternalLink className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDownload(attachment.task, attachment._id, attachment.fileName)}
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(attachment.task, attachment._id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Info Section */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex gap-3">
                    <File className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                        <p className="font-semibold mb-2">Storage Information:</p>
                        <ul className="space-y-1 list-disc list-inside">
                            <li>Maximum file size: 10 MB per file</li>
                            <li>Total storage limit: 100 MB per user</li>
                            <li>Supported file types: Images, PDFs, Documents, Spreadsheets, Archives, Text files</li>
                            <li>Files are automatically scanned for security</li>
                            <li>Deleted files cannot be recovered</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileManagerPage;
