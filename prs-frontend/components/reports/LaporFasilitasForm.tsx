'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PaperPlaneRightIcon,
  CheckIcon,
  XIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react';
import { cn } from '@/lib/cn';
import { dispatchNewPublicTicket } from '@/lib/admin-store';
import { FIGMA_PLACES } from '@/lib/figma-places';
import { PlaceSearchSection } from './sections/PlaceSearchSection';
import {
  IssueSelectionSection,
  type IssueType,
  type TimeOption,
} from './sections/IssueSelectionSection';
import { EvidenceUploadSection } from './sections/EvidenceUploadSection';
import { ReportSuccessView } from './sections/ReportSuccessView';

export interface LaporFasilitasFormProps {
  onToast?: (msg: string, type?: 'success' | 'info' | 'error' | 'warning', durationMs?: number) => void;
}

export function LaporFasilitasForm({ onToast }: LaporFasilitasFormProps = {}) {
  const [selectedPlace, setSelectedPlace] = useState<(typeof FIGMA_PLACES)[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedIssues, setSelectedIssues] = useState<IssueType[]>([]);
  const [detail, setDetail] = useState('');
  const [time, setTime] = useState<TimeOption>('hari_ini');
  const [photoColokan, setPhotoColokan] = useState<string | null>(null);
  const [photoSpeedtest, setPhotoSpeedtest] = useState<string | null>(null);
  const [photoMenu, setPhotoMenu] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-select place if user navigated from WebGIS Drawer (?place=slug)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const placeParam = params.get('place');
    if (placeParam) {
      const matched = FIGMA_PLACES.find(
        (p) =>
          p.slug.toLowerCase() === placeParam.toLowerCase() ||
          p.name.toLowerCase() === placeParam.toLowerCase()
      );
      if (matched) {
        setSelectedPlace(matched);
        setSearchQuery(matched.name);
      }
    }
  }, []);

  const handleSelectPlace = (place: (typeof FIGMA_PLACES)[0]) => {
    setSelectedPlace(place);
    setSearchQuery(place.name);
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
      subdistrict: 'Bogor Tengah',
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
    setValidationError(null);
  };

  const toggleIssue = (id: IssueType) => {
    setSelectedIssues((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setValidationError(null);
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
      reportedBy: 'Mahasiswa (Anonim)',
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
      <ReportSuccessView
        placeName={selectedPlace?.name}
        onReset={() => {
          setIsSuccess(false);
          setSelectedPlace(null);
          setSearchQuery('');
          setSelectedIssues([]);
          setDetail('');
          setPhotoColokan(null);
          setPhotoSpeedtest(null);
          setPhotoMenu(null);
        }}
      />
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
          <WarningCircleIcon size={20} weight="fill" className="text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-red-900">Perhatian: Formulir Belum Lengkap</p>
            <p className="text-xs text-red-700 mt-0.5 leading-relaxed">{validationError}</p>
          </div>
        </div>
      )}

      {/* ── Step 1: Pilih Identitas Cafe & Preview Spasial ── */}
      <PlaceSearchSection
        places={FIGMA_PLACES}
        selectedPlace={selectedPlace}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSelectPlace={handleSelectPlace}
        onClearPlace={() => {
          setSearchQuery('');
          setSelectedPlace(null);
        }}
        onCustomPlace={handleCustomPlace}
      />

      {/* ── Step 2 & 3: Jenis Masalah, Detail & Estimasi Waktu ── */}
      <IssueSelectionSection
        selectedIssues={selectedIssues}
        onToggleIssue={toggleIssue}
        detail={detail}
        onDetailChange={(val) => {
          setDetail(val);
          setValidationError(null);
        }}
        time={time}
        onTimeChange={setTime}
      />

      {/* ── Step 4: Lampirkan Bukti Lapangan ── */}
      <EvidenceUploadSection
        photoColokan={photoColokan}
        photoSpeedtest={photoSpeedtest}
        photoMenu={photoMenu}
        onUploadColokan={(url) => {
          setPhotoColokan(url);
          setValidationError(null);
        }}
        onUploadSpeedtest={(url) => {
          setPhotoSpeedtest(url);
          setValidationError(null);
        }}
        onUploadMenu={(url) => {
          setPhotoMenu(url);
          setValidationError(null);
        }}
      />

      {/* ── Step 5: Kirim Laporan Anonim ── */}
      <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-7 space-y-5">
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

        <div className="bg-[#F0FAF7] border border-[#005B54] rounded-xl p-4 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-[#005B54] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            <CheckIcon size={12} weight="bold" />
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

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto h-12 px-8 bg-[#005B54] hover:bg-[#004741] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
          >
            <PaperPlaneRightIcon size={16} weight="fill" />
            <span>{isSubmitting ? 'Mengirim Data...' : 'Kirim Laporan Fasilitas'}</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto h-12 px-6 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
          >
            <XIcon size={16} weight="bold" className="text-gray-400" />
            <span>Batal &amp; Kembali ke Peta</span>
          </Link>
        </div>
      </section>
    </form>
  );
}
