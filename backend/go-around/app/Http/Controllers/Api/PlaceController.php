<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PlaceDetailResource;
use App\Http\Resources\PlaceGeoJsonResource;
use App\Models\Place;
use App\Services\SpatialSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlaceController extends Controller
{
    public function __construct(
        protected SpatialSearchService $spatialService
    ) {}

    /**
     * List places with multi-criteria filters & pagination
     */
    public function index(Request $request): JsonResponse
    {
        $query = Place::query();
        $query = $this->spatialService->applyFilters($query, $request);

        $sortBy = $request->input('sort_by', 'nugas_score');
        $order = $request->input('order', 'desc');

        if (in_array($sortBy, ['nugas_score', 'budget_score', 'facility_score', 'price_min_drink', 'wifi_speed_mbps', 'google_rating', 'name'])) {
            $query->orderBy($sortBy, $order);
        }

        $perPage = (int) $request->input('per_page', 15);
        $places = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $places->items(),
            'pagination' => [
                'total' => $places->total(),
                'per_page' => $places->perPage(),
                'current_page' => $places->currentPage(),
                'last_page' => $places->lastPage(),
            ],
        ]);
    }

    /**
     * Map Viewport BBox search returning standard GeoJSON FeatureCollection
     */
    public function bbox(Request $request): JsonResponse
    {
        $places = $this->spatialService->searchInBoundingBox($request);
        $geoJson = $this->spatialService->toGeoJsonFeatureCollection($places);

        return response()->json($geoJson);
    }

    /**
     * Radius Nearby Search (Haversine)
     */
    public function nearby(Request $request): JsonResponse
    {
        $request->validate([
            'lat' => 'nullable|numeric|between:-90,90',
            'lng' => 'nullable|numeric|between:-180,180',
            'radius_km' => 'nullable|numeric|min:0.5|max:50',
        ]);

        $places = $this->spatialService->searchNearby($request);
        $geoJson = $this->spatialService->toGeoJsonFeatureCollection($places);

        return response()->json($geoJson);
    }

    /**
     * Personalized Recommendation Ranking
     */
    public function recommend(Request $request): JsonResponse
    {
        $places = $this->spatialService->getRecommendations($request);

        return response()->json([
            'status' => 'success',
            'message' => 'Rekomendasi tempat nugas teratas di Kota Bogor berdasarkan preferensi Anda',
            'data' => PlaceGeoJsonResource::collection($places),
        ]);
    }

    /**
     * Place Detail Page View
     */
    public function show(string $idOrSlug): JsonResponse
    {
        $place = Place::with(['category', 'amenities', 'reviews'])
            ->where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => new PlaceDetailResource($place),
        ]);
    }

    /**
     * List all distinct subdistricts in Kota Bogor with places count
     */
    public function subdistricts(): JsonResponse
    {
        $subdistricts = Place::active()
            ->selectRaw('subdistrict, COUNT(*) as count')
            ->groupBy('subdistrict')
            ->orderBy('subdistrict')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $subdistricts,
        ]);
    }
}
