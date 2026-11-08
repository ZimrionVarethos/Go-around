import { cn } from '@/lib/cn';
import { Check } from 'lucide-react';
import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  description?: ReactNode;
  variant?: 'default' | 'card';
  icon?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
      variant = 'default',
      icon,
      id,
      checked,
      disabled,
      onChange,
      ...props
    },
    ref
  ) => {
    const inputId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    if (variant === 'card') {
      return (
        <label
          htmlFor={inputId}
          className={cn(
            'flex items-start gap-3 p-3 rounded-lg border transition-all duration-150 cursor-pointer select-none',
            checked
              ? 'bg-primary-50 border-primary-500 shadow-xs'
              : 'bg-white border-border-subtle hover:bg-surface-subtle hover:border-border-strong',
            disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
            className
          )}
        >
          <div className="relative flex items-center justify-center mt-0.5 shrink-0">
            <input
              ref={ref}
              type="checkbox"
              id={inputId}
              checked={checked}
              disabled={disabled}
              onChange={onChange}
              className="peer sr-only"
              {...props}
            />
            <div
              className={cn(
                'w-4 h-4 rounded border transition-colors flex items-center justify-center',
                checked
                  ? 'bg-primary-900 border-primary-900 text-white'
                  : 'bg-white border-border-strong peer-focus-visible:ring-2 peer-focus-visible:ring-primary-700'
              )}
            >
              {checked && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </div>
          {icon && <div className="text-primary-700 shrink-0 mt-0.5">{icon}</div>}
          <div className="flex flex-col">
            {label && <span className="text-sm font-medium text-text-900 leading-tight">{label}</span>}
            {description && <span className="text-xs text-text-500 mt-0.5">{description}</span>}
          </div>
        </label>
      );
    }

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex items-start gap-2.5 cursor-pointer select-none',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-4 h-4 rounded border transition-colors flex items-center justify-center',
              checked
                ? 'bg-primary-900 border-primary-900 text-white'
                : 'bg-white border-border-strong hover:border-text-400 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-700'
            )}
          >
            {checked && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        </div>
        <div className="flex flex-col">
          {label && <span className="text-sm text-text-700 leading-tight">{label}</span>}
          {description && <span className="text-xs text-text-500 mt-0.5">{description}</span>}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
