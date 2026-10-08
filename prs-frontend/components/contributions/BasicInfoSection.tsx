'use client';

import { Coffee, Laptop, BookOpen, Sparkles, Moon, Users } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface BasicInfoSectionProps {
  name: string;
  onNameChange: (val: string) => void;
  category: 'coffee_shop' | 'coworking' | 'library' | 'creative_hub' | null;
  onCategoryChange: (val: 'coffee_shop' | 'coworking' | 'library' | 'creative_hub') => void;
  studyVibe?: string | null;
  onStudyVibeChange?: (val: string) => void;
  subdistrict: string;
  onSubdistrictChange: (val: string) => void;
  campusAccess: string;
  onCampusAccessChange: (val: string) => void;
  address: string;
  onAddressChange: (val: string) => void;
}

const CATEGORIES = [
  {
    id: 'coffee_shop' as const,
    label: 'Coffee Shop',
    desc: 'Kopi santai, musik ramah nugas & meja luas',
    icon: Coffee,
  },
  {
    id: 'coworking' as const,
    label: 'Coworking Space',
    desc: 'Hening, colokan melimpah di setiap kursi',
    icon: Laptop,
  },
  {
    id: 'library' as const,
    label: 'Library Cafe',
    desc: 'Koleksi buku, pencahayaan terang & tenang',
    icon: BookOpen,
  },
  {
    id: 'creative_hub' as const,
    label: 'Creative Hub',
    desc: 'Outdoor terbuka, cocok diskusi kelompok besar',
    icon: Sparkles,
  },
];

const STUDY_VIBES_OPTIONS = [
  { id: 'work-friendly', label: 'Work-Friendly', desc: 'Laptopan & colokan banyak', icon: Laptop },
  { id: 'quiet-focus', label: 'Focus / Skripsi', desc: 'Hening bebas bising', icon: BookOpen },
  { id: 'group-discussion', label: 'Kerja Kelompok', desc: 'Meja komunal panjang', icon: Users },
  { id: 'night-owl', label: 'Night Owl', desc: 'Buka larut malam / 24 jam', icon: Moon },
];

export function BasicInfoSection({
  name,
  onNameChange,
  category,
  onCategoryChange,
  studyVibe = null,
  onStudyVibeChange,
  subdistrict,
  onSubdistrictChange,
  campusAccess,
  onCampusAccessChange,
  address,
  onAddressChange,
}: BasicInfoSectionProps) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 sm:p-8 space-y-6">
      {/* Header with Step 1 Circle */}
      <div className="flex items-start gap-3.5 pb-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          1
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Informasi Dasar &amp; Kategori Spot
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Identitas utama dan karakteristik ruang belajar di wilayah Kota Bogor
          </p>
        </div>
      </div>

      {/* Field: Nama Tempat */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-900 block">
          Nama Tempat / Kafe / Working Space <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Contoh: Kopi Ranin, Anthology Coffee, Maraca Books & Coffee"
          className="w-full h-12 px-4 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all"
        />
      </div>

      {/* Field: Kategori Tempat (4 Radio Cards) */}
      <div className="space-y-2.5">
        <label className="text-sm font-bold text-gray-900 block">
          Tipe Ruang Belajar <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {CATEGORIES.map((item) => {
            const isSelected = category === item.id;
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onCategoryChange(item.id)}
                className={cn(
                  'p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 select-none active:scale-[0.98]',
                  isSelected
                    ? 'bg-[#F0FAF7] border-[#005B54] ring-1 ring-[#005B54]/30 shadow-xs'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                )}
              >
                <div
                  className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                    isSelected ? 'bg-[#005B54] text-white shadow-2xs' : 'bg-gray-100 text-gray-600'
                  )}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500 leading-snug mt-1">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Field: Vibe Belajar Mahasiswa (Sinkron dengan Riset) */}
      <div className="space-y-2.5">
        <label className="text-sm font-bold text-gray-900 block">
          Vibe Belajar Dominan
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {STUDY_VIBES_OPTIONS.map((v) => {
            const isSelected = studyVibe === v.id;
            const Icon = v.icon;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onStudyVibeChange?.(v.id)}
                className={cn(
                  'p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 select-none',
                  isSelected
                    ? 'bg-teal-50 border-[#005B54] ring-1 ring-[#005B54]/30'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center',
                    isSelected ? 'bg-[#005B54] text-white' : 'bg-gray-100 text-gray-600'
                  )}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#005B54]" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 leading-tight">{v.label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{v.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2 Dropdowns: Wilayah Kecamatan & Akses Kampus */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-900 block">
            Wilayah Kecamatan Kota Bogor <span className="text-red-500">*</span>
          </label>
          <select
            value={subdistrict}
            onChange={(e) => onSubdistrictChange(e.target.value)}
            className="w-full h-12 px-3.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] cursor-pointer"
          >
            <option value="Bogor Tengah">Bogor Tengah (Pusat Kota / SSA)</option>
            <option value="Bogor Timur">Bogor Timur (Koridor Pajajaran)</option>
            <option value="Bogor Utara">Bogor Utara (Cilibende &amp; Bangbarung)</option>
            <option value="Bogor Barat">Bogor Barat (Yasmin, Cilendek &amp; Bubulak)</option>
            <option value="Bogor Selatan">Bogor Selatan (Batutulis &amp; Empang)</option>
            <option value="Tanah Sareal">Tanah Sareal (Sholeh Iskandar &amp; Cimanggu)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-900 block">
            Akses Kampus Terdekat
          </label>
          <select
            value={campusAccess}
            onChange={(e) => onCampusAccessChange(e.target.value)}
            className="w-full h-12 px-3.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] cursor-pointer"
          >
            <option value="Sekolah Vokasi IPB (Kampus Cilibende / Kumbang)">
              Sekolah Vokasi IPB (Kampus Cilibende / Kumbang)
            </option>
            <option value="Dekat Kampus IPB Baranangsiang (< 1.5 km)">
              Dekat Kampus IPB Baranangsiang (&lt; 1.5 km)
            </option>
            <option value="Dekat Kampus IPB Gunung Gede / Lodaya">
              Dekat Kampus IPB Gunung Gede / Lodaya
            </option>
            <option value="Dekat Kampus Universitas Pakuan (Pajajaran)">
              Dekat Kampus Universitas Pakuan (Pajajaran)
            </option>
            <option value="Dekat Kampus UIKA Bogor (Sholeh Iskandar)">
              Dekat Kampus UIKA Bogor (Sholeh Iskandar)
            </option>
            <option value="Akses Transit KRL Stasiun Bogor / Biskita">
              Akses Transit KRL Stasiun Bogor / Biskita
            </option>
          </select>
        </div>
      </div>

      {/* Field: Alamat Lengkap & Patokan */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-900 block">
          Alamat Lengkap &amp; Patokan di Bogor <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Contoh: Jl. Bangbarung Raya No. 12, Bantarjati (Sebelah Indomaret, 500m dari Kampus SV IPB)"
          className="w-full h-12 px-4 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all"
        />
        <p className="text-xs text-gray-400">
          Sebutkan patokan jalan atau gedung terdekat agar mudah diverifikasi.
        </p>
      </div>
    </section>
  );
}
