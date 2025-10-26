import * as React from 'react';
import { Circle } from 'lucide-react';

import { cn } from '@/lib/utils';

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('grid gap-2', className)} {...props}>
        {React.Children.map(children, child => {
          if (React.isValidElement<RadioGroupItemProps>(child)) {
            return React.cloneElement(child, {
              checked: child.props.value === value,
              onClick: () => onValueChange?.(child.props.value),
            });
          }
          return child;
        })}
      </div>
    );
  }
);
RadioGroup.displayName = 'RadioGroup';

interface RadioGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  checked?: boolean;
}

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ className, checked, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={checked}
        className={cn(
          'aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        {checked && (
          <Circle className="h-2.5 w-2.5 fill-primary text-primary m-auto" />
        )}
      </button>
    );
  }
);
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
