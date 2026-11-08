<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\FacilityReport;
use App\Models\Place;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ReportWebController extends Controller
{
    /**
     * Show Lapor & Koreksi Fasilitas form
     */
    public function create(): View
    {
        $places = Place::where('status', 'active')
            ->select('id', 'name', 'address', 'subdistrict', 'latitude', 'longitude', 'image_url')
            ->get();

        return view('reports.create', compact('places'));
    }

    /**
     * Handle submission of Lapor Fasilitas form
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'place_id' => 'nullable|integer',
            'cafe_name' => 'required|string',
            'location' => 'nullable|string',
            'category' => 'required|string',
            'description' => 'required|string',
            'time_option' => 'nullable|string',
            'contact_info' => 'nullable|string',
            'photo_colokan' => 'nullable|string',
            'photo_speedtest' => 'nullable|string',
            'photo_menu' => 'nullable|string',
        ]);

        $ticketCode = 'TK-' . rand(800, 999);
        $placeId = $validated['place_id'] ?? null;
        if (!$placeId && !empty($validated['cafe_name'])) {
            $p = Place::where('name', 'LIKE', "%{$validated['cafe_name']}%")->first();
            if ($p) $placeId = $p->id;
        }

        $priority = str_contains($validated['category'], 'colokan_rusak') ? 'high' : 'medium';

        FacilityReport::create([
            'ticket_code' => $ticketCode,
            'place_id' => $placeId,
            'cafe_name' => $validated['cafe_name'],
            'location' => $validated['location'] ?: 'Kota Bogor',
            'category' => $validated['category'],
            'reported_by' => $validated['contact_info'] ?: 'Mahasiswa (Anonim)',
            'description' => $validated['description'],
            'priority' => $priority,
            'status' => 'open',
            'is_unread' => true,
            'time_option' => $validated['time_option'] ?? null,
            'evidence_colokan' => $validated['photo_colokan'] ?? null,
            'evidence_speedtest' => $validated['photo_speedtest'] ?? null,
            'evidence_menu' => $validated['photo_menu'] ?? null,
        ]);

        return redirect()->route('reports.create')
            ->with('success_ticket', [
                'ticket_code' => $ticketCode,
                'cafe_name' => $validated['cafe_name'],
            ]);
    }
}
