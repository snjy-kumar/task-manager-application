import React from 'react';
import { 
  Clock, 
  Calendar, 
  ChevronRight, 
  CheckCircle, 
  Filter, 
  Plus,
  Users,
  ArrowUp,
  ArrowDown,
  Briefcase,
  BarChart3,
  Presentation,
  FileText,
  PieChart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAnimations } from '@/hooks/useAnimations';
import BentoGrid from '@/components/ui/bento/BentoGrid';
import BentoCard from '@/components/ui/bento/BentoCard';

// Sample data for work tasks
const workTasks = [
  { id: 1, title: "Prepare client presentation", priority: "high", dueDate: "Today, 3:00 PM", project: "Marketing Campaign", assigned: "You", completed: false },
  { id: 2, title: "Review Q3 budget proposal", priority: "high", dueDate: "Tomorrow", project: "Finance", assigned: "You", completed: false },
  { id: 3, title: "Team performance reviews", priority: "medium", dueDate: "Friday", project: "HR", assigned: "You", completed: false },
  { id: 4, title: "Update product roadmap", priority: "medium", dueDate: "Next Monday", project: "Product Development", assigned: "Sarah Chen", completed: false },
  { id: 5, title: "Prepare monthly analytics report", priority: "medium", dueDate: "July 5", project: "Analytics", assigned: "You", completed: false },
  { id: 6, title: "Customer feedback analysis", priority: "low", dueDate: "July 8", project: "Customer Success", assigned: "Michael Brown", completed: false },
  { id: 7, title: "Schedule client onboarding calls", priority: "medium", dueDate: "This week", project: "Sales", assigned: "You", completed: false },
  { id: 8, title: "Review website redesign mockups", priority: "high", dueDate: "Tomorrow", project: "Website Redesign", assigned: "You", completed: false },
  { id: 9, title: "Create social media content calendar", priority: "low", dueDate: "Next week", project: "Marketing Campaign", assigned: "Emily Wong", completed: false },
  { id: 10, title: "Update team documentation", priority: "low", dueDate: "Last week", project: "Operations", assigned: "You", completed: true },
  { id: 11, title: "Quarterly team objectives review", priority: "medium", dueDate: "Yesterday", project: "Management", assigned: "You", completed: true }
];

const projects = [
  { name: "Marketing Campaign", count: 3, color: "blue" },
  { name: "Website Redesign", count: 1, color: "green" },
  { name: "Finance", count: 1, color: "red" },
  { name: "HR", count: 1, color: "purple" },
  { name: "Product Development", count: 1, color: "yellow" },
  { name: "Analytics", count: 1, color: "orange" },
  { name: "Customer Success", count: 1, color: "teal" },
  { name: "Sales", count: 1, color: "indigo" },
  { name: "Operations", count: 1, color: "gray" },
  { name: "Management", count: 1, color: "pink" }
];

const teamMembers = [
  { id: 1, name: "You", avatar: "YO", tasksCount: 7, completedCount: 2 },
  { id: 2, name: "Sarah Chen", avatar: "SC", tasksCount: 1, completedCount: 0 },
  { id: 3, name: "Michael Brown", avatar: "MB", tasksCount: 1, completedCount: 0 },
  { id: 4, name: "Emily Wong", avatar: "EW", tasksCount: 1, completedCount: 0 }
];

