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
            <div className="absolute right-12 bottom-0 z-50 w-72 sm:w-80 bg-white rounded-2xl border border-gray-200/90 shadow-2xl p-3.5 animate-in fade-in zoom-in-95 duration-150 select-none max-h-[85vh] overflow-y-auto">
              {/* Popover Header */}
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#EAFBF7] flex items-center justify-center text-[#005B54]">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-tight">Lapisan & Analisis SIG</h4>
                    <p className="text-[10px] text-gray-400">Pilih gaya basemap & layer overlay</p>
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
              <div className="mb-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  PETA DASAR (BASEMAP)
                </span>
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
                          'flex flex-col items-center justify-center p-2 rounded-xl border text-[10px] font-semibold transition-all cursor-pointer text-center gap-1',
                          isActive
                            ? 'bg-[#EAFBF7] border-[#005B54] text-[#005B54] shadow-2xs font-bold'
                            : 'bg-gray-50/80 border-gray-200/80 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="leading-tight">{opt.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Spatial Overlays matching user reference */}
              <div className="pt-2 border-t border-gray-100 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  OVERLAY SPASIAL & GIS
                </span>

                {/* 1. Radius Buffer IPB */}
                <div
                  onClick={() => onToggleOverlay?.('buffer', 'Radius Buffer IPB (500m & 1km)')}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors select-none"
                >
                  <div className="flex flex-col pr-2">
                    <span className="text-xs font-bold text-gray-900 leading-tight">Radius Buffer IPB</span>
                    <span className="text-[10.5px] text-gray-500">Cakupan 500m & 1km</span>
                  </div>
                  <div
                    className={cn(
                      'w-9 h-5 rounded-full transition-colors relative shrink-0',
                      overlays.buffer ? 'bg-[#005B54]' : 'bg-gray-200'
                    )}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 shadow-xs',
                        overlays.buffer ? 'translate-x-4.5' : 'translate-x-0.5'
                      )}
                    />
                  </div>
                </div>

                {/* 2. Isochrone Jalan Kaki */}
                <div
                  onClick={() => onToggleOverlay?.('isochrone', 'Isochrone Jalan Kaki (10 menit)')}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors select-none"
                >
                  <div className="flex flex-col pr-2">
                    <span className="text-xs font-bold text-gray-900 leading-tight">Isochrone Jalan Kaki</span>
                    <span className="text-[10.5px] text-gray-500">Area 10 menit tempuh</span>
                  </div>
                  <div
                    className={cn(
                      'w-9 h-5 rounded-full transition-colors relative shrink-0',
                      overlays.isochrone ? 'bg-[#005B54]' : 'bg-gray-200'
                    )}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 shadow-xs',
                        overlays.isochrone ? 'translate-x-4.5' : 'translate-x-0.5'
                      )}
                    />
                  </div>
                </div>

                {/* 3. Heatmap Kepadatan */}
                <div
                  onClick={() => onToggleOverlay?.('heatmap', 'Heatmap Kepadatan Spot Nugas')}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors select-none"
                >
                  <div className="flex flex-col pr-2">
                    <span className="text-xs font-bold text-gray-900 leading-tight">Heatmap Kepadatan</span>
                    <span className="text-[10.5px] text-gray-500">Konsentrasi spot nugas</span>
                  </div>
                  <div
                    className={cn(
                      'w-9 h-5 rounded-full transition-colors relative shrink-0',
                      overlays.heatmap ? 'bg-[#005B54]' : 'bg-gray-200'
                    )}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 shadow-xs',
                        overlays.heatmap ? 'translate-x-4.5' : 'translate-x-0.5'
                      )}
                    />
                  </div>
                </div>

                {/* 4. Halte & Rute Biskita */}
                <div
                  onClick={() => onToggleOverlay?.('transit', 'Halte & Rute Biskita Transpakuan')}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors select-none"
                >
                  <div className="flex flex-col pr-2">
                    <span className="text-xs font-bold text-gray-900 leading-tight">Halte & Rute Biskita</span>
                    <span className="text-[10.5px] text-gray-500">Akses angkutan umum</span>
                  </div>
                  <div
                    className={cn(
                      'w-9 h-5 rounded-full transition-colors relative shrink-0',
                      overlays.transit ? 'bg-[#005B54]' : 'bg-gray-200'
                    )}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 shadow-xs',
                        overlays.transit ? 'translate-x-4.5' : 'translate-x-0.5'
                      )}
                    />
                  </div>
                </div>
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

// Map legend — score color swatches matching Figma
export function MapLegend({ onClose, className }: MapLegendProps = {}) {
  const scores = [
    { label: '0,9 – 1,0 (Sangat Ideal)', color: '#005B54' },
    { label: '0,8 – 0,89 (Bagus)', color: '#10B981' },
    { label: '0,6 – 0,79 (Cukup)', color: '#F59E0B' },
    { label: '< 0,6 (Kurang Kondusif)', color: '#EF4444' },
  ];

  return (
    <div className={cn('glass-island rounded-2xl shadow-xl p-3.5 w-64 select-none', className)}>
      {/* Title with Info icon and optional close button */}
      <div className="flex items-center justify-between mb-2.5 pb-1 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <h4 className="text-xs font-extrabold text-slate-900 tracking-tight">
            Skor Kesesuaian Spasial
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

      {/* 4 Swatches */}
      <div className="space-y-1.5">
        {scores.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-[11px] text-slate-700 font-medium">
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0 shadow-2xs"
              style={{ backgroundColor: s.color }}
            />
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Bottom Scale Bar */}
      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end gap-2 text-[11px] text-slate-600 font-semibold">
        <div className="flex items-center gap-1.5">
          <div className="h-1 bg-slate-800 w-10 rounded-full" />
          <span className="text-[10px]">1 Km</span>
        </div>
      </div>
    </div>
  );
}

