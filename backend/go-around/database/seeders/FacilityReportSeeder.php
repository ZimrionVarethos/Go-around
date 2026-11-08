<?php

namespace Database\Seeders;

use App\Models\FacilityReport;
use App\Models\Place;
use Illuminate\Database\Seeder;

class FacilityReportSeeder extends Seeder
{
    public function run(): void
    {
        $tickets = [
            [
                'ticket_code' => 'TK-802',
                'cafe_name' => 'Anthology Coffee & Tea',
                'location' => 'Sentul / Danau Teratai',
                'category' => 'Colokan Rusak',
                'priority' => 'high',
                'reported_by' => 'Asprion (Mahasiswa)',
                'description' => 'Colokan di meja area lantai 2 banyak yang longgar dan 3 titik mati total. Banyak mahasiswa nugas terpaksa rebutan meja atau pindah kafe karena baterai laptop habis.',
                'status' => 'open',
                'is_unread' => true,
            ],
            [
                'ticket_code' => 'TK-795',
                'cafe_name' => 'Kopi Nako Pajajaran',
                'location' => 'Bogor Timur',
                'category' => 'WiFi Tidak Stabil',
                'priority' => 'medium',
                'reported_by' => 'Mahasiswa SV IPB',
                'description' => 'WiFi ngedrop ke 10 Mbps saat sore/ramai jam nugas peak time (18.30 WIB). Padahal di WebGIS tertulis 45 Mbps.',
                'status' => 'open',
                'is_unread' => false,
            ],
            [
                'ticket_code' => 'TK-791',
                'cafe_name' => 'Botanica Coffee Dramaga',
                'location' => 'Dramaga / Kampus IPB',
                'category' => 'Usulan Spot Nugas Baru',
                'priority' => 'suggestion',
                'reported_by' => 'Mahasiswa IPB',
                'description' => 'Kafennya buka 24 jam, mejanya luas bercolokan tiap kursi, WiFi tembus 70 Mbps, suasana kondusif dan tenang dengan laptop skripsi.',
                'status' => 'open',
                'is_unread' => false,
            ],
            [
                'ticket_code' => 'TK-788',
                'cafe_name' => 'Raindance Coffee Baranangsiang',
                'location' => 'Baranangsiang',
                'category' => 'Update Jam Operasional',
                'priority' => 'low',
                'reported_by' => 'Baranangsiang',
                'description' => 'Sekarang buka 24 jam khusus malam minggu dan hari kerja, djam 23.00 WIB. Di WebGIS Go Around masih tertulis jam tutup 21.00 WIB.',
                'status' => 'open',
                'is_unread' => false,
            ],
        ];

        foreach ($tickets as $ticketData) {
            $place = Place::where('name', 'LIKE', "%{$ticketData['cafe_name']}%")->first();
            $ticketData['place_id'] = $place?->id;

            FacilityReport::updateOrCreate(
                ['ticket_code' => $ticketData['ticket_code']],
                $ticketData
            );
        }
    }
}
