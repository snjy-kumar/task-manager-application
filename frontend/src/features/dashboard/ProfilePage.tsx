import React, { useState, useRef } from 'react';
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
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import BentoGrid from '@/components/ui/bento/BentoGrid';
import BentoCard from '@/components/ui/bento/BentoCard';

// Sample user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  role: "Product Manager",
  department: "Product Development",
  joinDate: "January 15, 2023",
  bio: "Experienced product manager with a passion for creating user-centered solutions. I enjoy collaborating with cross-functional teams to deliver high-quality products.",
  skills: ["Product Strategy", "User Research", "Agile Methodologies", "Data Analysis", "Team Leadership"],
  languages: ["English (Native)", "Spanish (Intermediate)", "French (Basic)"],
  achievements: [
    { title: "Q1 Goal Achievement", date: "March 2023", description: "Exceeded quarterly product goals by 15%" },
    { title: "Product Launch Success", date: "November 2022", description: "Successfully launched mobile app with 4.8/5 user rating" },
    { title: "Team Excellence Award", date: "June 2022", description: "Recognized for outstanding team leadership" }
  ],
  profileCompletion: 85,
  activityLevel: "Very Active",
  preferences: {
    theme: "System",
    notifications: {
      email: true,
      push: true,
      taskReminders: true,
      teamUpdates: false
    },
    privacy: {
      showEmail: true,
      showPhone: false,
      profileVisibility: "Team Only"
    }
  }
};

