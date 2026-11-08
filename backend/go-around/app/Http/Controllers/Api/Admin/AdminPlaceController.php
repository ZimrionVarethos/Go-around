<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Place;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminPlaceController extends Controller
{
    /**
     * Helper to transform a Place model into PlaceItem for Admin frontend
     */
    private function transformPlace(Place $place): array
    {
        $status = match($place->status) {
            'active' => 'verified',
            'pending' => 'review',
            'inactive' => 'rejected',
            'verified' => 'verified',
            'review' => 'review',
            'rejected' => 'rejected',
            default => 'verified',
        };

        $plugPercentage = match($place->plug_availability) {
            'abundant' => 95,
            'moderate' => 75,
            'limited' => 40,
            default => 20,
        };

        $acoustic = match($place->noise_level) {
            'quiet' => 'Tenang',
            'moderate' => 'Kondusif',
            'lively' => 'Ramai',
            default => 'Kondusif',
        };

        $priceCategory = match($place->price_tier) {
            1 => 'Ramah Mahasiswa',
            2 => 'Standar Kafe',
            3 => 'Premium / Coworking',
            default => 'Standar Kafe',
        };

        return [
            'id' => $place->id,
            'code' => $place->code ?: 'KF-' . str_pad((string)$place->id, 3, '0', STR_PAD_LEFT),
            'name' => $place->name,
            'address' => $place->address,
            'lat' => (float) $place->latitude,
            'lng' => (float) $place->longitude,
            'wifi' => (int) $place->wifi_speed_mbps,
            'plug' => $plugPercentage,
            'plugLabel' => match($place->plug_availability) {
                'abundant' => 'Hampir tiap meja',
                'moderate' => 'Banyak colokan',
                'limited' => 'Terbatas',
                default => 'Tidak ada',
            },
            'price' => 'Rp ' . number_format($place->price_min_drink, 0, ',', '.') . '+',
            'priceCategory' => $priceCategory,
            'acoustic' => $acoustic,
            'score' => round((float) ($place->nugas_score / 10), 1), // e.g. 9.4
            'status' => $status,
            'isUnread' => $status === 'review',
            'district' => $place->subdistrict,
            'is24Hours' => (bool) $place->is_24_hours,
            'imageUrl' => $place->image_url,
        ];
    }

    /**
     * List all places for Admin table with filters
     */
    public function index(Request $request): JsonResponse
    {
        $query = Place::query();

        if ($request->filled('search')) {
            $kw = "%{$request->search}%";
            $query->where(function ($q) use ($kw) {
                $q->where('name', 'LIKE', $kw)
                  ->orWhere('address', 'LIKE', $kw)
                  ->orWhere('code', 'LIKE', $kw)
                  ->orWhere('subdistrict', 'LIKE', $kw);
            });
        }

        if ($request->filled('district')) {
            $query->where('subdistrict', 'LIKE', "%{$request->district}%");
        }

        if ($request->filled('status')) {
            $status = $request->status;
            if ($status === 'verified') {
                $query->whereIn('status', ['active', 'verified']);
            } elseif ($status === 'review') {
                $query->whereIn('status', ['pending', 'review']);
            } elseif ($status === 'rejected') {
                $query->whereIn('status', ['inactive', 'rejected']);
            }
        }

        $places = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $places->map(fn ($p) => $this->transformPlace($p))->values(),
        ]);
    }

    /**
     * Create a new place from Admin
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'wifi' => 'nullable|integer',
            'plug' => 'nullable|integer',
            'price' => 'nullable|string',
            'score' => 'nullable|numeric',
            'status' => 'nullable|string',
            'district' => 'nullable|string',
            'is24Hours' => 'nullable|boolean',
            'imageUrl' => 'nullable|string',
        ]);

        $code = $request->code ?: 'KF-' . str_pad((string) (Place::max('id') + 1), 3, '0', STR_PAD_LEFT);
        $slug = Str::slug($validated['name']) . '-' . rand(100, 999);

        // Parse price
        $priceMin = 15000;
        if (!empty($validated['price'])) {
            $digits = preg_replace('/\D/', '', $validated['price']);
            if ($digits) $priceMin = (int) $digits;
        }

        $place = Place::create([
            'code' => $code,
            'name' => $validated['name'],
            'slug' => $slug,
            'address' => $validated['address'],
            'subdistrict' => $validated['district'] ?? 'Bogor Tengah',
            'latitude' => $validated['lat'] ?? -6.598,
            'longitude' => $validated['lng'] ?? 106.805,
            'price_min_drink' => $priceMin,
            'price_max_drink' => $priceMin + 15000,
            'price_tier' => $priceMin > 25000 ? 2 : 1,
            'wifi_speed_mbps' => $validated['wifi'] ?? 50,
            'plug_availability' => ($validated['plug'] ?? 75) > 80 ? 'abundant' : 'moderate',
            'noise_level' => 'moderate',
            'is_24_hours' => (bool) ($validated['is24Hours'] ?? false),
            'nugas_score' => ($validated['score'] ?? 9.0) * 10,
            'image_url' => $validated['imageUrl'] ?? null,
            'status' => $validated['status'] === 'review' ? 'pending' : 'active',
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $this->transformPlace($place),
        ], 201);
    }

    /**
     * Update an existing place
     */
    public function update(Request $request, $id): JsonResponse
    {
        $place = Place::findOrFail($id);

        if ($request->filled('name')) $place->name = $request->name;
        if ($request->filled('address')) $place->address = $request->address;
        if ($request->filled('lat')) $place->latitude = $request->lat;
        if ($request->filled('lng')) $place->longitude = $request->lng;
        if ($request->filled('wifi')) $place->wifi_speed_mbps = (int) $request->wifi;
        if ($request->filled('district')) $place->subdistrict = $request->district;
        if ($request->has('is24Hours')) $place->is_24_hours = (bool) $request->is24Hours;
        if ($request->filled('imageUrl')) $place->image_url = $request->imageUrl;
        if ($request->filled('score')) $place->nugas_score = $request->score * 10;

        if ($request->filled('status')) {
            $status = $request->status;
            $place->status = match($status) {
                'verified' => 'active',
                'review' => 'pending',
                'rejected' => 'inactive',
                default => $status,
            };
        }

        $place->save();

        return response()->json([
            'status' => 'success',
            'data' => $this->transformPlace($place),
        ]);
    }

    /**
     * Delete a place
     */
    public function destroy($id): JsonResponse
    {
        $place = Place::findOrFail($id);
        $place->delete();

        return response()->json([
            'success' => true,
            'id' => (int) $id,
        ]);
    }

    /**
     * Verify place
     */
    public function verify($id): JsonResponse
    {
        $place = Place::findOrFail($id);
        $place->status = 'active';
        $place->save();

        return response()->json([
            'success' => true,
            'status' => 'verified',
        ]);
    }

    /**
     * Reject place
     */
    public function reject($id): JsonResponse
    {
        $place = Place::findOrFail($id);
        $place->status = 'inactive';
        $place->save();

        return response()->json([
            'success' => true,
            'status' => 'rejected',
        ]);
    }
}
