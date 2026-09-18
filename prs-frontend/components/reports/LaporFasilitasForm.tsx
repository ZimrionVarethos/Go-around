/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Zap,
  Wifi,
  Volume2,
  TrendingUp,
  Clock,
  Sparkles,
  Upload,
  Send,
  CheckCircle2,
  MapPin,
  Check,
  X,
  ArrowLeft,
  Search,
  Compass,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { dispatchNewPublicTicket } from '@/lib/admin-store';
import { FIGMA_PLACES } from '@/lib/figma-places';

// Dynamic import Leaflet mini map (SSR false)
const ReportPlaceMiniMap = dynamic(() => import('./ReportPlaceMiniMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[180px] bg-[#F6F4ED] rounded-[12px] flex flex-col items-center justify-center gap-2 border border-gray-200">
      <div className="w-6 h-6 rounded-full border-2 border-[#005B54] border-t-transparent animate-spin" />
      <span className="text-[11px] font-medium text-gray-500">Memuat visual spasial peta...</span>
    </div>
  ),
});

// ─── Types ─────────────────────────────────────────────────────────────────
type IssueType =
  | 'colokan_rusak'
  | 'wifi_lambat'
  | 'kebisingan_tinggi'
  | 'harga_naik'
  | 'jam_operasional'
  | 'fasilitas_baru';

type TimeOption = 'hari_ini' | 'kemarin' | 'pekan_ini' | 'lebih_7_hari';

// ─── Issue Options ──────────────────────────────────────────────────────────
const ISSUE_OPTIONS = [
  {
    id: 'colokan_rusak' as const,
    title: 'Colokan Rusak / Mati',
    desc: 'Stopkontak mati di meja, tidak ada arus listrik, atau berkurang drastis.',
    icon: Zap,
  },
  {
    id: 'wifi_lambat' as const,
    title: 'WiFi Lambat / Putus',
    desc: 'Speedtest < 10 Mbps, portal login macet, atau sering terputus saat nugas.',
    icon: Wifi,
  },
  {
    id: 'kebisingan_tinggi' as const,
    title: 'Kebisingan Tinggi',
    desc: 'BGM terlalu kencang, bising renovasi/jalan, tidak kondusif untuk fokus.',
    icon: Volume2,
  },
  {
    id: 'harga_naik' as const,
    title: 'Harga Naik / Min. Order',
    desc: 'Menu melonjak drastis tidak ramah kantong, ada syarat minimal beli per jam.',
    icon: TrendingUp,
  },
  {
    id: 'jam_operasional' as const,
    title: 'Jam Operasional / Tutup',
    desc: 'Tidak lagi buka 24 jam, tutup lebih awal, atau sedang tutup renovasi total.',
    icon: Clock,
  },
  {
    id: 'fasilitas_baru' as const,
    title: 'Fasilitas Baru / Saran',
    desc: 'Spot meja kerja baru, musholla diperluas, AC baru dipasang, atau saran.',
    icon: Sparkles,
  },
];

const TIME_OPTIONS: { id: TimeOption; label: string }[] = [
  { id: 'hari_ini', label: 'Hari Ini' },
  { id: 'kemarin', label: 'Kemarin' },
  { id: 'pekan_ini', label: 'Pekan Ini' },
  { id: 'lebih_7_hari', label: 'Lebih 7 Hari Lalu' },
];

export interface LaporFasilitasFormProps {
  onToast?: (msg: string, type?: 'success' | 'info' | 'error' | 'warning', durationMs?: number) => void;
}

