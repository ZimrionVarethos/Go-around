import type {
  PlaceListItem,
  PlaceGeoJsonProperties,
  PlaceGeoJsonFeature,
  NoiseLevel,
  PlugAvailability,
  WifiQuality,
  PriceTier,
} from '@/lib/types';

// ─── Score display & Tier ─────────────────────────────────────────────────────

export interface ScoreTierInfo {
  tier: 'excellent' | 'good' | 'fair' | 'poor';
  label: string;
  color: string;       // Hex for Leaflet markers & SVG
  bgColor: string;     // Tailwind bg class
  textColor: string;   // Tailwind text class
  ringColor: string;   // Tailwind ring/border class
}

/** Convert 0–100 or 0–10 score to consistent percentage string, e.g. "97%" */
export function formatNugasScore(score: number): string {
  if (typeof score !== 'number' || isNaN(score)) return '0%';
  const val = score <= 10 ? score * 10 : score;
  return `${Math.round(val)}%`;
}

/**
 * Normalize a 0–10 or 0–5 rating score to the standard 5-star scale (1 decimal).
 * Examples: 9.7 -> "4.9", 9.4 -> "4.7", 9.1 -> "4.6", 4.7 -> "4.7".
 */
export function formatStarRating(score: number | null | undefined): string {
  if (typeof score !== 'number' || isNaN(score)) return '0.0';
  const normalized = score > 5 ? (score <= 10 ? score / 2 : score / 20) : score;
  return Math.min(5, Math.max(0, normalized)).toFixed(1);
}

/**
 * Format a 0–10 or 0–5 rating score with explicit "/ 5" scale, e.g. "4.9 / 5".
 */
export function formatStarRatingWithScale(score: number | null | undefined): string {
  return `${formatStarRating(score)} / 5`;
}

/** Get standard 4-tier color palette matching the Map Legend */
export function getScoreTier(score: number | null | undefined): ScoreTierInfo {
  if (score === null || score === undefined || isNaN(score)) {
    return {
      tier: 'poor',
      label: 'Belum Dinilai',
      color: '#94A3B8',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-600',
      ringColor: 'ring-slate-200',
    };
  }
  const val = score <= 10 ? score * 10 : score;
  if (val >= 85) {
    return {
      tier: 'excellent',
      label: 'Sangat Cocok',
      color: '#005B54',
      bgColor: 'bg-teal-50',
      textColor: 'text-[#005B54]',
      ringColor: 'ring-teal-200',
    };
  }
  if (val >= 70) {
    return {
      tier: 'good',
      label: 'Bagus / Cocok',
      color: '#10B981',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-800',
      ringColor: 'ring-emerald-200',
    };
  }
  if (val >= 50) {
    return {
      tier: 'fair',
      label: 'Cukup',
      color: '#F59E0B',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-800',
      ringColor: 'ring-amber-200',
    };
  }
  return {
    tier: 'poor',
    label: 'Kurang Sesuai',
    color: '#EF4444',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-800',
    ringColor: 'ring-rose-200',
  };
}

/** Format operational hours string into clean student-friendly format */
export function formatOperationalHours(
  openTime?: string | null,
  closeTime?: string | null,
  is24Hours?: boolean | null,
): { label: string; shortLabel: string; isOpen24h: boolean } {
  if (is24Hours) {
    return {
      label: 'Buka 24 Jam Nonstop',
      shortLabel: 'Buka 24 jam',
      isOpen24h: true,
    };
  }

  const open = openTime ? openTime.slice(0, 5) : null;
  const close = closeTime ? closeTime.slice(0, 5) : null;

  if (open && close) {
    return {
      label: `${open} – ${close} WIB`,
      shortLabel: `${open} – ${close} WIB`,
      isOpen24h: false,
    };
  }

  if (close) {
    return {
      label: `Tutup pukul ${close} WIB`,
      shortLabel: `Tutup ${close} WIB`,
      isOpen24h: false,
    };
  }

  return {
    label: 'Jam operasional belum tersedia',
    shortLabel: 'Jam buka belum ada',
    isOpen24h: false,
  };
}

