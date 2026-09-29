'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  Download,
  Map as MapIcon,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import {
  DEFAULT_RECOMMENDATION_REQUEST,
  type RecommendationRequest,
} from '@/lib/recommendations';
import {
  RecommendationCriteria,
  RecommendationEmptyState,
  RecommendationErrorState,
  RecommendationLoadingState,
} from '@/components/recommendations';
import { AISpatialMatchBanner } from './AISpatialMatchBanner';
import { PlaceCard, type PlaceCardPlace } from './PlaceCard';
import type { ToastType } from '@/hooks/useToast';

export interface RecommendationPanelProps {
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
  sortTab: 'score' | 'nearby' | 'budget';
  onSortChange: (tab: 'score' | 'nearby' | 'budget') => void;
  places: PlaceCardPlace[];
  totalCount?: number;
  selectedSlug: string | null;
  onSelectPlace: (slug: string) => void;
  onDownloadGeoJson: () => void;
  onToast?: (msg: string, type?: ToastType, durationMs?: number) => void;
  showLegend?: boolean;
  onToggleLegend?: () => void;
  recommendationRequest?: RecommendationRequest;
  onSubmitRecommendation?: (request: RecommendationRequest) => void;
  onRequestLocation?: () => void;
  isRecommendationLoading?: boolean;
  recommendationError?: boolean;
  onRetryRecommendation?: () => void;
  className?: string;
}

