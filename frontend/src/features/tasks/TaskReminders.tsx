import React, { useState, useEffect } from 'react';
import { Bell, Clock, Mail, Smartphone, Plus, Edit2, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import reminderService, { Reminder, CreateReminderData, UpdateReminderData } from '@/services/reminderService';

interface TaskRemindersProps {
  taskId: string;
  taskTitle: string;
}

const TaskReminders: React.FC<TaskRemindersProps> = ({ taskId, taskTitle }) => {
  const { success, error } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formData, setFormData] = useState<CreateReminderData>({
    reminderTime: '',
    type: 'in-app',
    message: ''
  });

  useEffect(() => {
    loadReminders();
  }, [taskId]);

  const loadReminders = async () => {
    try {
      setLoading(true);
      const data = await reminderService.getTaskReminders(taskId);
      setReminders(data);
    } catch (error: any) {
      error(error.response?.data?.message || 'Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.reminderTime) {
      error('Please select a reminder time');
      return;
    }

    // Validate future time
    if (new Date(formData.reminderTime) <= new Date()) {
      error('Reminder time must be in the future');
      return;
    }

    try {
      if (editingReminder) {
        await reminderService.updateReminder(taskId, editingReminder._id, formData as UpdateReminderData);
        success('Reminder updated successfully');
      } else {
        await reminderService.createReminder(taskId, formData);
        success('Reminder created successfully');
      }

      setShowModal(false);
      setEditingReminder(null);
      resetForm();
      loadReminders();
    } catch (saveError: any) {
      error(saveError.response?.data?.message || 'Failed to save reminder');
    }
  };

  const handleDelete = async (reminderId: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;

    try {
      await reminderService.deleteReminder(taskId, reminderId);
      success('Reminder deleted successfully');
      loadReminders();
    } catch (deleteError: any) {
      error(deleteError.response?.data?.message || 'Failed to delete reminder');
    }
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setFormData({
      reminderTime: reminder.reminderTime.split('.')[0], // Remove milliseconds for datetime-local input
      type: reminder.type,
      message: reminder.message || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      reminderTime: '',
      type: 'in-app',
      message: ''
    });
    setEditingReminder(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'in-app':
        return <Smartphone className="w-4 h-4" />;
      case 'both':
        return <Bell className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      email: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'in-app': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      both: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    };
    return styles[type as keyof typeof styles] || styles['in-app'];
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // Minimum 5 minutes from now
    return now.toISOString().slice(0, 16);
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Reminders ({reminders.length})
        </h3>
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Add Reminder
        </Button>
      </div>

      {reminders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No reminders set
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            Get notified before your task is due
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <div
              key={reminder._id}
              className={`bg-white dark:bg-gray-800 border rounded-lg p-4 transition-all ${reminder.isSent
                ? 'border-gray-200 dark:border-gray-700 opacity-60'
                : 'border-blue-200 dark:border-blue-800 hover:shadow-md'
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(reminder.type)}
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeBadge(reminder.type)}`}>
                      {reminder.type === 'in-app' ? 'In-App' : reminder.type === 'email' ? 'Email' : 'Both'}
                    </span>
                    {reminder.isSent && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        Sent
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{formatDateTime(reminder.reminderTime)}</span>
                  </div>
                  {reminder.message && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {reminder.message}
                    </p>
                  )}
                  {reminder.isSent && reminder.sentAt && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Sent on {formatDateTime(reminder.sentAt)}
                    </p>
                  )}
                </div>
                {!reminder.isSent && (
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(reminder)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(reminder._id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Reminder Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {editingReminder ? 'Edit Reminder' : 'Add Reminder'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Task
                </label>
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100">
                  {taskTitle}
                </div>
              </div>

              <div>
                <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reminder Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="reminderTime"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                  min={getMinDateTime()}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notification Type
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="in-app">In-App Only</option>
                  <option value="email">Email Only</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Message (optional)
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Add a custom reminder message..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-gray-100 resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.message?.length || 0}/500 characters
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingReminder ? 'Update' : 'Create'} Reminder
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskReminders;
