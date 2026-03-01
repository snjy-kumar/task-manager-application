import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Zap, Users, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const tasks = [
  { label: 'Design review', priority: 'High', status: 'In Progress', color: 'text-amber-500' },
  { label: 'Sprint planning', priority: 'Medium', status: 'Pending', color: 'text-amber-400' },
  { label: 'User research', priority: 'Low', status: 'Completed', color: 'text-green-400' },
  { label: 'API integration', priority: 'High', status: 'In Progress', color: 'text-amber-500' },
];

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen bg-[hsl(222,25%,7%)] overflow-hidden flex items-center">
      {/* Geometric background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle at 70% 30%, #F5A623 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Diagonal accent line */}
        <div className="absolute top-0 right-[28%] h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen lg:min-h-0 lg:py-28">
          {/* Left — copy */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 mb-8"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400 text-xs font-semibold tracking-wide">AI-powered task intelligence</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-[4.25rem] font-bold text-white leading-[1.08] tracking-tight mb-6"
            >
              The task manager
              <br />
              <span className="text-amber-400">built for how</span>
              <br />
              people work.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-white/45 text-lg leading-relaxed max-w-lg mb-10"
            >
              Prioritize ruthlessly, collaborate seamlessly, and ship consistently — from individual tasks to full team workflows.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap gap-3 mb-14"
            >
              <Link
                to="/signup"
                className="group inline-flex items-center gap-2 h-12 px-6 bg-amber-500 hover:bg-amber-600 text-[hsl(222,25%,7%)] font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/25 text-sm"
              >
                Start for free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center gap-2 h-12 px-6 bg-white/8 hover:bg-white/12 text-white font-medium rounded-xl border border-white/12 transition-all duration-200 text-sm"
              >
                See features
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-8"
            >
              {[
                { icon: CheckCircle2, text: 'No credit card' },
                { icon: Users, text: '50k+ users' },
                { icon: BarChart3, text: '2M+ tasks shipped' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-white/40 text-sm">
                  <item.icon className="w-4 h-4 text-amber-400/70" strokeWidth={1.75} />
                  {item.text}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — product preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="hidden lg:block"
          >
            <div className="relative bg-[hsl(222,22%,11%)] rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
              {/* Window topbar */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-[hsl(222,25%,8%)]">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                <div className="ml-4 flex-1 h-5 bg-white/5 rounded-md" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div>
                  <p className="text-white/30 text-xs mb-0.5">Mar 2026</p>
                  <h3 className="font-display text-white font-semibold text-base">My Tasks</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 px-2.5 rounded-lg bg-amber-500/15 text-amber-400 text-[11px] font-semibold flex items-center">Sprint 12</div>
                  <div className="w-6 h-6 rounded-lg bg-white/8 flex items-center justify-center">
                    <span className="text-white/50 text-xs">+</span>
                  </div>
                </div>
              </div>

              {/* Task list */}
              <div className="px-4 pb-4 space-y-2">
                {tasks.map((task, i) => (
                  <motion.div
                    key={task.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/6 hover:bg-white/6 transition-colors"
                  >
                    <div className={`w-1.5 h-8 rounded-full flex-shrink-0 ${task.status === 'Completed' ? 'bg-green-400' : task.status === 'In Progress' ? 'bg-amber-500' : 'bg-white/15'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${task.status === 'Completed' ? 'text-white/35 line-through' : 'text-white/85'}`}>
                        {task.label}
                      </p>
                      <p className="text-[11px] text-white/30 mt-0.5">{task.status}</p>
                    </div>
                    <span className={`text-[11px] font-semibold ${task.color}`}>{task.priority}</span>
                  </motion.div>
                ))}

                {/* Progress bar */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white/30 text-[11px]">Sprint progress</span>
                    <span className="text-amber-400 text-[11px] font-semibold">67%</span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '67%' }}
                      transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="absolute -bottom-4 -left-6 bg-[hsl(222,22%,11%)] border border-white/12 rounded-2xl p-4 shadow-xl"
              style={{ position: 'absolute' }}
            >
              <div className="text-amber-400 font-display font-bold text-xl">↑ 34%</div>
              <div className="text-white/40 text-xs mt-0.5">productivity this week</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
