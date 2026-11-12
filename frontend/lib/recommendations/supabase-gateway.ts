import { normalizeWifiQuality, supabaseApi } from '../supabase-api';
import { normalizeRecommendationRequest, normalizeRecommendationWeights } from './presets';
import type {
  RecommendationFacility,
  RecommendationGateway,
  RecommendationPlace,
  RecommendationRequest,
  RecommendationResponse,
  RecommendationScoreBreakdown,
} from './types';

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

function normalizeText(value: string): string {
  return value.toLocaleLowerCase('id-ID').trim();
}

function inferNaturalLanguagePreferences(
  request: RecommendationRequest,
): RecommendationRequest & { quiet_hint?: boolean } {
  const query = normalizeText(request.natural_language_query ?? '');
  if (!query) return request;

  const mustHave = new Set(request.must_have);
  const weights = { ...request.weights };
  const hasAny = (terms: string[]) => terms.some((term) => query.includes(term));

  if (hasAny(['colokan', 'stop kontak', 'stopkontak', 'charger'])) {
    mustHave.add('plug');
    weights.plug += 0.3;
  }
  if (hasAny(['wifi', 'wi-fi', 'internet', 'online'])) {
    mustHave.add('wifi');
    weights.wifi += 0.3;
  }
  if (hasAny(['tenang', 'hening', 'fokus', 'kondusif'])) {
    weights.quiet += 0.35;
  }
  if (hasAny(['murah', 'hemat', 'budget', 'kantong'])) {
    weights.price += 0.35;
  }
  if (hasAny(['dekat', 'terdekat', 'jalan kaki'])) {
    weights.distance += 0.35;
  }
  if (hasAny(['rating', 'ulasan', 'bagus'])) {
    weights.rating += 0.25;
  }
  if (hasAny(['musholla', 'musala'])) mustHave.add('musholla');
  if (hasAny(['parkir'])) mustHave.add('parking');
  if (hasAny(['ac', 'air conditioner', 'dingin'])) mustHave.add('air_conditioning');
  if (hasAny(['diskon', 'mahasiswa', 'ktm'])) mustHave.add('student_discount');

  const is24hQuery = hasAny(['24 jam', '24jam', 'nonstop', 'begadang', 'malam']);

  const explicitBudget = query.match(
    /(?:di bawah|maks(?:imal)?|kurang dari|<)?\s*(\d{1,3})\s*(?:rb|ribu|k)\b/,
  );
  const parsedBudget = explicitBudget ? Number(explicitBudget[1]) * 1000 : null;

  let location = request.location;
  if (hasAny(['vokasi', 'cilibende', 'lodaya', 'kumbang'])) {
    location = { latitude: -6.5898, longitude: 106.7995 };
  } else if (hasAny(['pajajaran', 'pandu raya', 'bantarjati'])) {
    location = { latitude: -6.5825, longitude: 106.809 };
  }

  return {
    ...request,
    location,
    preset: 'custom',
    is_24_hours: is24hQuery ? true : request.is_24_hours,
    open_now: is24hQuery ? true : request.open_now,
    max_price: parsedBudget ?? request.max_price,
    must_have: [...mustHave],
    weights: normalizeRecommendationWeights(weights),
  };
}

function isOpenNowWIB(
  openTime?: string | null,
  closeTime?: string | null,
  is24Hours?: boolean | null,
): boolean {
  if (is24Hours) return true;
  if (!openTime || !closeTime) return true;

  try {
    const now = new Date();
    const wib = new Date(
      now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }),
    );
    const currentMins = wib.getHours() * 60 + wib.getMinutes();

    const [oh, om] = openTime.split(':').map(Number);
    const [ch, cm] = closeTime.split(':').map(Number);
    if (isNaN(oh) || isNaN(ch)) return true;

    const openMins = oh * 60 + (om || 0);
    const closeMins = ch * 60 + (cm || 0);

    if (closeMins === openMins) return true;
    if (closeMins > openMins) {
      return currentMins >= openMins && currentMins <= closeMins;
    }
    // Overnight (e.g., 10:00 - 02:00)
    return currentMins >= openMins || currentMins <= closeMins;
  } catch {
    return true;
  }
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

