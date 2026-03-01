import { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import taskService, { Task } from '@/services/taskService';

interface Stats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  overdue: number;
  completionRate: number;
  byPriority: { high: number; medium: number; low: number };
}

function Bar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-foreground/70">{label}</span>
        <span className="font-medium text-foreground">{value}</span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const ReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<Stats>({
    total: 0, completed: 0, inProgress: 0, pending: 0, overdue: 0, completionRate: 0,
    byPriority: { high: 0, medium: 0, low: 0 },
  });

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true); setError('');
      const response = await taskService.getAllTasks();
      const taskList: Task[] = response.tasks || [];
      const now = new Date();
      const completed = taskList.filter(t => t.status === 'Completed').length;
      const inProgress = taskList.filter(t => t.status === 'In Progress').length;
      const pending = taskList.filter(t => t.status === 'Pending').length;
      const overdue = taskList.filter(t => new Date(t.dueDate) < now && t.status !== 'Completed').length;
      setStats({
        total: taskList.length, completed, inProgress, pending, overdue,
        completionRate: taskList.length > 0 ? Math.round((completed / taskList.length) * 100) : 0,
        byPriority: {
          high: taskList.filter(t => t.priority === 'High').length,
          medium: taskList.filter(t => t.priority === 'Medium').length,
          low: taskList.filter(t => t.priority === 'Low').length,
        },
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Reports
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">Insights into your task productivity</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchTasks} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground text-sm transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground text-sm transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: BarChart3, accent: 'text-foreground' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle2, accent: 'text-emerald-400' },
          { label: 'In Progress', value: stats.inProgress, icon: Clock, accent: 'text-amber-400' },
          { label: 'Overdue', value: stats.overdue, icon: AlertCircle, accent: stats.overdue > 0 ? 'text-red-400' : 'text-foreground' },
        ].map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{label}</span>
            </div>
            <span className={`text-3xl font-bold ${accent}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completion ring */}
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6 self-start">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            <h3 className="font-semibold text-foreground text-sm">Completion Rate</h3>
          </div>
          <div className="relative w-28 h-28 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" className="text-border" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(38,95%,54%)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - stats.completionRate / 100)}`}
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-foreground">
              {stats.completionRate}%
            </span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span>{stats.completed} done</span>
            <span>{stats.total} total</span>
          </div>
        </div>

        {/* Status distribution */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-4 h-4 text-amber-500" />
            <h3 className="font-semibold text-foreground text-sm">By Status</h3>
          </div>
          <div className="space-y-4">
            <Bar label="Completed" value={stats.completed} total={stats.total} color="bg-emerald-500" />
            <Bar label="In Progress" value={stats.inProgress} total={stats.total} color="bg-amber-500" />
            <Bar label="Pending" value={stats.pending} total={stats.total} color="bg-white/30" />
            <Bar label="Overdue" value={stats.overdue} total={stats.total} color="bg-red-500" />
          </div>
        </div>

        {/* Priority distribution */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            <h3 className="font-semibold text-foreground text-sm">By Priority</h3>
          </div>
          <div className="space-y-4">
            <Bar label="High" value={stats.byPriority.high} total={stats.total} color="bg-red-500" />
            <Bar label="Medium" value={stats.byPriority.medium} total={stats.total} color="bg-amber-500" />
            <Bar label="Low" value={stats.byPriority.low} total={stats.total} color="bg-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
