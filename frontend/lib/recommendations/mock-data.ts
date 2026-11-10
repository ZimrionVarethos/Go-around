import { ADMIN_STORAGE_KEY, MOCK_PLACES_TABLE } from '@/lib/admin-mock-data';
import type {
  NoiseLevel,
  PlaceDetail,
  PlaceGeoJsonFeature,
  PlugAvailability,
  PriceTier,
  WifiQuality,
} from '@/lib/types';
import type { RecommendationFacility, RecommendationPlace } from './types';

export interface AdminPlaceLike {
  id: number;
  code?: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  wifi: number;
  plug: number;
  price: string;
  score: number;
  status: 'verified' | 'review' | 'rejected';
  imageUrl?: string | null;
  plugLabel?: string;
  priceCategory?: string;
  acoustic?: string;
  district?: string;
  is24Hours?: boolean;
}

export function slugifyPlaceName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function parseMinPrice(priceStr: string): number {
  const digits = priceStr.replace(/[^\d]/g, '');
  const parsed = parseInt(digits, 10);
  return !isNaN(parsed) && parsed > 0 ? parsed : 18_000;
}

function inferWifiQuality(mbps: number): WifiQuality {
  if (mbps >= 45) return 'fast';
  if (mbps >= 25) return 'medium';
  return 'low';
}

function inferPlugAvailability(plugPct: number): PlugAvailability {
  if (plugPct >= 85) return 'abundant';
  if (plugPct >= 65) return 'moderate';
  return 'limited';
}

function inferNoiseLevel(acoustic?: string): NoiseLevel {
  const lower = (acoustic || '').toLowerCase();
  if (
    lower.includes('tenang') ||
    lower.includes('hening') ||
    lower.includes('silent') ||
    lower.includes('sejuk')
  ) {
    return 'quiet';
  }
  if (lower.includes('ramai')) {
    return 'lively';
  }
  return 'moderate';
}

function inferAmenities(place: AdminPlaceLike): RecommendationFacility[] {
  const list: RecommendationFacility[] = [];
  if (place.plug >= 60) list.push('plug');
  if (place.wifi >= 20) list.push('wifi');
  list.push('musholla', 'parking');
  if (
    place.priceCategory?.toLowerCase().includes('ktm') ||
    place.priceCategory?.toLowerCase().includes('mahasiswa') ||
    place.priceCategory?.toLowerCase().includes('hemat')
  ) {
    list.push('student_discount');
  }
  if (!place.name.toLowerCase().includes('warkop')) {
    list.push('air_conditioning');
  }
  return list;
}

export function placeItemToRecommendationPlace(place: AdminPlaceLike): RecommendationPlace {
  const minPrice = parseMinPrice(place.price);
  const maxPrice = minPrice + 14_000;
  const wifiQuality = inferWifiQuality(place.wifi);
  const plugAvailability = inferPlugAvailability(place.plug);
  const noiseLevel = inferNoiseLevel(place.acoustic);
  const googleRating = Number(Math.min(5, Math.max(3.8, place.score / 2)).toFixed(2));
  const priceScore = Math.max(50, Math.min(100, Math.round(115 - minPrice / 600)));
  const wifiScore = Math.max(50, Math.min(100, Math.round(45 + place.wifi * 0.6)));
  const quietScore = noiseLevel === 'quiet' ? 94 : noiseLevel === 'moderate' ? 78 : 55;

  return {
    id: place.id,
    slug: slugifyPlaceName(place.name),
    name: place.name,
    address: place.address,
    subdistrict: place.district || 'Bogor Tengah',
    latitude: place.lat,
    longitude: place.lng,
    google_maps_url: `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`,
    recommendation_score: Math.round(place.score * 10),
    data_confidence: place.status === 'verified' ? 94 : 68,
    distance_km: null,
    google_rating: googleRating,
    total_google_reviews: 180 + (place.id % 100) * 65,
    price_min_drink: minPrice,
    price_max_drink: maxPrice,
    wifi_speed_mbps: place.wifi,
    wifi_quality: wifiQuality,
    plug_availability: plugAvailability,
    noise_level: noiseLevel,
    amenities: inferAmenities(place),
    image_url:
      place.imageUrl ||
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
    is_open_now: true,
    is_24_hours: Boolean(place.is24Hours),
    open_time: place.is24Hours ? '00:00:00' : '08:00:00',
    close_time: place.is24Hours ? '23:59:59' : '22:00:00',
    last_verified_at: '2026-09-12T09:00:00+07:00',
    score_breakdown: {
      distance: null,
      rating: Math.round(place.score * 10),
      price: priceScore,
      wifi: wifiScore,
      plug: place.plug,
      quiet: quietScore,
    },
    reasons: [],
    warnings:
      place.status === 'review'
        ? ['Titik kafe ini sedang dalam antrean audit verifikasi admin.']
        : [],
  };
}

