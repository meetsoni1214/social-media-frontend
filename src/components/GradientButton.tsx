import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gradientButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-[var(--gradient-orange)] via-[var(--gradient-pink)] to-[var(--gradient-purple)] text-white shadow-lg hover:shadow-xl hover:scale-[1.02]",
        secondary:
          "border-2 border-transparent bg-white text-gray-900 hover:border-[var(--gradient-pink)] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-[var(--gradient-orange)] before:via-[var(--gradient-pink)] before:to-[var(--gradient-purple)] before:opacity-0 hover:before:opacity-10 before:transition-opacity",
        ghost:
          "text-gray-700 hover:bg-gradient-to-r hover:from-[var(--gradient-orange)]/10 hover:via-[var(--gradient-pink)]/10 hover:to-[var(--gradient-purple)]/10",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(gradientButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
GradientButton.displayName = "GradientButton";

export { GradientButton, gradientButtonVariants };

