'use client';

import type { RecommendationWeights } from '@/lib/recommendations';

const WEIGHTS: Array<{
  key: keyof RecommendationWeights;
  label: string;
}> = [
  { key: 'distance', label: 'Jarak' },
  { key: 'rating', label: 'Rating' },
  { key: 'price', label: 'Harga' },
  { key: 'wifi', label: 'Wi-Fi' },
  { key: 'plug', label: 'Colokan' },
  { key: 'quiet', label: 'Ketenangan' },
];

export interface PreferenceWeightEditorProps {
  value: RecommendationWeights;
  onChange: (weights: RecommendationWeights) => void;
}

export function PreferenceWeightEditor({
  value,
  onChange,
}: PreferenceWeightEditorProps) {
  const update = (key: keyof RecommendationWeights, next: number) => {
    onChange({ ...value, [key]: next });
  };

  return (
    <details className="group rounded-xl bg-slate-50 ring-1 ring-slate-200">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-3.5 text-xs font-bold text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54]">
        Atur bobot manual
        <span className="text-[11px] font-medium text-slate-500 group-open:hidden">Opsional</span>
      </summary>
      <div className="space-y-3 border-t border-slate-200 px-3.5 py-3">
        <p className="text-[11px] leading-relaxed text-slate-500">
          Nilai lebih tinggi berarti faktor tersebut lebih berpengaruh pada ranking.
        </p>
        {WEIGHTS.map((item) => (
          <label key={item.key} className="grid grid-cols-[78px_1fr_24px] items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">{item.label}</span>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={Math.round(value[item.key] * 5)}
              onChange={(event) => update(item.key, Number(event.target.value) / 5)}
              className="h-1.5 w-full cursor-pointer accent-[#005B54]"
              aria-label={`Bobot ${item.label}`}
            />
            <span className="text-right text-xs font-bold tabular-nums text-[#005B54]">
              {Math.round(value[item.key] * 5)}
            </span>
          </label>
        ))}
      </div>
    </details>
  );
}
