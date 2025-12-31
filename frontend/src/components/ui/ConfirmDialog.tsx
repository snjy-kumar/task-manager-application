import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './button';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    loading?: boolean;
}

const variantStyles = {
    danger: {
        icon: 'text-red-500',
        button: 'bg-red-600 hover:bg-red-700 text-white',
        bg: 'bg-red-100 dark:bg-red-900/30'
    },
    warning: {
        icon: 'text-yellow-500',
        button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        bg: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    info: {
        icon: 'text-blue-500',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        bg: 'bg-blue-100 dark:bg-blue-900/30'
    }
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    loading = false
}) => {
    if (!isOpen) return null;

    const styles = variantStyles[variant];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Icon */}
                    <div className={`mx-auto flex items-center justify-center w-12 h-12 rounded-full ${styles.bg}`}>
                        <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
                    </div>

                    {/* Content */}
                    <div className="mt-4 text-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            {message}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex gap-3 justify-end">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            {cancelText}
                        </Button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className={`px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 ${styles.button}`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Processing...
                                </span>
                            ) : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
