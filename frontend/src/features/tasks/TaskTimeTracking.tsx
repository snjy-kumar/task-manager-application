import React, { useState, useEffect } from 'react';
import { Play, Pause, Plus, Trash, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import timeEntryService, { TimeEntry } from '@/services/timeEntryService';
import { formatDate } from '@/lib/dateUtils';

interface TaskTimeTrackingProps {
    taskId: string;
}

const TaskTimeTracking: React.FC<TaskTimeTrackingProps> = ({ taskId }) => {
    const [entries, setEntries] = useState<TimeEntry[]>([]);
    const [, setTotalTime] = useState(0);
    const [totalTimeFormatted, setTotalTimeFormatted] = useState('0h 0m 0s');
    const [loading, setLoading] = useState(true);
    const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showManualForm, setShowManualForm] = useState(false);
    const [manualEntry, setManualEntry] = useState({
        startTime: '',
        endTime: '',
        description: ''
    });
    const toast = useToast();

    useEffect(() => {
        fetchTimeEntries();
        const interval = setInterval(() => {
            if (activeTimer) {
                const elapsed = Math.floor((Date.now() - new Date(activeTimer.startTime).getTime()) / 1000);
                setElapsedTime(elapsed);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [taskId, activeTimer]);

    const fetchTimeEntries = async () => {
        try {
            setLoading(true);
            const data = await timeEntryService.getTimeEntries(taskId);
            setEntries(data.entries);
            setTotalTime(data.totalTime);
            setTotalTimeFormatted(data.totalTimeFormatted);

            // Check for active timer
            const active = data.entries.find(e => e.isActive);
            if (active) {
                setActiveTimer(active);
            }
        } catch (error: any) {
            console.error('Failed to fetch time entries:', error);
            toast.error(error.response?.data?.message || 'Failed to load time entries');
        } finally {
            setLoading(false);
        }
    };

    const handleStartTimer = async () => {
        try {
            const entry = await timeEntryService.startTimer(taskId);
            setActiveTimer(entry);
            setEntries([entry, ...entries]);
            toast.success('Timer started');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to start timer');
        }
    };

    const handleStopTimer = async () => {
        if (!activeTimer) return;

        try {
            const updated = await timeEntryService.stopTimer(taskId, activeTimer._id);
            setEntries(entries.map(e => e._id === updated._id ? updated : e));
            setActiveTimer(null);
            setElapsedTime(0);
            await fetchTimeEntries(); // Refresh to update total
            toast.success('Timer stopped');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to stop timer');
        }
    };

    const handleManualEntry = async () => {
        if (!manualEntry.startTime || !manualEntry.endTime) {
            toast.error('Please provide start and end times');
            return;
        }

        try {
            const entry = await timeEntryService.createTimeEntry(taskId, manualEntry);
            setEntries([entry, ...entries]);
            setShowManualForm(false);
            setManualEntry({ startTime: '', endTime: '', description: '' });
            await fetchTimeEntries();
            toast.success('Time entry added');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add time entry');
        }
    };

    const handleDelete = async (entryId: string) => {
        if (!window.confirm('Are you sure you want to delete this time entry?')) return;

        try {
            await timeEntryService.deleteTimeEntry(taskId, entryId);
            setEntries(entries.filter(e => e._id !== entryId));
            await fetchTimeEntries();
            toast.success('Time entry deleted');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete time entry');
        }
    };

    const formatDuration = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}h ${minutes}m ${secs}s`;
    };

    if (loading) {
        return <div className="text-center py-4">Loading time entries...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Timer Section */}
            <div className="p-6 rounded-lg border-2 border-border bg-amber-500/5">
                <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold mb-2">Timer</h3>
                    <div className="text-4xl font-mono font-bold text-amber-500 mb-4">
                        {activeTimer ? formatDuration(elapsedTime) : '0h 0m 0s'}
                    </div>
                    {activeTimer ? (
                        <Button
                            onClick={handleStopTimer}
                            variant="destructive"
                            size="lg"
                            className="gap-2"
                        >
                            <Pause className="h-5 w-5" />
                            Stop Timer
                        </Button>
                    ) : (
                        <Button
                            onClick={handleStartTimer}
                            size="lg"
                            className="gap-2"
                        >
                            <Play className="h-5 w-5" />
                            Start Timer
                        </Button>
                    )}
                </div>
            </div>

            {/* Total Time */}
            <div className="p-4 rounded-xl border border-border bg-muted/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                    <span className="font-medium">Total Time Tracked</span>
                </div>
                <span className="text-xl font-bold text-amber-500">{totalTimeFormatted}</span>
            </div>

            {/* Manual Entry Form */}
            {showManualForm ? (
                <div className="p-4 border-2 border-dashed border-border rounded-lg space-y-3">
                    <h4 className="font-medium">Add Manual Time Entry</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Time</label>
                            <input
                                type="datetime-local"
                                value={manualEntry.startTime}
                                onChange={(e) => setManualEntry({ ...manualEntry, startTime: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-card"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">End Time</label>
                            <input
                                type="datetime-local"
                                value={manualEntry.endTime}
                                onChange={(e) => setManualEntry({ ...manualEntry, endTime: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-card"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                        <input
                            type="text"
                            value={manualEntry.description}
                            onChange={(e) => setManualEntry({ ...manualEntry, description: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-card"
                            placeholder="What did you work on?"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleManualEntry}>Add Entry</Button>
                        <Button variant="outline" onClick={() => setShowManualForm(false)}>Cancel</Button>
                    </div>
                </div>
            ) : (
                <Button variant="outline" onClick={() => setShowManualForm(true)} className="w-full border-dashed">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Manual Entry
                </Button>
            )}

            {/* Time Entries List */}
            <div className="space-y-2">
                <h4 className="font-medium mb-3">Time Entries ({entries.length})</h4>
                {entries.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No time entries yet. Start tracking your time!
                    </div>
                ) : (
                    entries.map((entry) => (
                        <div
                            key={entry._id}
                            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">{formatDuration(entry.duration)}</span>
                                    {entry.isActive && (
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/15 text-emerald-400 font-medium">
                                            Active
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {formatDate(entry.startTime)}
                                    {entry.endTime && ` - ${formatDate(entry.endTime)}`}
                                </div>
                                {entry.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {entry.description}
                                    </p>
                                )}
                            </div>
                            {!entry.isActive && (
                                <button
                                    onClick={() => handleDelete(entry._id)}
                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                >
                                    <Trash className="h-4 w-4 text-red-600 dark:text-red-400" />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskTimeTracking;
