'use client';

import { Coffee, Laptop, BookOpen, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface BasicInfoSectionProps {
  name: string;
  onNameChange: (val: string) => void;
  category: 'coffee_shop' | 'coworking' | 'library' | 'creative_hub';
  onCategoryChange: (val: 'coffee_shop' | 'coworking' | 'library' | 'creative_hub') => void;
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

export function BasicInfoSection({
  name,
  onNameChange,
  category,
  onCategoryChange,
  subdistrict,
  onSubdistrictChange,
  campusAccess,
  onCampusAccessChange,
  address,
  onAddressChange,
}: BasicInfoSectionProps) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 sm:p-7 space-y-5">
      {/* Header with Step 1 Circle */}
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#005B54] text-white font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5">
          1
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Informasi Dasar &amp; Kategori Spot
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Identitas utama tempat belajar/bekerja di wilayah Bogor
          </p>
        </div>
      </div>

      {/* Field: Nama Tempat */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-800">
          Nama Tempat / Kafe / Working Space <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Contoh: Anthology Coffee & Tea, Kopi Nako, Rumah Seduh"
          className="w-full h-11 px-3.5 text-xs bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54] transition-all"
        />
      </div>

      {/* Field: Kategori Tempat (4 Radio Cards) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-800">
          Kategori Tempat <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CATEGORIES.map((item) => {
            const isSelected = category === item.id;
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onCategoryChange(item.id)}
                className={cn(
                  'p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none',
                  isSelected
                    ? 'bg-[#F0FAF7] border-[#005B54] shadow-xs'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                    isSelected ? 'bg-[#005B54] text-white' : 'bg-gray-100 text-gray-600'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900">{item.label}</p>
                  <p className="text-[11px] text-gray-500 leading-snug mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2 Dropdowns: Wilayah Kecamatan & Akses Kampus */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800">
            Wilayah Kecamatan Kota Bogor <span className="text-red-500">*</span>
          </label>
          <select
            value={subdistrict}
            onChange={(e) => onSubdistrictChange(e.target.value)}
            className="w-full h-11 px-3 text-xs bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54] cursor-pointer"
          >
            <option value="Bogor Tengah">Bogor Tengah (Pusat Kota)</option>
            <option value="Bogor Timur">Bogor Timur</option>
            <option value="Bogor Utara">Bogor Utara</option>
            <option value="Bogor Barat">Bogor Barat</option>
            <option value="Bogor Selatan">Bogor Selatan</option>
            <option value="Tanah Sareal">Tanah Sareal</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800">
            Akses Kampus Terdekat
          </label>
          <select
            value={campusAccess}
            onChange={(e) => onCampusAccessChange(e.target.value)}
            className="w-full h-11 px-3 text-xs bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54] cursor-pointer"
          >
            <option value="Dekat Kampus IPB Baranangsiang (< 1.5 km)">
              Dekat Kampus IPB Baranangsiang (&lt; 1.5 km)
            </option>
            <option value="Dekat Kampus IPB Dramaga">Dekat Kampus IPB Dramaga</option>
            <option value="Dekat Kampus Universitas Pakuan">Dekat Kampus Universitas Pakuan</option>
            <option value="Dekat Kampus UIKA Bogor">Dekat Kampus UIKA Bogor</option>
            <option value="Akses Umum / Dekat Stasiun Bogor">Akses Umum / Dekat Stasiun Bogor</option>
          </select>
        </div>
      </div>

      {/* Field: Alamat Lengkap & Patokan */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-800">
          Alamat Lengkap &amp; Patokan di Bogor <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Contoh: Jl. Pajajaran No. 28, Baranangsiang (Sebelah Bank Mandiri, seberang Botani Square)"
          className="w-full h-11 px-3.5 text-xs bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54] transition-all"
        />
      </div>
    </section>
  );
}
