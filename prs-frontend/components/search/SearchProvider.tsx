'use client';

import { createContext, useContext, useMemo, useRef, useState } from 'react';
import { PublicTopbar } from '@/components/layout/PublicTopbar';
import type { PlaceSearchSuggestion, SearchIntent } from '@/lib/search';

interface SearchContextValue {
  searchIntent: SearchIntent | null;
  searchByKeyword: (query: string, place?: PlaceSearchSuggestion) => void;
  searchByNeed: (query: string) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const searchSequence = useRef(0);
  const [searchIntent, setSearchIntent] = useState<SearchIntent | null>(null);

  const value = useMemo<SearchContextValue>(() => ({
    searchIntent,
    searchByKeyword: (query, place) => {
      searchSequence.current += 1;
      setSearchIntent({
        id: searchSequence.current,
        mode: 'keyword',
        query,
        place,
      });
    },
    searchByNeed: (query) => {
      searchSequence.current += 1;
      setSearchIntent({
        id: searchSequence.current,
        mode: 'need',
        query,
      });
    },
  }), [searchIntent]);

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext(): SearchContextValue {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used inside SearchProvider.');
  }
  return context;
}

export function SearchConnectedTopbar() {
  const { searchByKeyword, searchByNeed } = useSearchContext();

  return (
    <PublicTopbar
      onSearch={(query) => searchByKeyword(query)}
      onPlaceSelect={(place) => searchByKeyword(place.name, place)}
      onAiSearch={searchByNeed}
    />
  );
}
