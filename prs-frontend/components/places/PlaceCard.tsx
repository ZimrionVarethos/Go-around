'use client';

import {
  CircleHelp,
  Image as ImageIcon,
  MapPin,
  Navigation,
  Share2,
  Star,
  Volume2,
  Wifi,
  Zap,
} from 'lucide-react';
import type { PlaceListItem } from '@/lib/types';
import type { RecommendationPlace } from '@/lib/recommendations';
import {
  DataConfidenceBadge,
  RecommendationScoreBreakdown,
} from '@/components/recommendations';
import {
  formatNugasScore,
  formatRupiah,
  getScoreTier,
  noiseLevelLabel,
  plugAvailabilityLabel,
  wifiQualityLabel,
} from '@/lib/utils';
import { cn } from '@/lib/cn';

export type PlaceCardPlace = PlaceListItem | RecommendationPlace;

export interface PlaceCardProps {
  place: PlaceCardPlace;
  rank?: number;
  isSelected?: boolean;
  onSelect: (slug: string) => void;
  onRoute?: (place: PlaceCardPlace) => void;
  onToast?: (msg: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
}

function isRecommendationPlace(place: PlaceCardPlace): place is RecommendationPlace {
  return 'recommendation_score' in place;
}

function formatDistance(distance: number | null): string | null {
  if (distance === null) return null;
  if (distance < 1) return `${Math.round(distance * 1000)} m`;
  return `${distance.toLocaleString('id-ID', { maximumFractionDigits: 1 })} km`;
}

function formatPriceRange(minimum: number | null, maximum: number | null): string {
  if (minimum === null && maximum === null) return 'Harga belum tersedia';
  if (minimum !== null && maximum !== null) {
    return `${formatRupiah(minimum)}–${formatRupiah(maximum)}`;
  }
  return minimum !== null ? `Mulai ${formatRupiah(minimum)}` : `Hingga ${formatRupiah(maximum!)}`;
}

function getOperationalLabel(place: PlaceCardPlace): string | null {
  if (place.is_24_hours) return 'Buka 24 jam';

  if (place.open_time && place.close_time) {
    return `${place.open_time.slice(0, 5)} – ${place.close_time.slice(0, 5)} WIB`;
  }

  if (place.close_time) {
    return `Tutup ${place.close_time.slice(0, 5)} WIB`;
  }

  if (isRecommendationPlace(place)) {
    if (place.is_open_now === true) return 'Buka sekarang';
    if (place.is_open_now === false) return 'Sedang tutup';
  }

  return null;
}

function metricCopy(place: PlaceCardPlace) {
  return {
    wifi: place.wifi_speed_mbps !== null
      ? {
          value: `${place.wifi_speed_mbps} Mbps`,
          detail: place.wifi_quality ? wifiQualityLabel(place.wifi_quality) : 'Kecepatan terukur',
        }
      : {
          value: 'Belum diketahui',
          detail: 'Wi-Fi belum diverifikasi',
        },
    plug: place.plug_availability !== null
      ? {
          value: plugAvailabilityLabel(place.plug_availability),
          detail: 'Ketersediaan colokan',
        }
      : {
          value: 'Belum diketahui',
          detail: 'Colokan belum diverifikasi',
        },
    quiet: place.noise_level !== null
      ? {
          value: noiseLevelLabel(place.noise_level),
          detail: 'Tingkat keramaian',
        }
      : {
          value: 'Belum diketahui',
          detail: 'Suasana belum diverifikasi',
        },
  };
}

export function PlaceCard({
  place,
  rank = 1,
  isSelected = false,
  onSelect,
  onRoute,
  onToast,
}: PlaceCardProps) {
  const recommendation = isRecommendationPlace(place) ? place : null;
  const numericScore = recommendation
    ? recommendation.recommendation_score
    : (place as PlaceListItem).nugas_score;
  const score = recommendation
    ? `${Math.round(recommendation.recommendation_score)}%`
    : formatNugasScore((place as PlaceListItem).nugas_score);
  const scoreLabel = recommendation ? 'cocok' : 'skor';
  const tier = getScoreTier(numericScore);
  const distance = formatDistance(recommendation?.distance_km ?? null);
  const operationalLabel = getOperationalLabel(place);
  const metrics = metricCopy(place);
  const price = formatPriceRange(place.price_min_drink, place.price_max_drink);

  const selectPlace = () => onSelect(place.slug);

  const handleRoute = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onRoute) {
      onRoute(place);
    } else if (place.google_maps_url) {
      window.open(place.google_maps_url, '_blank', 'noopener,noreferrer');
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`,
        '_blank',
        'noopener,noreferrer',
      );
    }
    onToast?.(`Membuka navigasi ke ${place.name}…`, 'info');
  };

  const handleShare = (event: React.MouseEvent) => {
    event.stopPropagation();
    const shareUrl = `${window.location.origin}/?place=${place.slug}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      onToast?.('Tautan lokasi berhasil disalin.', 'success');
    }).catch(() => {
      onToast?.('Tautan belum bisa disalin.', 'error');
    });
  };

  return (
    <article
      className={isSelected
        ? 'flex select-none flex-col gap-3 rounded-2xl bg-white p-3.5 ring-2 ring-[#005B54] shadow-[0_12px_28px_-10px_rgba(0,91,84,0.45)] transition-shadow'
        : 'flex select-none flex-col gap-2.5 rounded-2xl bg-white p-3 ring-1 ring-slate-200 transition-shadow hover:shadow-[0_8px_20px_-14px_rgba(15,23,42,0.6)]'}
    >
      <button
        type="button"
        onClick={selectPlace}
        aria-pressed={isSelected}
        className="flex w-full items-start gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54] focus-visible:ring-offset-2"
      >
        <div className={`${isSelected ? 'h-16 w-16' : 'h-14 w-14'} relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-slate-400`}>
          {place.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={place.image_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-5 w-5" aria-hidden="true" />
          )}
          <span className="absolute bottom-1 left-1 rounded-md bg-slate-950/85 px-1.5 py-0.5 text-[9px] font-extrabold text-white">
            #{rank}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`${isSelected ? 'text-[15px]' : 'text-sm'} min-w-0 truncate font-extrabold leading-snug tracking-tight text-slate-900`}>
              {place.name}
            </h3>
            <span
              className={cn(
                'inline-flex shrink-0 items-baseline gap-1 rounded-lg px-2 py-1 text-xs font-extrabold tabular-nums transition-colors',
                isSelected
                  ? 'bg-[#005B54] text-white shadow-xs'
                  : `${tier.bgColor} ${tier.textColor} ring-1 ${tier.ringColor}`,
              )}
            >
              {score}
              <span className="text-[9px] font-semibold opacity-80">{scoreLabel}</span>
            </span>
          </div>

          <p className="mt-1 flex items-center gap-1 truncate text-xs font-medium text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#005B54]" aria-hidden="true" />
            <span className="truncate">{place.subdistrict}{distance ? ` · ${distance}` : ''}</span>
          </p>

          <div className="mt-1 flex items-center gap-1.5 truncate text-[11px]">
            <span className="font-semibold text-[#005B54]">{price}</span>
            {operationalLabel && (
              <>
                <span className="text-slate-300">·</span>
                <span className="font-medium text-slate-600 truncate">
                  {operationalLabel}
                </span>
              </>
            )}
          </div>

          {place.google_rating !== null && (
            <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600">
              <Star className="h-3 w-3 fill-amber-400 text-amber-500" aria-hidden="true" />
              {place.google_rating.toFixed(1)}
              {place.total_google_reviews !== null && (
                <span className="font-medium text-slate-400">({place.total_google_reviews.toLocaleString('id-ID')})</span>
              )}
            </p>
          )}
        </div>
      </button>

      <div className={isSelected
        ? 'grid grid-cols-3 divide-x divide-slate-200 rounded-xl bg-slate-50 px-1 py-2.5'
        : 'flex items-center gap-2 overflow-hidden border-t border-slate-100 pt-2 text-[11px]'}>
        {[
          { key: 'wifi', icon: Wifi, copy: metrics.wifi },
          { key: 'plug', icon: Zap, copy: metrics.plug },
          { key: 'quiet', icon: Volume2, copy: metrics.quiet },
        ].map((metric) => {
          const Icon = metric.icon;
          return isSelected ? (
            <div key={metric.key} className="min-w-0 px-1 text-center">
              <p className="flex items-center justify-center gap-1 text-[11px] font-extrabold text-slate-900">
                <Icon className="h-3.5 w-3.5 shrink-0 text-[#005B54]" aria-hidden="true" />
                <span className="truncate">{metric.copy.value}</span>
              </p>
              <p className="mt-0.5 truncate text-[9px] font-medium text-slate-500">{metric.copy.detail}</p>
            </div>
          ) : (
            <span key={metric.key} className="inline-flex shrink-0 items-center gap-1 font-medium text-slate-600">
              <Icon className="h-3 w-3 text-[#005B54]" aria-hidden="true" />
              {metric.copy.value}
            </span>
          );
        })}
      </div>

      {isSelected && recommendation && (
        <div className="space-y-3 border-t border-slate-100 pt-3">
          <DataConfidenceBadge value={recommendation.data_confidence} />

          {recommendation.reasons.length > 0 && (
            <ul className="space-y-1.5">
              {recommendation.reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-600">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#005B54]" aria-hidden="true" />
                  {reason}
                </li>
              ))}
            </ul>
          )}

          <details className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
            <summary className="cursor-pointer text-[11px] font-bold text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54]">
              Lihat rincian skor kecocokan (%)
            </summary>
            <div className="pt-3">
              <RecommendationScoreBreakdown value={recommendation.score_breakdown} />
            </div>
          </details>

          {recommendation.warnings.map((warning) => (
            <p key={warning} className="flex items-start gap-1.5 text-[10px] leading-relaxed text-amber-800">
              <CircleHelp className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
              {warning}
            </p>
          ))}
        </div>
      )}

      {isSelected && (
        <div className="flex items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={handleRoute}
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#005B54] px-3 text-xs font-bold text-white transition-colors hover:bg-[#004741] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54] focus-visible:ring-offset-2"
          >
            <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
            Buka rute
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label={`Bagikan ${place.name}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 ring-1 ring-slate-200 transition-colors hover:bg-slate-50 hover:text-[#005B54] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B54]"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </article>
  );
}
