import { supabase } from './supabase';
import { parseVibeTags } from './utils';
import type {
  Amenity,
  Category,
  GeoJsonFeatureCollection,
  NoiseLevel,
  PlaceAmenityPivot,
  PlaceDetail,
  PlaceFilters,
  PlaceGeoJsonFeature,
  PlaceListItem,
  PlugAvailability,
  PriceTier,
  WifiQuality,
} from './types';

export const DEFAULT_CAFE_IMAGE =
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80';

type RawRecord = Record<string, unknown>;

function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = toNumberOrNull(value);
  return parsed ?? fallback;
}

export function normalizeWifiQuality(
  rawQuality: unknown,
  speedMbps: number | null,
): WifiQuality {
  if (
    rawQuality === 'low' ||
    rawQuality === 'medium' ||
    rawQuality === 'fast' ||
    rawQuality === 'ultra'
  ) {
    return rawQuality;
  }
  if (rawQuality === 'standard') return 'medium';
  if (speedMbps === null || speedMbps <= 0) return 'low';
  if (speedMbps >= 70) return 'ultra';
  if (speedMbps >= 50) return 'fast';
  if (speedMbps >= 25) return 'medium';
  return 'low';
}

function normalizePlugAvailability(raw: unknown): PlugAvailability {
  if (raw === 'none' || raw === 'limited' || raw === 'moderate' || raw === 'abundant') {
    return raw;
  }
  return 'moderate';
}

function normalizeNoiseLevel(raw: unknown): NoiseLevel {
  if (raw === 'quiet' || raw === 'moderate' || raw === 'lively') {
    return raw;
  }
  return 'moderate';
}

function normalizeJoinedAmenities(raw: RawRecord): PlaceAmenityPivot[] {
  if (Array.isArray(raw.place_amenities)) {
    return (raw.place_amenities as RawRecord[])
      .map((item) => {
        const am = item.amenity as RawRecord | null | undefined;
        if (!am) return null;
        return {
          id: toNumber(am.id, 1),
          name: String(am.name ?? ''),
          slug: String(am.slug ?? ''),
          icon: String(am.icon ?? 'check'),
          group: String(am.group ?? 'facility'),
          pivot: { detail: item.detail ? String(item.detail) : null },
        } as PlaceAmenityPivot;
      })
      .filter((x): x is PlaceAmenityPivot => x !== null);
  }
  return Array.isArray(raw.amenities) ? (raw.amenities as PlaceAmenityPivot[]) : [];
}

