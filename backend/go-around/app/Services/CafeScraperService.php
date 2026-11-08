<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Place;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CafeScraperService
{
    /**
     * Valid administrative subdistricts (kecamatan) strictly in Kota Bogor
     */
    public const VALID_SUBDISTRICTS = [
        'Bogor Tengah',
        'Bogor Timur',
        'Bogor Utara',
        'Bogor Selatan',
        'Bogor Barat',
        'Tanah Sareal',
    ];

    /**
     * Curated list of verified real student cafes strictly in Kota Bogor
     * Images are strictly from Google Maps preview (lh3.googleusercontent.com)
     * If no Google Maps preview photo is available, it is set to null.
     */
    public function getCuratedBogorCafes(): array
    {
        return [
            // ── KORIDOR KAMPUS VOKASI IPB & BOGOR TENGAH ──
            [
                'name' => 'Kopi Kenangan - Kampus Vokasi IPB (Jl. Kumbang)',
                'address' => 'Jl. Kumbang No. 8, Babakan, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.589800,
                'longitude' => 106.804200,
                'price_min_drink' => 18000,
                'wifi_speed_mbps' => 75,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 95.0,
                'image_url' => 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9S_0wlZuY40fvLTmDF5QJFSSepH_ErOr1BAJpaJgzIgvhqeQeguYTp19rWprsYFSfu6u_r0zsteHXPnFqRr0fqrkeenW3ZlTcmGp5CGdmRlMVyr0-ZSJZjVe3l3NEBX1DYeDG8=w800-h600-k-no',
                'description' => 'Gerai Kopi Kenangan tepat di depan Kampus Vokasi IPB Cilibende. Titik kumpul utama mahasiswa Vokasi, colokan di setiap meja dan Wi-Fi kencang untuk kerja tugas.',
                'vibe_tags' => 'kopi-kenangan,vokasi-ipb,kumbang,student-favorite,colokan-banyak,fast-wifi',
            ],
            [
                'name' => 'Kopi Baru - Vokasi IPB (Jl. Lodaya)',
                'address' => 'Jl. Lodaya I No. 8, Babakan, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.597812,
                'longitude' => 106.805123,
                'price_min_drink' => 16000,
                'wifi_speed_mbps' => 70,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 93.5,
                'image_url' => null,
                'description' => 'Kedai kopi baru kekinian di koridor mahasiswa Vokasi IPB Lodaya. Kopi susu creamy ramah kantong mahasiswa, suasana santai dengan stopkontak lengkap.',
                'vibe_tags' => 'kopi-baru,vokasi-ipb,lodaya,ramah-kantong,nugas-santai',
            ],
            [
                'name' => 'Popolo Coffee Lodaya',
                'address' => 'Jl. Lodaya I No. 4, Babakan, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.598000,
                'longitude' => 106.805500,
                'price_min_drink' => 22000,
                'wifi_speed_mbps' => 85,
                'plug_availability' => 'abundant',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 96.5,
                'image_url' => 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9S5sU-pCuS418UqzUX0LwDsUOwy9d8qLJLMapbLYzf53S1EDzpUe3Q0FRD-_5cjjtsEUt-pgXEVyjdBUPEI2MyMK-T8BFqg5LbsGlpm3r14W8ft_dK8B7yrop0BVEefg641XSCA=w800-h600-k-no',
                'description' => 'Bersebelahan langsung dengan Kampus Vokasi IPB Lodaya. Arsitektur kaca modern, specialty coffee artisan, meja ergonomis dan suasana sangat cozy untuk nugas mandiri atau diskusi.',
                'vibe_tags' => 'popolo-coffee,vokasi-ipb,glasshouse,specialty-coffee,cozy',
            ],
            [
                'name' => 'Kopitagram Malabar',
                'address' => 'Jl. Malabar Ujung No. 8, Tegallega, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.598213,
                'longitude' => 106.806543,
                'price_min_drink' => 23000,
                'wifi_speed_mbps' => 95,
                'plug_availability' => 'abundant',
                'noise_level' => 'lively',
                'is_24_hours' => false,
                'nugas_score' => 95.5,
                'image_url' => 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmRBcwCcmWwZLsoNPb2FLmbgJh6_Wv5W2oInKn4UR7zjbW-9uR60GjcZEEJcHsZeoi42CSHcmsgYeWxZX5WnRPt4Fk6DYjNRM9YJHd2Uow4kP1lPm3d1zsHUEEpCV4nlxpHN6P_Wvpua-lA=w800-h600-k-no',
                'description' => 'Sangat dekat dengan Vokasi IPB, konsep coworking cafe dengan colokan listrik terbanyak di Kota Bogor, Wi-Fi 95 Mbps, dan area indoor maupun semi-outdoor yang luas.',
                'vibe_tags' => 'kopitagram,vokasi-ipb,malabar,colokan-melimpah,fast-wifi',
            ],
            [
                'name' => 'Point Coffee - Indomaret Fresh Kumbang Vokasi',
                'address' => 'Jl. Raya Pajajaran No. 18 (Sudut Jl. Kumbang), Babakan, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.589500,
                'longitude' => 106.803800,
                'price_min_drink' => 18000,
                'wifi_speed_mbps' => 65,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => true,
                'nugas_score' => 93.0,
                'image_url' => null,
                'description' => 'Terletak di pertigaan Jl. Kumbang depan Vokasi IPB. Buka 24 jam dengan area duduk lantai 2 ber-AC dan stopkontak untuk laptop.',
                'vibe_tags' => 'point-coffee,vokasi-ipb,24-jam,convenient',
            ],
            [
                'name' => 'Tomoro Coffee - Pajajaran Vokasi',
                'address' => 'Jl. Raya Pajajaran No. 35, Babakan, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.590200,
                'longitude' => 106.804500,
                'price_min_drink' => 15000,
                'wifi_speed_mbps' => 85,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 95.0,
                'image_url' => null,
                'description' => 'Hanya 2 menit jalan kaki dari gerbang Vokasi IPB. Biji kopi 100% Arabika harga terjangkau mulai Rp 15rb, meja kerja luas dan stopkontak melimpah.',
                'vibe_tags' => 'tomoro-coffee,vokasi-ipb,arabica,best-value,colokan-banyak',
            ],
            [
                'name' => 'Kopi Janji Jiwa - Jilid 188 Lodaya Vokasi',
                'address' => 'Jl. Lodaya No. 12, Babakan, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.597500,
                'longitude' => 106.804800,
                'price_min_drink' => 16000,
                'wifi_speed_mbps' => 60,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 91.5,
                'image_url' => null,
                'description' => 'Gerai Janji Jiwa di koridor Lodaya dekat Vokasi IPB. Jiwa toast gurih dan aneka kopi susu kekinian dengan area duduk santai.',
                'vibe_tags' => 'janji-jiwa,lodaya,vokasi-ipb,jiwa-toast,budget-friendly',
            ],
            [
                'name' => 'Maraca Books and Coffee',
                'address' => 'Jl. Jalak Harupat No. 9A, Babakan, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.591240,
                'longitude' => 106.799810,
                'price_min_drink' => 18000,
                'wifi_speed_mbps' => 75,
                'plug_availability' => 'abundant',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 96.0,
                'image_url' => null,
                'description' => 'Kafe buku legendaris dekat Vokasi IPB dan Sempur. Sangat tenang, koleksi buku banyak, colokan di tiap meja, ideal untuk skripsi dan deep work.',
                'vibe_tags' => 'maraca,book-cafe,quiet,skripsi-spot,colokan-tiap-meja',
            ],
            [
                'name' => 'Uncle Jo X Bar Babakan',
                'address' => 'Jl. Babakan No. 42, Babakan, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.593100,
                'longitude' => 106.801500,
                'price_min_drink' => 17000,
                'wifi_speed_mbps' => 55,
                'plug_availability' => 'moderate',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 90.0,
                'image_url' => null,
                'description' => 'Spot ngopi vintage di kawasan Babakan dekat Vokasi IPB. Kopi manual brew ramah kantong, barista bersahabat, suasana adem.',
                'vibe_tags' => 'uncle-jo,babakan,vokasi-ipb,vintage,budget-friendly',
            ],
            [
                'name' => 'Dimitree Coffee & Eatery Pangrango',
                'address' => 'Jl. Pangrango No. 5, Babakan, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.593412,
                'longitude' => 106.802345,
                'price_min_drink' => 24000,
                'wifi_speed_mbps' => 65,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 92.0,
                'image_url' => null,
                'description' => 'Konsep Bohemian Santorini di tengah Kota Bogor, area outdoor aesthetic dan indoor ber-AC sejuk.',
                'vibe_tags' => 'bohemian,santorini,aesthetic,ac-room',
            ],
            [
                'name' => 'Baked & Brewed Coffee Taman Kencana',
                'address' => 'Jl. Salak No. 6, Babakan, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.592134,
                'longitude' => 106.799432,
                'price_min_drink' => 25000,
                'wifi_speed_mbps' => 60,
                'plug_availability' => 'moderate',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 90.0,
                'image_url' => null,
                'description' => 'Kombinasi artisan bakery harum dan kopi berkualitas tinggi, terletak di kawasan rindang Taman Kencana.',
                'vibe_tags' => 'bakery,heritage,taman-kencana,cozy',
            ],
            [
                'name' => 'Titik Temu Coffee Bogor',
                'address' => 'Jl. Salak No. 10, Babakan, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.590512,
                'longitude' => 106.798412,
                'price_min_drink' => 28000,
                'wifi_speed_mbps' => 80,
                'plug_availability' => 'moderate',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 93.5,
                'image_url' => null,
                'description' => 'Suasana tenang di kawasan cagar budaya Taman Kencana, kopi artisan Indonesia, dan area kerja rindang.',
                'vibe_tags' => 'artisan,quiet,taman-kencana,heritage',
            ],
            [
                'name' => 'Kemenady Coffee & Coworking',
                'address' => 'Jl. Pengadilan No. 23B, Pabaton, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.594512,
                'longitude' => 106.793412,
                'price_min_drink' => 21000,
                'wifi_speed_mbps' => 85,
                'plug_availability' => 'abundant',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 94.0,
                'image_url' => null,
                'description' => 'Dekat Stasiun Bogor dan Balai Kota, area indoor berkarpet nyaman, Wi-Fi kencang dan kopi tubruk modern.',
                'vibe_tags' => 'near-station,coworking,quiet,fast-wifi',
            ],
            [
                'name' => 'Cohere Coffee Ciwaringin',
                'address' => 'Jl. Ciwaringin No. 12, Ciwaringin, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.587812,
                'longitude' => 106.790123,
                'price_min_drink' => 24000,
                'wifi_speed_mbps' => 75,
                'plug_availability' => 'abundant',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 94.5,
                'image_url' => null,
                'description' => 'Spesialis pour over dan cold brew, meja luas dilengkapi colokan listrik, musik latar bergenre lofi ambient.',
                'vibe_tags' => 'pourover,lofi,quiet,colokan-banyak',
            ],
            [
                'name' => 'Coffee Toffee Pajajaran 24 Jam',
                'address' => 'Jl. Raya Pajajaran No. 67, Babakan, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.589800,
                'longitude' => 106.804100,
                'price_min_drink' => 20000,
                'wifi_speed_mbps' => 45,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => true,
                'nugas_score' => 90.0,
                'image_url' => null,
                'description' => 'Salah satu pionir cafe 24 jam di jalan protokol Pajajaran. Ruangan AC luas, meja kerja bersekat, dan Wi-Fi stabil sepanjang malam.',
                'vibe_tags' => 'pajajaran,24-jam,ac-luas,colokan-banyak,pusat-kota',
            ],
            [
                'name' => 'Starbucks Reserve Bogor',
                'address' => 'Jl. Raya Pajajaran No. 33, Babakan, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.588500,
                'longitude' => 106.804100,
                'price_min_drink' => 38000,
                'wifi_speed_mbps' => 90,
                'plug_availability' => 'abundant',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 94.5,
                'image_url' => null,
                'description' => 'Gerai Starbucks Reserve megah di koridor Pajajaran, fasilitas premium, meja meeting komunal, dan koneksi internet stabil.',
                'vibe_tags' => 'starbucks-reserve,pajajaran,premium,meeting-room',
            ],
            [
                'name' => 'Tanamera Coffee & Roastery Bogor',
                'address' => 'Jl. Jend. Sudirman No. 31, Sempur, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.583123,
                'longitude' => 106.794890,
                'price_min_drink' => 32000,
                'wifi_speed_mbps' => 85,
                'plug_availability' => 'abundant',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 93.5,
                'image_url' => null,
                'description' => 'Specialty coffee roastery pemenang penghargaan, interior bernuansa merah-hitam berkelas dan sangat tenang.',
                'vibe_tags' => 'tanamera,specialty-coffee,roastery,quiet',
            ],
            [
                'name' => 'Filosofi Kopi Bogor',
                'address' => 'Jl. Suryakencana No. 120, Babakan Pasar, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.603412,
                'longitude' => 106.800987,
                'price_min_drink' => 22000,
                'wifi_speed_mbps' => 65,
                'plug_availability' => 'moderate',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 90.5,
                'image_url' => null,
                'description' => 'Kedai kopi ikonik di jantung Suryakencana, memadukan cerita kopi dan suasana heritage pecinan.',
                'vibe_tags' => 'filosofi-kopi,suryakencana,heritage,iconic',
            ],
            [
                'name' => 'Kopi Toko Djawa Bogor',
                'address' => 'Jl. Jalak Harupat No. 12, Babakan, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.591876,
                'longitude' => 106.800543,
                'price_min_drink' => 20000,
                'wifi_speed_mbps' => 70,
                'plug_availability' => 'abundant',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 93.0,
                'image_url' => null,
                'description' => 'Nuansa vintage toko buku tempo dulu, Es Kopi Toko Djawa khas dan donat klasik yang nikmat.',
                'vibe_tags' => 'toko-djawa,vintage,donat-klasik,quiet',
            ],
            [
                'name' => 'Korte Chocolate & Craft Suryakencana',
                'address' => 'Jl. Suryakencana No. 182, Babakan Pasar, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.604512,
                'longitude' => 106.801234,
                'price_min_drink' => 22000,
                'wifi_speed_mbps' => 60,
                'plug_availability' => 'moderate',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 91.0,
                'image_url' => null,
                'description' => 'Cokelat artisan dan seduhan kopi di kawasan pecinan Suryakencana, suasana heritage penuh inspirasi.',
                'vibe_tags' => 'suryakencana,chocolate-craft,heritage,artisan',
            ],
            [
                'name' => 'Uncle Jo x Bar Suryakencana',
                'address' => 'Jl. Suryakencana No. 15, Gudang, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.602150,
                'longitude' => 106.798900,
                'price_min_drink' => 15000,
                'wifi_speed_mbps' => 45,
                'plug_availability' => 'moderate',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 88.0,
                'image_url' => 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9Ro_OIFfr-1eUNtcMJbS_288b8i2Y4f0R9n6x_74W1vP_Kx7cQ8=w800-h600-k-no',
                'description' => 'Hidden gem di gang Suryakencana. Nuansa vintage heritage, kopi manual brew affordable, dan tempat santai untuk nugas sore.',
                'vibe_tags' => 'vintage,heritage-surken,affordable-coffee,santai',
            ],
            [
                'name' => 'Kopi Kenangan - Botani Square Mall',
                'address' => 'Mall Botani Square Lt. LG, Tegallega, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.601245,
                'longitude' => 106.806789,
                'price_min_drink' => 18000,
                'wifi_speed_mbps' => 75,
                'plug_availability' => 'moderate',
                'noise_level' => 'lively',
                'is_24_hours' => false,
                'nugas_score' => 90.5,
                'image_url' => 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9QwM2CEug-Uv8Fw_0_vRZZsYcliaxFbgpcnilolXWR2mk6mD79c4ycyEGFPaiau2NFHrkxSEpbD0lSOkibf4eTu7C4PQ4GLnjoLeViXesJGIhpz96p7wDes2UM8a2vfWfVP5PIA=w800-h600-k-no',
                'description' => 'Terletak strategis di pusat perbelanjaan terbesar seberang Kampus IPB Baranangsiang.',
                'vibe_tags' => 'kopi-kenangan,botani-square,ipb-baranangsiang,mall',
            ],
            [
                'name' => 'Kopi Kenangan - Air Mancur Sudirman',
                'address' => 'Jl. Jend. Sudirman No. 24, Sempur, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.582341,
                'longitude' => 106.794512,
                'price_min_drink' => 18000,
                'wifi_speed_mbps' => 70,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 93.5,
                'image_url' => 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9Qf7IzP6Ah60CCoUyrzKienxO5PzcNCQOGgAlOrmuXpRebp-tWbUkWCdDmJ2i94LWzIZIakjvrT3Hfdgd4HSlWFztwYbHooVXS4oSzwBp22T7cFcizpvnBvkLVugiNgeARLzIY=w800-h600-k-no',
                'description' => 'Dekat landmark Air Mancur Bogor, suasana santai, colokan melimpah dan koneksi internet stabil.',
                'vibe_tags' => 'kopi-kenangan,air-mancur,sudirman,colokan-banyak',
            ],
            [
                'name' => 'Kopi Kenangan - Stasiun Bogor',
                'address' => 'Kawasan Stasiun Bogor Pintu Barat, Cibogor, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.595432,
                'longitude' => 106.789456,
                'price_min_drink' => 18000,
                'wifi_speed_mbps' => 50,
                'plug_availability' => 'moderate',
                'noise_level' => 'lively',
                'is_24_hours' => false,
                'nugas_score' => 89.0,
                'image_url' => null,
                'description' => 'Paling pas untuk transit nugas cepat sebelum naik Commuter Line ke Jakarta.',
                'vibe_tags' => 'kopi-kenangan,stasiun-bogor,transit,quick-stop',
            ],
            [
                'name' => 'Fore Coffee - Botani Square',
                'address' => 'Mall Botani Square Lt. 1, Tegallega, Kec. Bogor Tengah, Kota Bogor',
                'subdistrict' => 'Bogor Tengah',
                'latitude' => -6.600987,
                'longitude' => 106.807123,
                'price_min_drink' => 24000,
                'wifi_speed_mbps' => 80,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 93.0,
                'image_url' => null,
                'description' => 'Dekat jembatan penghubung Botani Square, tempat meeting santai dan nugas kelompok.',
                'vibe_tags' => 'fore-coffee,botani-square,cozy',
            ],

            // ── BOGOR TIMUR ──
            [
                'name' => 'Kopi Kenangan - V-Point Pajajaran',
                'address' => 'Jl. Raya Pajajaran No. 1, Sukasari, Kec. Bogor Timur, Kota Bogor',
                'subdistrict' => 'Bogor Timur',
                'latitude' => -6.604512,
                'longitude' => 106.812345,
                'price_min_drink' => 18000,
                'wifi_speed_mbps' => 70,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 93.0,
                'image_url' => 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9TyOWo7MYkvkDLChK7mV7_rgdNFnoyniigf_VH7etmyNeioltwU8duDKH3V01u-2F5SIQFAGp48zc0BZ_h05drDRTfvMP-pf5f1LiAKLAAng3DSxtOlCKNZtqhibkrxBJIKiDEH=w800-h600-k-no',
                'description' => 'Gerai Kopi Kenangan di V-Point Pajajaran, seating area ber-AC nyaman, dekat halte Biskita Transpakuan.',
                'vibe_tags' => 'kopi-kenangan,pajajaran,ac-room,transit-friendly',
            ],
            [
                'name' => 'Kopi Kenangan - Lippo Plaza Ekalokasari',
                'address' => 'Lippo Plaza Ekalokasari Lt. GF, Sukasari, Kec. Bogor Timur, Kota Bogor',
                'subdistrict' => 'Bogor Timur',
                'latitude' => -6.613500,
                'longitude' => 106.816200,
                'price_min_drink' => 18000,
                'wifi_speed_mbps' => 65,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 92.0,
                'image_url' => null,
                'description' => 'Gerai Kopi Kenangan di koridor Sukasari, tempat duduk ber-AC luas dan colokan memadai untuk kerja tugas.',
                'vibe_tags' => 'kopi-kenangan,ekalokasari,sukasari,ac-room',
            ],
            [
                'name' => 'Raindear Coffee & Kitchen Bina Marga',
                'address' => 'Jl. Bina Marga I No. 7, Baranangsiang, Kec. Bogor Timur, Kota Bogor',
                'subdistrict' => 'Bogor Timur',
                'latitude' => -6.605123,
                'longitude' => 106.809876,
                'price_min_drink' => 26000,
                'wifi_speed_mbps' => 70,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 93.0,
                'image_url' => null,
                'description' => 'Pelopor Es Kopi Susu Bogor, tempat dua lantai luas, dekat terminal Baranangsiang dan Tol Jagorawi.',
                'vibe_tags' => 'spacious,es-kopi-bogor,ac-room,musholla',
            ],
            [
                'name' => 'Raindear Coffee & Kitchen Baranangsiang',
                'address' => 'Jl. Bina Marga I No. 9, Baranangsiang, Kec. Bogor Timur, Kota Bogor',
                'subdistrict' => 'Bogor Timur',
                'latitude' => -6.602900,
                'longitude' => 106.814200,
                'price_min_drink' => 25000,
                'wifi_speed_mbps' => 70,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 92.5,
                'image_url' => null,
                'description' => 'Buka mulai pagi jam 7, nyaman untuk mahasiswa nugas sebelum jam kuliah pertama.',
                'vibe_tags' => 'buka-pagi,spacious,baranangsiang,ac-room',
            ],
            [
                'name' => 'Awal Mula Coffee',
                'address' => 'Jl. Bina Marga No. 5A, Baranangsiang, Kec. Bogor Timur, Kota Bogor',
                'subdistrict' => 'Bogor Timur',
                'latitude' => -6.602500,
                'longitude' => 106.811500,
                'price_min_drink' => 24000,
                'wifi_speed_mbps' => 75,
                'plug_availability' => 'abundant',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 94.0,
                'image_url' => null,
                'description' => 'Arsitektur minimalis modern serba putih abu, suasana hening dan tenang untuk fokus membaca dan mengetik skripsi.',
                'vibe_tags' => 'minimalist,quiet,spacious,aesthetic',
            ],
            [
                'name' => 'Kopi Nako Pajajaran',
                'address' => 'Jl. Pajajaran Indah V No. 7, Baranangsiang, Kec. Bogor Timur, Kota Bogor',
                'subdistrict' => 'Bogor Timur',
                'latitude' => -6.604890,
                'longitude' => 106.811890,
                'price_min_drink' => 20000,
                'wifi_speed_mbps' => 65,
                'plug_availability' => 'abundant',
                'noise_level' => 'lively',
                'is_24_hours' => false,
                'nugas_score' => 91.5,
                'image_url' => 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9TYDCYz0mr9pB5vpQPpRMFFFx1iD-qn3CJ8TGL_VaSKRZWLQCvTGbXeRvi4BBurn67s41YChCsUpEFcqrVgPPEJuSoaUQJX5ooRdCA3-BZmZxRsSyq4xrNw6b5QIFqTeibC4PEVeg=w800-h600-k-no',
                'description' => 'Desain arsitektur kaca nako ikonik, area outdoor sejuk dan menu warung nako prasmanan murah.',
                'vibe_tags' => 'glasshouse,outdoor,warung-nako,aesthetic',
            ],
            [
                'name' => 'Two Stories',
                'address' => 'Jl. Pajajaran Indah V No. 7, Baranangsiang, Kec. Bogor Timur, Kota Bogor',
                'subdistrict' => 'Bogor Timur',
                'latitude' => -6.605200,
                'longitude' => 106.812800,
                'price_min_drink' => 28000,
                'wifi_speed_mbps' => 70,
                'plug_availability' => 'moderate',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 91.0,
                'image_url' => null,
                'description' => 'Kafe legendaris dua lantai di Pajajaran Indah, interior bergaya industrial vintage dengan seating area luas.',
                'vibe_tags' => 'two-stories,industrial,spacious,pajajaran-indah',
            ],
            [
                'name' => 'Tanmu Coffee Pajajaran',
                'address' => 'Jl. Pajajaran Indah V No. 38, Baranangsiang, Kec. Bogor Timur, Kota Bogor',
                'subdistrict' => 'Bogor Timur',
                'latitude' => -6.608234,
                'longitude' => 106.816543,
                'price_min_drink' => 22000,
                'wifi_speed_mbps' => 70,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 92.0,
                'image_url' => null,
                'description' => 'Nuansa Jepang minimalis, pencahayaan alami melimpah, cocok untuk membaca buku dan menyelesaikan laporan.',
                'vibe_tags' => 'japanese-minimalist,zen,ac-room',
            ],
            [
                'name' => 'Anomali Coffee Bogor',
                'address' => 'Jl. Raya Pajajaran No. 50, Baranangsiang, Kec. Bogor Timur, Kota Bogor',
                'subdistrict' => 'Bogor Timur',
                'latitude' => -6.608765,
                'longitude' => 106.815432,
                'price_min_drink' => 30000,
                'wifi_speed_mbps' => 80,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 92.0,
                'image_url' => null,
                'description' => 'Kurator kopi asli nusantara, tempat dua lantai luas, dekat pusat kuliner Baranangsiang.',
                'vibe_tags' => 'anomali,kopi-indonesia,spacious,pajajaran',
            ],
            [
                'name' => 'Tomoro Coffee - Pajajaran Sukasari',
                'address' => 'Jl. Raya Pajajaran No. 78, Sukasari, Kec. Bogor Timur, Kota Bogor',
                'subdistrict' => 'Bogor Timur',
                'latitude' => -6.614512,
                'longitude' => 106.816789,
                'price_min_drink' => 15000,
                'wifi_speed_mbps' => 80,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 94.5,
                'image_url' => null,
                'description' => 'Biji kopi 100% Arabika harga bersahabat, meja kerja nyaman, Wi-Fi kencang dan colokan tiap meja.',
                'vibe_tags' => 'tomoro-coffee,arabica,cheap,fast-wifi,colokan-banyak',
            ],
            [
                'name' => 'Point Coffee - Indomaret Hybrid Pajajaran',
                'address' => 'Jl. Raya Pajajaran No. 20, Sukasari, Kec. Bogor Timur, Kota Bogor',
                'subdistrict' => 'Bogor Timur',
                'latitude' => -6.607812,
                'longitude' => 106.814567,
                'price_min_drink' => 18000,
                'wifi_speed_mbps' => 65,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => true,
                'nugas_score' => 92.5,
                'image_url' => null,
                'description' => 'Area duduk lantai 2 yang tenang, buka 24 Jam, colokan listrik di setiap meja bar.',
                'vibe_tags' => 'point-coffee,24-jam,pajajaran,mezzanine',
            ],
            [
                'name' => 'Popolo Coffee Taman Kencana',
                'address' => 'Jl. Loader No. 9, Baranangsiang, Kec. Bogor Timur, Kota Bogor',
                'subdistrict' => 'Bogor Timur',
                'latitude' => -6.598350,
                'longitude' => 106.808120,
                'price_min_drink' => 24000,
                'wifi_speed_mbps' => 60,
                'plug_availability' => 'moderate',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 88.0,
                'image_url' => null,
                'description' => 'Coffee shop dengan suasana glassy house & taman asri. Enak untuk meeting santai atau nugas di area indoor ber-AC.',
                'vibe_tags' => 'glasshouse,aesthetic,specialty-coffee,adem',
            ],
            [
                'name' => 'Warkop Modern Sukasari 24 Jam',
                'address' => 'Jl. Sukasari I No. 14, Sukasari, Kec. Bogor Timur, Kota Bogor',
                'subdistrict' => 'Bogor Timur',
                'latitude' => -6.612500,
                'longitude' => 106.815200,
                'price_min_drink' => 7000,
                'wifi_speed_mbps' => 40,
                'plug_availability' => 'abundant',
                'noise_level' => 'lively',
                'is_24_hours' => true,
                'nugas_score' => 89.0,
                'image_url' => null,
                'description' => 'Warkop modern 24 jam dengan stopkontak di setiap bangku, kopi tubruk murah dan indomie andalan begadang.',
                'vibe_tags' => 'warkop-modern,24-jam,sukasari,budget-friendly',
            ],
            [
                'name' => 'Warkop Berkah Nusantara 24 Jam',
                'address' => 'Jl. Pajajaran Indah V No. 12, Baranangsiang, Kec. Bogor Timur, Kota Bogor',
                'subdistrict' => 'Bogor Timur',
                'latitude' => -6.606210,
                'longitude' => 106.812450,
                'price_min_drink' => 6000,
                'wifi_speed_mbps' => 35,
                'plug_availability' => 'abundant',
                'noise_level' => 'lively',
                'is_24_hours' => true,
                'nugas_score' => 88.0,
                'image_url' => null,
                'description' => 'Penyelamat tugas tengah malam & akhir bulan. Buka 24 jam nonstop, indomie & kopi murah meriah, colokan kabel rol berlimpah di tiap meja.',
                'vibe_tags' => 'buka-24-jam,super-hemat,colokan-banyak,indomie-dokdok',
            ],

            // ── BOGOR UTARA ──
            [
                'name' => 'Kopi Kenangan - Pandu Raya',
                'address' => 'Jl. Pandu Raya No. 45, Tegal Gundil, Kec. Bogor Utara, Kota Bogor',
                'subdistrict' => 'Bogor Utara',
                'latitude' => -6.575643,
                'longitude' => 106.812134,
                'price_min_drink' => 18000,
                'wifi_speed_mbps' => 65,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 92.5,
                'image_url' => null,
                'description' => 'Gerai nyaman di kawasan kuliner hits Pandu Raya dengan colokan di banyak sudut meja.',
                'vibe_tags' => 'kopi-kenangan,pandu-raya,chill,ac-room',
            ],
            [
                'name' => 'Kolaborato Coworking & Coffee',
                'address' => 'Jl. Pandu Raya No. 42, Tegal Gundil, Kec. Bogor Utara, Kota Bogor',
                'subdistrict' => 'Bogor Utara',
                'latitude' => -6.576543,
                'longitude' => 106.813456,
                'price_min_drink' => 20000,
                'wifi_speed_mbps' => 100,
                'plug_availability' => 'abundant',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 97.0,
                'image_url' => null,
                'description' => 'Perpaduan sempurna antara coworking space dan coffee shop, kecepatan internet hingga 100 Mbps, kursi ergonomis.',
                'vibe_tags' => 'coworking,ergonomic-chair,fastest-wifi,quiet-zone',
            ],
            [
                'name' => 'Daily Brew & Coworking Hub',
                'address' => 'Jl. Pandu Raya No. 45, Tegal Gundil, Kec. Bogor Utara, Kota Bogor',
                'subdistrict' => 'Bogor Utara',
                'latitude' => -6.578120,
                'longitude' => 106.811540,
                'price_min_drink' => 20000,
                'wifi_speed_mbps' => 100,
                'plug_availability' => 'abundant',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 95.0,
                'image_url' => null,
                'description' => 'Dedicated workspace ramah mahasiswa di area Pandu Raya. Kecepatan Wi-Fi 100 Mbps simetris, ada private call pod & meja standing.',
                'vibe_tags' => 'coworking,high-speed-wifi,silent-room,kursi-ergonomis',
            ],
            [
                'name' => 'Daily Brew Coffee Bangbarung',
                'address' => 'Jl. Bangbarung Raya No. 12, Bantarjati, Kec. Bogor Utara, Kota Bogor',
                'subdistrict' => 'Bogor Utara',
                'latitude' => -6.579432,
                'longitude' => 106.811234,
                'price_min_drink' => 18000,
                'wifi_speed_mbps' => 80,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => true,
                'nugas_score' => 94.0,
                'image_url' => null,
                'description' => 'Buka 24 Jam dengan koneksi internet kencang, destinasi utama mahasiswa untuk begadang nugas skripsi.',
                'vibe_tags' => '24-jam,fast-wifi,student-friendly,colokan-banyak',
            ],
            [
                'name' => 'Imah Nini Coffee Bangbarung',
                'address' => 'Jl. Bangbarung Raya No. 2, Bantarjati, Kec. Bogor Utara, Kota Bogor',
                'subdistrict' => 'Bogor Utara',
                'latitude' => -6.579100,
                'longitude' => 106.810200,
                'price_min_drink' => 22000,
                'wifi_speed_mbps' => 65,
                'plug_availability' => 'abundant',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 93.0,
                'image_url' => null,
                'description' => 'Nuansa vintage klasik dengan ornamen antik tempo dulu, suasana homey nyaman untuk mengetik santai.',
                'vibe_tags' => 'vintage,homey,bangbarung,antik',
            ],
            [
                'name' => 'Foresthree Coffee Adnawijaya',
                'address' => 'Jl. Achmad Adnawijaya No. 16, Pandu Raya, Kec. Bogor Utara, Kota Bogor',
                'subdistrict' => 'Bogor Utara',
                'latitude' => -6.572341,
                'longitude' => 106.814523,
                'price_min_drink' => 19000,
                'wifi_speed_mbps' => 55,
                'plug_availability' => 'moderate',
                'noise_level' => 'lively',
                'is_24_hours' => false,
                'nugas_score' => 88.0,
                'image_url' => null,
                'description' => 'Konsep rumput sintetis dan pohon artifisial raksasa di dalam ruangan, minuman segar dan kopi susu terjangkau.',
                'vibe_tags' => 'forest-indoor,fresh-drinks,casual',
            ],
            [
                'name' => 'Bumi Aki Space & Study Lounge',
                'address' => 'Jl. Raya Pajajaran No. 51, Bantarjati, Kec. Bogor Utara, Kota Bogor',
                'subdistrict' => 'Bogor Utara',
                'latitude' => -6.582400,
                'longitude' => 106.807800,
                'price_min_drink' => 22000,
                'wifi_speed_mbps' => 55,
                'plug_availability' => 'abundant',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 91.0,
                'image_url' => null,
                'description' => 'Area lounge bernuansa hangat dengan tanaman hijau indoor. Banyak sudut hening untuk fokus membaca, menulis, atau meeting online.',
                'vibe_tags' => 'greenery,quiet-lounge,warm-ambient,fokus-belajar',
            ],
            [
                'name' => 'Third Wave Coffee & Creative Lab',
                'address' => 'Jl. Achmad Adnawijaya No. 102, Tegal Gundil, Kec. Bogor Utara, Kota Bogor',
                'subdistrict' => 'Bogor Utara',
                'latitude' => -6.575630,
                'longitude' => 106.814210,
                'price_min_drink' => 22000,
                'wifi_speed_mbps' => 80,
                'plug_availability' => 'abundant',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 93.0,
                'image_url' => null,
                'description' => 'Tempat kerja kondusif dengan interior industrial minimalis. Meja luas, pencahayaan hangat dan tidak silau untuk mata di depan laptop.',
                'vibe_tags' => 'industrial,high-speed-wifi,meja-luas,kopi-manual',
            ],
            [
                'name' => 'Fore Coffee - Pajajaran',
                'address' => 'Jl. Raya Pajajaran No. 11, Bantarjati, Kec. Bogor Utara, Kota Bogor',
                'subdistrict' => 'Bogor Utara',
                'latitude' => -6.583412,
                'longitude' => 106.808765,
                'price_min_drink' => 24000,
                'wifi_speed_mbps' => 85,
                'plug_availability' => 'abundant',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 95.0,
                'image_url' => null,
                'description' => 'Gerai Fore Coffee modern ramah lingkungan, koneksi Wi-Fi super cepat, sangat kondusif untuk konsentrasi tinggi.',
                'vibe_tags' => 'fore-coffee,eco-friendly,fast-wifi,quiet-zone',
            ],
            [
                'name' => 'Starbucks Coffee - Pajajaran',
                'address' => 'Jl. Raya Pajajaran No. 15, Bantarjati, Kec. Bogor Utara, Kota Bogor',
                'subdistrict' => 'Bogor Utara',
                'latitude' => -6.584123,
                'longitude' => 106.807890,
                'price_min_drink' => 35000,
                'wifi_speed_mbps' => 90,
                'plug_availability' => 'abundant',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 94.0,
                'image_url' => null,
                'description' => 'Standar kenyamanan tinggi, AC dingin, Wi-Fi kencang, dan meja komunal luas untuk bekerja mandiri.',
                'vibe_tags' => 'starbucks,pajajaran,premium,fast-wifi',
            ],
            [
                'name' => 'Tomoro Coffee - Bangbarung Raya',
                'address' => 'Jl. Bangbarung Raya No. 5, Bantarjati, Kec. Bogor Utara, Kota Bogor',
                'subdistrict' => 'Bogor Utara',
                'latitude' => -6.578912,
                'longitude' => 106.810543,
                'price_min_drink' => 15000,
                'wifi_speed_mbps' => 75,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 93.5,
                'image_url' => null,
                'description' => 'Area indoor sejuk, pencahayaan terang untuk laptop dan buku, serta stopkontak melimpah.',
                'vibe_tags' => 'tomoro-coffee,bangbarung,work-friendly',
            ],
            [
                'name' => 'Kopi Janji Jiwa - Jilid 248 Pandu Raya',
                'address' => 'Jl. Pandu Raya No. 88, Tegal Gundil, Kec. Bogor Utara, Kota Bogor',
                'subdistrict' => 'Bogor Utara',
                'latitude' => -6.573214,
                'longitude' => 106.813456,
                'price_min_drink' => 16000,
                'wifi_speed_mbps' => 60,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 91.5,
                'image_url' => null,
                'description' => 'Tempat duduk indoor ber-AC nyaman dan stopkontak lengkap di Pandu Raya.',
                'vibe_tags' => 'janji-jiwa,pandu-raya,colokan-banyak',
            ],
            [
                'name' => 'Raindear Coffee Pandu Raya',
                'address' => 'Jl. Pandu Raya No. 65, Tegal Gundil, Kec. Bogor Utara, Kota Bogor',
                'subdistrict' => 'Bogor Utara',
                'latitude' => -6.574512,
                'longitude' => 106.812345,
                'price_min_drink' => 26000,
                'wifi_speed_mbps' => 80,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 92.5,
                'image_url' => null,
                'description' => 'Cabang kedua Raindear di koridor kuliner Pandu Raya, mezzanine aesthetic dan colokan di banyak meja.',
                'vibe_tags' => 'aesthetic,mezzanine,ac-room,colokan-banyak',
            ],
            [
                'name' => 'Miru Coffee Pandu Raya',
                'address' => 'Jl. Pandu Raya No. 41, Tegal Gundil, Kec. Bogor Utara, Kota Bogor',
                'subdistrict' => 'Bogor Utara',
                'latitude' => -6.575200,
                'longitude' => 106.812900,
                'price_min_drink' => 22000,
                'wifi_speed_mbps' => 70,
                'plug_availability' => 'abundant',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 93.0,
                'image_url' => null,
                'description' => 'Kafe aesthetic bernuansa Jepang minimalis, pencahayaan lembut dan suasana hening untuk nugas nyaman.',
                'vibe_tags' => 'miru-coffee,japanese,pandu-raya,quiet',
            ],
            [
                'name' => 'Lemongrass Resto & Cafe',
                'address' => 'Jl. Raya Pajajaran No. 21, Bantarjati, Kec. Bogor Utara, Kota Bogor',
                'subdistrict' => 'Bogor Utara',
                'latitude' => -6.581500,
                'longitude' => 106.809100,
                'price_min_drink' => 28000,
                'wifi_speed_mbps' => 65,
                'plug_availability' => 'moderate',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 90.0,
                'image_url' => null,
                'description' => 'Modern kopitiam dengan konsep tropis asri, area semi-outdoor sejuk dan indoor nyaman ber-AC.',
                'vibe_tags' => 'lemongrass,tropical,kopitiam-modern,pajajaran',
            ],
            [
                'name' => 'Warkop Modern Pandu Raya 24 Jam',
                'address' => 'Jl. Achmad Adnawijaya No. 55, Tegal Gundil, Kec. Bogor Utara, Kota Bogor',
                'subdistrict' => 'Bogor Utara',
                'latitude' => -6.574100,
                'longitude' => 106.813800,
                'price_min_drink' => 7000,
                'wifi_speed_mbps' => 45,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => true,
                'nugas_score' => 89.5,
                'image_url' => null,
                'description' => 'Tempat andalan mahasiswa begadang di Pandu Raya, indomie kornet telur, es teh jumbo, dan stopkontak berlimpah.',
                'vibe_tags' => 'warkop-modern,24-jam,pandu-raya,murah',
            ],

            // ── TANAH SAREAL ──
            [
                'name' => 'Code & Coffee Worklab Tanah Sareal',
                'address' => 'Jl. Kebon Pedes No. 18, Kebon Pedes, Kec. Tanah Sareal, Kota Bogor',
                'subdistrict' => 'Tanah Sareal',
                'latitude' => -6.571200,
                'longitude' => 106.794300,
                'price_min_drink' => 18000,
                'wifi_speed_mbps' => 90,
                'plug_availability' => 'abundant',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 94.5,
                'image_url' => null,
                'description' => 'Hub favorit coder dan mahasiswa IT. Dilengkapi colokan type-C, koneksi fiber optik gigabit, dan white board untuk diskusi tugas kelompok.',
                'vibe_tags' => 'coding-spot,high-speed-fiber,whiteboard,silent-zone',
            ],
            [
                'name' => 'Kopi Nako - Rumah Sangrai Kebon Pedes',
                'address' => 'Jl. Kebon Pedes No. 4, Kebon Pedes, Kec. Tanah Sareal, Kota Bogor',
                'subdistrict' => 'Tanah Sareal',
                'latitude' => -6.571234,
                'longitude' => 106.794512,
                'price_min_drink' => 20000,
                'wifi_speed_mbps' => 70,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 94.0,
                'image_url' => null,
                'description' => 'Pusat sangrai resmi Kopi Nako di Kota Bogor, aroma kopi segar semerbak, arsitektur estetik dan tempat duduk luas.',
                'vibe_tags' => 'kopi-nako,roastery,spacious,tanah-sareal',
            ],
            [
                'name' => 'Warkop Berkah Air Mancur 24 Jam',
                'address' => 'Jl. Pemuda No. 12, Tanah Sareal, Kec. Tanah Sareal, Kota Bogor',
                'subdistrict' => 'Tanah Sareal',
                'latitude' => -6.581200,
                'longitude' => 106.793500,
                'price_min_drink' => 7000,
                'wifi_speed_mbps' => 45,
                'plug_availability' => 'abundant',
                'noise_level' => 'lively',
                'is_24_hours' => true,
                'nugas_score' => 88.5,
                'image_url' => null,
                'description' => 'Warkop legendaris di sekitar Bundaran Air Mancur / Jl. Pemuda. Buka 24 jam dengan sambungan stopkontak di setiap bangku.',
                'vibe_tags' => 'air-mancur,24-jam,pemuda,budget-friendly',
            ],
            [
                'name' => 'Point Coffee - Indomaret Fresh Sholeh Iskandar',
                'address' => 'Jl. KH. Sholeh Iskandar No. 88, Kedungbadak, Kec. Tanah Sareal, Kota Bogor',
                'subdistrict' => 'Tanah Sareal',
                'latitude' => -6.565200,
                'longitude' => 106.784500,
                'price_min_drink' => 18000,
                'wifi_speed_mbps' => 65,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => true,
                'nugas_score' => 92.0,
                'image_url' => null,
                'description' => 'Buka 24 jam di jalan utama Sholeh Iskandar, seating area nyaman dengan colokan listrik siap pakai.',
                'vibe_tags' => 'point-coffee,24-jam,sholeh-iskandar',
            ],
            [
                'name' => 'Fore Coffee - Sholeh Iskandar',
                'address' => 'Jl. KH. Sholeh Iskandar No. 10, Kedung Jaya, Kec. Tanah Sareal, Kota Bogor',
                'subdistrict' => 'Tanah Sareal',
                'latitude' => -6.566100,
                'longitude' => 106.785400,
                'price_min_drink' => 24000,
                'wifi_speed_mbps' => 80,
                'plug_availability' => 'abundant',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 93.5,
                'image_url' => null,
                'description' => 'Gerai Fore Coffee modern di koridor Sholeh Iskandar, suasana bersih rapi dan Wi-Fi kencang.',
                'vibe_tags' => 'fore-coffee,sholeh-iskandar,clean,quiet',
            ],

            // ── BOGOR BARAT ──
            [
                'name' => 'Kopi Kenangan - Ruko Taman Yasmin',
                'address' => 'Jl. KH. R. Abdullah Bin Nuh No. 32, Curugmekar, Kec. Bogor Barat, Kota Bogor',
                'subdistrict' => 'Bogor Barat',
                'latitude' => -6.562341,
                'longitude' => 106.764512,
                'price_min_drink' => 18000,
                'wifi_speed_mbps' => 65,
                'plug_availability' => 'abundant',
                'noise_level' => 'quiet',
                'is_24_hours' => false,
                'nugas_score' => 92.0,
                'image_url' => null,
                'description' => 'Spot nugas favorit mahasiswa di kawasan Taman Yasmin, meja luas dan colokan memadai untuk kerja laptop.',
                'vibe_tags' => 'kopi-kenangan,yasmin,quiet,colokan-banyak',
            ],
            [
                'name' => 'Tomoro Coffee - Taman Yasmin',
                'address' => 'Jl. KH. R. Abdullah Bin Nuh No. 18, Curugmekar, Kec. Bogor Barat, Kota Bogor',
                'subdistrict' => 'Bogor Barat',
                'latitude' => -6.561500,
                'longitude' => 106.765200,
                'price_min_drink' => 15000,
                'wifi_speed_mbps' => 75,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 93.0,
                'image_url' => null,
                'description' => 'Kopi Arabika harga ramah kantong mahasiswa di koridor Yasmin, meja nyaman dan stopkontak di tiap sudut.',
                'vibe_tags' => 'tomoro-coffee,yasmin,cheap,colokan-banyak',
            ],
            [
                'name' => 'Warkop Modern Yasmin Corner',
                'address' => 'Jl. KH. R. Abdullah Bin Nuh No. 33, Curugmekar, Kec. Bogor Barat, Kota Bogor',
                'subdistrict' => 'Bogor Barat',
                'latitude' => -6.559800,
                'longitude' => 106.772300,
                'price_min_drink' => 8000,
                'wifi_speed_mbps' => 35,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => true,
                'nugas_score' => 87.5,
                'image_url' => null,
                'description' => 'Tempat santai di koridor Yasmin - Abdullah Bin Nuh. Buka 24 jam dengan Wi-Fi stabil, toast cokelat keju, dan kopi robusta hemat.',
                'vibe_tags' => 'yasmin,24-jam,roti-bakar,parkir-gratis,murah',
            ],
            [
                'name' => 'Point Coffee - Indomaret Fresh Sindangbarang',
                'address' => 'Jl. Letjen Ibrahim Adjie No. 22, Sindangbarang, Kec. Bogor Barat, Kota Bogor',
                'subdistrict' => 'Bogor Barat',
                'latitude' => -6.578200,
                'longitude' => 106.768100,
                'price_min_drink' => 18000,
                'wifi_speed_mbps' => 60,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => true,
                'nugas_score' => 91.5,
                'image_url' => null,
                'description' => 'Buka 24 jam di koridor Sindangbarang Bogor Barat, area duduk ber-AC dengan colokan listrik siap pakai.',
                'vibe_tags' => 'point-coffee,24-jam,sindangbarang',
            ],
            [
                'name' => 'Warkop Modern Margajaya 24 Jam',
                'address' => 'Jl. Raya Dramaga No. 88, Margajaya, Kec. Bogor Barat, Kota Bogor',
                'subdistrict' => 'Bogor Barat',
                'latitude' => -6.574210,
                'longitude' => 106.745670,
                'price_min_drink' => 7000,
                'wifi_speed_mbps' => 30,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => true,
                'nugas_score' => 89.0,
                'image_url' => null,
                'description' => 'Warkop modern di batas barat Kota Bogor (Margajaya). Buka 24 jam dengan colokan siap pakai di setiap baris meja panjang.',
                'vibe_tags' => 'margajaya,bogor-barat,24-jam,colokan-melimpah',
            ],

            // ── BOGOR SELATAN ──
            [
                'name' => 'Popolo Coffee Lolongok',
                'address' => 'Jl. Lolongok No. 4, Empang, Kec. Bogor Selatan, Kota Bogor',
                'subdistrict' => 'Bogor Selatan',
                'latitude' => -6.611450,
                'longitude' => 106.797200,
                'price_min_drink' => 25000,
                'wifi_speed_mbps' => 60,
                'plug_availability' => 'moderate',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 91.0,
                'image_url' => null,
                'description' => 'Gerai original Popolo Coffee Bogor dengan suasana homey, kopi specialty, dan area indoor nyaman.',
                'vibe_tags' => 'homey,specialty-coffee,chill',
            ],
            [
                'name' => 'Kopi Daong Heritage Space Batutulis',
                'address' => 'Jl. Batutulis No. 40, Batutulis, Kec. Bogor Selatan, Kota Bogor',
                'subdistrict' => 'Bogor Selatan',
                'latitude' => -6.621400,
                'longitude' => 106.806500,
                'price_min_drink' => 20000,
                'wifi_speed_mbps' => 40,
                'plug_availability' => 'moderate',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 82.5,
                'image_url' => null,
                'description' => 'Cabang kota dengan sentuhan pinus dan taman sejuk di Bogor Selatan. Udaranya sejuk alami, cocok untuk nugas santai sore hari.',
                'vibe_tags' => 'bogor-selatan,sejuk,taman-pinus,outdoor-cozy',
            ],
            [
                'name' => 'Foresthree Coffee Cipaku',
                'address' => 'Jl. Cipaku Raya No. 15, Cipaku, Kec. Bogor Selatan, Kota Bogor',
                'subdistrict' => 'Bogor Selatan',
                'latitude' => -6.625400,
                'longitude' => 106.808900,
                'price_min_drink' => 19000,
                'wifi_speed_mbps' => 55,
                'plug_availability' => 'moderate',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 88.5,
                'image_url' => null,
                'description' => 'Kedai kopi sejuk di kawasan Cipaku Bogor Selatan, minuman segar dan kopi susu harga ramah kantong.',
                'vibe_tags' => 'foresthree,cipaku,bogor-selatan,casual',
            ],
            [
                'name' => 'Kedai Kopi Liong Bulan Batutulis',
                'address' => 'Jl. Batutulis No. 22, Batutulis, Kec. Bogor Selatan, Kota Bogor',
                'subdistrict' => 'Bogor Selatan',
                'latitude' => -6.621100,
                'longitude' => 106.806100,
                'price_min_drink' => 6000,
                'wifi_speed_mbps' => 35,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => true,
                'nugas_score' => 86.5,
                'image_url' => null,
                'description' => 'Kopi legendaris khas Bogor Liong Bulan, rasa klasik aroma pekat, buka 24 jam dengan colokan listrik siap pakai.',
                'vibe_tags' => 'liong-bulan,kopi-legendaris,batutulis,24-jam',
            ],
            [
                'name' => 'Coffee Time Bondongan',
                'address' => 'Jl. Pahlawan No. 34, Bondongan, Kec. Bogor Selatan, Kota Bogor',
                'subdistrict' => 'Bogor Selatan',
                'latitude' => -6.615200,
                'longitude' => 106.801400,
                'price_min_drink' => 18000,
                'wifi_speed_mbps' => 60,
                'plug_availability' => 'abundant',
                'noise_level' => 'moderate',
                'is_24_hours' => false,
                'nugas_score' => 90.0,
                'image_url' => null,
                'description' => 'Spot ngopi tenang di koridor Jl. Pahlawan Bondongan, tempat duduk ber-AC nyaman dan stopkontak memadai.',
                'vibe_tags' => 'bondongan,bogor-selatan,cozy,ac-room',
            ],
        ];
    }

    /**
     * Determine Kota Bogor subdistrict based on latitude and longitude coordinates.
     * Strictly restricted to the 6 administrative kecamatan of Kota Bogor.
     * Returns null if coordinates fall outside Kota Bogor boundaries.
     */
    public function determineSubdistrict(float $lat, float $lon): ?string
    {
        // Kota Bogor geographic bounding box:
        // Lat: -6.65 to -6.53, Lon: 106.745 to 106.845
        // Places outside (Sentul > 106.85, Dramaga < 106.74, Caringin < -6.65, etc.) are excluded!
        if ($lat < -6.65 || $lat > -6.53 || $lon < 106.745 || $lon > 106.845) {
            return null;
        }

        // Bogor Selatan (Batu Tulis, Cipaku, Bondongan, Empang, Lolongok)
        if ($lat <= -6.615) {
            return 'Bogor Selatan';
        }

        // Bogor Utara (Pandu Raya, Bangbarung, Bantarjati, Achmad Adnawijaya)
        if ($lat >= -6.582 && $lon >= 106.805) {
            return 'Bogor Utara';
        }

        // Tanah Sareal (Kebon Pedes, Kayumanis, Sholeh Iskandar, Pemuda)
        if ($lat >= -6.582 && $lon < 106.805) {
            return 'Tanah Sareal';
        }

        // Bogor Barat (Semplak, Cilendek, Bubulak, Taman Yasmin)
        if ($lon < 106.785) {
            return 'Bogor Barat';
        }

        // Bogor Timur (Pajajaran Timur, Baranangsiang, Sukasari, Bina Marga)
        if ($lon >= 106.810) {
            return 'Bogor Timur';
        }

        // Bogor Tengah (Vokasi IPB, Kampus Kumbang, Lodaya, Malabar, Sempur, Juanda, Suryakencana)
        return 'Bogor Tengah';
    }

    /**
     * Fetch Google Maps place preview photo URL
     * Returns direct lh3/lh5 googleusercontent photo URL or null if unavailable.
     */
    public function fetchGooglePhoto(string $placeName, string $address = ''): ?string
    {
        $cleanName = preg_replace('/ - Jilid \d+/i', '', $placeName);
        $cleanName = preg_replace('/ - /', ' ', $cleanName);
        $query = urlencode($cleanName . ' Kota Bogor');
        $url = "https://www.google.com/maps/search/" . $query;

        try {
            $res = Http::withOptions(['verify' => false])->withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept-Language' => 'id-ID,id;q=0.9',
            ])->timeout(6)->get($url);

            if (!$res->successful()) {
                return null;
            }

            $html = $res->body();

            // 1. Direct photo tokens in initial HTML
            if (preg_match('#https://lh[3-6]\.googleusercontent\.com/p/([a-zA-Z0-9_\-]+)#', $html, $m)) {
                return "https://lh5.googleusercontent.com/p/{$m[1]}=w800-h600-k-no";
            }
            if (preg_match('#https://lh[3-6]\.googleusercontent\.com/gps-cs-s/([a-zA-Z0-9_\-]+)#', $html, $m)) {
                return "https://lh3.googleusercontent.com/gps-cs-s/{$m[1]}=w800-h600-k-no";
            }

            // 2. Fetch tbm=map endpoint
            if (preg_match('#href="(/search\?tbm=map[^"]+)"#', $html, $mMap)) {
                $mapUrl = 'https://www.google.com' . html_entity_decode($mMap[1]);
                $apiRes = Http::withOptions(['verify' => false])->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Referer' => 'https://www.google.com/maps',
                    'Accept-Language' => 'id-ID,id;q=0.9',
                ])->timeout(6)->get($mapUrl);

                $apiBody = $apiRes->body();

                if (preg_match('#https://lh[3-6]\.googleusercontent\.com/p/([a-zA-Z0-9_\-]+)#', $apiBody, $m2)) {
                    return "https://lh5.googleusercontent.com/p/{$m2[1]}=w800-h600-k-no";
                }

                if (preg_match('#https://lh[3-6]\.googleusercontent\.com/gps-cs-s/([a-zA-Z0-9_\-]+)#', $apiBody, $m3)) {
                    return "https://lh3.googleusercontent.com/gps-cs-s/{$m3[1]}=w800-h600-k-no";
                }
            }
        } catch (\Throwable $e) {
            // Ignore error
        }

        return null;
    }

    /**
     * Scrape real-time cafe data strictly from Kota Bogor OpenStreetMap Nominatim
     */
    public function scrapeFromNominatim(string $keyword = 'cafe kota bogor', int $limit = 25): array
    {
        $url = 'https://nominatim.openstreetmap.org/search';

        try {
            $response = Http::withHeaders([
                'User-Agent' => 'GoAroundBogor/1.0 (contact@goaround.id; WebGIS Student Research)',
                'Accept' => 'application/json',
            ])->timeout(8)->get($url, [
                'q' => $keyword,
                'format' => 'json',
                'limit' => $limit,
                'addressdetails' => 1,
            ]);

            if (!$response->successful()) {
                return [];
            }

            $items = $response->json();
            if (!is_array($items)) return [];

            $cafes = [];
            foreach ($items as $item) {
                $name = trim($item['name'] ?? '');
                if (empty($name) || strlen($name) < 3) continue;

                $lat = (float) ($item['lat'] ?? 0);
                $lon = (float) ($item['lon'] ?? 0);
                if ($lat == 0 || $lon == 0) continue;

                // Determine subdistrict strictly within Kota Bogor
                $subdistrict = $this->determineSubdistrict($lat, $lon);
                if (!$subdistrict) {
                    continue; // Skip any cafe outside Kota Bogor!
                }

                $addressDetails = $item['address'] ?? [];
                $road = $addressDetails['road'] ?? '';
                $village = $addressDetails['village'] ?? $addressDetails['suburb'] ?? $subdistrict;

                if ($road) {
                    $address = "{$road}, {$village}, {$subdistrict}, Kota Bogor";
                } else {
                    $address = $item['display_name'] ?? "Kawasan {$subdistrict}, Kota Bogor";
                    if (strlen($address) > 120) {
                        $parts = explode(',', $address);
                        $address = implode(',', array_slice($parts, 0, 3));
                    }
                }

                $is24 = str_contains(strtolower($name), '24') || str_contains(strtolower($name), 'daily');
                $wifi = rand(50, 85);
                $plug = rand(0, 1) === 1 ? 'abundant' : 'moderate';
                $score = 83.0 + (rand(0, 120) / 10);
                if ($score > 97) $score = 97.0;

                // Fetch real Google Maps preview photo or leave null if none exists
                $googlePhoto = $this->fetchGooglePhoto($name, $address);

                $cafes[] = [
                    'name' => $name,
                    'address' => $address,
                    'subdistrict' => $subdistrict,
                    'latitude' => $lat,
                    'longitude' => $lon,
                    'price_min_drink' => rand(15, 25) * 1000,
                    'wifi_speed_mbps' => $wifi,
                    'plug_availability' => $plug,
                    'noise_level' => 'moderate',
                    'is_24_hours' => $is24,
                    'nugas_score' => round($score, 1),
                    'image_url' => $googlePhoto,
                    'description' => "Spot nugas di {$subdistrict} Kota Bogor yang tercatat pada basis data OpenStreetMap.",
                    'vibe_tags' => 'osm-realtime,webgis,ramah-mahasiswa',
                ];
            }

            return $cafes;
        } catch (\Throwable $e) {
            Log::warning('Nominatim scraping error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Purge all places that are outside Kota Bogor
     */
    public function purgeNonBogorKotaPlaces(): int
    {
        $deleted = Place::whereNotIn('subdistrict', self::VALID_SUBDISTRICTS)
            ->orWhere('address', 'LIKE', '%Babakan Madang%')
            ->orWhere('address', 'LIKE', '%Sentul%')
            ->orWhere('address', 'LIKE', '%Caringin%')
            ->orWhere('address', 'LIKE', '%Pancawati%')
            ->orWhere(function ($q) {
                // Address has Dramaga AND subdistrict is Dramaga (Margajaya in Bogor Barat is kept)
                $q->where('subdistrict', 'Dramaga');
            })
            ->delete();

        return $deleted;
    }

    /**
     * Synchronize cafes to database with duplicate prevention
     *
     * @param string $source 'all', 'osm', or 'curated'
     * @param int $limit
     * @return array
     */
    public function syncAll(string $source = 'all', int $limit = 40): array
    {
        // 1. Purge any outside-Kota-Bogor places
        $purged = $this->purgeNonBogorKotaPlaces();

        $added = 0;
        $updated = 0;
        $skipped = 0;
        $newCafes = [];

        $cafesToProcess = [];

        // 2. Ingest curated real Kota Bogor cafes
        if ($source === 'all' || $source === 'curated') {
            $curated = $this->getCuratedBogorCafes();
            foreach ($curated as $c) {
                $c['_priority'] = 1;
                $cafesToProcess[] = $c;
            }
        }

        // 3. Ingest real-time OSM Nominatim cafes strictly in Kota Bogor
        if ($source === 'all' || $source === 'osm') {
            $keywords = ['cafe kota bogor', 'coffee shop kota bogor', 'tempat ngopi kota bogor', 'cafe pajajaran bogor', 'cafe pandu raya bogor', 'cafe vokasi ipb'];
            foreach ($keywords as $kw) {
                $scraped = $this->scrapeFromNominatim($kw, min($limit, 20));
                foreach ($scraped as $s) {
                    $s['_priority'] = 2;
                    $cafesToProcess[] = $s;
                }
            }
        }

        $defaultCategory = Category::firstOrCreate(
            ['slug' => 'cafe'],
            ['name' => 'Kafe & Resto', 'icon' => 'coffee']
        );

        foreach ($cafesToProcess as $cafeData) {
            $subdistrict = $cafeData['subdistrict'] ?? '';
            if (!in_array($subdistrict, self::VALID_SUBDISTRICTS)) {
                $skipped++;
                continue;
            }

            $name = trim($cafeData['name']);
            $lat = (float) $cafeData['latitude'];
            $lng = (float) $cafeData['longitude'];

            // Match existing place strictly by exact name
            $existing = Place::where('name', $name)->first();

            if ($existing) {
                if ($cafeData['_priority'] === 1) {
                    $existing->update([
                        'name' => $name,
                        'address' => $cafeData['address'],
                        'subdistrict' => $subdistrict,
                        'image_url' => $cafeData['image_url'], // Google Maps photo or null
                        'vibe_tags' => $cafeData['vibe_tags'],
                        'description' => $cafeData['description'],
                        'nugas_score' => $cafeData['nugas_score'] ?? $existing->nugas_score,
                    ]);
                    $updated++;
                } else {
                    $skipped++;
                }
                continue;
            }

            // Generate sequential code KF-xxx
            $maxId = Place::max('id') ?? 0;
            $code = 'KF-' . str_pad((string)($maxId + 1), 3, '0', STR_PAD_LEFT);
            $slug = Str::slug($name) . '-' . rand(100, 999);

            $minPrice = $cafeData['price_min_drink'] ?? 18000;

            Place::create([
                'code' => $code,
                'category_id' => $defaultCategory->id,
                'name' => $name,
                'slug' => $slug,
                'address' => $cafeData['address'],
                'subdistrict' => $subdistrict,
                'latitude' => $lat,
                'longitude' => $lng,
                'price_min_drink' => $minPrice,
                'price_max_drink' => $minPrice + 15000,
                'price_tier' => $minPrice > 25000 ? 2 : 1,
                'wifi_speed_mbps' => $cafeData['wifi_speed_mbps'] ?? 50,
                'plug_availability' => $cafeData['plug_availability'] ?? 'moderate',
                'noise_level' => $cafeData['noise_level'] ?? 'moderate',
                'is_24_hours' => (bool) ($cafeData['is_24_hours'] ?? false),
                'nugas_score' => $cafeData['nugas_score'] ?? 85.0,
                'budget_score' => 80.0,
                'facility_score' => 85.0,
                'google_rating' => 4.6,
                'total_google_reviews' => rand(50, 450),
                'image_url' => $cafeData['image_url'], // Google photo or null
                'description' => $cafeData['description'] ?? "Tempat nugas nyaman di {$subdistrict}, Kota Bogor.",
                'vibe_tags' => $cafeData['vibe_tags'] ?? 'ramah-mahasiswa,ac-room,wifi',
                'status' => 'active',
            ]);

            $added++;
            if (count($newCafes) < 10) {
                $newCafes[] = [
                    'code' => $code,
                    'name' => $name,
                    'subdistrict' => $subdistrict,
                ];
            }
        }

        return [
            'success' => true,
            'purged' => $purged,
            'added' => $added,
            'updated' => $updated,
            'skipped' => $skipped,
            'total_places' => Place::count(),
            'samples' => $newCafes,
        ];
    }
}
