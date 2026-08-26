<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Amenity extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'icon',
        'group',
    ];

    public function places(): BelongsToMany
    {
        return $this->belongsToMany(Place::class, 'place_amenities')
            ->withPivot('detail')
            ->withTimestamps();
    }
}
