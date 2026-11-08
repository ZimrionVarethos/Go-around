'use client';

import { Search, Filter } from 'lucide-react';
import { cn } from '@/lib/cn';

export type TicketStatusFilter = 'all' | 'open' | 'resolved' | 'dismissed';

interface CategoryItem {
  id: string;
  label: string;
}

interface TicketFilterToolbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedStatus: TicketStatusFilter;
  setSelectedStatus: (s: TicketStatusFilter) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  categories: CategoryItem[];
}

export function TicketFilterToolbar({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedCategory,
  setSelectedCategory,
  categories,
}: TicketFilterToolbarProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Top Row: Search + Status filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID tiket, kafe, atau nama pelapor..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54] transition-all"
          />
        </div>

        {/* Status Segmented Control */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl shrink-0 overflow-x-auto">
          {(['all', 'open', 'resolved', 'dismissed'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap capitalize',
                selectedStatus === st
                  ? 'bg-white text-[#005B54] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {st === 'all'
                ? 'Semua Status'
                : st === 'open'
                ? 'Perlu Validasi'
                : st === 'resolved'
                ? 'Selesai'
                : 'Diabaikan'}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Row: Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-gray-100 text-xs">
        <span className="text-gray-400 font-medium text-[11px] pr-2 shrink-0 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          Kategori:
        </span>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCategory(c.id)}
            className={cn(
              'px-3 py-1 rounded-lg font-medium transition-all cursor-pointer shrink-0 text-xs',
              selectedCategory === c.id
                ? 'bg-[#E8F8F5] text-[#005B54] font-semibold ring-1 ring-[#A7F3D0]'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80'
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
