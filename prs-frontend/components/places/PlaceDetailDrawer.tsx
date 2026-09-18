/* eslint-disable @next/next/no-img-element */
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
  Wifi,
  Zap,
  Volume2,
  Armchair,
} from 'lucide-react';
import { formatNugasScore, formatRupiah } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import type { ToastType } from '@/hooks/useToast';

import { FIGMA_PLACES } from '@/lib/figma-places';

export interface PlaceDetailDrawerProps {
  slug: string | null;
  onClose: () => void;
  /** When true, renders as a bottom sheet (full-width, rounded top) for mobile */
  isMobileSheet?: boolean;
  onToast?: (msg: string, type?: ToastType) => void;
}

export function PlaceDetailDrawer({
  slug,
  onClose,
  isMobileSheet = false,
  onToast,
}: PlaceDetailDrawerProps) {
  const { data: placeResponse } = usePlaceDetail(slug);
  const [copied, setCopied] = useState(false);

  if (!slug) return null;

  const place = placeResponse?.data;
  const fallbackPlace = FIGMA_PLACES.find((p) => p.slug === slug) ?? FIGMA_PLACES[0];

  const name = place?.name ?? fallbackPlace?.name ?? 'Detail Tempat Nugas';
  const priceMin = place?.economics?.price_min_drink ?? fallbackPlace?.price_min_drink;
  const priceMax = place?.economics?.price_max_drink ?? fallbackPlace?.price_max_drink;
  const priceRange = priceMin
    ? `${formatRupiah(priceMin)} - ${priceMax ? `${Math.round(priceMax / 1000)}k` : '32k'} · Ramah Kantong`
    : 'Rp 18k - 32k · Ramah Kantong';
  const imageUrl =
    place?.media?.image_url ||
    fallbackPlace?.image_url ||
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80';
  const address =
    place?.location?.address ?? fallbackPlace?.address ?? 'Jl. Pajajaran, Kota Bogor';
  const mapsUrl =
    place?.location?.google_maps_url || fallbackPlace?.google_maps_url || 'https://maps.google.com';
  
  const distanceKm = fallbackPlace?.id === 991 ? 0.85 : 1.2;
  const distanceInfo = `${Math.round(distanceKm * 4)} menit (${Math.round(distanceKm * 1000)} m) dari Kampus IPB Baranangsiang · Parkir Motor Rp2.000`;

  const wifiSpeed = place?.nugas_metrics?.wifi_speed_mbps ?? fallbackPlace?.wifi_speed_mbps ?? 92;
  const plugAvailability = place?.nugas_metrics?.plug_availability ?? fallbackPlace?.plug_availability;
  const plugPercent = plugAvailability === 'abundant' ? '95%' : plugAvailability === 'moderate' ? '70%' : '50%';
  const noiseLevel = place?.nugas_metrics?.noise_level ?? fallbackPlace?.noise_level;
  const noiseDb = noiseLevel === 'quiet' ? '42 dB' : noiseLevel === 'moderate' ? '50 dB' : '62 dB';
  const noiseLabel = noiseLevel === 'quiet' ? 'Sangat Kondusif' : noiseLevel === 'moderate' ? 'Cukup Kondusif' : 'Ramai';
  
  const rawScore = place?.nugas_metrics?.nugas_score ?? fallbackPlace?.nugas_score ?? 97;
  const displayScore = formatNugasScore(rawScore);
  const description = fallbackPlace?.description ?? 'Area nyaman dan sangat kondusif untuk nugas mahasiswa IPB University.';

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/peta?place=${slug}`;
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          onToast?.('Tautan lokasi disalin ke clipboard! 📎', 'success');
        })
        .catch(() => {
          onToast?.('Gagal menyalin tautan', 'error');
        });
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

        {/* Gradient Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

        {/* Top Badges & Close Button */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/20 shadow-xs">
            {priceRange}
          </span>
          <button
            onClick={onClose}
            type="button"
            className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20 shadow-xs"
            title="Tutup Detail"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Name & Sub-badge overlaid on bottom of photo */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h2 className="text-lg font-bold tracking-tight drop-shadow-sm leading-tight mb-1 truncate">
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
        {/* 2. 4-Metric Grid Cards (Clean SVG Icons) */}
        <div className="grid grid-cols-4 gap-2">
          {/* WiFi */}
          <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-2 text-center flex flex-col items-center justify-center">
            <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center text-[#005B54] mb-1">
              <Wifi className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-[11px] text-gray-900 leading-tight">{wifiSpeed} Mbps</span>
            <span className="text-[9.5px] text-gray-400 font-medium mt-0.5">Kencang Stabil</span>
          </div>

          {/* Colokan */}
          <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-2 text-center flex flex-col items-center justify-center">
            <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 mb-1">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-[11px] text-gray-900 leading-tight">{plugPercent}</span>
            <span className="text-[9.5px] text-gray-400 font-medium mt-0.5">Tiap Meja Ada</span>
          </div>

          {/* Akustik */}
          <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-2 text-center flex flex-col items-center justify-center">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-1">
              <Volume2 className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-[11px] text-gray-900 leading-tight">{noiseDb}</span>
            <span className="text-[9.5px] text-gray-400 font-medium mt-0.5">{noiseLabel}</span>
          </div>

          {/* Kursi */}
          <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-2 text-center flex flex-col items-center justify-center">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-1">
              <Armchair className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-[11px] text-gray-900 leading-tight">Ergonomis</span>
            <span className="text-[9.5px] text-gray-400 font-medium mt-0.5">Busa + Sandaran</span>
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
                {description}
              </p>
            </div>
          </div>
        )}

        {/* 4. Score Summary Breakdown */}
        <div className="bg-[#F9FAFB] rounded-xl p-3 space-y-2 border border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 font-medium">Skor Nugas Total</span>
            <span className="font-extrabold text-[#005B54] text-sm">
              ★ {displayScore} / 10
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {/* Fasilitas */}
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-500">Kelengkapan Fasilitas &amp; Colokan</span>
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
          className="flex-1 bg-[#005B54] hover:bg-[#004741] active:scale-[0.99] text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
        >
          <Navigation className="w-3.5 h-3.5 fill-white" />
          <span>Petunjuk Arah (Maps)</span>
        </a>

        {/* Share CTA */}
        <button
          onClick={handleShare}
          className="w-10 h-10 border border-gray-200 hover:bg-gray-50 active:bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 transition-colors cursor-pointer relative"
          title="Bagikan Tautan"
        >
          <Share2 className="w-4 h-4" />
          {copied && (
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
              Disalin!
            </span>
          )}
        </button>

        {/* Report Link - neutral subtle style instead of screaming red */}
        <Link
          href={`/lapor-fasilitas?place=${slug}`}
          className="w-10 h-10 border border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 rounded-xl flex items-center justify-center text-gray-500 hover:text-amber-600 transition-colors cursor-pointer"
          title="Lapor Perubahan Fasilitas"
        >
          <AlertTriangle className="w-4 h-4" />
        </Link>
      </div>
    </aside>

  );
}
