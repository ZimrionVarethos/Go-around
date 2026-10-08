'use client';

import { Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';

export type TimeRange = '7d' | '30d' | '90d' | 'all';

interface AnalyticsFilterToolbarProps {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

const TIME_RANGES: { id: TimeRange; label: string }[] = [
  { id: '7d', label: '7 Hari Terakhir' },
  { id: '30d', label: '30 Hari Terakhir' },
  { id: '90d', label: 'Kuartal Ini' },
  { id: 'all', label: 'Semua Waktu' },
];

export function AnalyticsFilterToolbar({ timeRange, setTimeRange }: AnalyticsFilterToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2.5 border-b border-[#E2E5DF]">
      <div className="flex items-center gap-2 text-text-800">
        <Calendar className="w-4 h-4 text-[#005B54]" />
        <span className="text-xs font-bold">Periode Observasi Data Spasial</span>
      </div>

      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E2E5DF] shadow-2xs w-full sm:w-auto overflow-x-auto">
        {TIME_RANGES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTimeRange(t.id)}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex-1 sm:flex-initial text-center tactile-press',
              timeRange === t.id
                ? 'bg-[#005B54] text-white shadow-2xs'
                : 'text-text-600 hover:text-text-900 hover:bg-[#F5F6F3]'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
