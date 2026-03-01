import { useState, useEffect } from 'react';
import {
  ListTodo,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Circle,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import taskService, { Task } from '@/services/taskService';
import { useAuth } from '@/context/AuthContext';

interface DashboardStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  overdue: number;
  completionRate: number;
}

const priorityColors: Record<string, string> = {
  High: 'bg-red-500',
  Medium: 'bg-amber-500',
  Low: 'bg-emerald-500',
};

const statusColors: Record<string, string> = {
  Completed: 'text-emerald-400',
  'In Progress': 'text-amber-400',
  Pending: 'text-white/40',
  Archived: 'text-white/20',
};

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col gap-1">
      <span className="text-xs font-medium text-white/40 uppercase tracking-widest">
        {label}
      </span>
      <span className={`text-3xl font-bold ${accent ?? 'text-white'}`}>
        {value}
      </span>
      {sub && <span className="text-xs text-white/30">{sub}</span>}
    </div>
  );
}

function TaskRow({ task }: { task: Task }) {
  const dot = priorityColors[task.priority] ?? 'bg-white/20';
  const statusText = statusColors[task.status] ?? 'text-white/40';

  return (
    <Link
      to={`/dashboard/tasks/${task._id}`}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group"
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      <span className="flex-1 text-sm text-white/80 truncate group-hover:text-white transition-colors">
        {task.title}
      </span>
      <span className={`text-xs font-medium shrink-0 ${statusText}`}>
        {task.status}
      </span>
    </Link>
  );
}

const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await taskService.getAllTasks();
      const taskList: Task[] = response.tasks || [];
      calculateStats(taskList);
      filterTasks(taskList);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (taskList: Task[]) => {
    const now = new Date();
    const completed = taskList.filter((t) => t.status === 'Completed').length;
    const inProgress = taskList.filter((t) => t.status === 'In Progress').length;
    const pending = taskList.filter((t) => t.status === 'Pending').length;
    const overdue = taskList.filter((t) => {
      const d = new Date(t.dueDate);
      return d < now && t.status !== 'Completed';
    }).length;
    setStats({
      total: taskList.length,
      completed,
      inProgress,
      pending,
      overdue,
      completionRate:
        taskList.length > 0 ? Math.round((completed / taskList.length) * 100) : 0,
    });
  };

  const filterTasks = (taskList: Task[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    setTodaysTasks(
      taskList
        .filter((t) => {
          const d = new Date(t.dueDate);
          return d >= today && d < tomorrow && t.status !== 'Completed';
        })
        .slice(0, 6)
    );
    setUpcomingTasks(
      taskList
        .filter((t) => {
          const d = new Date(t.dueDate);
          return d >= tomorrow && d <= nextWeek && t.status !== 'Completed';
        })
        .slice(0, 6)
    );
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            {greeting()},{' '}
            <span className="text-amber-500">{user?.name?.split(' ')[0] ?? 'there'}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {stats.total === 0
              ? "You have no tasks yet — create your first one."
              : `${stats.pending + stats.inProgress} active task${stats.pending + stats.inProgress !== 1 ? 's' : ''} right now.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <Link
            to="/dashboard/tasks/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors"
          >
            + New task
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total tasks" value={stats.total} />
        <StatCard
          label="Completed"
          value={stats.completed}
          sub={`${stats.completionRate}% completion rate`}
          accent="text-emerald-400"
        />
        <StatCard
          label="In progress"
          value={stats.inProgress}
          accent="text-amber-400"
        />
        <StatCard
          label="Overdue"
          value={stats.overdue}
          accent={stats.overdue > 0 ? 'text-red-400' : 'text-white'}
        />
      </div>

      {/* Completion ring */}
      {stats.total > 0 && (
        <div className="rounded-xl border border-border bg-card p-6 flex items-center gap-6">
          {/* Ring */}
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="8" className="text-border" />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="hsl(38,95%,54%)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - stats.completionRate / 100)}`}
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
              {stats.completionRate}%
            </span>
          </div>
          <div>
            <p className="font-semibold text-foreground">Completion rate</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {stats.completed} of {stats.total} tasks completed
            </p>
            <div className="flex gap-4 mt-3">
              {[
                { icon: CheckCircle2, label: 'Done', val: stats.completed, color: 'text-emerald-400' },
                { icon: Loader2, label: 'Active', val: stats.inProgress, color: 'text-amber-400' },
                { icon: Circle, label: 'Pending', val: stats.pending, color: 'text-white/40' },
              ].map(({ icon: Icon, label, val, color }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  {val} {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Task panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h2 className="font-semibold text-foreground text-sm">Due today</h2>
              {todaysTasks.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-medium">
                  {todaysTasks.length}
                </span>
              )}
            </div>
            <Link
              to="/dashboard/tasks"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              All tasks <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {todaysTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Nothing due today 🎉
            </p>
          ) : (
            <div className="-mx-1">
              {todaysTasks.map((t) => (
                <TaskRow key={t._id} task={t} />
              ))}
            </div>
          )}
        </div>

        {/* Upcoming */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <h2 className="font-semibold text-foreground text-sm">
                Coming up (7 days)
              </h2>
              {upcomingTasks.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-white/50 font-medium">
                  {upcomingTasks.length}
                </span>
              )}
            </div>
            <Link
              to="/dashboard/tasks"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              All tasks <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {upcomingTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No upcoming tasks this week
            </p>
          ) : (
            <div className="-mx-1">
              {upcomingTasks.map((t) => (
                <TaskRow key={t._id} task={t} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Empty state CTA */}
      {stats.total === 0 && (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <ListTodo className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">No tasks yet</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Create your first task and start getting things done.
          </p>
          <Link
            to="/dashboard/tasks/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors"
          >
            Create a task <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
