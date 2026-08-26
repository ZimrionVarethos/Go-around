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
        ]);

        $contribution = Contribution::create([
            ...$validated,
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
