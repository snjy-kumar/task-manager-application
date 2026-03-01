import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    X,
    Calendar,
    Tag,
    Loader2,
    SlidersHorizontal,
    Clock,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import searchService, { SearchFilters } from '@/services/searchService';
import { Task } from '@/services/taskService';
import { Link } from 'react-router-dom';

const AdvancedSearchPage: React.FC = () => {
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Task[]>([]);
    const [totalResults, setTotalResults] = useState(0);
    const [showFilters, setShowFilters] = useState(true);

    // Filter states
    const [filters, setFilters] = useState<SearchFilters>({
        query: '',
        status: [],
        priority: [],
        category: [],
        tags: [],
        dueDateFrom: '',
        dueDateTo: '',
        isRecurring: undefined,
        hasDependencies: undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        page: 1,
        limit: 20
    });

    const [suggestions, setSuggestions] = useState<any>({});

    // Load suggestions on mount
    useEffect(() => {
        loadSuggestions();
    }, []);

    const loadSuggestions = async () => {
        try {
            const data = await searchService.getSearchSuggestions();
            setSuggestions(data);
        } catch (error) {
            console.error('Failed to load suggestions:', error);
        }
    };

    const handleSearch = async (page: number = 1) => {
        setLoading(true);
        try {
            const searchFilters = {
                ...filters,
                page,
                status: Array.isArray(filters.status) && filters.status.length > 0 ? filters.status : undefined,
                priority: Array.isArray(filters.priority) && filters.priority.length > 0 ? filters.priority : undefined,
                category: Array.isArray(filters.category) && filters.category.length > 0 ? filters.category : undefined,
            };

            const response = await searchService.advancedSearch(searchFilters);
            setResults(response.tasks);
            setTotalResults(response.total);
        } catch (searchError: any) {
            error(searchError.response?.data?.message || 'Search failed');
            setResults([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickFilter = async (filterName: string) => {
        setLoading(true);
        try {
            const tasks = await searchService.quickFilter(filterName as any);
            setResults(tasks);
            setTotalResults(tasks.length);
            success(`Loaded ${filterName} tasks`);
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to load filter');
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setFilters({
            query: '',
            status: [],
            priority: [],
            category: [],
            tags: [],
            dueDateFrom: '',
            dueDateTo: '',
            isRecurring: undefined,
            hasDependencies: undefined,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            page: 1,
            limit: 20
        });
        setResults([]);
        setTotalResults(0);
    };

    const toggleArrayFilter = (filterName: keyof SearchFilters, value: string) => {
        setFilters(prev => {
            const currentArray = (prev[filterName] as string[]) || [];
            const newArray = currentArray.includes(value)
                ? currentArray.filter(v => v !== value)
                : [...currentArray, value];
            return { ...prev, [filterName]: newArray };
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
            case 'Medium': return 'text-amber-400 bg-amber-500/10';
            case 'Low': return 'text-emerald-400 bg-emerald-500/10';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'text-emerald-400 bg-emerald-500/10';
            case 'In Progress': return 'text-amber-400 bg-amber-500/10';
            case 'Pending': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
            case 'Archived': return 'text-muted-foreground bg-muted';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Advanced Search
                </h1>
                <p className="text-muted-foreground">
                    Search and filter tasks with powerful criteria
                </p>
            </div>

            {/* Quick Filters */}
            <div className="mb-6 flex flex-wrap gap-2">
                {[
                    { name: 'overdue', label: 'Overdue', icon: AlertCircle },
                    { name: 'today', label: 'Due Today', icon: Calendar },
                    { name: 'upcoming', label: 'Upcoming', icon: Clock },
                    { name: 'high-priority', label: 'High Priority', icon: Filter },
                    { name: 'recently-completed', label: 'Recently Completed', icon: CheckCircle2 },
                    { name: 'recurring', label: 'Recurring', icon: Tag }
                ].map(filter => (
                    <Button
                        key={filter.name}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickFilter(filter.name)}
                        className="gap-2"
                    >
                        <filter.icon className="w-4 h-4" />
                        {filter.label}
                    </Button>
                ))}
            </div>

            {/* Search Bar */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-6">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={filters.query}
                            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search tasks by title or description..."
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:border-amber-500"
                        />
                    </div>
                    <Button onClick={() => handleSearch()} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Searching...
                            </>
                        ) : (
                            <>
                                <Search className="w-4 h-4 mr-2" />
                                Search
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        {showFilters ? 'Hide' : 'Show'} Filters
                    </Button>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="mt-6 pt-6 border-t border-border">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-foreground/80 mb-2">
                                    Status
                                </label>
                                <div className="space-y-2">
                                    {['Pending', 'In Progress', 'Completed', 'Archived'].map(status => (
                                        <label key={status} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={(filters.status as string[])?.includes(status)}
                                                onChange={() => toggleArrayFilter('status', status)}
                                                className="rounded border-border text-amber-500 focus:ring-amber-500"
                                            />
                                            <span className="ml-2 text-sm text-foreground/80">{status}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Priority Filter */}
                            <div>
                                <label className="block text-sm font-medium text-foreground/80 mb-2">
                                    Priority
                                </label>
                                <div className="space-y-2">
                                    {['High', 'Medium', 'Low'].map(priority => (
                                        <label key={priority} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={(filters.priority as string[])?.includes(priority)}
                                                onChange={() => toggleArrayFilter('priority', priority)}
                                                className="rounded border-border text-amber-500 focus:ring-amber-500"
                                            />
                                            <span className="ml-2 text-sm text-foreground/80">{priority}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-foreground/80 mb-2">
                                    Category
                                </label>
                                <div className="space-y-2">
                                    {suggestions.categories?.map((category: string) => (
                                        <label key={category} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={(filters.category as string[])?.includes(category)}
                                                onChange={() => toggleArrayFilter('category', category)}
                                                className="rounded border-border text-amber-500 focus:ring-amber-500"
                                            />
                                            <span className="ml-2 text-sm text-foreground/80">{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Due Date Range */}
                            <div>
                                <label className="block text-sm font-medium text-foreground/80 mb-2">
                                    Due Date From
                                </label>
                                <input
                                    type="date"
                                    value={filters.dueDateFrom}
                                    onChange={(e) => setFilters({ ...filters, dueDateFrom: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground/80 mb-2">
                                    Due Date To
                                </label>
                                <input
                                    type="date"
                                    value={filters.dueDateTo}
                                    onChange={(e) => setFilters({ ...filters, dueDateTo: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                                />
                            </div>

                            {/* Sort Options */}
                            <div>
                                <label className="block text-sm font-medium text-foreground/80 mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground"
                                >
                                    <option value="createdAt">Created Date</option>
                                    <option value="updatedAt">Updated Date</option>
                                    <option value="dueDate">Due Date</option>
                                    <option value="priority">Priority</option>
                                    <option value="title">Title</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <Button variant="outline" onClick={clearFilters}>
                                <X className="w-4 h-4 mr-2" />
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Results */}
            {totalResults > 0 && (
                <div className="mb-4 text-sm text-muted-foreground">
                    Found {totalResults} task{totalResults !== 1 ? 's' : ''}
                </div>
            )}

            <div className="space-y-4">
                {results.map(task => (
                    <Link
                        key={task._id}
                        to={`/dashboard/tasks/${task._id}`}
                        className="block bg-card rounded-xl shadow-sm border border-border p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                    {task.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                    {task.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                        {task.status}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                    </span>
                                    {task.category && (
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-foreground/80">
                                            {task.category}
                                        </span>
                                    )}
                                    {task.tags?.map(tag => (
                                        <span key={tag} className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="ml-4 text-right">
                                <div className="text-sm text-muted-foreground">
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {results.length === 0 && !loading && (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-muted-foreground">
                        {filters.query || Object.values(filters).some(v => Array.isArray(v) && v.length > 0)
                            ? 'No tasks found matching your search criteria'
                            : 'Enter search criteria to find tasks'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default AdvancedSearchPage;
