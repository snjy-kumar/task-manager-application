import React, { useRef } from 'react';
import { 
  Clock, 
  ChevronRight, 
  FileText, 
  Folder, 
  Calendar, 
  Users,
  MessageSquare,
  BarChart3,
  Link as LinkIcon,
  Eye,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BentoGrid from '@/components/ui/bento/BentoGrid';
import BentoCard from '@/components/ui/bento/BentoCard';

// Sample data for recently viewed items
const recentItems = [
  { id: 1, title: "Q3 Marketing Campaign", type: "project", accessedAt: "5 minutes ago", icon: <Folder className="h-5 w-5" /> },
  { id: 2, title: "Team Meeting Notes", type: "document", accessedAt: "2 hours ago", icon: <FileText className="h-5 w-5" /> },
  { id: 3, title: "Product Roadmap", type: "document", accessedAt: "Yesterday", icon: <FileText className="h-5 w-5" /> },
  { id: 4, title: "Marketing Team", type: "team", accessedAt: "Yesterday", icon: <Users className="h-5 w-5" /> },
  { id: 5, title: "Website Redesign", type: "project", accessedAt: "2 days ago", icon: <Folder className="h-5 w-5" /> },
  { id: 6, title: "Sales Dashboard", type: "report", accessedAt: "2 days ago", icon: <BarChart3 className="h-5 w-5" /> },
  { id: 7, title: "Client Meeting", type: "event", accessedAt: "Last week", icon: <Calendar className="h-5 w-5" /> },
  { id: 8, title: "Project Planning", type: "document", accessedAt: "Last week", icon: <FileText className="h-5 w-5" /> },
];

const frequentCollaborators = [
  { id: 1, name: "Sarah Chen", role: "Designer", avatar: "SC", lastActive: "Active now" },
  { id: 2, name: "Michael Brown", role: "Developer", avatar: "MB", lastActive: "5m ago" },
  { id: 3, name: "Emily Wong", role: "Product Manager", avatar: "EW", lastActive: "1h ago" },
];

const recentSearches = [
  "marketing proposal template",
  "team meeting agenda",
  "project timeline",
  "budget report"
];

const RecentlyViewedPage = () => {
  const gridRef = useRef(null);
  const [filter, setFilter] = React.useState<string>('all');
  
  // Filter items based on type
  const filteredItems = filter === 'all' 
    ? recentItems 
    : recentItems.filter(item => item.type === filter);
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Recently Viewed</h1>
          <p className="text-gray-500 dark:text-gray-400">Your recently accessed items and activities</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search recent items..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
            />
          </div>
          <Button variant="outline">
            <Clock className="h-4 w-4 mr-2" /> Clear History
          </Button>
        </div>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            filter === 'all' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            filter === 'document' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setFilter('document')}
        >
          Documents
        </button>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            filter === 'project' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setFilter('project')}
        >
          Projects
        </button>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            filter === 'event' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setFilter('event')}
        >
          Events
        </button>
      </div>
      
      {/* Recent Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <RecentItem key={item.id} item={item} />
        ))}
      </div>
      
      {/* Additional Sections */}
      <BentoGrid cols={3} gap="md" ref={gridRef}>
        {/* Recent Searches */}
        <BentoCard
          title="Recent Searches"
          icon={<Search className="h-5 w-5" />}
          size="md"
        >
          <div className="space-y-2 mt-2">
            {recentSearches.map((search, index) => (
              <div 
                key={index} 
                className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
              >
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm">{search}</span>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-2">
            Clear Recent Searches
          </Button>
        </BentoCard>
        
        {/* Frequent Collaborators */}
        <BentoCard
          title="Frequent Collaborators"
          icon={<Users className="h-5 w-5" />}
          size="md"
          gradient
          gradientFrom="from-blue-600/20"
          gradientTo="to-blue-400/20"
        >
          <div className="space-y-3 mt-2">
            {frequentCollaborators.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                      {user.avatar}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.lastActive}</p>
                  </div>
                </div>
                <button className="text-primary hover:text-primary/80">
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </BentoCard>
        
        {/* Activity Timeline */}
        <BentoCard
          title="Activity Timeline"
          icon={<Clock className="h-5 w-5" />}
          size="md"
        >
          <div className="relative mt-2">
            <div className="absolute top-0 bottom-0 left-3 border-l-2 border-gray-200 dark:border-gray-700"></div>
            
            <div className="space-y-4">
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <FileText className="h-3 w-3 text-white" />
                </div>
                <p className="text-sm font-medium">You edited <span className="text-primary">Project Proposal</span></p>
                <p className="text-xs text-gray-500">30 minutes ago</p>
              </div>
              
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <MessageSquare className="h-3 w-3 text-white" />
                </div>
                <p className="text-sm font-medium">You commented on <span className="text-primary">Website Redesign</span></p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
              
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
                <p className="text-sm font-medium">You completed <span className="text-primary">Weekly Report</span></p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
              
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                  <Calendar className="h-3 w-3 text-white" />
                </div>
                <p className="text-sm font-medium">You scheduled <span className="text-primary">Team Meeting</span></p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
};

// Recent Item Component
interface RecentItemProps {
  item: {
    id: number;
    title: string;
    type: string;
    accessedAt: string;
    icon: React.ReactNode;
  };
}

const RecentItem = ({ item }: RecentItemProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'project':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'event':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'team':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'report':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    }
  };
  
  const getItemLink = (type: string, id: number) => {
    switch (type) {
      case 'document':
        return `/dashboard/documents/${id}`;
      case 'project':
        return `/dashboard/projects/${id}`;
      case 'event':
        return `/dashboard/calendar/events/${id}`;
      case 'team':
        return `/dashboard/teams/${id}`;
      case 'report':
        return `/dashboard/reports/${id}`;
      default:
        return `/dashboard`;
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-md ${getTypeColor(item.type)}`}>
              {item.icon}
            </div>
            <div>
              <h3 className="text-base font-medium">{item.title}</h3>
              <div className="flex items-center mt-1">
                <Clock className="h-3 w-3 text-gray-500 mr-1" />
                <span className="text-xs text-gray-500">{item.accessedAt}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500 capitalize">{item.type}</span>
          <Link 
            to={getItemLink(item.type, item.id)}
            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center"
          >
            Open <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const CheckCircle = ({ className }: { className?: string }) => (
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default RecentlyViewedPage;
