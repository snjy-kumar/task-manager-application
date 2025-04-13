import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Zap, 
  ChevronRight, 
  Calendar,
  BarChart3,
  Users,
  Sparkles,
  Target,
  Briefcase,
  MessageSquare,
  ListTodo,
  MenuSquare,
  ArrowUpRight,
  LucideIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAnimations } from '@/hooks/useAnimations';
import BentoGrid from '@/components/ui/bento/BentoGrid';
import BentoCard from '@/components/ui/bento/BentoCard';

// Sample data for the dashboard
const taskData = {
  completed: 24,
  pending: 12,
  overdue: 3,
  upcoming: 8
};

const taskList = [
  { id: 1, title: "Prepare client presentation", priority: "high", time: "11:00 AM", completed: false },
  { id: 2, title: "Team meeting", priority: "medium", time: "1:30 PM", completed: false },
  { id: 3, title: "Review project proposal", priority: "medium", time: "3:00 PM", completed: false },
  { id: 4, title: "Send weekly report", priority: "high", time: "5:00 PM", completed: false },
  { id: 5, title: "Update documentation", priority: "low", time: "Today", completed: true }
];

const aiSuggestions = [
  "Complete high-priority task 'Prepare client presentation' first",
  "Schedule breaks between your meetings today for better focus",
  "Consider delegating 'Update documentation' to team member"
];

const DashboardHome: React.FC = () => {
  const { ref, isInView } = useAnimations();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, John!</h1>
          <p className="text-gray-500 dark:text-gray-400">Here's an overview of your tasks for today.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link to="/dashboard/tasks/new">
              Create New Task
            </Link>
          </Button>
        </div>
      </div>

      {/* Primary Bento Grid */}
      <BentoGrid cols={4} gap="md" ref={ref}>
        {/* Task Overview */}
        <BentoCard
          title="Task Overview"
          icon={<MenuSquare className="h-5 w-5" />}
          size="md"
          gradient
          gradientFrom="from-blue-600/20"
          gradientTo="to-emerald-600/20"
        >
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <span className="text-3xl font-bold">{taskData.completed}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
            </div>
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <span className="text-3xl font-bold">{taskData.pending}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
            </div>
            <div className="rounded-xl bg-red-500/10 p-4 text-center">
              <span className="text-3xl font-bold text-red-500">{taskData.overdue}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Overdue</p>
            </div>
            <div className="rounded-xl bg-purple-500/10 p-4 text-center">
              <span className="text-3xl font-bold text-purple-500">{taskData.upcoming}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Upcoming</p>
            </div>
          </div>
        </BentoCard>
        
        {/* Productivity Score */}
        <BentoCard
          title="Productivity Score"
          icon={<Target className="h-5 w-5" />}
          size="sm"
        >
          <div className="mt-2 flex justify-center">
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">87</span>
              </div>
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeOpacity="0.1"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray="283"
                  strokeDashoffset="37"
                  className="text-primary"
                />
              </svg>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">+5% from last week</p>
        </BentoCard>
        
        {/* Calendar Snapshot */}
        <BentoCard
          title="Calendar"
          icon={<Calendar className="h-5 w-5" />}
          size="sm"
        >
          <div className="mt-2 flex justify-center">
            <div className="text-center p-2 bg-primary/10 rounded-lg">
              <div className="text-xs uppercase font-bold text-gray-500">Today</div>
              <div className="text-3xl font-bold">{new Date().getDate()}</div>
              <div className="text-xs">{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
            </div>
          </div>
          <div className="mt-2 text-xs">
            <div className="flex justify-between items-center px-1 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              <span>Team Meeting</span>
              <span className="text-gray-500">1:30 PM</span>
            </div>
            <div className="flex justify-between items-center px-1 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              <span>Client Call</span>
              <span className="text-gray-500">3:00 PM</span>
            </div>
          </div>
        </BentoCard>
        
        {/* Weekly Progress */}
        <BentoCard
          title="Weekly Progress"
          icon={<BarChart3 className="h-5 w-5" />}
          size="lg"
          gradient
          gradientFrom="from-purple-600/20"
          gradientTo="to-pink-600/20"
        >
          <div className="h-full flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full h-32 flex items-end justify-around">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const heights = [65, 40, 75, 55, 85, 35, 50];
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div 
                        className="bg-primary/60 rounded-t w-6"
                        style={{ height: `${heights[i]}%` }}
                      />
                      <span className="text-xs mt-2">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-white dark:bg-gray-800 p-2 text-center shadow-sm">
                <span className="text-lg font-bold">32</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
              </div>
              <div className="rounded-xl bg-white dark:bg-gray-800 p-2 text-center shadow-sm">
                <span className="text-lg font-bold">87%</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Efficiency</p>
              </div>
              <div className="rounded-xl bg-white dark:bg-gray-800 p-2 text-center shadow-sm">
                <span className="text-lg font-bold">5.2h</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Time</p>
              </div>
            </div>
          </div>
        </BentoCard>
        
        {/* AI Suggestions */}
        <BentoCard
          title="AI Suggestions"
          icon={<Sparkles className="h-5 w-5" />}
          size="md"
          gradient
          gradientFrom="from-blue-600/20"
          gradientTo="to-blue-400/20"
        >
          <div className="space-y-3 mt-2">
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">{suggestion}</p>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-3">
            See More Suggestions
          </Button>
        </BentoCard>
        
        {/* Today's Tasks */}
        <BentoCard
          title="Today's Tasks"
          icon={<ListTodo className="h-5 w-5" />}
          size="full"
        >
          <div className="space-y-2 mt-2">
            {taskList.map((task) => (
              <TaskItem
                key={task.id}
                title={task.title}
                priority={task.priority as 'low' | 'medium' | 'high'}
                time={task.time}
                completed={task.completed}
              />
            ))}
          </div>
          <Button variant="outline" className="w-full mt-3" asChild>
            <Link to="/dashboard/tasks">
              Manage All Tasks
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </BentoCard>
        
        {/* Team Members */}
        <BentoCard
          title="Team Members"
          icon={<Users className="h-5 w-5" />}
          size="md"
        >
          <div className="mt-3 space-y-3">
            {[
              { name: "Sarah Chen", role: "Designer", avatar: "SC", status: "online" },
              { name: "Michael Brown", role: "Developer", avatar: "MB", status: "busy" },
              { name: "Emily Wong", role: "Product Manager", avatar: "EW", status: "offline" }
            ].map((member, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                      {member.avatar}
                    </div>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                      member.status === 'online' ? 'bg-green-500' :
                      member.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                    } border-2 border-white dark:border-gray-800`}></span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>
                <button className="text-primary hover:text-primary/80">
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </BentoCard>
        
        {/* Recent Projects */}
        <BentoCard
          title="Active Projects"
          icon={<Briefcase className="h-5 w-5" />}
          size="sm"
        >
          <div className="mt-2 space-y-2">
            {[
              { name: "Website Redesign", progress: 65 },
              { name: "Mobile App", progress: 32 }
            ].map((project, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{project.name}</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
};

// TaskItem Component
interface TaskItemProps {
  title: string;
  priority: 'low' | 'medium' | 'high';
  time: string;
  completed: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ title, priority, time, completed }) => {
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
        <div className="flex items-center mt-1">
          <span className={`h-2 w-2 rounded-full ${getPriorityColor(priority)} mr-2`}></span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{time}</span>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-400" />
    </div>
  );
};

export default DashboardHome; 