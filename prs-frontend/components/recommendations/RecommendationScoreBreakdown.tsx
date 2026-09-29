import { cn } from '@/lib/cn';
import type { RecommendationScoreBreakdown as ScoreBreakdown } from '@/lib/recommendations';

const METRICS: Array<{ key: keyof ScoreBreakdown; label: string }> = [
  { key: 'distance', label: 'Jarak' },
  { key: 'rating', label: 'Rating' },
  { key: 'price', label: 'Harga' },
  { key: 'wifi', label: 'Wi-Fi' },
  { key: 'plug', label: 'Colokan' },
  { key: 'quiet', label: 'Tenang' },
];

function getScoreColor(score: number): string {
  if (score >= 85) return 'bg-[#005B54]'; // Sangat Cocok
  if (score >= 70) return 'bg-[#10B981]'; // Bagus / Cocok
  if (score >= 50) return 'bg-[#F59E0B]'; // Cukup
  return 'bg-[#EF4444]'; // Kurang Sesuai
}

function getScoreTextColor(score: number): string {
  if (score >= 85) return 'text-[#005B54]';
  if (score >= 70) return 'text-emerald-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-rose-600';
}

export function RecommendationScoreBreakdown({ value }: { value: ScoreBreakdown }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5" aria-label="Rincian skor rekomendasi">
      {METRICS.map((metric) => {
        const score = value[metric.key];
        return (
          <div key={metric.key}>
            <div className="flex items-center justify-between gap-2 text-[10px]">
              <span className="font-semibold text-slate-600">{metric.label}</span>
              <span className={cn('font-bold tabular-nums', score !== null ? getScoreTextColor(score) : 'text-slate-400')}>
                {score === null ? '—' : `${Math.round(score)}%`}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200">
              {score !== null && (
                <div
                  className={cn('h-full rounded-full transition-all duration-300', getScoreColor(score))}
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
