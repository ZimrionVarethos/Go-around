// ─── Shared enums ─────────────────────────────────────────────────────────────

export type WifiQuality = 'low' | 'medium' | 'fast' | 'ultra';
export type PlugAvailability = 'none' | 'limited' | 'moderate' | 'abundant';
export type NoiseLevel = 'quiet' | 'moderate' | 'lively';
export type PriceTier = 1 | 2 | 3;
export type PlaceStatus = 'active' | 'pending' | 'inactive';

// ─── API wrappers ──────────────────────────────────────────────────────────────

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface ApiListResponse<T> {
  status: 'success';
  data: T[];
  pagination: Pagination;
}

export interface ApiSingleResponse<T> {
  status: 'success';
  data: T;
}

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly body: unknown,
    message?: string
  ) {
    super(message ?? `API Error ${statusCode}`);
    this.name = 'ApiError';
  }
}

// ─── Category & Amenity ───────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  places_count?: number;
}

export interface Amenity {
  id: number;
  name: string;
  slug: string;
  icon: string;
  group: string;
  places_count?: number;
}

// ─── Place — list response (GET /places) — flat Eloquent model ─────────────────

export interface PlaceAmenityPivot extends Amenity {
  pivot?: { detail: string | null };
}

export interface PlaceListItem {
  id: number;
  category_id: number | null;
  name: string;
  slug: string;
  address: string;
  subdistrict: string;
  latitude: number;
  longitude: number;
  google_maps_url: string | null;
  instagram_handle: string | null;
  price_min_drink: number;
  price_max_drink: number;
  price_avg_food: number;
  price_tier: PriceTier;
  parking_fee_motor: number;
  has_student_discount: boolean;
  wifi_speed_mbps: number | null;
  wifi_quality: WifiQuality;
  plug_availability: PlugAvailability;
  noise_level: NoiseLevel;
  is_24_hours: boolean;
  open_time: string | null;
  close_time: string | null;
  google_rating: number;
  total_google_reviews: number;
  nugas_score: number; // 0–100
  budget_score: number;
  facility_score: number;
  image_url: string | null;
  description: string | null;
  vibe_tags: string | null; // raw comma-separated string
  status: PlaceStatus;
  created_at: string;
  updated_at: string;
  category: Category | null;
  amenities: PlaceAmenityPivot[];
}

// ─── Place — GeoJSON shapes (GET /places/bbox, /nearby, /recommend) ────────────

export interface PlaceGeoJsonProperties {
  id: number;
  name: string;
  slug: string;
  category?: Category;
  subdistrict: string;
  address: string;
  price_min_drink: number;
  price_max_drink?: number;
  price_avg_food?: number;
  price_tier?: number;
  wifi_speed_mbps: number | null;
  wifi_quality: WifiQuality;
  plug_availability: PlugAvailability;
  noise_level: NoiseLevel;
  is_24_hours: boolean;
  open_time?: string | null;
  close_time?: string | null;
  google_rating: number;
  nugas_score: number; // 0–100
  budget_score: number;
  facility_score: number;
  image_url: string | null;
  vibe_tags: string[]; // already parsed array in GeoJSON resource
  google_maps_url: string | null;
  instagram_handle?: string | null;
  distance_km: number | null;
  amenities?: PlaceAmenityPivot[];
}

export interface PlaceGeoJsonFeature {
  type: 'Feature';
  id: number;
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: PlaceGeoJsonProperties;
}

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  metadata: {
    count: number;
    city: string;
    generated_at: string;
  };
  features: PlaceGeoJsonFeature[];
}

// ─── Place detail (GET /places/{idOrSlug}) ─────────────────────────────────────

export interface PlaceDetail {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category: Category | null;
  location: {
    address: string;
    subdistrict: string;
    latitude: number;
    longitude: number;
    google_maps_url: string;
    navigation_url: string;
  };
  socials: {
    instagram: string | null;
    instagram_handle: string | null;
  };
  economics: {
    price_min_drink: number;
    price_max_drink: number;
    price_avg_food: number;
    price_tier: PriceTier;
    price_tier_label: string;
    parking_fee_motor: number;
    has_student_discount: boolean;
  };
  nugas_metrics: {
    nugas_score: number;
    budget_score: number;
    facility_score: number;
    wifi_speed_mbps: number | null;
    wifi_quality: WifiQuality;
    plug_availability: PlugAvailability;
    noise_level: NoiseLevel;
    noise_label: string;
    plug_label: string;
  };
  operational: {
    is_24_hours: boolean;
    open_time: string | null;
    close_time: string | null;
    formatted_hours: string;
  };
  ratings: {
    google_rating: number;
    total_google_reviews: number;
  };
  media: {
    image_url: string | null;
    vibe_tags: string[];
  };
  amenities: PlaceAmenityPivot[];
  reviews_summary: PlaceReviewSummary[];
}

export interface PlaceReviewSummary {
  author_name: string;
  rating: number;
  text: string;
  time?: string;
}

// ─── Filter params ─────────────────────────────────────────────────────────────

export interface PlaceFilters {
  search?: string;
  subdistrict?: string;
  category?: string;
  price_tier?: string;
  max_price?: number;
  min_wifi?: number;
  plug_availability?: string;
  noise_level?: string;
  is_24_hours?: boolean;
  has_student_discount?: boolean;
  min_nugas_score?: number;
  amenities?: string;
  sort_by?: 'nugas_score' | 'budget_score' | 'facility_score' | 'price_min_drink' | 'wifi_speed_mbps' | 'google_rating' | 'name';
  order?: 'asc' | 'desc';
  per_page?: number;
}

export interface BboxParams extends PlaceFilters {
  north?: number;
  south?: number;
  east?: number;
  west?: number;
  limit?: number;
}

export interface NearbyParams extends PlaceFilters {
  lat: number;
  lng: number;
  radius_km?: number;
  limit?: number;
}

export interface RecommendParams extends PlaceFilters {
  w_budget?: number;
  w_wifi?: number;
  w_plug?: number;
  w_quiet?: number;
  lat?: number;
  lng?: number;
  limit?: number;
}

// ─── Contribution (POST /contributions) ───────────────────────────────────────

export interface ContributionPayload {
  name: string;
  address: string;
  subdistrict: string;
  latitude: number;
  longitude: number;
  price_min_drink?: number | null;
  wifi_speed_mbps?: number | null;
  plug_availability?: PlugAvailability;
  noise_level?: NoiseLevel;
  is_24_hours?: boolean;
  notes?: string | null;
  submitter_name?: string | null;
  submitter_email?: string | null;
}

export interface ContributionResponse {
  status: 'success';
  message: string;
  data: {
    id: number;
    name: string;
    status: string;
    created_at: string;
  };
}

// ─── Subdistrict ───────────────────────────────────────────────────────────────

export interface SubdistrictItem {
  subdistrict: string;
  count: number;
}