// ─── GeoJSON coordinate extraction ────────────────────────────────────────────

/** GeoJSON stores [lng, lat] — extract as {lat, lng} */
export function latLngFromFeature(feature: PlaceGeoJsonFeature): { lat: number; lng: number } {
  return {
    lng: feature.geometry.coordinates[0],
    lat: feature.geometry.coordinates[1],
  };
}

// ─── vibe_tags normalization ───────────────────────────────────────────────────

/**
 * vibe_tags is a raw comma-string in PlaceListItem,
 * but a pre-parsed string[] in PlaceGeoJsonProperties.
 */
export function parseVibeTags(raw: string | string[] | null | undefined): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  return raw.split(',').map((t) => t.trim()).filter(Boolean);
}

// ─── Label translators ─────────────────────────────────────────────────────────

export function noiseLevelLabel(level: NoiseLevel): string {
  return { quiet: 'Tenang', moderate: 'Kondusif', lively: 'Ramai' }[level] ?? level;
}

export function plugAvailabilityLabel(plug: PlugAvailability): string {
  return {
    none: 'Tidak Ada',
    limited: 'Terbatas',
    moderate: 'Cukup',
    abundant: 'Banyak',
  }[plug] ?? plug;
}

export function plugAvailabilityPercent(plug: PlugAvailability): number {
  return { none: 0, limited: 30, moderate: 60, abundant: 92 }[plug] ?? 0;
}

export function wifiQualityLabel(quality: WifiQuality): string {
  return { low: 'Lambat', medium: 'Cukup', fast: 'Kencang', ultra: 'Ultra Cepat' }[quality] ?? quality;
}

export function priceTierLabel(tier: PriceTier): string {
  return {
    1: 'Budget (< Rp 15rb)',
    2: 'Standar (Rp 15–30rb)',
    3: 'Premium (> Rp 30rb)',
  }[tier] ?? `Tier ${tier}`;
}

// ─── Rupiah formatter ──────────────────────────────────────────────────────────

export function formatRupiah(amount: number): string {
  if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(0)}k`;
  }
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function formatRupiahFull(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

// ─── Score color ───────────────────────────────────────────────────────────────

export type ScoreColor = 'ideal' | 'good' | 'fair' | 'poor';

export function scoreColor(score: number): ScoreColor {
  const normalized = score > 10 ? score / 10 : score; // handle both 0-100 and 0-10
  if (normalized >= 9) return 'ideal';
  if (normalized >= 8) return 'good';
  if (normalized >= 6) return 'fair';
  return 'poor';
}

export const scoreColorMap: Record<ScoreColor, string> = {
  ideal: '#059669',
  good: '#10B981',
  fair: '#F59E0B',
  poor: '#EF4444',
};

// ─── Coordinate display ────────────────────────────────────────────────────────

export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

// ─── GeoJSON properties from PlaceListItem (for map markers) ──────────────────

export function listItemToGeoJsonProperties(item: PlaceListItem): PlaceGeoJsonProperties {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    category: item.category ?? undefined,
    subdistrict: item.subdistrict,
    address: item.address,
    price_min_drink: item.price_min_drink,
    price_max_drink: item.price_max_drink,
    price_avg_food: item.price_avg_food,
    price_tier: item.price_tier,
    wifi_speed_mbps: item.wifi_speed_mbps,
    wifi_quality: item.wifi_quality,
    plug_availability: item.plug_availability,
    noise_level: item.noise_level,
    is_24_hours: item.is_24_hours,
    open_time: item.open_time,
    close_time: item.close_time,
    google_rating: item.google_rating,
    nugas_score: item.nugas_score,
    budget_score: item.budget_score,
    facility_score: item.facility_score,
    image_url: item.image_url,
    vibe_tags: parseVibeTags(item.vibe_tags),
    google_maps_url: item.google_maps_url,
    instagram_handle: item.instagram_handle,
    distance_km: null,
    amenities: item.amenities,
  };
}
