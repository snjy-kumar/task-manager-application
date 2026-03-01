import React, { useState, useEffect } from 'react';
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
  CheckCircle,
  Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { ProfileSkeleton } from '@/components/ui/LoadingSkeleton';
import userService, { type UserProfile } from '@/services/userService';

const SettingsPage = () => {
  const [activeSetting, setActiveSetting] = useState<string>('appearance');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });

  const { logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profile = await userService.getProfile();
        setUserData(profile);
        setEditForm({ name: profile.name, email: profile.email });
      } catch (error: any) {
        console.error('Failed to fetch profile:', error);
        toast.error(error.response?.data?.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const updatedUser = await userService.updateProfile(editForm);
      setUserData(updatedUser);
      toast.success('Settings saved successfully');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Failed to load settings</p>
      </div>
    );
  }

  // Render settings section based on active setting
  const renderSettingsSection = () => {
    switch (activeSetting) {
      case 'appearance':
        return <AppearanceSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'privacy':
        return <PrivacySettings />;
      case 'security':
        return <SecuritySettings />;
      case 'account':
        return <AccountSettings
          userData={userData}
          editForm={editForm}
          setEditForm={setEditForm}
          onSave={handleSaveProfile}
          saving={saving}
        />;
      case 'language':
        return <LanguageSettings />;
      case 'help':
        return <HelpSettings />;
      default:
        return <AppearanceSettings />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and account settings</p>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="md:col-span-1 bg-card rounded-xl shadow-sm overflow-hidden">
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
              icon={<HelpCircle className="h-5 w-5" />}
              label="Help & Support"
              active={activeSetting === 'help'}
              onClick={() => setActiveSetting('help')}
            />
            <div className="p-3 mt-auto border-t border-border">
              <Button
                variant="destructive"
                className="w-full justify-start transition-all duration-300"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            </div>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 bg-card rounded-xl shadow-sm p-6">
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
      className={`flex items-center w-full px-4 py-3 text-left transition-all duration-300 ${active
        ? 'bg-gray-200 dark:bg-gray-800/10 text-foreground'
        : 'hover:bg-muted'
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
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${checked ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        onClick={onChange}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
      </button>
    </div>
  );
};

// Appearance Settings
const AppearanceSettings: React.FC = () => {
  const [theme, setTheme] = useState('system');
  const [fontSize, setFontSize] = useState('medium');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Appearance</h2>
        <p className="text-sm text-gray-500 mb-6">Customize how the application looks and feels</p>

        <div className="space-y-6">
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              <ThemeOption
                icon={<Sun className="h-5 w-5" />}
                label="Light"
                selected={theme === 'light'}
                onClick={() => setTheme('light')}
              />
              <ThemeOption
                icon={<Moon className="h-5 w-5" />}
                label="Dark"
                selected={theme === 'dark'}
                onClick={() => setTheme('dark')}
              />
              <ThemeOption
                icon={<Monitor className="h-5 w-5" />}
                label="System"
                selected={theme === 'system'}
                onClick={() => setTheme('system')}
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
                selected={fontSize === 'small'}
                onClick={() => setFontSize('small')}
              />
              <SizeOption
                label="Medium"
                className="text-sm"
                selected={fontSize === 'medium'}
                onClick={() => setFontSize('medium')}
              />
              <SizeOption
                label="Large"
                className="text-base"
                selected={fontSize === 'large'}
                onClick={() => setFontSize('large')}
              />
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-3 pt-4 border-t border-border">
            <ToggleSwitch
              checked={reducedMotion}
              onChange={() => setReducedMotion(!reducedMotion)}
              label="Reduce motion"
              description="Minimize animations and transitions"
            />
            <ToggleSwitch
              checked={highContrast}
              onChange={() => setHighContrast(!highContrast)}
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
const NotificationSettings: React.FC = () => {
  const [emailNotifs, setEmailNotifs] = useState({
    taskAssigned: true,
    taskDue: true,
    comments: false,
    teamUpdates: true
  });
  const [pushNotifs, setPushNotifs] = useState({
    taskAssigned: true,
    taskDue: true,
    comments: true,
    teamUpdates: false
  });
  const [sounds, setSounds] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);

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
                checked={emailNotifs.taskAssigned}
                onChange={() => setEmailNotifs({ ...emailNotifs, taskAssigned: !emailNotifs.taskAssigned })}
                label="Task assignments"
                description="When a task is assigned to you"
              />
              <ToggleSwitch
                checked={emailNotifs.taskDue}
                onChange={() => setEmailNotifs({ ...emailNotifs, taskDue: !emailNotifs.taskDue })}
                label="Task due dates"
                description="Reminders for upcoming and overdue tasks"
              />
              <ToggleSwitch
                checked={emailNotifs.comments}
                onChange={() => setEmailNotifs({ ...emailNotifs, comments: !emailNotifs.comments })}
                label="Comments"
                description="When someone comments on your task"
              />
              <ToggleSwitch
                checked={emailNotifs.teamUpdates}
                onChange={() => setEmailNotifs({ ...emailNotifs, teamUpdates: !emailNotifs.teamUpdates })}
                label="Team updates"
                description="Updates about your team's activity"
              />
            </div>
          </div>

          {/* Push Notifications */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-base font-medium mb-3">Push Notifications</h3>
            <div className="space-y-3">
              <ToggleSwitch
                checked={pushNotifs.taskAssigned}
                onChange={() => setPushNotifs({ ...pushNotifs, taskAssigned: !pushNotifs.taskAssigned })}
                label="Task assignments"
                description="When a task is assigned to you"
              />
              <ToggleSwitch
                checked={pushNotifs.taskDue}
                onChange={() => setPushNotifs({ ...pushNotifs, taskDue: !pushNotifs.taskDue })}
                label="Task due dates"
                description="Reminders for upcoming and overdue tasks"
              />
              <ToggleSwitch
                checked={pushNotifs.comments}
                onChange={() => setPushNotifs({ ...pushNotifs, comments: !pushNotifs.comments })}
                label="Comments"
                description="When someone comments on your task"
              />
              <ToggleSwitch
                checked={pushNotifs.teamUpdates}
                onChange={() => setPushNotifs({ ...pushNotifs, teamUpdates: !pushNotifs.teamUpdates })}
                label="Team updates"
                description="Updates about your team's activity"
              />
            </div>
          </div>

          {/* Other Notification Settings */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-base font-medium mb-3">Other Settings</h3>
            <div className="space-y-3">
              <ToggleSwitch
                checked={sounds}
                onChange={() => setSounds(!sounds)}
                label="Notification sounds"
                description="Play sounds for notifications"
              />
              <ToggleSwitch
                checked={dailyDigest}
                onChange={() => setDailyDigest(!dailyDigest)}
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
const PrivacySettings: React.FC = () => {
  const [profileVisibility, setProfileVisibility] = useState('team');
  const [activityStatus, setActivityStatus] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [shareTaskHistory, setShareTaskHistory] = useState(true);

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
              className="w-full px-3 py-2 border border-border rounded-lg bg-card transition-all duration-300"
              value={profileVisibility}
              onChange={(e) => setProfileVisibility(e.target.value)}
            >
              <option value="public">Public - Anyone can view your profile</option>
              <option value="team">Team Only - Only team members can view your profile</option>
              <option value="private">Private - Only you can view your profile</option>
            </select>
          </div>

          {/* Other Privacy Settings */}
          <div className="space-y-3 pt-4 border-t border-border">
            <ToggleSwitch
              checked={activityStatus}
              onChange={() => setActivityStatus(!activityStatus)}
              label="Show activity status"
              description="Let others see when you're online"
            />
            <ToggleSwitch
              checked={showEmail}
              onChange={() => setShowEmail(!showEmail)}
              label="Show email address"
              description="Make your email visible to other users"
            />
            <ToggleSwitch
              checked={shareTaskHistory}
              onChange={() => setShareTaskHistory(!shareTaskHistory)}
              label="Share task history"
              description="Allow teammates to see your completed tasks"
            />
          </div>

          {/* Data Controls */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-base font-medium mb-3">Data Controls</h3>
            <div className="space-y-3">
              <Button variant="outline" size="sm" className="transition-all duration-300">
                Download Personal Data
              </Button>
              <Button variant="destructive" size="sm" className="transition-all duration-300">
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
const SecuritySettings: React.FC = () => {
  const toast = useToast();
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    try {
      setChangingPassword(true);
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password changed successfully');
      setShowPasswordForm(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Failed to change password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

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
              <span className="text-xs text-gray-500">Keep your password secure</span>
            </div>

            {!showPasswordForm ? (
              <Button
                variant="outline"
                size="sm"
                className="transition-all duration-300"
                onClick={() => setShowPasswordForm(true)}
              >
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            ) : (
              <div className="space-y-4 p-4 border border-border rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card transition-all duration-300"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card transition-all duration-300"
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-card transition-all duration-300"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="transition-all duration-300"
                  >
                    {changingPassword ? 'Changing...' : 'Change Password'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    disabled={changingPassword}
                    className="transition-all duration-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Two-Factor Authentication */}
          <div className="pt-4 border-t border-border">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-base font-medium">Two-Factor Authentication</h3>
                <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <ToggleSwitch
                checked={twoFactorAuth}
                onChange={() => {
                  setTwoFactorAuth(!twoFactorAuth);
                  toast.info('2FA feature coming soon!');
                }}
              />
            </div>
            {!twoFactorAuth && (
              <Button
                variant="outline"
                size="sm"
                className="transition-all duration-300"
                onClick={() => toast.info('2FA setup coming soon!')}
              >
                <Shield className="h-4 w-4 mr-2" />
                Set Up 2FA
              </Button>
            )}
          </div>

          {/* Session Settings */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-base font-medium mb-3">Session Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card transition-all duration-300"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                  <option value="480">8 hours</option>
                </select>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="transition-all duration-300"
                onClick={() => toast.info('Session management coming soon!')}
              >
                Sign Out All Other Sessions
              </Button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="pt-4 border-t border-border">
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
              <h4 className="text-sm font-medium text-amber-400 mb-1">Security Tip</h4>
              <p className="text-xs text-foreground/70">
                Always use a strong, unique password and enable two-factor authentication for maximum security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Account Settings
interface AccountSettingsProps {
  userData: UserProfile;
  editForm: { name: string; email: string };
  setEditForm: (form: { name: string; email: string }) => void;
  onSave: () => void;
  saving: boolean;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
  userData,
  editForm,
  setEditForm,
  onSave,
  saving
}) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Please enter your password to confirm account deletion');
      return;
    }

    try {
      setDeleting(true);
      await userService.deleteAccount(deletePassword);
      toast.success('Account deleted successfully');
      logout();
      navigate('/');
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Account</h2>
        <p className="text-sm text-gray-500 mb-6">Manage your account details and profile</p>

        <div className="space-y-6">
          {/* Account Information */}
          <div>
            <h3 className="text-base font-medium mb-3">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card transition-all duration-300"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card transition-all duration-300"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-muted transition-all duration-300"
                  value={userData.role}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">
                  Member Since
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-muted transition-all duration-300"
                  value={formatDate(userData.createdAt)}
                  readOnly
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                className="transition-all duration-300"
                onClick={onSave}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Account Status */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-base font-medium mb-3">Account Status</h3>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Account ID</p>
                  <p className="text-xs text-gray-500 font-mono mt-1">{userData._id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${userData.isActive
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                  {userData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-4 border-t-2 border-red-200 dark:border-red-900">
            <h3 className="text-base font-medium mb-3 text-red-600 dark:text-red-400">Danger Zone</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Once you delete your account, there is no going back. All your tasks, projects, and data will be permanently deleted.
              </p>

              {!showDeleteConfirm ? (
                <Button
                  variant="destructive"
                  size="sm"
                  className="transition-all duration-300"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Account
                </Button>
              ) : (
                <div className="space-y-3 p-4 border-2 border-red-300 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-md">
                    <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                      ⚠️ This action cannot be undone. All your data will be permanently deleted.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-red-800 dark:text-red-300">
                      Enter your password to confirm
                    </label>
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full px-3 py-2 border border-red-300 dark:border-red-700 rounded-lg bg-card transition-all duration-300"
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteAccount}
                      disabled={deleting || !deletePassword}
                      className="transition-all duration-300"
                    >
                      {deleting ? 'Deleting...' : 'Permanently Delete My Account'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletePassword('');
                      }}
                      disabled={deleting}
                      className="transition-all duration-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Language Settings
const LanguageSettings: React.FC = () => {
  const [language, setLanguage] = useState('English');
  const toast = useToast();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Language & Region</h2>
        <p className="text-sm text-gray-500 mb-6">Choose your language and regional preferences</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-lg bg-card transition-all duration-300"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                toast.info('Language preference saved');
              }}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="German">German (Deutsch)</option>
              <option value="Japanese">Japanese (日本語)</option>
              <option value="Chinese">Chinese (中文)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="text-base font-medium mb-3">Time & Date Format</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Date Format</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card transition-all duration-300"
                >
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time Format</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card transition-all duration-300"
                >
                  <option>12-hour (AM/PM)</option>
                  <option>24-hour</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Help Settings
const HelpSettings: React.FC = () => {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Help & Support</h2>
        <p className="text-sm text-gray-500 mb-6">Get help and support resources</p>

        <div className="space-y-6">
          {/* Quick Links */}
          <div>
            <h3 className="text-base font-medium mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => toast.info('Opening documentation...')}
              >
                <Globe className="h-4 w-4 mr-2" />
                Documentation
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => toast.info('Opening FAQs...')}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQs
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => toast.info('Contact support coming soon!')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>

          {/* App Version */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-base font-medium mb-3">App Information</h3>
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Version</span>
                <span className="text-sm font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Build</span>
                <span className="text-sm font-medium">2024.02.17</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Mail = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);
// Theme Option Component
interface ThemeOptionProps {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({ icon, label, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-300 ${selected
        ? 'border-amber-500 bg-amber-500/10'
        : 'border-border hover:border-gray-300 dark:hover:border-gray-600'
        }`}
    >
      <div className={`mb-2 ${selected ? 'text-amber-500' : ''}`}>{icon}</div>
      <span className={`text-sm font-medium ${selected ? 'text-amber-500' : ''}`}>{label}</span>
    </button>
  );
};

// Size Option Component
interface SizeOptionProps {
  label: string;
  className: string;
  selected: boolean;
  onClick: () => void;
}

const SizeOption: React.FC<SizeOptionProps> = ({ label, className, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center px-4 py-2 rounded-lg border transition-all duration-300 ${selected
        ? 'border-amber-500 bg-amber-500/10'
        : 'border-border hover:border-gray-300 dark:hover:border-gray-600'
        }`}
    >
      <span className={`font-medium ${className} ${selected ? 'text-amber-500' : ''}`}>{label}</span>
    </button>
  );
};

export default SettingsPage;
