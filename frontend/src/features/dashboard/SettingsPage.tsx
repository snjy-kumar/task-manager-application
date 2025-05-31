import React, { useState } from 'react';
import { 
  Bell, 
  Shield, 
  Palette, 
  Moon,
  Sun,
  Monitor,
  Lock,
  Globe,
  User,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample settings data
const settingsData = {
  appearance: {
    theme: 'system', // 'light', 'dark', 'system'
    fontSize: 'medium', // 'small', 'medium', 'large'
    reducedMotion: false,
    highContrast: false
  },
  notifications: {
    email: {
      taskAssigned: true,
      taskDue: true,
      comments: false,
      teamUpdates: true
    },
    push: {
      taskAssigned: true,
      taskDue: true,
      comments: true,
      teamUpdates: false
    },
    sounds: true,
    dailyDigest: true
  },
  privacy: {
    profileVisibility: 'team', // 'public', 'team', 'private'
    activityStatus: true,
    showEmail: false,
    shareTaskHistory: true
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30, // minutes
    passwordUpdated: '2 months ago',
    loginHistory: [
      { device: 'MacBook Pro', location: 'San Francisco, CA', time: 'Now', status: 'active' },
      { device: 'iPhone 12', location: 'San Francisco, CA', time: 'Yesterday', status: 'inactive' }
    ]
  },
  language: 'English',
  account: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Product Manager',
    plan: 'Pro',
    memberSince: 'January 2023'
  }
};

