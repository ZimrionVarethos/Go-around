'use client';

import { usePlaceDetail } from '@/hooks/usePlacesQuery';
import {
  X,
  Check,
  Sparkles,
  MapPin,
  Navigation,
  Share2,
  AlertTriangle,
} from 'lucide-react';
import { formatNugasScore, formatRupiah } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';

export interface PlaceDetailDrawerProps {
  slug: string | null;
  onClose: () => void;
  /** When true, renders as a bottom sheet (full-width, rounded top) for mobile */
  isMobileSheet?: boolean;
}

export function PlaceDetailDrawer({ slug, onClose, isMobileSheet = false }: PlaceDetailDrawerProps) {
  const { data: response } = usePlaceDetail(slug);
  const [copied, setCopied] = useState(false);

  if (!slug) return null;

  const place = response?.data;

  // Fallback / standard values matching Figma Anthology design when loading or for selected item
  const name = place?.name ?? 'Anthology Coffee & Tea';
  const priceRange = place?.economics?.price_min_drink
    ? `${formatRupiah(place.economics.price_min_drink)} - 32k · Ramah Kantong`
    : 'Rp 18k - 32k · Ramah Kantong';
  const imageUrl =
    place?.media?.image_url ||
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80';
  const address =
    place?.location?.address ?? 'Jl. Danau Teratai, Kompleks Baranangsiang Indah';
  const distanceInfo =
    '4 menit (850 m) dari Kampus IPB Baranangsiang · Parkir Motor Rp2.000';
  const mapsUrl =
    place?.location?.google_maps_url || 'https://maps.google.com';

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <aside
      className={
        isMobileSheet
          ? 'w-full bg-white rounded-t-2xl shadow-2xl border-t border-gray-100/90 overflow-hidden flex flex-col z-[400] select-none max-h-[52vh] animate-in fade-in slide-in-from-bottom-4 duration-200'
          : 'w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-100/90 overflow-hidden flex flex-col z-[400] select-none max-h-[calc(100vh-140px)] animate-in fade-in slide-in-from-right-4 duration-200'
      }
    >
      {/* 1. Hero Image Header */}
      <div className={`relative w-full bg-gray-900 shrink-0 ${isMobileSheet ? 'h-28' : 'h-48'}`}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Dark gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40" />

        {/* Top-Left Price Badge */}
        <div className="absolute top-3 left-3 bg-[#005B54]/85 backdrop-blur-xs text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-xs">
          {priceRange}
        </div>

        {/* Top-Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs text-white hover:bg-black/60 flex items-center justify-center transition-all cursor-pointer"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Bottom Title & Verified Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1 text-white">
          <h2 className="text-xl font-extrabold tracking-tight leading-tight drop-shadow-xs">
            {name}
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 bg-[#005B54] text-white text-[10.5px] font-medium px-2 py-0.5 rounded-md shadow-xs">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Terverifikasi Tim QA SV IPB (Agustus 2026)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable Detail Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
        {/* 2. 4-Metric Grid Cards */}
        <div className="grid grid-cols-4 gap-2">
          {/* WiFi */}
          <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
            <span className="text-lg">📶</span>
            <span className="font-extrabold text-xs text-gray-900 mt-1">92 Mbps</span>
            <span className="text-[10px] text-gray-400 font-medium">Kencang Stabil</span>
          </div>

          {/* Colokan */}
          <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
            <span className="text-lg">⚡</span>
            <span className="font-extrabold text-xs text-gray-900 mt-1">95%</span>
            <span className="text-[10px] text-gray-400 font-medium">Tiap Meja Ada</span>
          </div>

          {/* Akustik */}
          <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
            <span className="text-lg">🎧</span>
            <span className="font-extrabold text-xs text-gray-900 mt-1">42 dB</span>
            <span className="text-[10px] text-gray-400 font-medium">Sangat Kondusif</span>
          </div>

          {/* Kursi */}
          <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
            <span className="text-lg">🪑</span>
            <span className="font-extrabold text-xs text-gray-900 mt-1">Ergonomis</span>
            <span className="text-[10px] text-gray-400 font-medium">Busa + Sandaran</span>
          </div>
        </div>

        {/* 3. AI Smart Recommendation Box - hidden on mobile sheet to save vertical space */}
        {!isMobileSheet && (
          <div className="bg-[#F0FAF7] border border-[#A7F3D0] rounded-xl p-3 flex items-start gap-2.5 text-xs text-gray-700">
            <div className="w-5 h-5 rounded-md bg-[#005B54] text-white flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">Rekomendasi Nugas Mahasiswa:</p>
              <p className="mt-0.5 text-gray-600 text-[11.5px] leading-relaxed">
                Area indoor lantai 2 sangat cocok untuk meeting zoom &amp; fokus skripsi. Disarankan datang sebelum pukul 13:00 untuk dapat meja sudut dekat jendela.
              </p>
            </div>
          </div>
        )}

        {/* 4. Score Summary Breakdown */}
        <div className="bg-[#F9FAFB] rounded-xl p-3 space-y-2 border border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 font-medium">Skor Nugas Total</span>
            <span className="font-extrabold text-[#005B54] text-sm">
              ★ {formatNugasScore(place?.nugas_metrics?.nugas_score ?? 9.7)} / 10
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {/* Fasilitas */}
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-500">Kelengkapan Fasilitas & Colokan</span>
              <span className="font-bold text-gray-800">9.8</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#005B54] h-full rounded-full w-[98%]" />
            </div>

            {/* Kenyamanan Akustik */}
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-500">Kenyamanan &amp; Akustik</span>
              <span className="font-bold text-gray-800">9.6</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#10B981] h-full rounded-full w-[96%]" />
            </div>

            {/* Ramah Budget */}
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-500">Kesesuaian Budget Mahasiswa</span>
              <span className="font-bold text-gray-800">9.5</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#F59E0B] h-full rounded-full w-[95%]" />
            </div>
          </div>
        </div>

        {/* 5. Address & Proximity */}
        <div className="text-xs space-y-1 text-gray-600">
          <p className="flex items-start gap-1.5">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <span className="font-medium text-gray-800 leading-relaxed">{address}</span>
          </p>
          <p className="pl-5.5 text-gray-500 text-[11px]">
            {distanceInfo}
          </p>
        </div>
      </div>

      {/* 6. Footer Action CTAs */}
      <div className="border-t border-gray-100 p-3.5 bg-white shrink-0 flex items-center gap-2">
        {/* Route CTA */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#005B54] hover:bg-[#004741] text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <Navigation className="w-3.5 h-3.5 fill-white" />
          <span>Petunjuk Arah (Maps)</span>
        </a>

        {/* Share CTA */}
        <button
          onClick={handleShare}
          className="w-10 h-10 border border-gray-200 hover:bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 transition-colors cursor-pointer relative"
          title="Bagikan Tautan"
        >
          <Share2 className="w-4 h-4" />
          {copied && (
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
              Disalin!
            </span>
          )}
        </button>

        {/* Report Link */}
        <Link
          href={`/lapor?place=${slug}`}
          className="w-10 h-10 border border-red-200 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center text-red-600 transition-colors cursor-pointer"
          title="Lapor Perubahan Fasilitas"
        >
          <AlertTriangle className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  );
}
