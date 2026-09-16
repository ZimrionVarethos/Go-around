'use client';

import { Sparkles, Check, Wifi, Coffee, Zap, ChevronRight } from 'lucide-react';

export interface AISpatialMatchBannerProps {
  onChangeFilter?: () => void;
}

export function AISpatialMatchBanner({ onChangeFilter }: AISpatialMatchBannerProps = {}) {
  return (
    <div className="rounded-2xl bg-[#F4FAF8] border border-[#BDE8DE] p-3.5 shadow-xs select-none flex flex-col gap-2.5">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#E0F3EE] flex items-center justify-center text-[#005B54]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-gray-900">AI Spatial Match</span>
          <span className="bg-[#005B54] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            98% Cocok
          </span>
        </div>
        <span className="text-[11px] text-gray-500 font-medium">
          Ditemukan 3 Tempat
        </span>
      </div>

      {/* Main Copy with highlighted query */}
      <p className="text-[11.5px] text-gray-700 leading-relaxed">
        <strong className="font-semibold text-gray-900">Hasil Analisis:</strong> Berdasarkan query{' '}
        <span className="text-[#005B54] italic font-semibold">
          &apos;colokan tiap meja, wifi kenceng, es kopi murah dekat SV IPB&apos;
        </span>
        , sistem merekomendasikan spot dengan indeks kesesuaian tertinggi di bawah.
      </p>

      {/* 4 Feature Micro Badges */}
      <div className="flex flex-wrap gap-1.5 pt-0.5">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#005B54] border border-[#A7F3D0] text-[11px] font-medium shadow-2xs">
          <Check className="w-3 h-3 text-[#005B54] stroke-[3]" />
          <span>95% Colokan Meja</span>
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#005B54] border border-[#A7F3D0] text-[11px] font-medium shadow-2xs">
          <Wifi className="w-3 h-3 text-[#005B54]" />
          <span>WiFi 92 Mbps</span>
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#005B54] border border-[#A7F3D0] text-[11px] font-medium shadow-2xs">
          <Coffee className="w-3 h-3 text-[#005B54]" />
          <span>Es Kopi Rp18k</span>
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium shadow-2xs">
          <Zap className="w-3 h-3 text-amber-600 fill-amber-600" />
          <span>4 Mnt dari IPB</span>
        </span>
      </div>

      {/* Footer Info Row */}
      <div className="flex items-center justify-between pt-1 border-t border-[#BDE8DE]/60 text-[11px]">
        <span className="text-gray-500">
          Rekomendasi Utama: <strong className="font-semibold text-gray-700">Anthology Coffee</strong>
        </span>
        <button
          type="button"
          onClick={onChangeFilter}
          className="font-semibold text-[#005B54] hover:underline flex items-center gap-0.5 cursor-pointer active:opacity-70 transition-opacity"
          // TODO [BACKEND]: Open AI filter modal / connect to filter state
        >
          <span>Ubah Filter AI</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
