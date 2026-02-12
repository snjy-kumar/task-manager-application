import React from 'react';

interface LoadingSkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'card';
    width?: string | number;
    height?: string | number;
    count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
    className = '',
    variant = 'text',
    width,
    height,
    count = 1
}) => {
    const baseClass = 'animate-pulse bg-gray-200 dark:bg-gray-800';

    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
        card: 'rounded-xl'
    };

    const style: React.CSSProperties = {
        width: width || (variant === 'circular' ? '40px' : '100%'),
        height: height || (variant === 'circular' ? '40px' : variant === 'text' ? '16px' : '100px')
    };

    const items = Array.from({ length: count }, (_, i) => i);

    return (
        <>
            {items.map((i) => (
                <div
                    key={i}
                    className={`${baseClass} ${variantClasses[variant]} ${className}`}
                    style={style}
                />
            ))}
        </>
    );
};

// Pre-built skeleton components
export const TaskCardSkeleton: React.FC = () => (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3">
        <div className="flex justify-between items-start">
            <LoadingSkeleton variant="text" width="60%" height={20} />
            <LoadingSkeleton variant="rectangular" width={60} height={24} />
        </div>
        <LoadingSkeleton variant="text" count={2} className="space-y-2" />
        <div className="flex justify-between items-center pt-2">
            <LoadingSkeleton variant="text" width={100} />
            <LoadingSkeleton variant="circular" width={32} height={32} />
        </div>
    </div>
);

export const TaskListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
    <div className="space-y-4">
        {Array.from({ length: count }, (_, i) => (
            <TaskCardSkeleton key={i} />
        ))}
    </div>
);

export const DashboardStatsSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3">
                <LoadingSkeleton variant="text" width="40%" height={14} />
                <LoadingSkeleton variant="text" width="60%" height={32} />
                <LoadingSkeleton variant="text" width="80%" height={12} />
            </div>
        ))}
    </div>
);

export const ProfileSkeleton: React.FC = () => (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <LoadingSkeleton variant="circular" width={80} height={80} />
            <div className="space-y-2 flex-1">
                <LoadingSkeleton variant="text" width="40%" height={24} />
                <LoadingSkeleton variant="text" width="60%" height={16} />
            </div>
        </div>
        <div className="space-y-4">
            <LoadingSkeleton variant="rectangular" height={50} />
            <LoadingSkeleton variant="rectangular" height={50} />
            <LoadingSkeleton variant="rectangular" height={50} />
        </div>
    </div>
);

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
    rows = 5,
    cols = 4
}) => (
    <div className="space-y-2">
        {/* Header */}
        <div className="flex gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
            {Array.from({ length: cols }, (_, i) => (
                <LoadingSkeleton key={i} variant="text" height={16} />
            ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="flex gap-4 p-4">
                {Array.from({ length: cols }, (_, j) => (
                    <LoadingSkeleton key={j} variant="text" height={14} />
                ))}
            </div>
        ))}
    </div>
);

export default LoadingSkeleton;
