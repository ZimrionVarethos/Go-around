'use client';

import { Zap, Headphones, Banknote, Clock, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { PlaceFilters } from '@/lib/types';

export interface FilterBarProps {
  filters: PlaceFilters;
  onFilterChange: (newFilters: PlaceFilters) => void;
  className?: string;
}

export function FilterBar({
  filters,
  onFilterChange,
  className,
}: FilterBarProps) {
  // Check active states
  const isPlugActive = filters.plug_availability === 'abundant';
  const isQuietActive = filters.noise_level === 'quiet';
  const isBudgetActive = (filters.max_price ?? 0) === 25000;
  const is24HoursActive = !!filters.is_24_hours;

  const togglePlug = () => {
    onFilterChange({
      ...filters,
      plug_availability: isPlugActive ? undefined : 'abundant',
    });
  };

  const toggleQuiet = () => {
    onFilterChange({
      ...filters,
      noise_level: isQuietActive ? undefined : 'quiet',
    });
  };

  const toggleBudget = () => {
    onFilterChange({
      ...filters,
      max_price: isBudgetActive ? undefined : 25000,
    });
  };

  const toggle24Hours = () => {
    onFilterChange({
      ...filters,
      is_24_hours: is24HoursActive ? undefined : true,
    });
  };

  const resetFilters = () => {
    onFilterChange({
      search: filters.search,
      sort_by: filters.sort_by,
      order: filters.order,
    });
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 select-none overflow-x-auto no-scrollbar',
        className
      )}
    >
      {/* 1. Colokan Tiap Meja (Active by default in Figma design) */}
      <button
        type="button"
        onClick={togglePlug}
        className={cn(
          'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 tactile-press',
          isPlugActive
            ? 'bg-[#005B54] text-white shadow-[0_4px_12px_rgba(0,91,84,0.3)] ring-2 ring-[#005B54]/20'
            : 'glass-island-subtle text-slate-700 hover:text-slate-900 hover:border-slate-300'
        )}
      >
        <Zap className={cn('w-3.5 h-3.5', isPlugActive ? 'text-amber-300 fill-amber-300' : 'text-amber-500')} />
        <span>Colokan Tiap Meja</span>
        {isPlugActive ? (
          <X className="w-3.5 h-3.5 text-white/80 hover:text-white" />
        ) : null}
      </button>

      {/* 2. Tenang & Kondusif (< 45dB) */}
      <button
        type="button"
        onClick={toggleQuiet}
        className={cn(
          'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 tactile-press',
          isQuietActive
            ? 'bg-[#005B54] text-white shadow-[0_4px_12px_rgba(0,91,84,0.3)] ring-2 ring-[#005B54]/20'
            : 'glass-island-subtle text-slate-700 hover:text-slate-900 hover:border-slate-300'
        )}
      >
        <Headphones className={cn('w-3.5 h-3.5', isQuietActive ? 'text-white' : 'text-teal-700')} />
        <span>Tenang &amp; Kondusif (&lt; 45dB)</span>
        {isQuietActive && <X className="w-3.5 h-3.5 text-white/80" />}
      </button>

      {/* 3. Es Kopi < Rp25.000 */}
      <button
        type="button"
        onClick={toggleBudget}
        className={cn(
          'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 tactile-press',
          isBudgetActive
            ? 'bg-[#005B54] text-white shadow-[0_4px_12px_rgba(0,91,84,0.3)] ring-2 ring-[#005B54]/20'
            : 'glass-island-subtle text-slate-700 hover:text-slate-900 hover:border-slate-300'
        )}
      >
        <Banknote className={cn('w-3.5 h-3.5', isBudgetActive ? 'text-white' : 'text-emerald-600')} />
        <span>Es Kopi &lt; Rp25.000</span>
        {isBudgetActive && <X className="w-3.5 h-3.5 text-white/80" />}
      </button>

      {/* 4. Buka 24 Jam Nonstop */}
      <button
        type="button"
        onClick={toggle24Hours}
        className={cn(
          'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 tactile-press',
          is24HoursActive
            ? 'bg-[#005B54] text-white shadow-[0_4px_12px_rgba(0,91,84,0.3)] ring-2 ring-[#005B54]/20'
            : 'glass-island-subtle text-slate-700 hover:text-slate-900 hover:border-slate-300'
        )}
      >
        <Clock className={cn('w-3.5 h-3.5', is24HoursActive ? 'text-white' : 'text-amber-500')} />
        <span>Buka 24 Jam Nonstop</span>
        {is24HoursActive && <X className="w-3.5 h-3.5 text-white/80" />}
      </button>

      {/* 5. Reset Filter */}
      <button
        type="button"
        onClick={resetFilters}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold glass-island-subtle text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all cursor-pointer shrink-0 ml-auto tactile-press"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-teal-700" />
        <span>Reset Filter</span>
      </button>

    </div>
  );
}
