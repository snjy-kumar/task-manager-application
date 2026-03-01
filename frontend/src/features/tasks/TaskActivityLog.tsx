import React, { useState, useEffect } from 'react';
import { Activity, Clock, User, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import activityService, { Activity as ActivityType } from '@/services/activityService';
import { formatTimeAgo } from '@/lib/dateUtils';

interface TaskActivityLogProps {
    taskId: string;
}

const TaskActivityLog: React.FC<TaskActivityLogProps> = ({ taskId }) => {
    const [activities, setActivities] = useState<ActivityType[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const toast = useToast();

    useEffect(() => {
        fetchActivities();
    }, [taskId, page]);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const data = await activityService.getTaskActivity(taskId, page, 20);
            if (page === 1) {
                setActivities(data.activities);
            } else {
                setActivities([...activities, ...data.activities]);
            }
            setHasMore(data.pagination.page < data.pagination.pages);
        } catch (error: any) {
            console.error('Failed to fetch activities:', error);
            toast.error(error.response?.data?.message || 'Failed to load activity log');
        } finally {
            setLoading(false);
        }
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'created':
                return <FileText className="h-4 w-4 text-amber-400" />;
            case 'updated':
            case 'status_changed':
            case 'priority_changed':
                return <Activity className="h-4 w-4 text-amber-500" />;
            case 'completed':
                return <Activity className="h-4 w-4 text-emerald-400" />;
            case 'comment_added':
                return <FileText className="h-4 w-4 text-amber-400" />;
            case 'subtask_added':
            case 'subtask_completed':
                return <Activity className="h-4 w-4 text-amber-500" />;
            case 'deleted':
            case 'archived':
                return <Activity className="h-4 w-4 text-red-500" />;
            default:
                return <Activity className="h-4 w-4 text-gray-500" />;
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'created':
                return 'border-amber-500';
            case 'completed':
                return 'border-emerald-400';
            case 'deleted':
            case 'archived':
                return 'border-red-500';
            case 'comment_added':
                return 'border-amber-400';
            default:
                return 'border-border';
        }
    };

    const formatActionText = (activity: ActivityType): string => {
        const user = activity.user.name;

        switch (activity.action) {
            case 'created':
                return `${user} created this task`;
            case 'updated':
                return activity.description || `${user} updated the task`;
            case 'status_changed':
                return `${user} changed status from "${activity.oldValue}" to "${activity.newValue}"`;
            case 'priority_changed':
                return `${user} changed priority from "${activity.oldValue}" to "${activity.newValue}"`;
            case 'completed':
                return `${user} completed this task`;
            case 'reopened':
                return `${user} reopened this task`;
            case 'comment_added':
                return `${user} added a comment`;
            case 'subtask_added':
                return activity.description || `${user} added a subtask`;
            case 'subtask_completed':
                return activity.description || `${user} completed a subtask`;
            case 'due_date_changed':
                return `${user} changed the due date`;
            case 'tags_changed':
                return `${user} updated tags`;
            case 'deleted':
                return `${user} deleted this task`;
            case 'archived':
                return `${user} archived this task`;
            case 'assigned':
                return `${user} assigned this task`;
            default:
                return activity.description || `${user} performed an action`;
        }
    };

    if (loading && page === 1) {
        return <div className="text-center py-4">Loading activity log...</div>;
    }

    return (
        <div className="space-y-4">
            {activities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No activity yet</p>
                </div>
            ) : (
                <>
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />

                        {/* Activities */}
                        <div className="space-y-4">
                            {activities.map((activity) => (
                                <div key={activity._id} className="relative flex gap-4">
                                    {/* Icon */}
                                    <div className={`relative z-10 flex-shrink-0 h-10 w-10 rounded-full border-4 ${getActionColor(activity.action)} bg-card flex items-center justify-center`}>
                                        {getActionIcon(activity.action)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pb-4">
                                        <div className="bg-muted rounded-lg p-4 border border-border">
                                            <p className="text-sm font-medium mb-1">
                                                {formatActionText(activity)}
                                            </p>

                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatTimeAgo(activity.createdAt)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {activity.user.email}
                                                </span>
                                            </div>

                                            {/* Additional Details */}
                                            {activity.field && (
                                                <div className="mt-2 text-xs">
                                                    <span className="text-gray-500">Field:</span>{' '}
                                                    <span className="font-medium">{activity.field}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Load More */}
                    {hasMore && (
                        <div className="text-center pt-4">
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                            >
                                {loading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TaskActivityLog;
