import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Calendar, BarChart, Shield, Award, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
      <div className=" px-6 md:px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <motion.span 
            className="block text-sm font-medium text-primary mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Innovative Features
          </motion.span>
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-gray-800 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything You Need To <span className="text-primary">Stay Productive</span>
          </motion.h2>
          <motion.p 
            className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our AI-powered platform adapts to your workflow and provides the tools you need to excel
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          <FeatureCard
            icon={<Zap className="h-10 w-10 mb-4 text-primary" />}
            title="AI Task Suggestions"
            description="Get intelligent task recommendations based on your work patterns and priorities."
          />
          <FeatureCard
            icon={<Calendar className="h-10 w-10 mb-4 text-primary" />}
            title="Smart Scheduling"
            description="Automatically schedule tasks based on your availability and task urgency."
          />
          <FeatureCard
            icon={<BarChart className="h-10 w-10 mb-4 text-primary" />}
            title="Productivity Analytics"
            description="Gain insights into your productivity trends and task completion rates."
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10 mb-4 text-primary" />}
            title="Secure Cloud Sync"
            description="Your tasks are securely stored and synced across all your devices."
          />
          <FeatureCard
            icon={<Award className="h-10 w-10 mb-4 text-primary" />}
            title="Productivity Gamification"
            description="Earn points and achievements as you complete tasks and build productivity streaks."
          />
          <FeatureCard
            icon={<Briefcase className="h-10 w-10 mb-4 text-primary" />}
            title="Team Collaboration"
            description="Share tasks and projects with your team for seamless collaboration."
          />
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button size="lg" asChild className="rounded-full bg-primary hover:bg-primary-dark transition duration-300">
            <Link to="/features" className="flex items-center justify-center">
              Explore All Features <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
      
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-10" />
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-10" />
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-transform transform hover:scale-105"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {icon}
      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </motion.div>
  );
}