function normalizeAmenities(
  rawAmenities: unknown,
  wifiSpeed: number | null,
  plugAvail: string | null,
  hasStudentDiscount: boolean,
): RecommendationFacility[] {
  const set = new Set<RecommendationFacility>();
  if (Array.isArray(rawAmenities)) {
    for (const item of rawAmenities) {
      const val =
        typeof item === 'object' && item !== null
          ? String((item as Record<string, unknown>).slug ?? (item as Record<string, unknown>).name ?? '')
          : String(item ?? '');
      const lower = val.toLowerCase();
      if (lower.includes('plug') || lower.includes('colokan')) set.add('plug');
      if (lower.includes('wifi') || lower.includes('wi-fi')) set.add('wifi');
      if (lower.includes('musholla') || lower.includes('musala')) set.add('musholla');
      if (lower.includes('diskon') || lower.includes('student') || lower.includes('ktm')) {
        set.add('student_discount');
      }
      if (lower.includes('parkir') || lower.includes('parking')) set.add('parking');
      if (
        lower === 'ac' ||
        lower.includes('ac-room') ||
        lower.includes('ber-ac') ||
        lower.includes('air_conditioning') ||
        lower.includes('air conditioner')
      ) {
        set.add('air_conditioning');
      }
    }
  }
  if (plugAvail === 'abundant') set.add('plug');
  if (wifiSpeed !== null && wifiSpeed >= 25) set.add('wifi');
  if (hasStudentDiscount) set.add('student_discount');
  return [...set];
}

