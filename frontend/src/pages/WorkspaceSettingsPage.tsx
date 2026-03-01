import React, { useState } from 'react';
import {
    Settings,
    Users,
    Bell,
    Lock,
    Palette,
    Globe,
    Shield,
    Clock,
    Mail,
    Calendar,
    Trash2,
    Save,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';

const WorkspaceSettingsPage: React.FC = () => {
    const { success, error } = useToast();
    const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'preferences'>('general');
    const [saving, setSaving] = useState(false);

    // General Settings
    const [workspaceName, setWorkspaceName] = useState('My Workspace');
    const [workspaceDescription, setWorkspaceDescription] = useState('');
    const [timezone, setTimezone] = useState('UTC');
    const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
    const [timeFormat, setTimeFormat] = useState('12h');

    // Notification Settings
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [taskReminders, setTaskReminders] = useState(true);
    const [weeklyDigest, setWeeklyDigest] = useState(false);
    const [mentionNotifications, setMentionNotifications] = useState(true);

    // Security Settings
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState('30');
    const [allowMultipleSessions, setAllowMultipleSessions] = useState(true);

    // Preferences
    const [defaultView, setDefaultView] = useState('list');
    const [tasksPerPage, setTasksPerPage] = useState('20');
    const [showCompletedTasks, setShowCompletedTasks] = useState(true);
    const [autoArchive, setAutoArchive] = useState('never');

    const handleSave = async () => {
        setSaving(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            success('Settings saved successfully');
        } catch (err) {
            error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'preferences', label: 'Preferences', icon: Palette }
    ];

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Workspace Settings
                </h1>
                <p className="text-muted-foreground">
                    Manage your workspace configuration and preferences
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1">
                {/* Sidebar Tabs */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="bg-card rounded-xl shadow-sm border border-border p-2">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                                        ? 'bg-amber-500/5 text-amber-500'
                                        : 'text-foreground/80 hover:bg-muted'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                        {/* General Settings */}
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-4">
                                        General Settings
                                    </h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                                        Workspace Name
                                    </label>
                                    <input
                                        type="text"
                                        value={workspaceName}
                                        onChange={(e) => setWorkspaceName(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                                        placeholder="Enter workspace name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={workspaceDescription}
                                        onChange={(e) => setWorkspaceDescription(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                                        placeholder="Describe your workspace"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground/80 mb-2">
                                            <Globe className="w-4 h-4 inline mr-1" />
                                            Timezone
                                        </label>
                                        <select
                                            value={timezone}
                                            onChange={(e) => setTimezone(e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                                        >
                                            <option value="UTC">UTC</option>
                                            <option value="America/New_York">Eastern Time (ET)</option>
                                            <option value="America/Chicago">Central Time (CT)</option>
                                            <option value="America/Denver">Mountain Time (MT)</option>
                                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                            <option value="Europe/London">London (GMT)</option>
                                            <option value="Asia/Tokyo">Tokyo (JST)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground/80 mb-2">
                                            <Calendar className="w-4 h-4 inline mr-1" />
                                            Date Format
                                        </label>
                                        <select
                                            value={dateFormat}
                                            onChange={(e) => setDateFormat(e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                                        >
                                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground/80 mb-2">
                                            <Clock className="w-4 h-4 inline mr-1" />
                                            Time Format
                                        </label>
                                        <select
                                            value={timeFormat}
                                            onChange={(e) => setTimeFormat(e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                                        >
                                            <option value="12h">12-hour (AM/PM)</option>
                                            <option value="24h">24-hour</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notification Settings */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-4">
                                        Notification Settings
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        Choose how you want to be notified about updates
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="font-medium text-foreground">Email Notifications</p>
                                                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={emailNotifications}
                                            onChange={(e) => setEmailNotifications(e.target.checked)}
                                            className="w-4 h-4"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <div className="flex items-center gap-3">
                                            <Bell className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="font-medium text-foreground">Push Notifications</p>
                                                <p className="text-sm text-muted-foreground">Receive push notifications in-app</p>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={pushNotifications}
                                            onChange={(e) => setPushNotifications(e.target.checked)}
                                            className="w-4 h-4"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="font-medium text-foreground">Task Reminders</p>
                                                <p className="text-sm text-muted-foreground">Get reminded about upcoming tasks</p>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={taskReminders}
                                            onChange={(e) => setTaskReminders(e.target.checked)}
                                            className="w-4 h-4"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="font-medium text-foreground">Weekly Digest</p>
                                                <p className="text-sm text-muted-foreground">Receive weekly summary emails</p>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={weeklyDigest}
                                            onChange={(e) => setWeeklyDigest(e.target.checked)}
                                            className="w-4 h-4"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="font-medium text-foreground">Mention Notifications</p>
                                                <p className="text-sm text-muted-foreground">When someone mentions you</p>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={mentionNotifications}
                                            onChange={(e) => setMentionNotifications(e.target.checked)}
                                            className="w-4 h-4"
                                        />
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Security Settings */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-4">
                                        Security Settings
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        Manage your account security and authentication
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 border border-border rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <Shield className="w-5 h-5 text-gray-500" />
                                                <div>
                                                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                                                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={twoFactorAuth}
                                                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                        </div>
                                        {twoFactorAuth && (
                                            <div className="mt-3 p-3 bg-amber-500/5 rounded-lg">
                                                <p className="text-sm text-amber-400">
                                                    Configure 2FA by connecting your authenticator app
                                                </p>
                                                <Button variant="outline" size="sm" className="mt-2">
                                                    Configure 2FA
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground/80 mb-2">
                                            <Clock className="w-4 h-4 inline mr-1" />
                                            Session Timeout (minutes)
                                        </label>
                                        <select
                                            value={sessionTimeout}
                                            onChange={(e) => setSessionTimeout(e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                                        >
                                            <option value="15">15 minutes</option>
                                            <option value="30">30 minutes</option>
                                            <option value="60">1 hour</option>
                                            <option value="120">2 hours</option>
                                            <option value="never">Never</option>
                                        </select>
                                    </div>

                                    <label className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <div>
                                            <p className="font-medium text-foreground">Allow Multiple Sessions</p>
                                            <p className="text-sm text-muted-foreground">Sign in from multiple devices</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={allowMultipleSessions}
                                            onChange={(e) => setAllowMultipleSessions(e.target.checked)}
                                            className="w-4 h-4"
                                        />
                                    </label>
                                </div>

                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <h4 className="font-medium text-red-900 dark:text-red-300 mb-2">Danger Zone</h4>
                                    <p className="text-sm text-red-800 dark:text-red-400 mb-3">
                                        Permanently delete your workspace and all associated data
                                    </p>
                                    <Button variant="outline" className="text-red-400 border-red-600 hover:bg-red-50">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Workspace
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Preferences */}
                        {activeTab === 'preferences' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-4">
                                        User Preferences
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        Customize your workspace experience
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                                        Default Task View
                                    </label>
                                    <select
                                        value={defaultView}
                                        onChange={(e) => setDefaultView(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                                    >
                                        <option value="list">List View</option>
                                        <option value="kanban">Kanban Board</option>
                                        <option value="calendar">Calendar View</option>
                                        <option value="gantt">Gantt Chart</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                                        Tasks Per Page
                                    </label>
                                    <select
                                        value={tasksPerPage}
                                        onChange={(e) => setTasksPerPage(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                                    >
                                        <option value="10">10 tasks</option>
                                        <option value="20">20 tasks</option>
                                        <option value="50">50 tasks</option>
                                        <option value="100">100 tasks</option>
                                    </select>
                                </div>

                                <label className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <div>
                                        <p className="font-medium text-foreground">Show Completed Tasks</p>
                                        <p className="text-sm text-muted-foreground">Display completed tasks in task lists</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={showCompletedTasks}
                                        onChange={(e) => setShowCompletedTasks(e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                </label>

                                <div>
                                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                                        Auto-Archive Completed Tasks
                                    </label>
                                    <select
                                        value={autoArchive}
                                        onChange={(e) => setAutoArchive(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                                    >
                                        <option value="never">Never</option>
                                        <option value="7">After 7 days</option>
                                        <option value="30">After 30 days</option>
                                        <option value="90">After 90 days</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-8 pt-6 border-t border-border flex justify-end gap-3">
                            <Button variant="outline">
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkspaceSettingsPage;
