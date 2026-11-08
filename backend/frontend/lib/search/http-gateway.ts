import type { ApiListResponse, PlaceListItem } from '@/lib/types';
import { ApiError } from '@/lib/types';
import type {
  NeedSearchSuggestion,
  PlaceSearchSuggestion,
  SearchGateway,
  SearchSuggestionResponse,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api/v1';

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
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

  return response.json() as Promise<T>;
}

export const httpSearchGateway: SearchGateway = {
  async getPlaceSuggestions(query, limit = 6) {
    const params = new URLSearchParams({
      search: query,
      per_page: String(limit),
    });
    const payload = await request<ApiListResponse<PlaceListItem>>(
      `${API_BASE}/places?${params.toString()}`,
    );

    return {
      data: payload.data.map((place): PlaceSearchSuggestion => ({
        kind: 'place',
        id: place.id,
        name: place.name,
        slug: place.slug,
        address: place.address,
        subdistrict: place.subdistrict,
        latitude: place.latitude,
        longitude: place.longitude,
        image_url: place.image_url,
      })),
      meta: { source: 'api', query },
    };
  },

  async getNeedSuggestions(query, limit = 5) {
    const params = new URLSearchParams({ query, limit: String(limit) });
    return request<SearchSuggestionResponse<NeedSearchSuggestion>>(
      `${API_BASE}/recommendations/suggestions?${params.toString()}`,
    );
  },
};
