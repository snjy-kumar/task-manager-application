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
        <div className="space-y-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="recurring"
                    checked={enabled}
                    onChange={(e) => handleEnabledChange(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="recurring" className="flex items-center gap-2 font-medium cursor-pointer">
                    <Repeat className="h-5 w-5 text-primary" />
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
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
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
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
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
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Leave empty for tasks that repeat indefinitely
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                            📅 Recurring Schedule
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-400">
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
