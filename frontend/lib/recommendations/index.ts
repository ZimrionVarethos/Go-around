import { httpRecommendationGateway } from './http-gateway';
import { mockRecommendationGateway } from './mock-gateway';
import { supabaseRecommendationGateway } from './supabase-gateway';
import { normalizeRecommendationRequest } from './presets';
import type {
  RecommendationGateway,
  RecommendationRequest,
  RecommendationResponse,
} from './types';

const recommendationGateway: RecommendationGateway =
  process.env.NEXT_PUBLIC_RECOMMENDATION_SOURCE === 'api'
    ? httpRecommendationGateway
    : process.env.NEXT_PUBLIC_RECOMMENDATION_SOURCE === 'mock'
    ? mockRecommendationGateway
    : supabaseRecommendationGateway;

export function getRecommendations(
  request: RecommendationRequest,
): Promise<RecommendationResponse> {
  return recommendationGateway.getRecommendations(
    normalizeRecommendationRequest(request),
  );
}

export * from './presets';
export * from './types';
