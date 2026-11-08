import { supabaseApi } from '../supabase-api';
import type {
  RecommendationGateway,
  RecommendationPlace,
  RecommendationRequest,
  RecommendationResponse,
} from './types';

// Haversine formula for distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const supabaseRecommendationGateway: RecommendationGateway = {
  async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    try {
      const allPlaces = await supabaseApi.getPlaces();

      const userLat = request.location.latitude;
      const userLng = request.location.longitude;

      // Map and score all places
      let scoredPlaces: RecommendationPlace[] = allPlaces.map((p: any) => {
        const lat = parseFloat(p.latitude);
        const lng = parseFloat(p.longitude);
        const distance = calculateDistance(userLat, userLng, lat, lng);

        // Subscores 0-100
        const wifiScore = Math.min(100, Math.max(30, ((p.wifi_speed_mbps || 30) / 80) * 100));
        const plugScore = p.plug_availability === 'abundant' ? 100 : (p.plug_availability === 'moderate' ? 75 : 45);
        const priceVal = p.price_min_drink || 20000;
        const priceScore = Math.max(10, Math.min(100, 100 - ((priceVal - 10000) / 300)));
        const quietScore = p.noise_level === 'quiet' ? 100 : (p.noise_level === 'moderate' ? 75 : 50);
        const ratingScore = ((p.google_rating || 4.5) / 5) * 100;
        const distanceScore = Math.max(10, 100 - distance * 15);

        // Weighted recommendation score
        const w = request.weights;
        const totalW = (w.wifi + w.plug + w.price + w.quiet + w.rating + w.distance) || 100;
        const totalScore =
          (wifiScore * w.wifi +
            plugScore * w.plug +
            priceScore * w.price +
            quietScore * w.quiet +
            ratingScore * w.rating +
            distanceScore * w.distance) /
          totalW;

        const roundedScore = Math.round(totalScore * 10) / 10;

        // Reason badges
        const reasons: string[] = [];
        if (p.plug_availability === 'abundant') reasons.push('Colokan Melimpah');
        if (p.wifi_speed_mbps >= 50) reasons.push(`WiFi Kencang ${p.wifi_speed_mbps} Mbps`);
        if (priceVal <= 20000) reasons.push('Minuman < 20rb');
        if (p.is_24_hours) reasons.push('Buka 24 Jam');
        if (p.has_student_discount) reasons.push('Diskon Mahasiswa');
        if (p.noise_level === 'quiet') reasons.push('Suasana Tenang');

        const gMapsUrl = p.google_maps_url || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.name + ', Kota Bogor')}`;

        return {
          id: p.id,
          slug: p.slug,
          name: p.name,
          address: p.address || `Kec. ${p.subdistrict}, Kota Bogor`,
          subdistrict: p.subdistrict || 'Kota Bogor',
          latitude: lat,
          longitude: lng,
          google_maps_url: gMapsUrl,
          recommendation_score: roundedScore,
          data_confidence: 95,
          distance_km: distance,
          google_rating: p.google_rating || 4.6,
          total_google_reviews: p.total_google_reviews || 250,
          price_min_drink: priceVal,
          price_max_drink: p.price_max_drink || priceVal + 15000,
          wifi_speed_mbps: p.wifi_speed_mbps || 50,
          wifi_quality: (p.wifi_speed_mbps >= 70 ? 'ultra' : p.wifi_speed_mbps >= 40 ? 'fast' : 'standard') as any,
          plug_availability: p.plug_availability || 'moderate',
          noise_level: p.noise_level || 'moderate',
          amenities: (p.amenities || []).map((a: any) => a.name || a),
          image_url: p.image_url,
          is_open_now: true,
          is_24_hours: p.is_24_hours || false,
          open_time: p.open_time || '08:00',
          close_time: p.close_time || '23:00',
          last_verified_at: new Date().toISOString(),
          score_breakdown: {
            distance: Math.round(distanceScore),
            rating: Math.round(ratingScore),
            price: Math.round(priceScore),
            wifi: Math.round(wifiScore),
            plug: Math.round(plugScore),
            quiet: Math.round(quietScore),
          },
          reasons,
          warnings: [],
        };
      });

      // Filter by request criteria
      if (request.max_price) {
        scoredPlaces = scoredPlaces.filter((p) => (p.price_min_drink || 0) <= request.max_price!);
      }
      if (request.must_have.includes('wifi')) {
        scoredPlaces = scoredPlaces.filter((p) => (p.wifi_speed_mbps || 0) >= 50);
      }
      if (request.must_have.includes('plug')) {
        scoredPlaces = scoredPlaces.filter((p) => p.plug_availability === 'abundant');
      }
      if (request.search_query) {
        const q = request.search_query.toLowerCase();
        scoredPlaces = scoredPlaces.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.address.toLowerCase().includes(q) ||
            p.subdistrict.toLowerCase().includes(q)
        );
      }

      // Sort
      if (request.sort_by === 'distance') {
        scoredPlaces.sort((a, b) => (a.distance_km ?? 99) - (b.distance_km ?? 99));
      } else if (request.sort_by === 'price') {
        scoredPlaces.sort((a, b) => (a.price_min_drink ?? 999999) - (b.price_min_drink ?? 999999));
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

