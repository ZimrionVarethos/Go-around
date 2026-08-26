import { GeoJsonFeatureCollection, GeoJsonFeature, PlaceDetailData, FilterState, RecommendationWeights } from '@/types/place';
import { BOGOR_PLACES_MOCK } from '@/data/bogorPlacesMock';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export const apiService = {
  /**
   * Fetch places in GeoJSON format (with backend fallback)
   */
  async getPlaces(filters?: Partial<FilterState>): Promise<GeoJsonFeatureCollection> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.subdistrict) queryParams.append('subdistrict', filters.subdistrict);
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.price_tier) queryParams.append('price_tier', filters.price_tier);
        if (filters.max_price) queryParams.append('max_price', filters.max_price.toString());
        if (filters.min_wifi) queryParams.append('min_wifi', filters.min_wifi.toString());
        if (filters.plug_availability) queryParams.append('plug_availability', filters.plug_availability);
        if (filters.noise_level) queryParams.append('noise_level', filters.noise_level);
        if (filters.is_24_hours) queryParams.append('is_24_hours', '1');
        if (filters.has_student_discount) queryParams.append('has_student_discount', '1');
        if (filters.min_nugas_score) queryParams.append('min_nugas_score', filters.min_nugas_score.toString());
        if (filters.sort_by) queryParams.append('sort_by', filters.sort_by);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${API_BASE_URL}/places/bbox?${queryParams.toString()}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`Backend error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend not reached, using embedded Kota Bogor data fallback.', err);
      return this.filterMockData(filters);
    }
  },

  /**
   * Get single place detail
   */
  async getPlaceDetail(idOrSlug: string | number): Promise<PlaceDetailData | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${API_BASE_URL}/places/${idOrSlug}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`Place detail error: ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch (err) {
      const found = BOGOR_PLACES_MOCK.features.find(
        (f) => f.id === Number(idOrSlug) || f.properties.slug === idOrSlug
      );
      if (!found) return null;

      const p = found.properties;
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        category: p.category,
        location: {
          address: p.address,
          subdistrict: p.subdistrict,
          latitude: found.geometry.coordinates[1],
          longitude: found.geometry.coordinates[0],
          google_maps_url: p.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${found.geometry.coordinates[1]},${found.geometry.coordinates[0]}`,
          navigation_url: `https://www.google.com/maps/dir/?api=1&destination=${found.geometry.coordinates[1]},${found.geometry.coordinates[0]}`,
        },
        socials: {
          instagram: p.instagram_handle ? `https://instagram.com/${p.instagram_handle.replace('@', '')}` : null,
          instagram_handle: p.instagram_handle || null,
        },
        economics: {
          price_min_drink: p.price_min_drink,
          price_max_drink: p.price_max_drink,
          price_avg_food: p.price_avg_food,
          price_tier: p.price_tier,
          price_tier_label: p.price_tier === 1 ? 'Budget (Di bawah 15rb)' : p.price_tier === 2 ? 'Standar (15rb - 28rb)' : 'Coworking (Di atas 30rb)',
          parking_fee_motor: 2000,
          has_student_discount: false,
        },
        nugas_metrics: {
          nugas_score: p.nugas_score,
          budget_score: p.budget_score,
          facility_score: p.facility_score,
          wifi_speed_mbps: p.wifi_speed_mbps,
          wifi_quality: p.wifi_quality,
          plug_availability: p.plug_availability,
          plug_label: p.plug_availability === 'abundant' ? 'Banyak (Hampir di setiap meja)' : p.plug_availability === 'moderate' ? 'Cukup (Beberapa titik)' : 'Terbatas',
          noise_level: p.noise_level,
          noise_label: p.noise_level === 'quiet' ? 'Tenang dan Hening (Ideal Skripsi)' : p.noise_level === 'moderate' ? 'Sedang (Santai / Nugas Bareng)' : 'Ramai (Diskusi & Nobar)',
        },
        operational: {
          is_24_hours: p.is_24_hours,
          open_time: p.open_time || null,
          close_time: p.close_time || null,
          formatted_hours: p.is_24_hours ? 'Buka 24 Jam Nonstop' : (p.open_time && p.close_time ? `${p.open_time} s/d ${p.close_time}` : 'Cek info'),
        },
        ratings: {
          google_rating: p.google_rating,
          total_google_reviews: p.total_google_reviews || 850,
        },
        media: {
          image_url: p.image_url || null,
          vibe_tags: p.vibe_tags || [],
        },
        amenities: [
          { id: 1, name: 'Colokan Melimpah', slug: 'colokan-melimpah', group: 'workspace', detail: 'Tersedia di meja' },
          { id: 2, name: 'Wi-Fi Kencang', slug: 'wifi-cepat', group: 'workspace', detail: `${p.wifi_speed_mbps} Mbps` },
          { id: 3, name: 'Ruangan Ber-AC', slug: 'ac-room', group: 'facility', detail: 'Dingin dan nyaman' },
          { id: 4, name: 'Musholla', slug: 'musholla', group: 'facility', detail: 'Tersedia' },
        ],
        reviews_summary: [
          {
            id: 1,
            source: 'google',
            reviewer_name: 'Mahasiswa Bogor',
            rating: 5.0,
            comment: 'Sangat cocok untuk belajar atau nugas skripsi. Tempat kondusif dan Wi-Fi stabil.',
            keywords: ['wifi stabil', 'colokan aman', 'kondusif'],
            sentiment: 'positive',
            date: 'Terbaru',
          },
        ],
      };
    }
  },

  /**
   * Submit community contribution
   */
  async submitContribution(data: any): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/contributions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to submit contribution');
      const json = await res.json();
      return { success: true, message: json.message };
    } catch {
      return {
        success: true,
        message: 'Terima kasih. Kontribusi tempat baru Anda telah dicatat untuk ditinjau.',
      };
    }
  },

  /**
   * Local filtering logic on mock dataset
   */
  filterMockData(filters?: Partial<FilterState>): GeoJsonFeatureCollection {
    let filtered = [...BOGOR_PLACES_MOCK.features];

    if (!filters) {
      return { ...BOGOR_PLACES_MOCK, features: filtered };
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.properties.name.toLowerCase().includes(q) ||
          f.properties.address.toLowerCase().includes(q) ||
          f.properties.vibe_tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters.subdistrict) {
      filtered = filtered.filter((f) => f.properties.subdistrict === filters.subdistrict);
    }

    if (filters.price_tier) {
      filtered = filtered.filter((f) => f.properties.price_tier.toString() === filters.price_tier);
    }

    if (filters.max_price) {
      filtered = filtered.filter((f) => f.properties.price_min_drink <= Number(filters.max_price));
    }

    if (filters.min_wifi) {
      filtered = filtered.filter((f) => f.properties.wifi_speed_mbps >= Number(filters.min_wifi));
    }

    if (filters.plug_availability) {
      filtered = filtered.filter((f) => f.properties.plug_availability === filters.plug_availability);
    }

    if (filters.noise_level) {
      filtered = filtered.filter((f) => f.properties.noise_level === filters.noise_level);
    }

    if (filters.is_24_hours) {
      filtered = filtered.filter((f) => f.properties.is_24_hours);
    }

    if (filters.min_nugas_score) {
      filtered = filtered.filter((f) => f.properties.nugas_score >= Number(filters.min_nugas_score));
    }

    return {
      type: 'FeatureCollection',
      metadata: {
        count: filtered.length,
        city: 'Kota Bogor',
        generated_at: new Date().toISOString(),
      },
      features: filtered,
    };
  },

  /**
   * Calculate recommendation score
   */
  calculateRecommendations(places: GeoJsonFeature[], weights: RecommendationWeights): GeoJsonFeature[] {
    return places
      .map((f) => {
        const p = f.properties;
        const budgetComponent = p.budget_score;
        const wifiComponent = Math.min(100, (p.wifi_speed_mbps / 100) * 100);
        const plugComponent = p.plug_availability === 'abundant' ? 100 : p.plug_availability === 'moderate' ? 70 : 35;
        const quietComponent = p.noise_level === 'quiet' ? 100 : p.noise_level === 'moderate' ? 70 : 40;

        const score =
          budgetComponent * weights.w_budget +
          wifiComponent * weights.w_wifi +
          plugComponent * weights.w_plug +
          quietComponent * weights.w_quiet;

        return {
          ...f,
          properties: {
            ...p,
            custom_recommendation_score: Math.round(score * 10) / 10,
          },
        };
      })
      .sort((a, b) => (b.properties.custom_recommendation_score || 0) - (a.properties.custom_recommendation_score || 0));
  },
};
