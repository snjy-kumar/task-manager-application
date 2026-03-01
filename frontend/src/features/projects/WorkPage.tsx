import React, { useEffect, useState, useMemo } from 'react';
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
  PieChart,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAnimations } from '@/hooks/useAnimations';
import BentoGrid from '@/components/ui/bento/BentoGrid';
import BentoCard from '@/components/ui/bento/BentoCard';
import taskService, { Task } from '@/services/taskService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { getPriorityColor, getPriorityOrder } from '@/lib/taskUtils';
import { formatDueDate } from '@/lib/dateUtils';

const WorkPage: React.FC = () => {
  const { ref } = useAnimations();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'mine' | 'team'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'project'>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchWorkTasks();
  }, []);

  const fetchWorkTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllTasks({ limit: 100 });
      // Filter for work tasks (tasks with 'Work' category or 'work' tag)
      const workTasks = response.tasks.filter(
        task => task.category === 'Work' || task.tags?.some(tag => tag.toLowerCase() === 'work')
      );
      setTasks(workTasks);
    } catch (error) {
      console.error('Failed to fetch work tasks:', error);
      showToast('Failed to load work tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
      await taskService.updateTask(taskId, { status: newStatus });
      setTasks(tasks.map(task =>
        task._id === taskId ? { ...task, status: newStatus as Task['status'] } : task
      ));
      showToast(`Task ${newStatus === 'Completed' ? 'completed' : 'reopened'}`, 'success');
    } catch (error) {
      console.error('Failed to update task:', error);
      showToast('Failed to update task', 'error');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'mine') return task.user === user?._id;
    if (filter === 'team') return task.user !== user?._id;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const aValue = getPriorityOrder(a.priority);
      const bValue = getPriorityOrder(b.priority);
      return sortDirection === 'desc' ? bValue - aValue : aValue - bValue;
    }
    if (sortBy === 'dueDate') {
      const aDate = new Date(a.dueDate).getTime();
      const bDate = new Date(b.dueDate).getTime();
      return sortDirection === 'desc' ? bDate - aDate : aDate - bDate;
    }
    if (sortBy === 'project') {
      // Use tags as proxy for projects
      const aProject = a.tags?.[0] || '';
      const bProject = b.tags?.[0] || '';
      return sortDirection === 'desc'
        ? bProject.localeCompare(aProject)
        : aProject.localeCompare(bProject);
    }
    return 0;
  });

  // Generate project stats from tags
  const projectStats = useMemo(() => {
    const stats: Record<string, number> = {};
    tasks.forEach(task => {
      task.tags?.forEach(tag => {
        if (tag.toLowerCase() !== 'work') {
          const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
          stats[capitalizedTag] = (stats[capitalizedTag] || 0) + 1;
        }
      });
    });
    return Object.entries(stats).map(([name, count]) => ({ name, count }));
  }, [tasks]);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, completionRate };
  }, [tasks]);

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
          <p className="text-muted-foreground">Manage your work projects and tasks</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" size="sm" className="transition-all duration-300">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button size="sm" asChild className="transition-all duration-300">
            <Link to="/dashboard/tasks/new">
              <Plus className="h-4 w-4 mr-2" /> Add Task
            </Link>
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {!loading && (
        <>
          {/* Overview Cards */}
          <BentoGrid cols={3} gap="md" ref={ref}>
            <BentoCard
              title="Task Overview"
              icon={<Briefcase className="h-5 w-5" />}
              size="sm"
            >
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="bg-amber-500/10 p-2 rounded-lg text-center">
                  <span className="text-xl font-bold">{taskStats.total}</span>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
                <div className="bg-emerald-500/10 p-2 rounded-lg text-center">
                  <span className="text-xl font-bold">{taskStats.completed}</span>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
                <div className="bg-muted/10 p-2 rounded-lg text-center">
                  <span className="text-xl font-bold">{taskStats.pending}</span>
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
                  <span>Completion rate</span>
                  <span>{taskStats.completionRate}%</span>
                </div>
                <div className="h-2 bg-border rounded-full">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${taskStats.completionRate}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-3">
                  <span>Active tasks:</span>
                  <span className="text-amber-500 font-medium">{taskStats.pending}</span>
                </div>
              </div>
            </BentoCard>

            <BentoCard
              title="Project Breakdown"
              icon={<PieChart className="h-5 w-5" />}
              size="sm"
            >
              <div className="mt-2 space-y-2">
                {projectStats.slice(0, 3).map(project => (
                  <div key={project.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="h-3 w-3 rounded-full bg-gray-400 dark:bg-gray-600 mr-2"></span>
                      <span className="text-sm truncate max-w-[120px]">{project.name}</span>
                    </div>
                    <span className="text-xs">{project.count} task{project.count !== 1 ? 's' : ''}</span>
                  </div>
                ))}
                {projectStats.length > 3 && (
                  <Button variant="ghost" size="sm" className="w-full mt-1 text-xs transition-all duration-300">
                    View All Projects
                  </Button>
                )}
                {projectStats.length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-2">No projects yet</p>
                )}
              </div>
            </BentoCard>
          </BentoGrid>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${filter === 'all' ? 'bg-card shadow-sm' : 'text-muted-foreground'
                }`}
              onClick={() => setFilter('all')}
            >
              All Tasks
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${filter === 'mine' ? 'bg-card shadow-sm' : 'text-muted-foreground'
                }`}
              onClick={() => setFilter('mine')}
            >
              My Tasks
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${filter === 'team' ? 'bg-card shadow-sm' : 'text-muted-foreground'
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
              className={`flex items-center transition-all duration-300 ${sortBy === 'priority' ? 'text-foreground font-medium' : ''}`}
              onClick={() => handleSortChange('priority')}
            >
              Priority
              {sortBy === 'priority' && (
                sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
              )}
            </button>
            <button
              className={`flex items-center transition-all duration-300 ${sortBy === 'dueDate' ? 'text-foreground font-medium' : ''}`}
              onClick={() => handleSortChange('dueDate')}
            >
              Due Date
              {sortBy === 'dueDate' && (
                sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
              )}
            </button>
            <button
              className={`flex items-center transition-all duration-300 ${sortBy === 'project' ? 'text-foreground font-medium' : ''}`}
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
                  key={task._id}
                  task={task}
                  onToggle={handleTaskToggle}
                />
              ))}

              {sortedTasks.length === 0 && (
                <div className="bg-card rounded-xl shadow-sm p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                  <p className="text-muted-foreground mb-4">
                    {filter === 'mine'
                      ? "You don't have any work tasks assigned to you."
                      : filter === 'team'
                        ? "There are no work tasks assigned to team members."
                        : "There are no work tasks yet."}
                  </p>
                  <Button asChild className="transition-all duration-300">
                    <Link to="/dashboard/tasks/new">
                      <Plus className="h-4 w-4 mr-2" /> Add New Task
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Breakdown */}
              {projectStats.length > 0 && (
                <div className="bg-card rounded-xl shadow-sm p-4">
                  <h3 className="text-lg font-medium mb-3">Projects</h3>
                  <div className="space-y-2">
                    {projectStats.map((project) => (
                      <div key={project.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="h-3 w-3 rounded-full bg-gray-400 dark:bg-gray-600 mr-2"></span>
                          <span className="text-sm">{project.name}</span>
                        </div>
                        <span className="text-xs bg-muted rounded-full px-2 py-0.5">
                          {project.count}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-3 transition-all duration-300">
                    Manage Projects
                  </Button>
                </div>
              )}

              {/* Quick Links */}
              <div className="bg-card rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-medium mb-3">Quick Links</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start transition-all duration-300">
                    <Calendar className="h-4 w-4 mr-2" /> Work Calendar
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start transition-all duration-300">
                    <Presentation className="h-4 w-4 mr-2" /> Team Dashboard
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start transition-all duration-300">
                    <BarChart3 className="h-4 w-4 mr-2" /> Performance Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start transition-all duration-300">
                    <FileText className="h-4 w-4 mr-2" /> Project Documentation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Task Item Component
interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string, currentStatus: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
  const isCompleted = task.status === 'Completed';
  const priorityColorClass = getPriorityColor(task.priority);
  const projectTag = task.tags?.find(tag => tag.toLowerCase() !== 'work') || task.category;

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${isCompleted
      ? 'bg-muted/50 border-border'
      : 'bg-card border-border'
      }`}>
      <div className="flex items-center min-w-0">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggle(task._id, task.status)}
          className="h-5 w-5 text-muted-foreground rounded border-gray-300 focus:ring-gray-500 mr-3 cursor-pointer"
        />
        <div className="min-w-0">
          <h3 className={`text-sm font-medium truncate ${isCompleted ? 'text-muted-foreground line-through' : ''
            }`}>
            {task.title}
          </h3>
          <div className="flex flex-wrap items-center mt-1 gap-2 text-xs text-gray-500">
            <span className={`h-2 w-2 rounded-full ${priorityColorClass}`}></span>
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatDueDate(task.dueDate, task.status).text}
            </span>
            {projectTag && (
              <span className="px-1.5 py-0.5 rounded bg-muted text-foreground">
                {projectTag}
              </span>
            )}
            {task.isOverdue && !isCompleted && (
              <span className="px-1.5 py-0.5 rounded bg-red-500/10 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                Overdue
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center ml-4">
        <Link
          to={`/dashboard/tasks/${task._id}`}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default WorkPage;
