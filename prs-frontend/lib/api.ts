import type {
  ApiListResponse,
  ApiSingleResponse,
  GeoJsonFeatureCollection,
  PlaceListItem,
  PlaceDetail,
  PlaceGeoJsonFeature,
  Category,
  Amenity,
  SubdistrictItem,
  ContributionPayload,
  ContributionResponse,
  BboxParams,
  NearbyParams,
  RecommendParams,
  PlaceFilters,
} from '@/lib/types';
import { ApiError as ApiErrorClass } from '@/lib/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api/v1';

// ─── Base fetcher ──────────────────────────────────────────────────────────────

function buildUrl(path: string, params?: Record<string, unknown>): string {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function apiFetch<T>(path: string, options?: RequestInit, params?: Record<string, unknown>): Promise<T> {
  const url = buildUrl(path, params);
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  });

  if (!res.ok) {
    let body: unknown;
    try { body = await res.json(); } catch { body = null; }
    throw new ApiErrorClass(res.status, body);
  }

  return res.json() as Promise<T>;
}

// ─── Places ────────────────────────────────────────────────────────────────────

export const placesApi = {
  list: (filters: PlaceFilters = {}) =>
    apiFetch<ApiListResponse<PlaceListItem>>('/places', undefined, filters as unknown as Record<string, unknown>),

  bbox: (params: BboxParams = {}) =>
    apiFetch<GeoJsonFeatureCollection>('/places/bbox', undefined, params as unknown as Record<string, unknown>),

  nearby: (params: NearbyParams) =>
    apiFetch<GeoJsonFeatureCollection>('/places/nearby', undefined, params as unknown as Record<string, unknown>),

  recommend: (params: RecommendParams = {}) =>
    apiFetch<{ status: string; message: string; data: PlaceGeoJsonFeature[] }>(
      '/places/recommend',
      undefined,
      params as unknown as Record<string, unknown>
    ),

  detail: (idOrSlug: string) =>
    apiFetch<ApiSingleResponse<PlaceDetail>>(`/places/${idOrSlug}`),

  subdistricts: () =>
    apiFetch<ApiSingleResponse<SubdistrictItem[]>>('/places/subdistricts'),
};

// ─── Categories ────────────────────────────────────────────────────────────────

export const categoriesApi = {
  list: () => apiFetch<ApiSingleResponse<Category[]>>('/categories'),
};

// ─── Amenities ─────────────────────────────────────────────────────────────────

export const amenitiesApi = {
  list: () => apiFetch<ApiSingleResponse<Amenity[]>>('/amenities'),
};

// ─── Contributions ─────────────────────────────────────────────────────────────

export const contributionsApi = {
  submit: (payload: ContributionPayload) =>
    apiFetch<ContributionResponse>('/contributions', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
