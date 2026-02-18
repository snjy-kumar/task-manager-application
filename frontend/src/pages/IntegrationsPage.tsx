import React, { useState } from 'react';
import {
    Plug,
    Check,
    ExternalLink,
    Settings,
    Calendar,
    Mail,
    MessageSquare,
    Trello,
    Github,
    Webhook,
    Code,
    Cloud,
    Zap,
    AlertCircle,
    Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';

interface Integration {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    category: 'productivity' | 'communication' | 'development' | 'automation';
    status: 'connected' | 'available' | 'coming-soon';
    features: string[];
    setupUrl?: string;
    connectedSince?: string;
}

const IntegrationsPage: React.FC = () => {
    const { info, success } = useToast();
    const [filter, setFilter] = useState<string>('all');
    const [integrations] = useState<Integration[]>([
        {
            id: 'google-calendar',
            name: 'Google Calendar',
            description: 'Sync your tasks with Google Calendar and get reminders',
            icon: <Calendar className="w-8 h-8 text-blue-600" />,
            category: 'productivity',
            status: 'available',
            features: ['Two-way sync', 'Event reminders', 'Task deadlines', 'Calendar views'],
            setupUrl: '#'
        },
        {
            id: 'slack',
            name: 'Slack',
            description: 'Get task notifications and updates in your Slack workspace',
            icon: <MessageSquare className="w-8 h-8 text-purple-600" />,
            category: 'communication',
            status: 'available',
            features: ['Real-time notifications', 'Task creation', 'Team mentions', 'Status updates'],
            setupUrl: '#'
        },
        {
            id: 'email',
            name: 'Email Integration',
            description: 'Send and receive task updates via email',
            icon: <Mail className="w-8 h-8 text-red-600" />,
            category: 'communication',
            status: 'connected',
            connectedSince: '2024-01-15',
            features: ['Email notifications', 'Task creation via email', 'Weekly digests', 'Custom templates']
        },
        {
            id: 'github',
            name: 'GitHub',
            description: 'Connect your repositories and track issues as tasks',
            icon: <Github className="w-8 h-8 text-gray-900 dark:text-white" />,
            category: 'development',
            status: 'available',
            features: ['Issue tracking', 'PR notifications', 'Commit linking', 'Branch management'],
            setupUrl: '#'
        },
        {
            id: 'trello',
            name: 'Trello',
            description: 'Import boards and cards from Trello',
            icon: <Trello className="w-8 h-8 text-blue-500" />,
            category: 'productivity',
            status: 'coming-soon',
            features: ['Board import', 'Card sync', 'Label mapping', 'Member assignment']
        },
        {
            id: 'zapier',
            name: 'Zapier',
            description: 'Automate workflows with 3000+ apps',
            icon: <Zap className="w-8 h-8 text-orange-500" />,
            category: 'automation',
            status: 'available',
            features: ['Custom workflows', 'Multi-step zaps', 'Conditional logic', 'Error handling'],
            setupUrl: '#'
        },
        {
            id: 'webhooks',
            name: 'Webhooks',
            description: 'Send real-time data to your custom endpoints',
            icon: <Webhook className="w-8 h-8 text-green-600" />,
            category: 'development',
            status: 'available',
            features: ['Custom endpoints', 'Event triggers', 'Payload customization', 'Retry logic'],
            setupUrl: '/dashboard/workspace-settings'
        },
        {
            id: 'api',
            name: 'REST API',
            description: 'Build custom integrations with our API',
            icon: <Code className="w-8 h-8 text-indigo-600" />,
            category: 'development',
            status: 'available',
            features: ['Full API access', 'Authentication', 'Rate limiting', 'Documentation'],
            setupUrl: '#'
        },
        {
            id: 'microsoft-teams',
            name: 'Microsoft Teams',
            description: 'Collaborate with your team in Microsoft Teams',
            icon: <MessageSquare className="w-8 h-8 text-blue-700" />,
            category: 'communication',
            status: 'coming-soon',
            features: ['Team notifications', 'Task bot', 'Tabs integration', 'Activity feed']
        },
        {
            id: 'google-drive',
            name: 'Google Drive',
            description: 'Attach files from Google Drive to your tasks',
            icon: <Cloud className="w-8 h-8 text-yellow-600" />,
            category: 'productivity',
            status: 'coming-soon',
            features: ['File attachments', 'Share links', 'Permission management', 'Version control']
        }
    ]);

    const handleConnect = (integration: Integration) => {
        if (integration.status === 'coming-soon') {
            info(`${integration.name} is coming soon!`);
            return;
        }

        if (integration.status === 'connected') {
            info(`${integration.name} is already connected`);
            return;
        }

        // Simulate connection
        info(`Connecting to ${integration.name}...`);
        // In a real app, this would redirect to OAuth or show a setup modal
    };

    const handleDisconnect = (integration: Integration) => {
        if (!confirm(`Are you sure you want to disconnect ${integration.name}?`)) return;
        success(`${integration.name} disconnected`);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'connected':
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs font-medium">
                        <Check className="w-3 h-3" />
                        Connected
                    </span>
                );
            case 'available':
                return (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-xs font-medium">
                        Available
                    </span>
                );
            case 'coming-soon':
                return (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                        Coming Soon
                    </span>
                );
            default:
                return null;
        }
    };

    const categories = [
        { value: 'all', label: 'All Integrations', count: integrations.length },
        { value: 'productivity', label: 'Productivity', count: integrations.filter(i => i.category === 'productivity').length },
        { value: 'communication', label: 'Communication', count: integrations.filter(i => i.category === 'communication').length },
        { value: 'development', label: 'Development', count: integrations.filter(i => i.category === 'development').length },
        { value: 'automation', label: 'Automation', count: integrations.filter(i => i.category === 'automation').length }
    ];

    const filteredIntegrations = filter === 'all'
        ? integrations
        : integrations.filter(i => i.category === filter);

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Integrations
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Connect your favorite tools and automate your workflow
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Connected</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {integrations.filter(i => i.status === 'connected').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <Plug className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {integrations.filter(i => i.status === 'available').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Coming Soon</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {integrations.filter(i => i.status === 'coming-soon').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(cat => (
                    <button
                        key={cat.value}
                        onClick={() => setFilter(cat.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === cat.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        {cat.label} ({cat.count})
                    </button>
                ))}
            </div>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-auto pb-6">
                {filteredIntegrations.map(integration => (
                    <div
                        key={integration.id}
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                                {integration.icon}
                            </div>
                            {getStatusBadge(integration.status)}
                        </div>

                        {/* Content */}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {integration.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {integration.description}
                        </p>

                        {/* Features */}
                        <div className="mb-4">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Features:</p>
                            <ul className="space-y-1">
                                {integration.features.slice(0, 3).map((feature, index) => (
                                    <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <Check className="w-3 h-3 text-green-600" />
                                        {feature}
                                    </li>
                                ))}
                                {integration.features.length > 3 && (
                                    <li className="text-xs text-gray-500 dark:text-gray-500">
                                        +{integration.features.length - 3} more
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Connected Since */}
                        {integration.connectedSince && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                Connected since {new Date(integration.connectedSince).toLocaleDateString()}
                            </p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                            {integration.status === 'connected' ? (
                                <>
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <Settings className="w-4 h-4 mr-1" />
                                        Configure
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDisconnect(integration)}
                                        className="text-red-600 hover:bg-red-50"
                                    >
                                        Disconnect
                                    </Button>
                                </>
                            ) : integration.status === 'available' ? (
                                <>
                                    <Button
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => handleConnect(integration)}
                                    >
                                        <LinkIcon className="w-4 h-4 mr-1" />
                                        Connect
                                    </Button>
                                    {integration.setupUrl && (
                                        <Button variant="outline" size="sm">
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <Button size="sm" className="flex-1" disabled>
                                    Coming Soon
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Info Banner */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex gap-4">
                    <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                            Need a custom integration?
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                            Use our REST API or Webhooks to build custom integrations. Check out our{' '}
                            <a href="#" className="underline font-medium">API documentation</a> to get started.
                        </p>
                        <div className="flex gap-3">
                            <Button variant="outline" size="sm">
                                <Code className="w-4 h-4 mr-2" />
                                View API Docs
                            </Button>
                            <Button variant="outline" size="sm">
                                <Webhook className="w-4 h-4 mr-2" />
                                Setup Webhooks
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntegrationsPage;
