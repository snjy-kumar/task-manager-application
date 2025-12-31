import { motion } from 'framer-motion';
import { Play, ArrowRight, CheckCircle, Star, Users, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 bg-purple-600/30 rounded-full filter blur-[100px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 -right-20 w-96 h-96 bg-blue-600/30 rounded-full filter blur-[100px]"
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 left-1/3 w-96 h-96 bg-pink-600/20 rounded-full filter blur-[100px]"
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        {/* Badge */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-indigo-300 font-medium">Now with AI-powered task suggestions</span>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
          </div>
        </motion.div>

        {/* Hero Text */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Manage Tasks with
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Intelligent Precision
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">
            The AI-powered task manager that learns your habits, prioritizes your work,
            and helps you achieve more with less stress.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            to="/signup"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity -z-10" />
          </Link>

          <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
            <Play className="w-5 h-5 text-indigo-400" />
            <span>Watch Demo</span>
          </button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {[
            { icon: CheckCircle, text: "14-day free trial" },
            { icon: CheckCircle, text: "No credit card required" },
            { icon: CheckCircle, text: "Cancel anytime" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <item.icon className="w-4 h-4 text-green-400" />
              <span>{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          {[
            { icon: Users, value: "50,000+", label: "Active Users", gradient: "from-blue-500 to-cyan-500" },
            { icon: Star, value: "4.9/5", label: "User Rating", gradient: "from-amber-500 to-orange-500" },
            { icon: TrendingUp, value: "40%", label: "Productivity Boost", gradient: "from-green-500 to-emerald-500" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.gradient} mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                {stat.value}
              </div>
              <p className="text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* App Preview */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/10">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full max-w-md mx-auto px-4 py-1.5 rounded-lg bg-slate-900/50 text-slate-400 text-sm text-center">
                  taskmanager.app/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8">
              <img
                src="/dashboard.png"
                alt="TaskManager Dashboard"
                className="w-full rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/1200x700/1e293b/4f46e5?text=TaskManager+Dashboard';
                }}
              />
            </div>
          </div>

          {/* Floating card - AI Assistant */}
          <motion.div
            className="absolute -right-4 top-1/4 max-w-xs p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl hidden lg:block"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">AI Assistant</h4>
                <p className="text-xs text-slate-400">Just now</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              "I've rescheduled your 3 PM meeting to tomorrow to give you focus time for the project deadline."
            </p>
          </motion.div>

          {/* Floating card - Productivity Stats */}
          <motion.div
            className="absolute -left-4 bottom-1/4 max-w-xs p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl hidden lg:block"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Weekly Insight</h4>
                <p className="text-xs text-slate-400">Productivity report</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              You're <span className="text-green-400 font-semibold">23% more productive</span> this week compared to last!
            </p>
          </motion.div>
        </motion.div>

        {/* Trusted by section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          <p className="text-slate-500 mb-8">Trusted by teams at leading companies</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 hover:opacity-100 transition-opacity duration-300">
            {['Google', 'Microsoft', 'Apple', 'Amazon', 'Netflix'].map((company, i) => (
              <motion.div
                key={i}
                className="text-2xl font-bold text-slate-500"
                whileHover={{ scale: 1.1, color: '#fff' }}
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
    </section>
  );
};

export default HeroSection;