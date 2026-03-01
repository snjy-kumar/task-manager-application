import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Trash, Edit, Play, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import templateService, { TaskTemplate } from '@/services/templateService';

const TemplatesPage: React.FC = () => {
    const [templates, setTemplates] = useState<TaskTemplate[]>([]);
    const [popularTemplates, setPopularTemplates] = useState<TaskTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'my' | 'popular'>('my');
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const [allTemplates, popular] = await Promise.all([
                templateService.getTemplates(),
                templateService.getPopularTemplates()
            ]);

            // Separate user's templates and public templates
            setTemplates(allTemplates);
            setPopularTemplates(popular);
        } catch (error: any) {
            console.error('Failed to fetch templates:', error);
            toast.error(error.response?.data?.message || 'Failed to load templates');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFromTemplate = async (templateId: string) => {
        try {
            const task = await templateService.createTaskFromTemplate(templateId, {
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
            });
            toast.success('Task created from template!');
            navigate(`/dashboard/tasks/${task._id}`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create task');
        }
    };

    const handleDelete = async (templateId: string) => {
        if (!window.confirm('Are you sure you want to delete this template?')) return;

        try {
            await templateService.deleteTemplate(templateId);
            setTemplates(templates.filter(t => t._id !== templateId));
            toast.success('Template deleted successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete template');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const displayTemplates = activeTab === 'my' ? templates : popularTemplates;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Task Templates</h1>
                    <p className="text-muted-foreground">
                        Create reusable templates for common tasks
                    </p>
                </div>
                <Button onClick={() => navigate('/dashboard/templates/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                </Button>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'my'
                                ? 'border-amber-500 text-amber-500'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        My Templates ({templates.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('popular')}
                        className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'popular'
                                ? 'border-amber-500 text-amber-500'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Popular Templates ({popularTemplates.length})
                    </button>
                </div>
            </div>

            {/* Templates Grid */}
            {displayTemplates.length === 0 ? (
                <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No templates found</h3>
                    <p className="text-muted-foreground mb-4">
                        {activeTab === 'my'
                            ? 'Create your first template to get started'
                            : 'No popular templates available yet'}
                    </p>
                    {activeTab === 'my' && (
                        <Button onClick={() => navigate('/dashboard/templates/new')}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Template
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayTemplates.map((template) => (
                        <div
                            key={template._id}
                            className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-300"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold mb-1">{template.name}</h3>
                                        {template.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {template.description}
                                            </p>
                                        )}
                                    </div>
                                    {template.isPublic && (
                                        <span className="px-2 py-1 text-xs rounded-full bg-amber-500/10 text-amber-400 font-medium">
                                            Public
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Package className="h-4 w-4" />
                                        <span className="font-medium">{template.template.category}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                            {template.template.estimatedDuration
                                                ? `~${template.template.estimatedDuration}h estimated`
                                                : 'No estimate'}
                                        </span>
                                    </div>
                                    {template.template.subtasks && template.template.subtasks.length > 0 && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <TrendingUp className="h-4 w-4" />
                                            <span>{template.template.subtasks.length} subtasks</span>
                                        </div>
                                    )}
                                </div>

                                {/* Tags */}
                                {template.template.tags && template.template.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {template.template.tags.slice(0, 3).map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 text-xs rounded-full bg-muted text-foreground/80"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                        {template.template.tags.length > 3 && (
                                            <span className="px-2 py-1 text-xs rounded-full bg-muted text-foreground/80">
                                                +{template.template.tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                                    <span>Used {template.useCount} times</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleCreateFromTemplate(template._id)}
                                        className="flex-1"
                                        size="sm"
                                    >
                                        <Play className="h-4 w-4 mr-1" />
                                        Use Template
                                    </Button>
                                    {activeTab === 'my' && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/dashboard/templates/${template._id}/edit`)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(template._id)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TemplatesPage;
