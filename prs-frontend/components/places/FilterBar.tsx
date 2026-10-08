'use client';

import {
  ClockIcon,
  HeadphonesIcon,
  MoneyIcon,
  PlugChargingIcon,
  SlidersHorizontalIcon,
  XIcon,
} from '@phosphor-icons/react';
import { cn } from '@/lib/cn';
import type { PlaceFilters } from '@/lib/types';
import {
  DEFAULT_RECOMMENDATION_REQUEST,
  normalizeRecommendationWeights,
  type RecommendationRequest,
} from '@/lib/recommendations';

export interface FilterBarProps {
  filters?: PlaceFilters;
  onFilterChange?: (newFilters: PlaceFilters) => void;
  recommendationRequest?: RecommendationRequest;
  onRecommendationRequestChange?: (newRequest: RecommendationRequest) => void;
  className?: string;
}

export function FilterBar({
  filters,
  onFilterChange,
  recommendationRequest,
  onRecommendationRequestChange,
  className,
}: FilterBarProps) {
  // Check active states directly from recommendationRequest if available, else fallback to filters
  const isPlugActive = recommendationRequest
    ? recommendationRequest.must_have.includes('plug')
    : filters?.plug_availability === 'abundant';

  const isQuietActive = recommendationRequest
    ? (recommendationRequest.weights.quiet >= 0.25 || recommendationRequest.preset === 'quiet')
    : filters?.noise_level === 'quiet';

  const isBudgetActive = recommendationRequest
    ? (recommendationRequest.max_price !== null && recommendationRequest.max_price <= 25000)
    : (filters?.max_price ?? 0) === 25000;

  const is24HoursActive = recommendationRequest
    ? !!recommendationRequest.open_now
    : !!filters?.is_24_hours;

  const togglePlug = () => {
    if (recommendationRequest && onRecommendationRequestChange) {
      const willBeActive = !isPlugActive;
      const mustHave = new Set(recommendationRequest.must_have);
      const weights = { ...recommendationRequest.weights };
      if (willBeActive) {
        mustHave.add('plug');
        weights.plug = Math.max(weights.plug, 0.3);
      } else {
        mustHave.delete('plug');
      }
      onRecommendationRequestChange({
        ...recommendationRequest,
        must_have: [...mustHave],
        weights: normalizeRecommendationWeights(weights),
      });
    }

    if (filters && onFilterChange) {
      onFilterChange({
        ...filters,
        plug_availability: isPlugActive ? undefined : 'abundant',
      });
    }
  };

  const toggleQuiet = () => {
    if (recommendationRequest && onRecommendationRequestChange) {
      const willBeActive = !isQuietActive;
      const weights = { ...recommendationRequest.weights };
      weights.quiet = willBeActive ? 0.35 : 0.15;
      onRecommendationRequestChange({
        ...recommendationRequest,
        preset: willBeActive ? 'quiet' : 'balanced',
        weights: normalizeRecommendationWeights(weights),
      });
    }

    if (filters && onFilterChange) {
      onFilterChange({
        ...filters,
        noise_level: isQuietActive ? undefined : 'quiet',
      });
    }
  };

  const toggleBudget = () => {
    if (recommendationRequest && onRecommendationRequestChange) {
      const willBeActive = !isBudgetActive;
      const weights = { ...recommendationRequest.weights };
      if (willBeActive) {
        weights.price = Math.max(weights.price, 0.3);
      }
      onRecommendationRequestChange({
        ...recommendationRequest,
        max_price: willBeActive ? 25000 : null,
        weights: normalizeRecommendationWeights(weights),
      });
    }

    if (filters && onFilterChange) {
      onFilterChange({
        ...filters,
        max_price: isBudgetActive ? undefined : 25000,
      });
    }
  };

  const toggle24Hours = () => {
    if (recommendationRequest && onRecommendationRequestChange) {
      onRecommendationRequestChange({
        ...recommendationRequest,
        open_now: !is24HoursActive,
      });
    }

    if (filters && onFilterChange) {
      onFilterChange({
        ...filters,
        is_24_hours: is24HoursActive ? undefined : true,
      });
    }
  };

  const resetFilters = () => {
    if (recommendationRequest && onRecommendationRequestChange) {
      onRecommendationRequestChange({
        ...DEFAULT_RECOMMENDATION_REQUEST,
        location: recommendationRequest.location,
      });
    }

    if (filters && onFilterChange) {
      onFilterChange({
        search: filters.search,
        sort_by: filters.sort_by,
        order: filters.order,
      });
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 select-none overflow-x-auto no-scrollbar pb-0.5',
        className
      )}
    >
      {/* 1. Colokan Tiap Meja */}
      <button
        type="button"
        onClick={togglePlug}
        className={cn(
          'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 tactile-press',
          isPlugActive
            ? 'bg-[#005B54] text-white shadow-[0_4px_12px_rgba(0,91,84,0.3)]'
            : 'glass-island-subtle text-slate-700 hover:text-slate-900 hover:border-slate-300'
        )}
      >
        <PlugChargingIcon
          size={15}
          weight="fill"
          className={cn(isPlugActive ? 'text-amber-300' : 'text-amber-500')}
        />
        <span>Colokan Tiap Meja</span>
        {isPlugActive ? (
          <XIcon size={14} weight="bold" className="text-white/80 hover:text-white" />
        ) : null}
      </button>

      {/* 2. Tenang & Kondusif (< 45dB) */}
      <button
        type="button"
        onClick={toggleQuiet}
        className={cn(
          'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 tactile-press',
          isQuietActive
            ? 'bg-[#005B54] text-white shadow-[0_4px_12px_rgba(0,91,84,0.3)]'
            : 'glass-island-subtle text-slate-700 hover:text-slate-900 hover:border-slate-300'
        )}
      >
        <HeadphonesIcon
          size={15}
          weight="duotone"
          className={cn(isQuietActive ? 'text-white' : 'text-teal-700')}
        />
        <span>Tenang &amp; Kondusif (&lt; 45dB)</span>
        {isQuietActive && <XIcon size={14} weight="bold" className="text-white/80" />}
      </button>

      {/* 3. Es Kopi < Rp25.000 */}
      <button
        type="button"
        onClick={toggleBudget}
        className={cn(
          'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 tactile-press',
          isBudgetActive
            ? 'bg-[#005B54] text-white shadow-[0_4px_12px_rgba(0,91,84,0.3)]'
            : 'glass-island-subtle text-slate-700 hover:text-slate-900 hover:border-slate-300'
        )}
      >
        <MoneyIcon
          size={15}
          weight="duotone"
          className={cn(isBudgetActive ? 'text-white' : 'text-emerald-600')}
        />
        <span>Es Kopi &lt; Rp25.000</span>
        {isBudgetActive && <XIcon size={14} weight="bold" className="text-white/80" />}
      </button>

      {/* 4. Buka 24 Jam Nonstop */}
      <button
        type="button"
        onClick={toggle24Hours}
        className={cn(
          'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 tactile-press',
          is24HoursActive
            ? 'bg-[#005B54] text-white shadow-[0_4px_12px_rgba(0,91,84,0.3)]'
            : 'glass-island-subtle text-slate-700 hover:text-slate-900 hover:border-slate-300'
        )}
      >
        <ClockIcon
          size={15}
          weight="duotone"
          className={cn(is24HoursActive ? 'text-white' : 'text-amber-500')}
        />
        <span>Buka 24 Jam Nonstop</span>
        {is24HoursActive && <XIcon size={14} weight="bold" className="text-white/80" />}
      </button>

      {/* 5. Reset Filter */}
      <button
        type="button"
        onClick={resetFilters}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold glass-island-subtle text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all cursor-pointer shrink-0 ml-auto tactile-press"
      >
        <SlidersHorizontalIcon size={15} weight="bold" className="text-teal-700" />
        <span>Reset Filter</span>
      </button>

    </div>
  );
}
