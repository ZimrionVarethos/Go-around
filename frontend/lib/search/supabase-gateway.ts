import { supabaseApi } from '../supabase-api';
import type {
  NeedSearchSuggestion,
  PlaceSearchSuggestion,
  SearchGateway,
  SearchSuggestionResponse,
} from './types';

const COMMON_NEED_SUGGESTIONS: NeedSearchSuggestion[] = [
  {
    kind: 'need',
    id: 'n1',
    text: 'Murah di bawah 20rb',
    hint: 'Kopi dan minuman hemat kantong mahasiswa',
  },
  {
    kind: 'need',
    id: 'n2',
    text: 'Banyak colokan dan stopkontak',
    hint: 'Baterai laptop aman untuk sesi nugas panjang',
  },
  {
    kind: 'need',
    id: 'n3',
    text: 'WiFi kencang di atas 50 Mbps',
    hint: 'Download materi, koding, dan video call lancar',
  },
  {
    kind: 'need',
    id: 'n4',
    text: 'Buka 24 jam',
    hint: 'Spot nugas malam dan begadang skripsi',
  },
  {
    kind: 'need',
    id: 'n5',
    text: 'Suasana hening & kondusif',
    hint: 'Fokus belajar tanpa kebisingan musik keras',
  },
  {
    kind: 'need',
    id: 'n6',
    text: 'Dekat Vokasi IPB Cilibende',
    hint: 'Koridor Jl. Kumbang & Jl. Lodaya',
  },
  {
    kind: 'need',
    id: 'n7',
    text: 'Kawasan Pajajaran & Pandu Raya',
    hint: 'Pusat coffee shop modern Bogor Timur/Utara',
  },
];

export const supabaseSearchGateway: SearchGateway = {
  async getPlaceSuggestions(
    query: string,
    limit = 6,
  ): Promise<SearchSuggestionResponse<PlaceSearchSuggestion>> {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { data: [], meta: { source: 'api', query } };
    }

    try {
      const allPlaces = await supabaseApi.getPlaces();
      const matches = allPlaces
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.subdistrict.toLowerCase().includes(q) ||
            p.address.toLowerCase().includes(q),
        )
        .slice(0, limit)
        .map((p) => ({
          kind: 'place' as const,
          id: p.id,
          name: p.name,
          slug: p.slug,
          address: p.address,
          subdistrict: p.subdistrict,
          latitude: p.latitude,
          longitude: p.longitude,
          image_url: p.image_url,
        }));

      return { data: matches, meta: { source: 'api', query } };
    } catch {
      return { data: [], meta: { source: 'api', query } };
    }
  },

  async getNeedSuggestions(
    query: string,
    limit = 5,
  ): Promise<SearchSuggestionResponse<NeedSearchSuggestion>> {
    const q = query.trim().toLowerCase();
    const matches = q
      ? COMMON_NEED_SUGGESTIONS.filter(
          (n) =>
            n.text.toLowerCase().includes(q) || n.hint.toLowerCase().includes(q),
        ).slice(0, limit)
      : COMMON_NEED_SUGGESTIONS.slice(0, limit);

    return { data: matches, meta: { source: 'api', query } };
  },
};
