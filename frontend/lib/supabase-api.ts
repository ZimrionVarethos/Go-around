import { supabase } from './supabase';
import type {
  PlaceListItem,
  PlaceDetail,
  GeoJsonFeatureCollection,
  PlaceGeoJsonFeature,
  Category,
  PlaceFilters,
} from './types';

// Convert raw Place record to structured PlaceDetail
export function formatPlaceDetail(p: any): PlaceDetail {
  const priceMin = Number(p.price_min_drink || 0);
  const priceMax = Number(p.price_max_drink || (priceMin > 0 ? priceMin + 15000 : 35000));
  const priceAvgFood = Number(p.price_avg_food || 35000);
  const priceTier = Number(p.price_tier || (priceMin < 15000 ? 1 : priceMin <= 28000 ? 2 : 3)) as 1 | 2 | 3;
  const priceTierLabel =
    priceTier === 1
      ? 'Budget / Hemat (< 15rb)'
      : priceTier === 2
      ? 'Standar / Menengah (15rb - 28rb)'
      : 'Premium / Coworking (> 30rb)';

  const nugasScore = Number(p.nugas_score || 85);
  const budgetScore = Number(p.budget_score || 80);
  const facilityScore = Number(p.facility_score || 85);
  const wifiSpeed = p.wifi_speed_mbps !== null && p.wifi_speed_mbps !== undefined ? Number(p.wifi_speed_mbps) : 50;
  const wifiQuality = (p.wifi_quality || (wifiSpeed >= 70 ? 'ultra' : wifiSpeed >= 40 ? 'fast' : 'standard')) as any;
  const plugAvail = (p.plug_availability || 'moderate') as any;
  const noiseLevel = (p.noise_level || 'moderate') as any;

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
  const openTime = p.open_time || '08:00';
  const closeTime = p.close_time || '23:00';
  const formattedHours = is24h ? 'Buka 24 Jam' : `${openTime} - ${closeTime}`;

  const lat = parseFloat(p.latitude);
  const lng = parseFloat(p.longitude);
  const gMapsUrl = p.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.name + ', Kota Bogor')}`;

  const vibeTags = p.vibe_tags
    ? Array.isArray(p.vibe_tags)
      ? p.vibe_tags
      : String(p.vibe_tags).split(',').map((t: string) => t.trim())
    : [];

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description || 'Spot nugas favorit mahasiswa di Kota Bogor dengan fasilitas kondusif untuk belajar dan bekerja.',
    category: p.category
      ? {
          id: p.category.id,
          name: p.category.name,
          slug: p.category.slug,
          icon: p.category.icon,
        }
      : {
          id: 1,
          name: 'Coffee Shop',
          slug: 'coffee-shop',
          icon: 'coffee',
        },
    location: {
      address: p.address || `Kec. ${p.subdistrict || 'Kota Bogor'}, Kota Bogor`,
      subdistrict: p.subdistrict || 'Kota Bogor',
      latitude: lat,
      longitude: lng,
      google_maps_url: gMapsUrl,
      navigation_url: navUrl,
    },
    socials: {
      instagram: p.instagram_handle ? `https://instagram.com/${p.instagram_handle.replace('@', '')}` : null,
      instagram_handle: p.instagram_handle || null,
    },
    economics: {
      price_min_drink: priceMin,
      price_max_drink: priceMax,
      price_avg_food: priceAvgFood,
      price_tier: priceTier,
      price_tier_label: priceTierLabel,
      parking_fee_motor: Number(p.parking_fee_motor || 2000),
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
      google_rating: Number(p.google_rating || 4.5),
      total_google_reviews: Number(p.total_google_reviews || 200),
    },
    media: {
      image_url: p.image_url || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
      vibe_tags: vibeTags,
    },
    amenities: (p.amenities || []).map((a: any) => ({
      id: a.id || 1,
      name: a.name || String(a),
      slug: a.slug || 'fasilitas',
      icon: a.icon || 'check',
      group: a.group || 'general',
      detail: a.detail || null,
    })),
    reviews_summary: (p.reviews_summary || []).map((r: any) => ({
      author_name: r.author_name || 'Mahasiswa Bogor',
      rating: Number(r.rating || 5),
      text: r.text || 'Tempatnya nyaman buat nugas, wifi lancar dan banyak colokan.',
    })),
  };
}

// Convert Place record to GeoJSON feature
export function placeToGeoJsonFeature(p: any): PlaceGeoJsonFeature {
  return {
    type: 'Feature',
    id: p.id,
    geometry: {
      type: 'Point',
      coordinates: [parseFloat(p.longitude), parseFloat(p.latitude)],
    },
    properties: {
      id: p.id,
      name: p.name,
      slug: p.slug,
      subdistrict: p.subdistrict,
      address: p.address,
      price_min_drink: p.price_min_drink,
      price_max_drink: p.price_max_drink,
      price_avg_food: p.price_avg_food,
      wifi_speed_mbps: p.wifi_speed_mbps,
      wifi_quality: p.wifi_quality,
      plug_availability: p.plug_availability,
      noise_level: p.noise_level,
      is_24_hours: p.is_24_hours,
      open_time: p.open_time,
      close_time: p.close_time,
      google_rating: p.google_rating,
      nugas_score: p.nugas_score,
      budget_score: p.budget_score,
      facility_score: p.facility_score,
      image_url: p.image_url,
      vibe_tags: p.vibe_tags,
      google_maps_url: p.google_maps_url,
      distance_km: null,
      amenities: p.amenities || [],
    },
  };
}

export const supabaseApi = {
  // Get all active places with category
  getPlaces: async (filters: PlaceFilters = {}): Promise<PlaceListItem[]> => {
    let query = supabase
      .from('places')
      .select('*, category:categories(*)')
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
    return (data as unknown as PlaceListItem[]) || [];
  },

  // Get places formatted as GeoJSON
  getBboxPlaces: async (): Promise<GeoJsonFeatureCollection> => {
    const { data, error } = await supabase
      .from('places')
      .select('*, category:categories(*)')
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
      features: data.map(placeToGeoJsonFeature),
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
      let query = supabase.from('places').select('*, category:categories(*)');

      const num = Number(slugOrId);
      if (!isNaN(num) && num > 0) {
        query = query.or(`slug.eq.${slugOrId},id.eq.${num}`);
      } else {
        query = query.eq('slug', slugOrId);
      }

      const { data, error } = await query.maybeSingle();

      if (error || !data) {
        console.error('Supabase getPlaceDetail error:', error);
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

  // Get all unique subdistricts
  getSubdistricts: async (): Promise<string[]> => {
    const { data } = await supabase
      .from('places')
      .select('subdistrict')
      .not('subdistrict', 'is', null);

    if (!data) return [];
    const subs = Array.from(new Set(data.map((p: any) => p.subdistrict).filter(Boolean)));
    return (subs as string[]).sort();
  },

  // Get setting value from database (e.g. Mapbox token)
  getSetting: async (key: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .maybeSingle();

    if (error || !data) return null;
    return data.value;
  },

  // Insert user contribution
  createContribution: async (payload: any) => {
    const { data, error } = await supabase
      .from('contributions')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Insert facility report
  createReport: async (payload: any) => {
    const { data, error } = await supabase
      .from('reports')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
