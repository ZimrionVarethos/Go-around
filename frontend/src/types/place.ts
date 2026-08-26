export interface PlaceAmenity {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  group: 'workspace' | 'facility' | 'economy' | 'atmosphere';
  detail?: string;
}

export interface PlaceReview {
  id: number;
  source: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  keywords: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  date?: string;
}

export interface PlaceProperties {
  id: number;
  name: string;
  slug: string;
  subdistrict: string;
  address: string;
  category?: {
    id: number;
    name: string;
    slug: string;
    icon?: string;
  };
  price_min_drink: number;
  price_max_drink: number;
  price_avg_food: number;
  price_tier: number;
  wifi_speed_mbps: number;
  wifi_quality: 'low' | 'medium' | 'fast' | 'ultra';
  plug_availability: 'none' | 'limited' | 'moderate' | 'abundant';
  noise_level: 'quiet' | 'moderate' | 'lively';
  is_24_hours: boolean;
  open_time?: string;
  close_time?: string;
  google_rating: number;
  total_google_reviews?: number;
  nugas_score: number;
  budget_score: number;
  facility_score: number;
  image_url?: string;
  description?: string;
  vibe_tags: string[];
  google_maps_url?: string;
  instagram_handle?: string;
  distance_km?: number | null;
  custom_recommendation_score?: number;
  amenities?: PlaceAmenity[];
}

export interface GeoJsonFeature {
  type: 'Feature';
  id: number;
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: PlaceProperties;
}

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  metadata: {
    count: number;
    city: string;
    generated_at: string;
  };
  features: GeoJsonFeature[];
}

export interface PlaceDetailData {
  id: number;
  name: string;
  slug: string;
  description?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
    icon?: string;
  };
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
    price_tier: number;
    price_tier_label: string;
    parking_fee_motor: number;
    has_student_discount: boolean;
  };
  nugas_metrics: {
    nugas_score: number;
    budget_score: number;
    facility_score: number;
    wifi_speed_mbps: number;
    wifi_quality: string;
    plug_availability: string;
    plug_label: string;
    noise_level: string;
    noise_label: string;
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
  amenities: PlaceAmenity[];
  reviews_summary: PlaceReview[];
}

export interface FilterState {
  search: string;
  subdistrict: string;
  category: string;
  price_tier: string;
  max_price: number | '';
  min_wifi: number | '';
  plug_availability: string;
  noise_level: string;
  is_24_hours: boolean;
  has_student_discount: boolean;
  min_nugas_score: number | '';
  sort_by: string;
}

export interface RecommendationWeights {
  w_budget: number;
  w_wifi: number;
  w_plug: number;
  w_quiet: number;
}