export function recommendationToGeoJsonFeature(
  place: RecommendationPlace
): PlaceGeoJsonFeature {
  return {
    type: 'Feature',
    id: place.id,
    geometry: {
      type: 'Point',
      coordinates: [place.longitude, place.latitude],
    },
    properties: {
      id: place.id,
      name: place.name,
      slug: place.slug,
      subdistrict: place.subdistrict,
      address: place.address,
      price_min_drink: place.price_min_drink,
      price_max_drink: place.price_max_drink,
      price_avg_food: null,
      wifi_speed_mbps: place.wifi_speed_mbps,
      wifi_quality: place.wifi_quality,
      plug_availability: place.plug_availability,
      noise_level: place.noise_level,
      is_24_hours: Boolean(place.is_24_hours),
      open_time: place.open_time ?? '08:00:00',
      close_time: place.close_time ?? '22:00:00',
      google_rating: place.google_rating,
      nugas_score: place.recommendation_score,
      budget_score: place.score_breakdown.price,
      facility_score: place.score_breakdown.plug,
      recommendation_score: place.recommendation_score,
      data_confidence: place.data_confidence,
      image_url: place.image_url,
      vibe_tags: place.reasons,
      google_maps_url: place.google_maps_url,
      distance_km: place.distance_km,
      amenities: [],
    },
  };
}

