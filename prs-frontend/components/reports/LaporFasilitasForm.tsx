/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Unplug,
  WifiOff,
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
  AlertCircle,
  FileImage,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { dispatchNewPublicTicket } from '@/lib/admin-store';
import { FIGMA_PLACES } from '@/lib/figma-places';

// Dynamic import Leaflet mini map (SSR false)
const ReportPlaceMiniMap = dynamic(() => import('./ReportPlaceMiniMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[200px] bg-[#F6F4ED] rounded-xl flex flex-col items-center justify-center gap-2 border border-gray-200">
      <div className="w-7 h-7 rounded-full border-2 border-[#005B54] border-t-transparent animate-spin" />
      <span className="text-xs font-semibold text-gray-500">Memuat visual spasial peta...</span>
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
    icon: Unplug,
  },
  {
    id: 'wifi_lambat' as const,
    title: 'WiFi Lambat / Putus',
    desc: 'Speedtest < 10 Mbps, portal login macet, atau sering terputus saat nugas.',
    icon: WifiOff,
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
  // Autocomplete & Place state (Starts clean/unselected)
  const [selectedPlace, setSelectedPlace] = useState<(typeof FIGMA_PLACES)[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [selectedIssues, setSelectedIssues] = useState<IssueType[]>([]);
  const [detail, setDetail] = useState('');
  const [time, setTime] = useState<TimeOption>('hari_ini');
  const [photoColokan, setPhotoColokan] = useState<string | null>(null);
  const [photoSpeedtest, setPhotoSpeedtest] = useState<string | null>(null);
  const [photoMenu, setPhotoMenu] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

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
    setValidationError(null);
  };

  const handleCustomPlace = (customName: string) => {
    const trimmed = customName.trim() || 'Tempat Nugas Lainnya';
    setSelectedPlace({
      id: 9999,
      category_id: 1,
      name: trimmed,
      slug: 'custom-cafe',
      address: 'Lokasi di Kota Bogor (Perlu verifikasi kurator)',
      subdistrict: 'Bogor',
      latitude: -6.598,
      longitude: 106.805,
      google_maps_url: '',
      instagram_handle: '',
      price_min_drink: 15000,
      price_max_drink: 35000,
      price_avg_food: 25000,
      price_tier: 1,
      parking_fee_motor: 2000,
      has_student_discount: false,
      wifi_speed_mbps: 30,
      wifi_quality: 'fast',
      plug_availability: 'moderate',
      noise_level: 'moderate',
      is_24_hours: false,
      open_time: '08:00:00',
      close_time: '22:00:00',
      google_rating: 4.5,
      total_google_reviews: 50,
      nugas_score: 85,
      budget_score: 85,
      facility_score: 85,
      image_url: '',
      description: 'Tempat usulan baru',
      vibe_tags: '',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: { id: 1, name: 'Coffee Shop', slug: 'coffee-shop', icon: 'coffee' },
      amenities: [],
    });
    setSearchQuery(trimmed);
    setIsSearchOpen(false);
    setValidationError(null);
  };

  const toggleIssue = (id: IssueType) => {
    setSelectedIssues((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setValidationError(null);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setter(reader.result as string);
        setValidationError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!selectedPlace) {
      const msg = 'Mohon pilih atau ketik nama kafe yang ingin dilaporkan.';
      setValidationError(msg);
      onToast?.(msg, 'warning');
      return;
    }

    if (selectedIssues.length === 0) {
      const msg = 'Mohon pilih minimal 1 jenis kendala fasilitas.';
      setValidationError(msg);
      onToast?.(msg, 'warning');
      return;
    }

    if (!detail.trim()) {
      const msg = 'Mohon isi spesifikasi meja atau catatan detail kendala.';
      setValidationError(msg);
      onToast?.(msg, 'warning');
      return;
    }

    const hasEvidence = Boolean(photoColokan || photoSpeedtest || photoMenu);
    if (!hasEvidence) {
      const msg = 'Wajib melampirkan minimal 1 bukti foto lapangan (foto fisik, screenshot speedtest, atau foto menu).';
      setValidationError(msg);
      onToast?.(msg, 'warning');
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

  // 4 Core Required Steps to reach 100%:
  const item1Place = selectedPlace !== null;
  const item2Issues = selectedIssues.length > 0;
  const item3Detail = detail.trim().length > 0;
  const item4Evidence = Boolean(photoColokan || photoSpeedtest || photoMenu);

  const requiredItems = [item1Place, item2Issues, item3Detail, item4Evidence];
  const completedCount = requiredItems.filter(Boolean).length;
  const progressPercent = Math.round((completedCount / requiredItems.length) * 100);

  let progressSummary = 'Formulir laporan masih kosong';
  if (progressPercent === 100) {
    progressSummary = 'Semua data & bukti wajib lengkap, siap dikirim!';
  } else if (completedCount > 0) {
    progressSummary = `${completedCount} dari ${requiredItems.length} bagian wajib terisi`;
  }

  if (isSuccess) {
    return (
      <div className="flex-1 w-full bg-white rounded-2xl border-2 border-[#005B54] shadow-lg p-8 sm:p-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 rounded-2xl bg-[#E0F3EE] border border-teal-200/60 flex items-center justify-center mx-auto mb-5 shadow-xs">
          <CheckCircle2 className="w-9 h-9 text-[#005B54]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
          Laporan Tiket Berhasil Dikirim!
        </h2>
        <p className="text-sm text-gray-600 max-w-md leading-relaxed mb-6">
          Tiket laporan untuk <strong>{selectedPlace?.name}</strong> telah masuk ke antrean kurasi. Tim kurator mahasiswa SV IPB akan melakukan verifikasi on-site dalam kurun waktu 24 jam.
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#005B54] hover:bg-[#004741] text-white font-bold text-sm rounded-xl shadow-xs transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Peta</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              setSelectedPlace(null);
              setSearchQuery('');
              setSelectedIssues([]);
              setDetail('');
              setPhotoColokan(null);
              setPhotoSpeedtest(null);
              setPhotoMenu(null);
              setContactInfo('');
            }}
            className="px-6 py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-xl transition-all active:scale-[0.98] cursor-pointer"
          >
            Lapor Masalah Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 w-full space-y-6">
      {/* ── Progress Tracker Bar (0% - 100%) ── */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Kelengkapan Laporan
            </span>
            <span
              className={cn(
                'text-xs font-extrabold px-2.5 py-0.5 rounded-full transition-colors',
                progressPercent === 100
                  ? 'text-[#005B54] bg-[#E0F3EE]'
                  : 'text-amber-800 bg-amber-50'
              )}
            >
              {progressPercent}% Siap
            </span>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {progressSummary}
          </span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#005B54] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ── Validation Error Banner ── */}
      {validationError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 shadow-xs animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-red-900">Perhatian: Formulir Belum Lengkap</p>
            <p className="text-xs text-red-700 mt-0.5 leading-relaxed">{validationError}</p>
          </div>
        </div>
      )}

      {/* ── Section 1: Identitas Cafe & Lokasi (Card 1) ── */}
      <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-7 space-y-5">
        {/* Header with Step 1 Badge */}
        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
            1
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              Pilih Identitas Cafe / Spot Nugas
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Ketik nama kafe terdaftar atau tentukan tempat yang fasilitasnya bermasalah
            </p>
          </div>
        </div>

        {/* Searchable Autocomplete Combobox */}
        <div className="space-y-2" ref={searchContainerRef}>
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
              className="w-full h-11 pl-10 pr-10 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all shadow-2xs placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedPlace(null);
                  setIsSearchOpen(true);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                title="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Recommendations Dropdown Menu */}
            {isSearchOpen && (
              <div className="absolute top-full mt-1.5 left-0 right-0 z-40 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto p-1.5 space-y-0.5">
                <div className="px-2.5 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Rekomendasi Kafe Terdaftar ({filteredPlaces.length})
                </div>

                {filteredPlaces.length > 0 ? (
                  filteredPlaces.map((place) => {
                    const isCurrent = selectedPlace?.id === place.id;
                    return (
                      <button
                        key={place.id}
                        type="button"
                        onClick={() => handleSelectPlace(place)}
                        className={cn(
                          'w-full text-left p-2.5 rounded-lg flex items-start justify-between gap-3 transition-colors cursor-pointer',
                          isCurrent
                            ? 'bg-[#F0FAF7] text-[#005B54]'
                            : 'hover:bg-gray-50 text-gray-800'
                        )}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <Building2 className={cn('w-4 h-4 shrink-0 mt-0.5', isCurrent ? 'text-[#005B54]' : 'text-gray-400')} />
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-bold truncate">{place.name}</p>
                            <p className="text-xs text-gray-500 truncate">{place.address}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
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
                    className="w-full text-left p-2 rounded-lg text-xs text-[#005B54] hover:bg-[#F0FAF7] font-semibold flex items-center gap-2 cursor-pointer"
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
        <div className="space-y-2.5">
          <div className="h-[180px] sm:h-[200px] rounded-xl overflow-hidden border border-gray-200 shadow-2xs relative">
            <ReportPlaceMiniMap
              lat={selectedPlace ? selectedPlace.latitude : -6.5971}
              lng={selectedPlace ? selectedPlace.longitude : 106.7996}
              placeName={selectedPlace ? selectedPlace.name : 'Kota Bogor (Belum dipilih)'}
            />
          </div>

          {/* Genuine Spatial Coordinates & Location Bar */}
          <div className="p-3.5 bg-[#F8FAFC] border border-gray-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <Compass className="w-4 h-4 text-[#005B54] shrink-0" />
              <div className="min-w-0">
                {selectedPlace ? (
                  <>
                    <span className="font-mono font-bold text-gray-800 text-xs block truncate">
                      {selectedPlace.latitude.toFixed(6)}° S, {selectedPlace.longitude.toFixed(6)}° E
                    </span>
                    <span className="text-xs text-gray-500 block truncate">
                      {selectedPlace.address}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-gray-700 text-xs block">
                      Titik Koordinat Spasial WebGIS
                    </span>
                    <span className="text-xs text-gray-500 block">
                      Pilih kafe pada kolom pencarian di atas untuk melihat titik lokasi pada peta
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 sm:self-center">
              {selectedPlace ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E0F3EE] text-[#005B54] text-xs font-bold border border-teal-200/60">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Terhubung ke Peta WebGIS</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200/60">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Menunggu Pilihan Kafe</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Jenis Masalah (Card 2) ── */}
      <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-7 space-y-5">
        {/* Header with Step 2 Badge */}
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
              2
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                Jenis Masalah / Ketidaksesuaian Fasilitas <span className="text-red-500">*</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Pilih satu atau lebih kendala fasilitas yang dialami langsung saat nugas
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-500 font-medium">
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
                  'p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none active:scale-[0.98]',
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
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs sm:text-sm font-bold text-gray-900">{item.title}</p>
                    <div
                      className={cn(
                        'w-4 h-4 rounded-md flex items-center justify-center transition-colors shrink-0',
                        isSelected ? 'bg-[#005B54] text-white' : 'border border-gray-300 bg-white'
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 3: Detail & Waktu Kejadian (Card 3) ── */}
      <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-7 space-y-5">
        {/* Header with Step 3 Badge */}
        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
            3
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              Detail Masalah &amp; Estimasi Waktu <span className="text-red-500">*</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Deskripsikan area spesifik meja atau kronologi kendala yang ditemukan
            </p>
          </div>
        </div>

        {/* Textarea Detail */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-800">
            Spesifikasi Meja / Catatan Tambahan <span className="text-red-500">*</span>
          </label>
          <textarea
            value={detail}
            onChange={(e) => {
              setDetail(e.target.value);
              setValidationError(null);
            }}
            rows={4}
            placeholder="Contoh: Stopkontak di 3 meja lantai 2 area semi-outdoor dekat jendela samping mati sejak kemarin siang. Meja tengah tidak ada aliran listrik."
            className="w-full p-3.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all resize-none shadow-2xs"
          />
        </div>

        {/* Time Chips */}
        <div className="space-y-2">
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
                    'p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 select-none active:scale-[0.98]',
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

      {/* ── Section 4: Bukti Lapangan Wajib (Card 4) ── */}
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
                {item4Evidence ? (
                  <span className="text-xs font-bold text-[#005B54] bg-[#E0F3EE] px-2.5 py-0.5 rounded-full border border-teal-200/60">
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
                <Unplug className="w-4 h-4" />
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
                  onClick={() => setPhotoColokan(null)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                  title="Hapus foto"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#005B54] hover:bg-teal-50/20 transition-all">
                <Upload className="w-5 h-5 text-gray-400 mb-1.5" />
                <span className="text-xs font-bold text-[#005B54] bg-[#E0F3EE] px-3 py-1 rounded-full mb-1">
                  Pilih File
                </span>
                <span className="text-xs text-gray-400">JPG, PNG, WebP · Maks 5MB</span>
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
          <div className="border border-gray-200/90 rounded-2xl p-4 flex flex-col justify-between space-y-3 bg-gray-50/50 hover:bg-white transition-colors">
            <div>
              <div className="flex items-center gap-1.5 text-[#005B54] font-bold text-xs mb-1">
                <Wifi className="w-4 h-4" />
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
                  onClick={() => setPhotoSpeedtest(null)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                  title="Hapus screenshot"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#005B54] hover:bg-teal-50/20 transition-all">
                <Upload className="w-5 h-5 text-gray-400 mb-1.5" />
                <span className="text-xs font-bold text-[#005B54] bg-[#E0F3EE] px-3 py-1 rounded-full mb-1">
                  Pilih File
                </span>
                <span className="text-xs text-gray-400">JPG, PNG, WebP · Maks 5MB</span>
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
          <div className="border border-gray-200/90 rounded-2xl p-4 flex flex-col justify-between space-y-3 bg-gray-50/50 hover:bg-white transition-colors">
            <div>
              <div className="flex items-center gap-1.5 text-[#005B54] font-bold text-xs mb-1">
                <TrendingUp className="w-4 h-4" />
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
                  onClick={() => setPhotoMenu(null)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                  title="Hapus foto"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#005B54] hover:bg-teal-50/20 transition-all">
                <Upload className="w-5 h-5 text-gray-400 mb-1.5" />
                <span className="text-xs font-bold text-[#005B54] bg-[#E0F3EE] px-3 py-1 rounded-full mb-1">
                  Pilih File
                </span>
                <span className="text-xs text-gray-400">JPG, PNG, WebP · Maks 5MB</span>
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
        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
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
        <div className="bg-[#F0FAF7] border border-[#A7F3D0] rounded-xl p-4 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-[#005B54] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-gray-900">
              Terkirim sebagai Anonim Mahasiswa / Warga Bogor
            </p>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
              Data laporan tidak dikaitkan dengan akun pribadi. Diteruskan langsung ke tim surveyor kurator mahasiswa SV IPB untuk pemeriksaan on-site.
            </p>
          </div>
        </div>

        {/* Email / Telegram Optional */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-800">
            Email / Telegram Notifikasi <span className="text-gray-400 font-normal">(Sangat Opsional)</span>
          </label>
          <input
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder="Isi hanya jika ingin dikabari progres verifikasi tiket (cth: mhs.ipb@apps.ipb.ac.id / @username)"
            className="w-full h-11 px-3.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all shadow-2xs"
          />
        </div>

        {/* Submit & Cancel Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto h-12 px-8 bg-[#005B54] hover:bg-[#004741] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Mengirim Data...' : 'Kirim Laporan Fasilitas'}</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto h-12 px-6 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
          >
            <X className="w-4 h-4 text-gray-400" />
            <span>Batal &amp; Kembali ke Peta</span>
          </Link>
        </div>
      </section>
    </form>
  );
}
