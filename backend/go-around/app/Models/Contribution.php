<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contribution extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'subdistrict',
        'latitude',
        'longitude',
        'price_min_drink',
        'wifi_speed_mbps',
        'plug_availability',
        'noise_level',
        'is_24_hours',
        'notes',
        'submitter_name',
        'submitter_email',
        'status',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'price_min_drink' => 'integer',
        'wifi_speed_mbps' => 'integer',
        'is_24_hours' => 'boolean',
    ];
}
