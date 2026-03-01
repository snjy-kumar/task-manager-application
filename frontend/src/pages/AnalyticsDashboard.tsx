import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    CheckCircle2,
    Clock,
    AlertCircle,
    BarChart3,
    Loader2,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import taskService, { TaskStats } from '@/services/taskService';
import activityService from '@/services/activityService';

const AnalyticsDashboard: React.FC = () => {
    const [stats, setStats] = useState<TaskStats | null>(null);
    const [activityStats, setActivityStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState(7);
    const toast = useToast();

    useEffect(() => { fetchAnalytics(); }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [taskStats, actStats] = await Promise.all([
                taskService.getStats(),
                activityService.getActivityStats(timeRange),
            ]);
            setStats(taskStats);
            setActivityStats(actStats);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
        );
    }

    if (!stats) return null;

    const completionRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : '0';
    const activeTasksRate = stats.total > 0 ? (((stats.pending + stats.inProgress) / stats.total) * 100).toFixed(1) : '0';

    const pct = (n: number) => stats.total > 0 ? (n / stats.total) * 100 : 0;

    return (
        <div className="space-y-6 p-1">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                        Analytics
                    </h1>
                    <p className="text-muted-foreground text-sm mt-0.5">Track your productivity and task metrics</p>
                </div>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(Number(e.target.value))}
                    className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:border-amber-500 transition-colors"
                >
                    <option value={7}>Last 7 days</option>
                    <option value={14}>Last 14 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={90}>Last 90 days</option>
                </select>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Tasks', value: stats.total, icon: BarChart3, accent: 'text-foreground', sub: null },
                    { label: 'Completed', value: stats.completed, icon: CheckCircle2, accent: 'text-emerald-400', sub: `${completionRate}% rate` },
                    { label: 'Active', value: stats.pending + stats.inProgress, icon: Clock, accent: 'text-amber-400', sub: `${activeTasksRate}% of total` },
                    { label: 'Overdue', value: stats.overdue, icon: AlertCircle, accent: stats.overdue > 0 ? 'text-red-400' : 'text-foreground', sub: 'Need attention' },
                ].map(({ label, value, icon: Icon, accent, sub }) => (
                    <div key={label} className="rounded-xl border border-border bg-card p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-4 h-4 text-amber-500" />
                            <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">{label}</span>
                        </div>
                        <span className={`text-3xl font-bold ${accent}`}>{value}</span>
                        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status distribution */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="w-4 h-4 text-amber-500" />
                        <h3 className="font-semibold text-foreground text-sm">Task Status Distribution</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: 'Pending', value: stats.pending, color: 'bg-white/20' },
                            { label: 'In Progress', value: stats.inProgress, color: 'bg-amber-500' },
                            { label: 'Completed', value: stats.completed, color: 'bg-emerald-500' },
                            { label: 'Overdue', value: stats.overdue, color: 'bg-red-500' },
                        ].map(({ label, value, color }) => (
                            <div key={label}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="text-foreground/70">{label}</span>
                                    <span className="font-medium text-foreground">{value}</span>
                                </div>
                                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct(value)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Priority distribution */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-4 h-4 text-amber-500" />
                        <h3 className="font-semibold text-foreground text-sm">Priority Distribution</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: 'High Priority', value: stats.highPriority ?? 0, color: 'bg-red-500' },
                            { label: 'Other Priority', value: Math.max(0, stats.total - (stats.highPriority ?? 0)), color: 'bg-amber-500' },
                        ].map(({ label, value, color }) => (
                            <div key={label}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="text-foreground/70">{label}</span>
                                    <span className="font-medium text-foreground">{value}</span>
                                </div>
                                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct(value)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {activityStats && (
                        <div className="mt-6 pt-5 border-t border-border">
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Activity ({timeRange}d)</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg bg-muted/50 p-3 text-center">
                                    <p className="text-xl font-bold text-foreground">{activityStats.totalActivities ?? 0}</p>
                                    <p className="text-xs text-muted-foreground">Total actions</p>
                                </div>
                                <div className="rounded-lg bg-muted/50 p-3 text-center">
                                    <p className="text-xl font-bold text-foreground">{activityStats.uniqueDays ?? 0}</p>
                                    <p className="text-xs text-muted-foreground">Active days</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
