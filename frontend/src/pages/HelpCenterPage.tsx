import React, { useState } from 'react';
import {
    HelpCircle,
    Book,
    MessageCircle,
    Video,
    FileText,
    Mail,
    Search,
    ChevronRight,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Info,
    Star,
    ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const HelpCenterPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = [
        {
            id: 'getting-started',
            title: 'Getting Started',
            icon: Book,
            description: 'Learn the basics of using Naumin',
            articles: [
                { title: 'Creating your first task', views: 1250 },
                { title: 'Understanding task priorities', views: 980 },
                { title: 'Setting up your workspace', views: 856 },
                { title: 'Inviting team members', views: 743 }
            ]
        },
        {
            id: 'tasks',
            title: 'Tasks & Projects',
            icon: CheckCircle2,
            description: 'Everything about managing tasks',
            articles: [
                { title: 'Using subtasks effectively', views: 1420 },
                { title: 'Task dependencies explained', views: 892 },
                { title: 'Recurring tasks guide', views: 765 },
                { title: 'Using task templates', views: 654 }
            ]
        },
        {
            id: 'collaboration',
            title: 'Collaboration',
            icon: MessageCircle,
            description: 'Work together with your team',
            articles: [
                { title: 'Commenting on tasks', views: 1123 },
                { title: 'Assigning tasks to team members', views: 998 },
                { title: 'Using @mentions', views: 876 },
                { title: 'File sharing best practices', views: 654 }
            ]
        },
        {
            id: 'organization',
            title: 'Organization',
            icon: FileText,
            description: 'Organize your work efficiently',
            articles: [
                { title: 'Using tags and categories', views: 1345 },
                { title: 'Creating custom views', views: 987 },
                { title: 'Filtering and sorting tasks', views: 876 },
                { title: 'Advanced search techniques', views: 765 }
            ]
        },
        {
            id: 'integrations',
            title: 'Integrations',
            icon: Star,
            description: 'Connect with other tools',
            articles: [
                { title: 'Calendar integration', views: 1234 },
                { title: 'Email notifications setup', views: 1098 },
                { title: 'API documentation', views: 876 },
                { title: 'Webhook configuration', views: 543 }
            ]
        },
        {
            id: 'troubleshooting',
            title: 'Troubleshooting',
            icon: AlertCircle,
            description: 'Common issues and solutions',
            articles: [
                { title: 'Login problems', views: 2345 },
                { title: 'Notification not working', views: 1876 },
                { title: 'Data not syncing', views: 1654 },
                { title: 'Performance issues', views: 1432 }
            ]
        }
    ];

    const popularArticles = [
        { title: 'How to create and manage tasks', category: 'Tasks & Projects', views: 5234, helpful: 95 },
        { title: 'Understanding task dependencies', category: 'Tasks & Projects', views: 4123, helpful: 92 },
        { title: 'Setting up email notifications', category: 'Integrations', views: 3876, helpful: 88 },
        { title: 'Using the Gantt chart view', category: 'Organization', views: 3654, helpful: 90 },
        { title: 'Collaboration best practices', category: 'Collaboration', views: 3432, helpful: 94 }
    ];

    const faqs = [
        {
            question: 'How do I change my password?',
            answer: 'Go to Settings > Profile > Security and click "Change Password". Enter your current password and your new password twice to confirm.'
        },
        {
            question: 'Can I export my tasks?',
            answer: 'Yes! Go to Dashboard > Import/Export and select your export format (CSV or JSON). You can filter which tasks to export.'
        },
        {
            question: 'How do I invite team members?',
            answer: 'Navigate to Workspace Settings > Team Management and click "Invite Member". Enter their email address and assign a role.'
        },
        {
            question: 'What are task dependencies?',
            answer: 'Task dependencies allow you to create relationships between tasks, ensuring certain tasks must be completed before others can start.'
        },
        {
            question: 'How do I set up reminders?',
            answer: 'Open any task, go to the Reminders section, and click "Add Reminder". Choose the time and notification method (email, in-app, or both).'
        }
    ];

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-8 h-8 text-amber-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    How can we help you?
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Search our knowledge base or browse by category
                </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto w-full mb-8">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for help articles..."
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <a
                    href="#"
                    className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-amber-500/500 dark:hover:border-amber-500/500 transition-colors"
                >
                    <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                        <Video className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Video Tutorials</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Watch step-by-step guides</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 ml-auto" />
                </a>

                <a
                    href="#"
                    className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-amber-500/500 dark:hover:border-amber-500/500 transition-colors"
                >
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Live Chat Support</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Chat with our team</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                </a>

                <a
                    href="mailto:support@taskmanager.com"
                    className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-amber-500/500 dark:hover:border-amber-500/500 transition-colors"
                >
                    <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Email Support</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Get help via email</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 ml-auto" />
                </a>
            </div>

            {/* Categories */}
            {!selectedCategory && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Browse by Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map(category => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className="text-left p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-amber-500/500 dark:hover:border-amber-500/500 hover:shadow-md transition-all"
                                >
                                    <Icon className="w-8 h-8 text-amber-500 mb-3" />
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        {category.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        {category.description}
                                    </p>
                                    <p className="text-xs text-amber-500 flex items-center gap-1">
                                        {category.articles.length} articles
                                        <ChevronRight className="w-4 h-4" />
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Selected Category Articles */}
            {selectedCategory && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {categories.find(c => c.id === selectedCategory)?.title}
                        </h2>
                        <Button variant="outline" size="sm" onClick={() => setSelectedCategory(null)}>
                            Back to Categories
                        </Button>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        {categories
                            .find(c => c.id === selectedCategory)
                            ?.articles.map((article, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-900 dark:text-white">{article.title}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {article.views} views
                                        </span>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </a>
                            ))}
                    </div>
                </div>
            )}

            {/* Popular Articles */}
            {!selectedCategory && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Popular Articles</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        {popularArticles.map((article, index) => (
                            <a
                                key={index}
                                href="#"
                                className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-medium text-gray-900 dark:text-white">{article.title}</h3>
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                        <span>{article.category}</span>
                                        <span>•</span>
                                        <span>{article.views.toLocaleString()} views</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <ThumbsUp className="w-3.5 h-3.5" />
                                            {article.helpful}% helpful
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* FAQs */}
            {!selectedCategory && (
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
                            >
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-start gap-2">
                                    <Info className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 ml-7">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Contact Section */}
            <div className="mt-8 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-2">Still need help?</h3>
                <p className="mb-4 opacity-90">Our support team is here to assist you</p>
                <div className="flex gap-3 justify-center">
                    <Button variant="outline" className="bg-white text-amber-500 hover:bg-gray-100 border-0">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Start Live Chat
                    </Button>
                    <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Support
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HelpCenterPage;
