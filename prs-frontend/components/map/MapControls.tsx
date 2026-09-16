'use client';

import { useState } from 'react';
import { Locate, Plus, Minus, Layers, Compass, Info, X, Map as MapIcon, Globe, Sun, Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { ToastType } from '@/hooks/useToast';

export type TileLayerType = 'osm' | 'satellite' | 'carto';

export interface MapControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onLocate?: () => void;
  onResetCompass?: () => void;
  currentLayer?: TileLayerType;
  onChangeLayer?: (layer: TileLayerType) => void;
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
    setShowLayerMenu(false);
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
            <div className="absolute right-12 bottom-0 z-50 w-60 bg-white rounded-2xl border border-gray-200/90 shadow-2xl p-2.5 animate-in fade-in zoom-in-95 duration-150 select-none">
              <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#005B54]" />
                  Pilih Lapisan Peta
                </span>
                <button
                  type="button"
                  onClick={() => setShowLayerMenu(false)}
                  title="Tutup Menu"
                  className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                {layerOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = currentLayer === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectLayer(opt.id, opt.name)}
                      className={cn(
                        'w-full text-left flex items-center justify-between px-2.5 py-2 rounded-xl transition-all text-xs cursor-pointer',
                        isActive
                          ? 'bg-[#E8F8F5] text-[#005B54] font-semibold ring-1 ring-[#A7F3D0]'
                          : 'hover:bg-gray-50 text-gray-700 font-medium'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-[#005B54]' : 'text-gray-500')} />
                        <div>
                          <div className="font-semibold leading-snug">{opt.name}</div>
                          <div className="text-[10.5px] text-gray-400 font-normal">{opt.desc}</div>
                        </div>
                      </div>
                      {isActive && <Check className="w-3.5 h-3.5 text-[#005B54] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <button
          type="button"
          title="Pilih Lapisan Peta (OSM / Satelit / Terang)"
          onClick={() => setShowLayerMenu((prev) => !prev)}
          className={cn(
            'w-10 h-10 border rounded-xl shadow-md flex items-center justify-center transition-all cursor-pointer relative z-40',
            showLayerMenu
              ? 'bg-[#E8F8F5] text-[#005B54] border-[#005B54] ring-2 ring-[#005B54]/20'
              : 'bg-white border-gray-200/80 text-gray-700 hover:text-[#005B54] hover:bg-gray-50 active:bg-gray-100 active:scale-95'
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
        className="w-10 h-10 bg-white border border-gray-200/80 rounded-xl shadow-md flex items-center justify-center text-gray-700 hover:text-[#005B54] hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all cursor-pointer"
      >
        <Locate className="w-4 h-4" />
      </button>

      {/* 3. Zoom In */}
      <button
        type="button"
        title="Perbesar Peta (+)"
        onClick={handleZoomIn}
        className="w-10 h-10 bg-white border border-gray-200/80 rounded-xl shadow-md flex items-center justify-center text-gray-700 hover:text-[#005B54] hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* 4. Zoom Out */}
      <button
        type="button"
        title="Perkecil Peta (-)"
        onClick={handleZoomOut}
        className="w-10 h-10 bg-white border border-gray-200/80 rounded-xl shadow-md flex items-center justify-center text-gray-700 hover:text-[#005B54] hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all cursor-pointer"
      >
        <Minus className="w-4 h-4" />
      </button>

      {/* 5. Compass */}
      <button
        type="button"
        title="Reset ke Pusat Bogor (Utara ↑)"
        onClick={onResetCompass}
        className="w-10 h-10 bg-white border border-gray-200/80 rounded-xl shadow-md flex items-center justify-center text-gray-700 hover:text-[#005B54] hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all cursor-pointer"
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
    <div className={cn('bg-white rounded-2xl border border-gray-200/90 shadow-lg p-3.5 w-60 select-none', className)}>
      {/* Title with Info icon and optional close button */}
      <div className="flex items-center justify-between mb-2.5 pb-1 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <h4 className="text-xs font-bold text-gray-900">
            Skor Kesesuaian
          </h4>
          <Info className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            title="Tutup Legenda"
            className="w-5 h-5 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
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
