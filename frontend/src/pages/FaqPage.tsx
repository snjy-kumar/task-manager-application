import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Zap,
  Users,
  Lock,
  CreditCard,
  Smartphone,
  Settings,
  Cloud
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const FaqPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Filter FAQs based on search query and active category
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="w-full py-20 bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p 
              className="text-xl text-blue-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Find answers to common questions about AI Task Manager.
            </motion.p>
            
            <motion.div
              className="bg-white/10 p-2 rounded-full flex items-center max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Search className="h-5 w-5 ml-3 text-white" />
              <input
                type="text"
                placeholder="Search for questions..."
                className="bg-transparent border-none flex-1 p-2 text-white placeholder-blue-100 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="mr-3 text-blue-100 hover:text-white"
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="w-full py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Categories Sidebar */}
            <div className="w-full lg:w-1/4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Categories</h2>
                <ul className="space-y-2">
                  <li>
                    <button
                      className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                        activeCategory === 'all' 
                          ? 'bg-primary text-white' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setActiveCategory('all')}
                    >
                      <span className="mr-2">All Questions</span>
                      <span className="ml-auto bg-white/20 text-xs px-2 py-1 rounded-full">
                        {faqs.length}
                      </span>
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                          activeCategory === category.id 
                            ? 'bg-primary text-white' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        <span className="mr-2">{category.icon}</span>
                        <span>{category.name}</span>
                        <span className="ml-auto bg-white/20 text-xs px-2 py-1 rounded-full">
                          {faqs.filter(faq => faq.category === category.id).length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* FAQs */}
            <div className="w-full lg:w-3/4">
              {searchQuery && (
                <div className="mb-6">
                  <p className="text-gray-500">
                    {filteredFaqs.length} {filteredFaqs.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                  </p>
                </div>
              )}
              
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <Search className="h-12 w-12 text-gray-300 mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No results found</h3>
                  <p className="text-gray-500 mb-6">
                    We couldn't find any FAQs matching your search. Try a different keyword or browse by category.
                  </p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}>
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredFaqs.map((faq, index) => (
                    <FaqItem
                      key={index}
                      question={faq.question}
                      answer={faq.answer}
                      category={faq.category}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="w-full py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
              If you couldn't find the answer to your question, our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/contact">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Support
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/docs">
                  View Documentation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

interface FaqItemProps {
  question: string;
  answer: string;
  category: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <button
        className="w-full px-6 py-5 flex items-center justify-between focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-bold text-left">{question}</span>
        {isOpen ? 
          <ChevronUp className="h-5 w-5 text-primary" /> : 
          <ChevronDown className="h-5 w-5 text-primary" />
        }
      </button>
      {isOpen && (
        <div className="px-6 pb-5">
          <hr className="border-gray-200 dark:border-gray-700 mb-4" />
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
            {answer}
          </p>
        </div>
      )}
    </motion.div>
  );
};

// Categories with Icons
const categories = [
  {
    id: 'general',
    name: 'General',
    icon: <Settings className="h-4 w-4" />
  },
  {
    id: 'features',
    name: 'Features',
    icon: <Zap className="h-4 w-4" />
  },
  {
    id: 'account',
    name: 'Account',
    icon: <Users className="h-4 w-4" />
  },
  {
    id: 'billing',
    name: 'Billing',
    icon: <CreditCard className="h-4 w-4" />
  },
  {
    id: 'security',
    name: 'Security',
    icon: <Lock className="h-4 w-4" />
  },
  {
    id: 'mobile',
    name: 'Mobile App',
    icon: <Smartphone className="h-4 w-4" />
  },
  {
    id: 'integrations',
    name: 'Integrations',
    icon: <Cloud className="h-4 w-4" />
  }
];

// FAQ Data
const faqs = [
  {
    question: "What is AI Task Manager?",
    answer: "AI Task Manager is a productivity platform that uses artificial intelligence to help you manage and prioritize tasks, optimize your workflow, and boost your productivity. Our AI analyzes your work patterns, deadlines, and priorities to suggest the most effective task schedule.",
    category: "general"
  },
  {
    question: "How does the AI prioritization work?",
    answer: "Our AI prioritization system uses machine learning algorithms to analyze factors like:\n\n• Task deadlines\n• Task dependencies\n• Your work patterns and productivity cycles\n• Historical data on similar tasks\n• Project importance\n\nBased on these factors, the AI suggests the optimal order for completing your tasks to maximize efficiency and ensure deadlines are met.",
    category: "features"
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security very seriously. All your data is encrypted both in transit and at rest. We use industry-standard security measures and regular security audits to protect your information. We never share your data with third parties without your explicit consent, and you can request data deletion at any time.",
    category: "security"
  },
  {
    question: "Can I use AI Task Manager offline?",
    answer: "Yes, our mobile apps support offline mode. You can view and update your tasks without an internet connection, and all changes will sync once you're back online. However, AI features like smart prioritization require an internet connection to function.",
    category: "mobile"
  },
  {
    question: "How do I create a new task?",
    answer: "Creating a new task is simple:\n\n1. Click the '+' button in the top right corner of your dashboard\n2. Enter the task name, deadline, and any details\n3. Assign to a project (optional)\n4. Set priority or let our AI suggest it\n5. Click 'Save'\n\nYou can also create tasks quickly using keyboard shortcuts or voice commands in our mobile app.",
    category: "features"
  },
  {
    question: "What integrations do you support?",
    answer: "We integrate with many popular productivity and project management tools including:\n\n• Google Calendar\n• Microsoft Outlook\n• Slack\n• Trello\n• Asana\n• Notion\n• GitHub\n• Jira\n\nWe're constantly adding new integrations based on user feedback.",
    category: "integrations"
  },
  {
    question: "How do I reset my password?",
    answer: "To reset your password:\n\n1. Go to the login page\n2. Click 'Forgot Password'\n3. Enter your email address\n4. Check your email for password reset instructions\n5. Follow the link to create a new password\n\nIf you don't receive the email, check your spam folder or contact our support team.",
    category: "account"
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), as well as PayPal. For annual business plans, we can also accommodate wire transfers and purchase orders. Please contact our sales team for more information on enterprise billing options.",
    category: "billing"
  },
  {
    question: "Can I change my subscription plan?",
    answer: "Yes, you can upgrade, downgrade, or cancel your subscription at any time from your account settings. When upgrading, the new features will be immediately available and we'll prorate your billing. When downgrading, the changes will take effect at the end of your current billing cycle.",
    category: "billing"
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, we offer a 14-day free trial of our Pro plan, no credit card required. This gives you full access to all features so you can determine if AI Task Manager is right for you. If you choose not to subscribe after the trial, your account will automatically revert to our Free plan with limited features.",
    category: "billing"
  },
  {
    question: "How do I delete my account?",
    answer: "To delete your account:\n\n1. Go to Account Settings\n2. Scroll to the bottom to find 'Delete Account'\n3. Click and confirm deletion\n\nPlease note that account deletion is permanent and will remove all your data from our servers. If you're experiencing issues, we recommend contacting support before deletion to see if we can help resolve them.",
    category: "account"
  },
  {
    question: "Can I collaborate with my team?",
    answer: "Yes, our Team and Business plans support collaboration features including:\n\n• Shared projects and tasks\n• Task delegation and assignment\n• Team dashboards\n• Progress tracking\n• Permission levels\n• Team analytics\n\nYou can invite team members via email, and they'll receive instructions to join your workspace.",
    category: "features"
  },
  {
    question: "How does the mobile app compare to the web version?",
    answer: "Our mobile app (available for iOS and Android) offers almost all the functionality of the web version, optimized for on-the-go use. You can create and manage tasks, receive AI suggestions, track time, and collaborate with your team. The mobile app also adds features like push notifications, widgets, and voice input for creating tasks.",
    category: "mobile"
  },
  {
    question: "Is my personal information shared with third parties?",
    answer: "We do not sell or rent your personal information to third parties. We may share limited data with trusted service providers who help us operate our services (e.g., cloud hosting providers), but these partners are bound by strict confidentiality agreements. Please see our Privacy Policy for complete details on how we handle your information.",
    category: "security"
  },
  {
    question: "How often do you release updates?",
    answer: "We typically release minor updates and improvements weekly, with major feature releases every 1-2 months. We're constantly evolving based on user feedback and advancing our AI capabilities. You can follow our blog or changelog to stay updated on new features and improvements.",
    category: "general"
  }
];

export default FaqPage; 