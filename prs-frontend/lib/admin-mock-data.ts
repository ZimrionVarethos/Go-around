/**
 * MOCK DATA — Admin pages (Dashboard, Kelola Kafe, Tiket, Analisis)
 *
 * This data is used only because no admin backend API exists yet.
 * When the admin API is available, replace the data hooks in each
 * admin feature to call the API instead of importing from this file.
 *
 * DO NOT import this file from lib/api.ts or any API layer.
 */

export const MOCK_KPI = {
  totalKafe: 108,
  totalKafeChange: '+12 bulan ini',
  totalKafeBreakdown: 'Dramaga (28), Bgr Tengah (38), Sentul (42)',
  tiketTerbuka: 8,
  tiketNote: 'Perlu validasi',
  tiketBreakdown: '3 wifi drop, 4 colokan mati, 1 jam buka',
  usulanBaru: 5,
  usulanNote: 'Menunggu Review',
  usulanBreakdown: 'Masuk dari mahasiswa Dramaga & IPB',
  kunjungan: 1420,
  kunjunganNote: 'sesi hari ini',
  kunjunganBreakdown: '312 unduhan rute GIS & bookmark kafe',
};

export const MOCK_RECENT_TICKETS = [
  {
    id: 'TK-802',
    priority: 'high' as const,
    type: 'Colokan Rusak',
    cafeName: 'Anthology Coffee & Tea',
    timeAgo: '24 menit yang lalu',
    description:
      'Colokan di meja area lantai 2 banyak yang longgar dan 3 titik mati total. Banyak mahasiswa nugas terpaksa rebutan meja atau pindah kafe karena baterai laptop habis.',
    actions: ['Tandai Selesai', 'Tugaskan QA', 'Abaikan'],
  },
  {
    id: 'TK-795',
    priority: 'medium' as const,
    type: 'WiFi Tidak Stabil',
    cafeName: 'Kopi Nako Pajajaran',
    timeAgo: '1 jam lalu',
    description:
      'WiFi ngedrop ke 10 Mbps saat sore/ramai jam nugas peak time (18.30 WIB). Padahal di WebGIS tertulis 45 Mbps.',
    actions: ['Update Speedsheet & Jam Sibuk', 'Minta Uji Speedtest Ulang'],
  },
  {
    id: 'TK-790',
    priority: 'suggestion' as const,
    type: 'Usulan Spot Nugas Baru',
    cafeName: 'Botanica Coffee Dramaga',
    timeAgo: '3 jam yang lalu',
    description:
      '"Kafennya buka 24 jam, mejanya luas bercolokan tiap kursi, WiFi tembus 70 Mbps, suasana kondusif dan tenang dengan laptop skripsi."',
    actions: ['Verifikasi & Tambah ke Master Data GIS', 'Kirim Surveyor Lapangan', 'Tolak Usulan'],
  },
];

export const MOCK_PLACES_TABLE = [
  {
    id: 1,
    code: 'KF-001',
    name: 'Anthology Coffee & Tea',
    address: 'Sentul / Danau Teratai, Bogor',
    lat: -6.5542,
    lng: 106.8011,
    wifi: 82,
    plug: 92,
    price: 'Rp 28.000+',
    score: 9.7,
    status: 'verified' as const,
    imageUrl: null,
  },
  {
    id: 2,
    code: 'KF-002',
    name: 'Popolo Coffee Lodaya',
    address: 'Jl. Lodaya No. 3, Bogor Tengah',
    lat: -6.5693,
    lng: 106.7967,
    wifi: 65,
    plug: 80,
    price: 'Rp 25.000+',
    score: 9.4,
    status: 'verified' as const,
    imageUrl: null,
  },
  {
    id: 3,
    code: 'KF-003',
    name: 'Kopi Nako Dampingan Pajajaran',
    address: 'Jl. Pajajaran Indah V, Bogor Timur',
    lat: -6.5621,
    lng: 106.8144,
    wifi: 45,
    plug: 75,
    price: 'Rp 22.000+',
    score: 8.9,
    status: 'review' as const,
    imageUrl: null,
  },
  {
    id: 4,
    code: 'KF-004',
    name: 'Foresthree Coffee Dramaga',
    address: 'Jl. Raya Dramaga KM 7, Dekat Kampus IPB',
    lat: -6.5449,
    lng: 106.7201,
    wifi: 55,
    plug: 85,
    price: 'Rp 20.000+',
    score: 9.2,
    status: 'verified' as const,
    imageUrl: null,
  },
  {
    id: 5,
    code: 'KF-005',
    name: 'Raindance Coffee Baranangsiang',
    address: 'Jl. Danau Teratai, Kompleks Baranangsiang Indah',
    lat: -6.5986,
    lng: 106.8098,
    wifi: 48,
    plug: 70,
    price: 'Rp 18.000+',
    score: 8.6,
    status: 'verified' as const,
    imageUrl: null,
  },
];

