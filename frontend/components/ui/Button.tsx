import { cn } from '@/lib/cn';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'coffee';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer disabled:cursor-not-allowed select-none';

    const variants = {
      primary:
        'bg-primary-900 text-white hover:bg-primary-800 active:bg-primary-950 focus-visible:ring-primary-700 shadow-sm rounded-full',
      secondary:
        'bg-primary-100 text-primary-900 hover:bg-primary-200 border border-primary-200 active:bg-primary-300 focus-visible:ring-primary-500 rounded-full',
      danger:
        'bg-danger-base text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-danger-base shadow-sm rounded-full',
      ghost:
        'text-text-700 hover:bg-surface-subtle hover:text-text-900 active:bg-surface-header focus-visible:ring-text-400 rounded-md',
      outline:
        'border border-border-strong bg-white text-text-700 hover:bg-surface-subtle hover:border-text-500 active:bg-surface-header focus-visible:ring-primary-700 rounded-full',
      coffee:
        'bg-coffee-cta text-text-900 hover:bg-yellow-400 active:bg-yellow-500 border border-yellow-500/30 font-semibold shadow-sm rounded-full',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
