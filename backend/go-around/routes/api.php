<?php

use App\Http\Controllers\Api\AmenityController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContributionController;
use App\Http\Controllers\Api\PlaceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Go Around WebGIS API Routes (Kota Bogor)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // API Root Overview
    Route::get('/', function () {
        return response()->json([
            'status' => 'online',
            'app' => 'Go Around - WebGIS Tempat Nugas Ramah Mahasiswa Kota Bogor',
            'version' => '1.0.0',
            'endpoints' => [
                'places' => url('/api/v1/places'),
                'categories' => url('/api/v1/categories'),
                'amenities' => url('/api/v1/amenities'),
                'health' => url('/api/v1/health'),
            ],
            'timestamp' => now()->toIso8601String(),
        ]);
    });

    // Health Check
    Route::get('/health', function () {
        return response()->json([
            'status' => 'healthy',
            'app' => 'Go Around - WebGIS Nugas Ramah Kantong Mahasiswa (Kota Bogor)',
            'version' => '1.0.0',
            'timestamp' => now()->toIso8601String(),
        ]);
    });

    // WebGIS Places Endpoints
    Route::prefix('places')->group(function () {
        Route::get('/', [PlaceController::class, 'index']);
        Route::get('/bbox', [PlaceController::class, 'bbox']);
        Route::get('/nearby', [PlaceController::class, 'nearby']);
        Route::get('/recommend', [PlaceController::class, 'recommend']);
        Route::get('/subdistricts', [PlaceController::class, 'subdistricts']);
        Route::get('/{idOrSlug}', [PlaceController::class, 'show']);
    });

    // Metadata Filters
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/amenities', [AmenityController::class, 'index']);

    // Crowdsource Contribution
    Route::post('/contributions', [ContributionController::class, 'store']);
});
