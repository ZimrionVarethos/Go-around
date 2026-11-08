<?php

use App\Http\Controllers\Api\Admin\AdminAnalyticsController;
use App\Http\Controllers\Api\Admin\AdminPlaceController;
use App\Http\Controllers\Api\Admin\AdminTicketController;
use App\Http\Controllers\Api\AmenityController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContributionController;
use App\Http\Controllers\Api\PlaceController;
use App\Http\Controllers\Api\RecommendationController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Go Around WebGIS API Routes (Kota Bogor)
| Single Source of Truth for Frontend Integration
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
                'recommendations' => url('/api/v1/recommendations'),
                'reports' => url('/api/v1/reports'),
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

    // ─── WebGIS Public Places Endpoints ───
    Route::prefix('places')->group(function () {
        Route::get('/', [PlaceController::class, 'index']);
        Route::get('/bbox', [PlaceController::class, 'bbox']);
        Route::get('/nearby', [PlaceController::class, 'nearby']);
        Route::get('/recommend', [PlaceController::class, 'recommend']);
        Route::get('/subdistricts', [PlaceController::class, 'subdistricts']);
        Route::get('/{idOrSlug}', [PlaceController::class, 'show']);
    });

    // ─── Metadata Filters ───
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/amenities', [AmenityController::class, 'index']);

    // ─── Recommendations & Search Suggestions ───
    Route::post('/recommendations', [RecommendationController::class, 'recommend']);
    Route::get('/recommendations/suggestions', [RecommendationController::class, 'suggestions']);

    // ─── Crowdsource Contributions (Add & Recommend New Place) ───
    Route::post('/contributions', [ContributionController::class, 'store']);

    // ─── Public Facility Reports & Tickets ───
    Route::post('/reports', [ReportController::class, 'store']);
    Route::post('/tickets', [ReportController::class, 'store']);

    // ─── Admin Authentication & Profile ───
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // ─── Admin Management ───
    Route::prefix('admin')->group(function () {
        // Admin Profile Settings
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::put('/password', [AuthController::class, 'changePassword']);

        // Places Master GIS
        Route::get('/places', [AdminPlaceController::class, 'index']);
        Route::post('/places', [AdminPlaceController::class, 'store']);
        Route::put('/places/{id}', [AdminPlaceController::class, 'update']);
        Route::delete('/places/{id}', [AdminPlaceController::class, 'destroy']);
        Route::patch('/places/{id}/verify', [AdminPlaceController::class, 'verify']);
        Route::patch('/places/{id}/reject', [AdminPlaceController::class, 'reject']);

        // Facility Tickets & Reports
        Route::get('/tickets', [AdminTicketController::class, 'index']);
        Route::patch('/tickets/{id}/resolve', [AdminTicketController::class, 'resolve']);
        Route::patch('/tickets/{id}/dismiss', [AdminTicketController::class, 'dismiss']);

        // Analytics & GIS Export
        Route::get('/analytics/overview', [AdminAnalyticsController::class, 'overview']);
        Route::get('/export/geojson', [AdminAnalyticsController::class, 'exportGeoJson']);
    });
});
