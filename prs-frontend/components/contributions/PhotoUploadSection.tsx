/* eslint-disable @next/next/no-img-element */
'use client';

import { Check, Image as ImageIcon, Wifi, Coffee, X, Upload } from 'lucide-react';

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
  return (
    <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 sm:p-7 space-y-5">
      {/* Header with Step 4 Circle + Badges */}
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#005B54] text-white font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5">
            4
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-gray-900">
                Lampirkan Foto Lapangan
              </h2>
              <span className="bg-gray-100 text-gray-600 text-[10.5px] font-semibold px-2 py-0.5 rounded-full">
                Opsional tapi Direkomendasikan
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Unggah bukti foto fisik fasilitas &amp; jaringan untuk mempercepat verifikasi relawan dan meningkatkan skor validasi spot nugas.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 bg-[#E0F3EE] text-[#005B54] text-[11px] font-bold px-2.5 py-1 rounded-full">
          <Check className="w-3 h-3 stroke-[3]" />
          <span>Validasi 2x Lebih Cepat</span>
        </span>
      </div>

      {/* 3 Upload Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: Foto Suasana */}
        <div className="border border-gray-200 rounded-xl p-3.5 flex flex-col justify-between space-y-3 bg-[#FBFBFB]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <ImageIcon className="w-4 h-4 text-[#005B54]" />
              <span className="text-[10px] font-bold bg-[#E0F3EE] text-[#005B54] px-1.5 py-0.5 rounded">
                SPOT UTAMA
              </span>
            </div>
            <p className="text-xs font-bold text-gray-900 leading-snug">
              Foto Suasana &amp; Meja Kerja
            </p>
            <p className="text-[10.5px] text-gray-400 mt-0.5 leading-tight">
              Keterangan stopkontak per meja, tata letak kursi &amp; pencahayaan.
            </p>
          </div>

          {photoMain ? (
            <div className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-200">
              <img src={photoMain} alt="Preview Suasana" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onPhotoMainChange(null)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label className="border border-dashed border-gray-300 hover:border-[#005B54] rounded-lg p-3 text-center cursor-pointer transition-colors bg-white flex flex-col items-center justify-center gap-1.5">
              <Upload className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] font-semibold bg-[#005B54] text-white px-2.5 py-1 rounded-md">
                Pilih File
              </span>
              <span className="text-[9.5px] text-gray-400">JPG, PNG, WebP · Maks 5MB</span>
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
        <div className="border border-gray-200 rounded-xl p-3.5 flex flex-col justify-between space-y-3 bg-[#FBFBFB]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <Wifi className="w-4 h-4 text-[#005B54]" />
              <span className="text-[10px] font-bold bg-[#E0F3EE] text-[#005B54] px-1.5 py-0.5 rounded">
                MIN. 25 MBPS
              </span>
            </div>
            <p className="text-xs font-bold text-gray-900 leading-snug">
              Screenshot Speedtest Wi-Fi
            </p>
            <p className="text-[10.5px] text-gray-400 mt-0.5 leading-tight">
              Hasil speedtest via Ookla / Fast.com / wifi lab min. 25 Mbps.
            </p>
          </div>

          {photoSpeedtest ? (
            <div className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-200">
              <img src={photoSpeedtest} alt="Preview Speedtest" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onPhotoSpeedtestChange(null)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label className="border border-dashed border-gray-300 hover:border-[#005B54] rounded-lg p-3 text-center cursor-pointer transition-colors bg-white flex flex-col items-center justify-center gap-1.5">
              <Upload className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] font-semibold bg-[#005B54] text-white px-2.5 py-1 rounded-md">
                Upload SS
              </span>
              <span className="text-[9.5px] text-gray-400">PNG, JPG · Bukti kecepatan riil</span>
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
        <div className="border border-gray-200 rounded-xl p-3.5 flex flex-col justify-between space-y-3 bg-[#FBFBFB]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <Coffee className="w-4 h-4 text-[#005B54]" />
              <span className="text-[10px] font-bold bg-[#E0F3EE] text-[#005B54] px-1.5 py-0.5 rounded">
                MENU &amp; HARGA
              </span>
            </div>
            <p className="text-xs font-bold text-gray-900 leading-snug">
              Foto Daftar Menu &amp; Harga
            </p>
            <p className="text-[10.5px] text-gray-400 mt-0.5 leading-tight">
              Foto papan kasir / buku menu untuk verifikasi harga ramah mahasiswa.
            </p>
          </div>

          {photoMenu ? (
            <div className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-200">
              <img src={photoMenu} alt="Preview Menu" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onPhotoMenuChange(null)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label className="border border-dashed border-gray-300 hover:border-[#005B54] rounded-lg p-3 text-center cursor-pointer transition-colors bg-white flex flex-col items-center justify-center gap-1.5">
              <Upload className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] font-semibold bg-[#005B54] text-white px-2.5 py-1 rounded-md">
                Pilih File
              </span>
              <span className="text-[9.5px] text-gray-400">JPG, PNG, WebP · Papan kasir</span>
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
