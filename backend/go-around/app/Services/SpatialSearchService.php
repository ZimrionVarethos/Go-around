<?php

namespace App\Services;

use App\Models\Place;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class SpatialSearchService
{
    /**
     * Kota Bogor center coordinates and bounding boundary
     */
    public const BOGOR_CENTER_LAT = -6.595038;
    public const BOGOR_CENTER_LNG = 106.790082;
    public const DEFAULT_RADIUS_KM = 10.0;

    /**
     * Apply multi-criteria student filters to a Place query
     */
    public function applyFilters(Builder $query, Request $request): Builder
    {
        $query->active()->with(['category', 'amenities']);

        // Filter by Subdistricts in Kota Bogor
        if ($request->filled('subdistrict')) {
            $subdistricts = is_array($request->subdistrict) 
                ? $request->subdistrict 
                : explode(',', $request->subdistrict);
            $query->whereIn('subdistrict', $subdistricts);
        }

        // Filter by Category Slug
        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter by Price Tier (1: Budget, 2: Standard, 3: Coworking)
        if ($request->filled('price_tier')) {
            $tiers = is_array($request->price_tier) 
                ? $request->price_tier 
                : explode(',', $request->price_tier);
            $query->whereIn('price_tier', $tiers);
        }

        // Max Drink Price (Ramah Kantong)
        if ($request->filled('max_price')) {
            $query->where('price_min_drink', '<=', (int) $request->max_price);
        }

        // Minimum Wi-Fi Speed (Mbps)
        if ($request->filled('min_wifi')) {
            $query->where('wifi_speed_mbps', '>=', (int) $request->min_wifi);
        }

        // Plug Availability (abundant, moderate, limited)
        if ($request->filled('plug_availability')) {
            $plugs = is_array($request->plug_availability)
                ? $request->plug_availability
                : explode(',', $request->plug_availability);
            $query->whereIn('plug_availability', $plugs);
        }

        // Noise Level (quiet, moderate, lively)
        if ($request->filled('noise_level')) {
            $noiseLevels = is_array($request->noise_level)
                ? $request->noise_level
                : explode(',', $request->noise_level);
            $query->whereIn('noise_level', $noiseLevels);
        }

        // 24 Hours filter
        if ($request->boolean('is_24_hours')) {
            $query->where('is_24_hours', true);
        }

        // Student Discount filter
        if ($request->boolean('has_student_discount')) {
            $query->where('has_student_discount', true);
        }

        // Minimum Nugas Score (0 - 100)
        if ($request->filled('min_nugas_score')) {
            $query->where('nugas_score', '>=', (float) $request->min_nugas_score);
        }

        // Filter by Specific Amenities (e.g. ['musholla', 'ac-room'])
        if ($request->filled('amenities')) {
            $amenitySlugs = is_array($request->amenities)
                ? $request->amenities
                : explode(',', $request->amenities);

            foreach ($amenitySlugs as $slug) {
                $query->whereHas('amenities', function ($q) use ($slug) {
                    $q->where('slug', trim($slug));
                });
            }
        }

        // Search by keyword in name / address / vibe tags
        if ($request->filled('search')) {
            $keyword = '%' . $request->search . '%';
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'LIKE', $keyword)
                  ->orWhere('address', 'LIKE', $keyword)
                  ->orWhere('vibe_tags', 'LIKE', $keyword);
            });
        }

        return $query;
    }

    /**
     * Search within a map viewport bounding box
     */
    public function searchInBoundingBox(Request $request): Collection
    {
        $north = (float) $request->input('north', -6.500);
        $south = (float) $request->input('south', -6.680);
        $east  = (float) $request->input('east', 106.860);
        $west  = (float) $request->input('west', 106.720);

        $query = Place::query();
        $query = $this->applyFilters($query, $request);

        $query->inBoundingBox($north, $south, $east, $west);

        // Sorting
        $sortBy = $request->input('sort_by', 'nugas_score');
        $order = $request->input('order', 'desc');

        if (in_array($sortBy, ['nugas_score', 'budget_score', 'facility_score', 'price_min_drink', 'wifi_speed_mbps', 'google_rating'])) {
            $query->orderBy($sortBy, $order);
        }

        return $query->limit($request->input('limit', 100))->get();
    }

    /**
     * Search places near a specific coordinate (radius)
     */
    public function searchNearby(Request $request): Collection
    {
        $lat = (float) $request->input('lat', self::BOGOR_CENTER_LAT);
        $lng = (float) $request->input('lng', self::BOGOR_CENTER_LNG);
        $radiusKm = (float) $request->input('radius_km', self::DEFAULT_RADIUS_KM);

        $query = Place::query();
        $query = $this->applyFilters($query, $request);

        $query->nearby($lat, $lng, $radiusKm);

        return $query->limit($request->input('limit', 50))->get();
    }

    /**
     * Generate personalized smart recommendation based on student weights
     */
    public function getRecommendations(Request $request): Collection
    {
        // Custom weights (Default equal 0.25 each if not specified)
        $weightBudget   = (float) $request->input('w_budget', 0.35);   // Priority for cheap price
        $weightWifi     = (float) $request->input('w_wifi', 0.25);     // Priority for fast internet
        $weightPlug     = (float) $request->input('w_plug', 0.25);     // Priority for abundant plugs
        $weightQuiet    = (float) $request->input('w_quiet', 0.15);    // Priority for quiet atmosphere

        $lat = $request->filled('lat') ? (float) $request->lat : null;
        $lng = $request->filled('lng') ? (float) $request->lng : null;

        $query = Place::query();
        $query = $this->applyFilters($query, $request);

        if ($lat !== null && $lng !== null) {
            $haversine = '(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude))))';
            $query->select('places.*')->selectRaw("{$haversine} AS distance_km", [$lat, $lng, $lat]);
        }

        $places = $query->get();

        // Calculate dynamic personalized score
        $scored = $places->map(function (Place $place) use ($weightBudget, $weightWifi, $weightPlug, $weightQuiet, $lat) {
            // Budget Score component (0 - 100)
            $budgetComponent = $place->budget_score;

            // Wifi Score component (0 - 100) -> 100mbps is 100 score
            $wifiComponent = min(100, ($place->wifi_speed_mbps / 100) * 100);

            // Plug Score component (0 - 100)
            $plugComponent = match($place->plug_availability) {
                'abundant' => 100,
                'moderate' => 70,
                'limited' => 35,
                default => 10,
            };

            // Quiet Score component (0 - 100)
            $quietComponent = match($place->noise_level) {
                'quiet' => 100,
                'moderate' => 70,
                'lively' => 40,
                default => 60,
            };

            // Total custom score (0 - 100)
            $customScore = ($budgetComponent * $weightBudget) 
                         + ($wifiComponent * $weightWifi) 
                         + ($plugComponent * $weightPlug) 
                         + ($quietComponent * $weightQuiet);

            // Distance penalty factor if lat/lng is provided
            if (isset($place->distance_km) && $place->distance_km > 0) {
                // Decay factor: gently deduct if further than 5km
                $distanceDecay = max(0.6, 1.0 - ($place->distance_km * 0.04));
                $customScore *= $distanceDecay;
            }

            $place->custom_recommendation_score = round($customScore, 1);
            return $place;
        });

        return $scored->sortByDesc('custom_recommendation_score')->values()->take((int) $request->input('limit', 20));
    }

    /**
     * Format a collection into a standard RFC 7946 GeoJSON FeatureCollection array
     */
    public function toGeoJsonFeatureCollection(Collection $places): array
    {
        $features = $places->map(function (Place $place) {
            return (new \App\Http\Resources\PlaceGeoJsonResource($place))->toArray(request());
        })->toArray();

        return [
            'type' => 'FeatureCollection',
            'metadata' => [
                'count' => count($features),
                'city' => 'Kota Bogor',
                'generated_at' => now()->toIso8601String(),
            ],
            'features' => $features,
        ];
    }
}
