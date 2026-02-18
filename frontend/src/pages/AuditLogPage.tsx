import React, { useState, useEffect } from 'react';
import {
    Activity as ActivityIcon,
    Eye,
    Edit,
    Trash2,
    Plus,
    CheckCircle2,
    Clock,
    User,
    Calendar,
    Filter,
    Download,
    Loader2,
    FileText,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import activityService, { Activity as ActivityType } from '@/services/activityService';

const AuditLogPage: React.FC = () => {
    const { error } = useToast();
    const [activities, setActivities] = useState<ActivityType[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterAction, setFilterAction] = useState<string>('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadActivities();
    }, [page, filterAction, filterDateFrom, filterDateTo]);

    const loadActivities = async () => {
        setLoading(true);
        try {
            const filters: any = { page, limit: 20 };
            if (filterAction) filters.action = filterAction;
            if (filterDateFrom) filters.dateFrom = filterDateFrom;
            if (filterDateTo) filters.dateTo = filterDateTo;

            // Note: This would need to be an endpoint that gets all user activities
            // For now using task-specific activities as placeholder
            const data = await activityService.getUserActivity(page, 20);
            setActivities(data.activities || data);
            setTotalPages(data.pagination?.total || 1);
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to load activity log');
        } finally {
            setLoading(false);
        }
    };

    const getActionIcon = (action: string) => {
        switch (action.toLowerCase()) {
            case 'created':
                return <Plus className="w-5 h-5 text-green-600" />;
            case 'updated':
                return <Edit className="w-5 h-5 text-blue-600" />;
            case 'deleted':
                return <Trash2 className="w-5 h-5 text-red-600" />;
            case 'completed':
                return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            case 'viewed':
                return <Eye className="w5 h-5 text-gray-600" />;
            case 'status_changed':
                return <ActivityIcon className="w-5 h-5 text-purple-600" />;
            default:
                return <ActivityIcon className="w-5 h-5 text-gray-600" />;
        }
    };

    const getActionBadgeColor = (action: string) => {
        switch (action.toLowerCase()) {
            case 'created':
                return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
            case 'updated':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
            case 'deleted':
                return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
            case 'completed':
                return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
            case 'viewed':
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
            default:
                return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const handleExport = () => {
        console.log('Exporting activity log...');
        // Implementation for exporting logs
    };

    const clearFilters = () => {
        setFilterAction('');
        setFilterDateFrom('');
        setFilterDateTo('');
        setPage(1);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Activity Log
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Track all actions and changes in your workspace
                        </p>
                    </div>
                    <Button onClick={handleExport} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Log
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <ActivityIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Activities</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{activities.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                            <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {activities.filter(a => a.action.toLowerCase() === 'created').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Updated</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {activities.filter(a => a.action.toLowerCase() === 'updated').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Deleted</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {activities.filter(a => a.action.toLowerCase() === 'deleted').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
                    </div>

                    <select
                        value={filterAction}
                        onChange={(e) => setFilterAction(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    >
                        <option value="">All Actions</option>
                        <option value="created">Created</option>
                        <option value="updated">Updated</option>
                        <option value="deleted">Deleted</option>
                        <option value="completed">Completed</option>
                        <option value="viewed">Viewed</option>
                        <option value="status_changed">Status Changed</option>
                    </select>

                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <input
                            type="date"
                            value={filterDateFrom}
                            onChange={(e) => setFilterDateFrom(e.target.value)}
                            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            placeholder="From"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                            type="date"
                            value={filterDateTo}
                            onChange={(e) => setFilterDateTo(e.target.value)}
                            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            placeholder="To"
                        />
                    </div>

                    {(filterAction || filterDateFrom || filterDateTo) && (
                        <Button variant="outline" size="sm" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    )}
                </div>
            </div>

            {/* Activity List */}
            {loading ? (
                <div className="flex items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : activities.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No activity logs found</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 flex flex-col">
                    <div className="flex-1 overflow-auto">
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {activities.map((activity) => (
                                <div
                                    key={activity._id}
                                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className="flex-shrink-0 mt-1">
                                            {getActionIcon(activity.action)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getActionBadgeColor(activity.action)}`}>
                                                        {activity.action}
                                                    </span>
                                                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                                                        {activity.description}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                    {formatTimestamp(activity.createdAt)}
                                                </span>
                                            </div>

                                            {/* Details */}
                                            {activity.description && (
                                                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900/50 rounded text-xs text-gray-600 dark:text-gray-400">
                                                    <pre className="whitespace-pre-wrap font-mono">
                                                        {activity.description}
                                                    </pre>
                                                </div>
                                            )}

                                            {/* Metadata */}
                                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3.5 h-3.5" />
                                                    User: {typeof activity.user === 'string' ? activity.user : activity.user.name}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(activity.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Info */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                        <p className="font-semibold mb-2">About Activity Logs:</p>
                        <ul className="space-y-1 list-disc list-inside">
                            <li>All actions are automatically logged for audit purposes</li>
                            <li>Logs are retained for 90 days by default</li>
                            <li>Export logs for compliance and reporting</li>
                            <li>Sensitive data is redacted from logs</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditLogPage;
