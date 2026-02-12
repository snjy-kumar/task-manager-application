import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Zap, Calendar, BarChart3, Users,
  ArrowRight, Brain, Target, Bell
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Task Suggestions",
    description: "Get intelligent recommendations based on your work patterns, priorities, and deadlines.",
    gradient: "from-gray-600 to-gray-800",
    delay: 0
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Automatically organize your day with optimal task placement based on energy levels.",
    gradient: "from-gray-600 to-gray-800",
    delay: 0.1
  },
  {
    icon: BarChart3,
    title: "Productivity Analytics",
    description: "Visualize your productivity trends and discover insights to work smarter.",
    gradient: "from-green-500 to-emerald-600",
    delay: 0.2
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Set ambitious goals and track your progress with milestone celebrations.",
    gradient: "from-gray-600 to-gray-800",
    delay: 0.3
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share tasks, assign responsibilities, and collaborate in real-time.",
    gradient: "from-gray-600 to-gray-800",
    delay: 0.4
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Never miss a deadline with intelligent notifications at the right moment.",
    gradient: "from-gray-600 to-gray-800",
    delay: 0.5
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-200 dark:bg-gray-800/20 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-200 dark:bg-gray-800/20 rounded-full blur-[120px] opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-800/30 text-gray-900 dark:text-gray-100 text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Powerful Features
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything You Need to
            <br />
            <span className="text-gray-900 dark:text-white">
              Stay Productive
            </span>
          </motion.h2>

          <motion.p
            className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our AI-powered platform adapts to your workflow and helps you achieve more with less effort.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative p-6 lg:p-8 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
              whileHover={{ y: -5 }}
            >
              {/* Gradient border on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gray-400 dark:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
              <div className="absolute inset-[1px] rounded-2xl bg-white dark:bg-gray-900 -z-10" />

              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-5`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Learn more link */}
              <div className="mt-4 flex items-center text-gray-900 dark:text-gray-100 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            to="/features"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-105"
          >
            Explore All Features
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}