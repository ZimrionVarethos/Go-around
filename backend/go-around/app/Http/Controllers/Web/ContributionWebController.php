<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Contribution;
use App\Models\Place;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

class ContributionWebController extends Controller
{
    /**
     * Show Tambah Tempat form
     */
    public function create(): View
    {
        $categories = Category::all();
        $subdistricts = [
            'Bogor Tengah',
            'Bogor Timur',
            'Bogor Utara',
            'Bogor Selatan',
            'Bogor Barat',
            'Tanah Sareal',
        ];

        return view('contributions.create', compact('categories', 'subdistricts'));
    }

    /**
     * Handle submission of new place contribution
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string',
            'address' => 'required|string',
            'subdistrict' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'price_min_drink' => 'nullable|numeric',
            'wifi_download' => 'nullable|numeric',
            'plug_availability' => 'nullable|string',
            'noise_level' => 'nullable|string',
            'is_24_hours' => 'nullable|boolean',
            'amenities' => 'nullable|array',
            'notes' => 'nullable|string',
            'image_url' => 'nullable|string',
            'photo_evidence' => 'nullable|string',
            'submitter_email' => 'nullable|string',
        ]);

        $code = 'KF-' . str_pad((string) (Place::max('id') + 1), 3, '0', STR_PAD_LEFT);

        $contribution = Contribution::create([
            'code' => $code,
            'name' => $validated['name'],
            'address' => $validated['address'],
            'subdistrict' => $validated['subdistrict'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'price_min_drink' => $validated['price_min_drink'] ?? 18000,
            'wifi_speed_mbps' => $validated['wifi_download'] ?? 50,
            'plug_availability' => $validated['plug_availability'] ?? 'moderate',
            'noise_level' => $validated['noise_level'] ?? 'moderate',
            'is_24_hours' => (bool) ($validated['is_24_hours'] ?? false),
            'notes' => $validated['notes'] ?? null,
            'submitter_name' => 'Mahasiswa / Kontributor Anonim',
            'submitter_email' => $validated['submitter_email'] ?? null,
            'image_url' => $validated['image_url'] ?? $validated['photo_evidence'] ?? null,
            'status' => 'pending',
        ]);

        // Create pending place in places table so it appears in admin review
        Place::create([
            'code' => $code,
            'name' => $contribution->name,
            'slug' => Str::slug($contribution->name) . '-' . rand(100, 999),
            'address' => $contribution->address,
            'subdistrict' => $contribution->subdistrict,
            'latitude' => $contribution->latitude,
            'longitude' => $contribution->longitude,
            'price_min_drink' => $contribution->price_min_drink,
            'price_max_drink' => $contribution->price_min_drink + 15000,
            'price_tier' => $contribution->price_min_drink > 25000 ? 2 : 1,
            'wifi_speed_mbps' => $contribution->wifi_speed_mbps,
            'plug_availability' => $contribution->plug_availability,
            'noise_level' => $contribution->noise_level,
            'is_24_hours' => $contribution->is_24_hours,
            'nugas_score' => 88.0,
            'image_url' => $contribution->image_url ?: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
            'description' => $contribution->notes,
            'status' => 'pending',
        ]);

        return redirect()->route('contributions.create')
            ->with('success_contribution', [
                'name' => $validated['name'],
                'code' => $code,
            ]);
    }
}
