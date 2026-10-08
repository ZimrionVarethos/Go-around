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
import {
  buildMockPlaceDetail,
  getSyncedPublicPlaces,
  recommendationToGeoJsonFeature,
} from '@/lib/recommendations/mock-data';

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

  bbox: async (params: BboxParams = {}): Promise<GeoJsonFeatureCollection> => {
    try {
      return await apiFetch<GeoJsonFeatureCollection>('/places/bbox', undefined, params as unknown as Record<string, unknown>);
    } catch {
      const synced = getSyncedPublicPlaces();
      return {
        type: 'FeatureCollection',
        metadata: {
          count: synced.length,
          city: 'Kota Bogor',
          generated_at: new Date().toISOString(),
        },
        features: synced.map(recommendationToGeoJsonFeature),
      };
    }
  },

  nearby: (params: NearbyParams) =>
    apiFetch<GeoJsonFeatureCollection>('/places/nearby', undefined, params as unknown as Record<string, unknown>),

  recommend: (params: RecommendParams = {}) =>
    apiFetch<{ status: string; message: string; data: PlaceGeoJsonFeature[] }>(
      '/places/recommend',
      undefined,
      params as unknown as Record<string, unknown>
    ),

  detail: async (idOrSlug: string): Promise<ApiSingleResponse<PlaceDetail>> => {
    try {
      return await apiFetch<ApiSingleResponse<PlaceDetail>>(`/places/${idOrSlug}`);
    } catch {
      const allPlaces = getSyncedPublicPlaces(true);
      const found = allPlaces.find(
        (p) => p.slug === idOrSlug || String(p.id) === String(idOrSlug)
      );
      if (!found) {
        throw new ApiErrorClass(404, null, 'Tempat nugas tidak ditemukan');
      }
      return {
        status: 'success',
        data: buildMockPlaceDetail(found),
      };
    }
  },

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

// ─── Admin API Service Layer ───────────────────────────────────────────────────
export * from './api-admin';
