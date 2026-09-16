'use client';

import dynamic from 'next/dynamic';
import { MapPin, Lightbulb } from 'lucide-react';

const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[220px] bg-[#F6F4ED] rounded-xl flex flex-col items-center justify-center gap-2">
      <div className="w-7 h-7 rounded-full border-2 border-[#005B54] border-t-transparent animate-spin" />
      <span className="text-[11px] font-semibold text-gray-600">Memuat Peta GIS...</span>
    </div>
  ),
});

export interface GisGuideSidebarProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export function GisGuideSidebar({
  lat,
  lng,
  onLocationChange,
}: GisGuideSidebarProps) {
  return (
    <aside className="w-full lg:w-[420px] shrink-0 space-y-5 lg:sticky lg:top-24">
      {/* Card 1: Pin Lokasi GIS Interaktif */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#005B54]" />
            <h3 className="text-xs font-bold text-gray-900">
              Pin Lokasi GIS Interaktif
            </h3>
          </div>
          <span className="bg-[#E0F3EE] text-[#005B54] text-[10px] font-bold px-2 py-0.5 rounded-full">
            Georeferensi GPS
          </span>
        </div>

        {/* Interactive Leaflet Mini Map */}
        <div className="w-full h-[220px] rounded-xl overflow-hidden border border-gray-200 shadow-2xs">
          <LocationPickerMap
            lat={lat}
            lng={lng}
            onChange={onLocationChange}
          />
        </div>

        {/* Lat / Lng Coordinate Display */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10.5px] text-gray-500 font-semibold uppercase tracking-wider">
            <span>Koordinat Spasial Auto-Fill</span>
            <span className="text-[#005B54] font-bold">WGS 84 (EPSG:4326)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#F8FAFC] border border-gray-200 rounded-lg p-2">
              <span className="text-[10px] text-gray-400 block font-medium">Latitude</span>
              <span className="font-mono text-xs font-bold text-gray-800">{lat}</span>
            </div>
            <div className="bg-[#F8FAFC] border border-gray-200 rounded-lg p-2">
              <span className="text-[10px] text-gray-400 block font-medium">Longitude</span>
              <span className="font-mono text-xs font-bold text-gray-800">{lng}</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 flex items-start gap-1.5 leading-snug">
          <span className="text-[#005B54] font-bold">ℹ️</span>
          <span>Geser pin di peta atau klik lokasi tepat di peta untuk menentukan koordinat GPS yang akurat.</span>
        </p>
      </div>

      {/* Card 2: Alur Verifikasi Kontribusi Mahasiswa */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 space-y-3.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#005B54]" />
          <h3 className="text-xs font-bold text-gray-900">
            Alur Verifikasi Kontribusi Mahasiswa
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#005B54] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 leading-tight">
                Formulir Masuk Antrean Kurasi
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                Sistem WebGIS menerima koordinat dan kelayakan awal spot dari kontribusi publik secara anonim.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#005B54] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 leading-tight">
                Validasi Fisik Lapangan (SV IPB)
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                Tim relawan mahasiswa mengecek langsung soket listrik tiap meja, uji kestabilan unduh/unggah Wi-Fi, dan keterjangkauan harga menu.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#005B54] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 leading-tight">
                Terbit di WebGIS Go Around Bogor
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                Pin resmi aktif dapat diakses, dinavigasi, dan dimanfaatkan oleh masyarakat di sekitar Kota Bogor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Standar Spot Nugas Berkualitas */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold text-gray-900">
            Standar Spot Nugas Berkualitas
          </h3>
        </div>

        <div className="space-y-2.5 text-xs text-gray-600">
          <div className="flex items-start gap-2">
            <span className="text-[#005B54] font-bold shrink-0">🔌</span>
            <p className="leading-snug">
              <strong className="text-gray-900 font-semibold">Colokan Kokoh:</strong> Stopkontak tidak longgar atau mudah lepas saat dicolok charger laptop berat.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#005B54] font-bold shrink-0">📶</span>
            <p className="leading-snug">
              <strong className="text-gray-900 font-semibold">Wi-Fi Minimal 25 Mbps:</strong> Tidak mengalami throttling saat jam ramai sore hari (15.00 - 19.00 WIB).
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#005B54] font-bold shrink-0">☕</span>
            <p className="leading-snug">
              <strong className="text-gray-900 font-semibold">Ramah Mahasiswa:</strong> Barista atau staf tidak mengusir mahasiswa yang memesan wajar dan nugas &gt; 3 jam.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
