import React, { useState, useEffect } from 'react';
import {
    Bell,
    BellOff,
    CheckCheck,
    Trash2,
    Loader2,
    ExternalLink,
    Clock,
    AlertCircle,
    MessageSquare,
    CheckCircle2,
    UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import notificationService, { Notification } from '@/services/notificationService';
import { Link } from 'react-router-dom';

const NotificationsCenterPage: React.FC = () => {
    const { success } = useToast();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [unreadCount, setUnreadCount] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadNotifications();
    }, [filter, page]);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const response = await notificationService.getNotifications({
                status: filter,
                page,
                limit: 20
            });
            setNotifications(response.notifications);
            setUnreadCount(response.unreadCount);
            setTotalPages(response.pages);
        } catch (error: any) {
            error(error.response?.data?.message || 'Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await notificationService.markAsRead(notificationId);
            setNotifications(notifications.map(n =>
                n._id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
            success('Marked as read');
        } catch (err: any) {
            console.error('Failed to mark as read:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() })));
            setUnreadCount(0);
            success('All notifications marked as read');
        } catch (err: any) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const handleDelete = async (notificationId: string) => {
        try {
            await notificationService.deleteNotification(notificationId);
            setNotifications(notifications.filter(n => n._id !== notificationId));
            success('Notification deleted');
        } catch (err: any) {
            console.error('Failed to delete notification:', err);
        }
    };

    const handleDeleteRead = async () => {
        try {
            await notificationService.deleteReadNotifications();
            setNotifications(notifications.filter(n => !n.isRead));
            success('All read notifications deleted');
        } catch (err: any) {
            console.error('Failed to delete notifications:', err);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'task_completed':
                return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            case 'task_overdue':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            case 'reminder':
                return <Clock className="w-5 h-5 text-blue-600" />;
            case 'comment_added':
                return <MessageSquare className="w-5 h-5 text-purple-600" />;
            case 'assignment':
                return <UserPlus className="w-5 h-5 text-indigo-600" />;
            default:
                return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'border-l-4 border-red-500';
            case 'high':
                return 'border-l-4 border-orange-500';
            case 'medium':
                return 'border-l-4 border-yellow-500';
            default:
                return 'border-l-4 border-gray-300';
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Notifications
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up! 🎉'}
                    </p>
                </div>
                <div className="flex gap-2">
                    {unreadCount > 0 && (
                        <Button variant="outline" onClick={handleMarkAllAsRead}>
                            <CheckCheck className="w-4 h-4 mr-2" />
                            Mark All Read
                        </Button>
                    )}
                    <Button variant="outline" onClick={handleDeleteRead}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Read
                    </Button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    {[
                        { value: 'all', label: 'All', count: notifications.length },
                        { value: 'unread', label: 'Unread', count: unreadCount },
                        { value: 'read', label: 'Read', count: notifications.length - unreadCount }
                    ].map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => {
                                setFilter(tab.value as any);
                                setPage(1);
                            }}
                            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${filter === tab.value
                                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notifications List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <BellOff className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No notifications to show</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map(notification => (
                        <div
                            key={notification._id}
                            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-md ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                                } ${getPriorityColor(notification.priority)}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    {getNotificationIcon(notification.type)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-1">
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {notification.title}
                                        </h3>
                                        {!notification.isRead && (
                                            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 ml-2 mt-1.5"></span>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {notification.message}
                                    </p>

                                    {notification.task && (
                                        <div className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mb-2">
                                            <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700">
                                                {notification.task.title}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded ${notification.task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                                                notification.task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                                    'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                }`}>
                                                {notification.task.priority}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 mt-3">
                                        <span className="text-xs text-gray-500 dark:text-gray-500">
                                            {formatTimeAgo(notification.createdAt)}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification._id)}
                                                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                                >
                                                    Mark as read
                                                </button>
                                            )}

                                            {notification.actionUrl && (
                                                <Link
                                                    to={notification.actionUrl}
                                                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1"
                                                >
                                                    View
                                                    <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            )}

                                            <button
                                                onClick={() => handleDelete(notification._id)}
                                                className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default NotificationsCenterPage;