const SettingsPage = () => {
  const [activeSetting, setActiveSetting] = useState<string>('appearance');
  
  // Render settings section based on active setting
  const renderSettingsSection = () => {
    switch (activeSetting) {
      case 'appearance':
        return <AppearanceSettings data={settingsData.appearance} />;
      case 'notifications':
        return <NotificationSettings data={settingsData.notifications} />;
      case 'privacy':
        return <PrivacySettings data={settingsData.privacy} />;
      case 'security':
        return <SecuritySettings data={settingsData.security} />;
      case 'account':
        return <AccountSettings data={settingsData.account} />;
      default:
        return <AppearanceSettings data={settingsData.appearance} />;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your preferences and account settings</p>
      </div>
      
      {/* Settings Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <nav className="flex flex-col">
            <SettingsNavItem
              icon={<Palette className="h-5 w-5" />}
              label="Appearance"
              active={activeSetting === 'appearance'}
              onClick={() => setActiveSetting('appearance')}
            />
            <SettingsNavItem
              icon={<Bell className="h-5 w-5" />}
              label="Notifications"
              active={activeSetting === 'notifications'}
              onClick={() => setActiveSetting('notifications')}
            />
            <SettingsNavItem
              icon={<Shield className="h-5 w-5" />}
              label="Privacy"
              active={activeSetting === 'privacy'}
              onClick={() => setActiveSetting('privacy')}
            />
            <SettingsNavItem
              icon={<Lock className="h-5 w-5" />}
              label="Security"
              active={activeSetting === 'security'}
              onClick={() => setActiveSetting('security')}
            />
            <SettingsNavItem
              icon={<Globe className="h-5 w-5" />}
              label="Language"
              active={activeSetting === 'language'}
              onClick={() => setActiveSetting('language')}
            />
            <SettingsNavItem
              icon={<User className="h-5 w-5" />}
              label="Account"
              active={activeSetting === 'account'}
              onClick={() => setActiveSetting('account')}
            />
            <SettingsNavItem
              icon={<CreditCard className="h-5 w-5" />}
              label="Billing"
              active={activeSetting === 'billing'}
              onClick={() => setActiveSetting('billing')}
            />
            <SettingsNavItem
              icon={<HelpCircle className="h-5 w-5" />}
              label="Help & Support"
              active={activeSetting === 'help'}
              onClick={() => setActiveSetting('help')}
            />
            <div className="p-3 mt-auto">
              <Button variant="destructive" className="w-full justify-start" size="sm">
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            </div>
          </nav>
        </div>
        
        {/* Settings Content */}
        <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          {renderSettingsSection()}
        </div>
      </div>
    </div>
  );
};

// Settings Navigation Item
interface SettingsNavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SettingsNavItem = ({ icon, label, active, onClick }: SettingsNavItemProps) => {
  return (
    <button
      className={`flex items-center w-full px-4 py-3 text-left ${
        active 
          ? 'bg-primary/10 text-primary' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{label}</span>
      {active && <ChevronRight className="h-4 w-4 ml-auto" />}
    </button>
  );
};

// Toggle Switch Component
interface ToggleSwitchProps {
  checked: boolean;
  onChange?: () => void;
  label?: string;
  description?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label, description }) => {
  return (
    <div className="flex items-center justify-between">
      {label && (
        <div>
          <p className="text-sm font-medium">{label}</p>
          {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
      )}
      <button 
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
        }`}
        onClick={onChange}
      >
        <span 
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`} 
        />
      </button>
    </div>
  );
};

// Appearance Settings
interface AppearanceSettingsProps {
  data: {
    theme: string;
    fontSize: string;
    reducedMotion: boolean;
    highContrast: boolean;
  };
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Appearance</h2>
        <p className="text-sm text-gray-500 mb-6">Customize how AI Task Manager looks and feels</p>
        
        <div className="space-y-6">
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              <ThemeOption 
                icon={<Sun className="h-5 w-5" />}
                label="Light"
                selected={data.theme === 'light'}
              />
              <ThemeOption 
                icon={<Moon className="h-5 w-5" />}
                label="Dark"
                selected={data.theme === 'dark'}
              />
              <ThemeOption 
                icon={<Monitor className="h-5 w-5" />}
                label="System"
                selected={data.theme === 'system'}
              />
            </div>
          </div>
          
          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium mb-2">Font Size</label>
            <div className="flex space-x-3">
              <SizeOption 
                label="Small"
                className="text-xs"
                selected={data.fontSize === 'small'}
              />
              <SizeOption 
                label="Medium"
                className="text-sm"
                selected={data.fontSize === 'medium'}
              />
              <SizeOption 
                label="Large"
                className="text-base"
                selected={data.fontSize === 'large'}
              />
            </div>
          </div>
          
          {/* Additional Options */}
          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <ToggleSwitch 
              checked={data.reducedMotion}
              label="Reduce motion"
              description="Minimize animations and transitions"
            />
            <ToggleSwitch 
              checked={data.highContrast}
              label="High contrast"
              description="Increase contrast for better visibility"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification Settings
interface NotificationSettingsProps {
  data: {
    email: {
      taskAssigned: boolean;
      taskDue: boolean;
      comments: boolean;
      teamUpdates: boolean;
    };
    push: {
      taskAssigned: boolean;
      taskDue: boolean;
      comments: boolean;
      teamUpdates: boolean;
    };
    sounds: boolean;
    dailyDigest: boolean;
  };
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Notifications</h2>
        <p className="text-sm text-gray-500 mb-6">Configure how you receive notifications</p>
        
        <div className="space-y-6">
          {/* Email Notifications */}
          <div>
            <h3 className="text-base font-medium mb-3">Email Notifications</h3>
            <div className="space-y-3">
              <ToggleSwitch 
                checked={data.email.taskAssigned}
                label="Task assignments"
                description="When a task is assigned to you"
              />
              <ToggleSwitch 
                checked={data.email.taskDue}
                label="Task due dates"
                description="Reminders for upcoming and overdue tasks"
              />
              <ToggleSwitch 
                checked={data.email.comments}
                label="Comments"
                description="When someone comments on your task"
              />
              <ToggleSwitch 
                checked={data.email.teamUpdates}
                label="Team updates"
                description="Updates about your team's activity"
              />
            </div>
          </div>
          
          {/* Push Notifications */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-medium mb-3">Push Notifications</h3>
            <div className="space-y-3">
              <ToggleSwitch 
                checked={data.push.taskAssigned}
                label="Task assignments"
                description="When a task is assigned to you"
              />
              <ToggleSwitch 
                checked={data.push.taskDue}
                label="Task due dates"
                description="Reminders for upcoming and overdue tasks"
              />
              <ToggleSwitch 
                checked={data.push.comments}
                label="Comments"
                description="When someone comments on your task"
              />
              <ToggleSwitch 
                checked={data.push.teamUpdates}
                label="Team updates"
                description="Updates about your team's activity"
              />
            </div>
          </div>
          
          {/* Other Notification Settings */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-medium mb-3">Other Settings</h3>
            <div className="space-y-3">
              <ToggleSwitch 
                checked={data.sounds}
                label="Notification sounds"
                description="Play sounds for notifications"
              />
              <ToggleSwitch 
                checked={data.dailyDigest}
                label="Daily digest"
                description="Receive a summary of your tasks each morning"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Privacy Settings
interface PrivacySettingsProps {
  data: {
    profileVisibility: string;
    activityStatus: boolean;
    showEmail: boolean;
    shareTaskHistory: boolean;
  };
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Privacy</h2>
        <p className="text-sm text-gray-500 mb-6">Manage who can see your information</p>
        
        <div className="space-y-6">
          {/* Profile Visibility */}
          <div>
            <label className="block text-sm font-medium mb-2">Profile Visibility</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              defaultValue={data.profileVisibility}
            >
              <option value="public">Public - Anyone can view your profile</option>
              <option value="team">Team Only - Only team members can view your profile</option>
              <option value="private">Private - Only you can view your profile</option>
            </select>
          </div>
          
          {/* Other Privacy Settings */}
          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <ToggleSwitch 
              checked={data.activityStatus}
              label="Show activity status"
              description="Let others see when you're online"
            />
            <ToggleSwitch 
              checked={data.showEmail}
              label="Show email address"
              description="Make your email visible to other users"
            />
            <ToggleSwitch 
              checked={data.shareTaskHistory}
              label="Share task history"
              description="Allow teammates to see your completed tasks"
            />
          </div>
          
          {/* Data Controls */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-medium mb-3">Data Controls</h3>
            <div className="space-y-3">
              <Button variant="outline" size="sm">
                Download Personal Data
              </Button>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Security Settings
interface SecuritySettingsProps {
  data: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordUpdated: string;
    loginHistory: Array<{
      device: string;
      location: string;
      time: string;
      status: string;
    }>;
  };
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Security</h2>
        <p className="text-sm text-gray-500 mb-6">Protect your account and data</p>
        
        <div className="space-y-6">
          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-medium">Password</h3>
              <span className="text-xs text-gray-500">Last updated: {data.passwordUpdated}</span>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>
          
          {/* Two-Factor Authentication */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-base font-medium">Two-Factor Authentication</h3>
                <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <ToggleSwitch checked={data.twoFactorAuth} />
            </div>
            {!data.twoFactorAuth && (
              <Button variant="outline" size="sm">
                Set Up 2FA
              </Button>
            )}
          </div>
          
          {/* Session Settings */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-medium mb-3">Session Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  defaultValue={data.sessionTimeout}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                  <option value="480">8 hours</option>
                </select>
              </div>
              <Button variant="outline" size="sm">
                Sign Out All Other Sessions
              </Button>
            </div>
          </div>
          
          {/* Login History */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-medium mb-3">Recent Login Activity</h3>
            <div className="space-y-3">
              {data.loginHistory.map((login, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium">{login.device}</p>
                      <p className="text-xs text-gray-500">{login.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{login.time}</p>
                      <p className={`text-xs ${login.status === 'active' ? 'text-green-500' : 'text-gray-500'}`}>
                        {login.status === 'active' ? 'Current session' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Account Settings
interface AccountSettingsProps {
  data: {
    name: string;
    email: string;
    role: string;
    plan: string;
    memberSince: string;
  };
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Account</h2>
        <p className="text-sm text-gray-500 mb-6">Manage your account details and subscription</p>
        
        <div className="space-y-6">
          {/* Account Information */}
          <div>
            <h3 className="text-base font-medium mb-3">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  defaultValue={data.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  defaultValue={data.email}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  defaultValue={data.role}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Member Since
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  defaultValue={data.memberSince}
                  readOnly
                />
              </div>
            </div>
          </div>
          
          {/* Subscription Plan */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-medium mb-3">Subscription Plan</h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold">{data.plan} Plan</p>
                  <p className="text-sm text-gray-500">$15/month • Billed monthly</p>
                </div>
                <Button>
                  Upgrade Plan
                </Button>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <h4 className="text-sm font-medium mb-2">Features included:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> Unlimited tasks
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> Up to 10 team members
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> Advanced reporting
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> Priority support
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Danger Zone */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-medium mb-3 text-red-500">Danger Zone</h3>
            <div className="space-y-3">
              <Button variant="outline" size="sm">
                Export All Data
              </Button>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Theme Option Component
interface ThemeOptionProps {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({ icon, label, selected }) => {
  return (
    <button
      className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
        selected 
          ? 'border-primary bg-primary/10' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <div className={`mb-2 ${selected ? 'text-primary' : ''}`}>{icon}</div>
      <span className={`text-sm font-medium ${selected ? 'text-primary' : ''}`}>{label}</span>
    </button>
  );
};

// Size Option Component
interface SizeOptionProps {
  label: string;
  className: string;
  selected: boolean;
}

const SizeOption: React.FC<SizeOptionProps> = ({ label, className, selected }) => {
  return (
    <button
      className={`flex items-center justify-center px-4 py-2 rounded-lg border ${
        selected 
          ? 'border-primary bg-primary/10' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <span className={`font-medium ${className} ${selected ? 'text-primary' : ''}`}>{label}</span>
    </button>
  );
};

export default SettingsPage;
