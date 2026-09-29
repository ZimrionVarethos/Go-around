import type { RecommendationScoreBreakdown as ScoreBreakdown } from '@/lib/recommendations';

const METRICS: Array<{ key: keyof ScoreBreakdown; label: string }> = [
  { key: 'distance', label: 'Jarak' },
  { key: 'rating', label: 'Rating' },
  { key: 'price', label: 'Harga' },
  { key: 'wifi', label: 'Wi-Fi' },
  { key: 'plug', label: 'Colokan' },
  { key: 'quiet', label: 'Tenang' },
];

export function RecommendationScoreBreakdown({ value }: { value: ScoreBreakdown }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5" aria-label="Rincian skor rekomendasi">
      {METRICS.map((metric) => {
        const score = value[metric.key];
        return (
          <div key={metric.key}>
            <div className="flex items-center justify-between gap-2 text-[10px]">
              <span className="font-semibold text-slate-600">{metric.label}</span>
              <span className="font-bold tabular-nums text-slate-800">
                {score === null ? '—' : Math.round(score)}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200">
              {score !== null && (
                <div
                  className="h-full rounded-full bg-[#005B54]"
                  style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
