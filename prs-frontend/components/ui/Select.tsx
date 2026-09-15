import { cn } from '@/lib/cn';
import { ChevronDown } from 'lucide-react';
import { forwardRef, SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, children, id, disabled, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-text-700 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'w-full appearance-none text-sm py-2 pl-3 pr-9 bg-white border border-border-subtle rounded-md text-text-900 transition-all duration-150 cursor-pointer',
              'focus:outline-none focus:border-primary-700 focus:ring-1 focus:ring-primary-700',
              'disabled:bg-surface-subtle disabled:text-text-400 disabled:cursor-not-allowed',
              error && 'border-danger-base focus:border-danger-base focus:ring-danger-base',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute right-3 pointer-events-none text-text-400 flex items-center">
            <ChevronDown className="w-4 h-4" />
          </div>
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

Select.displayName = 'Select';
