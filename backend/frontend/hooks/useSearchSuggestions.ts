'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import {
  searchGateway,
  type SearchSuggestion,
  type SearchSuggestionMode,
  type SearchSuggestionResponse,
} from '@/lib/search';

function useDebouncedValue(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return debouncedValue;
}

export function useSearchSuggestions(
  mode: SearchSuggestionMode,
  query: string,
  enabled = true,
) {
  const debouncedQuery = useDebouncedValue(query.trim(), 300);
  const hasEnoughCharacters = mode === 'need' || debouncedQuery.length >= 2;

  return useQuery<SearchSuggestionResponse<SearchSuggestion>>({
    queryKey: queryKeys.searchSuggestions(mode, debouncedQuery),
    queryFn: async () => {
      const response = mode === 'place'
        ? await searchGateway.getPlaceSuggestions(debouncedQuery)
        : await searchGateway.getNeedSuggestions(debouncedQuery);

      return response as SearchSuggestionResponse<SearchSuggestion>;
    },
    enabled: enabled && hasEnoughCharacters,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
