'use client';

import { useState } from 'react';
import { Locate, Plus, Minus, Layers, Compass, Info, X, Map as MapIcon, Globe, Sun } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { ToastType } from '@/hooks/useToast';

export type TileLayerType = 'osm' | 'satellite' | 'carto';

export interface SpatialOverlays {
  buffer: boolean;
  isochrone: boolean;
  heatmap: boolean;
  transit: boolean;
}

export const DEFAULT_SPATIAL_OVERLAYS: SpatialOverlays = {
  buffer: false,
  isochrone: false,
  heatmap: false,
  transit: false,
};

export interface MapControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onLocate?: () => void;
  onResetCompass?: () => void;
  currentLayer?: TileLayerType;
  onChangeLayer?: (layer: TileLayerType) => void;
  overlays?: SpatialOverlays;
  onToggleOverlay?: (overlayKey: keyof SpatialOverlays, label: string) => void;
  onToast?: (msg: string, type?: ToastType, durationMs?: number) => void;
  className?: string;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onLocate,
  onResetCompass,
  currentLayer = 'osm',
  onChangeLayer,
  overlays = DEFAULT_SPATIAL_OVERLAYS,
  onToggleOverlay,
  onToast,
  className,
}: MapControlsProps) {
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  const layerOptions: { id: TileLayerType; name: string; desc: string; icon: typeof MapIcon }[] = [
    { id: 'osm', name: 'Standar (OSM)', desc: 'Peta jalan umum OSM', icon: MapIcon },
    { id: 'satellite', name: 'Satelit', desc: 'Citra foto udara Esri', icon: Globe },
    { id: 'carto', name: 'Terang Minimal', desc: 'Gaya bersih Carto Positron', icon: Sun },
  ];

  const handleSelectLayer = (id: TileLayerType, name: string) => {
    onChangeLayer?.(id);
    onToast?.(`Lapisan peta aktif: ${name} 🗺️`, 'info', 2000);
  };

  const handleZoomIn = () => {
    if (onZoomIn) {
      onZoomIn();
    } else {
      const el = document.querySelector('.leaflet-container');
      const map = (el as unknown as { _leaflet_map?: { zoomIn: () => void } })?._leaflet_map;
      map?.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (onZoomOut) {
      onZoomOut();
    } else {
      const el = document.querySelector('.leaflet-container');
      const map = (el as unknown as { _leaflet_map?: { zoomOut: () => void } })?._leaflet_map;
      map?.zoomOut();
    }
  };

  return (
    <div className={cn('flex flex-col gap-2 relative', className)}>
      {/* 1. Layers with Popover Menu */}
      <div className="relative">
        {showLayerMenu && (
          <>
            <div
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setShowLayerMenu(false)}
            />
            <div className="absolute right-12 bottom-0 z-50 w-72 bg-white rounded-2xl border border-gray-200/90 shadow-2xl p-3.5 animate-in fade-in zoom-in-95 duration-150 select-none">
              {/* Popover Header */}
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#EAFBF7] flex items-center justify-center text-[#005B54]">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-tight">Peta Dasar (Basemap)</h4>
                    <p className="text-[10px] text-gray-400">Pilih gaya tampilan peta</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLayerMenu(false)}
                  title="Tutup Menu"
                  className="w-5 h-5 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Basemap Styles */}
              <div className="grid grid-cols-3 gap-1.5">
                {layerOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = currentLayer === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectLayer(opt.id, opt.name)}
                      className={cn(
                        'flex flex-col items-center justify-center p-2.5 rounded-xl border text-[10px] font-semibold transition-all cursor-pointer text-center gap-1.5',
                        isActive
                          ? 'bg-[#EAFBF7] border-[#005B54] text-[#005B54] shadow-2xs font-bold'
                          : 'bg-gray-50/80 border-gray-200/80 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="leading-tight">{opt.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <button
          type="button"
          title="Pilih Lapisan Peta & Analisis SIG"
          onClick={() => setShowLayerMenu((prev) => !prev)}
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative z-40 tactile-press',
            showLayerMenu
              ? 'bg-[#005B54] text-white shadow-[0_4px_12px_rgba(0,91,84,0.3)] ring-2 ring-[#005B54]/20'
              : 'glass-island text-slate-700 hover:text-[#005B54] hover:border-[#005B54]/30'
          )}
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Locate User */}
      <button
        type="button"
        title="Lokasi Anda (GPS)"
        onClick={onLocate}
        className="w-10 h-10 glass-island rounded-xl flex items-center justify-center text-slate-700 hover:text-[#005B54] hover:border-[#005B54]/30 transition-all cursor-pointer tactile-press"
      >
        <Locate className="w-4 h-4" />
      </button>

      {/* 3. Zoom In */}
      <button
        type="button"
        title="Perbesar Peta (+)"
        onClick={handleZoomIn}
        className="w-10 h-10 glass-island rounded-xl flex items-center justify-center text-slate-700 hover:text-[#005B54] hover:border-[#005B54]/30 transition-all cursor-pointer tactile-press"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* 4. Zoom Out */}
      <button
        type="button"
        title="Perkecil Peta (-)"
        onClick={handleZoomOut}
        className="w-10 h-10 glass-island rounded-xl flex items-center justify-center text-slate-700 hover:text-[#005B54] hover:border-[#005B54]/30 transition-all cursor-pointer tactile-press"
      >
        <Minus className="w-4 h-4" />
      </button>

      {/* 5. Compass */}
      <button
        type="button"
        title="Reset ke Pusat Bogor (Utara ↑)"
        onClick={onResetCompass}
        className="w-10 h-10 glass-island rounded-xl flex items-center justify-center text-slate-700 hover:text-[#005B54] hover:border-[#005B54]/30 transition-all cursor-pointer tactile-press"
      >
        <Compass className="w-4 h-4" />
      </button>
    </div>
  );
}

