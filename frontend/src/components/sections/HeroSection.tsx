import { motion } from 'framer-motion';
import { FaPlayCircle, FaChartLine, FaCheck } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section className="relative w-full bg-gradient-to-br from-slate-950 to-slate-900 overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      {/* Abstract shapes background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-0 -left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-10 w-72 h-72 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content container */}
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Manage Tasks Smarter with{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
              AI Assistance
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-300">
            TaskAI helps you organize, prioritize, and complete your tasks with 
            intelligent suggestions and automated workflows tailored to your habits.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Main App Preview - Spans 2 columns */}
          <motion.div 
            className="md:col-span-2 rounded-3xl bg-slate-800/50 backdrop-blur-sm p-8 border border-slate-700/50 shadow-xl overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative">
              <img 
                src="/dashboard.png" 
                alt="TaskAI Dashboard" 
                className="w-full h-auto rounded-lg shadow-lg transition-transform duration-500 group-hover:scale-[1.02]"
              />
              
              <motion.div 
                className="absolute top-6 right-6 bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20 max-w-xs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                    AI
                  </div>
                  <h3 className="font-medium text-white">Smart Assistant</h3>
                </div>
                <p className="text-slate-200 text-sm">
                  I've rescheduled your meeting to free up time for the project deadline
                </p>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white">
                    <FaChartLine />
                  </div>
                  <h3 className="font-medium text-white">Insights</h3>
                </div>
                <p className="text-slate-200 text-sm">
                  You're 64% more productive on Tuesdays
                </p>
              </motion.div>
            </div>
          </motion.div>
          
          {/* CTA Card */}
          <motion.div 
            className="rounded-3xl bg-gradient-to-br from-indigo-800/50 to-purple-800/50 backdrop-blur-sm p-8 border border-indigo-700/30 shadow-xl flex flex-col justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-white mb-6">Ready to boost your productivity?</h3>
            
            <div className="flex flex-col gap-4 mb-8">
              <button className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-indigo-500/25 transition duration-300 flex items-center justify-center gap-2 hover:scale-105">
                Get Started Free
              </button>
              
              <button className="w-full py-3 px-6 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg border border-white/20 hover:bg-white/20 transition duration-300 flex items-center justify-center gap-2">
                <FaPlayCircle className="text-indigo-300" />
                Watch Demo
              </button>
            </div>
            
            <div className="mt-auto">
              <p className="text-xs text-indigo-200 uppercase tracking-wider font-semibold mb-3">No credit card required</p>
              <ul className="space-y-2">
                {["Free 14-day trial", "Cancel anytime", "All features included"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-200">
                    <FaCheck className="text-green-400" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          {/* Stats Cards Row */}
          <motion.div 
            className="grid grid-cols-3 gap-6 md:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {[
              { figure: "15,000+", label: "Active Users", color: "from-blue-500 to-cyan-500" },
              { figure: "4.8/5", label: "User Rating", color: "from-amber-500 to-orange-500" },
              { figure: "30%", label: "Productivity Boost", color: "from-green-500 to-emerald-500" }
            ].map((stat, i) => (
              <div 
                key={i} 
                className="rounded-3xl bg-slate-800/50 backdrop-blur-sm p-6 border border-slate-700/50 shadow-lg text-center hover:transform hover:scale-105 transition duration-300"
              >
                <div className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.figure}
                </div>
                <p className="text-slate-300">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Company Logos */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          <p className="text-slate-400 mb-6">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-70 hover:opacity-100 transition duration-300">
            {[1, 2, 3, 4].map((num) => (
              <img 
                key={num}
                src={`/images/logo-${num}.svg`} 
                alt={`Company ${num}`} 
                className="h-8 md:h-10 w-auto grayscale hover:grayscale-0 transition duration-300" 
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;