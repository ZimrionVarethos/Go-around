'use client';

import { MapPin, CheckCircle2, AlertTriangle, Star } from 'lucide-react';

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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Total Kafe */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Total Kafe Terdata</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {totalPlaces}
              </span>
              <span className="text-xs font-bold text-[#005B54]">Titik GIS</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#E6F7EF] flex items-center justify-center text-[#005B54] shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
          <span>Dramaga: 32</span>
          <span className="text-gray-300">•</span>
          <span>Tengah: 38</span>
          <span className="text-gray-300">•</span>
          <span>Pajajaran: 24</span>
          <span className="text-gray-300">•</span>
          <span>Sentul: 14</span>
        </div>
      </div>

      {/* Metric 2: Terverifikasi Penuh */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Terverifikasi Penuh</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {verifiedPlaces}
              </span>
              <span className="text-xs font-bold text-emerald-600">88.8% Tayang</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="truncate">Tervalidasi tim QA lapangan IPB</span>
        </div>
      </div>

      {/* Metric 3: Perlu Verifikasi Ulang */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Perlu Verifikasi Ulang</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {reviewPlaces}
              </span>
              <span className="text-xs font-bold text-amber-700">Butuh Audit</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          <span className="truncate">Menunggu verifikasi atribut kecepatan WiFi</span>
        </div>
      </div>

      {/* Metric 4: Skor Kenyamanan */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Skor Kenyamanan Nugas</p>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-3xl font-extrabold text-gray-900 tracking-tight">9.1</span>
              <span className="text-xs text-gray-400 font-medium">/ 10</span>
              <span className="text-xs font-bold text-emerald-600 ml-1">(Sangat Kondusif)</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="text-gray-500">Metrik: WiFi + Colokan + Akustik</span>
          <span className="font-bold text-[#005B54]">1,840 Review</span>
        </div>
      </div>
    </div>
  );
}
