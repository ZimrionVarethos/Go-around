'use client';

import {
  CarProfileIcon,
  MoonStarsIcon,
  PercentIcon,
  PlugChargingIcon,
  SnowflakeIcon,
  WifiHighIcon,
} from '@phosphor-icons/react';
import { cn } from '@/lib/cn';
import type { RecommendationFacility } from '@/lib/recommendations';

const FACILITIES: Array<{
  id: RecommendationFacility;
  label: string;
  icon: typeof WifiHighIcon;
}> = [
  { id: 'plug', label: 'Colokan', icon: PlugChargingIcon },
  { id: 'wifi', label: 'Wi-Fi', icon: WifiHighIcon },
  { id: 'musholla', label: 'Musholla', icon: MoonStarsIcon },
  { id: 'student_discount', label: 'Diskon mahasiswa', icon: PercentIcon },
  { id: 'parking', label: 'Parkir', icon: CarProfileIcon },
  { id: 'air_conditioning', label: 'Ruangan AC', icon: SnowflakeIcon },
];

export interface MustHaveFacilitiesProps {
  value: RecommendationFacility[];
  onChange: (facilities: RecommendationFacility[]) => void;
}

export function MustHaveFacilities({ value, onChange }: MustHaveFacilitiesProps) {
  const toggle = (facility: RecommendationFacility) => {
    onChange(
      value.includes(facility)
        ? value.filter((item) => item !== facility)
        : [...value, facility],
    );
  };

  return (
    <fieldset>
      <legend className="text-sm font-bold text-slate-900">Fasilitas wajib</legend>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        Tempat tanpa fasilitas yang dipilih tidak akan ditampilkan.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {FACILITIES.map((facility) => {
          const Icon = facility.icon;
          const isSelected = value.includes(facility.id);

          return (
            <button
              key={facility.id}
              type="button"
              onClick={() => toggle(facility.id)}
              aria-pressed={isSelected}
              className={cn(
                'inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54] focus-visible:ring-offset-2',
                isSelected
                  ? 'bg-[#005B54] text-white'
                  : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50',
              )}
            >
              <Icon size={15} weight={isSelected ? 'fill' : 'duotone'} aria-hidden="true" />
              {facility.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
