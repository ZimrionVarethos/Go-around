/* eslint-disable @next/next/no-img-element */
'use client';

import { usePlaceDetail } from '@/hooks/usePlacesQuery';
import {
  X,
  Sparkles,
  MapPin,
  Navigation,
  Share2,
  AlertTriangle,
  Wifi,
  Zap,
  Volume2,
  Star,
  LoaderCircle,
  RefreshCw,
  ImageOff,
} from 'lucide-react';
import { formatNugasScore, formatRupiah } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import type { ToastType } from '@/hooks/useToast';

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
  const {
    data: placeResponse,
    isLoading,
    isError,
    refetch,
  } = usePlaceDetail(slug);
  const [copied, setCopied] = useState(false);

  if (!slug) return null;

  const place = placeResponse?.data;

  if (isLoading) {
    return (
      <DrawerShell isMobileSheet={isMobileSheet}>
        <div className="flex min-h-64 flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <LoaderCircle className="h-6 w-6 animate-spin text-[#005B54]" />
          <p className="text-sm font-semibold text-gray-800">Memuat detail tempat…</p>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-gray-500 hover:text-gray-800"
          >
            Tutup
          </button>
        </div>
      </DrawerShell>
    );
  }

  if (isError || !place) {
    return (
      <DrawerShell isMobileSheet={isMobileSheet}>
        <div className="flex min-h-64 flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <AlertTriangle className="h-6 w-6 text-amber-500" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Detail belum dapat dimuat</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              Kami tidak mengganti data API yang gagal dengan data contoh.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#005B54] px-3 py-2 text-xs font-semibold text-white hover:bg-[#004741]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Coba lagi
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              Tutup
            </button>
          </div>
        </div>
      </DrawerShell>
    );
  }

  const priceParts = [
    place.economics.price_min_drink > 0
      ? formatRupiah(place.economics.price_min_drink)
      : null,
    place.economics.price_max_drink > 0
      ? formatRupiah(place.economics.price_max_drink)
      : null,
  ].filter(Boolean);
  const priceRange = priceParts.length > 0
    ? `${priceParts.join(' – ')} · ${place.economics.price_tier_label}`
    : 'Harga belum tersedia';
  const mapsUrl = place.location.navigation_url || place.location.google_maps_url;
  const wifiValue = place.nugas_metrics.wifi_speed_mbps === null
    ? 'Belum ada'
    : `${place.nugas_metrics.wifi_speed_mbps} Mbps`;
  const wifiLabel = place.nugas_metrics.wifi_speed_mbps === null
    ? 'Data belum tersedia'
    : `Kualitas ${place.nugas_metrics.wifi_quality}`;
  const description = place.description || 'Deskripsi tempat belum tersedia.';
  const displayScore = formatNugasScore(place.nugas_metrics.nugas_score);
  const scoreBreakdown = [
    {
      label: 'Kelengkapan fasilitas',
      value: place.nugas_metrics.facility_score,
      color: 'bg-[#005B54]',
    },
    {
      label: 'Kesesuaian budget',
      value: place.nugas_metrics.budget_score,
      color: 'bg-amber-500',
    },
  ];

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
    <DrawerShell isMobileSheet={isMobileSheet}>
      {/* 1. Hero Image Header */}
      <div className={`relative w-full bg-gray-900 shrink-0 ${isMobileSheet ? 'h-28' : 'h-48'}`}>
        {place.media.image_url ? (
          <img
            src={place.media.image_url}
            alt={place.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#005B54] to-[#0b766d] text-white/75">
            <ImageOff className="h-8 w-8" />
          </div>
        )}

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
            {place.name}
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#005B54] px-2 py-0.5 text-[10.5px] font-medium text-white shadow-xs">
              <span>{place.category?.name ?? 'Tempat nugas'}</span>
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
            <span className="font-extrabold text-[11px] text-gray-900 leading-tight">{wifiValue}</span>
            <span className="text-[9.5px] text-gray-400 font-medium mt-0.5">{wifiLabel}</span>
          </div>

          {/* Colokan */}
          <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-2 text-center flex flex-col items-center justify-center">
            <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 mb-1">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-[11px] text-gray-900 leading-tight">{place.nugas_metrics.plug_label}</span>
            <span className="text-[9.5px] text-gray-400 font-medium mt-0.5">Ketersediaan colokan</span>
          </div>

          {/* Akustik */}
          <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-2 text-center flex flex-col items-center justify-center">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-1">
              <Volume2 className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-[11px] text-gray-900 leading-tight">{place.nugas_metrics.noise_label}</span>
            <span className="text-[9.5px] text-gray-400 font-medium mt-0.5">Tingkat keramaian</span>
          </div>

          {/* Rating */}
          <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-2 text-center flex flex-col items-center justify-center">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-1">
              <Star className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-[11px] text-gray-900 leading-tight">{place.ratings.google_rating.toFixed(1)}</span>
            <span className="text-[9.5px] text-gray-400 font-medium mt-0.5">{place.ratings.total_google_reviews} ulasan</span>
          </div>
        </div>

        {/* 3. AI Smart Recommendation Box - hidden on mobile sheet to save vertical space */}
        {!isMobileSheet && (
          <div className="bg-[#F0FAF7] border border-[#A7F3D0] rounded-xl p-3 flex items-start gap-2.5 text-xs text-gray-700">
            <div className="w-5 h-5 rounded-md bg-[#005B54] text-white flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">Tentang tempat ini</p>
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
            {scoreBreakdown.map((score) => {
              const normalizedScore = Math.max(0, Math.min(100, score.value));

              return (
                <div key={score.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">{score.label}</span>
                    <span className="font-bold text-gray-800">{formatNugasScore(normalizedScore)}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full ${score.color}`}
                      style={{ width: `${normalizedScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Address & Proximity */}
        <div className="text-xs space-y-1 text-gray-600">
          <p className="flex items-start gap-1.5">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <span className="font-medium text-gray-800 leading-relaxed">{place.location.address}</span>
          </p>
          <p className="pl-5.5 text-gray-500 text-[11px]">
            {place.location.subdistrict}
            {place.economics.parking_fee_motor > 0
              ? ` · Parkir motor ${formatRupiah(place.economics.parking_fee_motor)}`
              : ''}
          </p>
        </div>
      </div>

      {/* 6. Footer Action CTAs */}
      <div className="border-t border-gray-100 p-3.5 bg-white shrink-0 flex items-center gap-2">
        {/* Route CTA */}
        {mapsUrl ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#005B54] hover:bg-[#004741] active:scale-[0.99] text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5 fill-white" />
            <span>Petunjuk Arah (Maps)</span>
          </a>
        ) : (
          <div className="flex-1 rounded-xl bg-gray-100 px-3 py-2.5 text-center text-xs font-semibold text-gray-400">
            Tautan arah belum tersedia
          </div>
        )}

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
    </DrawerShell>

  );
}

function DrawerShell({
  isMobileSheet,
  children,
}: {
  isMobileSheet: boolean;
  children: React.ReactNode;
}) {
  return (
    <aside
      className={
        isMobileSheet
          ? 'w-full bg-white rounded-t-2xl shadow-2xl border-t border-gray-100/90 overflow-hidden flex flex-col z-[400] select-none max-h-[52vh] animate-in fade-in slide-in-from-bottom-4 duration-200'
          : 'w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-100/90 overflow-hidden flex flex-col z-[400] select-none max-h-[calc(100vh-140px)] animate-in fade-in slide-in-from-right-4 duration-200'
      }
    >
      {children}
    </aside>
  );
}