export function buildMockPlaceDetail(p: RecommendationPlace): PlaceDetail {
  const minPrice = p.price_min_drink ?? 18_000;
  const maxPrice = p.price_max_drink ?? minPrice + 14_000;
  const priceTier: PriceTier = minPrice <= 18_000 ? 1 : minPrice <= 25_000 ? 2 : 3;
  const priceTierLabel =
    priceTier === 1
      ? 'Super Hemat Mahasiswa'
      : priceTier === 2
        ? 'Ramah Kantong Mahasiswa'
        : 'Standar Kafe';
  const plugLabel =
    p.plug_availability === 'abundant'
      ? 'Colokan hampir tiap meja (>85%)'
      : p.plug_availability === 'moderate'
        ? 'Colokan cukup memadai (65–84%)'
        : 'Colokan terbatas (<65%)';
  const noiseLabel =
    p.noise_level === 'quiet'
      ? 'Tenang & Kondusif Fokus'
      : p.noise_level === 'lively'
        ? 'Ramai & Hidup (Diskusi)'
        : 'Kondusif Standar';

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: `Titik tempat nugas & coworking terverifikasi di kawasan ${p.subdistrict}, Kota Bogor. Dilengkapi konektivitas Wi-Fi ${p.wifi_speed_mbps ?? 45} Mbps dan fasilitas penunjang akademik mahasiswa.`,
    category: {
      id: 1,
      name: 'Study-Friendly Cafe',
      slug: 'study-friendly-cafe',
      icon: 'coffee',
    },
    location: {
      address: p.address,
      subdistrict: p.subdistrict,
      latitude: p.latitude,
      longitude: p.longitude,
      google_maps_url:
        p.google_maps_url ||
        `https://www.google.com/maps/search/?api=1&query=${p.latitude},${p.longitude}`,
      navigation_url:
        p.google_maps_url ||
        `https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`,
    },
    socials: {
      instagram: `https://instagram.com/${p.slug.replace(/-/g, '')}`,
      instagram_handle: `@${p.slug.replace(/-/g, '')}`,
    },
    economics: {
      price_min_drink: minPrice,
      price_max_drink: maxPrice,
      price_avg_food: Math.round((minPrice + maxPrice) / 2),
      price_tier: priceTier,
      price_tier_label: priceTierLabel,
      parking_fee_motor: 2000,
      has_student_discount: p.amenities.includes('student_discount'),
    },
    nugas_metrics: {
      nugas_score: p.recommendation_score || 90,
      budget_score: p.score_breakdown.price ?? 85,
      facility_score: p.score_breakdown.plug ?? 88,
      wifi_speed_mbps: p.wifi_speed_mbps ?? 45,
      wifi_quality: p.wifi_quality ?? 'fast',
      plug_availability: p.plug_availability ?? 'abundant',
      noise_level: p.noise_level ?? 'moderate',
      noise_label: noiseLabel,
      plug_label: plugLabel,
    },
    operational: {
      is_24_hours: Boolean(p.is_24_hours),
      open_time: p.open_time ?? '08:00:00',
      close_time: p.close_time ?? '22:00:00',
      formatted_hours: p.is_24_hours ? 'Buka 24 Jam' : '08.00 – 22.00 WIB',
    },
    ratings: {
      google_rating: p.google_rating ?? 4.6,
      total_google_reviews: p.total_google_reviews ?? 240,
    },
    media: {
      image_url: p.image_url,
      vibe_tags: ['Wi-Fi Stabil', 'Ramah Laptop', p.subdistrict],
    },
    amenities: [
      { id: 1, name: 'Wi-Fi Cepat', slug: 'wifi', icon: 'wifi', group: 'connectivity' },
      { id: 2, name: 'Colokan Listrik', slug: 'plug', icon: 'zap', group: 'facility' },
      { id: 3, name: 'Musholla', slug: 'musholla', icon: 'compass', group: 'facility' },
      { id: 4, name: 'Area Parkir', slug: 'parking', icon: 'car', group: 'facility' },
    ],
    reviews_summary: [
      {
        author_name: 'Mahasiswa SV IPB',
        rating: 5,
        text: 'Koneksi Wi-Fi stabil buat zoom dan nugas kelompok, colokan juga aman di meja.',
        time: 'Minggu lalu',
      },
    ],
  };
}

/**
 * Single Source of Truth untuk titik tempat nugas Kota Bogor (13 lokasi),
 * diturunkan langsung dari MOCK_PLACES_TABLE agar Admin & Publik WebGIS 100% konsisten.
 */
export const MOCK_RECOMMENDATION_PLACES: RecommendationPlace[] =
  MOCK_PLACES_TABLE.map(placeItemToRecommendationPlace);

/**
 * Mengambil daftar tempat nugas aktif (status === 'verified') yang sinkron
 * secara real-time dengan perubahan di Panel Admin (localStorage) saat mode mock.
 */
export function getSyncedPublicPlaces(includeReview = false): RecommendationPlace[] {
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(ADMIN_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { places?: AdminPlaceLike[] };
        if (Array.isArray(parsed.places) && parsed.places.length > 0) {
          return parsed.places
            .filter((p) => (includeReview ? p.status !== 'rejected' : p.status === 'verified'))
            .map(placeItemToRecommendationPlace);
        }
      }
    } catch {
      // Fallback to static mock list below
    }
  }

  return MOCK_PLACES_TABLE.filter((p) =>
    includeReview ? true : p.status === 'verified'
  ).map(placeItemToRecommendationPlace);
}
