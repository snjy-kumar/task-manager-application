import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Zap,
  Shield,
  Trophy,
  Users,
  Clock,
  UserPlus,
  Bell,
  Smartphone,
  Repeat,
  Sliders,
  Cloud,
  Lightbulb,
  CheckCircle2,
  GitBranch,
  Layers,
  Target,
} from 'lucide-react';

/* ─── Design tokens (Obsidian + Amber) ─────────────────────────── */
const BG = 'hsl(222,25%,7%)';
const CARD = 'hsl(222,25%,10%)';
const BORDER = 'rgba(255,255,255,0.07)';

/* ─── Data ──────────────────────────────────────────────────────── */
const coreFeatures = [
  {
    icon: Zap,
    title: 'AI Task Suggestions',
    description: 'Intelligent recommendations based on your work patterns, priorities, and deadlines — so you always know what to tackle next.',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Automatically slot tasks into your calendar based on availability, energy levels, and task urgency.',
  },
  {
    icon: BarChart3,
    title: 'Productivity Analytics',
    description: 'Deep insights into completion rates, bottlenecks, and trends so you can continuously improve.',
  },
  {
    icon: Shield,
    title: 'Secure Cloud Sync',
    description: 'End-to-end encrypted storage keeps your tasks safe and available across every device, instantly.',
  },
  {
    icon: Trophy,
    title: 'Gamification',
    description: 'Earn streaks, badges, and points as you hit goals — turning daily productivity into something you look forward to.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Share projects, assign tasks, leave comments, and track team progress in one unified workspace.',
  },
  {
    icon: Clock,
    title: 'Time Tracking',
    description: 'Log time per task automatically or manually, then review reports to see where your hours actually go.',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Get the right reminder at the right time — no noise, no missed deadlines.',
  },
  {
    icon: UserPlus,
    title: 'Task Delegation',
    description: 'Assign tasks to teammates with one click, add context, and track their progress without micromanaging.',
  },
];

const advancedFeatures = [
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Native iOS and Android apps so your tasks are always with you.',
  },
  {
    icon: Repeat,
    title: 'Recurring Tasks',
    description: 'Set up rules for daily, weekly, or custom recurring tasks and never set them up twice.',
  },
  {
    icon: Sliders,
    title: 'Custom Workflows',
    description: 'Build Kanban boards, lists, or hybrid views that match exactly how your team operates.',
  },
  {
    icon: Cloud,
    title: 'API & Integrations',
    description: 'Connect Slack, GitHub, Google Calendar, Notion, and 50+ more tools via our REST API.',
  },
  {
    icon: Lightbulb,
    title: 'AI Learning',
    description: 'The model learns from your behaviour to surface increasingly personalised suggestions over time.',
  },
  {
    icon: Target,
    title: 'Goal Tracking',
    description: 'Tie tasks to larger objectives and see real-time progress toward what actually matters.',
  },
  {
    icon: GitBranch,
    title: 'Task Dependencies',
    description: 'Chain tasks together so blockers surface automatically before they stall your workflow.',
  },
  {
    icon: Layers,
    title: 'Templates',
    description: 'Save any project as a reusable template and spin up identical workflows in seconds.',
  },
  {
    icon: BarChart3,
    title: 'Team Analytics',
    description: 'See output, load balance, and velocity across your whole team in a single dashboard.',
  },
];

const highlights = [
  '14-day free trial, no credit card',
  'Unlimited tasks on all paid plans',
  'SOC 2 Type II certified',
  'Priority onboarding support',
];

/* ─── Sub-components ────────────────────────────────────────────── */
interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay: index * 0.06 }}
    className="group relative rounded-2xl p-6 border transition-all duration-300 hover:border-amber-500/30"
    style={{ background: CARD, borderColor: BORDER }}
  >
    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ background: 'radial-gradient(ellipse at 20% 20%, rgba(245,166,35,0.05) 0%, transparent 70%)' }} />
    <div className="relative">
      <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
        <Icon className="w-5 h-5 text-amber-400" />
      </div>
      <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/50 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

/* ─── Page ──────────────────────────────────────────────────────── */
const FeaturesPage: React.FC = () => {
  return (
    <main className="flex-1" style={{ background: BG }}>

      {/* Hero */}
      <section className="relative w-full py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-[0.06]"
            style={{ background: 'radial-gradient(ellipse at center, #F5A623 0%, transparent 65%)' }} />
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 mb-8"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400 text-xs font-semibold tracking-wide uppercase">Everything you need</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6"
          >
            Features built for<br />
            <span className="text-amber-400">real productivity.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-white/50 text-lg leading-relaxed max-w-2xl mx-auto mb-10"
          >
            From AI-powered suggestions to deep analytics and team collaboration — every feature is designed to help you accomplish more with less friction.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors shadow-lg shadow-amber-500/20"
            >
              Get started free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl border text-white/70 hover:text-white hover:border-white/30 font-semibold text-sm transition-colors"
              style={{ borderColor: BORDER }}
            >
              View pricing
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px" style={{ background: BORDER }} />
      </div>

      {/* Core Features */}
      <section className="w-full py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4 block">Core features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The fundamentals, done right</h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              AI intelligence combined with intuitive design to give you the ultimate task management experience.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreFeatures.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <div className="w-full border-y" style={{ borderColor: BORDER, background: CARD }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50K+', label: 'Active users' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '4.8★', label: 'Average rating' },
              { value: '50+', label: 'Integrations' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-amber-400 mb-1">{stat.value}</div>
                <div className="text-sm text-white/45">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <section className="w-full py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-4 block">Advanced capabilities</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Power-user features</h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Take your productivity to the next level with our complete feature set.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {advancedFeatures.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center border"
            style={{ background: 'hsl(222,25%,11%)', borderColor: 'rgba(245,166,35,0.15)' }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 opacity-[0.08]"
              style={{ background: 'radial-gradient(ellipse at center, #F5A623 0%, transparent 70%)' }} />
            <div className="relative">
              <span className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-6 block">Get started today</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
                Ready to transform<br />
                <span className="text-amber-400">your workflow?</span>
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
                Join thousands of teams who ship faster, stress less, and stay focused.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors shadow-lg shadow-amber-500/20"
                >
                  Start your free trial <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl border text-white/70 hover:text-white hover:border-white/30 font-semibold text-sm transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.12)' }}
                >
                  Request a demo
                </Link>
              </div>
              <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center">
                {highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-white/40 text-sm justify-center">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FeaturesPage;
