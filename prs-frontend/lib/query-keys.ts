import type { BboxParams, NearbyParams, RecommendParams, PlaceFilters } from '@/lib/types';

export const queryKeys = {
  places: {
    list: (filters: PlaceFilters = {}) => ['places', 'list', filters] as const,
    bbox: (params: BboxParams) => ['places', 'bbox', params] as const,
    nearby: (params: NearbyParams) => ['places', 'nearby', params] as const,
    recommend: (params: RecommendParams = {}) => ['places', 'recommend', params] as const,
    detail: (idOrSlug: string) => ['places', 'detail', idOrSlug] as const,
    subdistricts: () => ['places', 'subdistricts'] as const,
  },
  categories: () => ['categories'] as const,
  amenities: () => ['amenities'] as const,
} as const;
