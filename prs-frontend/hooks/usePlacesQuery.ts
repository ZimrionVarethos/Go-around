'use client';

import { useQuery } from '@tanstack/react-query';
import { placesApi, categoriesApi, amenitiesApi } from '@/lib/api';
import { getRecommendations } from '@/lib/recommendations';
import { queryKeys } from '@/lib/query-keys';
import type { PlaceFilters, BboxParams, NearbyParams, RecommendParams } from '@/lib/types';
import type { RecommendationRequest } from '@/lib/recommendations/types';

// ─── Place list ────────────────────────────────────────────────────────────────

export function usePlaces(filters: PlaceFilters = {}) {
  return useQuery({
    queryKey: queryKeys.places.list(filters),
    queryFn: () => placesApi.list(filters),
    staleTime: 2 * 60 * 1000,
  });
}

// ─── GeoJSON — viewport markers ───────────────────────────────────────────────

export function useBboxPlaces(params: BboxParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.places.bbox(params),
    queryFn: () => placesApi.bbox(params),
    staleTime: 30 * 1000, // 30s — viewport changes frequently
    enabled,
  });
}

// ─── Nearby ───────────────────────────────────────────────────────────────────

export function useNearbyPlaces(params: NearbyParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.places.nearby(params),
    queryFn: () => placesApi.nearby(params),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

// ─── Recommendations ──────────────────────────────────────────────────────────

export function useRecommendedPlaces(params: RecommendParams = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.places.recommend(params),
    queryFn: () => placesApi.recommend(params),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

/**
 * New recommendation contract used by the mock/API gateway.
 * The query stays disabled until the user submits a complete request.
 */
export function useRecommendations(
  request: RecommendationRequest | null,
  enabled = true,
) {
  return useQuery({
    queryKey: request
      ? queryKeys.recommendations(request)
      : ['recommendations', 'idle'],
    queryFn: () => getRecommendations(request!),
    enabled: enabled && request !== null,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error) => {
      const statusCode = 'statusCode' in error
        ? Number((error as { statusCode?: unknown }).statusCode)
        : null;

      if (statusCode !== null && statusCode >= 400 && statusCode < 500) {
        return false;
      }

      return failureCount < 2;
    },
  });
}

// ─── Place detail ─────────────────────────────────────────────────────────────

export function usePlaceDetail(idOrSlug: string | null) {
  return useQuery({
    queryKey: queryKeys.places.detail(idOrSlug ?? ''),
    queryFn: () => placesApi.detail(idOrSlug!),
    staleTime: 5 * 60 * 1000,
    enabled: !!idOrSlug,
  });
}

// ─── Subdistricts ─────────────────────────────────────────────────────────────

export function useSubdistricts() {
  return useQuery({
    queryKey: queryKeys.places.subdistricts(),
    queryFn: () => placesApi.subdistricts(),
    staleTime: 10 * 60 * 1000,
  });
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: () => categoriesApi.list(),
    staleTime: 10 * 60 * 1000,
  });
}

// ─── Amenities ────────────────────────────────────────────────────────────────

export function useAmenities() {
  return useQuery({
    queryKey: queryKeys.amenities(),
    queryFn: () => amenitiesApi.list(),
    staleTime: 10 * 60 * 1000,
  });
}
