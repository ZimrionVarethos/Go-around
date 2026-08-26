<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlaceGeoJsonResource extends JsonResource
{
    /**
     * Transform the resource into a standard RFC 7946 GeoJSON Feature.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'type' => 'Feature',
            'id' => $this->id,
            'geometry' => [
                'type' => 'Point',
                'coordinates' => [
                    (float) $this->longitude,
                    (float) $this->latitude,
                ],
            ],
            'properties' => [
                'id' => $this->id,
                'name' => $this->name,
                'slug' => $this->slug,
                'category' => $this->whenLoaded('category', function () {
                    return [
                        'id' => $this->category->id,
                        'name' => $this->category->name,
                        'slug' => $this->category->slug,
                        'icon' => $this->category->icon,
                    ];
                }),
                'subdistrict' => $this->subdistrict,
                'address' => $this->address,
                'price_min_drink' => $this->price_min_drink,
                'price_max_drink' => $this->price_max_drink,
                'price_avg_food' => $this->price_avg_food,
                'price_tier' => $this->price_tier,
                'wifi_speed_mbps' => $this->wifi_speed_mbps,
                'wifi_quality' => $this->wifi_quality,
                'plug_availability' => $this->plug_availability,
                'noise_level' => $this->noise_level,
                'is_24_hours' => (bool) $this->is_24_hours,
                'open_time' => $this->open_time,
                'close_time' => $this->close_time,
                'google_rating' => (float) $this->google_rating,
                'nugas_score' => (float) $this->nugas_score,
                'budget_score' => (float) $this->budget_score,
                'facility_score' => (float) $this->facility_score,
                'image_url' => $this->image_url,
                'vibe_tags' => $this->vibe_tags ? array_map('trim', explode(',', $this->vibe_tags)) : [],
                'google_maps_url' => $this->google_maps_url,
                'instagram_handle' => $this->instagram_handle,
                'distance_km' => isset($this->distance_km) ? round((float) $this->distance_km, 2) : null,
                'amenities' => $this->whenLoaded('amenities', function () {
                    return $this->amenities->map(fn ($a) => [
                        'id' => $a->id,
                        'name' => $a->name,
                        'slug' => $a->slug,
                        'icon' => $a->icon,
                        'group' => $a->group,
                        'detail' => $a->pivot->detail ?? null,
                    ]);
                }),
            ],
        ];
    }
}
