import React, { useState, useEffect } from 'react';
import {
    Bell,
    Clock,
    Mail,
    Smartphone,
    AlertCircle,
    CheckCircle2,
    Trash2,
    Loader2,
    ExternalLink,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import reminderService, { Reminder } from '@/services/reminderService';
import { Link } from 'react-router-dom';

const RemindersManagementPage: React.FC = () => {
    const { success, error } = useToast();
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'sent'>('all');
    const [typeFilter, setTypeFilter] = useState<string>('');

    useEffect(() => {
        loadReminders();
    }, []);

    const loadReminders = async () => {
        setLoading(true);
        try {
            const data = await reminderService.getUserReminders();
            setReminders(data);
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to load reminders');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReminder = async (taskId: string, reminderId: string) => {
        if (!confirm('Are you sure you want to delete this reminder?')) return;

        try {
            await reminderService.deleteReminder(taskId, reminderId);
            success('Reminder deleted successfully');
            loadReminders();
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to delete reminder');
        }
    };

    const getReminderIcon = (type: string) => {
        switch (type) {
            case 'email':
                return <Mail className="w-5 h-5 text-blue-600" />;
            case 'in-app':
                return <Smartphone className="w-5 h-5 text-purple-600" />;
            case 'both':
                return <Bell className="w-5 h-5 text-green-600" />;
            default:
                return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const formatReminderTime = (time: string) => {
        const date = new Date(time);
        const now = new Date();
        const diff = date.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (diff < 0) {
            return `${date.toLocaleString()} (Past)`;
        } else if (days > 0) {
            return `${date.toLocaleString()} (in ${days}d ${hours}h)`;
        } else if (hours > 0) {
            return `${date.toLocaleString()} (in ${hours}h ${minutes}m)`;
        } else if (minutes > 0) {
            return `${date.toLocaleString()} (in ${minutes}m)`;
        } else {
            return `${date.toLocaleString()} (Soon!)`;
        }
    };

    const getReminderStatus = (reminder: Reminder) => {
        const now = new Date();
        const reminderTime = new Date(reminder.reminderTime);

        if (reminder.isSent) {
            return { label: 'Sent', color: 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300' };
        } else if (reminderTime < now) {
            return { label: 'Overdue', color: 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400' };
        } else if (reminderTime.getTime() - now.getTime() < 3600000) { // Less than 1 hour
            return { label: 'Soon', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400' };
        } else {
            return { label: 'Upcoming', color: 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400' };
        }
    };

    const filterReminders = () => {
        let filtered = [...reminders];
        const now = new Date();

        // Apply time filter
        switch (filter) {
            case 'upcoming':
                filtered = filtered.filter(r => new Date(r.reminderTime) > now && !r.isSent);
                break;
            case 'past':
                filtered = filtered.filter(r => new Date(r.reminderTime) < now && !r.isSent);
                break;
            case 'sent':
                filtered = filtered.filter(r => r.isSent);
                break;
        }

        // Apply type filter
        if (typeFilter) {
            filtered = filtered.filter(r => r.type === typeFilter);
        }

        // Sort by reminder time
        filtered.sort((a, b) => new Date(a.reminderTime).getTime() - new Date(b.reminderTime).getTime());

        return filtered;
    };

    const filteredReminders = filterReminders();
    const upcomingCount = reminders.filter(r => new Date(r.reminderTime) > new Date() && !r.isSent).length;
    const pastCount = reminders.filter(r => new Date(r.reminderTime) < new Date() && !r.isSent).length;
    const sentCount = reminders.filter(r => r.isSent).length;

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Reminders
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage all your task reminders in one place
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{reminders.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Past Due</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{pastCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Sent</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{sentCount}</p>
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

                    {/* Time Filter Tabs */}
                    <div className="flex gap-2">
                        {[
                            { value: 'all', label: 'All', count: reminders.length },
                            { value: 'upcoming', label: 'Upcoming', count: upcomingCount },
                            { value: 'past', label: 'Past Due', count: pastCount },
                            { value: 'sent', label: 'Sent', count: sentCount }
                        ].map(tab => (
                            <button
                                key={tab.value}
                                onClick={() => setFilter(tab.value as any)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === tab.value
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {tab.label} <span className="ml-1 text-xs opacity-75">({tab.count})</span>
                            </button>
                        ))}
                    </div>

                    {/* Type Filter */}
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    >
                        <option value="">All Types</option>
                        <option value="email">Email Only</option>
                        <option value="in-app">In-App Only</option>
                        <option value="both">Both</option>
                    </select>
                </div>
            </div>

            {/* Reminders List */}
            {loading ? (
                <div className="flex items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : filteredReminders.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {filter === 'all' ? 'No reminders found' : `No ${filter} reminders`}
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredReminders.map((reminder) => {
                            const status = getReminderStatus(reminder);

                            return (
                                <div
                                    key={reminder._id}
                                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className="flex-shrink-0 mt-1">
                                            {getReminderIcon(reminder.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Task Title */}
                                            <div className="flex items-center gap-2 mb-1">
                                                <Link
                                                    to={`/dashboard/tasks/${reminder.task}`}
                                                    className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate"
                                                >
                                                    Task: {typeof reminder.task === 'string' ? reminder.task : reminder.task.title}
                                                </Link>
                                                <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            </div>

                                            {/* Message */}
                                            {reminder.message && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    {reminder.message}
                                                </p>
                                            )}

                                            {/* Details */}
                                            <div className="flex flex-wrap items-center gap-3 text-xs">
                                                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>{formatReminderTime(reminder.reminderTime)}</span>
                                                </div>

                                                <span className={`px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                                                    {status.label}
                                                </span>

                                                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium">
                                                    {reminder.type}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteReminder(typeof reminder.task === 'string' ? reminder.task : reminder.task._id, reminder._id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Info Section */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                        <p className="font-semibold mb-2">About Reminders:</p>
                        <ul className="space-y-1 list-disc list-inside">
                            <li><strong>Email:</strong> Receive reminder via email</li>
                            <li><strong>In-App:</strong> Get notified within the application</li>
                            <li><strong>Both:</strong> Receive both email and in-app notifications</li>
                            <li>Reminders are automatically sent at the scheduled time</li>
                            <li>Past due reminders are highlighted for your attention</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RemindersManagementPage;
