'use client';

import { MagnifyingGlassIcon } from '@phosphor-icons/react';
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
    <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-card-subtle p-4 space-y-3">
      {/* Top Row: Search + Status Segmented Control */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon size={16} weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID tiket, nama tempat, atau kendala fasilitas..."
            className="w-full h-9 pl-9 pr-4 text-xs bg-[#F5F6F3] border border-[#E2E5DF] rounded-lg text-text-900 placeholder:text-text-500 focus:bg-white focus:outline-none focus:border-[#005B54] transition-all"
          />
        </div>

        {/* Status Segmented Control */}
        <div className="flex items-center gap-1 bg-[#F5F6F3] p-1 rounded-lg border border-[#E2E5DF] shrink-0 overflow-x-auto">
          {(['all', 'open', 'resolved', 'dismissed'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap tactile-press',
                selectedStatus === st
                  ? 'bg-white text-[#005B54] shadow-2xs border border-[#E2E5DF]'
                  : 'text-text-600 hover:text-text-900'
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

      {/* Bottom Row: Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 border-t border-[#E2E5DF] text-xs">
        <span className="text-text-600 font-semibold text-[11px] uppercase tracking-wider pr-1.5 shrink-0">
          Kategori:
        </span>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCategory(c.id)}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer shrink-0 tactile-press',
              selectedCategory === c.id
                ? 'bg-[#005B54] text-white font-semibold shadow-2xs'
                : 'text-text-600 hover:bg-[#F5F6F3] hover:text-text-900'
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
