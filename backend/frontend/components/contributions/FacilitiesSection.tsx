'use client';

import { PlugZap, Plug, Unplug, Wifi, Headphones, Volume2, VolumeX, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface FacilitiesSectionProps {
  plugAvailability: 'abundant' | 'moderate' | 'limited' | null;
  onPlugAvailabilityChange: (val: 'abundant' | 'moderate' | 'limited') => void;
  wifiDownload: string;
  onWifiDownloadChange: (val: string) => void;
  wifiUpload: string;
  onWifiUploadChange: (val: string) => void;
  wifiStable: boolean;
  onWifiStableChange: (val: boolean) => void;
  noiseLevel: 'quiet' | 'moderate' | 'lively' | null;
  onNoiseLevelChange: (val: 'quiet' | 'moderate' | 'lively') => void;
  amenities: string[];
  onToggleAmenity: (id: string) => void;
}

const AMENITIES_LIST = [
  { id: 'musholla', label: 'Musholla Bersih' },
  { id: '24jam', label: 'Buka 24 Jam / Larut' },
  { id: 'ac', label: 'Full AC Dingin' },
  { id: 'parkir_motor', label: 'Parkir Motor Luas' },
  { id: 'outdoor', label: 'Area Outdoor / Terbuka' },
  { id: 'kursi_ergonomis', label: 'Kursi Ergonomis Bersandar' },
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
    <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 sm:p-8 space-y-6">
      {/* Header with Step 2 Circle */}
      <div className="flex items-start gap-3.5 pb-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          2
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Verifikasi Fasilitas Kunci Nugas
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Metrik fasilitas riil yang paling dicari mahasiswa saat memilih tempat belajar
          </p>
        </div>
      </div>

      {/* Field: Ketersediaan Colokan Listrik */}
      <div className="space-y-2.5">
        <label className="text-sm font-bold text-gray-900 block">
          Ketersediaan Stopkontak / Colokan Listrik <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Banyak */}
          <div
            onClick={() => onPlugAvailabilityChange('abundant')}
            className={cn(
              'p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2 active:scale-[0.98] select-none',
              plugAvailability === 'abundant'
                ? 'bg-[#F0FAF7] border-[#005B54] ring-1 ring-[#005B54]/30 shadow-xs'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <PlugZap className="w-4.5 h-4.5 text-[#005B54]" />
                <span>Banyak Meja (&gt;70%)</span>
              </div>
              {plugAvailability === 'abundant' && (
                <div className="w-2 h-2 rounded-full bg-[#005B54]" />
              )}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Tersedia di hampir tiap meja nugas, laptop aman seharian
            </p>
          </div>

          {/* Cukup */}
          <div
            onClick={() => onPlugAvailabilityChange('moderate')}
            className={cn(
              'p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2 active:scale-[0.98] select-none',
              plugAvailability === 'moderate'
                ? 'bg-[#F0FAF7] border-[#005B54] ring-1 ring-[#005B54]/30 shadow-xs'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <Plug className="w-4.5 h-4.5 text-amber-500" />
                <span>Meja Tertentu (~50%)</span>
              </div>
              {plugAvailability === 'moderate' && (
                <div className="w-2 h-2 rounded-full bg-[#005B54]" />
              )}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Ada di meja tepi dinding atau meja bar kerja
            </p>
          </div>

          {/* Terbatas */}
          <div
            onClick={() => onPlugAvailabilityChange('limited')}
            className={cn(
              'p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2 active:scale-[0.98] select-none',
              plugAvailability === 'limited'
                ? 'bg-[#F0FAF7] border-[#005B54] ring-1 ring-[#005B54]/30 shadow-xs'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <Unplug className="w-4.5 h-4.5 text-gray-400" />
                <span>Minim Colokan (&lt;30%)</span>
              </div>
              {plugAvailability === 'limited' && (
                <div className="w-2 h-2 rounded-full bg-[#005B54]" />
              )}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Hanya di sudut tertentu atau dekat meja kasir
            </p>
          </div>
        </div>
      </div>

      {/* Card: Kecepatan Wi-Fi Rata-rata */}
      <div className="bg-[#F0FAF7] border border-[#A7F3D0] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#005B54] text-white flex items-center justify-center">
              <Wifi className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-gray-900">
              Kecepatan &amp; Kestabilan Wi-Fi Mahasiswa
            </span>
          </div>
          <span className="bg-[#005B54] text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Target &gt; 25 Mbps
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              Download Speed (Mbps) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={wifiDownload}
                onChange={(e) => onWifiDownloadChange(e.target.value)}
                placeholder="Cth: 45"
                className="w-full h-11 pl-4 pr-14 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">
                Mbps
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              Upload Speed (Mbps)
            </label>
            <div className="relative">
              <input
                type="number"
                value={wifiUpload}
                onChange={(e) => onWifiUploadChange(e.target.value)}
                placeholder="Cth: 20"
                className="w-full h-11 pl-4 pr-14 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">
                Mbps
              </span>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-3 pt-1 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={wifiStable}
            onChange={(e) => onWifiStableChange(e.target.checked)}
            className="w-4 h-4 rounded text-[#005B54] focus:ring-[#005B54] accent-[#005B54]"
          />
          <span className="text-xs sm:text-sm text-gray-700 font-medium">
            Koneksi stabil tanpa landing page OTP ribet atau sering terputus
          </span>
        </label>
      </div>

      {/* Field: Tingkat Kebisingan / Ambien Suasana */}
      <div className="space-y-2.5">
        <label className="text-sm font-bold text-gray-900 block">
          Tingkat Kebisingan / Ambien Suasana <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2.5">
          {/* Tenang */}
          <div
            onClick={() => onNoiseLevelChange('quiet')}
            className={cn(
              'p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between active:scale-[0.99] select-none',
              noiseLevel === 'quiet'
                ? 'bg-[#F0FAF7] border-[#005B54] ring-1 ring-[#005B54]/30 shadow-xs'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
            )}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-[#005B54]">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Zona Hening / Deep Work (&lt; 50 dB)
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Sangat kondusif untuk tugas skripsi, coding, dan membaca tanpa gangguan
                </p>
              </div>
            </div>
            <div className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0',
              noiseLevel === 'quiet' ? 'border-[#005B54] bg-[#005B54]' : 'border-gray-300'
            )}>
              {noiseLevel === 'quiet' && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </div>

          {/* Sedang */}
          <div
            onClick={() => onNoiseLevelChange('moderate')}
            className={cn(
              'p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between active:scale-[0.99] select-none',
              noiseLevel === 'moderate'
                ? 'bg-[#F0FAF7] border-[#005B54] ring-1 ring-[#005B54]/30 shadow-xs'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
            )}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Sedang / Musik Instrumental Santai (50–65 dB)
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Nyaman untuk tugas mingguan dan meeting online santai
                </p>
              </div>
            </div>
            <div className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0',
              noiseLevel === 'moderate' ? 'border-[#005B54] bg-[#005B54]' : 'border-gray-300'
            )}>
              {noiseLevel === 'moderate' && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </div>

          {/* Ramai */}
          <div
            onClick={() => onNoiseLevelChange('lively')}
            className={cn(
              'p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between active:scale-[0.99] select-none',
              noiseLevel === 'lively'
                ? 'bg-[#F0FAF7] border-[#005B54] ring-1 ring-[#005B54]/30 shadow-xs'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
            )}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <VolumeX className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Ramai / Social Hub (&gt; 65 dB)
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Diskusi kelompok santai, obrolan interaktif &amp; tidak hening
                </p>
              </div>
            </div>
            <div className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0',
              noiseLevel === 'lively' ? 'border-[#005B54] bg-[#005B54]' : 'border-gray-300'
            )}>
              {noiseLevel === 'lively' && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </div>
        </div>
      </div>

      {/* Field: Fasilitas Penunjang Penting Lainnya (Checkboxes) */}
      <div className="space-y-2.5">
        <label className="text-sm font-bold text-gray-900 block">
          Fasilitas Penunjang Tambahan
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {AMENITIES_LIST.map((item) => {
            const isChecked = amenities.includes(item.id);
            return (
              <label
                key={item.id}
                onClick={() => onToggleAmenity(item.id)}
                className={cn(
                  'p-3.5 rounded-xl border text-sm font-medium cursor-pointer transition-all flex items-center gap-2.5 select-none active:scale-[0.98]',
                  isChecked
                    ? 'bg-[#F0FAF7] border-[#005B54] text-[#005B54] font-bold ring-1 ring-[#005B54]/20 shadow-2xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0',
                    isChecked ? 'bg-[#005B54] text-white' : 'border-2 border-gray-300 bg-white'
                  )}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="truncate text-xs sm:text-sm">{item.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );
}
