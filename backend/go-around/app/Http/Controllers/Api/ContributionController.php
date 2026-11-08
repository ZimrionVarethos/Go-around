<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contribution;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContributionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'subdistrict' => 'required|string|max:100',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'price_min_drink' => 'nullable|integer|min:0',
            'wifi_speed_mbps' => 'nullable|integer|min:0',
            'plug_availability' => 'nullable|in:none,limited,moderate,abundant',
            'noise_level' => 'nullable|in:quiet,moderate,lively',
            'is_24_hours' => 'nullable|boolean',
            'notes' => 'nullable|string|max:1000',
            'submitter_name' => 'nullable|string|max:100',
            'submitter_email' => 'nullable|email|max:150',
            'image_url' => 'nullable|string',
            'category_name' => 'nullable|string',
            'evidence_photos' => 'nullable|string',
        ]);

        $code = 'KF-' . str_pad((string) (\App\Models\Place::max('id') + 1), 3, '0', STR_PAD_LEFT);

        $contribution = Contribution::create([
            ...$validated,
            'code' => $code,
            'status' => 'pending',
        ]);

        // Also create a pending place in places table so admin can review and verify it
        \App\Models\Place::create([
            'code' => $code,
            'name' => $contribution->name,
            'slug' => \Illuminate\Support\Str::slug($contribution->name) . '-' . rand(100, 999),
            'address' => $contribution->address,
            'subdistrict' => $contribution->subdistrict,
            'latitude' => $contribution->latitude,
            'longitude' => $contribution->longitude,
            'price_min_drink' => $contribution->price_min_drink ?? 15000,
            'price_max_drink' => ($contribution->price_min_drink ?? 15000) + 15000,
            'price_tier' => ($contribution->price_min_drink ?? 15000) > 25000 ? 2 : 1,
            'wifi_speed_mbps' => $contribution->wifi_speed_mbps ?? 45,
            'plug_availability' => $contribution->plug_availability ?? 'moderate',
            'noise_level' => $contribution->noise_level ?? 'moderate',
            'is_24_hours' => (bool) $contribution->is_24_hours,
            'nugas_score' => 88.0,
            'image_url' => $contribution->image_url,
            'description' => $contribution->notes,
            'status' => 'pending',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Terima kasih! Kontribusi tempat nugas baru berhasil dikirim dan akan diverifikasi oleh tim Go Around.',
            'data' => [
                'id' => $contribution->id,
                'name' => $contribution->name,
                'status' => $contribution->status,
                'created_at' => $contribution->created_at->toIso8601String(),
            ],
        ], 201);
    }
}
