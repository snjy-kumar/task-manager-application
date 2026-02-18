import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Calendar,
  Clock,
  Lock,
  Bell,
  Shield,
  Globe,
  Award,
  CheckCircle,
  FileText,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import BentoGrid from '@/components/ui/bento/BentoGrid';
import BentoCard from '@/components/ui/bento/BentoCard';
import { ProfileSkeleton } from '@/components/ui/LoadingSkeleton';
import { useToast } from '@/components/ui/Toast';
import userService, { type UserProfile } from '@/services/userService';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const gridRef = useRef(null);
  const toast = useToast();

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
        toast.error(error.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    if (isEditing && userData) {
      // Cancel editing - reset form
      setEditForm({ name: userData.name, email: userData.email });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    if (!userData) return;

    try {
      setSaving(true);
      const updatedUser = await userService.updateProfile(editForm);
      setUserData(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateProfileCompletion = (user: UserProfile | null) => {
    if (!user) return 0;
    let completed = 0;
    if (user.name) completed += 25;
    if (user.email) completed += 25;
    if (user.role) completed += 25;
    if (user.tasks && user.tasks.length > 0) completed += 25;
    return completed;
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Failed to load profile</p>
      </div>
    );
  }

  const profileCompletion = calculateProfileCompletion(userData);

  // Calculate task statistics from user data
  const taskStats = {
    completed: userData.tasks?.filter(t => t.status === 'completed').length || 0,
    inProgress: userData.tasks?.filter(t => t.status === 'in-progress').length || 0,
    total: userData.tasks?.length || 0
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-700 dark:to-blue-700"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center">
                <User className="h-16 w-16 text-gray-400" />
              </div>
              <div className="mt-4 md:mt-0 md:ml-6">
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="text-2xl font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{userData.name}</h1>
                )}
                <p className="text-gray-500 dark:text-gray-400">{userData.role}</p>
                {userData.isActive !== undefined && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${userData.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                    {userData.isActive ? 'Active' : 'Inactive'}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="transition-all duration-300"
                    onClick={handleEditToggle}
                    disabled={saving}
                  >
                    <X className="h-4 w-4 mr-2" /> Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="transition-all duration-300"
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save'}
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="transition-all duration-300"
                  onClick={handleEditToggle}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Navigation */}
        <div className="px-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-6 overflow-x-auto">
            <button
              className={`py-4 px-1 text-sm font-medium border-b-2 transition-all duration-300 ${activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-4 px-1 text-sm font-medium border-b-2 transition-all duration-300 ${activeTab === 'activity'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
            <button
              className={`py-4 px-1 text-sm font-medium border-b-2 transition-all duration-300 ${activeTab === 'settings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      {activeTab === 'overview' && (
        <BentoGrid cols={3} gap="md" ref={gridRef}>
          {/* Contact Information */}
          <BentoCard
            title="Contact Information"
            icon={<User className="h-5 w-5" />}
            size="md"
          >
            <div className="space-y-3 mt-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-500 mr-3" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="text-sm font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded w-full"
                    />
                  ) : (
                    <p className="text-sm font-medium">{userData.email}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                  <p className="text-sm font-medium font-mono">{userData._id}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                  <p className="text-sm font-medium">{formatDate(userData.createdAt)}</p>
                </div>
              </div>
              {userData.lastLogin && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
                    <p className="text-sm font-medium">{formatDate(userData.lastLogin)}</p>
                  </div>
                </div>
              )}
            </div>
          </BentoCard>

          {/* About/Bio */}
          <BentoCard
            title="Account Overview"
            icon={<FileText className="h-5 w-5" />}
            size="md"
          >
            <div className="space-y-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Role</span>
                <span className="text-sm font-medium">{userData.role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Tasks</span>
                <span className="text-sm font-medium">{taskStats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Account Status</span>
                <span className={`text-sm font-medium ${userData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {userData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </BentoCard>

          {/* Profile Completion */}
          <BentoCard
            title="Profile Completion"
            icon={<CheckCircle className="h-5 w-5" />}
            size="sm"
          >
            <div className="mt-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{profileCompletion}% complete</span>
                <span className="text-xs text-gray-500">{profileCompletion}/100</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center">
                  <CheckCircle className={`h-4 w-4 mr-2 ${userData.name ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className="text-xs">Name</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`h-4 w-4 mr-2 ${userData.email ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className="text-xs">Email</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`h-4 w-4 mr-2 ${userData.role ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className="text-xs">Role</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className={`h-4 w-4 mr-2 ${userData.tasks && userData.tasks.length > 0 ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className="text-xs">Tasks</span>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Task Statistics */}
          <BentoCard
            title="My Tasks"
            icon={<CheckCircle className="h-5 w-5" />}
            size="md"
            gradient
            gradientFrom="from-blue-600/20"
            gradientTo="to-purple-400/20"
          >
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-white dark:bg-gray-900 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
                <p className="text-xs text-gray-500">In Progress</p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-3 rounded-lg text-center col-span-2">
                <p className="text-2xl font-bold text-purple-600">{taskStats.total}</p>
                <p className="text-xs text-gray-500">Total Tasks</p>
              </div>
            </div>
          </BentoCard>

          {/* Recent Tasks */}
          {userData.tasks && userData.tasks.length > 0 && (
            <BentoCard
              title="Recent Tasks"
              icon={<FileText className="h-5 w-5" />}
              size="md"
            >
              <div className="space-y-2 mt-2">
                {userData.tasks.slice(0, 5).map((task) => (
                  <div key={task._id} className="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{task.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${task.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              task.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                            {task.status}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      {task.dueDate && (
                        <span className="text-xs text-gray-500 ml-2">
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </BentoCard>
          )}
        </BentoGrid>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Activity Overview</h2>

            <BentoGrid cols={2} gap="md">
              <BentoCard
                title="Task Statistics"
                icon={<CheckCircle className="h-5 w-5" />}
                size="md"
              >
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="bg-primary/10 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold">{taskStats.completed}</p>
                    <p className="text-xs text-gray-500">Tasks Completed</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold">{taskStats.inProgress}</p>
                    <p className="text-xs text-gray-500">In Progress</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold">{taskStats.total}</p>
                    <p className="text-xs text-gray-500">Total Tasks</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold">
                      {taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%
                    </p>
                    <p className="text-xs text-gray-500">Completion Rate</p>
                  </div>
                </div>
              </BentoCard>

              <BentoCard
                title="Recent Activity"
                icon={<Clock className="h-5 w-5" />}
                size="md"
              >
                <div className="space-y-3 mt-3">
                  {userData.tasks && userData.tasks.length > 0 ? (
                    userData.tasks.slice(0, 3).map((task) => (
                      <div key={task._id} className="flex items-start">
                        <CheckCircle className={`h-4 w-4 mr-2 mt-0.5 ${task.status === 'completed' ? 'text-green-500' : 'text-blue-500'
                          }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{task.title}</p>
                          <p className="text-xs text-gray-500">{task.status}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No recent activity</p>
                  )}
                </div>
              </BentoCard>
            </BentoGrid>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">Account Settings</h2>

              <div className="space-y-6">
                {/* Profile Information */}
                <div>
                  <h3 className="text-base font-medium flex items-center">
                    <User className="h-4 w-4 mr-2" /> Profile Information
                  </h3>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        value={userData.role}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Member Since
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        value={formatDate(userData.createdAt)}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                {/* Security */}
                <div>
                  <h3 className="text-base font-medium flex items-center">
                    <Lock className="h-4 w-4 mr-2" /> Security
                  </h3>
                  <div className="mt-4 space-y-3">
                    <p className="text-sm text-gray-500">
                      Keep your account secure by updating your password regularly.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info('Password change coming soon!')}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                {/* Account Status */}
                <div>
                  <h3 className="text-base font-medium flex items-center">
                    <Shield className="h-4 w-4 mr-2" /> Account Status
                  </h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Account Status</p>
                        <p className="text-xs text-gray-500">Your account is currently {userData.isActive ? 'active' : 'inactive'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${userData.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {userData.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  className="transition-all duration-300"
                  onClick={() => setEditForm({ name: userData.name, email: userData.email })}
                >
                  Cancel
                </Button>
                <Button
                  className="transition-all duration-300"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
