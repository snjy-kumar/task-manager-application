import React, { useState } from 'react';
import { Repeat, Calendar } from 'lucide-react';

interface RecurringTaskFormProps {
    isRecurring: boolean;
    recurringPattern?: string;
    recurringInterval?: number;
    recurringEndDate?: string;
    onChange: (data: RecurringTaskData) => void;
}

interface RecurringTaskData {
    isRecurring: boolean;
    recurringPattern?: string;
    recurringInterval?: number;
    recurringEndDate?: string;
}

const RecurringTaskForm: React.FC<RecurringTaskFormProps> = ({
    isRecurring,
    recurringPattern = 'weekly',
    recurringInterval = 1,
    recurringEndDate = '',
    onChange
}) => {
    const [enabled, setEnabled] = useState(isRecurring);
    const [pattern, setPattern] = useState(recurringPattern);
    const [interval, setInterval] = useState(recurringInterval);
    const [endDate, setEndDate] = useState(recurringEndDate);

    const handleEnabledChange = (checked: boolean) => {
        setEnabled(checked);
        onChange({
            isRecurring: checked,
            recurringPattern: checked ? pattern : undefined,
            recurringInterval: checked ? interval : undefined,
            recurringEndDate: checked && endDate ? endDate : undefined
        });
    };

    const handlePatternChange = (value: string) => {
        setPattern(value);
        onChange({
            isRecurring: enabled,
            recurringPattern: value,
            recurringInterval: interval,
            recurringEndDate: endDate || undefined
        });
    };

    const handleIntervalChange = (value: number) => {
        setInterval(value);
        onChange({
            isRecurring: enabled,
            recurringPattern: pattern,
            recurringInterval: value,
            recurringEndDate: endDate || undefined
        });
    };

    const handleEndDateChange = (value: string) => {
        setEndDate(value);
        onChange({
            isRecurring: enabled,
            recurringPattern: pattern,
            recurringInterval: interval,
            recurringEndDate: value || undefined
        });
    };

    return (
        <div className="space-y-4 p-4 border-2 border-dashed border-border rounded-lg">
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="recurring"
                    checked={enabled}
                    onChange={(e) => handleEnabledChange(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-amber-500 focus:ring-primary"
                />
                <label htmlFor="recurring" className="flex items-center gap-2 font-medium cursor-pointer">
                    <Repeat className="h-5 w-5 text-amber-500" />
                    Make this a recurring task
                </label>
            </div>

            {enabled && (
                <div className="space-y-4 pl-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Repeat Pattern</label>
                            <select
                                value={pattern}
                                onChange={(e) => handlePatternChange(e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-card"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Bi-weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>

                        {pattern === 'custom' && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Repeat Every (days)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="365"
                                    value={interval}
                                    onChange={(e) => handleIntervalChange(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-card"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            End Date (Optional)
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => handleEndDateChange(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-card"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Leave empty for tasks that repeat indefinitely
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                        <p className="text-sm font-medium text-amber-400 mb-1">
                            📅 Recurring Schedule
                        </p>
                        <p className="text-sm text-foreground/70">
                            {pattern === 'custom'
                                ? `This task will repeat every ${interval} day${interval > 1 ? 's' : ''}`
                                : `This task will repeat ${pattern}`}
                            {endDate ? ` until ${new Date(endDate).toLocaleDateString()}` : ' indefinitely'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecurringTaskForm;
