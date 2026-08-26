'use client';

import React, { useState } from 'react';
import { FilterState } from '@/types/place';
import {
  SlidersHorizontal,
  RotateCcw,
  Wifi,
  Zap,
  Volume2,
  Clock,
  DollarSign,
  ArrowUpDown,
  ChevronDown,
  Navigation,
} from 'lucide-react';

interface FilterToolbarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  resultCount: number;
  maxRadius: number | null;
  onSelectRadius: (radius: number | null) => void;
  isNearbyActive: boolean;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  onFilterChange,
  onReset,
  resultCount,
  maxRadius,
  onSelectRadius,
  isNearbyActive,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateField = (field: keyof FilterState, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const categories = [
    { label: 'Semua', value: '' },
    { label: 'Warkop Modern', value: 'warkop-modern' },
    { label: 'Cozy Cafe', value: 'cozy-coffee-shop' },
    { label: 'Coworking Space', value: 'coworking-study-space' },
    { label: 'Library Cafe', value: 'library-quiet-cafe' },
  ];

  return (
    <div className="w-full bg-zinc-950 border border-zinc-850 rounded-2xl p-3 sm:p-4 flex flex-col gap-3 shadow-xl">
      {/* Top Row: Category Pills + Expand Toggle + Sort Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:max-w-2xl scrollbar-none">
          {categories.map((cat) => {
            const isSelected = filters.category === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => updateField('category', cat.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-syne font-bold transition-all whitespace-nowrap cursor-pointer border ${
                  isSelected
                    ? 'bg-zinc-100 text-zinc-950 border-white shadow-md shadow-white/10'
                    : 'bg-zinc-900/90 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Right Action: Filters Drawer Toggle & Sort */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-syne font-bold uppercase tracking-wider border transition-all cursor-pointer ${
              isExpanded || filters.max_price || filters.min_wifi || filters.plug_availability || filters.noise_level || filters.is_24_hours
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
                : 'bg-zinc-900 text-zinc-300 hover:text-white border-zinc-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kriteria Lanjutan</span>
            <span className="sm:hidden">Filter</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>

          {/* Sort Controller */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-xl text-xs font-syne text-zinc-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={filters.sort_by}
              onChange={(e) => updateField('sort_by', e.target.value)}
              className="bg-transparent text-zinc-200 focus:outline-none text-xs font-syne font-bold cursor-pointer"
            >
              <option value="nugas_score" className="bg-zinc-900">Skor Nugas</option>
              <option value="budget_score" className="bg-zinc-900">Paling Hemat</option>
              <option value="facility_score" className="bg-zinc-900">Fasilitas</option>
              <option value="wifi_speed_mbps" className="bg-zinc-900">Wi-Fi Tercepat</option>
              <option value="price_min_drink" className="bg-zinc-900">Harga Termurah</option>
            </select>
          </div>

          <button
            onClick={onReset}
            title="Reset Semua Filter"
            className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded-xl border border-zinc-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Radius Filter Pills Row (Shown when Nearby is active) */}
      {isNearbyActive && (
        <div className="pt-2 border-t border-zinc-900 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-xs font-syne text-sky-400 font-bold flex items-center gap-1.5 shrink-0">
            <Navigation className="w-3.5 h-3.5" />
            <span>Saran Radius:</span>
          </span>
          {[
            { label: 'Semua Jarak', val: null },
            { label: '< 1 KM (Jalan Kaki)', val: 1 },
            { label: '< 3 KM (Motor Cepat)', val: 3 },
            { label: '< 5 KM', val: 5 },
          ].map((r) => (
            <button
              key={r.label}
              onClick={() => onSelectRadius(r.val)}
              className={`px-3 py-1 rounded-lg text-xs font-syne font-semibold border whitespace-nowrap transition-colors cursor-pointer ${
                maxRadius === r.val
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}

      {/* Expandable Advanced Filter Panel */}
      {isExpanded && (
        <div className="pt-3 border-t border-zinc-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 animate-fade-in text-xs">
          {/* 1. Batas Harga Minuman */}
          <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850">
            <label className="text-xs font-syne font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Batas Harga Minuman</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Semua', val: '' },
                { label: '<15k', val: 15000 },
                { label: '<25k', val: 25000 },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => updateField('max_price', p.val)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-syne font-bold border ${
                    filters.max_price === p.val
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-zinc-850 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Kecepatan Wi-Fi */}
          <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850">
            <label className="text-xs font-syne font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-sky-400" />
              <span>Kecepatan Minimal Wi-Fi</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Semua', val: '' },
                { label: '30+ Mbps', val: 30 },
                { label: '50+ Mbps', val: 50 },
              ].map((w) => (
                <button
                  key={w.label}
                  onClick={() => updateField('min_wifi', w.val)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-syne font-bold border ${
                    filters.min_wifi === w.val
                      ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                      : 'bg-zinc-850 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Ketersediaan Colokan */}
          <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850">
            <label className="text-xs font-syne font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Ketersediaan Colokan</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Semua', val: '' },
                { label: 'Melimpah', val: 'abundant' },
                { label: 'Cukup', val: 'moderate' },
              ].map((pl) => (
                <button
                  key={pl.label}
                  onClick={() => updateField('plug_availability', pl.val)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-syne font-bold border ${
                    filters.plug_availability === pl.val
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-zinc-850 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {pl.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Suasana / 24 Jam */}
          <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850 flex flex-col justify-between">
            <label className="text-xs font-syne font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Suasana & Operasional</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateField('noise_level', filters.noise_level === 'quiet' ? '' : 'quiet')}
                className={`py-1.5 px-2 flex-1 rounded-lg text-xs font-syne font-bold border ${
                  filters.noise_level === 'quiet'
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                    : 'bg-zinc-850 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Hening
              </button>
              <button
                onClick={() => updateField('is_24_hours', !filters.is_24_hours)}
                className={`py-1.5 px-2 flex-1 rounded-lg text-xs font-syne font-bold border flex items-center justify-center gap-1.5 ${
                  filters.is_24_hours
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-zinc-850 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>24 Jam</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
