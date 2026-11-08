import { ApiError } from '@/lib/types';
import { normalizeRecommendationRequest } from './presets';
import type {
  RecommendationGateway,
  RecommendationResponse,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api/v1';

export const httpRecommendationGateway: RecommendationGateway = {
  async getRecommendations(request) {
    const response = await fetch(`${API_BASE}/recommendations`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(normalizeRecommendationRequest(request)),
    });

    if (!response.ok) {
      let body: unknown = null;
      try {
        body = await response.json();
      } catch {
        body = null;
      }

      throw new ApiError(response.status, body);
    }

    const payload = await response.json() as RecommendationResponse;
    return {
      ...payload,
      meta: {
        ...payload.meta,
        source: 'api',
      },
    };
  },
};
