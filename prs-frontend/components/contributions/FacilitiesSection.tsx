'use client';

import { Star, Zap, Wifi, Headphones, Volume2, VolumeX, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface FacilitiesSectionProps {
  plugAvailability: 'abundant' | 'moderate' | 'limited';
  onPlugAvailabilityChange: (val: 'abundant' | 'moderate' | 'limited') => void;
  wifiDownload: string;
  onWifiDownloadChange: (val: string) => void;
  wifiUpload: string;
  onWifiUploadChange: (val: string) => void;
  wifiStable: boolean;
  onWifiStableChange: (val: boolean) => void;
  noiseLevel: 'quiet' | 'moderate' | 'lively';
  onNoiseLevelChange: (val: 'quiet' | 'moderate' | 'lively') => void;
  amenities: string[];
  onToggleAmenity: (id: string) => void;
}

const AMENITIES_LIST = [
  { id: 'musholla', label: 'Musholla Bersih' },
  { id: '24jam', label: 'Buka 24 Jam' },
  { id: 'ac', label: 'Full AC Dingin' },
  { id: 'parkir_motor', label: 'Parkir Motor Luas' },
  { id: 'outdoor', label: 'Area Outdoor / Smoking' },
  { id: 'kursi_ergonomis', label: 'Kursi Bersandaran' },
];

export function FacilitiesSection({
  plugAvailability,
  onPlugAvailabilityChange,
  wifiDownload,
  onWifiDownloadChange,
  wifiUpload,
  onWifiUploadChange,
  wifiStable,
  onWifiStableChange,
  noiseLevel,
  onNoiseLevelChange,
  amenities,
  onToggleAmenity,
}: FacilitiesSectionProps) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-7 space-y-5">
      {/* Header with Step 2 Circle */}
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
          2
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            Verifikasi Fasilitas Kunci Nugas
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Metrik spasial nyata yang sangat dibutuhkan mahasiswa saat belajar
          </p>
        </div>
      </div>

      {/* Field: Ketersediaan Colokan Listrik (Power Plug) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-800">
          Ketersediaan Colokan Listrik (Power Plug) <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Banyak */}
          <div
            onClick={() => onPlugAvailabilityChange('abundant')}
            className={cn(
              'p-3.5 rounded-[12px] border cursor-pointer transition-all flex flex-col gap-1 active:scale-[0.98] select-none',
              plugAvailability === 'abundant'
                ? 'bg-[#F0FAF7] border-[#005B54] ring-1 ring-[#005B54]/30 shadow-xs'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
            )}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Banyak (90%+)</span>
            </div>
            <p className="text-[11px] text-gray-500">Tersedia di hampir tiap meja nugas</p>
          </div>

          {/* Cukup */}
          <div
            onClick={() => onPlugAvailabilityChange('moderate')}
            className={cn(
              'p-3.5 rounded-[12px] border cursor-pointer transition-all flex flex-col gap-1 active:scale-[0.98] select-none',
              plugAvailability === 'moderate'
                ? 'bg-[#F0FAF7] border-[#005B54] ring-1 ring-[#005B54]/30 shadow-xs'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
            )}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
              <Zap className="w-3.5 h-3.5 text-teal-600 fill-teal-600" />
              <span>Cukup (~50%)</span>
            </div>
            <p className="text-[11px] text-gray-500">Ada di meja tertentu atau tiang tengah</p>
          </div>

          {/* Terbatas */}
          <div
            onClick={() => onPlugAvailabilityChange('limited')}
            className={cn(
              'p-3.5 rounded-[12px] border cursor-pointer transition-all flex flex-col gap-1 active:scale-[0.98] select-none',
              plugAvailability === 'limited'
                ? 'bg-[#F0FAF7] border-[#005B54] ring-1 ring-[#005B54]/30 shadow-xs'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
            )}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
              <Zap className="w-3.5 h-3.5 text-gray-400" />
              <span>Terbatas</span>
            </div>
            <p className="text-[11px] text-gray-500">Hanya di sudut dinding atau meja kasir</p>
          </div>
        </div>
      </div>

      {/* Card: Kecepatan Wi-Fi Rata-rata */}
      <div className="bg-[#F0FAF7] border border-[#A7F3D0] rounded-[14px] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-[#005B54]" />
            <span className="text-xs font-bold text-gray-900">
              Kecepatan Wi-Fi Rata-rata (Estimasi / Speedtest)
            </span>
          </div>
          <span className="bg-[#005B54] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Minimum target &gt; 25 Mbps
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] text-gray-600 font-medium">
              Download Speed (Mbps)
            </label>
            <div className="relative">
              <input
                type="number"
                value={wifiDownload}
                onChange={(e) => onWifiDownloadChange(e.target.value)}
                placeholder="65"
                className="w-full h-9 pl-3 pr-12 text-xs bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#005B54]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 font-semibold">
                Mbps
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-gray-600 font-medium">
              Upload Speed (Mbps)
            </label>
            <div className="relative">
              <input
                type="number"
                value={wifiUpload}
                onChange={(e) => onWifiUploadChange(e.target.value)}
                placeholder="40"
                className="w-full h-9 pl-3 pr-12 text-xs bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#005B54]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 font-semibold">
                Mbps
              </span>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 pt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={wifiStable}
            onChange={(e) => onWifiStableChange(e.target.checked)}
            className="w-4 h-4 rounded text-[#005B54] focus:ring-[#005B54]"
          />
          <span className="text-[11.5px] text-gray-700 font-medium">
            Koneksi stabil tanpa landing page OTP ribet / bebas putus 2 jam
          </span>
        </label>
      </div>

      {/* Field: Tingkat Kebisingan / Ambien Suasana */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-800">
          Tingkat Kebisingan / Ambien Suasana <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {/* Tenang */}
          <div
            onClick={() => onNoiseLevelChange('quiet')}
            className={cn(
              'p-3 rounded-[12px] border cursor-pointer transition-all flex items-center justify-between active:scale-[0.99] select-none',
              noiseLevel === 'quiet'
                ? 'bg-[#F0FAF7] border-[#005B54] ring-1 ring-[#005B54]/30 shadow-xs'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
            )}
          >
            <div className="flex items-center gap-3">
              <Headphones className="w-4 h-4 text-[#005B54]" />
              <div>
                <p className="text-xs font-bold text-gray-900">
                  Tenang / Deep Work (&lt; 50 dB)
                </p>
                <p className="text-[11px] text-gray-500">
                  Ideal untuk tugas fokus skripsi, coding, dan membaca teliti
                </p>
              </div>
            </div>
            <div className={cn(
              'w-4 h-4 rounded-full border flex items-center justify-center transition-colors',
              noiseLevel === 'quiet' ? 'border-[#005B54] bg-[#005B54]' : 'border-gray-300'
            )}>
              {noiseLevel === 'quiet' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </div>

          {/* Sedang */}
          <div
            onClick={() => onNoiseLevelChange('moderate')}
            className={cn(
              'p-3 rounded-[12px] border cursor-pointer transition-all flex items-center justify-between active:scale-[0.99] select-none',
              noiseLevel === 'moderate'
                ? 'bg-[#F0FAF7] border-[#005B54] ring-1 ring-[#005B54]/30 shadow-xs'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
            )}
          >
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-teal-600" />
              <div>
                <p className="text-xs font-bold text-gray-900">
                  Sedang / Background Lo-Fi (50–65 dB)
                </p>
                <p className="text-[11px] text-gray-500">
                  Nyaman untuk tugas mingguan &amp; casual meeting online
                </p>
              </div>
            </div>
            <div className={cn(
              'w-4 h-4 rounded-full border flex items-center justify-center transition-colors',
              noiseLevel === 'moderate' ? 'border-[#005B54] bg-[#005B54]' : 'border-gray-300'
            )}>
              {noiseLevel === 'moderate' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </div>

          {/* Ramai */}
          <div
            onClick={() => onNoiseLevelChange('lively')}
            className={cn(
              'p-3 rounded-[12px] border cursor-pointer transition-all flex items-center justify-between active:scale-[0.99] select-none',
              noiseLevel === 'lively'
                ? 'bg-[#F0FAF7] border-[#005B54] ring-1 ring-[#005B54]/30 shadow-xs'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
            )}
          >
            <div className="flex items-center gap-3">
              <VolumeX className="w-4 h-4 text-amber-600" />
              <div>
                <p className="text-xs font-bold text-gray-900">
                  Ramai / Vibe Barista Casual (&gt;65 dB)
                </p>
                <p className="text-[11px] text-gray-500">
                  Diskusi kelompok santai, obrolan kreatif &amp; tidak hening total
                </p>
              </div>
            </div>
            <div className={cn(
              'w-4 h-4 rounded-full border flex items-center justify-center transition-colors',
              noiseLevel === 'lively' ? 'border-[#005B54] bg-[#005B54]' : 'border-gray-300'
            )}>
              {noiseLevel === 'lively' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </div>
        </div>
      </div>

      {/* Field: Fasilitas Penunjang Penting Lainnya (Checkboxes) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-800">
          Fasilitas Penunjang Penting Lainnya
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {AMENITIES_LIST.map((item) => {
            const isChecked = amenities.includes(item.id);
            return (
              <label
                key={item.id}
                onClick={() => onToggleAmenity(item.id)}
                className={cn(
                  'p-2.5 rounded-[12px] border text-xs font-medium cursor-pointer transition-all flex items-center gap-2 select-none active:scale-[0.98]',
                  isChecked
                    ? 'bg-[#F0FAF7] border-[#005B54] text-[#005B54] font-semibold ring-1 ring-[#005B54]/20 shadow-2xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                )}
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded-[5px] flex items-center justify-center transition-colors shrink-0',
                    isChecked ? 'bg-[#005B54] text-white' : 'border border-gray-300 bg-white'
                  )}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="truncate">{item.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );
}
