<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Place;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    /**
     * Compute multi-criteria weighted spatial recommendations
     */
    public function recommend(Request $request): JsonResponse
    {
        $payload = $request->all();

        $lat = $payload['location']['latitude'] ?? null;
        $lng = $payload['location']['longitude'] ?? null;
        $radiusKm = (float) ($payload['radius_km'] ?? 10.0);
        $maxPrice = isset($payload['max_price']) ? (int) $payload['max_price'] : null;
        $preset = $payload['preset'] ?? 'balanced';
        $mustHave = (array) ($payload['must_have'] ?? []);
        $weights = (array) ($payload['weights'] ?? []);
        $openNow = (bool) ($payload['open_now'] ?? false);
        $sortBy = $payload['sort_by'] ?? 'match';
        $searchQuery = $payload['search_query'] ?? null;
        $limit = (int) ($payload['limit'] ?? 10);

        // Standard weights
        $wDistance = (float) ($weights['distance'] ?? 0.20);
        $wRating   = (float) ($weights['rating'] ?? 0.20);
        $wPrice    = (float) ($weights['price'] ?? 0.20);
        $wWifi     = (float) ($weights['wifi'] ?? 0.20);
        $wPlug     = (float) ($weights['plug'] ?? 0.10);
        $wQuiet    = (float) ($weights['quiet'] ?? 0.10);

        // Normalize weights sum
        $totalWeight = $wDistance + $wRating + $wPrice + $wWifi + $wPlug + $wQuiet;
        if ($totalWeight > 0) {
            $wDistance /= $totalWeight;
            $wRating /= $totalWeight;
            $wPrice /= $totalWeight;
            $wWifi /= $totalWeight;
            $wPlug /= $totalWeight;
            $wQuiet /= $totalWeight;
        }

        $query = Place::with(['category', 'amenities'])->where('status', 'active');

        if ($searchQuery) {
            $kw = "%{$searchQuery}%";
            $query->where(function ($q) use ($kw) {
                $q->where('name', 'LIKE', $kw)
                  ->orWhere('address', 'LIKE', $kw)
                  ->orWhere('vibe_tags', 'LIKE', $kw)
                  ->orWhere('subdistrict', 'LIKE', $kw);
            });
        }

        if ($maxPrice) {
            $query->where('price_min_drink', '<=', $maxPrice);
        }

        if ($openNow) {
            $currentTime = now('Asia/Jakarta')->format('H:i:s');
            $query->where(function ($q) use ($currentTime) {
                $q->where('is_24_hours', true)
                  ->orWhere(function ($sub) use ($currentTime) {
                      $sub->where('open_time', '<=', $currentTime)
                          ->where('close_time', '>=', $currentTime);
                  });
            });
        }

        $places = $query->get();

        // Filter must-have amenities
        if (!empty($mustHave)) {
            $places = $places->filter(function (Place $place) use ($mustHave) {
                $amenitySlugs = $place->amenities->pluck('slug')->toArray();
                foreach ($mustHave as $req) {
                    if ($req === 'plug' && in_array($place->plug_availability, ['none', 'limited'])) {
                        return false;
                    }
                    if ($req === 'wifi' && $place->wifi_speed_mbps < 20) {
                        return false;
                    }
                    if ($req === 'student_discount' && !$place->has_student_discount) {
                        return false;
                    }
                    if ($req === 'musholla' && !in_array('musholla', $amenitySlugs)) {
                        return false;
                    }
                    if ($req === 'air_conditioning' && !in_array('ac-room', $amenitySlugs) && !in_array('air_conditioning', $amenitySlugs)) {
                        return false;
                    }
                    if ($req === 'parking' && !in_array('parkir-motor-luas', $amenitySlugs) && !in_array('parking', $amenitySlugs)) {
                        return false;
                    }
                }
                return true;
            });
        }

        // Scoring
        $currentTime = now('Asia/Jakarta')->format('H:i:s');
        $scored = $places->map(function (Place $place) use ($lat, $lng, $radiusKm, $wDistance, $wRating, $wPrice, $wWifi, $wPlug, $wQuiet, $currentTime) {
            // Distance
            $distKm = null;
            $distScore = 70.0;
            if ($lat !== null && $lng !== null) {
                $dLat = deg2rad($place->latitude - $lat);
                $dLng = deg2rad($place->longitude - $lng);
                $a = sin($dLat / 2) * sin($dLat / 2) +
                     cos(deg2rad($lat)) * cos(deg2rad($place->latitude)) *
                     sin($dLng / 2) * sin($dLng / 2);
                $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
                $distKm = round(6371 * $c, 2);

                // Score: closer is better (100 at 0km, 50 at 10km)
                $distScore = max(10, min(100, 100 - ($distKm * 5)));
            }

            // Rating score (0 - 100)
            $ratingScore = min(100, ($place->google_rating / 5.0) * 100);

            // Price score (cheaper min drink -> higher score)
            // 10,000 = 100, 40,000 = 40
            $priceScore = max(10, min(100, 100 - (($place->price_min_drink - 10000) / 300)));

            // Wifi score
            $wifiScore = min(100, max(20, ($place->wifi_speed_mbps / 80) * 100));

            // Plug score
            $plugScore = match($place->plug_availability) {
                'abundant' => 100,
                'moderate' => 75,
                'limited' => 45,
                default => 15,
            };

            // Quiet score
            $quietScore = match($place->noise_level) {
                'quiet' => 100,
                'moderate' => 75,
                'lively' => 45,
                default => 60,
            };

            $totalScore = ($distScore * $wDistance)
                        + ($ratingScore * $wRating)
                        + ($priceScore * $wPrice)
                        + ($wifiScore * $wWifi)
                        + ($plugScore * $wPlug)
                        + ($quietScore * $wQuiet);

            // Is open now?
            $isOpenNow = false;
            if ($place->is_24_hours) {
                $isOpenNow = true;
            } elseif ($place->open_time && $place->close_time) {
                $isOpenNow = ($place->open_time <= $currentTime && $place->close_time >= $currentTime);
            }

            // Reasons & Warnings
            $reasons = [];
            if ($place->wifi_speed_mbps >= 50) {
                $reasons[] = "Wi-Fi kencang ({$place->wifi_speed_mbps} Mbps) stabil untuk tugas daring";
            }
            if ($place->plug_availability === 'abundant') {
                $reasons[] = "Banyak stopkontak listrik siap pakai";
            }
            if ($place->has_student_discount) {
                $reasons[] = "Tersedia promo/diskon khusus mahasiswa";
            }
            if ($place->price_min_drink <= 18000) {
                $reasons[] = "Harga ramah kantong mahasiswa (minuman mulai Rp " . number_format($place->price_min_drink, 0, ',', '.') . ")";
            }
            if ($place->noise_level === 'quiet') {
                $reasons[] = "Suasana kondusif & tenang untuk fokus belajar";
            }

            $warnings = [];
            if ($place->plug_availability === 'limited') {
                $warnings[] = "Colokan terbatas di jam sibuk";
            }
            if ($place->noise_level === 'lively') {
                $warnings[] = "Cukup ramai di sore/malam hari";
            }

            // Map amenities to frontend expected keys
            $mappedAmenities = [];
            if ($place->plug_availability === 'abundant' || $place->plug_availability === 'moderate') {
                $mappedAmenities[] = 'plug';
            }
            if ($place->wifi_speed_mbps >= 20) {
                $mappedAmenities[] = 'wifi';
            }
            if ($place->has_student_discount) {
                $mappedAmenities[] = 'student_discount';
            }
            foreach ($place->amenities as $am) {
                if (str_contains($am->slug, 'musholla')) $mappedAmenities[] = 'musholla';
                if (str_contains($am->slug, 'ac') || str_contains($am->slug, 'air')) $mappedAmenities[] = 'air_conditioning';
                if (str_contains($am->slug, 'parkir') || str_contains($am->slug, 'parking')) $mappedAmenities[] = 'parking';
            }

            return [
                'id' => $place->id,
                'slug' => $place->slug,
                'name' => $place->name,
                'address' => $place->address,
                'subdistrict' => $place->subdistrict,
                'latitude' => (float) $place->latitude,
                'longitude' => (float) $place->longitude,
                'google_maps_url' => $place->google_maps_url,
                'recommendation_score' => round($totalScore, 1),
                'data_confidence' => 92,
                'distance_km' => $distKm,
                'google_rating' => (float) $place->google_rating,
                'total_google_reviews' => (int) $place->total_google_reviews,
                'price_min_drink' => $place->price_min_drink,
                'price_max_drink' => $place->price_max_drink,
                'wifi_speed_mbps' => $place->wifi_speed_mbps,
                'wifi_quality' => $place->wifi_quality,
                'plug_availability' => $place->plug_availability,
                'noise_level' => $place->noise_level,
                'amenities' => array_values(array_unique($mappedAmenities)),
                'image_url' => $place->image_url,
                'is_open_now' => $isOpenNow,
                'is_24_hours' => (bool) $place->is_24_hours,
                'open_time' => $place->open_time,
                'close_time' => $place->close_time,
                'last_verified_at' => $place->updated_at?->toIso8601String(),
                'score_breakdown' => [
                    'distance' => round($distScore, 1),
                    'rating' => round($ratingScore, 1),
                    'price' => round($priceScore, 1),
                    'wifi' => round($wifiScore, 1),
                    'plug' => round($plugScore, 1),
                    'quiet' => round($quietScore, 1),
                ],
                'reasons' => $reasons,
                'warnings' => $warnings,
            ];
        });

        // Filter radius if provided
        if ($lat !== null && $lng !== null && $radiusKm > 0) {
            $scored = $scored->filter(fn ($p) => $p['distance_km'] === null || $p['distance_km'] <= $radiusKm);
        }

        // Sort
        if ($sortBy === 'distance') {
            $sorted = $scored->sortBy(fn ($p) => $p['distance_km'] ?? 999);
        } elseif ($sortBy === 'price') {
            $sorted = $scored->sortBy('price_min_drink');
        } else {
            $sorted = $scored->sortByDesc('recommendation_score');
        }

        $results = $sorted->values()->take($limit);

        return response()->json([
            'status' => 'success',
            'data' => $results,
            'meta' => [
                'total' => count($results),
                'generated_at' => now()->toIso8601String(),
                'source' => 'api',
            ],
        ]);
    }

    /**
     * Search suggestions for auto-complete
     */
    public function suggestions(Request $request): JsonResponse
    {
        $query = $request->input('query', '');
        $limit = (int) $request->input('limit', 5);

        $presets = [
            ['id' => 'fast-wifi', 'label' => 'WiFi Cepat > 50 Mbps', 'query' => 'wifi cepat', 'preset' => 'study'],
            ['id' => 'many-plugs', 'label' => 'Banyak Colokan Listrik', 'query' => 'banyak colokan', 'preset' => 'study'],
            ['id' => 'quiet-study', 'label' => 'Tempat Tenang untuk Skripsi', 'query' => 'tenang', 'preset' => 'quiet'],
            ['id' => 'budget-friendly', 'label' => 'Kopi Hemat Ramah Mahasiswa (< 20rb)', 'query' => 'kopi murah', 'preset' => 'budget'],
            ['id' => 'open-24h', 'label' => 'Buka 24 Jam', 'query' => '24 jam', 'preset' => 'balanced'],
        ];

        $filtered = array_values(array_filter($presets, function ($item) use ($query) {
            if (!$query) return true;
            return str_contains(strtolower($item['label']), strtolower($query)) ||
                   str_contains(strtolower($item['query']), strtolower($query));
        }));

        return response()->json([
            'data' => array_slice($filtered, 0, $limit),
            'meta' => [
                'source' => 'api',
                'query' => $query,
            ],
        ]);
    }
}
