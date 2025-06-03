import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, BrainCircuit, TrendingUp, Rocket, Zap, BarChart, Clock, ThumbsUp, CheckCircle, ArrowRight } from "lucide-react";

export default function HowItWorksSection() {
  const [, setHoveredStep] = useState<number | null>(null);

  return (
    <section id="how-it-works" className="w-full py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
        <motion.div 
          className="absolute -top-48 -left-48 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl"
          animate={{ 
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute top-1/3 -right-48 w-96 h-96 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl"
          animate={{ 
            y: [0, -30, 0],
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute -bottom-32 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            scale: [0.9, 1, 0.9],
            opacity: [0.4, 0.6, 0.4] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 12,
            repeatType: "mirror" 
          }}
        />
      </div>

      <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
        {/* Enhanced header section with pulsing accent */}
        <div className="relative">
          <motion.div 
            className="absolute inset-0 -z-10 mx-auto w-40 h-40 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-full blur-3xl opacity-70"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
          
          <motion.div 
            className="text-center mb-16 md:mb-24 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-primary/10 dark:bg-primary/20 backdrop-blur-sm border border-primary/20 dark:border-primary/30"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                className="inline-block w-2 h-2 rounded-full bg-primary"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm font-medium text-primary tracking-wide">
                Smart Task Management
              </span>
            </motion.div>
            
            <motion.h2
              className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              AI-Powered Productivity Flow
            </motion.h2>
            
            <motion.div
              className="h-1 w-20 bg-gradient-to-r from-primary to-blue-600 mx-auto my-6 rounded-full"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 80, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            
            <motion.p
              className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Transform your workflow with our intelligent three-step system combining human intuition with machine efficiency
            </motion.p>
          </motion.div>
        </div>

        {/* Enhanced process flow with interactive elements */}
        <div className="relative max-w-6xl  mx-auto mb-28">
          {/* Connecting lines with animated gradient */}
          <div className="hidden md:block absolute top-32 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          {/* Animated progress tracker that follows scroll */}
          {/* <motion.div 
            className="hidden md:block absolute top-32 left-0 h-1 bg-gradient-to-r from-primary via-blue-600 to-primary"
            style={{ width: '100%' }}
            initial={{ width: '0%' }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          /> */}
          
          {/* Enhanced process steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 mt-8 md:mt-16">
            <StepCard
              number={1}
              title="Task Integration"
              description="Bring all your tasks into one intelligent workspace"
              icon={<ClipboardList className="w-8 h-8" />}
              features={[
                "Multi-platform sync",
                "Voice input",
                "Email-to-task conversion",
                "Smart capture"
              ]}
              color="from-blue-600/80 to-indigo-600/80"
              bgColor="from-blue-50 to-blue-100/30 dark:from-blue-900/30 dark:to-blue-900/10"
              onHover={() => setHoveredStep(1)}
              onLeave={() => setHoveredStep(null)}
            />
            <StepCard
              number={2}
              title="AI Optimization"
              description="Smart prioritization and scheduling"
              icon={<BrainCircuit className="w-8 h-8" />}
              features={[
                "ML-powered prioritization",
                "Energy level matching",
                "Deadline prediction",
                "Context analysis"
              ]}
              color="from-purple-600/80 to-violet-600/80"
              bgColor="from-purple-50 to-purple-100/30 dark:from-purple-900/30 dark:to-purple-900/10"
              onHover={() => setHoveredStep(2)}
              onLeave={() => setHoveredStep(null)}
            />
            <StepCard
              number={3}
              title="Execute & Evolve"
              description="Achieve more with intelligent tracking"
              icon={<TrendingUp className="w-8 h-8" />}
              features={[
                "Focus time blocking",
                "Progress analytics",
                "Adaptive rescheduling",
                "Growth insights"
              ]}
              color="from-emerald-600/80 to-green-600/80"
              bgColor="from-green-50 to-green-100/30 dark:from-green-900/30 dark:to-green-900/10"
              onHover={() => setHoveredStep(3)}
              onLeave={() => setHoveredStep(null)}
            />
          </div>
        </div>

        {/* Enhanced stats section with animated indicators */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-20 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <StatCard 
            icon={<Zap className="w-7 h-7" />}
            value="95%"
            label="Productivity Boost"
            color="from-blue-500 to-indigo-600"
            duration={1.5}
          />
          <StatCard 
            icon={<BarChart className="w-7 h-7" />}
            value="10M+"
            label="Tasks Optimized"
            color="from-purple-500 to-violet-600"
            duration={2}
          />
          <StatCard 
            icon={<Clock className="w-7 h-7" />}
            value="2.5x"
            label="Faster Execution"
            color="from-emerald-500 to-green-600"
            duration={2.5}
          />
          <StatCard 
            icon={<ThumbsUp className="w-7 h-7" />}
            value="4.9/5"
            label="User Satisfaction"
            color="from-amber-500 to-orange-600"
            duration={3}
          />
        </motion.div>

        {/* Enhanced CTA section */}
        <motion.div 
          className="mt-24 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-b from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-800/40 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30">
            <motion.h3
              className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Ready to Transform Your Productivity?
            </motion.h3>
            
            <motion.p
              className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Join thousands of professionals who have already supercharged their workflow with our AI-powered task management system.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.button 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:shadow-primary/25 transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="mr-3">Start Free Trial</span>
                <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-4">
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> 
                  14-day free trial
                </span>
                <span className="hidden sm:flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> 
                  No credit card required
                </span>
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> 
                  Cancel anytime
                </span>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
  bgColor: string;
  onHover: () => void;
  onLeave: () => void;
}

function StepCard({ 
  number, 
  title, 
  description, 
  icon, 
  features, 
  color, 
  bgColor,
  onHover,
  onLeave
}: StepCardProps) {
  return (
    <motion.div
      className={`relative p-6 md:p-8 pt-10 mt-8 rounded-2xl bg-gradient-to-b ${bgColor} border border-white/50 dark:border-gray-700/50 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: number * 0.1 }}
      whileHover={{ 
        y: -5, 
        transition: { duration: 0.3 } 
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Step number - now visible on all screen sizes and properly centered */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center text-lg font-bold text-white shadow-lg border-2 border-white dark:border-gray-800">
          {number}
        </div>
      </div>
      
      {/* Top light effect to connect with the flow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-primary/50 to-transparent"></div>
      
      <div className="flex flex-col items-center text-center">
        <motion.div 
          className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center mb-6 text-white shadow-lg transform-gpu`}
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.6 }}
        >
          {icon}
        </motion.div>
        
        <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-xs mx-auto">{description}</p>
        
        <ul className="space-y-3 text-left w-full">
          {features.map((feature, index) => (
            <motion.li 
              key={index} 
              className="flex items-center text-gray-700 dark:text-gray-300"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + (index * 0.1) }}
            >
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 dark:bg-green-500/30 flex items-center justify-center mr-3">
                <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
              </div>
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>

        <motion.div 
          className="mt-8 w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <button className={`w-full flex items-center justify-center py-3 px-4 rounded-lg bg-gradient-to-r ${color} text-white opacity-80 hover:opacity-100 font-medium shadow transition-all duration-300 group`}>
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  duration?: number;
}

function StatCard({ icon, value, label, color, duration = 2 }: StatCardProps) {
  return (
    <motion.div 
      className="relative overflow-hidden p-6 bg-white dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 dark:border-gray-700/50 group hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${color} p-3 text-white shadow`}>
          {icon}
        </div>
        
        <div>
          <motion.div 
            className={`text-3xl font-bold mb-1 bg-gradient-to-r ${color} bg-clip-text text-transparent`}
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {value}
          </motion.div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
        </div>
      </div>
      
      <motion.div
        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${color}`}
        style={{ width: '0%' }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: duration || 2 }}
      />
    </motion.div>
  );
}