import { httpRecommendationGateway } from './http-gateway';
import { mockRecommendationGateway } from './mock-gateway';
import { normalizeRecommendationRequest } from './presets';
import type {
  RecommendationGateway,
  RecommendationRequest,
  RecommendationResponse,
} from './types';

const recommendationGateway: RecommendationGateway =
  process.env.NEXT_PUBLIC_RECOMMENDATION_SOURCE === 'api'
    ? httpRecommendationGateway
    : mockRecommendationGateway;

export function getRecommendations(
  request: RecommendationRequest,
): Promise<RecommendationResponse> {
  return recommendationGateway.getRecommendations(
    normalizeRecommendationRequest(request),
  );
}

export * from './presets';
export * from './types';