const WorkPage: React.FC = () => {
  const { ref } = useAnimations();
  const [filter, setFilter] = React.useState<'all' | 'mine' | 'team'>('all');
  const [sortBy, setSortBy] = React.useState<'priority' | 'dueDate' | 'project'>('dueDate');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  
  const filteredTasks = workTasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'mine') return task.assigned === 'You';
    if (filter === 'team') return task.assigned !== 'You';
    return true;
  });
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
      const bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
      return sortDirection === 'desc' ? bValue - aValue : aValue - bValue;
    }
    if (sortBy === 'dueDate') {
      return sortDirection === 'desc' 
        ? b.dueDate.localeCompare(a.dueDate) 
        : a.dueDate.localeCompare(b.dueDate);
    }
    if (sortBy === 'project') {
      return sortDirection === 'desc' 
        ? b.project.localeCompare(a.project) 
        : a.project.localeCompare(b.project);
    }
    return 0;
  });
  
  const handleSortChange = (newSortBy: 'priority' | 'dueDate' | 'project') => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('asc');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Work</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your work projects and tasks</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button size="sm" asChild>
            <Link to="/dashboard/tasks/new">
              <Plus className="h-4 w-4 mr-2" /> Add Task
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <BentoGrid cols={3} gap="md" ref={ref}>
        <BentoCard
          title="Task Overview"
          icon={<Briefcase className="h-5 w-5" />}
          size="sm"
        >
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div className="bg-primary/10 p-2 rounded-lg text-center">
              <span className="text-xl font-bold">{workTasks.length}</span>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div className="bg-green-500/10 p-2 rounded-lg text-center">
              <span className="text-xl font-bold">{workTasks.filter(t => t.completed).length}</span>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
            <div className="bg-yellow-500/10 p-2 rounded-lg text-center">
              <span className="text-xl font-bold">{workTasks.filter(t => !t.completed).length}</span>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </BentoCard>
        
        <BentoCard
          title="Team Progress"
          icon={<Users className="h-5 w-5" />}
          size="sm"
        >
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Team completion rate</span>
              <span>62%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div className="h-full bg-primary rounded-full" style={{ width: '62%' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-3">
              <span>7 days trend:</span>
              <span className="text-green-500">+12%</span>
            </div>
          </div>
        </BentoCard>
        
        <BentoCard
          title="Project Breakdown"
          icon={<PieChart className="h-5 w-5" />}
          size="sm"
        >
          <div className="mt-2 space-y-2">
            {projects.slice(0, 3).map(project => (
              <div key={project.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`h-3 w-3 rounded-full bg-${project.color}-500 mr-2`}></span>
                  <span className="text-sm truncate max-w-[120px]">{project.name}</span>
                </div>
                <span className="text-xs">{project.count} tasks</span>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full mt-1 text-xs">
              View All Projects
            </Button>
          </div>
        </BentoCard>
      </BentoGrid>
      
      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            filter === 'all' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setFilter('all')}
        >
          All Tasks
        </button>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            filter === 'mine' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setFilter('mine')}
        >
          My Tasks
        </button>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md ${
            filter === 'team' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setFilter('team')}
        >
          Team Tasks
        </button>
      </div>
      
      {/* Sort Controls */}
      <div className="flex items-center space-x-4 text-sm">
        <span className="text-gray-500">Sort by:</span>
        <button 
          className={`flex items-center ${sortBy === 'priority' ? 'text-primary font-medium' : ''}`}
          onClick={() => handleSortChange('priority')}
        >
          Priority
          {sortBy === 'priority' && (
            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
          )}
        </button>
        <button 
          className={`flex items-center ${sortBy === 'dueDate' ? 'text-primary font-medium' : ''}`}
          onClick={() => handleSortChange('dueDate')}
        >
          Due Date
          {sortBy === 'dueDate' && (
            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
          )}
        </button>
        <button 
          className={`flex items-center ${sortBy === 'project' ? 'text-primary font-medium' : ''}`}
          onClick={() => handleSortChange('project')}
        >
          Project
          {sortBy === 'project' && (
            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
          )}
        </button>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tasks List */}
        <div className="lg:col-span-3 space-y-4">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              priority={task.priority as 'low' | 'medium' | 'high'}
              dueDate={task.dueDate}
              project={task.project}
              assigned={task.assigned}
              completed={task.completed}
            />
          ))}
          
          {sortedTasks.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">No tasks found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {filter === 'mine'
                  ? "You don't have any tasks assigned to you."
                  : filter === 'team'
                  ? "There are no tasks assigned to team members."
                  : "There are no tasks in this workspace yet."}
              </p>
              <Button asChild>
                <Link to="/dashboard/tasks/new">
                  <Plus className="h-4 w-4 mr-2" /> Add New Task
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Members */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium mb-3">Team</h3>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium mr-3">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.tasksCount} tasks</p>
                    </div>
                  </div>
                  <div className="text-xs font-medium">
                    {Math.round((member.completedCount / (member.tasksCount || 1)) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Project Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium mb-3">Projects</h3>
            <div className="space-y-2">
              {projects.map((project) => (
                <div key={project.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`h-3 w-3 rounded-full bg-${project.color}-500 mr-2`}></span>
                    <span className="text-sm">{project.name}</span>
                  </div>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5">
                    {project.count}
                  </span>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-3">
              Manage Projects
            </Button>
          </div>
          
          {/* Quick Links */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" /> Work Calendar
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Presentation className="h-4 w-4 mr-2" /> Team Dashboard
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" /> Performance Report
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" /> Project Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Task Item Component
interface TaskItemProps {
  id: number;
  title: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  project: string;
  assigned: string;
  completed: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ id, title, priority, dueDate, project, assigned, completed }) => {
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
  
  const getProjectColor = (project: string) => {
    const colors: Record<string, string> = {
      "Marketing Campaign": 'bg-blue-100 text-blue-800',
      "Website Redesign": 'bg-green-100 text-green-800',
      "Finance": 'bg-red-100 text-red-800',
      "HR": 'bg-purple-100 text-purple-800',
      "Product Development": 'bg-yellow-100 text-yellow-800',
      "Analytics": 'bg-orange-100 text-orange-800',
      "Customer Success": 'bg-teal-100 text-teal-800',
      "Sales": 'bg-indigo-100 text-indigo-800',
      "Operations": 'bg-gray-100 text-gray-800',
      "Management": 'bg-pink-100 text-pink-800'
    };
    return colors[project] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${
      completed 
        ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex items-center min-w-0">
        <input
          type="checkbox"
          checked={completed}
          readOnly
          className="h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary mr-3"
        />
        <div className="min-w-0">
          <h3 className={`text-sm font-medium truncate ${
            completed ? 'text-gray-500 dark:text-gray-400 line-through' : ''
          }`}>
            {title}
          </h3>
          <div className="flex flex-wrap items-center mt-1 gap-2 text-xs text-gray-500">
            <span className={`h-2 w-2 rounded-full ${getPriorityColor(priority)}`}></span>
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {dueDate}
            </span>
            <span className={`px-1.5 py-0.5 rounded ${getProjectColor(project)}`}>
              {project}
            </span>
            <span className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {assigned}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center ml-4">
        <Link 
          to={`/dashboard/tasks/${id}`}
          className="text-gray-400 hover:text-primary"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default WorkPage;
