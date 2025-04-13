import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronDown, ChevronUp, MessageCircleQuestion, Sparkles, ShieldCheck, Calendar, Users, Zap } from "lucide-react";

export default function FAQSection() {
  return (
    <section className="w-full py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
        
        <motion.div 
          className="absolute top-1/4 left-5 w-72 h-72 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full blur-3xl"
          animate={{ 
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15,
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className="absolute top-2/3 right-5 w-80 h-80 bg-gradient-to-r from-cyan-600/10 to-sky-600/10 rounded-full blur-3xl"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10,
            repeatType: "reverse" 
          }}
        />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array(8).fill(0).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/30 dark:bg-primary/20"
              style={{
                width: Math.random() * 8 + 2 + "px",
                height: Math.random() * 8 + 2 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <div className="container px-4 md:px-6 max-w-6xl mx-auto relative z-10">
        {/* Enhanced header */}
        <motion.div 
          className="text-center mb-16 md:mb-24"
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
              Questions & Answers
            </span>
          </motion.div>
          
          <motion.h2
            className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Frequently Asked Questions
          </motion.h2>
          
          <motion.div
            className="h-1 w-20 bg-gradient-to-r from-primary to-blue-600 mx-auto my-6 rounded-full"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 80, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          
          <motion.p
            className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Get instant answers to common questions about our AI task management platform
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left column - Accordion FAQ items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <AdvancedFAQItem 
              question="How does the AI task suggestion work?"
              answer="Our AI analyzes your work patterns, past task completion data, calendar availability, and stated priorities to suggest optimal tasks at the right time. Using natural language processing and machine learning algorithms, it learns your preferences over time and gets smarter with each interaction."
              icon={<Sparkles className="w-5 h-5" />}
              index={0}
            />
            <AdvancedFAQItem 
              question="Can I integrate with existing tools?"
              answer="Yes! We support seamless integration with all major productivity platforms including Google Workspace, Microsoft Office 365, Slack, Asana, Trello, Notion, and many more. Our API also allows for custom integrations with enterprise systems."
              icon={<Zap className="w-5 h-5" />}
              index={1}
            />
            <AdvancedFAQItem 
              question="Is my data secure?"
              answer="Absolutely. We implement enterprise-grade security with AES-256 encryption for all data at rest and in transit. We're fully GDPR and CCPA compliant, and perform regular security audits. Your data is never sold or used for training algorithms outside your workspace."
              icon={<ShieldCheck className="w-5 h-5" />}
              index={2}
            />
          </motion.div>

          {/* Right column - Accordion FAQ items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <AdvancedFAQItem 
              question="Do you offer a free trial?"
              answer="Yes, we offer a comprehensive 14-day free trial with full access to all features. No credit card is required to get started, and you'll receive a reminder before the trial ends so there are no surprise charges."
              icon={<Calendar className="w-5 h-5" />}
              index={3}
            />
            <AdvancedFAQItem 
              question="What team collaboration features are available?"
              answer="Our Pro and Enterprise plans include advanced team management tools like shared workspaces, role-based permissions, team analytics, collaborative task assignment, real-time updates, and team performance insights to optimize group productivity."
              icon={<Users className="w-5 h-5" />}
              index={4}
            />
            <AdvancedFAQItem 
              question="How do I get started?"
              answer="Getting started takes just 30 seconds! Sign up with your email or Google account, and our interactive onboarding wizard will guide you through setting up your workspace. Import your existing tasks or start fresh, and you'll be ready to go in minutes."
              icon={<MessageCircleQuestion className="w-5 h-5" />}
              index={5}
            />
          </motion.div>
        </div>

        {/* Enhanced CTA section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="p-px bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-2xl inline-block">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg border border-white/20 dark:border-gray-700/30">
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Still have questions?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-lg mx-auto">
                Our support team is ready to help with any specific questions about our platform or pricing options.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:shadow-primary/25 transition-all duration-300 group"
              >
                <span className="mr-3">Contact Support</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface AdvancedFAQItemProps {
  question: string;
  answer: string;
  icon: React.ReactNode;
  index: number;
}

function AdvancedFAQItem({ question, answer, icon, index }: AdvancedFAQItemProps) {
  const [isOpen, setIsOpen] = useState(index === 0);
  
  return (
    <motion.div
      className="rounded-xl overflow-hidden bg-white dark:bg-gray-800/80 shadow-lg border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)" }}
    >
      <motion.button
        className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isOpen 
              ? "bg-gradient-to-r from-primary to-blue-600 text-white" 
              : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          } transition-all duration-300`}>
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {question}
          </h3>
        </div>
        <div className="flex-shrink-0 ml-4">
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-primary dark:text-primary-light" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          )}
        </div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 border-t border-gray-100 dark:border-gray-700/50">
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Animated bottom border */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}