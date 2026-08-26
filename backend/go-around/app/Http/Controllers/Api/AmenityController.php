<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AmenityResource;
use App\Models\Amenity;
use Illuminate\Http\JsonResponse;

class AmenityController extends Controller
{
    public function index(): JsonResponse
    {
        $amenities = Amenity::withCount(['places' => fn ($q) => $q->active()])->get();

        return response()->json([
            'status' => 'success',
            'data' => AmenityResource::collection($amenities),
        ]);
    }
}
