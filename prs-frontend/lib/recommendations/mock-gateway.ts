import { MOCK_RECOMMENDATION_PLACES } from './mock-data';
import { normalizeRecommendationRequest } from './presets';
import type {
  RecommendationFacility,
  RecommendationGateway,
  RecommendationMockScenario,
  RecommendationPlace,
  RecommendationRequest,
  RecommendationScoreBreakdown,
} from './types';

const EARTH_RADIUS_KM = 6371;

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function distanceKm(
  latitude: number,
  longitude: number,
  destinationLatitude: number,
  destinationLongitude: number,
): number {
  const deltaLatitude = toRadians(destinationLatitude - latitude);
  const deltaLongitude = toRadians(destinationLongitude - longitude);
  const originLatitude = toRadians(latitude);
  const targetLatitude = toRadians(destinationLatitude);
  const haversine =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(originLatitude) *
      Math.cos(targetLatitude) *
      Math.sin(deltaLongitude / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function hasRequiredFacility(
  place: RecommendationPlace,
  facility: RecommendationFacility,
): boolean {
  if (facility === 'plug') {
    return place.plug_availability === 'moderate' || place.plug_availability === 'abundant';
  }

  if (facility === 'wifi') {
    return place.wifi_quality !== null && place.wifi_quality !== 'low';
  }

  return place.amenities.includes(facility);
}

function weightedScore(
  breakdown: RecommendationScoreBreakdown,
  request: RecommendationRequest,
): number {
  const entries = Object.entries(request.weights) as Array<
    [keyof RecommendationScoreBreakdown, number]
  >;
  let weightedTotal = 0;
  let availableWeight = 0;

  for (const [key, weight] of entries) {
    const value = breakdown[key];
    if (value !== null) {
      weightedTotal += value * weight;
      availableWeight += weight;
    }
  }

  return availableWeight > 0 ? weightedTotal / availableWeight : 0;
}

function buildReasons(place: RecommendationPlace): string[] {
  const candidates: Array<[number | null, string]> = [
    [place.score_breakdown.distance, 'Dekat dari lokasi pilihanmu'],
    [place.score_breakdown.price, 'Harga sesuai prioritas budget'],
    [place.score_breakdown.plug, 'Ketersediaan colokan mendukung kegiatan nugas'],
    [place.score_breakdown.wifi, 'Kualitas Wi-Fi mendukung kegiatan online'],
    [place.score_breakdown.quiet, 'Suasananya relatif kondusif untuk fokus'],
    [place.score_breakdown.rating, 'Rating memiliki tingkat kepercayaan yang baik'],
  ];

  return candidates
    .filter((candidate): candidate is [number, string] => candidate[0] !== null)
    .sort((a, b) => b[0] - a[0])
    .slice(0, 3)
    .map(([, reason]) => reason);
}

function scorePlace(
  source: RecommendationPlace,
  request: RecommendationRequest,
): RecommendationPlace {
  const calculatedDistance = distanceKm(
    request.location.latitude,
    request.location.longitude,
    source.latitude,
    source.longitude,
  );
  const distanceScore = Math.max(0, 100 * (1 - calculatedDistance / request.radius_km));
  const scoreBreakdown = {
    ...source.score_breakdown,
    distance: Math.round(distanceScore),
  };
  const score = weightedScore(scoreBreakdown, request);

  const result: RecommendationPlace = {
    ...source,
    distance_km: Number(calculatedDistance.toFixed(2)),
    recommendation_score: Number(score.toFixed(1)),
    score_breakdown: scoreBreakdown,
  };

  return {
    ...result,
    reasons: buildReasons(result),
  };
}

function sortRecommendations(
  places: RecommendationPlace[],
  request: RecommendationRequest,
): RecommendationPlace[] {
  return [...places].sort((a, b) => {
    if (request.sort_by === 'distance') {
      return (a.distance_km ?? Number.POSITIVE_INFINITY) -
        (b.distance_km ?? Number.POSITIVE_INFINITY);
    }

    if (request.sort_by === 'price') {
      return (a.price_min_drink ?? Number.POSITIVE_INFINITY) -
        (b.price_min_drink ?? Number.POSITIVE_INFINITY);
    }

    return b.recommendation_score - a.recommendation_score;
  });
}

function getScenario(): RecommendationMockScenario {
  const value = process.env.NEXT_PUBLIC_RECOMMENDATION_MOCK_SCENARIO;
  return value === 'partial' || value === 'empty' || value === 'error'
    ? value
    : 'success';
}

async function wait(milliseconds: number): Promise<void> {
  await new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export const mockRecommendationGateway: RecommendationGateway = {
  async getRecommendations(input) {
    await wait(450);

    const scenario = getScenario();
    if (scenario === 'error') {
      throw new Error('Simulasi layanan rekomendasi tidak tersedia.');
    }

    if (scenario === 'empty') {
      return {
        status: 'success',
        data: [],
        meta: {
          total: 0,
          generated_at: new Date().toISOString(),
          source: 'mock',
          ai_used: false,
          ai_provider: null,
        },
      };
    }

    const request = normalizeRecommendationRequest(input);
    const source = scenario === 'partial'
      ? MOCK_RECOMMENDATION_PLACES.filter((place) => place.data_confidence !== null && place.data_confidence < 70)
      : MOCK_RECOMMENDATION_PLACES;

    const data = source
      .map((place) => scorePlace(place, request))
      .filter((place) => (place.distance_km ?? Number.POSITIVE_INFINITY) <= request.radius_km)
      .filter((place) => (
        request.max_price === null ||
        place.price_min_drink === null ||
        place.price_min_drink <= request.max_price
      ))
      .filter((place) => !request.open_now || place.is_open_now === true)
      .filter((place) => request.must_have.every((facility) => hasRequiredFacility(place, facility)));

    const sorted = sortRecommendations(data, request).slice(0, request.limit);

    return {
      status: 'success',
      data: sorted,
      meta: {
        total: sorted.length,
        generated_at: new Date().toISOString(),
        source: 'mock',
        ai_used: false,
        ai_provider: null,
      },
    };
  },
};