export interface MapLegendProps {
  onClose?: () => void;
  className?: string;
}

// Map legend — score color swatches & spatial symbols matching the actual map
export function MapLegend({ onClose, className }: MapLegendProps = {}) {
  const scores = [
    { label: '85% – 100% (Sangat Cocok)', desc: 'Rekomendasi Utama', color: '#005B54' },
    { label: '70% – 84% (Bagus / Cocok)', desc: 'Kondusif & Layak', color: '#10B981' },
    { label: '50% – 69% (Cukup)', desc: 'Standar Fasilitas', color: '#F59E0B' },
    { label: '< 50% (Kurang Sesuai)', desc: 'Di Bawah Preferensi', color: '#EF4444' },
  ];

  return (
    <div className={cn('glass-island rounded-2xl shadow-xl p-3.5 w-72 select-none border border-slate-100', className)}>
      {/* Title with Info icon and optional close button */}
      <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <h4 className="text-xs font-extrabold text-slate-900 tracking-tight">
            Legenda Peta Go-around
          </h4>
          <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600" />
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            title="Tutup Legenda"
            className="w-5 h-5 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Spot Nugas Pins (Matching Actual Map Marker) */}
      <div className="mb-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Kesesuaian Tempat Nugas
        </p>
        <div className="space-y-2">
          {scores.map((s) => (
            <div key={s.label} className="flex items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-2 min-w-0">
                {/* Mini teardrop pin symbol matching map marker */}
                <div className="flex flex-col items-center shrink-0 w-3.5 pt-0.5">
                  <div
                    className="w-3 h-3 rounded-full border border-white shadow-2xs"
                    style={{ backgroundColor: s.color }}
                  />
                  <div
                    className="w-0 h-0 border-l-[2.5px] border-l-transparent border-r-[2.5px] border-r-transparent border-t-[3.5px] -mt-0.5"
                    style={{ borderTopColor: s.color }}
                  />
                </div>
                <span className="font-semibold text-slate-800 truncate">{s.label}</span>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 font-medium">{s.desc}</span>
            </div>
          ))}

          {/* User GPS location symbol */}
          <div className="flex items-center justify-between gap-2 text-[11px] pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="relative w-3.5 h-3.5 flex items-center justify-center shrink-0">
                <span className="absolute inset-0 rounded-full bg-sky-400/40 animate-ping" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] border border-white shrink-0 shadow-xs" />
              </div>
              <span className="font-semibold text-slate-800">Posisi Anda (GPS)</span>
            </div>
            <span className="text-[10px] text-sky-600 font-medium">Titik Pengguna</span>
          </div>
        </div>
      </div>

      {/* Bottom Scale Bar */}
      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
        <span>Sistem Proyeksi WGS 84</span>
        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
          <div className="h-1 bg-slate-800 w-8 rounded-full" />
          <span>1 Km</span>
        </div>
      </div>
    </div>
  );
}