export const supabaseRecommendationGateway: RecommendationGateway = {
  async getRecommendations(input: RecommendationRequest): Promise<RecommendationResponse> {
    try {
      const request = inferNaturalLanguagePreferences(
        normalizeRecommendationRequest(input),
      );
      const allPlaces = await supabaseApi.getPlaces();

      const userLat = request.location.latitude;
      const userLng = request.location.longitude;

      let scoredPlaces: RecommendationPlace[] = allPlaces.map((p) => {
        const distance = calculateDistance(userLat, userLng, p.latitude, p.longitude);
        const wifiSpeed = p.wifi_speed_mbps;
        const wifiQuality = normalizeWifiQuality(p.wifi_quality, wifiSpeed);

        const wifiScore =
          wifiSpeed !== null
            ? Math.round(Math.min(100, Math.max(25, (wifiSpeed / 80) * 100)))
            : 60;
        const plugScore =
          p.plug_availability === 'abundant'
            ? 100
            : p.plug_availability === 'moderate'
            ? 75
            : p.plug_availability === 'limited'
            ? 45
            : 15;
        const priceVal = p.price_min_drink > 0 ? p.price_min_drink : 20000;
        const priceScore = Math.round(
          Math.max(10, Math.min(100, 100 - (priceVal - 10000) / 300)),
        );
        const quietScore =
          p.noise_level === 'quiet' ? 100 : p.noise_level === 'moderate' ? 75 : 45;
        const ratingScore = Math.round(((p.google_rating || 4.5) / 5) * 100);
        const distanceScore = Math.round(
          Math.max(0, 100 * (1 - distance / Math.max(1, request.radius_km))),
        );

        const breakdown: RecommendationScoreBreakdown = {
          distance: distanceScore,
          rating: ratingScore,
          price: priceScore,
          wifi: wifiScore,
          plug: plugScore,
          quiet: quietScore,
        };

        const totalScore = weightedScore(breakdown, request);
        const roundedScore = Math.round(totalScore * 10) / 10;

        const reasons: string[] = [];
        if (p.plug_availability === 'abundant') reasons.push('Colokan Melimpah');
        if (wifiSpeed !== null && wifiSpeed >= 50) {
          reasons.push(`Wi-Fi Kencang ${wifiSpeed} Mbps`);
        }
        if (priceVal <= 20000) reasons.push('Minuman < Rp20rb');
        if (p.is_24_hours) reasons.push('Buka 24 Jam Nonstop');
        if (p.has_student_discount) reasons.push('Diskon Mahasiswa');
        if (p.noise_level === 'quiet') reasons.push('Suasana Tenang');
        if (reasons.length === 0 && distance <= 2) {
          reasons.push(`Hanya ${distance} km dari lokasi pilihanmu`);
        }

        const gMapsUrl =
          p.google_maps_url ||
          `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            `${p.name}, Kota Bogor`,
          )}`;

        return {
          id: p.id,
          slug: p.slug,
          name: p.name,
          address: p.address || `Kec. ${p.subdistrict}, Kota Bogor`,
          subdistrict: p.subdistrict || 'Kota Bogor',
          latitude: p.latitude,
          longitude: p.longitude,
          google_maps_url: gMapsUrl,
          recommendation_score: roundedScore,
          data_confidence: 95,
          distance_km: distance,
          google_rating: p.google_rating,
          total_google_reviews: p.total_google_reviews,
          price_min_drink: priceVal,
          price_max_drink: p.price_max_drink || priceVal + 15000,
          wifi_speed_mbps: wifiSpeed,
          wifi_quality: wifiQuality,
          plug_availability: p.plug_availability,
          noise_level: p.noise_level,
          amenities: normalizeAmenities(
            p.amenities,
            wifiSpeed,
            p.plug_availability,
            p.has_student_discount,
          ),
          image_url: p.image_url,
          is_open_now: isOpenNowWIB(p.open_time, p.close_time, p.is_24_hours),
          is_24_hours: p.is_24_hours,
          open_time: p.open_time || '08:00',
          close_time: p.close_time || '23:00',
          last_verified_at: p.updated_at || new Date().toISOString(),
          score_breakdown: breakdown,
          reasons: reasons.slice(0, 3),
          warnings: [],
        };
      });

      // Apply spatial radius & criteria filters
      if (request.radius_km > 0) {
        scoredPlaces = scoredPlaces.filter(
          (p) => (p.distance_km ?? Number.POSITIVE_INFINITY) <= request.radius_km,
        );
      }

      if (request.max_price !== null) {
        scoredPlaces = scoredPlaces.filter(
          (p) => p.price_min_drink === null || p.price_min_drink <= request.max_price!,
        );
      }

      if (request.is_24_hours) {
        scoredPlaces = scoredPlaces.filter((p) => p.is_24_hours === true);
      } else if (request.open_now) {
        scoredPlaces = scoredPlaces.filter((p) => p.is_open_now === true);
      }

      if (request.must_have.includes('wifi')) {
        scoredPlaces = scoredPlaces.filter(
          (p) =>
            (p.wifi_speed_mbps !== null && p.wifi_speed_mbps >= 25) ||
            (p.wifi_quality !== null && p.wifi_quality !== 'low'),
        );
      }

      if (request.must_have.includes('plug')) {
        scoredPlaces = scoredPlaces.filter((p) => p.plug_availability === 'abundant');
      }

      for (const reqFac of request.must_have) {
        if (reqFac !== 'wifi' && reqFac !== 'plug') {
          scoredPlaces = scoredPlaces.filter((p) => p.amenities.includes(reqFac));
        }
      }

      if (request.search_query) {
        const tokens = normalizeText(request.search_query).split(/\s+/).filter(Boolean);
        scoredPlaces = scoredPlaces.filter((p) => {
          const haystack = normalizeText(
            `${p.name} ${p.address} ${p.subdistrict} ${p.reasons.join(' ')}`,
          );
          return tokens.every((t) => haystack.includes(t));
        });
      }

      if (request.sort_by === 'distance') {
        scoredPlaces.sort((a, b) => (a.distance_km ?? 99) - (b.distance_km ?? 99));
      } else if (request.sort_by === 'price') {
        scoredPlaces.sort(
          (a, b) => (a.price_min_drink ?? 999999) - (b.price_min_drink ?? 999999),
        );
      } else {
        scoredPlaces.sort((a, b) => b.recommendation_score - a.recommendation_score);
      }

      return {
        status: 'success',
        data: scoredPlaces,
        meta: {
          total: scoredPlaces.length,
          generated_at: new Date().toISOString(),
          source: 'api',
        },
      };
    } catch (err) {
      console.error('Supabase recommendation error:', err);
      return {
        status: 'success',
        data: [],
        meta: {
          total: 0,
          generated_at: new Date().toISOString(),
          source: 'api',
        },
      };
    }
  },
};
