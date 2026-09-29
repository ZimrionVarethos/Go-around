import type {
  RecommendationPreset,
  RecommendationRequest,
  RecommendationWeights,
} from './types';

export const RECOMMENDATION_PRESET_WEIGHTS: Record<RecommendationPreset, RecommendationWeights> = {
  balanced: {
    distance: 0.25,
    rating: 0.15,
    price: 0.15,
    wifi: 0.15,
    plug: 0.15,
    quiet: 0.15,
  },
  nearby: {
    distance: 0.5,
    rating: 0.1,
    price: 0.15,
    wifi: 0.05,
    plug: 0.1,
    quiet: 0.1,
  },
  budget: {
    distance: 0.15,
    rating: 0.1,
    price: 0.45,
    wifi: 0.1,
    plug: 0.1,
    quiet: 0.1,
  },
  study: {
    distance: 0.15,
    rating: 0.1,
    price: 0.15,
    wifi: 0.25,
    plug: 0.25,
    quiet: 0.1,
  },
  quiet: {
    distance: 0.15,
    rating: 0.1,
    price: 0.1,
    wifi: 0.1,
    plug: 0.15,
    quiet: 0.4,
  },
  custom: {
    distance: 0.25,
    rating: 0.15,
    price: 0.15,
    wifi: 0.15,
    plug: 0.15,
    quiet: 0.15,
  },
};

export const DEFAULT_RECOMMENDATION_REQUEST: RecommendationRequest = {
  location: {
    latitude: -6.595038,
    longitude: 106.790082,
  },
  radius_km: 5,
  max_price: 25_000,
  preset: 'balanced',
  must_have: [],
  weights: RECOMMENDATION_PRESET_WEIGHTS.balanced,
  open_now: false,
  sort_by: 'match',
  natural_language_query: null,
  limit: 20,
};

export function normalizeRecommendationWeights(
  weights: RecommendationWeights,
): RecommendationWeights {
  const sanitized = Object.fromEntries(
    Object.entries(weights).map(([key, value]) => [key, Math.max(0, Number(value) || 0)]),
  ) as unknown as RecommendationWeights;
  const total = Object.values(sanitized).reduce((sum, value) => sum + value, 0);

  if (total === 0) {
    return { ...RECOMMENDATION_PRESET_WEIGHTS.balanced };
  }

  return Object.fromEntries(
    Object.entries(sanitized).map(([key, value]) => [key, value / total]),
  ) as unknown as RecommendationWeights;
}

export function normalizeRecommendationRequest(
  request: RecommendationRequest,
): RecommendationRequest {
  const presetWeights = RECOMMENDATION_PRESET_WEIGHTS[request.preset];
  const weights = request.preset === 'custom' ? request.weights : presetWeights;

  return {
    ...request,
    radius_km: Math.max(0.5, Math.min(50, Number(request.radius_km) || 5)),
    max_price:
      request.max_price === null
        ? null
        : Math.max(0, Math.round(Number(request.max_price) || 0)),
    weights: normalizeRecommendationWeights(weights),
    must_have: [...new Set(request.must_have)],
    sort_by: request.sort_by ?? 'match',
    natural_language_query: request.natural_language_query?.trim() || null,
    limit: Math.max(1, Math.min(50, Math.round(Number(request.limit) || 20))),
  };
}
