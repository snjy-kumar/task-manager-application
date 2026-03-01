import React, { useState, useEffect } from 'react';
import {
  User, Mail, Calendar, Clock, Lock, Shield,
  FileText, Save, X, Edit, CheckCircle2, Loader2,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import userService, { type UserProfile } from '@/services/userService';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const profile = await userService.getProfile();
        setUserData(profile);
        setEditForm({ name: profile.name, email: profile.email });
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleEditToggle = () => {
    if (isEditing && userData) setEditForm({ name: userData.name, email: userData.email });
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    if (!userData) return;
    try {
      setSaving(true);
      const updated = await userService.updateProfile(editForm);
      setUserData(updated);
      setIsEditing(false);
      toast.success('Profile updated');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const fmt = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

  const initials = userData?.name
    ? userData.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '??';

  const completion = userData
    ? [userData.name, userData.email, userData.role, (userData.tasks?.length ?? 0) > 0].filter(Boolean).length * 25
    : 0;

  const taskStats = {
    completed: userData?.tasks?.filter(t => t.status === 'completed').length ?? 0,
    inProgress: userData?.tasks?.filter(t => t.status === 'in-progress').length ?? 0,
    total: userData?.tasks?.length ?? 0,
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  if (!userData) return (
    <div className="flex items-center justify-center h-96">
      <p className="text-muted-foreground">Failed to load profile</p>
    </div>
  );

  const inputBase = "w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:border-amber-500 transition-colors";

  const tabs = ['overview', 'activity', 'settings'];

  return (
    <div className="space-y-6 p-1 max-w-4xl">
      {/* Profile header card */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Amber band */}
        <div className="h-24 bg-amber-500/10" style={{ background: 'linear-gradient(135deg, hsl(38,95%,54%,0.15) 0%, hsl(222,25%,15%) 100%)' }} />

        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-10 gap-4">
            {/* Avatar + name */}
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-xl border-4 border-card bg-amber-500 flex items-center justify-center text-black font-bold text-xl shrink-0">
                {initials}
              </div>
              <div className="mb-1">
                {isEditing ? (
                  <input
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className={inputBase + ' text-xl font-bold w-48'}
                  />
                ) : (
                  <h1 className="text-xl font-bold text-foreground">{userData.name}</h1>
                )}
                <p className="text-muted-foreground text-sm">{userData.role ?? 'Member'}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mb-1">
              {isEditing ? (
                <>
                  <button onClick={handleEditToggle} disabled={saving} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground text-sm transition-colors">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                  <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors">
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </>
              ) : (
                <button onClick={handleEditToggle} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground text-sm transition-colors">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-5 border-b border-border">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Contact info */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-foreground text-sm">Contact Information</h3>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { icon: Mail, label: 'Email', value: isEditing
                    ? <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className={inputBase} />
                    : <span className="text-foreground">{userData.email}</span> },
                { icon: User, label: 'User ID', value: <span className="text-foreground font-mono text-xs">{userData._id}</span> },
                { icon: Calendar, label: 'Member since', value: <span className="text-foreground">{fmt(userData.createdAt)}</span> },
                ...(userData.lastLogin ? [{ icon: Clock, label: 'Last login', value: <span className="text-foreground">{fmt(userData.lastLogin)}</span> }] : []),
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-muted-foreground text-xs mb-0.5">{label}</p>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account overview */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-foreground text-sm">Account Overview</h3>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Role', value: userData.role ?? '—' },
                { label: 'Total tasks', value: String(taskStats.total) },
                { label: 'Completed', value: String(taskStats.completed) },
                { label: 'Status', value: userData.isActive !== false ? 'Active' : 'Inactive' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground font-medium">{value}</span>
                </div>
              ))}
            </div>

            {/* Completion bar */}
            <div className="mt-5 pt-4 border-t border-border">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">Profile completion</span>
                <span className="text-foreground font-medium">{completion}%</span>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${completion}%` }} />
              </div>
            </div>
          </div>

          {/* Recent tasks */}
          {userData.tasks && userData.tasks.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                <h3 className="font-semibold text-foreground text-sm">Recent Tasks</h3>
              </div>
              <div className="space-y-2">
                {userData.tasks.slice(0, 5).map(task => (
                  <div key={task._id} className="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm">
                    <span className="text-foreground truncate flex-1">{task.title}</span>
                    <span className={`ml-3 shrink-0 text-xs px-2 py-0.5 rounded-full ${
                      task.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' :
                      task.status === 'in-progress' ? 'bg-amber-500/15 text-amber-400' :
                      'bg-border text-muted-foreground'
                    }`}>{task.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Activity tab */}
      {activeTab === 'activity' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Completed', value: taskStats.completed, accent: 'text-emerald-400' },
            { label: 'In Progress', value: taskStats.inProgress, accent: 'text-amber-400' },
            { label: 'Total', value: taskStats.total, accent: 'text-foreground' },
            { label: 'Rate', value: `${taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%`, accent: 'text-amber-400' },
          ].map(({ label, value, accent }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
              <p className={`text-3xl font-bold ${accent}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Settings tab */}
      {activeTab === 'settings' && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <h2 className="font-semibold text-foreground">Account Settings</h2>

          <div>
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-4">
              <User className="w-4 h-4" /> Profile Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', id: 'name', type: 'text', value: editForm.name, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, name: e.target.value }) },
                { label: 'Email', id: 'email', type: 'email', value: editForm.email, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, email: e.target.value }) },
              ].map(({ label, id, type, value, onChange }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-xs text-muted-foreground mb-1.5">{label}</label>
                  <input id={id} type={type} value={value} onChange={onChange} className={inputBase} />
                </div>
              ))}
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Role</label>
                <input value={userData.role ?? '—'} disabled className={inputBase + ' opacity-50 cursor-not-allowed'} />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Member Since</label>
                <input value={fmt(userData.createdAt)} disabled className={inputBase + ' opacity-50 cursor-not-allowed'} />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4" /> Security
            </h3>
            <p className="text-sm text-muted-foreground mb-3">Keep your account secure by updating your password regularly.</p>
            <button onClick={() => toast.info('Password change coming soon!')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Lock className="w-3.5 h-3.5" /> Change Password
            </button>
          </div>

          <div className="border-t border-border pt-5">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4" /> Account Status
            </h3>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium text-foreground">Account Status</p>
                <p className="text-xs text-muted-foreground">Currently {userData.isActive !== false ? 'active' : 'inactive'}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${userData.isActive !== false ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                {userData.isActive !== false ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button onClick={() => setEditForm({ name: userData.name, email: userData.email })} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
              Reset
            </button>
            <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
