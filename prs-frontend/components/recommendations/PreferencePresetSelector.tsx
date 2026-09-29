'use client';

import { Banknote, Blend, MapPin, MoonStar, Wifi } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { RecommendationPreset } from '@/lib/recommendations';

const PRESETS: Array<{
  id: Exclude<RecommendationPreset, 'custom'>;
  label: string;
  description: string;
  icon: typeof Blend;
}> = [
  {
    id: 'balanced',
    label: 'Seimbang',
    description: 'Semua kebutuhan dipertimbangkan',
    icon: Blend,
  },
  {
    id: 'nearby',
    label: 'Paling dekat',
    description: 'Utamakan jarak dari lokasimu',
    icon: MapPin,
  },
  {
    id: 'budget',
    label: 'Paling hemat',
    description: 'Cari harga yang ramah kantong',
    icon: Banknote,
  },
  {
    id: 'study',
    label: 'Fokus nugas',
    description: 'Wi-Fi dan colokan lebih penting',
    icon: Wifi,
  },
  {
    id: 'quiet',
    label: 'Tenang',
    description: 'Prioritaskan suasana kondusif',
    icon: MoonStar,
  },
];

export interface PreferencePresetSelectorProps {
  value: RecommendationPreset;
  onChange: (preset: Exclude<RecommendationPreset, 'custom'>) => void;
}

export function PreferencePresetSelector({
  value,
  onChange,
}: PreferencePresetSelectorProps) {
  return (
    <fieldset>
      <legend className="text-sm font-bold text-slate-900">Apa yang paling penting?</legend>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        Pilih satu titik awal. Bobotnya masih bisa kamu atur manual.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isSelected = value === preset.id;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange(preset.id)}
              aria-pressed={isSelected}
              className={cn(
                'min-h-20 rounded-xl px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54] focus-visible:ring-offset-2',
                isSelected
                  ? 'bg-[#E8F8F5] text-[#004741] ring-1 ring-[#005B54]'
                  : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300',
                preset.id === 'balanced' && 'col-span-2',
              )}
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="text-xs font-bold">{preset.label}</span>
              </span>
              <span className={cn(
                'mt-1 block text-[11px] leading-snug',
                isSelected ? 'text-[#276B65]' : 'text-slate-500',
              )}>
                {preset.description}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
