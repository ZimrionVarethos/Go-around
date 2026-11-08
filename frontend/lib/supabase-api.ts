import { supabase } from './supabase';
import type {
  PlaceListItem,
  PlaceDetail,
  GeoJsonFeatureCollection,
  PlaceGeoJsonFeature,
  Category,
  PlaceFilters,
} from './types';

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

  // Get single place detail by slug
  getPlaceDetail: async (slug: string): Promise<PlaceDetail | null> => {
    const { data, error } = await supabase
      .from('places')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      console.error('Supabase getPlaceDetail error:', error);
      return null;
    }
    return data as unknown as PlaceDetail;
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
