'use client';

import { Sparkles, Check, Wifi, Coffee, Zap, ChevronRight } from 'lucide-react';

export interface AISpatialMatchBannerProps {
  onChangeFilter?: () => void;
}

export function AISpatialMatchBanner({ onChangeFilter }: AISpatialMatchBannerProps = {}) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#F4FAF8] via-[#EFF8F5] to-[#E9F5F1] border border-teal-200/80 p-3.5 shadow-xs select-none flex flex-col gap-2.5">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5.5 h-5.5 rounded-lg bg-[#005B54] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-extrabold text-slate-900 tracking-tight">AI Spatial Match</span>
          <span className="bg-[#005B54] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
            98% Cocok
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-semibold">
          3 Spot Terpilih
        </span>
      </div>

      {/* Main Copy with highlighted query */}
      <p className="text-[11.5px] text-slate-700 leading-relaxed">
        <strong className="font-bold text-slate-900">Analisis Kriteria:</strong> Berdasarkan prompt{' '}
        <span className="text-[#005B54] italic font-semibold underline decoration-teal-300 underline-offset-2">
          &apos;colokan tiap meja, wifi kenceng, es kopi murah dekat SV IPB&apos;
        </span>
        , tempat dengan indeks kesesuaian spasial tertinggi:
      </p>

      {/* 4 Feature Micro Badges */}
      <div className="flex flex-wrap gap-1.5 pt-0.5">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 text-[#005B54] border border-teal-200/90 text-[11px] font-semibold shadow-2xs">
          <Check className="w-3 h-3 text-[#005B54] stroke-[3]" />
          <span>95% Colokan Meja</span>
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 text-[#005B54] border border-teal-200/90 text-[11px] font-semibold shadow-2xs">
          <Wifi className="w-3 h-3 text-[#005B54]" />
          <span>WiFi 92 Mbps</span>
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 text-[#005B54] border border-teal-200/90 text-[11px] font-semibold shadow-2xs">
          <Coffee className="w-3 h-3 text-[#005B54]" />
          <span>Es Kopi Rp18k</span>
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold shadow-2xs">
          <Zap className="w-3 h-3 text-amber-600 fill-amber-600" />
          <span>4 Mnt dari IPB</span>
        </span>
      </div>

      {/* Footer Info Row */}
      <div className="flex items-center justify-between pt-1 border-t border-teal-200/60 text-[11px]">
        <span className="text-slate-500">
          Rekomendasi Utama: <strong className="font-bold text-slate-800">Anthology Coffee</strong>
        </span>
        <button
          type="button"
          onClick={onChangeFilter}
          className="font-bold text-[#005B54] hover:text-[#004741] flex items-center gap-0.5 cursor-pointer active:opacity-70 transition-opacity"
        >
          <span>Ubah Kriteria</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>

  );
}
