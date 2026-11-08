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
  { id: '30d', label: 'Bulan Ini' },
  { id: '90d', label: 'Kuartal Ini' },
  { id: 'all', label: 'Semua Waktu' },
];

export function AnalyticsFilterToolbar({ timeRange, setTimeRange }: AnalyticsFilterToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[#005B54]" />
        <span className="text-xs font-bold text-gray-900">Rentang Periode Analisis</span>
      </div>

      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
        {TIME_RANGES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTimeRange(t.id)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex-1 sm:flex-initial text-center',
              timeRange === t.id
                ? 'bg-white text-[#005B54] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
