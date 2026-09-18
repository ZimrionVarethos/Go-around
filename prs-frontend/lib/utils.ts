import type {
  PlaceListItem,
  PlaceGeoJsonProperties,
  PlaceGeoJsonFeature,
  NoiseLevel,
  PlugAvailability,
  WifiQuality,
  PriceTier,
} from '@/lib/types';

// ─── Score display ─────────────────────────────────────────────────────────────

/** Convert 0–100 or 0–10 backend score to "9.7" display string */
export function formatNugasScore(score: number): string {
  if (typeof score !== 'number' || isNaN(score)) return '0.0';
  const normalized = score > 10 ? score / 10 : score;
  return normalized.toFixed(1);
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
