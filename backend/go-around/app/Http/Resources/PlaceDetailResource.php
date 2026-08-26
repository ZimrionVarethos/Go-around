<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlaceDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array for detail page view.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'category' => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'slug' => $this->category?->slug,
                'icon' => $this->category?->icon,
            ],
            'location' => [
                'address' => $this->address,
                'subdistrict' => $this->subdistrict,
                'latitude' => (float) $this->latitude,
                'longitude' => (float) $this->longitude,
                'google_maps_url' => $this->google_maps_url ?: "https://www.google.com/maps/search/?api=1&query={$this->latitude},{$this->longitude}",
                'navigation_url' => "https://www.google.com/maps/dir/?api=1&destination={$this->latitude},{$this->longitude}",
            ],
            'socials' => [
                'instagram' => $this->instagram_handle ? "https://instagram.com/" . ltrim($this->instagram_handle, '@') : null,
                'instagram_handle' => $this->instagram_handle,
            ],
            'economics' => [
                'price_min_drink' => $this->price_min_drink,
                'price_max_drink' => $this->price_max_drink,
                'price_avg_food' => $this->price_avg_food,
                'price_tier' => $this->price_tier,
                'price_tier_label' => match($this->price_tier) {
                    1 => 'Budget / Hemat (< 15rb)',
                    2 => 'Standar / Menengah (15rb - 28rb)',
                    3 => 'Premium / Coworking (> 30rb)',
                    default => 'Standar',
                },
                'parking_fee_motor' => $this->parking_fee_motor,
                'has_student_discount' => (bool) $this->has_student_discount,
            ],
            'nugas_metrics' => [
                'nugas_score' => (float) $this->nugas_score,
                'budget_score' => (float) $this->budget_score,
                'facility_score' => (float) $this->facility_score,
                'wifi_speed_mbps' => $this->wifi_speed_mbps,
                'wifi_quality' => $this->wifi_quality,
                'plug_availability' => $this->plug_availability,
                'noise_level' => $this->noise_level,
                'noise_label' => match($this->noise_level) {
                    'quiet' => 'Tenang & Hening (Ideal Skripsi / Deep Work)',
                    'moderate' => 'Sedang (Santai / Nugas Bareng)',
                    'lively' => 'Ramai / Hidup (Nongkrong & Diskusi)',
                    default => 'Sedang',
                },
                'plug_label' => match($this->plug_availability) {
                    'abundant' => 'Banyak (Hampir di setiap meja)',
                    'moderate' => 'Cukup (Tersedia di beberapa titik)',
                    'limited' => 'Terbatas (Harus rebutan)',
                    'none' => 'Tidak Ada',
                    default => 'Cukup',
                },
            ],
            'operational' => [
                'is_24_hours' => (bool) $this->is_24_hours,
                'open_time' => $this->open_time,
                'close_time' => $this->close_time,
                'formatted_hours' => $this->is_24_hours ? 'Buka 24 Jam' : ($this->open_time && $this->close_time ? "{$this->open_time} - {$this->close_time}" : 'Cek info'),
            ],
            'ratings' => [
                'google_rating' => (float) $this->google_rating,
                'total_google_reviews' => (int) $this->total_google_reviews,
            ],
            'media' => [
                'image_url' => $this->image_url,
                'vibe_tags' => $this->vibe_tags ? array_map('trim', explode(',', $this->vibe_tags)) : [],
            ],
            'amenities' => $this->amenities->map(fn ($a) => [
                'id' => $a->id,
                'name' => $a->name,
                'slug' => $a->slug,
                'icon' => $a->icon,
                'group' => $a->group,
                'detail' => $a->pivot->detail ?? null,
            ]),
            'reviews_summary' => $this->reviews->map(fn ($r) => [
                'id' => $r->id,
                'source' => $r->source,
                'reviewer_name' => $r->reviewer_name,
                'rating' => (float) $r->rating,
                'comment' => $r->comment,
                'keywords' => $r->extracted_keywords ? array_map('trim', explode(',', $r->extracted_keywords)) : [],
                'sentiment' => $r->sentiment,
                'date' => $r->created_at?->format('d M Y'),
            ]),
        ];
    }
}
