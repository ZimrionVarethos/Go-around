import { cn } from '@/lib/cn';
import { forwardRef, TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, disabled, rows = 3, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-semibold text-text-700 select-none"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          className={cn(
            'w-full text-sm py-2 px-3 bg-white border border-border-subtle rounded-md text-text-900 placeholder:text-text-400 transition-all duration-150',
            'focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700',
            'disabled:bg-surface-subtle disabled:text-text-400 disabled:cursor-not-allowed resize-y',
            error && 'border-danger-base focus:border-danger-base focus:ring-danger-base',
            className
          )}
          {...props}
        />
        {error ? (
          <span className="text-xs text-danger-base font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-text-500">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