export function normalizePlaceListItem(raw: RawRecord): PlaceListItem {
  const wifiSpeed = toNumberOrNull(raw.wifi_speed_mbps);
  const categoryRaw = raw.category as RawRecord | null | undefined;
  const priceMin = toNumber(raw.price_min_drink, 0);
  const priceTierRaw = toNumberOrNull(raw.price_tier);
  const priceTier: PriceTier =
    priceTierRaw === 1 || priceTierRaw === 2 || priceTierRaw === 3
      ? priceTierRaw
      : priceMin < 15000
      ? 1
      : priceMin <= 28000
      ? 2
      : 3;

  return {
    id: toNumber(raw.id, 0),
    category_id: toNumberOrNull(raw.category_id),
    name: String(raw.name ?? ''),
    slug: String(raw.slug ?? raw.id ?? ''),
    address: String(raw.address ?? ''),
    subdistrict: String(raw.subdistrict ?? 'Kota Bogor'),
    latitude: toNumber(raw.latitude, -6.598),
    longitude: toNumber(raw.longitude, 106.805),
    google_maps_url: raw.google_maps_url ? String(raw.google_maps_url) : null,
    instagram_handle: raw.instagram_handle ? String(raw.instagram_handle) : null,
    price_min_drink: priceMin,
    price_max_drink: toNumber(raw.price_max_drink, priceMin > 0 ? priceMin + 15000 : 35000),
    price_avg_food: toNumber(raw.price_avg_food, 35000),
    price_tier: priceTier,
    parking_fee_motor: toNumber(raw.parking_fee_motor, 2000),
    has_student_discount: Boolean(raw.has_student_discount),
    wifi_speed_mbps: wifiSpeed,
    wifi_quality: normalizeWifiQuality(raw.wifi_quality, wifiSpeed),
    plug_availability: normalizePlugAvailability(raw.plug_availability),
    noise_level: normalizeNoiseLevel(raw.noise_level),
    is_24_hours: Boolean(raw.is_24_hours),
    open_time: raw.open_time ? String(raw.open_time) : null,
    close_time: raw.close_time ? String(raw.close_time) : null,
    google_rating: toNumber(raw.google_rating, 4.5),
    total_google_reviews: toNumber(raw.total_google_reviews, 200),
    nugas_score: toNumber(raw.nugas_score, 85),
    budget_score: toNumber(raw.budget_score, 80),
    facility_score: toNumber(raw.facility_score, 85),
    image_url: raw.image_url ? String(raw.image_url) : null,
    description: raw.description ? String(raw.description) : null,
    vibe_tags: Array.isArray(raw.vibe_tags)
      ? raw.vibe_tags.join(', ')
      : raw.vibe_tags
      ? String(raw.vibe_tags)
      : null,
    status:
      raw.status === 'pending' || raw.status === 'inactive' ? raw.status : 'active',
    created_at: String(raw.created_at ?? new Date().toISOString()),
    updated_at: String(raw.updated_at ?? new Date().toISOString()),
    category: categoryRaw
      ? {
          id: toNumber(categoryRaw.id, 1),
          name: String(categoryRaw.name ?? 'Coffee Shop'),
          slug: String(categoryRaw.slug ?? 'coffee-shop'),
          icon: String(categoryRaw.icon ?? 'coffee'),
        }
      : null,
    amenities: normalizeJoinedAmenities(raw),
  };
}

