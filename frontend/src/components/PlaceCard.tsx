'use client';

import React from 'react';
import { PlaceProperties } from '@/types/place';
import { Wifi, Zap, ExternalLink, Clock, Navigation } from 'lucide-react';

interface PlaceCardProps {
  place: PlaceProperties;
  isSelected: boolean;
  onSelect: () => void;
  onOpenDetail: () => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  isSelected,
  onSelect,
  onOpenDetail,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 relative overflow-hidden group ${
        isSelected
          ? 'bg-zinc-900 border-zinc-100 ring-2 ring-white/20 shadow-2xl scale-[1.01]'
          : 'bg-zinc-950/90 hover:bg-zinc-900/90 border-zinc-850 hover:border-zinc-700 shadow-xl'
      }`}
    >
      {/* Direct Title on Top (No top bar, no subdistrict pill, no star rating score, no desc) */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-syne font-extrabold text-lg text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
          {place.name}
        </h3>
        {place.distance_km !== undefined && place.distance_km !== null && (
          <span className="flex items-center gap-1 bg-sky-500/10 border border-sky-500/30 text-sky-300 font-bold px-2 py-0.5 rounded-lg text-[11px] shrink-0 font-syne">
            <Navigation className="w-3 h-3" />
            <span>{place.distance_km} KM</span>
          </span>
        )}
      </div>

      {/* Metrics Row (DM Sans / Syne clean values) */}
      <div className="grid grid-cols-2 gap-2 text-xs font-sans bg-zinc-900/60 p-3 rounded-xl border border-zinc-850">
        <div className="flex items-center gap-2 text-zinc-300">
          <Wifi className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="font-medium">{place.wifi_speed_mbps} Mbps</span>
        </div>

        <div className="flex items-center gap-2 text-zinc-300">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate font-medium">
            {place.plug_availability === 'abundant'
              ? 'Colokan Melimpah'
              : place.plug_availability === 'moderate'
              ? 'Colokan Cukup'
              : 'Colokan Terbatas'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-zinc-300">
          <span className="font-syne font-bold text-emerald-400">Rp</span>
          <span className="font-medium">Mulai {(place.price_min_drink / 1000).toFixed(0)}k</span>
        </div>

        {place.is_24_hours ? (
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Clock className="w-4 h-4 shrink-0" />
            <span>24 Jam Nonstop</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-zinc-400 font-medium">
            <Clock className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {place.open_time && place.close_time
                ? `${place.open_time.slice(0, 5)} - ${place.close_time.slice(0, 5)}`
                : 'Jam Terjadwal'}
            </span>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-900 text-xs">
        <span className="text-zinc-500 font-sans text-[11px]">
          Rating {place.google_rating} ({place.total_google_reviews || 500}+ ulasan)
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail();
          }}
          className="flex items-center gap-1.5 text-xs font-syne font-bold uppercase tracking-wider text-zinc-200 hover:text-white px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-750 transition-all shadow-md group-hover:border-emerald-500/50"
        >
          <span>Detail & Rute</span>
          <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
        </button>
      </div>
    </div>
  );
};
