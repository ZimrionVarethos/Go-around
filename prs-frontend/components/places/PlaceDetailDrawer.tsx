/* eslint-disable @next/next/no-img-element */
'use client';

import { usePlaceDetail } from '@/hooks/usePlacesQuery';
import {
  ArrowsClockwiseIcon,
  CircleNotchIcon,
  ClockIcon,
  ImageBrokenIcon,
  MapPinIcon,
  NavigationArrowIcon,
  StarIcon,
  WarningIcon,
  XIcon,
} from '@phosphor-icons/react';
import {
  DynamicAcousticIcon,
  DynamicPlugIcon,
  DynamicWifiIcon,
} from '@/components/ui/FacilityIcons';
import {
  formatOperationalHours,
  formatRupiah,
  noiseLevelLabel,
  plugAvailabilityLabel,
} from '@/lib/utils';
import { cn } from '@/lib/cn';
import type { ToastType } from '@/hooks/useToast';
import { trackPublicRouteClick } from '@/lib/admin-store';

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
}: PlaceDetailDrawerProps) {
  const {
    data: placeResponse,
    isLoading,
    isError,
    refetch,
  } = usePlaceDetail(slug);

  if (!slug) return null;

  const place = placeResponse?.data;

  if (isLoading) {
    return (
      <DrawerShell isMobileSheet={isMobileSheet}>
        <div className="flex min-h-56 flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <CircleNotchIcon size={24} weight="bold" className="animate-spin text-[#005B54]" />
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
        <div className="flex min-h-56 flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <WarningIcon size={26} weight="duotone" className="text-amber-500" />
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
              <ArrowsClockwiseIcon size={14} weight="bold" />
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
    ? `${priceParts.join(' – ')}`
    : 'Harga belum tersedia';
  const mapsUrl = place.location.navigation_url || place.location.google_maps_url;
  const wifiValue = place.nugas_metrics.wifi_speed_mbps === null
    ? 'Belum ada'
    : `${place.nugas_metrics.wifi_speed_mbps} Mbps`;
  const plugShortLabel = place.nugas_metrics.plug_availability
    ? plugAvailabilityLabel(place.nugas_metrics.plug_availability)
    : place.nugas_metrics.plug_label;
  const noiseShortLabel = place.nugas_metrics.noise_level
    ? noiseLevelLabel(place.nugas_metrics.noise_level)
    : place.nugas_metrics.noise_label;
  const description = place.description || 'Deskripsi tempat belum tersedia.';
  const operationalInfo = formatOperationalHours(
    place.operational.open_time,
    place.operational.close_time,
    place.operational.is_24_hours,
  );

  const facilityIconSize = isMobileSheet ? 22 : 24;

  return (
    <DrawerShell isMobileSheet={isMobileSheet}>
      {/* 1. Compact Hero Image Header */}
      <div className={`relative w-full bg-gray-900 shrink-0 ${isMobileSheet ? 'h-28' : 'h-36'}`}>
        {place.media.image_url ? (
          <img
            src={place.media.image_url}
            alt={place.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#005B54] to-[#0b766d] text-white/75">
            <ImageBrokenIcon size={32} weight="duotone" />
          </div>
        )}

        {/* Gradient Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Top Badges & Close Button */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 gap-2">
          <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-white/20 shadow-xs truncate">
            {priceRange}
          </span>
          <button
            onClick={onClose}
            type="button"
            className="w-7 h-7 shrink-0 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20 shadow-xs"
            title="Tutup Detail"
          >
            <XIcon size={14} weight="bold" />
          </button>
        </div>

        {/* Name & Sub-badge overlaid on bottom of photo */}
        <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
          <h2 className="text-base font-bold tracking-tight drop-shadow-sm leading-tight truncate">
            {place.name}
          </h2>
          <p className="mt-0.5 text-[11px] font-medium text-white/85 truncate">
            {place.category?.name ?? 'Tempat Nugas'} · {place.location.subdistrict}
          </p>
        </div>
      </div>

      {/* Scrollable Detail Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 no-scrollbar">
        {/* 2. Clean 4-Metric Strip (Uniform Single-Line Height) */}
        <div className="grid grid-cols-4 gap-1.5">
          {/* WiFi */}
          <div className="bg-[#F8FAFC] border border-gray-200/70 rounded-xl py-2 px-1.5 text-center flex flex-col items-center justify-center">
            <DynamicWifiIcon
              speedMbps={place.nugas_metrics.wifi_speed_mbps}
              quality={place.nugas_metrics.wifi_quality}
              size={facilityIconSize}
            />
            <span className="mt-1 font-extrabold text-[11px] text-gray-900 leading-tight tabular-nums truncate max-w-full">
              {wifiValue}
            </span>
            <span className="text-[9.5px] text-gray-500 font-medium">Wi-Fi</span>
          </div>

          {/* Colokan */}
          <div className="bg-[#F8FAFC] border border-gray-200/70 rounded-xl py-2 px-1.5 text-center flex flex-col items-center justify-center">
            <DynamicPlugIcon
              availability={place.nugas_metrics.plug_availability}
              size={facilityIconSize}
            />
            <span className="mt-1 font-extrabold text-[11px] text-gray-900 leading-tight truncate max-w-full">
              {plugShortLabel}
            </span>
            <span className="text-[9.5px] text-gray-500 font-medium">Colokan</span>
          </div>

          {/* Akustik */}
          <div className="bg-[#F8FAFC] border border-gray-200/70 rounded-xl py-2 px-1.5 text-center flex flex-col items-center justify-center">
            <DynamicAcousticIcon
              noiseLevel={place.nugas_metrics.noise_level}
              size={facilityIconSize}
            />
            <span className="mt-1 font-extrabold text-[11px] text-gray-900 leading-tight truncate max-w-full">
              {noiseShortLabel}
            </span>
            <span className="text-[9.5px] text-gray-500 font-medium">Suasana</span>
          </div>

          {/* Rating */}
          <div className="bg-[#F8FAFC] border border-gray-200/70 rounded-xl py-2 px-1.5 text-center flex flex-col items-center justify-center">
            <StarIcon size={facilityIconSize} weight="fill" className="text-amber-500" />
            <span className="mt-1 font-extrabold text-[11px] text-gray-900 leading-tight tabular-nums">
              {place.ratings.google_rating.toFixed(1)} / 5
            </span>
            <span className="text-[9.5px] text-gray-500 font-medium truncate max-w-full">
              {place.ratings.total_google_reviews} ulasan
            </span>
          </div>
        </div>

        {/* 3. Unified Info Card: Description + Hours + Location */}
        <div className="rounded-xl border border-gray-200/70 bg-[#F8FAFC] p-3 space-y-2.5 text-xs text-gray-600">
          {!isMobileSheet && (
            <>
              <p className="text-[11.5px] leading-relaxed text-gray-600">
                {description}
              </p>
              <div className="h-px bg-gray-200/70" />
            </>
          )}

          {/* Operational Hours */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <ClockIcon size={15} weight="duotone" className="text-[#005B54] shrink-0" />
              <span className="font-semibold text-gray-900 truncate">{operationalInfo.label}</span>
            </div>
            <span
              className={cn(
                'shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-bold tracking-tight',
                operationalInfo.isOpen24h
                  ? 'bg-teal-100 text-[#005B54]'
                  : 'bg-emerald-100 text-emerald-800',
              )}
            >
              {operationalInfo.isOpen24h ? '24 Jam' : 'Buka'}
            </span>
          </div>

          <div className="h-px bg-gray-200/70" />

          {/* Address */}
          <div className="flex items-start gap-2">
            <MapPinIcon size={15} weight="duotone" className="text-[#005B54] shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed min-w-0">
              <p className="font-medium text-gray-800 break-words text-[11.5px]">
                {place.location.address}
              </p>
              {place.economics.parking_fee_motor > 0 && (
                <p className="text-gray-500 text-[10.5px] mt-0.5">
                  Parkir motor {formatRupiah(place.economics.parking_fee_motor)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Single Clean Footer Action CTA */}
      <div className="border-t border-gray-100 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-white shrink-0">
        {mapsUrl ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackPublicRouteClick(place.name, place.location.address)}
            className="w-full bg-[#005B54] hover:bg-[#004741] active:scale-[0.99] text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <NavigationArrowIcon size={15} weight="fill" />
            <span>Petunjuk Arah (Maps)</span>
          </a>
        ) : (
          <div className="w-full rounded-xl bg-gray-100 px-3 py-2.5 text-center text-xs font-semibold text-gray-400">
            Tautan arah belum tersedia
          </div>
        )}
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
          ? 'w-full bg-white rounded-t-2xl shadow-2xl border-t border-gray-100/90 overflow-hidden flex flex-col z-[400] select-none max-h-[55vh] animate-in fade-in slide-in-from-bottom-4 duration-200'
          : 'w-[340px] lg:w-[360px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl border border-gray-100/90 overflow-hidden flex flex-col z-[400] select-none max-h-[calc(100vh-140px)] animate-in fade-in slide-in-from-right-4 duration-200'
      }
    >
      {children}
    </aside>
  );
}
