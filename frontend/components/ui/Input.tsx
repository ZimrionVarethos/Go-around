import { cn } from '@/lib/cn';
import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
  variant?: 'default' | 'search' | 'pill';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightElement,
      variant = 'default',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const variantStyles = {
      default: 'rounded-md text-sm py-2 px-3 bg-white border border-border-subtle',
      search:
        'rounded-full text-sm py-2.5 px-4 bg-white border border-border-subtle shadow-sm',
      pill: 'rounded-full text-sm py-2 px-3 bg-surface-subtle border border-border-subtle',
    };

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-text-700 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 pointer-events-none text-text-400 flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'w-full text-text-900 placeholder:text-text-400 transition-all duration-150',
              'focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700',
              'disabled:bg-surface-subtle disabled:text-text-400 disabled:cursor-not-allowed',
              leftIcon ? 'pl-10' : undefined,
              rightElement ? 'pr-12' : undefined,
              error ? 'border-danger-base focus:border-danger-base focus:ring-danger-base' : undefined,
              variantStyles[variant],
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
        {error ? (
          <span className="text-xs text-danger-base font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-text-500">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
