import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Menu,
  X,
  Home,
  ListTodo,
  Calendar,
  BarChart,
  Settings,
  Star,
  Clock,
  Bell,
  LogOut,
  User,
  ChevronDown,
  Search,
  Plus,
  Columns3,
  CalendarDays,
  FileText,
  Activity,
  GanttChart,
  Bell as BellIcon,
  FileArchive,
  HelpCircle,
  FolderOpen,
  Briefcase,
  Download,
  Users as UsersIcon,
  Plug
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-950">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 left-0 z-30 w-64 transition-all duration-300 transform bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <Link to="/dashboard" className="flex items-center">
            <CheckCircle className="h-8 w-8 text-primary" />
            <span className="ml-2 font-bold text-xl">Task Manager</span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-6 px-4 space-y-1">
          <SidebarLink
            to="/dashboard"
            icon={<Home />}
            label="Dashboard"
            active={isActive('/dashboard')}
          />
          <SidebarLink
            to="/dashboard/tasks"
            icon={<ListTodo />}
            label="My Tasks"
            active={isActive('/dashboard/tasks')}
          />
          <SidebarLink
            to="/dashboard/kanban"
            icon={<Columns3 />}
            label="Kanban Board"
            active={isActive('/dashboard/kanban')}
          />
          <SidebarLink
            to="/dashboard/calendar"
            icon={<Calendar />}
            label="Calendar"
            active={isActive('/dashboard/calendar')}
          />
          <SidebarLink
            to="/dashboard/gantt"
            icon={<GanttChart />}
            label="Gantt Chart"
            active={isActive('/dashboard/gantt')}
          />
          <SidebarLink
            to="/dashboard/analytics"
            icon={<Activity />}
            label="Analytics"
            active={isActive('/dashboard/analytics')}
          />
          <SidebarLink
            to="/dashboard/templates"
            icon={<FileText />}
            label="Templates"
            active={isActive('/dashboard/templates')}
          />
          <SidebarLink
            to="/dashboard/reports"
            icon={<BarChart />}
            label="Reports"
            active={isActive('/dashboard/reports')}
          />
          <SidebarLink
            to="/dashboard/search"
            icon={<Search />}
            label="Advanced Search"
            active={isActive('/dashboard/search')}
          />
          <SidebarLink
            to="/dashboard/notifications"
            icon={<BellIcon />}
            label="Notifications"
            active={isActive('/dashboard/notifications')}
          />
          <SidebarLink
            to="/dashboard/reminders"
            icon={<Clock />}
            label="Reminders"
            active={isActive('/dashboard/reminders')}
          />
          <SidebarLink
            to="/dashboard/files"
            icon={<FolderOpen />}
            label="File Manager"
            active={isActive('/dashboard/files')}
          />
          <SidebarLink
            to="/dashboard/import-export"
            icon={<Download />}
            label="Import/Export"
            active={isActive('/dashboard/import-export')}
          />
          <SidebarLink
            to="/dashboard/starred"
            icon={<Star />}
            label="Starred"
            active={isActive('/dashboard/starred')}
          />
          <SidebarLink
            to="/dashboard/recent"
            icon={<Clock />}
            label="Recently Viewed"
            active={isActive('/dashboard/recent')}
          />

          <div className="pt-4 pb-2">
            <div className="border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          <div className="px-2 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Settings & Help
          </div>

          <SidebarLink
            to="/dashboard/teams"
            icon={<UsersIcon />}
            label="Team Management"
            active={isActive('/dashboard/teams')}
          />
          <SidebarLink
            to="/dashboard/workspace-settings"
            icon={<Briefcase />}
            label="Workspace"
            active={isActive('/dashboard/workspace-settings')}
          />
          <SidebarLink
            to="/dashboard/integrations"
            icon={<Plug />}
            label="Integrations"
            active={isActive('/dashboard/integrations')}
          />
          <SidebarLink
            to="/dashboard/audit-log"
            icon={<FileArchive />}
            label="Activity Log"
            active={isActive('/dashboard/audit-log')}
          />
          <SidebarLink
            to="/dashboard/help"
            icon={<HelpCircle />}
            label="Help Center"
            active={isActive('/dashboard/help')}
          />

          <div className="pt-4 pb-2">
            <div className="border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          <div className="px-2 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Quick Actions
          </div>

          <div className="mt-2">
            <Link
              to="/dashboard/tasks/new"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all duration-300"
            >
              <Plus className="h-5 w-5 mr-2 text-gray-500" />
              Create New Task
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 transition-all duration-300">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 focus:outline-none lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative mx-4 lg:mx-0 hidden md:block">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="h-5 w-5 text-gray-500" />
              </span>
              <input
                className="form-input w-64 sm:w-72 rounded-md pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                type="text"
                placeholder="Search tasks..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                  0
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg z-20 transition-all duration-300">
                  <div className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                  </div>
                  <div className="p-4 text-center text-sm text-gray-500">
                    No new notifications
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-gray-700 dark:bg-gray-300 text-white dark:text-black flex items-center justify-center font-medium text-sm">
                  {getUserInitials()}
                </div>
                <span className="hidden md:inline-block font-medium">{user?.name || 'User'}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg z-20 transition-all duration-300">
                  <div className="py-1">
                    <Link
                      to="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </div>
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </div>
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Log out
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-950 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// Sidebar Link Component
interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${active
        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
    >
      <span className={`mr-3 h-5 w-5 ${active ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'}`}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
};

export default DashboardLayout; 