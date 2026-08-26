<?php

namespace Database\Seeders;

use App\Models\Amenity;
use Illuminate\Database\Seeder;

class AmenitySeeder extends Seeder
{
    public function run(): void
    {
        $amenities = [
            // Workspace
            ['name' => 'Colokan Melimpah', 'slug' => 'colokan-melimpah', 'icon' => 'plug', 'group' => 'workspace'],
            ['name' => 'Wi-Fi Cepat (>50 Mbps)', 'slug' => 'wifi-cepat', 'icon' => 'wifi', 'group' => 'workspace'],
            ['name' => 'Kursi Ergonomis / Nyaman', 'slug' => 'kursi-nyaman', 'icon' => 'chair', 'group' => 'workspace'],
            ['name' => 'Ruang Hening (Silent Room)', 'slug' => 'ruang-hening', 'icon' => 'volume-mute', 'group' => 'workspace'],
            
            // Facility
            ['name' => 'Ruangan Ber-AC', 'slug' => 'ac-room', 'icon' => 'snowflake', 'group' => 'facility'],
            ['name' => 'Musholla Nyaman', 'slug' => 'musholla', 'icon' => 'mosque', 'group' => 'facility'],
            ['name' => 'Area Merokok Terpisah', 'slug' => 'smoking-area', 'icon' => 'smoking', 'group' => 'facility'],
            ['name' => 'Parkir Motor Luas & Aman', 'slug' => 'parkir-motor-luas', 'icon' => 'motorcycle', 'group' => 'facility'],
            ['name' => 'Buka 24 Jam', 'slug' => 'buka-24-jam', 'icon' => 'clock', 'group' => 'facility'],

            // Economy
            ['name' => 'Menu Hemat (< Rp 15.000)', 'slug' => 'menu-hemat', 'icon' => 'tag', 'group' => 'economy'],
            ['name' => 'Diskon Mahasiswa (KTM)', 'slug' => 'diskon-ktm', 'icon' => 'id-card', 'group' => 'economy'],
            ['name' => 'Parkir Gratis', 'slug' => 'parkir-gratis', 'icon' => 'check-circle', 'group' => 'economy'],
        ];

        foreach ($amenities as $item) {
            Amenity::updateOrCreate(['slug' => $item['slug']], $item);
        }
    }
}
