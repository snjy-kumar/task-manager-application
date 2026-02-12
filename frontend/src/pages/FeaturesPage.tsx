import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  BarChart, 
  Calendar, 
  Zap, 
  Shield, 
  Award, 
  Briefcase,
  Clock,
  UserPlus,
  Bell,
  Smartphone,
  Repeat,
  Sliders,
  Cloud,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeaturesPage: React.FC = () => {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 lg:py-40 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Powerful Features for <span className="text-gray-900 dark:text-white">Maximum Productivity</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-500 dark:text-gray-400 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Discover how our AI-powered platform can transform your workflow and help you accomplish more with less effort.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" asChild className="rounded-full px-8">
                <Link to="/signup">
                  Try for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full px-8">
                <Link to="/pricing">
                  View Pricing
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
      </section>

      {/* Core Features Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Features</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with intuitive design to provide you with the ultimate task management experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="h-10 w-10 text-gray-900 dark:text-gray-100" />}
              title="AI Task Suggestions"
              description="Get intelligent task recommendations based on your work patterns and priorities."
            />
            <FeatureCard 
              icon={<Calendar className="h-10 w-10 text-gray-900 dark:text-gray-100" />}
              title="Smart Scheduling"
              description="Automatically schedule tasks based on your availability and task urgency."
            />
            <FeatureCard 
              icon={<BarChart className="h-10 w-10 text-gray-900 dark:text-gray-100" />}
              title="Productivity Analytics"
              description="Gain insights into your productivity trends and task completion rates."
            />
            <FeatureCard 
              icon={<Shield className="h-10 w-10 text-gray-900 dark:text-gray-100" />}
              title="Secure Cloud Sync"
              description="Your tasks are securely stored and synced across all your devices."
            />
            <FeatureCard 
              icon={<Award className="h-10 w-10 text-gray-900 dark:text-gray-100" />}
              title="Productivity Gamification"
              description="Earn points and achievements as you complete tasks and build productivity streaks."
            />
            <FeatureCard 
              icon={<Briefcase className="h-10 w-10 text-gray-900 dark:text-gray-100" />}
              title="Team Collaboration"
              description="Share tasks and projects with your team for seamless collaboration."
            />
            <FeatureCard 
              icon={<Clock className="h-10 w-10 text-gray-900 dark:text-gray-100" />}
              title="Time Tracking"
              description="Track time spent on tasks to improve your time management skills."
            />
            <FeatureCard 
              icon={<UserPlus className="h-10 w-10 text-gray-900 dark:text-gray-100" />}
              title="Task Delegation"
              description="Easily assign tasks to team members and track their progress."
            />
            <FeatureCard 
              icon={<Bell className="h-10 w-10 text-gray-900 dark:text-gray-100" />}
              title="Smart Notifications"
              description="Get reminders and alerts for important tasks and deadlines."
            />
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Features</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              Take your productivity to the next level with our powerful advanced features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Smartphone className="h-10 w-10 text-gray-900 dark:text-gray-100" />}
              title="Mobile Apps"
              description="Access your tasks on the go with our iOS and Android mobile applications."
            />
            <FeatureCard 
              icon={<Repeat className="h-10 w-10 text-gray-900 dark:text-gray-100" />}
              title="Recurring Tasks"
              description="Set up recurring tasks for regular activities and never miss a beat."
            />
            <FeatureCard 
              icon={<Sliders className="h-10 w-10 text-gray-900 dark:text-gray-100" />}
              title="Custom Workflows"
              description="Create custom workflows to match your unique process and requirements."
            />
            <FeatureCard 
              icon={<Cloud className="h-10 w-10 text-gray-900 dark:text-gray-100" />}
              title="API Integration"
              description="Connect with your favorite tools through our robust API integration."
            />
            <FeatureCard 
              icon={<Lightbulb className="h-10 w-10 text-gray-900 dark:text-gray-100" />}
              title="AI Learning"
              description="Our system learns from your behavior to provide increasingly personalized experiences."
            />
            <FeatureCard 
              icon={<UserPlus className="h-10 w-10 text-gray-900 dark:text-gray-100" />}
              title="Team Analytics"
              description="Get insights into team performance and identify opportunities for improvement."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
            <p className="text-xl mb-8 text-white/80">
              Join thousands of satisfied users who are already boosting their productivity with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-gray-900 dark:text-gray-100 hover:bg-gray-100 rounded-full px-8">
                <Link to="/signup">
                  Start Your Free Trial
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white/10 rounded-full px-8">
                <Link to="/contact">
                  Request a Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div 
      className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 p-3 bg-gray-200 dark:bg-gray-800/10 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </motion.div>
  );
};

export default FeaturesPage; 