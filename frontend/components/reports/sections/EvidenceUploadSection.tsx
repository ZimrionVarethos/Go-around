/* eslint-disable @next/next/no-img-element */
'use client';

import {
  PlugIcon,
  WifiHighIcon,
  TrendUpIcon,
  UploadSimpleIcon,
  XIcon,
} from '@phosphor-icons/react';

interface EvidenceUploadSectionProps {
  photoColokan: string | null;
  photoSpeedtest: string | null;
  photoMenu: string | null;
  onUploadColokan: (url: string | null) => void;
  onUploadSpeedtest: (url: string | null) => void;
  onUploadMenu: (url: string | null) => void;
}

export function EvidenceUploadSection({
  photoColokan,
  photoSpeedtest,
  photoMenu,
  onUploadColokan,
  onUploadSpeedtest,
  onUploadMenu,
}: EvidenceUploadSectionProps) {
  const hasEvidence = Boolean(photoColokan || photoSpeedtest || photoMenu);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-7 space-y-5">
      {/* Header with Step 4 Badge */}
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
            4
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                Lampirkan Bukti Lapangan <span className="text-red-500">*</span>
              </h2>
              {hasEvidence ? (
                <span className="text-xs font-bold text-[#005B54] bg-[#E0F3EE] px-2.5 py-0.5 rounded-full border border-[#005B54]">
                  ✓ Minimal 1 Bukti Terlampir
                </span>
              ) : (
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                  Wajib Minimal 1 Bukti
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Unggah salah satu bukti: foto fisik kendala, screenshot speedtest Wi-Fi, atau foto menu/struk. Bukti ini wajib agar admin kurator dapat memverifikasi laporan.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Upload Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Foto Colokan / Meja */}
        <div className="border border-gray-200/90 rounded-2xl p-4 flex flex-col justify-between space-y-3 bg-gray-50/50 hover:bg-white transition-colors">
          <div>
            <div className="flex items-center gap-1.5 text-[#005B54] font-bold text-xs mb-1">
              <PlugIcon size={16} weight="duotone" />
              <span>Foto Fisik Kendala</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
              Colokan / Meja Rusak
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Foto stopkontak mati, meja goyang, atau fasilitas bermasalah.
            </p>
          </div>

          {photoColokan ? (
            <div className="relative w-full h-28 rounded-xl overflow-hidden border border-gray-200 group">
              <img src={photoColokan} alt="Preview Colokan" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onUploadColokan(null)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                title="Hapus foto"
              >
                <XIcon size={14} weight="bold" />
              </button>
            </div>
          ) : (
            <label className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#005B54] hover:bg-teal-50/20 transition-all">
              <UploadSimpleIcon size={20} weight="bold" className="text-gray-400 mb-1.5" />
              <span className="text-xs font-bold text-[#005B54] bg-[#E0F3EE] px-3 py-1 rounded-full mb-1">
                Pilih File
              </span>
              <span className="text-xs text-gray-400">JPG, PNG, WebP · Maks 5MB</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, onUploadColokan)}
              />
            </label>
          )}
        </div>

        {/* Card 2: Screenshot Speedtest Wi-Fi */}
        <div className="border border-gray-200/90 rounded-2xl p-4 flex flex-col justify-between space-y-3 bg-gray-50/50 hover:bg-white transition-colors">
          <div>
            <div className="flex items-center gap-1.5 text-[#005B54] font-bold text-xs mb-1">
              <WifiHighIcon size={16} weight="bold" />
              <span>Bukti Jaringan</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
              Screenshot Speedtest Wi-Fi
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Bukti hasil uji Ookla / Fast.com saat koneksi drop atau lambat.
            </p>
          </div>

          {photoSpeedtest ? (
            <div className="relative w-full h-28 rounded-xl overflow-hidden border border-gray-200 group">
              <img src={photoSpeedtest} alt="Preview Speedtest" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onUploadSpeedtest(null)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                title="Hapus screenshot"
              >
                <XIcon size={14} weight="bold" />
              </button>
            </div>
          ) : (
            <label className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#005B54] hover:bg-teal-50/20 transition-all">
              <UploadSimpleIcon size={20} weight="bold" className="text-gray-400 mb-1.5" />
              <span className="text-xs font-bold text-[#005B54] bg-[#E0F3EE] px-3 py-1 rounded-full mb-1">
                Pilih File
              </span>
              <span className="text-xs text-gray-400">JPG, PNG, WebP · Maks 5MB</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, onUploadSpeedtest)}
              />
            </label>
          )}
        </div>

        {/* Card 3: Foto Menu Baru / Struk */}
        <div className="border border-gray-200/90 rounded-2xl p-4 flex flex-col justify-between space-y-3 bg-gray-50/50 hover:bg-white transition-colors">
          <div>
            <div className="flex items-center gap-1.5 text-[#005B54] font-bold text-xs mb-1">
              <TrendUpIcon size={16} weight="bold" />
              <span>Koreksi Harga</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
              Foto Menu Baru / Struk
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Bukti pembaruan daftar harga kopi atau kebijakan pembelian.
            </p>
          </div>

          {photoMenu ? (
            <div className="relative w-full h-28 rounded-xl overflow-hidden border border-gray-200 group">
              <img src={photoMenu} alt="Preview Menu" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onUploadMenu(null)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                title="Hapus foto"
              >
                <XIcon size={14} weight="bold" />
              </button>
            </div>
          ) : (
            <label className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#005B54] hover:bg-teal-50/20 transition-all">
              <UploadSimpleIcon size={20} weight="bold" className="text-gray-400 mb-1.5" />
              <span className="text-xs font-bold text-[#005B54] bg-[#E0F3EE] px-3 py-1 rounded-full mb-1">
                Pilih File
              </span>
              <span className="text-xs text-gray-400">JPG, PNG, WebP · Maks 5MB</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, onUploadMenu)}
              />
            </label>
          )}
        </div>
      </div>
    </section>
  );
}
