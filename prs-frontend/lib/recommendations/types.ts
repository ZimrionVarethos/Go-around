import type { NoiseLevel, PlugAvailability, WifiQuality } from '@/lib/types';

export type RecommendationPreset =
  | 'balanced'
  | 'nearby'
  | 'budget'
  | 'study'
  | 'quiet'
  | 'custom';

export type RecommendationSort = 'match' | 'distance' | 'price';

export type RecommendationFacility =
  | 'plug'
  | 'wifi'
  | 'musholla'
  | 'student_discount'
  | 'parking'
  | 'air_conditioning';

export interface RecommendationWeights {
  distance: number;
  rating: number;
  price: number;
  wifi: number;
  plug: number;
  quiet: number;
}

export interface RecommendationRequest {
  location: {
    latitude: number;
    longitude: number;
  };
  radius_km: number;
  max_price: number | null;
  preset: RecommendationPreset;
  must_have: RecommendationFacility[];
  weights: RecommendationWeights;
  open_now: boolean;
  sort_by?: RecommendationSort;
  natural_language_query?: string | null;
  limit: number;
}

export interface RecommendationScoreBreakdown {
  distance: number | null;
  rating: number | null;
  price: number | null;
  wifi: number | null;
  plug: number | null;
  quiet: number | null;
}

export interface RecommendationPlace {
  id: number;
  slug: string;
  name: string;
  address: string;
  subdistrict: string;
  latitude: number;
  longitude: number;
  google_maps_url: string | null;

  recommendation_score: number;
  data_confidence: number | null;
  distance_km: number | null;

  google_rating: number | null;
  total_google_reviews: number | null;
  price_min_drink: number | null;
  price_max_drink: number | null;

  wifi_speed_mbps: number | null;
  wifi_quality: WifiQuality | null;
  plug_availability: PlugAvailability | null;
  noise_level: NoiseLevel | null;
  amenities: RecommendationFacility[];

  image_url: string | null;
  is_open_now: boolean | null;
  last_verified_at: string | null;

  score_breakdown: RecommendationScoreBreakdown;
  reasons: string[];
  warnings: string[];
}

export interface RecommendationResponse {
  status: 'success';
  data: RecommendationPlace[];
  meta: {
    total: number;
    generated_at: string;
    source: 'mock' | 'api';
    ai_used?: boolean;
    ai_provider?: string | null;
  };
}

export interface RecommendationGateway {
  getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse>;
}

export type RecommendationMockScenario = 'success' | 'partial' | 'empty' | 'error';
