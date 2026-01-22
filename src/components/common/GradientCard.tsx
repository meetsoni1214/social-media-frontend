import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const gradientCardVariants = cva('rounded-xl bg-white shadow transition-all', {
  variants: {
    variant: {
      default: 'border border-gray-200',
      highlighted:
        'border-2 border-transparent bg-gradient-to-r from-[var(--gradient-orange)] via-[var(--gradient-pink)] to-[var(--gradient-purple)] p-[2px]',
      selected:
        'border-2 border-[var(--gradient-pink)] shadow-lg ring-2 ring-[var(--gradient-pink)]/20',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface GradientCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gradientCardVariants> {}

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  ({ className, variant, children, ...props }, ref) => {
    if (variant === 'highlighted') {
      return (
        <div
          ref={ref}
          className={cn(gradientCardVariants({ variant, className }))}
          {...props}
        >
          <div className="bg-white rounded-[10px] h-full w-full p-6">
            {children}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(gradientCardVariants({ variant, className }))}
        {...props}
      >
        <div className="p-6">{children}</div>
      </div>
    );
  }
);
GradientCard.displayName = 'GradientCard';

const GradientCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { withGradient?: boolean }
>(({ className, withGradient, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col space-y-1.5 pb-4',
      withGradient &&
        'bg-gradient-to-r from-[var(--gradient-orange)] via-[var(--gradient-pink)] to-[var(--gradient-purple)] -mx-6 -mt-6 mb-4 px-6 py-4 rounded-t-xl text-white',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
GradientCardHeader.displayName = 'GradientCardHeader';

const GradientCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
GradientCardTitle.displayName = 'GradientCardTitle';

const GradientCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
GradientCardDescription.displayName = 'GradientCardDescription';

export {
  GradientCard,
  GradientCardHeader,
  GradientCardTitle,
  GradientCardDescription,
  gradientCardVariants,
};
