<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Amenity;
use App\Models\Category;
use App\Models\Place;
use Illuminate\Http\Request;
use Illuminate\View\View;

class HomeController extends Controller
{
    /**
     * Display the interactive WebGIS Homepage
     */
    public function index(Request $request): View
    {
        $categories = Category::all();
        $amenities = Amenity::all();
        $subdistricts = Place::where('status', 'active')
            ->select('subdistrict')
            ->distinct()
            ->orderBy('subdistrict')
            ->pluck('subdistrict');

        $query = Place::with(['category', 'amenities', 'reviews'])
            ->where('status', 'active');

        if ($request->filled('search')) {
            $kw = "%{$request->search}%";
            $query->where(function ($q) use ($kw) {
                $q->where('name', 'LIKE', $kw)
                  ->orWhere('address', 'LIKE', $kw)
                  ->orWhere('vibe_tags', 'LIKE', $kw);
            });
        }

        if ($request->filled('subdistrict')) {
            $query->where('subdistrict', $request->subdistrict);
        }

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->category));
        }

        if ($request->boolean('is_24_hours')) {
            $query->where('is_24_hours', true);
        }

        if ($request->boolean('has_student_discount')) {
            $query->where('has_student_discount', true);
        }

        $places = $query->orderByDesc('nugas_score')->get();

        // Convert places to JSON safe array for client Leaflet & Alpine.js
        $placesJson = $places->map(function ($p) {
            return [
                'id' => $p->id,
                'code' => $p->code ?: 'KF-' . str_pad((string)$p->id, 3, '0', STR_PAD_LEFT),
                'name' => $p->name,
                'slug' => $p->slug,
                'address' => $p->address,
                'subdistrict' => $p->subdistrict,
                'latitude' => (float) $p->latitude,
                'longitude' => (float) $p->longitude,
                'price_min_drink' => $p->price_min_drink,
                'price_max_drink' => $p->price_max_drink,
                'wifi_speed_mbps' => $p->wifi_speed_mbps,
                'wifi_quality' => $p->wifi_quality,
                'plug_availability' => $p->plug_availability,
                'noise_level' => $p->noise_level,
                'is_24_hours' => (bool) $p->is_24_hours,
                'open_time' => $p->open_time,
                'close_time' => $p->close_time,
                'google_rating' => (float) $p->google_rating,
                'total_google_reviews' => (int) $p->total_google_reviews,
                'nugas_score' => (float) $p->nugas_score,
                'budget_score' => (float) $p->budget_score,
                'facility_score' => (float) $p->facility_score,
                'image_url' => $p->image_url ?: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
                'description' => $p->description,
                'vibe_tags' => $p->vibe_tags ? array_map('trim', explode(',', $p->vibe_tags)) : [],
                'google_maps_url' => $p->google_maps_url ?: "https://www.google.com/maps/search/?api=1&query={$p->latitude},{$p->longitude}",
                'instagram_handle' => $p->instagram_handle,
                'category' => $p->category ? [
                    'name' => $p->category->name,
                    'slug' => $p->category->slug,
                    'icon' => $p->category->icon,
                ] : null,
                'amenities' => $p->amenities->map(fn ($a) => [
                    'name' => $a->name,
                    'slug' => $a->slug,
                    'icon' => $a->icon,
                ]),
                'reviews' => $p->reviews->map(fn ($r) => [
                    'reviewer_name' => $r->reviewer_name,
                    'rating' => (float) $r->rating,
                    'comment' => $r->comment,
                    'sentiment' => $r->sentiment,
                ]),
            ];
        });

        return view('home', compact('categories', 'amenities', 'subdistricts', 'places', 'placesJson'));
    }

    /**
     * Tentang Riset Page
     */
    public function about(): View
    {
        return view('about');
    }
}
