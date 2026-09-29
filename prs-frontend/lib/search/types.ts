export type SearchSuggestionMode = 'place' | 'need';

export interface PlaceSearchSuggestion {
  kind: 'place';
  id: number;
  name: string;
  slug: string;
  address: string;
  subdistrict: string;
  latitude: number;
  longitude: number;
  image_url: string | null;
}

export interface NeedSearchSuggestion {
  kind: 'need';
  id: string;
  text: string;
  hint: string;
}

export type SearchSuggestion = PlaceSearchSuggestion | NeedSearchSuggestion;

export interface SearchSuggestionResponse<T extends SearchSuggestion> {
  data: T[];
  meta: {
    source: 'mock' | 'api';
    query: string;
  };
}

export interface SearchGateway {
  getPlaceSuggestions(
    query: string,
    limit?: number,
  ): Promise<SearchSuggestionResponse<PlaceSearchSuggestion>>;
  getNeedSuggestions(
    query: string,
    limit?: number,
  ): Promise<SearchSuggestionResponse<NeedSearchSuggestion>>;
}

export type SearchIntent =
  | {
      id: number;
      mode: 'keyword';
      query: string;
      place?: PlaceSearchSuggestion;
    }
  | {
      id: number;
      mode: 'need';
      query: string;
    };
