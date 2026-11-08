<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FacilityReport;
use App\Models\Place;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReportController extends Controller
{
    /**
     * Submit a facility report / ticket from public users
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cafeName' => 'nullable|string',
            'cafe_name' => 'nullable|string',
            'place_id' => 'nullable|integer',
            'category' => 'nullable|string',
            'reportedBy' => 'nullable|string',
            'reported_by' => 'nullable|string',
            'description' => 'required|string',
            'priority' => 'nullable|string|in:high,medium,suggestion,low',
            'location' => 'nullable|string',
            'time_option' => 'nullable|string',
            'evidence_colokan' => 'nullable|string',
            'evidence_speedtest' => 'nullable|string',
            'evidence_menu' => 'nullable|string',
            'photoColokan' => 'nullable|string',
            'photoSpeedtest' => 'nullable|string',
            'photoMenu' => 'nullable|string',
        ]);

        $cafeName = $validated['cafe_name'] ?? $validated['cafeName'] ?? 'Kafe di Bogor';
        $reportedBy = $validated['reported_by'] ?? $validated['reportedBy'] ?? 'Mahasiswa (Anonim)';
        $ticketCode = 'TK-' . rand(800, 999);

        // If place_id not provided, try to find place by cafe name
        $placeId = $validated['place_id'] ?? null;
        if (!$placeId && $cafeName) {
            $matchedPlace = Place::where('name', 'LIKE', "%{$cafeName}%")->first();
            if ($matchedPlace) {
                $placeId = $matchedPlace->id;
            }
        }

        $report = FacilityReport::create([
            'ticket_code' => $ticketCode,
            'place_id' => $placeId,
            'cafe_name' => $cafeName,
            'location' => $validated['location'] ?? 'Kota Bogor',
            'category' => $validated['category'] ?? 'Laporan Fasilitas',
            'reported_by' => $reportedBy,
            'description' => $validated['description'],
            'priority' => $validated['priority'] ?? 'medium',
            'status' => 'open',
            'is_unread' => true,
            'time_option' => $validated['time_option'] ?? null,
            'evidence_colokan' => $validated['evidence_colokan'] ?? $validated['photoColokan'] ?? null,
            'evidence_speedtest' => $validated['evidence_speedtest'] ?? $validated['photoSpeedtest'] ?? null,
            'evidence_menu' => $validated['evidence_menu'] ?? $validated['photoMenu'] ?? null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan kendala fasilitas berhasil dikirim dan masuk ke antrean kurasi.',
            'data' => [
                'id' => $report->id,
                'ticket_code' => $report->ticket_code,
                'cafe_name' => $report->cafe_name,
                'status' => $report->status,
                'created_at' => $report->created_at->toIso8601String(),
            ],
        ], 201);
    }
}