export function RecommendationPanel({
  isCollapsed,
  onToggleCollapse,
  sortTab,
  onSortChange,
  places,
  totalCount,
  selectedSlug,
  onSelectPlace,
  onDownloadGeoJson,
  onToast,
  showLegend = false,
  onToggleLegend,
  recommendationRequest,
  onSubmitRecommendation,
  onRequestLocation,
  isRecommendationLoading = false,
  recommendationError = false,
  onRetryRecommendation,
  className,
}: RecommendationPanelProps) {
  const [view, setView] = useState<'results' | 'criteria'>('results');
  const [localRequest, setLocalRequest] = useState<RecommendationRequest>(
    DEFAULT_RECOMMENDATION_REQUEST,
  );
  const activeRequest = recommendationRequest ?? localRequest;
  const spotCount = totalCount ?? places.length;

  const submitCriteria = (request: RecommendationRequest) => {
    setLocalRequest(request);
    onSubmitRecommendation?.(request);
    setView('results');
    onToggleCollapse(false);
    onToast?.('Preferensi rekomendasi diperbarui.', 'success', 2500);
  };

  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={() => onToggleCollapse(false)}
        className={cn(
          'absolute bottom-[44px] left-1/2 z-[400] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-white/95 px-4 py-2 text-left shadow-[0_10px_26px_-14px_rgba(15,23,42,0.65)] ring-1 ring-slate-200 backdrop-blur-md transition-shadow hover:shadow-[0_14px_30px_-14px_rgba(0,91,84,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54] md:bottom-auto md:left-6 md:top-[138px] md:translate-x-0 md:rounded-2xl md:px-3.5 md:py-2.5',
          className,
        )}
        aria-label="Buka panel rekomendasi"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#E8F8F5] text-[#005B54]">
          <ChevronsUp className="h-4 w-4 md:hidden" aria-hidden="true" />
          <ChevronsRight className="hidden h-4 w-4 md:block" aria-hidden="true" />
        </span>
        <span className="text-xs font-extrabold tracking-tight text-slate-900">Rekomendasi Nugas</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F8F5] px-2 py-0.5 text-[11px] font-bold text-[#005B54]">
          <Check className="h-2.5 w-2.5 stroke-[3]" aria-hidden="true" />
          {spotCount} spot
        </span>
      </button>
    );
  }

  return (
    <aside
      aria-label={view === 'criteria' ? 'Pengaturan preferensi rekomendasi' : 'Daftar rekomendasi tempat nugas'}
      className={cn(
        'absolute bottom-0 left-0 right-0 z-[400] flex max-h-[62vh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_18px_48px_-18px_rgba(15,23,42,0.55)] ring-1 ring-slate-200 pointer-events-auto',
        view === 'criteria' && 'max-h-[82vh]',
        'md:bottom-3.5 md:left-6 md:right-auto md:top-[138px] md:max-h-none md:w-[430px] md:rounded-2xl',
        className,
      )}
    >
      <header className="shrink-0 border-b border-slate-100 bg-white px-4 pb-2.5 pt-2 md:pt-4">
        <button
          type="button"
          onClick={() => onToggleCollapse(true)}
          className="mx-auto mb-2 block h-1 w-10 rounded-full bg-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54] md:hidden"
          aria-label="Tutup panel rekomendasi"
        />
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {view === 'criteria' && (
              <button
                type="button"
                onClick={() => setView('results')}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54]"
                aria-label="Kembali ke hasil rekomendasi"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-[16px] font-extrabold tracking-tight text-slate-900">
                  {view === 'criteria' ? 'Atur Preferensi' : 'Rekomendasi Nugas Bogor'}
                </h1>
                {view === 'results' && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#E8F8F5] px-2 py-0.5 text-[11px] font-bold text-[#005B54]">
                    {spotCount} spot
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500">
                {view === 'criteria'
                  ? 'Sesuaikan jarak, budget, dan fasilitas wajib'
                  : 'Data yang belum tersedia ditandai dengan jelas'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onToggleCollapse(true)}
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54] md:flex"
            aria-label="Ciutkan panel rekomendasi"
          >
            <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onToggleCollapse(true)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54] md:hidden"
            aria-label="Ciutkan panel rekomendasi"
          >
            <ChevronsDown className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      {view === 'criteria' ? (
        <RecommendationCriteria
          key={JSON.stringify(activeRequest)}
          initialValue={activeRequest}
          onSubmit={submitCriteria}
          onCancel={() => setView('results')}
          onRequestLocation={onRequestLocation}
          isSubmitting={isRecommendationLoading}
        />
      ) : (
        <>
          <div className="shrink-0 px-4 py-2">
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
              {([
                { id: 'score' as const, label: 'Kecocokan' },
                { id: 'nearby' as const, label: 'Terdekat' },
                { id: 'budget' as const, label: 'Terhemat' },
              ]).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSortChange(tab.id)}
                  aria-pressed={sortTab === tab.id}
                  className={cn(
                    'min-h-9 rounded-lg px-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54]',
                    sortTab === tab.id
                      ? 'bg-white text-slate-900 shadow-[0_3px_8px_-6px_rgba(15,23,42,0.7)]'
                      : 'text-slate-500 hover:text-slate-900',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-2 no-scrollbar">
            <AISpatialMatchBanner
              request={activeRequest}
              totalCount={spotCount}
              topPlaceName={places[0]?.name ?? null}
              onChangeFilter={() => setView('criteria')}
            />

            {isRecommendationLoading ? (
              <RecommendationLoadingState />
            ) : recommendationError ? (
              <RecommendationErrorState onRetry={onRetryRecommendation} />
            ) : places.length === 0 ? (
              <RecommendationEmptyState
                query={activeRequest.search_query ?? activeRequest.natural_language_query}
                onChangeCriteria={() => setView('criteria')}
              />
            ) : (
              <div className="space-y-3 pb-2">
                {places.map((place, index) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    rank={index + 1}
                    isSelected={place.slug === selectedSlug}
                    onSelect={onSelectPlace}
                    onToast={onToast}
                  />
                ))}
              </div>
            )}
          </div>

          <footer className="flex shrink-0 items-center justify-between border-t border-slate-100 bg-white px-4 py-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleLegend}
                className={cn(
                  'inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54]',
                  showLegend
                    ? 'bg-[#E8F8F5] text-[#005B54]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )}
              >
                <MapIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Legenda
              </button>
              <button
                type="button"
                onClick={() => setView('criteria')}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54]"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                Kriteria
              </button>
            </div>
            <button
              type="button"
              onClick={onDownloadGeoJson}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#E8F8F5] px-2.5 font-bold text-[#005B54] transition-colors hover:bg-[#D4F2EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54]"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              GeoJSON
            </button>
          </footer>
        </>
      )}
    </aside>
  );
}