// Convert raw Place or RecommendationPlace record to structured PlaceDetail
export function formatPlaceDetail(input: unknown): PlaceDetail {
  const p = (input ?? {}) as RawRecord;

  // Already a structured PlaceDetail
  if (p.nugas_metrics && p.economics && p.location) {
    return p as unknown as PlaceDetail;
  }

  const priceMin = toNumber(p.price_min_drink, 0);
  const priceMax = toNumber(
    p.price_max_drink,
    priceMin > 0 ? priceMin + 15000 : 35000,
  );
  const priceAvgFood = toNumber(p.price_avg_food, 35000);
  const rawTier = toNumberOrNull(p.price_tier);
  const priceTier: PriceTier =
    rawTier === 1 || rawTier === 2 || rawTier === 3
      ? rawTier
      : priceMin < 15000
      ? 1
      : priceMin <= 28000
      ? 2
      : 3;

  const priceTierLabel =
    priceTier === 1
      ? 'Budget / Hemat (< 15rb)'
      : priceTier === 2
      ? 'Standar / Menengah (15rb - 28rb)'
      : 'Premium / Coworking (> 30rb)';

  const breakdown = (p.score_breakdown ?? {}) as RawRecord;
  const nugasScore = toNumber(p.nugas_score ?? p.recommendation_score, 85);
  const budgetScore = toNumber(p.budget_score ?? breakdown.price, 80);
  const facilityScore = toNumber(p.facility_score ?? breakdown.plug, 85);

  const wifiSpeed = toNumberOrNull(p.wifi_speed_mbps);
  const wifiQuality = normalizeWifiQuality(p.wifi_quality, wifiSpeed);
  const plugAvail = normalizePlugAvailability(p.plug_availability);
  const noiseLevel = normalizeNoiseLevel(p.noise_level);

  const noiseLabel =
    noiseLevel === 'quiet'
      ? 'Tenang & Hening (Ideal Skripsi / Deep Work)'
      : noiseLevel === 'lively'
      ? 'Ramai / Hidup (Nongkrong & Diskusi)'
      : 'Sedang (Santai / Nugas Bareng)';

  const plugLabel =
    plugAvail === 'abundant'
      ? 'Banyak (Hampir di setiap meja)'
      : plugAvail === 'limited'
      ? 'Terbatas (Harus rebutan)'
      : plugAvail === 'none'
      ? 'Tidak Ada'
      : 'Cukup (Tersedia di beberapa titik)';

  const is24h = Boolean(p.is_24_hours);
  const openTime = p.open_time ? String(p.open_time) : '08:00';
  const closeTime = p.close_time ? String(p.close_time) : '23:00';
  const formattedHours = is24h ? 'Buka 24 Jam' : `${openTime} - ${closeTime}`;

  const lat = toNumber(p.latitude, -6.598);
  const lng = toNumber(p.longitude, 106.805);
  const placeName = String(p.name ?? 'Spot Nugas Bogor');
  const gMapsUrl =
    (p.google_maps_url ? String(p.google_maps_url) : null) ||
    `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const vibeTags = p.vibe_tags
    ? parseVibeTags(p.vibe_tags as string | string[])
    : Array.isArray(p.reasons)
    ? (p.reasons as unknown[]).map(String)
    : [];

  const categoryRaw = p.category as RawRecord | null | undefined;
  const igHandle = p.instagram_handle ? String(p.instagram_handle) : null;
  const subdistrict = String(p.subdistrict || 'Kota Bogor');

  const rawAmenities = Array.isArray(p.place_amenities)
    ? normalizeJoinedAmenities(p)
    : Array.isArray(p.amenities)
    ? p.amenities
    : [];
  const rawReviews = Array.isArray(p.reviews_summary)
    ? p.reviews_summary
    : Array.isArray(p.reviews)
    ? p.reviews
    : [];

  return {
    id: toNumber(p.id, 0),
    name: placeName,
    slug: String(p.slug ?? p.id ?? ''),
    description:
      (p.description ? String(p.description) : null) ||
      'Spot nugas favorit mahasiswa di Kota Bogor dengan fasilitas kondusif untuk belajar dan bekerja.',
    category: categoryRaw
      ? {
          id: toNumber(categoryRaw.id, 1),
          name: String(categoryRaw.name ?? 'Coffee Shop'),
          slug: String(categoryRaw.slug ?? 'coffee-shop'),
          icon: String(categoryRaw.icon ?? 'coffee'),
        }
      : {
          id: 1,
          name: 'Coffee Shop',
          slug: 'coffee-shop',
          icon: 'coffee',
        },
    location: {
      address: String(p.address || `Kec. ${subdistrict}, Kota Bogor`),
      subdistrict,
      latitude: lat,
      longitude: lng,
      google_maps_url: gMapsUrl,
      navigation_url: navUrl,
    },
    socials: {
      instagram: igHandle ? `https://instagram.com/${igHandle.replace('@', '')}` : null,
      instagram_handle: igHandle,
    },
    economics: {
      price_min_drink: priceMin,
      price_max_drink: priceMax,
      price_avg_food: priceAvgFood,
      price_tier: priceTier,
      price_tier_label: priceTierLabel,
      parking_fee_motor: toNumber(p.parking_fee_motor, 2000),
      has_student_discount: Boolean(p.has_student_discount),
    },
    nugas_metrics: {
      nugas_score: nugasScore,
      budget_score: budgetScore,
      facility_score: facilityScore,
      wifi_speed_mbps: wifiSpeed,
      wifi_quality: wifiQuality,
      plug_availability: plugAvail,
      noise_level: noiseLevel,
      noise_label: noiseLabel,
      plug_label: plugLabel,
    },
    operational: {
      is_24_hours: is24h,
      open_time: openTime,
      close_time: closeTime,
      formatted_hours: formattedHours,
    },
    ratings: {
      google_rating: toNumber(p.google_rating, 4.5),
      total_google_reviews: toNumber(p.total_google_reviews, 200),
    },
    media: {
      image_url:
        (p.image_url ? String(p.image_url) : null) ||
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
      vibe_tags: vibeTags,
    },
    amenities: rawAmenities.map((a, idx) => {
      if (typeof a === 'object' && a !== null) {
        const obj = a as RawRecord;
        return {
          id: toNumber(obj.id, idx + 1),
          name: String(obj.name ?? obj.slug ?? 'Fasilitas'),
          slug: String(obj.slug ?? 'fasilitas'),
          icon: String(obj.icon ?? 'check'),
          group: String(obj.group ?? 'facility'),
        };
      }
      const label = String(a);
      return {
        id: idx + 1,
        name: label,
        slug: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        icon: 'check',
        group: 'facility',
      };
    }),
    reviews_summary: rawReviews.map((r) => {
      const rev = (r ?? {}) as RawRecord;
      return {
        author_name: String(rev.author_name ?? rev.reviewer_name ?? 'Mahasiswa Bogor'),
        rating: toNumber(rev.rating, 5),
        text: String(
          rev.text ??
            rev.comment ??
            'Tempatnya nyaman buat nugas, wifi lancar dan banyak colokan.',
        ),
      };
    }),
  };
}

