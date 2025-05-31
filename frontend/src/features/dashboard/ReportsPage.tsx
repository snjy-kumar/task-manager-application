import { useState, useRef } from 'react';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  Calendar, 
  Download,
  Filter,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import BentoGrid from '@/components/ui/bento/BentoGrid';
import BentoCard from '@/components/ui/bento/BentoCard';

// Sample data for reports
const taskCompletionData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  data: [8, 5, 12, 7, 10, 3, 6]
};

const taskStatusData = {
  labels: ['Completed', 'In Progress', 'Not Started', 'Overdue'],
  data: [45, 30, 15, 10],
  colors: ['#4ade80', '#60a5fa', '#a78bfa', '#ef4444']
};

const productivityTrend = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  data: [65, 72, 68, 75, 82, 87]
};

const ReportsPage = () => {
  const gridRef = useRef(null);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">Insights and statistics about your productivity</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <div className="relative">
            <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm flex items-center text-sm">
              <Filter className="h-4 w-4 mr-2" />
              <span>Filter</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
          </div>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md p-1">
            <button 
              className={`px-3 py-1 rounded-md text-sm ${dateRange === 'week' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
              onClick={() => setDateRange('week')}
            >
              Week
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${dateRange === 'month' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
              onClick={() => setDateRange('month')}
            >
              Month
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${dateRange === 'quarter' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
              onClick={() => setDateRange('quarter')}
            >
              Quarter
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${dateRange === 'year' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
              onClick={() => setDateRange('year')}
            >
              Year
            </button>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>
      
      {/* Report Visualizations */}
      <BentoGrid cols={4} gap="md" ref={gridRef}>
        {/* Productivity Score */}
        <BentoCard
          title="Productivity Score"
          icon={<BarChart3 className="h-5 w-5" />}
          size="md"
          gradient
          gradientFrom="from-blue-600/20"
          gradientTo="to-emerald-600/20"
        >
          <div className="mt-4 flex flex-col items-center">
            <div className="relative h-32 w-32">
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-bold">87</span>
                <span className="text-sm text-green-500 flex items-center">
                  +5% <ChevronUp className="h-3 w-3" />
                </span>
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
            <div className="grid grid-cols-2 gap-2 w-full mt-4">
              <div className="text-center bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-gray-500">Tasks Completed</p>
              </div>
              <div className="text-center bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                <p className="text-2xl font-bold">32</p>
                <p className="text-xs text-gray-500">Hours Tracked</p>
              </div>
            </div>
          </div>
        </BentoCard>
        
        {/* Task Completion by Day */}
        <BentoCard
          title="Task Completion by Day"
          icon={<BarChart3 className="h-5 w-5" />}
          size="lg"
        >
          <div className="h-64 flex items-end justify-around mt-4">
            {taskCompletionData.labels.map((day, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className="bg-primary rounded-t w-10"
                  style={{ height: `${(taskCompletionData.data[i] / Math.max(...taskCompletionData.data)) * 100}%` }}
                />
                <span className="text-xs mt-2">{day}</span>
                <span className="text-xs font-bold">{taskCompletionData.data[i]}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium">Total Tasks</p>
                <p className="text-2xl font-bold">{taskCompletionData.data.reduce((a, b) => a + b, 0)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Daily Average</p>
                <p className="text-2xl font-bold">
                  {Math.round(taskCompletionData.data.reduce((a, b) => a + b, 0) / taskCompletionData.labels.length)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Completion Rate</p>
                <p className="text-2xl font-bold">92%</p>
              </div>
            </div>
          </div>
        </BentoCard>
        
        {/* Task Status */}
        <BentoCard
          title="Task Status"
          icon={<PieChart className="h-5 w-5" />}
          size="md"
        >
          <div className="flex items-center justify-center mt-4">
            <div className="relative h-40 w-40">
              {/* This is a simplified pie chart representation */}
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {taskStatusData.labels.map((_, i) => {
                  const previousSum = taskStatusData.data.slice(0, i).reduce((sum, value) => sum + value, 0);
                  const total = taskStatusData.data.reduce((sum, value) => sum + value, 0);
                  const startAngle = (previousSum / total) * 360;
                  const endAngle = (taskStatusData.data[i] / total) * 360 + startAngle;
                  
                  const x1 = 50 + 45 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 50 + 45 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 = 50 + 45 * Math.cos((endAngle * Math.PI) / 180);
                  const y2 = 50 + 45 * Math.sin((endAngle * Math.PI) / 180);
                  
                  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
                  
                  return (
                    <path
                      key={i}
                      d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={taskStatusData.colors[i]}
                      stroke="white"
                      strokeWidth="1"
                    />
                  );
                })}
                <circle cx="50" cy="50" r="25" fill="white" />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {taskStatusData.labels.map((label, i) => (
              <div key={i} className="flex items-center">
                <span 
                  className="h-3 w-3 rounded-full mr-2"
                  style={{ backgroundColor: taskStatusData.colors[i] }}
                />
                <span className="text-xs">{label}</span>
                <span className="text-xs font-bold ml-auto">{taskStatusData.data[i]}%</span>
              </div>
            ))}
          </div>
        </BentoCard>
        
        {/* Time Tracking */}
        <BentoCard
          title="Time Tracking"
          icon={<Clock className="h-5 w-5" />}
          size="sm"
        >
          <div className="space-y-3 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Today</span>
              <span className="text-lg font-bold">4h 25m</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div className="h-full bg-primary rounded-full" style={{ width: '55%' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>0h</span>
              <span>8h</span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">This Week</span>
                <span className="text-lg font-bold">24h 10m</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
                <div className="h-full bg-primary rounded-full" style={{ width: '70%' }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0h</span>
                <span>40h</span>
              </div>
            </div>
          </div>
        </BentoCard>
        
        {/* Productivity Trend */}
        <BentoCard
          title="Productivity Trend"
          icon={<LineChart className="h-5 w-5" />}
          size="md"
          gradient
          gradientFrom="from-purple-600/20"
          gradientTo="to-pink-600/20"
        >
          <div className="h-40 mt-4 relative">
            {/* Simplified line chart */}
            <svg className="w-full h-full">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#9333ea" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              {[0, 1, 2, 3].map((line) => (
                <line
                  key={line}
                  x1="0"
                  y1={line * 40}
                  x2="100%"
                  y2={line * 40}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}
              
              {/* Line chart */}
              <polyline
                points={productivityTrend.labels.map((_, i) => {
                  const x = (i / (productivityTrend.labels.length - 1)) * 100;
                  const y = 160 - (productivityTrend.data[i] / 100) * 160;
                  return `${x}%,${y}`;
                }).join(' ')}
                fill="none"
                stroke="#9333ea"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Area under the line */}
              <path
                d={`
                  M 0,160 
                  ${productivityTrend.labels.map((_, i) => {
                    const x = (i / (productivityTrend.labels.length - 1)) * 100;
                    const y = 160 - (productivityTrend.data[i] / 100) * 160;
                    return `L ${x}%,${y}`;
                  }).join(' ')} 
                  L 100%,160 Z
                `}
                fill="url(#gradient)"
              />
              
              {/* Data points */}
              {productivityTrend.labels.map((_, i) => {
                const x = (i / (productivityTrend.labels.length - 1)) * 100;
                const y = 160 - (productivityTrend.data[i] / 100) * 160;
                return (
                  <circle
                    key={i}
                    cx={`${x}%`}
                    cy={y}
                    r="4"
                    fill="#ffffff"
                    stroke="#9333ea"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
            
            {/* X axis labels */}
            <div className="flex justify-between mt-2">
              {productivityTrend.labels.map((month, i) => (
                <div key={i} className="text-xs text-gray-500">{month}</div>
              ))}
            </div>
          </div>
        </BentoCard>
        
        {/* Task Categories */}
        <BentoCard
          title="Task Categories"
          icon={<PieChart className="h-5 w-5" />}
          size="sm"
        >
          <div className="space-y-3 mt-2">
            {[
              { name: 'Work', count: 45, percentage: 45, color: 'bg-blue-500' },
              { name: 'Personal', count: 30, percentage: 30, color: 'bg-purple-500' },
              { name: 'Learning', count: 15, percentage: 15, color: 'bg-green-500' },
              { name: 'Others', count: 10, percentage: 10, color: 'bg-yellow-500' }
            ].map((category, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">{category.name}</span>
                  <span className="text-sm font-medium">{category.count}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div 
                    className={`h-full ${category.color} rounded-full`} 
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </BentoCard>
        
        {/* Monthly Comparison */}
        <BentoCard
          title="Monthly Comparison"
          icon={<Calendar className="h-5 w-5" />}
          size="full"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full mb-3">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold">Completed Tasks</h3>
              <div className="flex items-baseline mt-2 space-x-2">
                <span className="text-3xl font-bold">87</span>
                <span className="text-sm text-green-600 flex items-center">
                  +12% <ChevronUp className="h-3 w-3" />
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">vs. 78 last month</p>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-800 rounded-full mb-3">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold">Average Time</h3>
              <div className="flex items-baseline mt-2 space-x-2">
                <span className="text-3xl font-bold">2.4h</span>
                <span className="text-sm text-green-600 flex items-center">
                  -8% <ChevronDown className="h-3 w-3" />
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">vs. 2.6h last month</p>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-800 rounded-full mb-3">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold">Overdue Tasks</h3>
              <div className="flex items-baseline mt-2 space-x-2">
                <span className="text-3xl font-bold">5</span>
                <span className="text-sm text-green-600 flex items-center">
                  -28% <ChevronDown className="h-3 w-3" />
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">vs. 7 last month</p>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Monthly Progress</h3>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div className="h-full bg-primary rounded-full" style={{ width: '72%' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>72% of monthly goal completed</span>
              <span>100%</span>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
};

const ChevronUp = ({ className }: { className?: string }) => (
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
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

export default ReportsPage;
