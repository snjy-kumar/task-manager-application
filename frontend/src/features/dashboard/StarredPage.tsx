import React, { useRef } from 'react';
import { 
  Star, 
  Clock, 
  Calendar, 
  Briefcase, 
  ChevronRight,
  Tag,
  FileText,
  Folder,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BentoGrid from '@/components/ui/bento/BentoGrid';
import BentoCard from '@/components/ui/bento/BentoCard';

// Sample data for starred items
const starredTasks = [
  { id: 1, title: "Client Presentation Draft", dueDate: "Tomorrow, 5:00 PM", project: "Marketing Campaign", priority: "high", completed: false },
  { id: 2, title: "Weekly Team Meeting Notes", dueDate: "No due date", project: "Team Management", priority: "medium", completed: true },
  { id: 3, title: "Q3 Budget Planning", dueDate: "Friday, 3:00 PM", project: "Finance", priority: "high", completed: false },
  { id: 4, title: "Product Launch Timeline", dueDate: "Next Monday", project: "Product Development", priority: "medium", completed: false },
  { id: 5, title: "Customer Feedback Analysis", dueDate: "Thursday", project: "User Research", priority: "low", completed: false },
];

const starredProjects = [
  { id: 1, name: "Website Redesign", taskCount: 12, completedCount: 5, color: "blue" },
  { id: 2, name: "Mobile App Development", taskCount: 24, completedCount: 18, color: "green" },
  { id: 3, name: "Marketing Campaign Q3", taskCount: 8, completedCount: 3, color: "purple" },
];

const starredDocuments = [
  { id: 1, title: "Project Requirements", type: "document", updatedAt: "Yesterday", sharedWith: 5 },
  { id: 2, title: "Meeting Notes", type: "document", updatedAt: "3 days ago", sharedWith: 3 },
  { id: 3, title: "Design Assets", type: "folder", updatedAt: "Last week", sharedWith: 7 },
];

const StarredPage = () => {
  const gridRef = useRef(null);
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Starred Items</h1>
          <p className="text-gray-500 dark:text-gray-400">Quick access to your important items</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline">
            Manage Starred Items
          </Button>
        </div>
      </div>
      
      {/* Bento Grid Layout */}
      <BentoGrid cols={4} gap="md" ref={gridRef}>
        {/* Starred Tasks */}
        <BentoCard
          title="Starred Tasks"
          icon={<Star className="h-5 w-5 text-yellow-500" />}
          size="full"
          gradient
          gradientFrom="from-yellow-600/20"
          gradientTo="to-orange-600/20"
        >
          <div className="space-y-3 mt-3">
            {starredTasks.map((task) => (
              <TaskItem
                key={task.id}
                title={task.title}
                dueDate={task.dueDate}
                project={task.project}
                priority={task.priority as 'low' | 'medium' | 'high'}
                completed={task.completed}
              />
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" asChild>
            <Link to="/dashboard/tasks">
              View All Tasks
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </BentoCard>
        
        {/* Starred Projects */}
        <BentoCard
          title="Starred Projects"
          icon={<Briefcase className="h-5 w-5" />}
          size="md"
        >
          <div className="space-y-4 mt-3">
            {starredProjects.map((project) => (
              <ProjectItem
                key={project.id}
                name={project.name}
                taskCount={project.taskCount}
                completedCount={project.completedCount}
                color={project.color as 'blue' | 'green' | 'purple' | 'red' | 'yellow'}
              />
            ))}
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-3" asChild>
            <Link to="/dashboard/projects">
              Manage Projects
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </BentoCard>
        
        {/* Recently Starred */}
        <BentoCard
          title="Recently Starred"
          icon={<Clock className="h-5 w-5" />}
          size="sm"
        >
          <div className="space-y-2 mt-2">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-blue-100 text-blue-600 mr-3">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Project Proposal.docx</p>
                  <p className="text-xs text-gray-500">Added 2 hours ago</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-purple-100 text-purple-600 mr-3">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Sarah Chen</p>
                  <p className="text-xs text-gray-500">Added yesterday</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-green-100 text-green-600 mr-3">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Team Meeting</p>
                  <p className="text-xs text-gray-500">Added 3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </BentoCard>
        
        {/* Starred Documents */}
        <BentoCard
          title="Starred Documents"
          icon={<FileText className="h-5 w-5" />}
          size="md"
        >
          <div className="space-y-3 mt-2">
            {starredDocuments.map((doc, index) => (
              <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <div className="p-2 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 mr-3">
                    {doc.type === 'folder' ? (
                      <Folder className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium">{doc.title}</p>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      </Button>
                    </div>
                    <div className="flex items-center mt-1">
                      <p className="text-xs text-gray-500">Updated {doc.updatedAt}</p>
                      <span className="mx-2 text-gray-300">•</span>
                      <p className="text-xs text-gray-500">Shared with {doc.sharedWith} people</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full mt-1">
              View All Documents
            </Button>
          </div>
        </BentoCard>
        
        {/* Upcoming Starred Events */}
        <BentoCard
          title="Upcoming Starred Events"
          icon={<Calendar className="h-5 w-5" />}
          size="md"
          gradient
          gradientFrom="from-blue-600/20"
          gradientTo="to-blue-400/20"
        >
          <div className="space-y-3 mt-2">
            <div className="flex items-start p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="flex flex-col items-center justify-center mr-3 bg-primary/10 px-2 py-1 rounded">
                <span className="text-xs font-bold">JUN</span>
                <span className="text-lg font-bold">15</span>
              </div>
              <div>
                <p className="text-sm font-medium">Quarterly Planning</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>10:00 AM - 12:00 PM</span>
                </div>
              </div>
            </div>
            <div className="flex items-start p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="flex flex-col items-center justify-center mr-3 bg-primary/10 px-2 py-1 rounded">
                <span className="text-xs font-bold">JUN</span>
                <span className="text-lg font-bold">22</span>
              </div>
              <div>
                <p className="text-sm font-medium">Client Presentation</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>2:00 PM - 3:00 PM</span>
                </div>
              </div>
            </div>
            <div className="flex items-start p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="flex flex-col items-center justify-center mr-3 bg-primary/10 px-2 py-1 rounded">
                <span className="text-xs font-bold">JUL</span>
                <span className="text-lg font-bold">05</span>
              </div>
              <div>
                <p className="text-sm font-medium">Team Building Event</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>All day</span>
                </div>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-3" asChild>
            <Link to="/dashboard/calendar">
              View Calendar
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </BentoCard>
      </BentoGrid>
    </div>
  );
};

// Task Item Component
interface TaskItemProps {
  title: string;
  dueDate: string;
  project: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ title, dueDate, project, priority, completed }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className={`flex items-center p-3 rounded-md border border-gray-200 dark:border-gray-700 ${
      completed ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'
    }`}>
      <input
        type="checkbox"
        checked={completed}
        readOnly
        className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
      />
      <div className="ml-3 flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${
          completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'
        }`}>
          {title}
        </p>
        <div className="flex items-center mt-1 space-x-3">
          <div className="flex items-center">
            <span className={`h-2 w-2 rounded-full ${getPriorityColor(priority)} mr-2`}></span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{dueDate}</span>
          </div>
          <div className="flex items-center">
            <Tag className="h-3 w-3 mr-1 text-gray-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">{project}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        </Button>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

// Project Item Component
interface ProjectItemProps {
  name: string;
  taskCount: number;
  completedCount: number;
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
}

const ProjectItem: React.FC<ProjectItemProps> = ({ name, taskCount, completedCount, color }) => {
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
  
  const progress = Math.round((completedCount / taskCount) * 100);
  
  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <span className={`h-3 w-3 rounded-full ${getColorClass(color)} mr-2`}></span>
          <p className="text-sm font-medium">{name}</p>
        </div>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
        </Button>
      </div>
      <div className="mt-2 space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">{completedCount} of {taskCount} tasks completed</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div 
            className={`h-full ${getColorClass(color)} rounded-full`} 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StarredPage;
