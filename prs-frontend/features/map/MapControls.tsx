'use client';

import { Locate, Plus, Minus, Layers, Compass, Info } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { ToastType } from '@/hooks/useToast';

export interface MapControlsProps {
  onLocate?: () => void;
  onToast?: (msg: string, type?: ToastType) => void;
  className?: string;
}

export function MapControls({ onLocate, onToast, className }: MapControlsProps) {
  const handleZoomIn = () => {
    const el = document.querySelector('.leaflet-container');
    if (el) {
      const map = (el as unknown as { _leaflet_map?: { zoomIn: () => void } })._leaflet_map;
      map?.zoomIn();
    }
  };

  const handleZoomOut = () => {
    const el = document.querySelector('.leaflet-container');
    if (el) {
      const map = (el as unknown as { _leaflet_map?: { zoomOut: () => void } })._leaflet_map;
      map?.zoomOut();
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* 1. Layers */}
      <button
        title="Lapisan GIS"
        onClick={() => onToast?.('Lapisan GIS: Fitur tile layer switcher akan tersedia segera! 🗺️', 'info')}
        className="w-10 h-10 bg-white border border-gray-200/80 rounded-xl shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all cursor-pointer"
      >
        <Layers className="w-4 h-4" />
      </button>

      {/* 2. Locate User */}
      <button
        title="Lokasi Anda"
        onClick={onLocate}
        className="w-10 h-10 bg-white border border-gray-200/80 rounded-xl shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all cursor-pointer"
      >
        <Locate className="w-4 h-4" />
      </button>

      {/* 3. Zoom In */}
      <button
        title="Perbesar"
        onClick={handleZoomIn}
        className="w-10 h-10 bg-white border border-gray-200/80 rounded-xl shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* 4. Zoom Out */}
      <button
        title="Perkecil"
        onClick={handleZoomOut}
        className="w-10 h-10 bg-white border border-gray-200/80 rounded-xl shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all cursor-pointer"
      >
        <Minus className="w-4 h-4" />
      </button>

      {/* 5. Compass */}
      <button
        title="Reset Orientasi Peta"
        onClick={() => onToast?.('Peta sudah menghadap ke Utara ↑', 'info')}
        className="w-10 h-10 bg-white border border-gray-200/80 rounded-xl shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all cursor-pointer"
      >
        <Compass className="w-4 h-4" />
      </button>
    </div>
  );
}

// Map legend — score color swatches matching Figma
export function MapLegend() {
  const scores = [
    { label: '0,9 – 1,0 (Sangat Ideal)', color: '#005B54' },
    { label: '0,8 – 0,89 (Bagus)', color: '#10B981' },
    { label: '0,6 – 0,79 (Cukup)', color: '#F59E0B' },
    { label: '< 0,6 (Kurang Kondusif)', color: '#EF4444' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-lg p-3.5 w-60 select-none">
      {/* Title with Info icon */}
      <div className="flex items-center justify-between mb-2.5 pb-1 border-b border-gray-100">
        <h4 className="text-xs font-bold text-gray-900">
          Skor Kesesuaian
        </h4>
        <Info className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600" />
      </div>

      {/* 4 Swatches */}
      <div className="space-y-1.5">
        {scores.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-[11px] text-gray-700">
            <span
              className="w-2.5 h-2.5 rounded-xs shrink-0"
              style={{ backgroundColor: s.color }}
            />
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Bottom Scale Bar */}
      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-end gap-2 text-[11px] text-gray-600 font-medium">
        <div className="flex items-center gap-1.5">
          <div className="h-1 bg-black w-10 rounded-xs" />
          <span className="font-semibold text-[10px]">1 Km</span>
        </div>
      </div>
    </div>
  );
}
