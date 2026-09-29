'use client';

import { ChevronRight, SlidersHorizontal } from 'lucide-react';
import type { RecommendationRequest } from '@/lib/recommendations';
import { RecommendationCriteriaSummary } from '@/components/recommendations';

export interface AISpatialMatchBannerProps {
  request: RecommendationRequest;
  totalCount: number;
  topPlaceName?: string | null;
  onChangeFilter?: () => void;
}

export function AISpatialMatchBanner({
  request,
  totalCount,
  topPlaceName = null,
  onChangeFilter,
}: AISpatialMatchBannerProps) {
  const resultCopy = totalCount > 0
    ? `${totalCount} tempat sesuai kriteria aktif.`
    : 'Atur kriteria agar hasil lebih sesuai kebutuhanmu.';

  return (
    <section className="rounded-2xl bg-[#F2F8F6] p-3.5 ring-1 ring-teal-200" aria-labelledby="preference-summary-title">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#005B54] text-white shadow-[0_4px_10px_-6px_rgba(0,91,84,0.9)]">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 id="preference-summary-title" className="text-xs font-extrabold tracking-tight text-slate-900">
              Kecocokan preferensi
            </h2>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">{resultCopy}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onChangeFilter}
          className="inline-flex min-h-8 shrink-0 items-center gap-0.5 rounded-lg px-2 text-[11px] font-bold text-[#005B54] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54]"
        >
          Ubah
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3">
        <RecommendationCriteriaSummary request={request} />
      </div>

      {topPlaceName && (
        <p className="mt-3 border-t border-teal-200 pt-2.5 text-[11px] text-slate-600">
          Peringkat teratas saat ini: <strong className="font-bold text-slate-900">{topPlaceName}</strong>
        </p>
      )}
    </section>
  );
}