export function LaporFasilitasForm({ onToast }: LaporFasilitasFormProps = {}) {
  // Autocomplete & Place state
  const defaultPlace = FIGMA_PLACES[0] || {
    id: 991,
    name: 'Anthology Coffee & Tea',
    address: 'Jl. Danau Teratai, Kompleks Baranangsiang Indah, Kota Bogor',
    subdistrict: 'Baranangsiang',
    latitude: -6.6012,
    longitude: 106.8064,
  };

  const [selectedPlace, setSelectedPlace] = useState(defaultPlace);
  const [searchQuery, setSearchQuery] = useState(defaultPlace.name);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [selectedIssues, setSelectedIssues] = useState<IssueType[]>(['colokan_rusak']);
  const [detail, setDetail] = useState('');
  const [time, setTime] = useState<TimeOption>('hari_ini');
  const [photoColokan, setPhotoColokan] = useState<string | null>(null);
  const [photoSpeedtest, setPhotoSpeedtest] = useState<string | null>(null);
  const [photoMenu, setPhotoMenu] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter places based on search query
  const filteredPlaces = searchQuery.trim()
    ? FIGMA_PLACES.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.subdistrict.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : FIGMA_PLACES;

  const handleSelectPlace = (place: (typeof FIGMA_PLACES)[0]) => {
    setSelectedPlace(place);
    setSearchQuery(place.name);
    setIsSearchOpen(false);
  };

  const handleCustomPlace = (customName: string) => {
    const trimmed = customName.trim() || 'Tempat Nugas Lainnya';
    setSelectedPlace({
      ...defaultPlace,
      id: 9999,
      name: trimmed,
      address: 'Lokasi di Kota Bogor (Perlu verifikasi kurator)',
      subdistrict: 'Bogor',
      latitude: -6.598,
      longitude: 106.805,
    });
    setSearchQuery(trimmed);
    setIsSearchOpen(false);
  };

  const toggleIssue = (id: IssueType) => {
    setSelectedIssues((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIssues.length === 0) {
      onToast?.('Pilih minimal 1 jenis masalah terlebih dahulu', 'warning');
      return;
    }
    setIsSubmitting(true);

    dispatchNewPublicTicket({
      category: selectedIssues.join(', ') || 'Laporan Fasilitas',
      cafeName: selectedPlace.name || 'Kafe di Bogor',
      location: selectedPlace.address || 'Kota Bogor',
      reportedBy: contactInfo.trim() ? contactInfo.trim() : 'Mahasiswa (Anonim)',
      description: detail.trim() || 'Laporan kendala fasilitas kafe dari mahasiswa.',
      priority: selectedIssues.includes('colokan_rusak') ? 'high' : 'medium',
    });

    setIsSubmitting(false);
    setIsSuccess(true);
    onToast?.('Laporan berhasil dikirim! Tim kurator mahasiswa akan memvalidasi.', 'success', 4000);
  };

  if (isSuccess) {
    return (
      <div className="flex-1 w-full bg-white rounded-2xl border border-gray-200/90 shadow-xs p-8 sm:p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#E0F3EE] border border-teal-200/60 flex items-center justify-center mx-auto mb-5 shadow-xs">
          <CheckCircle2 className="w-9 h-9 text-[#005B54]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
          Laporan Berhasil Dikirim
        </h2>
        <p className="text-sm text-gray-500 max-w-md leading-relaxed mb-6">
          Tiket laporan kamu untuk <strong>{selectedPlace.name}</strong> telah masuk ke antrean verifikasi publik. Tim kurator mahasiswa SV IPB akan melakukan verifikasi on-site dalam kurun waktu 24 jam.
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#005B54] hover:bg-[#004741] text-white font-bold text-xs rounded-[10px] shadow-xs hover:shadow-sm transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Peta
          </Link>
          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              setSelectedIssues(['colokan_rusak']);
              setDetail('');
              setPhotoColokan(null);
              setPhotoSpeedtest(null);
              setPhotoMenu(null);
            }}
            className="px-5 py-2.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-[10px] shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
          >
            Lapor Masalah Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 w-full space-y-6">
      {/* ── Section 1: Identitas Cafe & Lokasi (Card 1) ── */}
      <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-7 space-y-5">
        {/* Header with Step 1 Badge */}
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
            1
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              Pilih Identitas Cafe / Spot Nugas
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Ketik nama kafe terdaftar atau cari lokasi yang fasilitasnya ingin dilaporkan
            </p>
          </div>
        </div>

        {/* Searchable Autocomplete Combobox */}
        <div className="space-y-1.5" ref={searchContainerRef}>
          <label className="text-xs font-bold text-gray-800">
            Nama Tempat / Kafe Terdaftar <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Cari kafe... (cth: Anthology, Popolo, Nako, Dua Tiga)"
              className="w-full h-11 pl-10 pr-10 text-xs bg-white border border-gray-200 rounded-[10px] text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all shadow-2xs placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(true);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Recommendations Dropdown Menu */}
            {isSearchOpen && (
              <div className="absolute top-full mt-1.5 left-0 right-0 z-40 bg-white border border-gray-200 rounded-[12px] shadow-lg max-h-64 overflow-y-auto p-1.5 space-y-0.5">
                <div className="px-2.5 py-1 text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider">
                  Rekomendasi Kafe Terdaftar ({filteredPlaces.length})
                </div>

                {filteredPlaces.length > 0 ? (
                  filteredPlaces.map((place) => {
                    const isCurrent = selectedPlace.id === place.id;
                    return (
                      <button
                        key={place.id}
                        type="button"
                        onClick={() => handleSelectPlace(place)}
                        className={cn(
                          'w-full text-left p-2.5 rounded-[8px] flex items-start justify-between gap-3 transition-colors cursor-pointer',
                          isCurrent
                            ? 'bg-[#F0FAF7] text-[#005B54]'
                            : 'hover:bg-gray-50 text-gray-800'
                        )}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <Building2 className={cn('w-4 h-4 shrink-0 mt-0.5', isCurrent ? 'text-[#005B54]' : 'text-gray-400')} />
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate">{place.name}</p>
                            <p className="text-[11px] text-gray-500 truncate">{place.address}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                            {place.wifi_speed_mbps ? `${place.wifi_speed_mbps} Mbps` : place.subdistrict}
                          </span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-3 text-center text-xs text-gray-500">
                    Tidak ada kafe yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
                  </div>
                )}

                {/* Custom place option */}
                <div className="border-t border-gray-100 pt-1 mt-1">
                  <button
                    type="button"
                    onClick={() => handleCustomPlace(searchQuery)}
                    className="w-full text-left p-2 rounded-[8px] text-xs text-[#005B54] hover:bg-[#F0FAF7] font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Gunakan &quot;{searchQuery || 'Nama Kafe Baru'}&quot; (Kafe belum terdaftar di WebGIS)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Real Leaflet Mini Map Preview */}
        <div className="space-y-2">
          <div className="h-[180px] sm:h-[200px] rounded-[12px] overflow-hidden border border-gray-200 shadow-2xs relative">
            <ReportPlaceMiniMap
              lat={selectedPlace.latitude}
              lng={selectedPlace.longitude}
              placeName={selectedPlace.name}
            />
          </div>

          {/* Genuine Spatial Coordinates & Location Bar */}
          <div className="p-3 bg-[#F8FAFC] border border-gray-200 rounded-[10px] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Compass className="w-4 h-4 text-[#005B54] shrink-0" />
              <div className="min-w-0">
                <span className="font-mono font-bold text-gray-800 text-[11.5px] block truncate">
                  {selectedPlace.latitude.toFixed(6)}° S, {selectedPlace.longitude.toFixed(6)}° E
                </span>
                <span className="text-[11px] text-gray-500 block truncate">
                  {selectedPlace.address}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 sm:self-center">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E0F3EE] text-[#005B54] text-[11px] font-bold border border-teal-200/60">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Terhubung ke Peta WebGIS</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Jenis Masalah (Card 2) ── */}
      <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-7 space-y-5">
        {/* Header with Step 2 Badge */}
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                Jenis Masalah / Ketidaksesuaian Fasilitas
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Pilih satu atau lebih kendala fasilitas yang dialami langsung saat nugas
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-500 font-normal">
            Dapat memilih lebih dari satu
          </span>
        </div>

        {/* 6 Radio/Checkbox Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ISSUE_OPTIONS.map((item) => {
            const isSelected = selectedIssues.includes(item.id);
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => toggleIssue(item.id)}
                className={cn(
                  'p-3.5 rounded-[12px] border cursor-pointer transition-all flex items-start gap-3 select-none active:scale-[0.98]',
                  isSelected
                    ? 'bg-[#F0FAF7] border-[#005B54] ring-1 ring-[#005B54]/30 shadow-xs'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                    isSelected ? 'bg-[#005B54] text-white shadow-2xs' : 'bg-gray-100 text-gray-600'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-gray-900">{item.title}</p>
                    <div
                      className={cn(
                        'w-4 h-4 rounded-[5px] flex items-center justify-center transition-colors shrink-0',
                        isSelected ? 'bg-[#005B54] text-white' : 'border border-gray-300 bg-white'
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 3: Detail & Waktu Kejadian (Card 3) ── */}
      <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-7 space-y-5">
        {/* Header with Step 3 Badge */}
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
            3
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              Detail Masalah &amp; Estimasi Waktu
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Deskripsikan area spesifik meja atau kronologi kendala yang ditemukan
            </p>
          </div>
        </div>

        {/* Textarea Detail */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800">
            Spesifikasi Meja / Catatan Tambahan
          </label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            rows={4}
            placeholder="Contoh: Stopkontak di 3 meja lantai 2 area semi-outdoor dekat jendela samping mati sejak kemarin siang. Meja tengah tidak ada aliran listrik."
            className="w-full p-3.5 text-xs bg-white border border-gray-200 rounded-[10px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all resize-none"
          />
        </div>

        {/* Time Chips */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800">
            Estimasi Waktu Kejadian / Terakhir Berkunjung
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {TIME_OPTIONS.map((opt) => {
              const isSelected = time === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTime(opt.id)}
                  className={cn(
                    'p-2.5 rounded-[12px] border text-xs font-medium cursor-pointer transition-all flex items-center justify-center gap-2 select-none active:scale-[0.98]',
                    isSelected
                      ? 'bg-[#F0FAF7] border-[#005B54] text-[#005B54] font-bold ring-1 ring-[#005B54]/20 shadow-2xs'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                  )}
                >
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 4: Bukti Foto Lapangan (Card 4) ── */}
      <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-7 space-y-5">
        {/* Header with Step 4 Badge */}
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
            4
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                Lampirkan Bukti Foto Lapangan
              </h2>
              <span className="text-xs text-gray-500 font-normal">
                (Opsional)
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Unggah foto fisik fasilitas atau screenshot speedtest untuk mempercepat verifikasi kurator mahasiswa
            </p>
          </div>
        </div>

        {/* 3 Upload Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: Foto Colokan / Meja */}
          <div className="border border-gray-200/90 rounded-[14px] p-3.5 flex flex-col justify-between space-y-3 bg-gray-50/50 hover:bg-white transition-colors">
            <div>
              <div className="flex items-center gap-1.5 text-[#005B54] font-bold text-xs mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Foto Fisik Kendala</span>
              </div>
              <p className="text-xs font-bold text-gray-900 leading-snug">
                Colokan / Meja Rusak
              </p>
              <p className="text-[10.5px] text-gray-400 mt-0.5 leading-tight">
                Foto stopkontak mati, meja goyang, atau fasilitas bermasalah.
              </p>
            </div>

            {photoColokan ? (
              <div className="relative w-full h-24 rounded-[10px] overflow-hidden border border-gray-200 group">
                <img src={photoColokan} alt="Preview Colokan" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoColokan(null)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="border border-dashed border-gray-300 rounded-[10px] p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#005B54] hover:bg-teal-50/20 transition-all">
                <Upload className="w-4 h-4 text-gray-400 mb-1" />
                <span className="text-[10.5px] font-bold text-[#005B54] bg-[#E0F3EE] px-2.5 py-0.5 rounded-full mb-0.5">
                  Pilih File
                </span>
                <span className="text-[9.5px] text-gray-400">JPG, PNG, WebP · Maks 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, setPhotoColokan)}
                />
              </label>
            )}
          </div>

          {/* Card 2: Screenshot Speedtest Wi-Fi */}
          <div className="border border-gray-200/90 rounded-[14px] p-3.5 flex flex-col justify-between space-y-3 bg-gray-50/50 hover:bg-white transition-colors">
            <div>
              <div className="flex items-center gap-1.5 text-[#005B54] font-bold text-xs mb-1">
                <Wifi className="w-3.5 h-3.5" />
                <span>Bukti Jaringan</span>
              </div>
              <p className="text-xs font-bold text-gray-900 leading-snug">
                Screenshot Speedtest Wi-Fi
              </p>
              <p className="text-[10.5px] text-gray-400 mt-0.5 leading-tight">
                Bukti hasil uji Ookla / Fast.com saat koneksi drop atau lambat.
              </p>
            </div>

            {photoSpeedtest ? (
              <div className="relative w-full h-24 rounded-[10px] overflow-hidden border border-gray-200 group">
                <img src={photoSpeedtest} alt="Preview Speedtest" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoSpeedtest(null)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="border border-dashed border-gray-300 rounded-[10px] p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#005B54] hover:bg-teal-50/20 transition-all">
                <Upload className="w-4 h-4 text-gray-400 mb-1" />
                <span className="text-[10.5px] font-bold text-[#005B54] bg-[#E0F3EE] px-2.5 py-0.5 rounded-full mb-0.5">
                  Pilih File
                </span>
                <span className="text-[9.5px] text-gray-400">JPG, PNG, WebP · Maks 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, setPhotoSpeedtest)}
                />
              </label>
            )}
          </div>

          {/* Card 3: Foto Menu Baru / Struk */}
          <div className="border border-gray-200/90 rounded-[14px] p-3.5 flex flex-col justify-between space-y-3 bg-gray-50/50 hover:bg-white transition-colors">
            <div>
              <div className="flex items-center gap-1.5 text-[#005B54] font-bold text-xs mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Koreksi Harga</span>
              </div>
              <p className="text-xs font-bold text-gray-900 leading-snug">
                Foto Menu Baru / Struk
              </p>
              <p className="text-[10.5px] text-gray-400 mt-0.5 leading-tight">
                Bukti pembaruan daftar harga kopi atau kebijakan pembelian.
              </p>
            </div>

            {photoMenu ? (
              <div className="relative w-full h-24 rounded-[10px] overflow-hidden border border-gray-200 group">
                <img src={photoMenu} alt="Preview Menu" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoMenu(null)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="border border-dashed border-gray-300 rounded-[10px] p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#005B54] hover:bg-teal-50/20 transition-all">
                <Upload className="w-4 h-4 text-gray-400 mb-1" />
                <span className="text-[10.5px] font-bold text-[#005B54] bg-[#E0F3EE] px-2.5 py-0.5 rounded-full mb-0.5">
                  Pilih File
                </span>
                <span className="text-[9.5px] text-gray-400">JPG, PNG, WebP · Maks 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, setPhotoMenu)}
                />
              </label>
            )}
          </div>
        </div>
      </section>

      {/* ── Section 5: Kirim Laporan (Card 5) ── */}
      <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-7 space-y-5">
        {/* Header with Step 5 Badge */}
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
            5
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              Kirim Laporan Fasilitas (Publik &amp; Anonim)
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Tidak perlu pendaftaran akun atau data identitas pribadi
            </p>
          </div>
        </div>

        {/* Green Anon Callout */}
        <div className="bg-[#F0FAF7] border border-[#A7F3D0] rounded-[14px] p-4 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-[#005B54] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">
              Terkirim sebagai Anonim Mahasiswa / Warga Bogor
            </p>
            <p className="text-[11.5px] text-gray-600 mt-0.5 leading-relaxed">
              Data laporan tidak dikaitkan dengan akun pribadi. Diteruskan langsung ke tim surveyor kurator mahasiswa SV IPB untuk pemeriksaan on-site.
            </p>
          </div>
        </div>

        {/* Email / Telegram Optional */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800">
            Email / Telegram Notifikasi <span className="text-gray-400 font-normal">(Sangat Opsional)</span>
          </label>
          <input
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder="Isi hanya jika ingin dikabari progres verifikasi tiket (cth: mhs.ipb@apps.ipb.ac.id / @username)"
            className="w-full h-11 px-3.5 text-xs bg-white border border-gray-200 rounded-[10px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all"
          />
        </div>

        {/* Submit & Cancel Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting || selectedIssues.length === 0}
            className="w-full sm:w-auto h-11 px-7 bg-[#005B54] hover:bg-[#004741] text-white font-bold text-xs rounded-[10px] shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Mengirim Data...' : 'Kirim Laporan Fasilitas'}</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto h-11 px-6 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-[10px] transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-gray-400" />
            <span>Batal &amp; Kembali ke Peta</span>
          </Link>
        </div>
      </section>
    </form>
  );
}
