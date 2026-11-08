'use client';

import { Sparkles, SlidersHorizontal, Trophy } from 'lucide-react';
import type { RecommendationRequest } from '@/lib/recommendations';
import { RecommendationCriteriaSummary } from '@/components/recommendations';

export interface AISpatialMatchBannerProps {
  request: RecommendationRequest;
  totalCount: number;
  topPlaceName?: string | null;
  topMatchScore?: number | null;
  onChangeFilter?: () => void;
}

function getAiInsight(request: RecommendationRequest, totalCount: number): string {
  if (request.natural_language_query) {
    return `Menyesuaikan kebutuhan “${request.natural_language_query}”. Menemukan ${totalCount} spot paling relevan untukmu.`;
  }
  if (request.search_query) {
    return `Menampilkan hasil pencarian “${request.search_query}” dengan skor kecocokan tertinggi.`;
  }

  const hasPlug = request.must_have.includes('plug');
  const hasQuiet = request.weights.quiet >= 0.25 || request.preset === 'quiet';
  const hasBudget = request.max_price !== null && request.max_price <= 25000;
  const isNearby = request.sort_by === 'distance' || request.preset === 'nearby';

  if (hasPlug && hasQuiet) {
    return 'Memprioritaskan kafe hening (< 45dB) dengan colokan melimpah untuk fokus nugas dan kerja.';
  }
  if (hasPlug) {
    return 'Menampilkan spot nugas dengan ketersediaan colokan melimpah di setiap area meja.';
  }
  if (hasQuiet) {
    return 'Memprioritaskan suasana tenang dan kondusif agar kamu bisa fokus tanpa distraksi bising.';
  }
  if (hasBudget) {
    return 'Memfilter kafe ramah kantong mahasiswa (es kopi < Rp 25.000) dengan fasilitas nugas optimal.';
  }
  if (isNearby) {
    return 'Mengurutkan spot nugas terdekat dari titik lokasimu di sekitar Kota Bogor.';
  }

  return 'Menganalisis keseimbangan jarak, kelimpahan colokan, kecepatan WiFi, dan kenyamanan nugas.';
}

export function AISpatialMatchBanner({
  request,
  totalCount,
  topPlaceName = null,
  topMatchScore = null,
  onChangeFilter,
}: AISpatialMatchBannerProps) {
  const insightText = getAiInsight(request, totalCount);

  return (
    <section
      className="rounded-2xl bg-gradient-to-br from-[#F4FAF8] via-[#F8FAF9] to-white p-3.5 border border-[#005B54]/20 shadow-xs transition-all"
      aria-labelledby="ai-match-title"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#005B54] text-white shadow-xs">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 id="ai-match-title" className="text-xs font-extrabold tracking-tight text-slate-900">
                Rekomendasi Cerdas AI
              </h2>
              <span className="inline-flex items-center rounded-full bg-[#E6F4F1] px-1.5 py-0.2 text-[9.5px] font-bold text-[#005B54]">
                Spasial
              </span>
            </div>
            <p className="mt-1 text-[11.5px] leading-relaxed text-slate-600">
              {insightText}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onChangeFilter}
          title="Atur kriteria manual"
          className="inline-flex min-h-7 shrink-0 items-center gap-1 rounded-lg px-2 text-[11px] font-bold text-[#005B54] hover:bg-white border border-transparent hover:border-[#005B54]/20 transition-all cursor-pointer"
        >
          <SlidersHorizontal className="h-3 w-3" aria-hidden="true" />
          <span>Atur</span>
        </button>
      </div>

      <div className="mt-3">
        <RecommendationCriteriaSummary request={request} />
      </div>

      {topPlaceName && (
        <div className="mt-3 flex items-center justify-between border-t border-[#005B54]/10 pt-2.5 text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-600 min-w-0">
            <Trophy className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden="true" />
            <span className="truncate">
              Pilihan teratas: <strong className="font-bold text-slate-900">{topPlaceName}</strong>
            </span>
          </span>
          {topMatchScore !== null && (
            <span className="shrink-0 font-bold text-[#005B54] bg-[#E8F8F5] px-2 py-0.5 rounded-full text-[10.5px]">
              {topMatchScore}% cocok
            </span>
          )}
        </div>
      )}
    </section>
  );
}