// Convert Place record to GeoJSON feature
export function placeToGeoJsonFeature(raw: RawRecord): PlaceGeoJsonFeature {
  const wifiSpeed = toNumberOrNull(raw.wifi_speed_mbps);
  const categoryRaw = raw.category as RawRecord | null | undefined;
  const lat = toNumber(raw.latitude, -6.598);
  const lng = toNumber(raw.longitude, 106.805);

  return {
    type: 'Feature',
    id: toNumber(raw.id, 0),
    geometry: {
      type: 'Point',
      coordinates: [lng, lat],
    },
    properties: {
      id: toNumber(raw.id, 0),
      name: String(raw.name ?? ''),
      slug: String(raw.slug ?? raw.id ?? ''),
      category: categoryRaw
        ? {
            id: toNumber(categoryRaw.id, 1),
            name: String(categoryRaw.name ?? 'Coffee Shop'),
            slug: String(categoryRaw.slug ?? 'coffee-shop'),
            icon: String(categoryRaw.icon ?? 'coffee'),
          }
        : undefined,
      subdistrict: String(raw.subdistrict ?? 'Kota Bogor'),
      address: String(raw.address ?? ''),
      price_min_drink: toNumberOrNull(raw.price_min_drink),
      price_max_drink: toNumberOrNull(raw.price_max_drink),
      price_avg_food: toNumberOrNull(raw.price_avg_food),
      price_tier: toNumberOrNull(raw.price_tier) ?? undefined,
      wifi_speed_mbps: wifiSpeed,
      wifi_quality: normalizeWifiQuality(raw.wifi_quality, wifiSpeed),
      plug_availability: normalizePlugAvailability(raw.plug_availability),
      noise_level: normalizeNoiseLevel(raw.noise_level),
      is_24_hours: Boolean(raw.is_24_hours),
      open_time: raw.open_time ? String(raw.open_time) : null,
      close_time: raw.close_time ? String(raw.close_time) : null,
      google_rating: toNumberOrNull(raw.google_rating),
      nugas_score: toNumberOrNull(raw.nugas_score),
      budget_score: toNumberOrNull(raw.budget_score),
      facility_score: toNumberOrNull(raw.facility_score),
      image_url: raw.image_url ? String(raw.image_url) : null,
      vibe_tags: parseVibeTags(raw.vibe_tags as string | string[] | null | undefined),
      google_maps_url: raw.google_maps_url ? String(raw.google_maps_url) : null,
      distance_km: null,
      amenities: normalizeJoinedAmenities(raw),
    },
  };
}

