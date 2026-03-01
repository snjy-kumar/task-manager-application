import { motion } from "framer-motion";
import { Brain, Calendar, BarChart3, Users, Bell, Target, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Brain,
    title: "AI Task Suggestions",
    description: "Get intelligent recommendations based on your work patterns, deadlines, and energy — not just due dates.",
    tag: "Smart",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Automatically find the best time for every task based on your real availability and focus windows.",
    tag: "Efficient",
  },
  {
    icon: BarChart3,
    title: "Productivity Analytics",
    description: "Visualize productivity trends, spot bottlenecks, and make data-backed decisions about how you work.",
    tag: "Insights",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Break ambitious goals into measurable milestones and watch your progress compound over time.",
    tag: "Growth",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Assign tasks, share context, and keep everyone aligned — without drowning in notifications.",
    tag: "Together",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Context-aware notifications that surface at the right moment, not at arbitrary times.",
    tag: "Timely",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 lg:py-32 bg-[hsl(40,30%,97%)] dark:bg-[hsl(222,22%,8%)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16 lg:mb-20">
          <motion.p
            className="text-amber-600 dark:text-amber-400 text-sm font-semibold tracking-[0.15em] uppercase mb-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Features
          </motion.p>
          <motion.h2
            className="font-display text-4xl md:text-5xl font-bold text-foreground leading-[1.1] tracking-tight mb-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            Everything you need
            <br />
            to stay in flow.
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Naumin adapts to how you actually work — not the other way around.
          </motion.p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden shadow-sm">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="bg-[hsl(40,30%,97%)] dark:bg-[hsl(222,22%,8%)] p-7 lg:p-8 hover:bg-card dark:hover:bg-[hsl(222,22%,11%)] transition-colors duration-200 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              {/* Icon + tag row */}
              <div className="flex items-start justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/12 border border-amber-500/20 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={1.75} />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                  {feature.tag}
                </span>
              </div>

              <h3 className="font-display text-base font-semibold text-foreground mb-2.5 leading-snug">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA link */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link
            to="/features"
            className="group inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium text-sm hover:gap-3 transition-all"
          >
            Explore all features
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
