import React, { useRef } from 'react';
import { BarChart3, Calendar, Sparkles, LayoutGrid, Activity, 
  Users, Zap, Shield, Award, Target, Briefcase, CloudCog } from 'lucide-react';
import BentoGrid from './BentoGrid';
import BentoCard from './BentoCard';

export interface BentoShowcaseProps {
  variant?: 'default' | 'dashboard' | 'features' | 'metrics';
  className?: string;
}

export const BentoShowcase: React.FC<BentoShowcaseProps> = ({ 
  variant = 'default',
  className 
}) => {
  const gridRef = useRef(null);

  // Define different bento grid variants
  const renderVariant = () => {
    switch (variant) {
      case 'dashboard':
        return (
          <BentoGrid cols={4} gap="md" className="mb-8">
            <BentoCard
              title="Tasks Overview"
              icon={<LayoutGrid className="h-5 w-5" />}
              size="md"
              gradient
              gradientFrom="from-blue-600/20"
              gradientTo="to-emerald-600/20"
            >
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-primary/10 p-4 text-center">
                  <span className="text-3xl font-bold">24</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                </div>
                <div className="rounded-xl bg-primary/10 p-4 text-center">
                  <span className="text-3xl font-bold">12</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                </div>
              </div>
            </BentoCard>
            
            <BentoCard
              title="Calendar"
              icon={<Calendar className="h-5 w-5" />}
              size="md"
            >
              <div className="mt-2 grid grid-cols-7 gap-1">
                {Array.from({ length: 31 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-md flex items-center justify-center text-xs ${
                      i === 14 ? 'bg-primary text-white' : 
                      i % 7 === 0 || i % 7 === 6 ? 'text-gray-400' : ''
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </BentoCard>
            
            <BentoCard
              title="AI Productivity"
              icon={<Sparkles className="h-5 w-5" />}
              size="lg"
              gradient
              gradientFrom="from-purple-600/20"
              gradientTo="to-pink-600/20"
            >
              <div className="h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full h-32 flex items-end justify-around">
                    {[35, 45, 30, 65, 75, 55, 70].map((height, i) => (
                      <div 
                        key={i} 
                        className="bg-primary/60 rounded-t w-6"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-white dark:bg-gray-800 p-2 text-center shadow-sm">
                    <span className="text-lg font-bold">87%</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Efficiency</p>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-gray-800 p-2 text-center shadow-sm">
                    <span className="text-lg font-bold">+24%</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Growth</p>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-gray-800 p-2 text-center shadow-sm">
                    <span className="text-lg font-bold">12</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Days</p>
                  </div>
                </div>
              </div>
            </BentoCard>
            
            <BentoCard
              title="Recent Activity"
              icon={<Activity className="h-5 w-5" />}
              size="sm"
            >
              <div className="space-y-2">
                {[
                  "Task completed: Update documentation",
                  "New task assigned: Client presentation",
                  "Deadline updated: Project proposal"
                ].map((activity, i) => (
                  <div key={i} className="text-sm border-l-2 border-primary pl-2">
                    {activity}
                  </div>
                ))}
              </div>
            </BentoCard>
          </BentoGrid>
        );
      
      case 'features':
        return (
          <BentoGrid cols={3} gap="md" className="mb-8">
            <BentoCard
              title="AI Task Suggestions"
              icon={<Zap className="h-5 w-5" />}
              size="md"
              gradient
              gradientFrom="from-blue-600/20"
              gradientTo="to-purple-600/20"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get intelligent task recommendations based on your work patterns and priorities.
              </p>
            </BentoCard>
            
            <BentoCard
              title="Smart Scheduling"
              icon={<Calendar className="h-5 w-5" />}
              size="md"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Automatically schedule tasks based on your availability and task urgency.
              </p>
            </BentoCard>
            
            <BentoCard
              title="Productivity Analytics"
              icon={<BarChart3 className="h-5 w-5" />}
              size="md"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gain insights into your productivity trends and task completion rates.
              </p>
            </BentoCard>
            
            <BentoCard
              title="Secure Cloud Sync"
              icon={<Shield className="h-5 w-5" />}
              size="md"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your tasks are securely stored and synced across all your devices.
              </p>
            </BentoCard>
            
            <BentoCard
              title="Team Collaboration"
              icon={<Users className="h-5 w-5" />}
              size="md"
              gradient
              gradientFrom="from-green-600/20"
              gradientTo="to-emerald-600/20"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Share tasks and projects with your team for seamless collaboration.
              </p>
            </BentoCard>
            
            <BentoCard
              title="Productivity Gamification"
              icon={<Award className="h-5 w-5" />}
              size="md"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Earn points and achievements as you complete tasks and build productivity streaks.
              </p>
            </BentoCard>
          </BentoGrid>
        );
        
      case 'metrics':
        return (
          <BentoGrid cols={4} gap="md" className="mb-8">
            <BentoCard
              title="Productivity Score"
              icon={<Target className="h-5 w-5" />}
              size="md"
              gradient
              gradientFrom="from-blue-600/20"
              gradientTo="to-green-600/20"
            >
              <div className="mt-4 flex justify-center">
                <div className="relative h-32 w-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">87</span>
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
            </BentoCard>
            
            <BentoCard
              title="Tasks Completed"
              icon={<Activity className="h-5 w-5" />}
              size="sm"
            >
              <div className="mt-2 flex items-end justify-between">
                <span className="text-3xl font-bold">143</span>
                <span className="text-sm text-green-500">+12% ↑</span>
              </div>
            </BentoCard>
            
            <BentoCard
              title="Active Projects"
              icon={<Briefcase className="h-5 w-5" />}
              size="sm"
            >
              <div className="mt-2 flex items-end justify-between">
                <span className="text-3xl font-bold">8</span>
                <span className="text-sm text-gray-500">Current</span>
              </div>
            </BentoCard>
            
            <BentoCard
              title="Team Performance"
              icon={<Users className="h-5 w-5" />}
              size="lg"
              gradient
              gradientFrom="from-orange-600/20"
              gradientTo="to-red-600/20"
            >
              <div className="mt-4 space-y-3">
                {[
                  { name: "Marketing", progress: 92 },
                  { name: "Development", progress: 78 },
                  { name: "Design", progress: 85 },
                  { name: "Sales", progress: 65 }
                ].map((team, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{team.name}</span>
                      <span>{team.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${team.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </BentoCard>
            
            <BentoCard
              title="System Status"
              icon={<CloudCog className="h-5 w-5" />}
              size="md"
            >
              <div className="mt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">API</span>
                  <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-500 rounded-full px-2 py-0.5">
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database</span>
                  <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-500 rounded-full px-2 py-0.5">
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">AI Engine</span>
                  <span className="text-xs bg-yellow-500/20 text-yellow-700 dark:text-yellow-500 rounded-full px-2 py-0.5">
                    Degraded
                  </span>
                </div>
              </div>
            </BentoCard>
          </BentoGrid>
        );
      
      case 'default':
      default:
        return (
          <BentoGrid cols={3} gap="md" className="mb-8">
            <BentoCard
              title="Card Title"
              subtitle="Card subtitle"
              icon={<Sparkles className="h-5 w-5" />}
              size="sm"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This is a small card (col-span-1, row-span-1).
              </p>
            </BentoCard>
            
            <BentoCard
              title="Medium Width Card"
              icon={<Activity className="h-5 w-5" />}
              size="md"
              gradient
              gradientFrom="from-blue-600/20"
              gradientTo="to-purple-600/20"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This is a medium width card (col-span-2, row-span-1).
              </p>
            </BentoCard>
            
            <BentoCard
              title="Large Card"
              icon={<LayoutGrid className="h-5 w-5" />}
              size="lg"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This is a large card (col-span-2, row-span-2) showing how different-sized cards can be mixed.
              </p>
            </BentoCard>
            
            <BentoCard
              title="Small Card"
              icon={<Zap className="h-5 w-5" />}
              size="sm"
              hoverEffect="glow"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This card uses a glow hover effect.
              </p>
            </BentoCard>
            
            <BentoCard
              title="Full Width Card"
              icon={<Users className="h-5 w-5" />}
              size="full"
              gradient
              gradientFrom="from-green-600/20"
              gradientTo="to-blue-600/20"
              hoverEffect="border"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This is a full-width card (col-span-4, row-span-1) with a gradient background.
              </p>
            </BentoCard>
          </BentoGrid>
        );
    }
  };

  return (
    <div ref={gridRef} className={className}>
      {renderVariant()}
    </div>
  );
}; 