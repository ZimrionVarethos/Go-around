'use client';

import { useState, useEffect } from 'react';
import {
  Check,
  ChevronsLeft,
  ChevronsRight,
  ChevronsDown,
  ChevronsUp,
  Map as MapIcon,
  SlidersHorizontal,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import type { PlaceListItem } from '@/lib/types';
import { AISpatialMatchBanner } from './AISpatialMatchBanner';
import { PlaceCard } from './PlaceCard';
import type { ToastType } from '@/hooks/useToast';

export interface RecommendationPanelProps {
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
  sortTab: 'score' | 'nearby' | 'budget';
  onSortChange: (tab: 'score' | 'nearby' | 'budget') => void;
  places: PlaceListItem[];
  selectedSlug: string | null;
  onSelectPlace: (slug: string) => void;
  onDownloadGeoJson: () => void;
  onToast?: (msg: string, type?: ToastType, durationMs?: number) => void;
  showLegend?: boolean;
  onToggleLegend?: () => void;
  className?: string;
}

export function RecommendationPanel({
  isCollapsed,
  onToggleCollapse,
  sortTab,
  onSortChange,
  places,
  selectedSlug,
  onSelectPlace,
  onDownloadGeoJson,
  onToast,
  showLegend = false,
  onToggleLegend,
  className,
}: RecommendationPanelProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ==========================================================
   * MOBILE: Bottom Sheet
   * ========================================================== */
  if (isMobile) {
    if (isCollapsed) {
      return (
        <div
          onClick={() => onToggleCollapse(false)}
          className={cn(
            'absolute bottom-[44px] left-1/2 -translate-x-1/2 z-[400] bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-full shadow-lg hover:shadow-xl hover:border-[#005B54]/50 transition-all duration-300 cursor-pointer flex items-center gap-2.5 px-4 py-2 select-none pointer-events-auto group animate-in fade-in slide-in-from-bottom-2',
            className
          )}
        >
          <ChevronsUp className="w-4 h-4 text-[#005B54]" />
          <span className="font-extrabold text-xs text-gray-900 tracking-tight group-hover:text-[#005B54] transition-colors">
            Rekomendasi Nugas
          </span>
          <span className="inline-flex items-center gap-1 bg-[#E8F8F5] text-[#005B54] text-[11px] font-bold px-2 py-0.5 rounded-full">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
            <span>108 Spot</span>
          </span>
        </div>
      );
    }

    return (
      <aside
        className={cn(
          'absolute bottom-0 left-0 right-0 z-[400] bg-white rounded-t-2xl shadow-2xl border-t border-gray-100 flex flex-col pointer-events-auto max-h-[58vh] animate-in fade-in slide-in-from-bottom-2 duration-300',
          className
        )}
      >
        {/* Drag Handle */}
        <div
          onClick={() => onToggleCollapse(true)}
          className="flex flex-col items-center pt-2 pb-0 cursor-pointer shrink-0"
        >
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
          <div className="w-full flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-gray-900 tracking-tight">
                Rekomendasi Nugas Bogor
              </h2>
              <span className="inline-flex items-center gap-1 bg-[#E8F8F5] text-[#005B54] text-xs font-bold px-2 py-0.5 rounded-full">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>108 Spot</span>
              </span>
            </div>
            <ChevronsDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Sort Tabs */}
        <div className="px-4 pb-2 shrink-0">
          <div className="grid grid-cols-3 p-1 bg-[#F3F4F6] rounded-xl gap-1">
            {([
              { id: 'score' as const, label: 'Skor' },
              { id: 'nearby' as const, label: 'Terdekat' },
              { id: 'budget' as const, label: 'Terhemat' },
            ]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => onSortChange(tab.id)}
                className={cn(
                  'py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center',
                  sortTab === tab.id
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 no-scrollbar">
        <AISpatialMatchBanner
          onChangeFilter={() => onToast?.('Filter AI: Fitur kustomisasi filter spatial akan tersedia segera! Gunakan filter chip di atas peta untuk sementara.', 'info', 4000)}
        />
          <div className="space-y-3 pb-2">
            {places.map((place: PlaceListItem, idx: number) => (
              <PlaceCard
                key={place.id}
                place={place}
                rank={idx + 1}
                isSelected={place.slug === selectedSlug}
                onSelect={onSelectPlace}
              />
            ))}
          </div>
        </div>

        {/* Bottom Toolbar */}
        <div className="border-t border-gray-100 px-4 py-2.5 bg-white shrink-0 flex items-center justify-between text-xs text-gray-600">
          <button
            type="button"
            onClick={onToggleLegend}
            className={cn(
              'flex items-center gap-1.5 font-medium transition-all cursor-pointer px-2.5 py-1 rounded-lg',
              showLegend
                ? 'text-[#005B54] bg-[#E8F8F5] font-semibold ring-1 ring-[#A7F3D0]'
                : 'hover:text-gray-900 text-gray-600 hover:bg-gray-100'
            )}
            title={showLegend ? 'Sembunyikan Legenda' : 'Tampilkan Legenda'}
          >
            <MapIcon className={cn('w-3.5 h-3.5', showLegend ? 'text-[#005B54]' : 'text-gray-500')} />
            <span>Legenda</span>
          </button>
          <button
            onClick={onDownloadGeoJson}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#E8F8F5] hover:bg-[#d4f2ec] text-[#005B54] font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span>Unduh GeoJSON</span>
          </button>
        </div>
      </aside>
    );
  }

  /* ==========================================================
   * DESKTOP: Left Sidebar (original layout preserved)
   * ========================================================== */
  if (isCollapsed) {
    return (
      <div
        onClick={() => onToggleCollapse(false)}
        className={cn(
          'absolute top-[138px] left-6 z-[400] bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-2xl shadow-lg hover:shadow-xl hover:border-[#005B54]/50 transition-all duration-300 cursor-pointer flex items-center gap-2.5 px-3.5 py-2.5 select-none pointer-events-auto group animate-in fade-in slide-in-from-left-2',
          className
        )}
        title="Klik untuk membuka rekomendasi lengkap"
      >
        <div className="w-6 h-6 rounded-lg bg-[#E8F8F5] text-[#005B54] flex items-center justify-center group-hover:scale-110 transition-transform">
          <ChevronsRight className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-xs text-gray-900 tracking-tight group-hover:text-[#005B54] transition-colors">
            Rekomendasi Nugas
          </span>
          <span className="text-gray-300 text-xs">•</span>
          <span className="inline-flex items-center gap-1 bg-[#E8F8F5] text-[#005B54] text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
            <span>108 Spot</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        'absolute top-[138px] left-6 bottom-3.5 w-[430px] z-[400] bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-left-2',
        className
      )}
    >
      {/* Sidebar Card Header */}
      <div className="p-4 pb-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-gray-900 tracking-tight">
              Rekomendasi Nugas Bogor
            </h1>
            <span className="inline-flex items-center gap-1 bg-[#E8F8F5] text-[#005B54] text-xs font-bold px-2 py-0.5 rounded-full">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>108 Spot</span>
            </span>
          </div>
          <button
            onClick={() => onToggleCollapse(true)}
            className="w-7 h-7 rounded-lg hover:bg-[#E8F8F5] text-gray-400 hover:text-[#005B54] flex items-center justify-center transition-colors cursor-pointer"
            title="Ciutkan Panel (Collapse)"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11.5px] text-gray-500 mt-0.5">
          Terverifikasi Lapangan oleh Mahasiswa IPB University
        </p>
      </div>

      {/* Sort Tabs */}
      <div className="px-4 py-1.5 shrink-0">
        <div className="grid grid-cols-3 p-1 bg-[#F3F4F6] rounded-xl gap-1">
          <button
            onClick={() => onSortChange('score')}
            className={cn(
              'py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center',
              sortTab === 'score'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            )}
          >
            Skor Tertinggi
          </button>
          <button
            onClick={() => onSortChange('nearby')}
            className={cn(
              'py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center',
              sortTab === 'nearby'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            )}
          >
            Paling Dekat
          </button>
          <button
            onClick={() => onSortChange('budget')}
            className={cn(
              'py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center',
              sortTab === 'budget'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            )}
          >
            Paling Hemat
          </button>
        </div>
      </div>

      {/* Scrollable List Body */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 no-scrollbar">
        <AISpatialMatchBanner
          onChangeFilter={() => onToast?.('Filter AI: Fitur kustomisasi filter spatial akan tersedia segera! Gunakan filter chip di atas peta untuk sementara.', 'info', 4000)}
        />
        <div className="space-y-3 pb-2">
          {places.map((place: PlaceListItem, idx: number) => (
            <PlaceCard
              key={place.id}
              place={place}
              rank={idx + 1}
              isSelected={place.slug === selectedSlug}
              onSelect={onSelectPlace}
              onToast={onToast}
            />
          ))}
        </div>
      </div>

      {/* Bottom GIS Toolbar */}
      <div className="border-t border-gray-100 px-4 py-2.5 bg-white shrink-0 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleLegend}
            className={cn(
              'flex items-center gap-1.5 font-medium transition-all cursor-pointer px-2.5 py-1 rounded-lg',
              showLegend
                ? 'text-[#005B54] bg-[#E8F8F5] font-semibold ring-1 ring-[#A7F3D0]'
                : 'hover:text-gray-900 text-gray-600 hover:bg-gray-100'
            )}
            title={showLegend ? 'Sembunyikan Legenda Peta' : 'Tampilkan Legenda Peta'}
          >
            <MapIcon className={cn('w-3.5 h-3.5', showLegend ? 'text-[#005B54]' : 'text-gray-500')} />
            <span>Legenda Peta</span>
          </button>
          <button
            onClick={() => onToast?.('Pengaturan GIS: Fitur ini akan tersedia segera. Stay tuned! 🗺️', 'info')}
            className="flex items-center gap-1.5 hover:text-gray-900 font-medium transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
            <span>Pengaturan GIS</span>
          </button>
        </div>
        <button
          onClick={onDownloadGeoJson}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#E8F8F5] hover:bg-[#d4f2ec] text-[#005B54] font-semibold text-xs rounded-lg transition-colors cursor-pointer"
        >
          <Download className="w-3 h-3" />
          <span>Unduh GeoJSON</span>
        </button>
      </div>
    </aside>
  );
}