export const MOCK_ADMIN_TICKETS = [
  {
    id: 'TK-802',
    priority: 'high' as const,
    category: 'Colokan Rusak',
    cafeName: 'Anthology Coffee & Tea',
    location: 'Sentul / Danau Teratai',
    timeAgo: '24 menit yang lalu',
    reportedBy: 'Asprion (Mahasiswa)',
    description:
      'Colokan di meja area lantai 2 banyak yang longgar dan 3 titik mati total. Banyak mahasiswa nugas terpaksa rebutan meja atau pindah kafe karena baterai laptop habis.',
  },
  {
    id: 'TK-795',
    priority: 'medium' as const,
    category: 'WiFi Tidak Stabil',
    cafeName: 'Kopi Nako Pajajaran',
    location: 'Bogor Timur',
    timeAgo: '1 jam lalu',
    reportedBy: 'Mahasiswa SV IPB',
    description:
      'WiFi ngedrop ke 10 Mbps saat sore/ramai jam nugas peak time (18.30 WIB). Padahal di WebGIS tertulis 45 Mbps.',
  },
  {
    id: 'TK-791',
    priority: 'suggestion' as const,
    category: 'Usulan Spot Nugas Baru',
    cafeName: 'Botanica Coffee Dramaga',
    location: 'Dramaga / Kampus IPB',
    timeAgo: '3 jam yang lalu',
    reportedBy: 'Mahasiswa IPB',
    description:
      'Kafennya buka 24 jam, mejanya luas bercolokan tiap kursi, WiFi tembus 70 Mbps, suasana kondusif dan tenang dengan laptop skripsi.',
  },
  {
    id: 'TK-788',
    priority: 'low' as const,
    category: 'Update Jam Operasional',
    cafeName: 'Raindance Coffee Baranangsiang',
    location: 'Baranangsiang',
    timeAgo: '5 jam yang lalu',
    reportedBy: 'Baranangsiang',
    description:
      'Sekarang buka 24 jam khusus malam minggu dan hari kerja, djam 23.00 WIB. Di WebGIS Go Around masih tertulis jam tutup 21.00 WIB.',
  },
];

export const MOCK_ANALYTICS = {
  kpi: {
    totalQueries: 28450,
    queriesGrowth: '+18% bulan ini',
    activeStudents: 14210,
    studentsGrowth: '+12.4%',
    avgSessionHours: 4.2,
    routeConversions: 6840,
    conversionRate: '24.0%',
  },
  preferences: [
    { label: 'WiFi Cepat (>50 Mbps)', percent: 78, hits: 25100, color: '#0284C7' },
    { label: 'Banyak Colokan Listrik (>80% meja terpasang)', percent: 68, hits: 21880, color: '#F59E0B' },
    { label: 'Ramah Kantong Mahasiswa (< Rp 25.000 / minuman)', percent: 56, hits: 18010, color: '#059669' },
    { label: 'Buka Larut Malam / 24 Jam', percent: 44, hits: 14150, color: '#7C3AED' },
    { label: 'Suasana Tenang / Tidak Berisik (<50 dB)', percent: 39, hits: 12540, color: '#64748B' },
  ],
  peakHours: [
    { label: 'Pagi\n08.00–11.00', percent: 15, isPeak: false },
    { label: 'Siang\n12.00–15.00', percent: 42, isPeak: false },
    { label: 'Sore – Malam\n16.00–21.00', percent: 88, isPeak: true },
    { label: 'Larut Malam\n22.00–02.00', percent: 32, isPeak: false },
  ],
  spatialDensity: [
    { rank: 1, area: 'Dramaga (IPB University)', queries: 11240, note: 'Konsentrasi tinggi mahasiswa vokasi & sarjana (39.5% total kueri)', color: '#005B54' },
    { rank: 2, area: 'Bogor Tengah & Taman Kencana', queries: 8420, note: 'Pusat kafe estetik, kerja kelompok, & co-working space (29.6%)', color: '#0284C7' },
    { rank: 3, area: 'Pajajaran & Lodaya', queries: 5120, note: 'Dekat koridor transportasi (Bis Kita & kos mahasiswa) (18.0%)', color: '#D97706' },
    { rank: 4, area: 'Sentul City / Babakan Madang', queries: 3670, note: 'Tujuan kafe pekon / weekend deep study view pegunungan (12.9%)', color: '#64748B' },
  ],
  topCafes: [
    { rank: 1, name: 'Foresthree Dramaga', address: 'Jl. Raya Dramaga (350m dari Kampus IPB)', clicks: 2140 },
    { rank: 2, name: 'Popolo Coffee Lodaya', address: 'Lodaya, Bogor Tengah', clicks: 1820 },
    { rank: 3, name: 'Anthology Sentul', address: 'Danau Teratai, Babakan Madang', clicks: 1490 },
    { rank: 4, name: 'Raindance Baranangsiang', address: 'Dekat Bis Kita & IPB Baranangsiang', clicks: 1210 },
    { rank: 5, name: 'Kopi Nako', address: 'Jl. Pajajaran Indah V', clicks: 980 },
  ],
};
