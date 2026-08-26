'use client';

import React from 'react';
import { FilterState } from '@/types/place';
import {
  SlidersHorizontal,
  RotateCcw,
  Wifi,
  Zap,
  Volume2,
  Clock,
  Tag,
  Building2,
} from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  resultCount: number;
}

const SUBDISTRICTS = [
  'Semua Kecamatan',
  'Bogor Tengah',
  'Bogor Timur',
  'Bogor Utara',
  'Bogor Selatan',
  'Bogor Barat',
  'Tanah Sareal',
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
  resultCount,
}) => {
  const updateField = (field: keyof FilterState, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <aside className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 text-slate-200 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          <h2 className="font-semibold text-sm tracking-tight text-white">Filter Tempat Nugas</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-medium">
            {resultCount} Hasil
          </span>
          <button
            onClick={onReset}
            title="Reset Filter"
            className="text-xs text-slate-400 hover:text-slate-200 p-1 hover:bg-slate-800 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. Kecamatan di Kota Bogor */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Kecamatan Kota Bogor</span>
        </label>
        <select
          value={filters.subdistrict}
          onChange={(e) => updateField('subdistrict', e.target.value === 'Semua Kecamatan' ? '' : e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
        >
          {SUBDISTRICTS.map((sub) => (
            <option key={sub} value={sub === 'Semua Kecamatan' ? '' : sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Kategori Tempat */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-emerald-400" />
          <span>Kategori Tempat</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {[
            { label: 'Semua', value: '' },
            { label: 'Warkop Modern', value: 'warkop-modern' },
            { label: 'Cozy Cafe', value: 'cozy-coffee-shop' },
            { label: 'Coworking Space', value: 'coworking-study-space' },
            { label: 'Library Cafe', value: 'library-quiet-cafe' },
          ].map((cat) => {
            const isSelected = filters.category === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => updateField('category', cat.value)}
                className={`px-2.5 py-1.5 rounded-lg border text-left font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Batas Harga Minuman Termurah (Kantong Mahasiswa) */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-300">Batas Harga Minuman</span>
          <span className="text-emerald-400 font-bold">
            {filters.max_price ? `Maks. Rp ${Number(filters.max_price).toLocaleString('id-ID')}` : 'Semua Harga'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          {[
            { label: 'Semua', value: '' },
            { label: '< Rp 10.000', value: 10000 },
            { label: '< Rp 18.000', value: 18000 },
            { label: '< Rp 25.000', value: 25000 },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => updateField('max_price', item.value)}
              className={`px-2 py-1 rounded border text-center font-medium ${
                filters.max_price === item.value
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Kecepatan Wi-Fi Minimal */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span>Kecepatan Minimal Wi-Fi</span>
        </label>
        <div className="grid grid-cols-4 gap-1 text-xs">
          {[
            { label: 'Bebas', val: '' },
            { label: '30+ Mbps', val: 30 },
            { label: '50+ Mbps', val: 50 },
            { label: '80+ Mbps', val: 80 },
          ].map((w) => (
            <button
              key={w.label}
              onClick={() => updateField('min_wifi', w.val)}
              className={`py-1.5 rounded border text-center font-medium ${
                filters.min_wifi === w.val
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Ketersediaan Colokan Listrik */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ketersediaan Colokan Listrik</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          {[
            { label: 'Semua', val: '' },
            { label: 'Melimpah', val: 'abundant' },
            { label: 'Cukup', val: 'moderate' },
          ].map((p) => (
            <button
              key={p.label}
              onClick={() => updateField('plug_availability', p.val)}
              className={`py-1.5 px-2 rounded border text-center font-medium ${
                filters.plug_availability === p.val
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Suasana / Kebisingan */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tingkat Ketenangan Suasana</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          {[
            { label: 'Semua', val: '' },
            { label: 'Tenang / Hening', val: 'quiet' },
            { label: 'Sedang / Santai', val: 'moderate' },
          ].map((n) => (
            <button
              key={n.label}
              onClick={() => updateField('noise_level', n.val)}
              className={`py-1.5 px-2 rounded border text-center font-medium ${
                filters.noise_level === n.val
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {/* 7. Fitur Spesial Toggle */}
      <div className="flex flex-col gap-2 border-t border-slate-800 pt-3">
        <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800 transition-colors">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Hanya Buka 24 Jam Nonstop</span>
          </div>
          <input
            type="checkbox"
            checked={filters.is_24_hours}
            onChange={(e) => updateField('is_24_hours', e.target.checked)}
            className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 bg-slate-750"
          />
        </label>
      </div>
    </aside>
  );
};
