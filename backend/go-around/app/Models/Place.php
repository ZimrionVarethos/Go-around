<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Place extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'address',
        'subdistrict',
        'latitude',
        'longitude',
        'google_maps_url',
        'instagram_handle',
        'price_min_drink',
        'price_max_drink',
        'price_avg_food',
        'price_tier',
        'parking_fee_motor',
        'has_student_discount',
        'wifi_speed_mbps',
        'wifi_quality',
        'plug_availability',
        'noise_level',
        'is_24_hours',
        'open_time',
        'close_time',
        'google_rating',
        'total_google_reviews',
        'nugas_score',
        'budget_score',
        'facility_score',
        'image_url',
        'description',
        'vibe_tags',
        'status',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'price_min_drink' => 'integer',
        'price_max_drink' => 'integer',
        'price_avg_food' => 'integer',
        'price_tier' => 'integer',
        'parking_fee_motor' => 'integer',
        'has_student_discount' => 'boolean',
        'wifi_speed_mbps' => 'integer',
        'is_24_hours' => 'boolean',
        'google_rating' => 'float',
        'total_google_reviews' => 'integer',
        'nugas_score' => 'float',
        'budget_score' => 'float',
        'facility_score' => 'float',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(Amenity::class, 'place_amenities')
            ->withPivot('detail')
            ->withTimestamps();
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Scope for active places only
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for bounding box search on map viewport
     */
    public function scopeInBoundingBox(Builder $query, float $north, float $south, float $east, float $west): Builder
    {
        return $query->whereBetween('latitude', [$south, $north])
            ->whereBetween('longitude', [$west, $east]);
    }

    /**
     * Scope for spatial nearby radius calculation (Haversine formula)
     */
    public function scopeNearby(Builder $query, float $lat, float $lng, float $radiusKm = 5.0): Builder
    {
        // 6371 is Earth's radius in km
        $haversine = '(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude))))';

        return $query->select('places.*')
            ->selectRaw("{$haversine} AS distance_km", [$lat, $lng, $lat])
            ->having('distance_km', '<=', $radiusKm)
            ->orderBy('distance_km', 'asc');
    }
}
