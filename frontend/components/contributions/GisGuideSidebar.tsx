'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  MapPinIcon,
  LightbulbIcon,
  InfoIcon,
  PlugChargingIcon,
  WifiHighIcon,
  CoffeeIcon,
  NavigationArrowIcon,
  SpinnerGapIcon,
} from '@phosphor-icons/react';

const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[240px] bg-[#F6F4ED] rounded-xl flex flex-col items-center justify-center gap-2">
      <div className="w-7 h-7 rounded-full border-2 border-[#005B54] border-t-transparent animate-spin" />
      <span className="text-xs font-semibold text-gray-600">Memuat Peta Georeferensi...</span>
    </div>
  ),
});

export interface GisGuideSidebarProps {
  lat: number;
  lng: number;
  isLocationSet: boolean;
  onLocationChange: (lat: number, lng: number) => void;
  onAddressDetected?: (address: string) => void;
}

export function GisGuideSidebar({
  lat,
  lng,
  isLocationSet,
  onLocationChange,
  onAddressDetected,
}: GisGuideSidebarProps) {
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationFeedback, setLocationFeedback] = useState<string | null>(null);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationFeedback('Browser Anda tidak mendukung geolokasi GPS.');
      return;
    }

    setIsDetectingLocation(true);
    setLocationFeedback(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const detectedLat = Number(position.coords.latitude.toFixed(6));
        const detectedLng = Number(position.coords.longitude.toFixed(6));
        onLocationChange(detectedLat, detectedLng);
        setIsAutoFilled(true);
        setLocationFeedback('Lokasi GPS berhasil dideteksi! Peta telah terpusat ke lokasi Anda.');
        setIsDetectingLocation(false);

        // Optional Reverse Geocoding to assist address filling
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${detectedLat}&lon=${detectedLng}&format=json`,
            { headers: { 'Accept-Language': 'id' } }
          );
          if (res.ok) {
            const data = await res.json();
            if (data?.display_name && onAddressDetected) {
              onAddressDetected(data.display_name);
            }
          }
        } catch {
          // ignore network failure for reverse geocoding
        }

        setTimeout(() => setIsAutoFilled(false), 4000);
      },
      (error) => {
        let msg = 'Gagal mendeteksi lokasi GPS.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Izin akses lokasi ditolak. Silakan izinkan lokasi di browser.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Sinyal GPS tidak tersedia.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Waktu pencarian lokasi habis.';
        }
        setLocationFeedback(msg);
        setIsDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <aside className="w-full lg:w-[420px] shrink-0 space-y-5 lg:sticky lg:top-20">
      {/* Card 1: Pin Lokasi GIS Interaktif */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPinIcon size={20} weight="duotone" className="text-[#005B54]" />
            <h3 className="text-sm font-bold text-gray-900">
              Pin Georeferensi Lokasi <span className="text-red-500">*</span>
            </h3>
          </div>
          <span className="bg-[#E0F3EE] text-[#005B54] text-xs font-bold px-2.5 py-1 rounded-full border border-[#005B54]">
            {isLocationSet ? 'Tersimpan' : 'Belum Dipin'}
          </span>
        </div>

        {/* 1-Click Detect Location Button */}
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isDetectingLocation}
          className="w-full h-11 bg-teal-50 hover:bg-teal-100/80 text-[#005B54] border border-[#005B54] rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-60 shadow-2xs"
        >
          {isDetectingLocation ? (
            <>
              <SpinnerGapIcon size={16} weight="bold" className="animate-spin text-[#005B54]" />
              <span>Mencari Koordinat GPS...</span>
            </>
          ) : (
            <>
              <NavigationArrowIcon size={16} weight="fill" className="text-[#005B54]" />
              <span>Gunakan Lokasi GPS Saya Saat Ini</span>
            </>
          )}
        </button>

        {locationFeedback && (
          <div className="text-xs text-[#005B54] bg-[#E0F3EE] border border-[#005B54] px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-2 animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-[#005B54] shrink-0" />
            <span>{locationFeedback}</span>
          </div>
        )}

        {/* Interactive Leaflet Mini Map */}
        <div className="w-full h-[230px] rounded-xl overflow-hidden border border-gray-200 shadow-2xs">
          <LocationPickerMap
            lat={lat}
            lng={lng}
            onChange={(newLat, newLng) => {
              onLocationChange(newLat, newLng);
              setIsAutoFilled(true);
              setTimeout(() => setIsAutoFilled(false), 2000);
            }}
          />
        </div>

        {/* Lat / Lng Coordinate Form Inputs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider">
            <span>Koordinat Auto-Fill</span>
            <span className="text-[#005B54] font-bold">EPSG:4326 (WGS 84)</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-xs text-gray-600 block font-semibold">
                Latitude (Lintang)
              </label>
              <input
                type={isLocationSet ? 'number' : 'text'}
                step="any"
                value={isLocationSet ? lat : ''}
                placeholder="Belum disematkan"
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) onLocationChange(val, lng);
                }}
                className={`w-full h-11 px-3 text-sm font-mono font-bold border rounded-xl text-gray-900 focus:outline-none transition-all ${
                  isAutoFilled
                    ? 'bg-teal-50 border-[#005B54] text-[#005B54]'
                    : isLocationSet
                    ? 'bg-[#F8FAFC] border-gray-200 focus:border-[#005B54]'
                    : 'bg-white border-dashed border-gray-300 text-gray-400 placeholder:text-gray-400'
                }`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-600 block font-semibold">
                Longitude (Bujur)
              </label>
              <input
                type={isLocationSet ? 'number' : 'text'}
                step="any"
                value={isLocationSet ? lng : ''}
                placeholder="Belum disematkan"
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) onLocationChange(lat, val);
                }}
                className={`w-full h-11 px-3 text-sm font-mono font-bold border rounded-xl text-gray-900 focus:outline-none transition-all ${
                  isAutoFilled
                    ? 'bg-teal-50 border-[#005B54] text-[#005B54]'
                    : isLocationSet
                    ? 'bg-[#F8FAFC] border-gray-200 focus:border-[#005B54]'
                    : 'bg-white border-dashed border-gray-300 text-gray-400 placeholder:text-gray-400'
                }`}
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 flex items-start gap-2 leading-relaxed">
          <InfoIcon size={16} weight="fill" className="text-[#005B54] shrink-0 mt-0.5" />
          <span>{isLocationSet ? 'Titik koordinat berhasil disematkan. Anda bisa menggeser pin di peta untuk menyempurnakan.' : 'Silakan klik tombol GPS atau klik langsung titik kafe di peta untuk menyematkan koordinat.'}</span>
        </p>
      </div>

      {/* Card 2: Alur Verifikasi Kontribusi Mahasiswa */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#005B54]" />
          <h3 className="text-sm font-bold text-gray-900">
            Alur Verifikasi Kontribusi Mahasiswa
          </h3>
        </div>

        <div className="space-y-3.5">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#005B54] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              1
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                Formulir Masuk Antrean Kurasi
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Sistem WebGIS menerima usulan spot secara anonim dan menghitung skor kelayakan spasial awal.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#005B54] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              2
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                Validasi Fisik Lapangan (SV IPB)
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Tim relawan mahasiswa mengecek langsung soket colokan, tes kecepatan Wi-Fi riil, dan kenyamanan nugas.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#005B54] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              3
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                Terbit Resmi di Peta WebGIS
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Spot yang lolos kurasi langsung aktif dan dapat diakses mahasiswa se-Kota Bogor untuk rute belajar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Standar Spot Nugas Berkualitas */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-6 space-y-3.5">
        <div className="flex items-center gap-2">
          <LightbulbIcon size={18} weight="duotone" className="text-amber-500" />
          <h3 className="text-sm font-bold text-gray-900">
            Standar Spot Nugas Berkualitas
          </h3>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-gray-600">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center text-[#005B54] shrink-0 mt-0.5">
              <PlugChargingIcon size={14} weight="duotone" />
            </div>
            <p className="leading-snug">
              <strong className="text-gray-900 font-semibold">Colokan Kokoh:</strong> Stopkontak tidak longgar saat dicolok charger laptop.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center text-[#005B54] shrink-0 mt-0.5">
              <WifiHighIcon size={14} weight="bold" />
            </div>
            <p className="leading-snug">
              <strong className="text-gray-900 font-semibold">Wi-Fi Stabil &gt; 25 Mbps:</strong> Tidak putus-nyambung saat jam padat sore hari.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center text-[#005B54] shrink-0 mt-0.5">
              <CoffeeIcon size={14} weight="duotone" />
            </div>
            <p className="leading-snug">
              <strong className="text-gray-900 font-semibold">Ramah Mahasiswa:</strong> Boleh nugas &gt; 3 jam dengan pemesanan minuman yang wajar.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
