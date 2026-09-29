'use client';

import { useState } from 'react';
import { LocateFixed, Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';
import {
  RECOMMENDATION_PRESET_WEIGHTS,
  normalizeRecommendationRequest,
  type RecommendationRequest,
} from '@/lib/recommendations';
import { MustHaveFacilities } from './MustHaveFacilities';
import { PreferencePresetSelector } from './PreferencePresetSelector';
import { PreferenceWeightEditor } from './PreferenceWeightEditor';

const RADIUS_OPTIONS = [1, 3, 5, 10];

export interface RecommendationCriteriaProps {
  initialValue: RecommendationRequest;
  onSubmit: (request: RecommendationRequest) => void;
  onCancel: () => void;
  onRequestLocation?: () => void;
  isSubmitting?: boolean;
}

export function RecommendationCriteria({
  initialValue,
  onSubmit,
  onCancel,
  onRequestLocation,
  isSubmitting = false,
}: RecommendationCriteriaProps) {
  const [draft, setDraft] = useState<RecommendationRequest>(initialValue);

  const setPreset = (preset: Exclude<RecommendationRequest['preset'], 'custom'>) => {
    setDraft((current) => ({
      ...current,
      preset,
      weights: RECOMMENDATION_PRESET_WEIGHTS[preset],
    }));
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(normalizeRecommendationRequest(draft));
  };

  return (
    <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4 no-scrollbar">
        <section aria-labelledby="criteria-location-heading">
          <h3 id="criteria-location-heading" className="text-sm font-bold text-slate-900">
            Titik pencarian
          </h3>
          <div className="mt-2.5 flex items-center justify-between gap-3 rounded-xl bg-[#F2F8F6] px-3.5 py-3 ring-1 ring-teal-200">
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#004741]">Lokasi pencarian aktif</p>
              <p className="mt-0.5 truncate text-[11px] tabular-nums text-[#276B65]">
                {draft.location.latitude.toFixed(5)}, {draft.location.longitude.toFixed(5)}
              </p>
            </div>
            {onRequestLocation && (
              <button
                type="button"
                onClick={onRequestLocation}
                className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-bold text-[#005B54] ring-1 ring-teal-200 transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54]"
              >
                <LocateFixed className="h-3.5 w-3.5" aria-hidden="true" />
                Lokasi saya
              </button>
            )}
          </div>
        </section>

        <fieldset>
          <legend className="text-sm font-bold text-slate-900">Radius pencarian</legend>
          <div className="mt-2.5 grid grid-cols-4 gap-2">
            {RADIUS_OPTIONS.map((radius) => (
              <button
                key={radius}
                type="button"
                onClick={() => setDraft((current) => ({ ...current, radius_km: radius }))}
                aria-pressed={draft.radius_km === radius}
                className={cn(
                  'min-h-10 rounded-xl text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54] focus-visible:ring-offset-2',
                  draft.radius_km === radius
                    ? 'bg-[#005B54] text-white'
                    : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50',
                )}
              >
                {radius} km
              </button>
            ))}
          </div>
        </fieldset>

        <section aria-labelledby="criteria-budget-heading">
          <div className="flex items-center justify-between gap-3">
            <label id="criteria-budget-heading" htmlFor="recommendation-budget" className="text-sm font-bold text-slate-900">
              Budget minuman maksimal
            </label>
            <button
              type="button"
              onClick={() => setDraft((current) => ({ ...current, max_price: null }))}
              className="text-[11px] font-bold text-[#005B54] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54]"
            >
              Tanpa batas
            </button>
          </div>
          <div className="relative mt-2.5">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs font-semibold text-slate-500">
              Rp
            </span>
            <input
              id="recommendation-budget"
              type="number"
              inputMode="numeric"
              min="0"
              step="5000"
              value={draft.max_price ?? ''}
              placeholder="Tanpa batas"
              onChange={(event) => setDraft((current) => ({
                ...current,
                max_price: event.target.value === '' ? null : Number(event.target.value),
              }))}
              className="h-11 w-full rounded-xl bg-white pl-9 pr-3 text-sm font-semibold tabular-nums text-slate-900 ring-1 ring-slate-200 transition-shadow placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005B54]"
            />
          </div>
        </section>

        <PreferencePresetSelector value={draft.preset} onChange={setPreset} />

        <MustHaveFacilities
          value={draft.must_have}
          onChange={(mustHave) => setDraft((current) => ({ ...current, must_have: mustHave }))}
        />

        <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl bg-white px-3.5 ring-1 ring-slate-200">
          <span>
            <span className="block text-xs font-bold text-slate-800">Buka sekarang</span>
            <span className="block text-[11px] text-slate-500">Sembunyikan tempat yang sedang tutup</span>
          </span>
          <input
            type="checkbox"
            checked={draft.open_now}
            onChange={(event) => setDraft((current) => ({ ...current, open_now: event.target.checked }))}
            className="h-4 w-4 accent-[#005B54]"
          />
        </label>

        <PreferenceWeightEditor
          value={draft.weights}
          onChange={(weights) => setDraft((current) => ({ ...current, weights, preset: 'custom' }))}
        />

        <div className="rounded-xl bg-slate-50 px-3.5 py-3 ring-1 ring-slate-200">
          <div className="flex items-start gap-2.5">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#005B54]" aria-hidden="true" />
            <div>
              <p className="text-xs font-bold text-slate-800">Pencarian dengan kalimat segera hadir</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                Nanti kamu bisa menulis “dekat, murah, dan banyak colokan”. Untuk sekarang gunakan kriteria manual.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 gap-2 border-t border-slate-200 bg-white px-4 py-3">
        <button
          type="button"
          onClick={onCancel}
          className="min-h-11 rounded-xl px-4 text-xs font-bold text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54]"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#005B54] px-4 text-xs font-bold text-white shadow-[0_6px_16px_-8px_rgba(0,91,84,0.8)] transition-colors hover:bg-[#004741] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? 'Mencari…' : 'Cari rekomendasi'}
        </button>
      </div>
    </form>
  );
}
