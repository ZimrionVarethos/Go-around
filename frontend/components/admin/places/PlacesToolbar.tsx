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
    { id: 'all', label: 'Semua Wilayah Kota Bogor' },
    { id: 'Bogor Tengah', label: 'Bogor Tengah' },
    { id: 'Bogor Timur', label: 'Bogor Timur' },
    { id: 'Dramaga', label: 'Dramaga / Sekitar IPB' },
    { id: 'Babakan Madang / Sentul', label: 'Babakan Madang / Sentul' },
    { id: 'Bogor Barat', label: 'Bogor Barat' },
    { id: 'Bogor Utara', label: 'Bogor Utara' },
  ];

  const statuses = [
    { id: 'all', label: 'Semua Status Tayang' },
    { id: 'verified', label: 'Terverifikasi' },
    { id: 'review', label: 'Perlu Review' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between">
      {/* Left Filters Row */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        {/* Dropdown Filter Wilayah */}
        <div className="relative">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="appearance-none bg-white hover:bg-gray-50/80 border border-gray-200/90 text-gray-800 text-xs font-semibold pl-3.5 pr-8 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54] cursor-pointer shadow-xs transition-all"
          >
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown Filter Status Tayang */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none bg-white hover:bg-gray-50/80 border border-gray-200/90 text-gray-800 text-xs font-semibold pl-8 pr-8 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54] cursor-pointer shadow-xs transition-all"
          >
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 hidden md:block" />

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {/* WiFi > 50 Mbps */}
          <button
            type="button"
            onClick={() => toggleQuickFilter('wifi50')}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs',
              quickFilters.wifi50
                ? 'bg-[#005B54] text-white border border-[#005B54]'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            )}
          >
            <Wifi className={cn('w-3.5 h-3.5', quickFilters.wifi50 ? 'text-white' : 'text-blue-500')} />
            <span>WiFi &gt; 50 Mbps</span>
            {quickFilters.wifi50 && <X className="w-3 h-3 ml-0.5" />}
          </button>

          {/* Colokan > 80% */}
          <button
            type="button"
            onClick={() => toggleQuickFilter('plug80')}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs',
              quickFilters.plug80
                ? 'bg-[#005B54] text-white border border-[#005B54]'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            )}
          >
            <Zap className={cn('w-3.5 h-3.5', quickFilters.plug80 ? 'text-white' : 'text-amber-500')} />
            <span>Colokan &gt; 80%</span>
            {quickFilters.plug80 && <X className="w-3 h-3 ml-0.5" />}
          </button>

          {/* Budget < Rp 25k */}
          <button
            type="button"
            onClick={() => toggleQuickFilter('budget25k')}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs',
              quickFilters.budget25k
                ? 'bg-[#005B54] text-white border border-[#005B54]'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            )}
          >
            <Banknote className={cn('w-3.5 h-3.5', quickFilters.budget25k ? 'text-white' : 'text-emerald-500')} />
            <span>Budget &lt; Rp 25k</span>
            {quickFilters.budget25k && <X className="w-3 h-3 ml-0.5" />}
          </button>

          {/* Buka 24 Jam */}
          <button
            type="button"
            onClick={() => toggleQuickFilter('open24h')}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs',
              quickFilters.open24h
                ? 'bg-[#005B54] text-white border border-[#005B54]'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            )}
          >
            <Clock className={cn('w-3.5 h-3.5', quickFilters.open24h ? 'text-white' : 'text-purple-500')} />
            <span>Buka 24 Jam</span>
            {quickFilters.open24h && <X className="w-3 h-3 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* View Mode Toggle (Table / Grid) */}
      <div className="flex items-center self-end xl:self-auto bg-gray-100 p-1 rounded-xl shrink-0 border border-gray-200/50">
        <button
          type="button"
          onClick={() => setViewMode('table')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
            viewMode === 'table'
              ? 'bg-white text-[#005B54] font-bold shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          <TableIcon className="w-3.5 h-3.5" />
          <span>Tabel</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode('grid')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
            viewMode === 'grid'
              ? 'bg-white text-[#005B54] font-bold shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Grid Peta</span>
        </button>
      </div>
    </div>
  );
}
