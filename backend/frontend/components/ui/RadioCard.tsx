import { cn } from '@/lib/cn';
import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

export interface RadioCardProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'title'> {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
}

export const RadioCard = forwardRef<HTMLInputElement, RadioCardProps>(
  ({ className, title, description, icon, id, name, value, checked, disabled, onChange, ...props }, ref) => {
    const radioId = id || (name && value ? `${name}-${value}` : undefined);

    return (
      <label
        htmlFor={radioId}
        className={cn(
          'relative flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-150 cursor-pointer select-none',
          checked
            ? 'bg-primary-50 border-primary-600 ring-1 ring-primary-600 shadow-xs'
            : 'bg-white border-border-subtle hover:bg-surface-subtle hover:border-border-strong',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
      >
        <input
          ref={ref}
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="peer sr-only"
          {...props}
        />

        {/* Radio dot indicator */}
        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
          <div
            className={cn(
              'w-4 h-4 rounded-full border flex items-center justify-center transition-colors',
              checked
                ? 'border-primary-900 bg-white'
                : 'border-border-strong bg-white hover:border-text-400 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-700'
            )}
          >
            {checked && <div className="w-2 h-2 rounded-full bg-primary-900" />}
          </div>
        </div>

        {/* Icon */}
        {icon && (
          <div
            className={cn(
              'p-2 rounded-lg shrink-0 mt-[-2px] transition-colors',
              checked ? 'bg-primary-100 text-primary-900' : 'bg-surface-header text-text-500'
            )}
          >
            {icon}
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col min-w-0 flex-1">
          <span className={cn('text-sm font-semibold leading-snug', checked ? 'text-primary-950' : 'text-text-900')}>
            {title}
          </span>
          {description && <span className="text-xs text-text-500 mt-0.5 leading-normal">{description}</span>}
        </div>
      </label>
    );
  }
);

RadioCard.displayName = 'RadioCard';
