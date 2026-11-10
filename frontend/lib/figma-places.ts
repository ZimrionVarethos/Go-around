import type { PlaceListItem } from './types';
import { MOCK_RECOMMENDATION_PLACES } from './recommendations/mock-data';

/**
 * Single Source of Truth untuk seluruh titik tempat nugas Kota Bogor (13 lokasi).
 * Disinkronkan langsung dengan MOCK_RECOMMENDATION_PLACES agar tidak terjadi konflik data
 * antara Peta Publik, Form Laporan, dan Direktori Admin.
 */
export const FIGMA_PLACES: PlaceListItem[] = MOCK_RECOMMENDATION_PLACES.map((p) => {
  const minPrice = p.price_min_drink ?? 18000;
  const maxPrice = p.price_max_drink ?? 32000;
  return {
    id: p.id,
    category_id: 1,
    name: p.name,
    slug: p.slug,
    address: p.address,
    subdistrict: p.subdistrict,
    latitude: p.latitude,
    longitude: p.longitude,
    google_maps_url: p.google_maps_url ?? '',
    instagram_handle: `@${p.slug.replace(/-/g, '')}`,
    price_min_drink: minPrice,
    price_max_drink: maxPrice,
    price_avg_food: Math.round((minPrice + maxPrice) / 2),
    price_tier: (minPrice <= 20000 ? 1 : minPrice <= 30000 ? 2 : 3) as 1 | 2 | 3,
    parking_fee_motor: 2000,
    has_student_discount: p.amenities.includes('student_discount'),
    wifi_speed_mbps: p.wifi_speed_mbps ?? 45,
    wifi_quality: p.wifi_quality ?? 'fast',
    plug_availability: p.plug_availability ?? 'moderate',
    noise_level: p.noise_level ?? 'moderate',
    is_24_hours: Boolean(p.is_24_hours),
    open_time: p.open_time ?? '08:00:00',
    close_time: p.close_time ?? '22:00:00',
    google_rating: p.google_rating ?? 4.6,
    total_google_reviews: p.total_google_reviews ?? 250,
    nugas_score: p.score_breakdown.wifi ?? 90,
    budget_score: p.score_breakdown.price ?? 90,
    facility_score: p.score_breakdown.plug ?? 90,
    image_url: p.image_url ?? '',
    description: `Spot nugas terverifikasi di ${p.subdistrict}, Kota Bogor.`,
    vibe_tags: p.amenities.join(', '),
    status: 'active',
    created_at: p.last_verified_at || '2026-09-01T00:00:00Z',
    updated_at: p.last_verified_at || '2026-09-01T00:00:00Z',
    category: {
      id: 1,
      name: 'Cozy Coffee Shop',
      slug: 'cozy-coffee-shop',
      icon: 'coffee',
    },
    amenities: [],
  };
});

