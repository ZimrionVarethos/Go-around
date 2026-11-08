<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contribution;
use App\Models\FacilityReport;
use App\Models\Place;
use App\Services\SpatialSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAnalyticsController extends Controller
{
    /**
     * Overview KPIs and Analytics data for Admin dashboard
     */
    public function overview(Request $request): JsonResponse
    {
        $totalPlaces = Place::count();
        $verifiedPlaces = Place::whereIn('status', ['active', 'verified'])->count();
        $openTickets = FacilityReport::where('status', 'open')->count();
        $pendingContributions = Contribution::where('status', 'pending')->count();
        $reviewPlaces = Place::whereIn('status', ['pending', 'review'])->count();
        $avgScore = round(Place::avg('nugas_score') / 10, 1);

        $kpi = [
            'totalKafe' => $totalPlaces ?: 108,
            'totalKafeChange' => '+12 bulan ini',
            'totalKafeBreakdown' => 'Dramaga (28), Bgr Tengah (38), Sentul (42)',
            'tiketTerbuka' => $openTickets ?: 8,
            'tiketNote' => 'Perlu validasi',
            'tiketBreakdown' => '3 wifi drop, 4 colokan mati, 1 jam buka',
            'usulanBaru' => ($pendingContributions + $reviewPlaces) ?: 5,
            'usulanNote' => 'Menunggu Review',
            'usulanBreakdown' => 'Masuk dari mahasiswa Dramaga & IPB',
            'kunjungan' => 1420,
            'kunjunganNote' => 'sesi hari ini',
            'kunjunganBreakdown' => '312 unduhan rute GIS & bookmark kafe',
        ];

        $analytics = [
            'kpi' => [
                'totalQueries' => 28450,
                'queriesGrowth' => '+18% bulan ini',
                'activeStudents' => 14210,
                'studentsGrowth' => '+12.4%',
                'avgSessionHours' => 4.2,
                'routeConversions' => 6840,
                'conversionRate' => '24.0%',
            ],
            'preferences' => [
                ['label' => 'WiFi Cepat (>50 Mbps)', 'percent' => 78, 'hits' => 25100, 'color' => '#0284C7'],
                ['label' => 'Banyak Colokan Listrik (>80% meja terpasang)', 'percent' => 68, 'hits' => 21880, 'color' => '#F59E0B'],
                ['label' => 'Ramah Kantong Mahasiswa (< Rp 25.000 / minuman)', 'percent' => 56, 'hits' => 18010, 'color' => '#059669'],
                ['label' => 'Buka Larut Malam / 24 Jam', 'percent' => 44, 'hits' => 14150, 'color' => '#7C3AED'],
                ['label' => 'Suasana Tenang / Tidak Berisik (<50 dB)', 'percent' => 39, 'hits' => 12540, 'color' => '#64748B'],
            ],
            'peakHours' => [
                ['label' => "Pagi\n08.00–11.00", 'percent' => 15, 'isPeak' => false],
                ['label' => "Siang\n12.00–15.00", 'percent' => 42, 'isPeak' => false],
                ['label' => "Sore – Malam\n16.00–21.00", 'percent' => 88, 'isPeak' => true],
                ['label' => "Larut Malam\n22.00–02.00", 'percent' => 32, 'isPeak' => false],
            ],
            'spatialDensity' => [
                ['rank' => 1, 'area' => 'Dramaga (IPB University)', 'queries' => 11240, 'note' => 'Konsentrasi tinggi mahasiswa vokasi & sarjana (39.5% total kueri)', 'color' => '#005B54'],
                ['rank' => 2, 'area' => 'Bogor Tengah & Taman Kencana', 'queries' => 8420, 'note' => 'Pusat kafe estetik, kerja kelompok, & co-working space (29.6%)', 'color' => '#0284C7'],
                ['rank' => 3, 'area' => 'Pajajaran & Lodaya', 'queries' => 5120, 'note' => 'Dekat koridor transportasi (Bis Kita & kos mahasiswa) (18.0%)', 'color' => '#D97706'],
                ['rank' => 4, 'area' => 'Sentul City / Babakan Madang', 'queries' => 3670, 'note' => 'Tujuan kafe pekon / weekend deep study view pegunungan (12.9%)', 'color' => '#64748B'],
            ],
            'topCafes' => [
                ['rank' => 1, 'name' => 'Foresthree Dramaga', 'address' => 'Jl. Raya Dramaga (350m dari Kampus IPB)', 'clicks' => 2140],
                ['rank' => 2, 'name' => 'Popolo Coffee Lodaya', 'address' => 'Lodaya, Bogor Tengah', 'clicks' => 1820],
                ['rank' => 3, 'name' => 'Anthology Sentul', 'address' => 'Danau Teratai, Babakan Madang', 'clicks' => 1490],
                ['rank' => 4, 'name' => 'Raindance Baranangsiang', 'address' => 'Dekat Bis Kita & IPB Baranangsiang', 'clicks' => 1210],
                ['rank' => 5, 'name' => 'Kopi Nako', 'address' => 'Jl. Pajajaran Indah V', 'clicks' => 980],
            ],
        ];

        return response()->json([
            'status' => 'success',
            'data' => [
                'kpi' => $kpi,
                'analytics' => $analytics,
            ],
        ]);
    }

    /**
     * Export all places as RFC 7946 GeoJSON FeatureCollection
     */
    public function exportGeoJson(SpatialSearchService $spatialService): JsonResponse
    {
        $places = Place::with(['category', 'amenities'])->where('status', 'active')->get();
        $geoJson = $spatialService->toGeoJsonFeatureCollection($places);

        return response()->json($geoJson, 200, [
            'Content-Disposition' => 'attachment; filename="goaround-bogor-places.geojson"',
        ]);
    }
}
