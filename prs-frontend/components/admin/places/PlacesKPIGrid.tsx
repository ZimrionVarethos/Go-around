'use client';

import { MapPin, CheckCircle2, AlertTriangle, Star } from 'lucide-react';
import { formatStarRating } from '@/lib/utils';

interface PlacesKPIGridProps {
  totalPlaces?: number;
  verifiedPlaces?: number;
  reviewPlaces?: number;
}

export function PlacesKPIGrid({
  totalPlaces = 108,
  verifiedPlaces = 96,
  reviewPlaces = 12,
}: PlacesKPIGridProps) {
  const verifiedPct = totalPlaces > 0 ? ((verifiedPlaces / totalPlaces) * 100).toFixed(1) : '0.0';
  const avgScore = 9.1; // Internal 0-10 composite score -> 4.6 / 5 star equivalent

  return (
    <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-card-subtle grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E5DF] overflow-hidden">
      {/* Metric 1: Total Kafe */}
      <div className="p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-text-600">
            <p className="text-xs font-semibold">Total Kafe Terdata</p>
            <MapPin className="w-4 h-4 text-[#005B54]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2.5">
            <span className="text-2xl sm:text-[26px] font-extrabold text-text-950 tracking-tight tabular-nums">
              {totalPlaces}
            </span>
            <span className="text-[11px] font-mono font-semibold text-[#005B54] bg-[#005B54]/[0.07] px-2 py-0.5 rounded-md">
              Titik GIS
            </span>
          </div>
        </div>
        <div className="mt-3.5 pt-2.5 border-t border-[#E2E5DF] flex items-center justify-between text-[11px] text-text-500 tabular-nums">
          <span>Dramaga: 32</span>
          <span>·</span>
          <span>Tengah: 38</span>
          <span>·</span>
          <span>Pajajaran: 24</span>
        </div>
      </div>

      {/* Metric 2: Terverifikasi Penuh */}
      <div className="p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-text-600">
            <p className="text-xs font-semibold">Terverifikasi Penuh</p>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2.5">
            <span className="text-2xl sm:text-[26px] font-extrabold text-text-950 tracking-tight tabular-nums">
              {verifiedPlaces}
            </span>
            <span className="text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md tabular-nums">
              {verifiedPct}% Tayang
            </span>
          </div>
        </div>
        <div className="mt-3.5 pt-2.5 border-t border-[#E2E5DF] text-[11px] text-text-500 truncate">
          Atribut koordinat &amp; fasilitas tervalidasi
        </div>
      </div>

      {/* Metric 3: Perlu Verifikasi Ulang */}
      <div className="p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-text-600">
            <p className="text-xs font-semibold">Perlu Verifikasi</p>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2.5">
            <span className="text-2xl sm:text-[26px] font-extrabold text-text-950 tracking-tight tabular-nums">
              {reviewPlaces}
            </span>
            <span className="text-[11px] font-mono font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
              Menunggu Audit
            </span>
          </div>
        </div>
        <div className="mt-3.5 pt-2.5 border-t border-[#E2E5DF] text-[11px] text-text-500 truncate">
          Verifikasi kecepatan Wi-Fi &amp; ketersediaan colokan
        </div>
      </div>

      {/* Metric 4: Rata-rata Rating Tempat Nugas (Normalized 5-Star Scale) */}
      <div className="p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-text-600">
            <p className="text-xs font-semibold">Rata-rata Rating Kafe</p>
            <Star className="w-4 h-4 fill-[#ECC457] text-[#ECC457]" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2.5">
            <span className="text-2xl sm:text-[26px] font-extrabold text-text-950 tracking-tight tabular-nums">
              {formatStarRating(avgScore)}
            </span>
            <span className="text-xs text-text-400 font-medium tabular-nums">/ 5</span>
            <span className="text-[11px] font-mono font-semibold text-[#005B54] bg-[#005B54]/[0.07] px-2 py-0.5 rounded-md ml-1 tabular-nums">
              91% Nugas
            </span>
          </div>
        </div>
        <div className="mt-3.5 pt-2.5 border-t border-[#E2E5DF] flex items-center justify-between text-[11px] text-text-500">
          <span>Skala Bintang Publik</span>
          <span className="font-semibold text-text-700 tabular-nums">1.840 Ulasan</span>
        </div>
      </div>
    </div>
  );
}
