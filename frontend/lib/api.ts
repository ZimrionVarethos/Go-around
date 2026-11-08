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
import { supabaseApi } from './supabase-api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api/v1';
const USE_SUPABASE = process.env.NEXT_PUBLIC_DATA_SOURCE === 'supabase' || !process.env.NEXT_PUBLIC_API_URL;

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
  list: async (filters: PlaceFilters = {}): Promise<ApiListResponse<PlaceListItem>> => {
    if (USE_SUPABASE) {
      const places = await supabaseApi.getPlaces(filters);
      return {
        status: 'success',
        data: places,
        pagination: {
          total: places.length,
          per_page: 50,
          current_page: 1,
          last_page: 1,
        },
      };
    }
    return apiFetch<ApiListResponse<PlaceListItem>>('/places', undefined, filters as unknown as Record<string, unknown>);
  },

  bbox: async (params: BboxParams = {}): Promise<GeoJsonFeatureCollection> => {
    if (USE_SUPABASE) {
      return supabaseApi.getBboxPlaces();
    }
    return apiFetch<GeoJsonFeatureCollection>('/places/bbox', undefined, params as unknown as Record<string, unknown>);
  },

  nearby: async (params: NearbyParams): Promise<GeoJsonFeatureCollection> => {
    if (USE_SUPABASE) {
      return supabaseApi.getBboxPlaces();
    }
    return apiFetch<GeoJsonFeatureCollection>('/places/nearby', undefined, params as unknown as Record<string, unknown>);
  },

  recommend: async (params: RecommendParams = {}): Promise<{ status: string; message: string; data: PlaceGeoJsonFeature[] }> => {
    if (USE_SUPABASE) {
      const geo = await supabaseApi.getBboxPlaces();
      return { status: 'success', message: 'OK', data: geo.features };
    }
    return apiFetch<{ status: string; message: string; data: PlaceGeoJsonFeature[] }>(
      '/places/recommend',
      undefined,
      params as unknown as Record<string, unknown>
    );
  },

  detail: async (idOrSlug: string): Promise<ApiSingleResponse<PlaceDetail>> => {
    if (USE_SUPABASE) {
      const place = await supabaseApi.getPlaceDetail(idOrSlug);
      if (!place) throw new ApiErrorClass(404, 'Place not found');
      return { status: 'success', data: place };
    }
    return apiFetch<ApiSingleResponse<PlaceDetail>>(`/places/${idOrSlug}`);
  },

  subdistricts: async (): Promise<ApiSingleResponse<SubdistrictItem[]>> => {
    if (USE_SUPABASE) {
      const list = await supabaseApi.getSubdistricts();
      return { status: 'success', data: list.map((s) => ({ subdistrict: s, count: 0 })) };
    }
    return apiFetch<ApiSingleResponse<SubdistrictItem[]>>('/places/subdistricts');
  },
};

// ─── Categories ────────────────────────────────────────────────────────────────

export const categoriesApi = {
  list: async (): Promise<ApiSingleResponse<Category[]>> => {
    if (USE_SUPABASE) {
      const categories = await supabaseApi.getCategories();
      return { status: 'success', data: categories };
    }
    return apiFetch<ApiSingleResponse<Category[]>>('/categories');
  },
};

// ─── Amenities ─────────────────────────────────────────────────────────────────

export const amenitiesApi = {
  list: (): Promise<ApiSingleResponse<Amenity[]>> =>
    apiFetch<ApiSingleResponse<Amenity[]>>('/amenities'),
};

// ─── Contributions ─────────────────────────────────────────────────────────────

export const contributionsApi = {
  submit: async (payload: ContributionPayload): Promise<ContributionResponse> => {
    if (USE_SUPABASE) {
      const data = await supabaseApi.createContribution(payload);
      return { status: 'success', message: 'Kontribusi berhasil disimpan', data } as unknown as ContributionResponse;
    }
    return apiFetch<ContributionResponse>('/contributions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// ─── Facility Reports (Lapor & Koreksi Fasilitas) ──────────────────────────────
export const reportsApi = {
  submit: async (payload: Record<string, unknown>): Promise<{ status: string; message: string; data: unknown }> => {
    if (USE_SUPABASE) {
      const data = await supabaseApi.createReport(payload);
      return { status: 'success', message: 'Laporan berhasil disimpan', data };
    }
    return apiFetch<{ status: string; message: string; data: unknown }>('/reports', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// ─── Admin API Service Layer ───────────────────────────────────────────────────
export * from './api-admin';
