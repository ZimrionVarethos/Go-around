'use client';

import {
  ChevronDown,
  Wifi,
  Zap,
  Banknote,
  Clock,
  Table as TableIcon,
  LayoutGrid,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export interface PlacesToolbarProps {
  selectedDistrict: string;
  setSelectedDistrict: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  quickFilters: {
    wifi50: boolean;
    plug80: boolean;
    budget25k: boolean;
    open24h: boolean;
  };
  toggleQuickFilter: (key: 'wifi50' | 'plug80' | 'budget25k' | 'open24h') => void;
  viewMode: 'table' | 'grid';
  setViewMode: (mode: 'table' | 'grid') => void;
}

export function PlacesToolbar({
  selectedDistrict,
  setSelectedDistrict,
  selectedStatus,
  setSelectedStatus,
  quickFilters,
  toggleQuickFilter,
  viewMode,
  setViewMode,
}: PlacesToolbarProps) {
  const districts = [
    { id: 'all', label: 'Semua Kecamatan Kota Bogor' },
    { id: 'Bogor Tengah', label: 'Bogor Tengah' },
    { id: 'Bogor Timur', label: 'Bogor Timur' },
    { id: 'Bogor Utara', label: 'Bogor Utara' },
    { id: 'Bogor Barat', label: 'Bogor Barat' },
    { id: 'Tanah Sareal', label: 'Tanah Sareal' },
    { id: 'Bogor Selatan', label: 'Bogor Selatan' },
  ];

  const statuses = [
    { id: 'all', label: 'Semua Status Tayang' },
    { id: 'verified', label: 'Terverifikasi' },
    { id: 'review', label: 'Perlu Review' },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-card-subtle p-3.5 flex flex-col xl:flex-row gap-3 items-stretch xl:items-center justify-between">
      {/* Left Filters Row */}
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {/* Dropdown Filter Wilayah */}
        <div className="relative">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="appearance-none h-9 bg-[#F5F6F3] hover:bg-white border border-[#E2E5DF] text-text-900 text-xs font-semibold pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005B54]/15 focus:border-[#005B54] cursor-pointer transition-all"
          >
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-text-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown Filter Status Tayang */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none h-9 bg-[#F5F6F3] hover:bg-white border border-[#E2E5DF] text-text-900 text-xs font-semibold pl-8 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005B54]/15 focus:border-[#005B54] cursor-pointer transition-all"
          >
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <SlidersHorizontal className="w-3.5 h-3.5 text-text-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <ChevronDown className="w-3.5 h-3.5 text-text-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-[#E2E5DF] hidden md:block mx-0.5" />

        {/* Quick Filter Toggles */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => toggleQuickFilter('wifi50')}
            className={cn(
              'inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border tabular-nums tactile-press',
              quickFilters.wifi50
                ? 'bg-[#005B54] text-white border-[#005B54] shadow-2xs'
                : 'bg-white text-text-700 border-[#E2E5DF] hover:bg-[#F5F6F3]'
            )}
          >
            <Wifi className={cn('w-3.5 h-3.5', quickFilters.wifi50 ? 'text-white' : 'text-text-500')} />
            <span>Wi-Fi &gt; 50 Mbps</span>
            {quickFilters.wifi50 && <X className="w-3 h-3 ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => toggleQuickFilter('plug80')}
            className={cn(
              'inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border tabular-nums tactile-press',
              quickFilters.plug80
                ? 'bg-[#005B54] text-white border-[#005B54] shadow-2xs'
                : 'bg-white text-text-700 border-[#E2E5DF] hover:bg-[#F5F6F3]'
            )}
          >
            <Zap className={cn('w-3.5 h-3.5', quickFilters.plug80 ? 'text-white' : 'text-text-500')} />
            <span>Colokan &gt; 80%</span>
            {quickFilters.plug80 && <X className="w-3 h-3 ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => toggleQuickFilter('budget25k')}
            className={cn(
              'inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border tabular-nums tactile-press',
              quickFilters.budget25k
                ? 'bg-[#005B54] text-white border-[#005B54] shadow-2xs'
                : 'bg-white text-text-700 border-[#E2E5DF] hover:bg-[#F5F6F3]'
            )}
          >
            <Banknote className={cn('w-3.5 h-3.5', quickFilters.budget25k ? 'text-white' : 'text-text-500')} />
            <span>&lt; Rp 25rb</span>
            {quickFilters.budget25k && <X className="w-3 h-3 ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => toggleQuickFilter('open24h')}
            className={cn(
              'inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border tabular-nums tactile-press',
              quickFilters.open24h
                ? 'bg-[#005B54] text-white border-[#005B54] shadow-2xs'
                : 'bg-white text-text-700 border-[#E2E5DF] hover:bg-[#F5F6F3]'
            )}
          >
            <Clock className={cn('w-3.5 h-3.5', quickFilters.open24h ? 'text-white' : 'text-text-500')} />
            <span>24 Jam</span>
            {quickFilters.open24h && <X className="w-3 h-3 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* View Mode Toggle (Table / Grid) */}
      <div className="flex items-center self-end xl:self-auto bg-[#F5F6F3] p-1 rounded-lg shrink-0 border border-[#E2E5DF]">
        <button
          type="button"
          onClick={() => setViewMode('table')}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer tactile-press',
            viewMode === 'table'
              ? 'bg-white text-[#005B54] shadow-2xs border border-[#E2E5DF]'
              : 'text-text-600 hover:text-text-900'
          )}
        >
          <TableIcon className="w-3.5 h-3.5" />
          <span>Tabel</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode('grid')}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer tactile-press',
            viewMode === 'grid'
              ? 'bg-white text-[#005B54] shadow-2xs border border-[#E2E5DF]'
              : 'text-text-600 hover:text-text-900'
          )}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Grid</span>
        </button>
      </div>
    </div>
  );
}
