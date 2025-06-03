import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Plus
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
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

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <Link to="/dashboard" className="flex items-center">
            <CheckCircle className="h-8 w-8 text-primary" />
            <span className="ml-2 font-bold text-xl">AI Task Manager</span>
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
            to="/dashboard/calendar" 
            icon={<Calendar />} 
            label="Calendar" 
            active={isActive('/dashboard/calendar')} 
          />
          <SidebarLink 
            to="/dashboard/reports" 
            icon={<BarChart />} 
            label="Reports" 
            active={isActive('/dashboard/reports')} 
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
            Projects
          </div>
          
          <ProjectLink 
            name="Personal Tasks" 
            count={12} 
            color="blue" 
            active={isActive('/dashboard/projects/personal')} 
            to="/dashboard/projects/personal"
          />
          <ProjectLink 
            name="Work" 
            count={34} 
            color="green" 
            active={isActive('/dashboard/projects/work')} 
            to="/dashboard/projects/work"
          />
          <ProjectLink 
            name="Shopping List" 
            count={7} 
            color="purple" 
            active={isActive('/dashboard/projects/shopping')} 
            to="/dashboard/projects/shopping"
          />
          
          <div className="mt-2">
            <Link 
              to="/dashboard/projects/new" 
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <Plus className="h-5 w-5 mr-2 text-gray-500" />
              Add New Project
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
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
                placeholder="Search..."
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
                  3
                </span>
              </button>
              
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20">
                  <div className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    <NotificationItem 
                      title="New task assigned" 
                      time="2 min ago" 
                      read={false} 
                    />
                    <NotificationItem 
                      title="Meeting reminder: Team Sync" 
                      time="1 hour ago" 
                      read={false} 
                    />
                    <NotificationItem 
                      title="Task completed: Project Update" 
                      time="5 hours ago" 
                      read={false} 
                    />
                    <NotificationItem 
                      title="New comment on 'Bug fix'" 
                      time="Yesterday" 
                      read={true} 
                    />
                  </div>
                  <div className="py-2 px-4 border-t border-gray-200 dark:border-gray-700 text-center">
                    <Link to="/dashboard/notifications" className="text-sm text-primary font-medium">
                      View all notifications
                    </Link>
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
                <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="User avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="hidden md:inline-block font-medium">John Doe</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20">
                  <div className="py-1">
                    <Link
                      to="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </div>
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </div>
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    <Link
                      to="/logout"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Log out
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
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
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
        active
          ? 'bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <span className={`mr-3 h-5 w-5 ${active ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'}`}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
};

// Project Link Component
interface ProjectLinkProps {
  name: string;
  count: number;
  color: string;
  active: boolean;
  to: string;
}

const ProjectLink: React.FC<ProjectLinkProps> = ({ name, count, color, active, to }) => {
  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      case 'purple':
        return 'bg-purple-500';
      case 'red':
        return 'bg-red-500';
      case 'yellow':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Link
      to={to}
      className={`flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md ${
        active
          ? 'bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <div className="flex items-center">
        <span className={`h-3 w-3 rounded-full mr-3 ${getColorClass(color)}`}></span>
        <span>{name}</span>
      </div>
      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-600">
        {count}
      </span>
    </Link>
  );
};

// Notification Item Component
interface NotificationItemProps {
  title: string;
  time: string;
  read: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ title, time, read }) => {
  return (
    <div className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 ${!read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
      <div className="flex justify-between items-start">
        <p className={`text-sm ${!read ? 'font-semibold' : ''}`}>{title}</p>
        {!read && (
          <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{time}</p>
    </div>
  );
};

export default DashboardLayout; 