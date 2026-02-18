import React, { useState } from 'react';
import {
    Upload,
    Download,
    FileJson,
    FileSpreadsheet,
    CheckCircle,
    AlertCircle,
    Loader2,
    FileText,
    Filter,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import importExportService from '@/services/importExportService';

const ImportExportPage: React.FC = () => {
    const { success, error: showError, info } = useToast();
    const [loading, setLoading] = useState(false);
    const [importMode, setImportMode] = useState<'add' | 'replace'>('add');
    const [importResults, setImportResults] = useState<any>(null);

    // Export filters
    const [exportFilters, setExportFilters] = useState({
        status: '',
        priority: '',
        category: '',
        dateFrom: '',
        dateTo: '',
        includeSubtasks: true
    });

    const handleExportCSV = async () => {
        setLoading(true);
        try {
            const filters = Object.fromEntries(
                Object.entries(exportFilters).filter(([_, v]) => v !== '' && v !== false)
            );

            const blob = await importExportService.exportToCSV(filters);
            importExportService.downloadFile(blob, `tasks-export-${Date.now()}.csv`);
            success('Tasks exported to CSV successfully');
        } catch (error: any) {
            showError(error.response?.data?.message || 'Export failed');
        } finally {
            setLoading(false);
        }
    };

    const handleExportJSON = async () => {
        setLoading(true);
        try {
            const blob = await importExportService.exportToJSON(exportFilters);
            importExportService.downloadFile(blob, `tasks-export-${Date.now()}.json`);
            success('Tasks exported to JSON successfully');
        } catch (error: any) {
            showError(error.response?.data?.message || 'Export failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const blob = await importExportService.getImportTemplate();
            importExportService.downloadFile(blob, 'tasks-import-template.json');
            success('Template downloaded');
        } catch (error: any) {
            showError('Failed to download template');
        }
    };

    const handleImportJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setImportResults(null);

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            // Validate structure
            const tasks = data.tasks || data;
            if (!Array.isArray(tasks)) {
                throw new Error('Invalid file format. Expected an array of tasks or an object with a tasks property.');
            }

            const result = await importExportService.importFromJSON(tasks, importMode);
            setImportResults(result);

            if (result.failed === 0) {
                success(`Successfully imported ${result.imported} task${result.imported !== 1 ? 's' : ''}`);
            } else {
                info(`Imported ${result.imported} tasks with ${result.failed} errors`);
            }
        } catch (error: any) {
            showError(error.message || 'Import failed');
        } finally {
            setLoading(false);
            // Reset file input
            event.target.value = '';
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Import & Export Tasks
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Import tasks from files or export your tasks to backup or share
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Export Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Export Tasks
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Download your tasks as CSV or JSON
                            </p>
                        </div>
                    </div>

                    {/* Export Filters */}
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Filter className="w-4 h-4 inline mr-1" />
                                Filter by Status
                            </label>
                            <select
                                value={exportFilters.status}
                                onChange={(e) => setExportFilters({ ...exportFilters, status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Archived">Archived</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Filter by Priority
                            </label>
                            <select
                                value={exportFilters.priority}
                                onChange={(e) => setExportFilters({ ...exportFilters, priority: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            >
                                <option value="">All Priorities</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Filter by Category
                            </label>
                            <select
                                value={exportFilters.category}
                                onChange={(e) => setExportFilters({ ...exportFilters, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            >
                                <option value="">All Categories</option>
                                <option value="Personal">Personal</option>
                                <option value="Work">Work</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Health">Health</option>
                                <option value="Finance">Finance</option>
                                <option value="Learning">Learning</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Date From
                                </label>
                                <input
                                    type="date"
                                    value={exportFilters.dateFrom}
                                    onChange={(e) => setExportFilters({ ...exportFilters, dateFrom: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Date To
                                </label>
                                <input
                                    type="date"
                                    value={exportFilters.dateTo}
                                    onChange={(e) => setExportFilters({ ...exportFilters, dateTo: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={exportFilters.includeSubtasks}
                                onChange={(e) => setExportFilters({ ...exportFilters, includeSubtasks: e.target.checked })}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Include subtasks in JSON export</span>
                        </label>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={handleExportCSV}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <FileSpreadsheet className="w-4 h-4 mr-2" />
                            )}
                            Export as CSV
                        </Button>
                        <Button
                            onClick={handleExportJSON}
                            disabled={loading}
                            variant="outline"
                            className="w-full"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <FileJson className="w-4 h-4 mr-2" />
                            )}
                            Export as JSON
                        </Button>
                    </div>
                </div>

                {/* Import Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <Upload className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Import Tasks
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Upload tasks from JSON file
                            </p>
                        </div>
                    </div>

                    {/* Import Mode */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Import Mode
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-start p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <input
                                    type="radio"
                                    value="add"
                                    checked={importMode === 'add'}
                                    onChange={(e) => setImportMode(e.target.value as any)}
                                    className="mt-0.5 mr-3"
                                />
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-white">Add to Existing</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Import tasks without affecting existing tasks
                                    </div>
                                </div>
                            </label>
                            <label className="flex items-start p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <input
                                    type="radio"
                                    value="replace"
                                    checked={importMode === 'replace'}
                                    onChange={(e) => setImportMode(e.target.value as any)}
                                    className="mt-0.5 mr-3"
                                />
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-white">Replace All</div>
                                    <div className="text-sm text-red-600 dark:text-red-400">
                                        ⚠️ This will delete all existing tasks
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="mb-6">
                        <label className="block">
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer">
                                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Click to upload JSON file
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                    or drag and drop
                                </p>
                            </div>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImportJSON}
                                className="hidden"
                                disabled={loading}
                            />
                        </label>
                    </div>

                    <Button
                        onClick={handleDownloadTemplate}
                        variant="outline"
                        className="w-full"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Download Template
                    </Button>

                    {/* Import Results */}
                    {importResults && (
                        <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-start gap-3 mb-3">
                                {importResults.failed === 0 ? (
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                                        Import Results
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Successfully imported: {importResults.imported}
                                    </p>
                                    {importResults.failed > 0 && (
                                        <p className="text-sm text-red-600 dark:text-red-400">
                                            Failed: {importResults.failed}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {importResults.errors && importResults.errors.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        Errors:
                                    </h4>
                                    <div className="space-y-1 max-h-40 overflow-y-auto">
                                        {importResults.errors.map((error: any, index: number) => (
                                            <div key={index} className="text-xs text-red-600 dark:text-red-400">
                                                Row {error.index + 1}: {error.error}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Info Section */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    💡 Import/Export Tips
                </h3>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                    <li>• CSV exports are best for viewing in spreadsheet applications</li>
                    <li>• JSON exports preserve all task data including subtasks and metadata</li>
                    <li>• Use the template to ensure your import file has the correct format</li>
                    <li>• "Replace All" mode will permanently delete existing tasks - use with caution</li>
                    <li>• Import validation will show detailed errors for any problematic tasks</li>
                </ul>
            </div>
        </div>
    );
};

export default ImportExportPage;
