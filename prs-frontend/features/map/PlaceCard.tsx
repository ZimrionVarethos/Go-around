'use client';

import { MapPin, Navigation } from 'lucide-react';
import type { PlaceListItem } from '@/lib/types';
import { formatNugasScore, formatRupiah } from '@/lib/utils';

export interface PlaceCardProps {
  place: PlaceListItem;
  rank?: number;
  isSelected?: boolean;
  onSelect: (slug: string) => void;
  onRoute?: (place: PlaceListItem) => void;
}

export function PlaceCard({
  place,
  rank = 1,
  isSelected = false,
  onSelect,
  onRoute,
}: PlaceCardProps) {
  const displayScore = formatNugasScore(place.nugas_score);

  // If selected, render the expanded Figma Card 1 style
  if (isSelected) {
    return (
      <div
        onClick={() => onSelect(place.slug)}
        className="bg-white border-2 border-[#005B54] rounded-2xl p-3.5 shadow-md flex flex-col gap-3 transition-all cursor-pointer select-none"
      >
        {/* Top Profile Section */}
        <div className="flex gap-3 items-start">
          {/* Thumbnail with #1 TOP overlay */}
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100 shadow-2xs">
            <img
              src={place.image_url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80'}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 left-1 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
              #{rank} TOP
            </span>
          </div>

          {/* Place Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <h3 className="text-[15px] font-bold text-gray-900 leading-snug truncate">
                {place.name}
              </h3>
              {/* Green Score Badge */}
              <div className="bg-[#005B54] text-white text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shrink-0">
                <span className="text-amber-300">★</span>
                <span>{displayScore}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
              <span className="truncate">{place.subdistrict} · 850m dari SV IPB</span>
            </p>

            <p className="text-[11.5px] font-semibold text-[#005B54] mt-1">
              {formatRupiah(place.price_min_drink)} - 32k · Sangat Ramah Kantong
            </p>
          </div>
        </div>

        {/* 3-Metric Gray Container */}
        <div className="bg-[#F8F9FA] rounded-xl p-2.5 grid grid-cols-3 divide-x divide-gray-200 text-center">
          <div className="px-1">
            <p className="font-bold text-xs text-gray-900 leading-tight">
              📶 {place.wifi_speed_mbps ?? 92} Mbps
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Kencang</p>
          </div>
          <div className="px-1">
            <p className="font-bold text-xs text-gray-900 leading-tight">
              ⚡ 95% Meja
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Ada Colokan</p>
          </div>
          <div className="px-1">
            <p className="font-bold text-xs text-gray-900 leading-tight">
              🎧 42 dB
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Tenang Nugas</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onRoute) onRoute(place);
              else if (place.google_maps_url) window.open(place.google_maps_url, '_blank');
            }}
            className="flex-1 bg-[#005B54] hover:bg-[#004741] text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5 fill-white" />
            <span>Buka Rute Maps</span>
          </button>
          <button
            onClick={() => onSelect(place.slug)}
            className="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold py-2 px-3.5 rounded-xl transition-colors cursor-pointer"
          >
            Detail Fasilitas
          </button>
        </div>
      </div>
    );
  }

  // Standard / Unselected Card (Figma Card 2 Style)
  return (
    <div
      onClick={() => onSelect(place.slug)}
      className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-3 shadow-xs hover:shadow-sm transition-all cursor-pointer select-none flex flex-col gap-2.5"
    >
      <div className="flex gap-3 items-start">
        {/* Thumbnail */}
        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100 shadow-2xs">
          <img
            src={place.image_url || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80'}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-0.5 left-0.5 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.2 rounded shadow-xs">
            #{rank}
          </span>
        </div>

        {/* Identity */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h4 className="text-sm font-bold text-gray-900 truncate">
              {place.name}
            </h4>
            {/* Amber/Yellow Score Badge */}
            <div className="border border-amber-300 bg-amber-50 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shrink-0">
              <span className="text-amber-500">★</span>
              <span>{displayScore}</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {place.subdistrict} · 1.{rank} Km
          </p>

          <p className="text-[11px] text-[#005B54] font-medium mt-0.5">
            {formatRupiah(place.price_min_drink)} - 28k · {place.is_24_hours ? 'Buka 24 Jam' : 'Buka sd 23:00'}
          </p>
        </div>
      </div>

      {/* Bottom Inline Metrics Line */}
      <div className="pt-2 border-t border-gray-100 flex items-center text-[11px] text-gray-500 gap-1.5 overflow-hidden">
        <span className="shrink-0">📶 {place.wifi_speed_mbps ?? 78} Mbps</span>
        <span>•</span>
        <span className="shrink-0">⚡ Colokan Tersebar</span>
        <span>•</span>
        <span className="truncate text-teal-700 font-medium">Outdoor Adem</span>
      </div>
    </div>
  );
}
