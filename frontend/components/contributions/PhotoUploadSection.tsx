/* eslint-disable @next/next/no-img-element */
'use client';

import { Image as ImageIcon, Wifi, Coffee, X, Upload } from 'lucide-react';

export interface PhotoUploadSectionProps {
  photoMain: string | null;
  onPhotoMainChange: (val: string | null) => void;
  photoSpeedtest: string | null;
  onPhotoSpeedtestChange: (val: string | null) => void;
  photoMenu: string | null;
  onPhotoMenuChange: (val: string | null) => void;
  onImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => void;
}

export function PhotoUploadSection({
  photoMain,
  onPhotoMainChange,
  photoSpeedtest,
  onPhotoSpeedtestChange,
  photoMenu,
  onPhotoMenuChange,
  onImageUpload,
}: PhotoUploadSectionProps) {
  const hasEvidence = Boolean(photoMain || photoSpeedtest || photoMenu);

  return (
    <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 sm:p-8 space-y-6">
      {/* Header with Step 4 Circle */}
      <div className="flex items-start gap-3.5 pb-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          4
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Lampirkan Bukti Lapangan <span className="text-red-500">*</span>
            </h2>
            {hasEvidence ? (
              <span className="text-xs font-bold text-[#005B54] bg-[#E0F3EE] px-2.5 py-0.5 rounded-full border border-teal-200/60">
                ✓ Minimal 1 Bukti Terlampir
              </span>
            ) : (
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                Wajib Minimal 1 Bukti
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Unggah minimal salah satu bukti: foto suasana/meja kerja, screenshot uji kecepatan Wi-Fi, atau foto daftar menu/kasir. Bukti ini wajib untuk verifikasi kurator relawan sebelum titik nugas tayang di WebGIS.
          </p>
        </div>
      </div>

      {/* 3 Upload Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Foto Suasana */}
        <div className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between space-y-3 bg-gray-50/40 hover:bg-white transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <ImageIcon className="w-4.5 h-4.5 text-[#005B54]" />
              <span className="text-xs font-bold bg-[#E0F3EE] text-[#005B54] px-2 py-0.5 rounded-md">
                Spot Utama
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900 leading-snug">
              Foto Suasana &amp; Meja
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Keterangan stopkontak tiap meja, kenyamanan kursi &amp; pencahayaan.
            </p>
          </div>

          {photoMain ? (
            <div className="relative w-full h-28 rounded-xl overflow-hidden border border-gray-200 group">
              <img src={photoMain} alt="Preview Suasana" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onPhotoMainChange(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border border-dashed border-gray-300 hover:border-[#005B54] hover:bg-teal-50/30 rounded-xl p-4 text-center cursor-pointer transition-all bg-white flex flex-col items-center justify-center gap-2 active:scale-[0.98]">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-xs font-bold bg-[#005B54] text-white px-3 py-1.5 rounded-lg shadow-2xs">
                Pilih File Foto
              </span>
              <span className="text-xs text-gray-400">JPG, PNG · Maks 5MB</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onImageUpload(e, onPhotoMainChange)}
              />
            </label>
          )}
        </div>

        {/* Card 2: Screenshot Speedtest */}
        <div className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between space-y-3 bg-gray-50/40 hover:bg-white transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Wifi className="w-4.5 h-4.5 text-[#005B54]" />
              <span className="text-xs font-bold bg-[#E0F3EE] text-[#005B54] px-2 py-0.5 rounded-md">
                Min. 25 Mbps
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900 leading-snug">
              Screenshot Speedtest Wi-Fi
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Tangkapan layar uji kecepatan Ookla / Fast.com saat kamu nugas.
            </p>
          </div>

          {photoSpeedtest ? (
            <div className="relative w-full h-28 rounded-xl overflow-hidden border border-gray-200 group">
              <img src={photoSpeedtest} alt="Preview Speedtest" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onPhotoSpeedtestChange(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border border-dashed border-gray-300 hover:border-[#005B54] hover:bg-teal-50/30 rounded-xl p-4 text-center cursor-pointer transition-all bg-white flex flex-col items-center justify-center gap-2 active:scale-[0.98]">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-xs font-bold bg-[#005B54] text-white px-3 py-1.5 rounded-lg shadow-2xs">
                Upload Bukti Uji
              </span>
              <span className="text-xs text-gray-400">PNG, JPG · Bukti riil</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onImageUpload(e, onPhotoSpeedtestChange)}
              />
            </label>
          )}
        </div>

        {/* Card 3: Foto Daftar Menu & Harga */}
        <div className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between space-y-3 bg-gray-50/40 hover:bg-white transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Coffee className="w-4.5 h-4.5 text-[#005B54]" />
              <span className="text-xs font-bold bg-[#E0F3EE] text-[#005B54] px-2 py-0.5 rounded-md">
                Menu &amp; Harga
              </span>
            </div>
            <p className="text-sm font-bold text-gray-900 leading-snug">
              Foto Daftar Menu &amp; Kasir
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Foto papan menu untuk verifikasi harga makanan &amp; minuman mahasiswa.
            </p>
          </div>

          {photoMenu ? (
            <div className="relative w-full h-28 rounded-xl overflow-hidden border border-gray-200 group">
              <img src={photoMenu} alt="Preview Menu" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onPhotoMenuChange(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border border-dashed border-gray-300 hover:border-[#005B54] hover:bg-teal-50/30 rounded-xl p-4 text-center cursor-pointer transition-all bg-white flex flex-col items-center justify-center gap-2 active:scale-[0.98]">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-xs font-bold bg-[#005B54] text-white px-3 py-1.5 rounded-lg shadow-2xs">
                Pilih Foto Menu
              </span>
              <span className="text-xs text-gray-400">JPG, PNG · Papan kasir</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onImageUpload(e, onPhotoMenuChange)}
              />
            </label>
          )}
        </div>
      </div>
    </section>
  );
}
