'use client';

import { MapPin, Navigation, Share2, Wifi, Zap, Volume2 } from 'lucide-react';
import type { PlaceListItem } from '@/lib/types';
import { formatNugasScore, formatRupiah } from '@/lib/utils';

export interface PlaceCardProps {
  place: PlaceListItem;
  rank?: number;
  isSelected?: boolean;
  onSelect: (slug: string) => void;
  onRoute?: (place: PlaceListItem) => void;
  onToast?: (msg: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
}

export function PlaceCard({
  place,
  rank = 1,
  isSelected = false,
  onSelect,
  onRoute,
  onToast,
}: PlaceCardProps) {
  const displayScore = formatNugasScore(place.nugas_score);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleRoute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRoute) {
      onRoute(place);
    } else if (place.google_maps_url) {
      window.open(place.google_maps_url, '_blank');
    } else if (place.latitude && place.longitude) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`,
        '_blank'
      );
    }
    // TODO [BACKEND]: Log route click:
    //   POST /api/v1/places/:slug/events { event: 'route_click' }
    onToast?.(`Membuka navigasi ke ${place.name}…`, 'info');
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/peta?place=${place.slug}`
      : `https://go-around.vercel.app/peta?place=${place.slug}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      onToast?.('Tautan lokasi disalin ke clipboard! 📎', 'success');
      // TODO [BACKEND]: Log share click:
      //   POST /api/v1/places/:slug/events { event: 'share_click' }
    }).catch(() => {
      onToast?.('Gagal menyalin tautan', 'error');
    });
  };

  const handleDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(place.slug);
  };

  // ── Selected / Expanded Card ──────────────────────────────────────────────
  if (isSelected) {
    return (
      <div
        onClick={() => onSelect(place.slug)}
        className="bg-white ring-2 ring-[#005B54] rounded-2xl p-3.5 shadow-[0_12px_28px_-4px_rgba(0,91,84,0.2)] flex flex-col gap-3 transition-all duration-200 cursor-pointer select-none tactile-press"
      >
        {/* Top Profile Section */}
        <div className="flex gap-3.5 items-start">
          {/* Thumbnail with #1 TOP overlay */}
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={place.image_url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80'}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 left-1 bg-slate-950/85 backdrop-blur-xs text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border border-white/20 shadow-xs">
              #{rank} TOP
            </span>
          </div>

          {/* Place Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1.5">
              <h3 className="text-[15px] font-extrabold text-slate-900 leading-snug tracking-tight truncate">
                {place.name}
              </h3>
              {/* Green Score Badge with Glow */}
              <div className="bg-[#005B54] text-white text-xs font-extrabold px-2.5 py-0.5 rounded-lg flex items-center gap-1 shrink-0 shadow-[0_2px_8px_rgba(0,91,84,0.3)]">
                <span className="text-amber-300">★</span>
                <span>{displayScore}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#005B54] shrink-0" />
              <span className="truncate">{place.subdistrict} · 850m dari SV IPB</span>
            </p>

            <p className="text-[11.5px] font-bold text-[#005B54] mt-1">
              {formatRupiah(place.price_min_drink)} - 32k · <span className="font-semibold text-emerald-800">Sangat Ramah Kantong</span>
            </p>
          </div>
        </div>

        {/* 3-Metric Clean SVG Container */}
        <div className="bg-slate-50/90 rounded-xl p-2.5 grid grid-cols-3 divide-x divide-slate-200 border border-slate-100 text-center">
          <div className="px-1 flex flex-col items-center">
            <div className="flex items-center justify-center gap-1 font-extrabold text-xs text-slate-900 leading-tight">
              <Wifi className="w-3.5 h-3.5 text-[#005B54] shrink-0" />
              <span>{place.wifi_speed_mbps ?? 92} Mbps</span>
            </div>
            <p className="text-[10px] text-slate-600 mt-0.5 font-medium">Kencang Stabil</p>
          </div>
          <div className="px-1 flex flex-col items-center">
            <div className="flex items-center justify-center gap-1 font-extrabold text-xs text-slate-900 leading-tight">
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>95% Meja</span>
            </div>
            <p className="text-[10px] text-slate-600 mt-0.5 font-medium">Ada Colokan</p>
          </div>
          <div className="px-1 flex flex-col items-center">
            <div className="flex items-center justify-center gap-1 font-extrabold text-xs text-slate-900 leading-tight">
              <Volume2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>42 dB</span>
            </div>
            <p className="text-[10px] text-slate-600 mt-0.5 font-medium">Tenang Nugas</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={handleRoute}
            className="flex-1 bg-[#005B54] hover:bg-[#004741] active:scale-[0.98] text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5 fill-white" />
            <span>Buka Rute Maps</span>
          </button>
          <button
            type="button"
            onClick={handleDetail}
            className="border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-xs font-semibold py-2 px-3.5 rounded-xl transition-colors cursor-pointer"
          >
            Detail Fasilitas
          </button>
          <button
            type="button"
            onClick={handleShare}
            title="Bagikan Lokasi"
            className="w-8 h-8 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:text-[#005B54] transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // ── Standard / Unselected Card ────────────────────────────────────────────
  return (
    <div
      onClick={() => onSelect(place.slug)}
      className="bg-white border border-slate-200/90 hover:border-[#005B54]/50 rounded-2xl p-3 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer select-none flex flex-col gap-2.5 tactile-press"
    >
      <div className="flex gap-3 items-start">
        {/* Thumbnail */}
        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100 shadow-2xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={place.image_url || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80'}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-0.5 left-0.5 bg-slate-950/85 backdrop-blur-xs text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded shadow-xs border border-white/20">
            #{rank}
          </span>
        </div>

        {/* Identity */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1.5">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight truncate">
              {place.name}
            </h4>
            {/* Amber/Yellow Score Badge */}
            <div className="border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shrink-0">
              <span className="text-amber-500">★</span>
              <span>{displayScore}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-medium mt-0.5 truncate flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{place.subdistrict} · 1.{rank} Km</span>
          </p>

          <p className="text-[11px] text-[#005B54] font-semibold mt-0.5">
            {formatRupiah(place.price_min_drink)} - 28k · {place.is_24_hours ? 'Buka 24 Jam' : 'Buka sd 23:00'}
          </p>
        </div>
      </div>

      {/* Bottom Inline Metrics Line */}
      <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] text-slate-600 gap-2 overflow-hidden">
        <span className="inline-flex items-center gap-1 shrink-0 font-medium">
          <Wifi className="w-3 h-3 text-[#005B54]" />
          <span>{place.wifi_speed_mbps ?? 78} Mbps</span>
        </span>
        <span className="text-slate-300">•</span>
        <span className="inline-flex items-center gap-1 shrink-0 font-medium">
          <Zap className="w-3 h-3 text-amber-500" />
          <span>Colokan Tersebar</span>
        </span>
        <span className="text-slate-300">•</span>
        <span className="truncate text-teal-800 font-semibold">Outdoor Adem</span>
      </div>
    </div>
  );
}

