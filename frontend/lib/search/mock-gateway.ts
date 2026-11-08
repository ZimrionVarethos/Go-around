import { MOCK_RECOMMENDATION_PLACES } from '@/lib/recommendations/mock-data';
import type {
  NeedSearchSuggestion,
  SearchGateway,
} from './types';

const NEED_SUGGESTIONS: NeedSearchSuggestion[] = [
  {
    kind: 'need',
    id: 'study-complete',
    text: 'Wi-Fi kencang dan banyak colokan untuk nugas',
    hint: 'Prioritaskan fasilitas belajar',
  },
  {
    kind: 'need',
    id: 'quiet-study',
    text: 'Tempat tenang untuk fokus mengerjakan tugas',
    hint: 'Prioritaskan suasana kondusif',
  },
  {
    kind: 'need',
    id: 'student-budget',
    text: 'Kopi murah di bawah 20 ribu dekat kampus',
    hint: 'Prioritaskan budget dan jarak',
  },
  {
    kind: 'need',
    id: 'group-work',
    text: 'Tempat nyaman untuk kerja kelompok dengan parkir',
    hint: 'Prioritaskan ruang dan akses',
  },
  {
    kind: 'need',
    id: 'late-study',
    text: 'Tempat nugas yang buka sampai malam',
    hint: 'Prioritaskan jam operasional',
  },
  {
    kind: 'need',
    id: 'nearby',
    text: 'Coffee shop terdekat dari lokasi saya',
    hint: 'Prioritaskan jarak',
  },
];

function normalize(value: string): string {
  return value.toLocaleLowerCase('id-ID').trim();
}

function scoreText(value: string, query: string): number {
  if (!query) return 1;

  const normalizedValue = normalize(value);
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  return tokens.reduce((score, token) => {
    if (normalizedValue.startsWith(token)) return score + 3;
    if (normalizedValue.includes(token)) return score + 1;
    return score;
  }, 0);
}

async function wait(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 180));
}

export const mockSearchGateway: SearchGateway = {
  async getPlaceSuggestions(query, limit = 6) {
    await wait();
    const normalizedQuery = normalize(query);
    const data = MOCK_RECOMMENDATION_PLACES
      .map((place) => ({
        place,
        score: Math.max(
          scoreText(place.name, normalizedQuery),
          scoreText(place.address, normalizedQuery),
          scoreText(place.subdistrict, normalizedQuery),
        ),
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.place.name.localeCompare(b.place.name, 'id'))
      .slice(0, limit)
      .map(({ place }) => ({
        kind: 'place' as const,
        id: place.id,
        name: place.name,
        slug: place.slug,
        address: place.address,
        subdistrict: place.subdistrict,
        latitude: place.latitude,
        longitude: place.longitude,
        image_url: place.image_url,
      }));

    return {
      data,
      meta: { source: 'mock', query: normalizedQuery },
    };
  },

  async getNeedSuggestions(query, limit = 5) {
    await wait();
    const normalizedQuery = normalize(query);
    const ranked = NEED_SUGGESTIONS
      .map((suggestion) => ({
        suggestion,
        score: Math.max(
          scoreText(suggestion.text, normalizedQuery),
          scoreText(suggestion.hint, normalizedQuery),
        ),
      }))
      .filter(({ score }) => !normalizedQuery || score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ suggestion }) => suggestion);

    return {
      data: ranked,
      meta: { source: 'mock', query: normalizedQuery },
    };
  },
};
