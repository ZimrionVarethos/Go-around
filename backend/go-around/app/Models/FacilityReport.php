<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacilityReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_code',
        'place_id',
        'cafe_name',
        'location',
        'category',
        'reported_by',
        'description',
        'priority',
        'status',
        'is_unread',
        'internal_note',
        'time_option',
        'evidence_colokan',
        'evidence_speedtest',
        'evidence_menu',
    ];

    protected $casts = [
        'is_unread' => 'boolean',
    ];

    public function place(): BelongsTo
    {
        return $this->belongsTo(Place::class);
    }
}
