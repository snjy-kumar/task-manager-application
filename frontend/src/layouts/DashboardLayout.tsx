import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  CheckCircle2,
  Menu,
  X,
  Home,
  ListTodo,
  Calendar,
  BarChart3,
  Settings,
  Star,
  Bell,
  LogOut,
  User,
  ChevronDown,
  Search,
  Plus,
  Columns3,
  FileText,
  Activity,
  GanttChart,
  FileArchive,
  HelpCircle,
  FolderOpen,
  Briefcase,
  Download,
  Users as UsersIcon,
  Plug,
  AlarmClock
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navGroups = [
  {
    label: 'Workspace',
    items: [
      { to: '/dashboard', icon: Home, label: 'Dashboard' },
      { to: '/dashboard/tasks', icon: ListTodo, label: 'My Tasks' },
      { to: '/dashboard/kanban', icon: Columns3, label: 'Kanban' },
      { to: '/dashboard/calendar', icon: Calendar, label: 'Calendar' },
      { to: '/dashboard/gantt', icon: GanttChart, label: 'Gantt Chart' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { to: '/dashboard/analytics', icon: Activity, label: 'Analytics' },
      { to: '/dashboard/reports', icon: BarChart3, label: 'Reports' },
      { to: '/dashboard/search', icon: Search, label: 'Advanced Search' },
    ],
  },
  {
    label: 'Manage',
    items: [
      { to: '/dashboard/templates', icon: FileText, label: 'Templates' },
      { to: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
      { to: '/dashboard/reminders', icon: AlarmClock, label: 'Reminders' },
      { to: '/dashboard/files', icon: FolderOpen, label: 'Files' },
      { to: '/dashboard/import-export', icon: Download, label: 'Import/Export' },
      { to: '/dashboard/teams', icon: UsersIcon, label: 'Teams' },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/dashboard/starred', icon: Star, label: 'Starred' },
      { to: '/dashboard/workspace-settings', icon: Briefcase, label: 'Workspace' },
      { to: '/dashboard/integrations', icon: Plug, label: 'Integrations' },
      { to: '/dashboard/audit-log', icon: FileArchive, label: 'Activity Log' },
      { to: '/dashboard/help', icon: HelpCircle, label: 'Help' },
    ],
  },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const parts = user.name.split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : user.name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 w-60 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        style={{ background: 'hsl(222, 25%, 7%)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-14 px-5 border-b border-white/8 flex-shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/30">
              <CheckCircle2 className="w-4 h-4 text-[hsl(222,25%,7%)]" strokeWidth={2.5} />
            </div>
            <span className="text-white font-display font-semibold text-base tracking-tight">Taskr</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white/80 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick create */}
        <div className="px-4 pt-4 pb-2 flex-shrink-0">
          <Link
            to="/dashboard/tasks/new"
            className="flex items-center justify-center gap-2 w-full h-9 rounded-xl bg-amber-500 hover:bg-amber-600 text-[hsl(222,25%,7%)] text-sm font-semibold transition-colors shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            New Task
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-5 scrollbar-thin">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/25">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.to);
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 ${active
                            ? 'bg-amber-500/15 text-amber-400 font-medium'
                            : 'text-white/50 hover:text-white/85 hover:bg-white/6'
                          }`}
                      >
                        <item.icon
                          className={`w-4 h-4 flex-shrink-0 ${active ? 'text-amber-400' : ''}`}
                          strokeWidth={active ? 2 : 1.75}
                        />
                        {item.label}
                        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="flex-shrink-0 border-t border-white/8 p-3">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/6 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xs font-bold font-display flex-shrink-0">
              {getUserInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/85 text-sm font-medium truncate leading-tight">{user?.name || 'User'}</p>
              <p className="text-white/30 text-[11px] truncate leading-tight">{user?.email || ''}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search tasks…"
                className="h-9 pl-9 pr-4 w-64 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Bell className="w-4 h-4" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-2xl shadow-xl z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <h3 className="font-display font-semibold text-sm">Notifications</h3>
                  </div>
                  <div className="p-6 text-center">
                    <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">All caught up!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-secondary transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold font-display">
                  {getUserInitials()}
                </div>
                <span className="hidden md:block text-sm font-medium">{user?.name?.split(' ')[0] || 'User'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                    >
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                  </div>
                  <div className="border-t border-border py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto bg-background p-6 scrollbar-thin"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