export const supabaseApi = {
  // Get all active places with category and joined amenities
  getPlaces: async (filters: PlaceFilters = {}): Promise<PlaceListItem[]> => {
    let query = supabase
      .from('places')
      .select('*, category:categories(*), place_amenities(detail, amenity:amenities(*))')
      .eq('status', 'active');

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }
    if (filters.subdistrict) {
      query = query.eq('subdistrict', filters.subdistrict);
    }
    if (filters.is_24_hours) {
      query = query.eq('is_24_hours', true);
    }
    if (filters.has_student_discount) {
      query = query.eq('has_student_discount', true);
    }
    if (filters.min_wifi) {
      query = query.gte('wifi_speed_mbps', filters.min_wifi);
    }
    if (filters.max_price) {
      query = query.lte('price_min_drink', filters.max_price);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Supabase getPlaces error:', error);
      return [];
    }
    return ((data as RawRecord[]) || []).map(normalizePlaceListItem);
  },

  // Get places formatted as GeoJSON
  getBboxPlaces: async (): Promise<GeoJsonFeatureCollection> => {
    const { data, error } = await supabase
      .from('places')
      .select('*, category:categories(*), place_amenities(detail, amenity:amenities(*))')
      .eq('status', 'active');

    if (error || !data) {
      console.error('Supabase getBboxPlaces error:', error);
      return {
        type: 'FeatureCollection',
        features: [],
        metadata: {
          generated_at: new Date().toISOString(),
          count: 0,
          city: 'Kota Bogor',
        },
      };
    }

    return {
      type: 'FeatureCollection',
      features: (data as RawRecord[]).map(placeToGeoJsonFeature),
      metadata: {
        generated_at: new Date().toISOString(),
        count: data.length,
        city: 'Kota Bogor',
      },
    };
  },

  // Get single place detail by slug or id
  getPlaceDetail: async (slugOrId: string): Promise<PlaceDetail | null> => {
    try {
      let query = supabase
        .from('places')
        .select('*, category:categories(*), place_amenities(detail, amenity:amenities(*)), reviews(reviewer_name, rating, comment)');

      const num = Number(slugOrId);
      if (!isNaN(num) && num > 0 && /^\d+$/.test(slugOrId)) {
        query = query.or(`slug.eq.${slugOrId},id.eq.${num}`);
      } else {
        query = query.eq('slug', slugOrId);
      }

      const { data, error } = await query.maybeSingle();

      if (error || !data) {
        if (error) console.error('Supabase getPlaceDetail error:', error);
        return null;
      }
      return formatPlaceDetail(data);
    } catch (err) {
      console.error('Failed to get place detail:', err);
      return null;
    }
  },

  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id');

    if (error || !data) {
      return [];
    }
    return data as Category[];
  },

  // Get all amenities
  getAmenities: async (): Promise<Amenity[]> => {
    const { data, error } = await supabase.from('amenities').select('*').order('id');
    if (error || !data) return [];
    return data as Amenity[];
  },

  // Get all unique subdistricts
  getSubdistricts: async (): Promise<string[]> => {
    const { data } = await supabase
      .from('places')
      .select('subdistrict')
      .not('subdistrict', 'is', null);

    if (!data) return [];
    const subs = Array.from(
      new Set(
        (data as Array<{ subdistrict?: string | null }>)
          .map((p) => p.subdistrict)
          .filter((v): v is string => Boolean(v)),
      ),
    );
    return subs.sort();
  },

  // Get setting value from database (e.g. Mapbox token)
  getSetting: async (key: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .maybeSingle();

    if (error || !data) return null;
    return (data as { value?: string | null }).value ?? null;
  },

  // Insert user contribution
  createContribution: async (payload: Record<string, unknown>) => {
    const { data, error } = await supabase
      .from('contributions')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Insert facility report into Supabase facility_reports table
  createReport: async (payload: Record<string, unknown>) => {
    const ticketCode =
      (payload.ticket_code ? String(payload.ticket_code) : null) ||
      `TK-${Date.now().toString().slice(-6)}`;
    const record = {
      ...payload,
      ticket_code: ticketCode,
      status: payload.status ?? 'open',
      is_unread: payload.is_unread ?? true,
    };
    const { data, error } = await supabase
      .from('facility_reports')
      .insert([record])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
