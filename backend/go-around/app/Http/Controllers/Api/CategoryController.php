<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::withCount(['places' => fn ($q) => $q->active()])->get();

        return response()->json([
            'status' => 'success',
            'data' => CategoryResource::collection($categories),
        ]);
    }
}