const recentActivity = [
  { id: 1, type: "task", action: "completed", item: "Project Planning", time: "2 hours ago" },
  { id: 2, type: "comment", action: "posted", item: "Marketing Campaign", time: "Yesterday" },
  { id: 3, type: "document", action: "edited", item: "Q2 Strategy", time: "3 days ago" },
  { id: 4, type: "task", action: "created", item: "Client Meeting Preparation", time: "1 week ago" }
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const gridRef = useRef(null);
  
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-32 bg-gray-700 dark:bg-gray-800"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-700 shadow-lg">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4 md:mt-0 md:ml-6">
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <p className="text-gray-500 dark:text-gray-400">{userData.role} • {userData.department}</p>
              </div>
            </div>
            <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="transition-all duration-300">
                <Edit className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
              <Button size="sm" className="transition-all duration-300">
                Message
              </Button>
            </div>
          </div>
        </div>
        
        {/* Profile Navigation */}
        <div className="px-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-6 overflow-x-auto">
            <button
              className={`py-4 px-1 text-sm font-medium border-b-2 transition-all duration-300 ${
                activeTab === 'overview' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-4 px-1 text-sm font-medium border-b-2 transition-all duration-300 ${
                activeTab === 'activity' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
            <button
              className={`py-4 px-1 text-sm font-medium border-b-2 transition-all duration-300 ${
                activeTab === 'settings' 
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
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium">{userData.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-sm font-medium">{userData.phone}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                  <p className="text-sm font-medium">{userData.location}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
                  <p className="text-sm font-medium">{userData.joinDate}</p>
                </div>
              </div>
            </div>
          </BentoCard>
          
          {/* Bio */}
          <BentoCard
            title="About Me"
            icon={<FileText className="h-5 w-5" />}
            size="md"
          >
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {userData.bio}
            </p>
          </BentoCard>
          
          {/* Profile Completion */}
          <BentoCard
            title="Profile Completion"
            icon={<CheckCircle className="h-5 w-5" />}
            size="sm"
          >
            <div className="mt-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{userData.profileCompletion}% complete</span>
                <span className="text-xs text-gray-500">{userData.profileCompletion}/100</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${userData.profileCompletion}%` }}
                />
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-xs">Basic information</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-xs">Contact details</span>
                </div>
                <div className="flex items-center">
                  <CircleGray className="h-4 w-4 text-gray-300 mr-2" />
                  <span className="text-xs text-gray-500">Add profile picture</span>
                </div>
              </div>
            </div>
          </BentoCard>
          
          {/* Skills */}
          <BentoCard
            title="Skills"
            icon={<Award className="h-5 w-5" />}
            size="md"
            gradient
            gradientFrom="from-gray-600/20"
            gradientTo="to-gray-400/20"
          >
            <div className="flex flex-wrap gap-2 mt-2">
              {userData.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="text-xs font-medium bg-white dark:bg-gray-900 px-2 py-1 rounded-full shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </BentoCard>
          
          {/* Languages */}
          <BentoCard
            title="Languages"
            icon={<Globe className="h-5 w-5" />}
            size="sm"
          >
            <div className="space-y-2 mt-2">
              {userData.languages.map((language, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{language}</span>
                  {index === 0 && (
                    <span className="text-xs bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                      Fluent
                    </span>
                  )}
                </div>
              ))}
            </div>
          </BentoCard>
          
          {/* Achievements */}
          <BentoCard
            title="Achievements"
            icon={<Award className="h-5 w-5" />}
            size="md"
          >
            <div className="space-y-3 mt-2">
              {userData.achievements.map((achievement, index) => (
                <div key={index} className="p-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm transition-all duration-300">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium">{achievement.title}</h4>
                    <span className="text-xs text-gray-500">{achievement.date}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                </div>
              ))}
            </div>
          </BentoCard>
        </BentoGrid>
      )}
      
      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-3 border-l-2 border-gray-200 dark:border-gray-700"></div>
              
              <div className="space-y-6">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="relative pl-10">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      {activity.type === 'task' && <CheckCircle className="h-3 w-3 text-white" />}
                      {activity.type === 'comment' && <MessageSquare className="h-3 w-3 text-white" />}
                      {activity.type === 'document' && <FileText className="h-3 w-3 text-white" />}
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">You {activity.action}</span> {activity.type === 'comment' ? 'a comment on' : activity.type === 'document' ? 'the document' : 'the task'} <span className="text-primary font-medium">{activity.item}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3 inline mr-1" /> {activity.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="mt-6 transition-all duration-300">
              View All Activity
            </Button>
          </div>
          
          <BentoGrid cols={2} gap="md">
            <BentoCard
              title="Task Statistics"
              icon={<CheckCircle className="h-5 w-5" />}
              size="md"
            >
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold">42</p>
                  <p className="text-xs text-gray-500">Tasks Completed</p>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-xs text-gray-500">In Progress</p>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold">92%</p>
                  <p className="text-xs text-gray-500">Completion Rate</p>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold">1.2d</p>
                  <p className="text-xs text-gray-500">Avg. Completion Time</p>
                </div>
              </div>
            </BentoCard>
            
            <BentoCard
              title="Activity Level"
              icon={<BarChart className="h-5 w-5" />}
              size="md"
            >
              <div className="h-40 mt-2">
                {/* Simplified bar chart */}
                <div className="h-full flex items-end space-x-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                    const heights = [60, 40, 80, 50, 70, 30, 20];
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-primary/60 rounded-t"
                          style={{ height: `${heights[i]}%` }}
                        />
                        <span className="text-xs mt-2">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </BentoCard>
          </BentoGrid>
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
                        defaultValue={userData.name}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input 
                        type="email" 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300"
                        defaultValue={userData.email}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone
                      </label>
                      <input 
                        type="tel" 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300"
                        defaultValue={userData.phone}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300"
                        defaultValue={userData.location}
                      />
                    </div>
                  </div>
                </div>
                
                <hr className="border-gray-200 dark:border-gray-700" />
                
                {/* Notifications */}
                <div>
                  <h3 className="text-base font-medium flex items-center">
                    <Bell className="h-4 w-4 mr-2" /> Notification Preferences
                  </h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Email Notifications</p>
                        <p className="text-xs text-gray-500">Receive updates via email</p>
                      </div>
                      <ToggleSwitch checked={userData.preferences.notifications.email} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Push Notifications</p>
                        <p className="text-xs text-gray-500">Receive notifications in the app</p>
                      </div>
                      <ToggleSwitch checked={userData.preferences.notifications.push} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Task Reminders</p>
                        <p className="text-xs text-gray-500">Get reminders about upcoming tasks</p>
                      </div>
                      <ToggleSwitch checked={userData.preferences.notifications.taskReminders} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Team Updates</p>
                        <p className="text-xs text-gray-500">Receive updates about team activities</p>
                      </div>
                      <ToggleSwitch checked={userData.preferences.notifications.teamUpdates} />
                    </div>
                  </div>
                </div>
                
                <hr className="border-gray-200 dark:border-gray-700" />
                
                {/* Privacy */}
                <div>
                  <h3 className="text-base font-medium flex items-center">
                    <Shield className="h-4 w-4 mr-2" /> Privacy Settings
                  </h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Profile Visibility</p>
                        <p className="text-xs text-gray-500">Control who can view your profile</p>
                      </div>
                      <select 
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm transition-all duration-300"
                        defaultValue={userData.preferences.privacy.profileVisibility}
                      >
                        <option>Everyone</option>
                        <option>Team Only</option>
                        <option>Private</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Show Email Address</p>
                        <p className="text-xs text-gray-500">Display your email to other users</p>
                      </div>
                      <ToggleSwitch checked={userData.preferences.privacy.showEmail} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Show Phone Number</p>
                        <p className="text-xs text-gray-500">Display your phone to other users</p>
                      </div>
                      <ToggleSwitch checked={userData.preferences.privacy.showPhone} />
                    </div>
                  </div>
                </div>
                
                <hr className="border-gray-200 dark:border-gray-700" />
                
                {/* Security */}
                <div>
                  <h3 className="text-base font-medium flex items-center">
                    <Lock className="h-4 w-4 mr-2" /> Security
                  </h3>
                  <div className="mt-4 space-y-4">
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                    <Button variant="outline" size="sm">
                      Enable Two-Factor Authentication
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                <Button variant="outline" className="transition-all duration-300">Cancel</Button>
                <Button className="transition-all duration-300">Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Toggle Switch Component
interface ToggleSwitchProps {
  checked: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked }) => {
  return (
    <button 
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${
        checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span 
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`} 
      />
    </button>
  );
};

const MessageSquare = ({ className }: { className?: string }) => (
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
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const CircleGray = ({ className }: { className?: string }) => (
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
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);

const BarChart = ({ className }: { className?: string }) => (
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
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

export default ProfilePage;
