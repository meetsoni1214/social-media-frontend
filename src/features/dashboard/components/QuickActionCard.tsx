import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface QuickActionCardProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  description: string;
  icon?: LucideIcon;
}

const QuickActionCard = React.forwardRef<
  HTMLButtonElement,
  QuickActionCardProps
>(({ title, description, icon: Icon, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'p-4 text-left rounded-lg border-2 border-gray-200',
        'hover:border-[var(--gradient-pink)] hover:shadow-md',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gradient-pink)] focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'group',
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <Icon className="w-5 h-5 text-[var(--gradient-pink)] flex-shrink-0 mt-0.5 transition-transform group-hover:scale-110" />
        )}
        <div className="flex-1">
          <h4 className="font-medium mb-1 text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  );
});

QuickActionCard.displayName = 'QuickActionCard';

export { QuickActionCard };
