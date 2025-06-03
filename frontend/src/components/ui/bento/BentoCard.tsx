import React from 'react';
import { cn } from '@/lib/utils';

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  gradient?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  hasHover?: boolean;
  hoverEffect?: 'scale' | 'glow' | 'border' | 'none';
  children?: React.ReactNode;
}

const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  ({
    title,
    subtitle,
    icon,
    className,
    children,
    size = 'md',
    gradient = false,
    gradientFrom,
    gradientTo,
    hasHover = true,
    hoverEffect = 'scale',
    ...props
  }, ref) => {
    const sizeClasses = {
      sm: 'col-span-1 row-span-1',
      md: 'col-span-1 md:col-span-2 row-span-1',
      lg: 'col-span-1 md:col-span-2 row-span-2',
      full: 'col-span-1 md:col-span-4 row-span-1',
    };

    const hoverClasses = hasHover 
      ? hoverEffect === 'scale' 
        ? 'transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl' 
        : hoverEffect === 'glow' 
          ? 'transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/20' 
          : hoverEffect === 'border' 
            ? 'transition-colors duration-300 hover:border-primary' 
            : ''
      : '';

    const gradientClasses = gradient 
      ? `bg-gradient-to-br ${gradientFrom || 'from-blue-600/20'} ${gradientTo || 'to-purple-600/20'}`
      : '';
    
    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-md p-6',
          sizeClasses[size],
          hoverClasses,
          gradientClasses,
          className
        )}
        {...props}
      >
        {(title || icon) && (
          <div className="flex items-center justify-between mb-4">
            {title && (
              <div>
                <h3 className="text-lg font-medium">{title}</h3>
                {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
              </div>
            )}
            {icon && (
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                {icon}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    );
  }
);

BentoCard.displayName = 'BentoCard';

export default BentoCard; 