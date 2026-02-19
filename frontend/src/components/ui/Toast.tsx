import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// Toast types
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
    showToast: (message: string | { text: string; color: string }, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Toast icon mapping
const ToastIcon = ({ type }: { type: ToastType }) => {
    const iconClass = "w-5 h-5";
    switch (type) {
        case 'success':
            return <CheckCircle className={`${iconClass} text-green-500`} />;
        case 'error':
            return <AlertCircle className={`${iconClass} text-red-500`} />;
        case 'warning':
            return <AlertTriangle className={`${iconClass} text-gray-500`} />;
        case 'info':
            return <Info className={`${iconClass} text-gray-500`} />;
    }
};

// Toast styles mapping
const toastStyles: Record<ToastType, string> = {
    success: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    error: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    warning: 'bg-gray-100 border-gray-200 dark:bg-gray-800/20 dark:border-gray-700',
    info: 'bg-gray-100 border-gray-200 dark:bg-gray-800/20 dark:border-gray-700',
};

// Individual Toast Component
const ToastItem: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onRemove();
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
    }, [toast.duration, onRemove]);

    return (
        <div
            className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg
        transform transition-all duration-300 ease-out
        animate-slide-in
        ${toastStyles[toast.type]}
      `}
            role="alert"
        >
            <ToastIcon type={toast.type} />
            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100">{toast.title}</p>
                {toast.message && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{toast.message}</p>
                )}
            </div>
            <button
                onClick={onRemove}
                className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300"
            >
                <X className="w-4 h-4 text-gray-500" />
            </button>
        </div>
    );
};

// Toast Container Component
const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: string) => void }> = ({
    toasts,
    removeToast,
}) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastItem toast={toast} onRemove={() => removeToast(toast.id)} />
                </div>
            ))}
        </div>
    );
};

// Toast Provider
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = generateId();
        setToasts((prev) => [...prev, { ...toast, id }].slice(-5)); // Max 5 toasts
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback((title: string, message?: string) => {
        addToast({ type: 'success', title, message });
    }, [addToast]);

    const error = useCallback((title: string, message?: string) => {
        addToast({ type: 'error', title, message, duration: 7000 }); // Longer for errors
    }, [addToast]);

    const warning = useCallback((title: string, message?: string) => {
        addToast({ type: 'warning', title, message });
    }, [addToast]);

    const info = useCallback((title: string, message?: string) => {
        addToast({ type: 'info', title, message });
    }, [addToast]);

    const showToast = useCallback((message: string | { text: string; color: string }, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
        const title = typeof message === 'string' ? message : message.text;
        addToast({ type, title });
    }, [addToast]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info, showToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

// Hook to use toast
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default ToastProvider;
