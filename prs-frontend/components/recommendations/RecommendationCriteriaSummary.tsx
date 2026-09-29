import { Banknote, CircleDot, MapPin } from 'lucide-react';
import { formatRupiahFull } from '@/lib/utils';
import type { RecommendationRequest } from '@/lib/recommendations';

const PRESET_LABELS: Record<RecommendationRequest['preset'], string> = {
  balanced: 'Seimbang',
  nearby: 'Paling dekat',
  budget: 'Paling hemat',
  study: 'Fokus nugas',
  quiet: 'Tenang',
  custom: 'Bobot manual',
};

export interface RecommendationCriteriaSummaryProps {
  request: RecommendationRequest;
}

export function RecommendationCriteriaSummary({
  request,
}: RecommendationCriteriaSummaryProps) {
  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Ringkasan kriteria aktif">
      <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#005B54] ring-1 ring-teal-200">
        <CircleDot className="h-3 w-3" aria-hidden="true" />
        {PRESET_LABELS[request.preset]}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
        <MapPin className="h-3 w-3" aria-hidden="true" />
        Maks. {request.radius_km} km
      </span>
      {request.max_price !== null && (
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
          <Banknote className="h-3 w-3" aria-hidden="true" />
          {formatRupiahFull(request.max_price)}
        </span>
      )}
    </div>
  );
}
