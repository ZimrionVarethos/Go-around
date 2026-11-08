'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  MapPin,
  Wifi,
  Zap,
  Volume2,
  DollarSign,
  Compass,
  Database,
  ExternalLink,
  ArrowRight,
  Globe2,
  BookOpen,
  ShieldCheck,
  ChevronRight,
  Coffee,
  Users,
  Moon,
  Laptop,
  Bus,
  CheckCircle2,
  Sparkles,
  Signal,
} from 'lucide-react';
import { PublicFooter } from '@/components/layout/PublicFooter';

// ── Vibe / Kategori Nugas Data with Visual Spec Chips ──
const STUDY_VIBES = [
  {
    id: 'work-friendly',
    title: 'Work-Friendly & Laptop Space',
    icon: Laptop,
    badge: 'Paling Diminati',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    tagline: 'Dirancang khusus untuk laptopan berjam-jam tanpa khawatir kehabisan baterai.',
    specs: [
      { label: 'Ketersediaan Daya', level: 'Sangat Melimpah', status: 'optimal', desc: 'Colokan di >75% meja' },
      { label: 'Kestabilan Internet', level: 'Ultra-Fast 50+ Mbps', status: 'optimal', desc: 'Lancar video meeting' },
      { label: 'Kenyamanan Meja', level: 'Ergonomis Tinggi', status: 'optimal', desc: 'Kursi busa & meja proporsional' },
      { label: 'Ambiens Suara', level: 'Kondusif Sedang', status: 'good', desc: 'Obrolan wajar & musik tenang' },
    ],
    features: [
      'Stopkontak aktif di hampir setiap meja (rasio >75%)',
      'Tinggi meja dan kursi standar ergonomis untuk mengetik lama',
      'Wi-Fi stabil dengan bandwidth upload lancar untuk video call',
      'Pencahayaan terang dan sirkulasi pendingin ruangan sejuk',
    ],
    idealFor: 'Mengerjakan coding, analisis geospasial SIG, desain grafis, dan skripsi.',
    spots: ['Jl. Pajajaran Tengah', 'Jl. Bangbarung Raya', 'Suryakencana'],
  },
  {
    id: 'quiet-focus',
    title: 'Focus & Quiet Zone (Zona Hening)',
    icon: BookOpen,
    badge: 'Kondusif Skripsi',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-300',
    tagline: 'Ambiens tenang bebas kebisingan musik keras untuk konsentrasi tinggi.',
    specs: [
      { label: 'Ambiens Suara', level: 'Hening Total (35–45 dB)', status: 'optimal', desc: 'Bebas live music & bising' },
      { label: 'Privasi Ruang', level: 'Jarak Meja Luas', status: 'optimal', desc: 'Sudut baca menyendiri' },
      { label: 'Kestabilan Internet', level: 'Stabil 30+ Mbps', status: 'good', desc: 'Lancar riset jurnal e-book' },
      { label: 'Ketersediaan Daya', level: 'Tersedia di Meja Baca', status: 'good', desc: 'Stopkontak di meja khusus' },
    ],
    features: [
      'Tingkat kebisingan rendah (tanpa live music atau lagu bervolume tinggi)',
      'Jarak antar meja renggang untuk menjaga privasi membaca dan belajar',
      'Banyak sudut baca dengan pencahayaan hangat yang nyaman di mata',
      'Budaya saling menjaga ketenangan sesama pengunjung',
    ],
    idealFor: 'Membaca jurnal ilmiah, menyusun bab skripsi, dan belajar mandiri sebelum ujian.',
    spots: ['Babakan Heritage', 'Sempur Asri', 'Kawasan Bogor Selatan'],
  },
  {
    id: 'group-discussion',
    title: 'Group Discussion & Collab Hub',
    icon: Users,
    badge: 'Kerja Kelompok',
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-300',
    tagline: 'Ruang komunal luas yang fleksibel untuk diskusi tugas kelompok dan proyek.',
    specs: [
      { label: 'Kapasitas Meja', level: 'Meja Komunal 6–8 Orang', status: 'optimal', desc: 'Cocok tim proyek PJBL' },
      { label: 'Toleransi Obrolan', level: 'Aktif Diperbolehkan', status: 'optimal', desc: 'Area semi-outdoor luas' },
      { label: 'Menu Sharing', level: 'Paket Hemat Pelajar', status: 'optimal', desc: 'Cemilan & minuman pitcher' },
      { label: 'Ketersediaan Daya', level: 'Stopkontak Sentral', status: 'good', desc: 'Tersedia di pilar meja' },
    ],
    features: [
      'Meja panjang komunal yang mampu menampung 4 hingga 8 mahasiswa',
      'Area semi-outdoor yang leluasa untuk bertukar ide dan presentasi',
      'Pilihan paket minuman dan cemilan hemat untuk sharing',
      'Fasilitas musholla dan area parkir motor luas',
    ],
    idealFor: 'Kerja kelompok PJBL, rapat panitia organisasi, dan brainstorming proyek.',
    spots: ['Jl. Pandu Raya', 'Tegal Gundil', 'Kawasan Air Mancur'],
  },
  {
    id: 'night-owl',
    title: 'Night Owl & Buka Larut Malam',
    icon: Moon,
    badge: 'Kejar Deadline',
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-300',
    tagline: 'Pilihan penyelamat saat butuh tempat nugas tengah malam hingga subuh.',
    specs: [
      { label: 'Jam Buka', level: 'Hingga 24.00 / 24 Jam', status: 'optimal', desc: 'Nonstop melayani begadang' },
      { label: 'Keamanan Lokasi', level: 'Parkir Dijaga Ketat', status: 'optimal', desc: 'Staf siaga sepanjang malam' },
      { label: 'Trafik Internet', level: 'Sangat Kencang Malam', status: 'optimal', desc: 'Bandwidth kosong & ngebut' },
      { label: 'Ketersediaan Daya', level: 'Aktif Sepanjang Malam', status: 'good', desc: 'Stopkontak siap pakai' },
    ],
    features: [
      'Jam operasional hingga pukul 24.00 atau buka 24 jam nonstop',
      'Staf dan barista siaga dengan keamanan parkir kendaraan yang aman',
      'Koneksi internet stabil saat malam hari dengan traffic lancar',
      'Pilihan kopi hangat dan makanan pengganjal perut untuk begadang',
    ],
    idealFor: 'Kejar deadline tugas tengah malam dan persiapan ujian esok pagi.',
    spots: ['Pajajaran Utara', 'Sukasari', 'Pusat Kota Bogor'],
  },
];

// ── Facility Tier Cards Data ──
const FACILITY_TIERS = [
  {
    id: 'plug',
    name: 'Kepadatan Stopkontak / Colokan',
    icon: Zap,
    theme: 'amber',
    tag: 'Daya Laptop',
    tiers: [
      {
        title: 'Banyak Meja',
        pct: '45%',
        sub: '>70% meja ada colokan',
        desc: 'Tersedia stopkontak di setiap deret meja. Sangat aman untuk laptopan berjam-jam.',
        badge: 'Sangat Direkomendasikan',
        badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
      {
        title: 'Meja Tertentu',
        pct: '38%',
        sub: 'Dekat pilar / dinding / bar',
        desc: 'Stopkontak tersedia di meja tepi atau area kerja khusus. Sebaiknya datang lebih awal.',
        badge: 'Cukup Nyaman',
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      },
      {
        title: 'Minim Colokan',
        pct: '17%',
        sub: '<30% meja / area outdoor',
        desc: 'Kerap diperuntukkan untuk nongkrong santai. Pastikan baterai laptop sudah penuh.',
        badge: 'Perlu Powerbank',
        badgeClass: 'bg-stone-100 text-stone-700 border-stone-300',
      },
    ],
    insight: '83% kafe di Kota Bogor yang terpetakan menyediakan stopkontak yang memadai bagi mahasiswa.',
  },
  {
    id: 'wifi',
    name: 'Kecepatan & Stabilitas Wi-Fi',
    icon: Wifi,
    theme: 'sky',
    tag: 'Konektivitas',
    tiers: [
      {
        title: 'Super Kencang (>50 Mbps)',
        pct: '52%',
        sub: 'Bandwidth dedicated fiber',
        desc: 'Sangat lancar untuk video call, download dataset SIG, hingga streaming perkuliahan daring.',
        badge: 'Optimal Riset & Zoom',
        badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
      {
        title: 'Stabil Menengah (20–50 Mbps)',
        pct: '36%',
        sub: 'Browsing & riset reguler',
        desc: 'Koneksi stabil untuk membuka Google Drive, Notion, dan mencari referensi e-book jurnal.',
        badge: 'Lancar Browsing',
        badgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
      },
      {
        title: 'Kecepatan Dasar (<10 Mbps)',
        pct: '12%',
        sub: 'Akses pesan & dokumen ringan',
        desc: 'Cukup untuk kirim pesan WhatsApp dan chat, kurang cocok untuk download file berukuran besar.',
        badge: 'Kebutuhan Dasar',
        badgeClass: 'bg-stone-100 text-stone-700 border-stone-300',
      },
    ],
    insight: 'Mayoritas kafe di sepanjang koridor Pajajaran dan Bangbarung memiliki kecepatan di atas 30 Mbps.',
  },
  {
    id: 'quiet',
    name: 'Karakteristik Akustik & Suasana',
    icon: Volume2,
    theme: 'emerald',
    tag: 'Kenyamanan',
    tiers: [
      {
        title: 'Kondusif Belajar (50–65 dB)',
        pct: '48%',
        sub: 'Musik tenang & obrolan santai',
        desc: 'Suasana paling umum dengan musik latar instrumental. Nyaman untuk belajar maupun diskusi.',
        badge: 'Paling Seimbang',
        badgeClass: 'bg-teal-100 text-teal-900 border-teal-300',
      },
      {
        title: 'Zona Hening (35–45 dB)',
        pct: '34%',
        sub: 'Bebas live music & hening',
        desc: 'Tingkat suara sangat rendah. Sangat cocok bagi mahasiswa yang butuh konsentrasi tinggi.',
        badge: 'Khusus Skripsi',
        badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
      {
        title: 'Social Hub (>70 dB)',
        pct: '18%',
        sub: 'Suasana ramai / obrolan aktif',
        desc: 'Lebih condong ke tempat nongkrong komunal atau memiliki panggung pertunjukan musik.',
        badge: 'Kurang untuk Fokus',
        badgeClass: 'bg-stone-100 text-stone-700 border-stone-300',
      },
    ],
    insight: 'Filter suasana Go-around memudahkanmu menghindari kafe yang terlalu bising saat butuh ketenangan.',
  },
  {
    id: 'price',
    name: 'Transparansi Bujet Mahasiswa',
    icon: DollarSign,
    theme: 'violet',
    tag: 'Finansial',
    tiers: [
      {
        title: 'Hemat Pelajar (< Rp 20.000)',
        pct: '42%',
        sub: 'Kopi susu / teh / espresso',
        desc: 'Paling ramah di kantong mahasiswa untuk nugas harian tanpa membuat pengeluaran bengkak.',
        badge: 'Sangat Hemat',
        badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
      {
        title: 'Standar Menengah (Rp 20–35 rb)',
        pct: '46%',
        sub: 'Minuman kopi artisan / cemilan',
        desc: 'Rentang harga rata-rata kafe modern Kota Bogor dengan fasilitas ruang kerja yang lengkap.',
        badge: 'Harga Wajar',
        badgeClass: 'bg-violet-100 text-violet-900 border-violet-300',
      },
      {
        title: 'Spesialti Premium (> Rp 35.000)',
        pct: '12%',
        sub: 'Kopi biji impor / menu signature',
        desc: 'Pilihan untuk sesekali saat ingin menikmati cita rasa kopi spesialti atau suasana eksklusif.',
        badge: 'Premium Experience',
        badgeClass: 'bg-stone-100 text-stone-700 border-stone-300',
      },
    ],
    insight: 'Gunakan filter "Paling Hemat" di peta untuk langsung menyaring kafe di bawah Rp 20.000.',
  },
];

// ── Spatial Ranking Grid Data ──
const DISTRICT_RANKINGS = [
  {
    id: 'tengah',
    rank: '#1',
    name: 'Bogor Tengah',
    cafes: '850+ Titik',
    pct: '29% dari total',
    densityTag: 'Kepadatan Tertinggi',
    tagClass: 'bg-emerald-100 text-emerald-900',
    transit: 'Biskita K1 & K2',
    campus: 'IPB Kampus Baranangsiang & Pascasarjana',
    desc: 'Episentrum utama ruang nugas Kota Bogor dengan pilihan kafe heritage hingga modern di sekitar SSA & Kebun Raya Bogor.',
    hotspots: ['Babakan', 'Sempur', 'Suryakencana', 'Paledang'],
  },
  {
    id: 'timur',
    rank: '#2',
    name: 'Bogor Timur',
    cafes: '620+ Titik',
    pct: '21% dari total',
    densityTag: 'Koridor Transit Utama',
    tagClass: 'bg-teal-100 text-teal-900',
    transit: 'Jalur Pajajaran & Tol Jagorawi',
    campus: 'Akses cepat IPB Baranangsiang & Pakuan',
    desc: 'Koridor coffee shop berkapasitas besar dengan area kerja luas, Wi-Fi kencang, dan jam buka panjang hingga malam.',
    hotspots: ['Jl. Pajajaran', 'Sukasari', 'Baranangsiang Indah', 'Katulampa'],
  },
  {
    id: 'utara',
    rank: '#3',
    name: 'Bogor Utara',
    cafes: '540+ Titik',
    pct: '19% dari total',
    densityTag: 'Hub Kampus Vokasi',
    tagClass: 'bg-sky-100 text-sky-900',
    transit: 'Biskita Koridor 2 & Cilibende',
    campus: 'Sekolah Vokasi IPB (Kampus Cilibende)',
    desc: 'Pusat tongkrongan dan nugas mahasiswa Vokasi IPB. Penuh kedai kopi ramah kantong mahasiswa.',
    hotspots: ['Cilibende', 'Bangbarung', 'Pandu Raya', 'Tegal Gundil'],
  },
  {
    id: 'barat',
    rank: '#4',
    name: 'Bogor Barat',
    cafes: '410+ Titik',
    pct: '14% dari total',
    densityTag: 'Akses Kampus Dramaga',
    tagClass: 'bg-indigo-100 text-indigo-900',
    transit: 'Terminal Bubulak & Rute Dramaga',
    campus: 'Koridor menuju Kampus Utama IPB Dramaga',
    desc: 'Kawasan barat dengan suasana asri, kafe semi-outdoor yang sejuk, dan harga menu yang bersahabat.',
    hotspots: ['Dramaga Border', 'Bubulak', 'Cilendek', 'Semplek'],
  },
  {
    id: 'sareal',
    rank: '#5',
    name: 'Tanah Sareal',
    cafes: '330+ Titik',
    pct: '11% dari total',
    densityTag: 'Zona Minimalis Modern',
    tagClass: 'bg-amber-100 text-amber-900',
    transit: 'Stasiun KRL Cilebut & Sholeh Iskandar',
    campus: 'Univ. Ibnu Khaldun (UIKA)',
    desc: 'Kawasan yang berkembang pesat dengan coffee shop minimalis modern yang tenang untuk belajar mandiri.',
    hotspots: ['Kebon Pedes', 'Jl. Sholeh Iskandar', 'Kayumanis'],
  },
  {
    id: 'selatan',
    rank: '#6',
    name: 'Bogor Selatan',
    cafes: '220+ Titik',
    pct: '8% dari total',
    densityTag: 'Zona Sejuk Alami',
    tagClass: 'bg-stone-200 text-stone-800',
    transit: 'Stasiun Batutulis & Koridor Cipaku',
    campus: 'Jalur sejuk kaki Gunung Salak',
    desc: 'Menyuguhkan pemandangan alam dan udara sejuk pegunungan yang sangat kondusif untuk membaca referensi tanpa bising kota.',
    hotspots: ['Batutulis', 'Cipaku', 'Pamoyanan', 'Bondongan'],
  },
];

export default function TentangRisetPage() {
  const [activeVibe, setActiveVibe] = useState(STUDY_VIBES[0].id);
  const [activeFacility, setActiveFacility] = useState(FACILITY_TIERS[0].id);
  const [selectedDistrict, setSelectedDistrict] = useState(DISTRICT_RANKINGS[0].id);

  const currentVibe = STUDY_VIBES.find((v) => v.id === activeVibe) || STUDY_VIBES[0];
  const currentFacility = FACILITY_TIERS.find((f) => f.id === activeFacility) || FACILITY_TIERS[0];
  const currentDistrict = DISTRICT_RANKINGS.find((d) => d.id === selectedDistrict) || DISTRICT_RANKINGS[0];

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-slate-800 flex flex-col font-sans selection:bg-[#005B54]/15 selection:text-[#005B54]">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-bold text-stone-700 hover:text-[#005B54] bg-white hover:bg-stone-100 rounded-xl border border-stone-200 transition-all shadow-2xs shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Peta</span>
            </Link>
            <span className="text-stone-300 hidden sm:inline">/</span>
            <span className="text-sm font-semibold text-stone-600 hidden sm:inline">
              Panduan Ruang Belajar Mahasiswa
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="hidden sm:inline">PJBL SIG 2026 &bull;</span>
            <span>Sekolah Vokasi IPB</span>
          </div>
        </div>
      </header>

      {/* ── Sticky Subnav Quick Links ── */}
      <nav className="bg-white border-b border-stone-200 sticky top-16 z-30 overflow-x-auto no-scrollbar shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-3 py-2.5 text-sm font-semibold text-stone-600 whitespace-nowrap">
          <span className="text-xs uppercase tracking-wider font-extrabold text-stone-400 mr-1 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#005B54]" /> Lompat ke:
          </span>
          <a href="#latar-belakang" className="px-3 py-1.5 rounded-lg hover:bg-stone-100 hover:text-[#005B54] transition-colors">
            1. Mengapa Go-around?
          </a>
          <a href="#fasilitas-visual" className="px-3 py-1.5 rounded-lg hover:bg-stone-100 hover:text-[#005B54] transition-colors">
            2. Meteran Fasilitas
          </a>
          <a href="#kategori-nugas" className="px-3 py-1.5 rounded-lg hover:bg-stone-100 hover:text-[#005B54] transition-colors">
            3. Profil Tempat Nugas
          </a>
          <a href="#sebaran-wilayah" className="px-3 py-1.5 rounded-lg hover:bg-stone-100 hover:text-[#005B54] transition-colors">
            4. Sebaran 6 Kecamatan
          </a>
          <a href="#akses-kampus" className="px-3 py-1.5 rounded-lg hover:bg-stone-100 hover:text-[#005B54] transition-colors">
            5. Akses Kampus IPB
          </a>
          <a href="#kolofon" className="px-3 py-1.5 rounded-lg hover:bg-stone-100 hover:text-[#005B54] transition-colors">
            6. Kolofon Tim
          </a>
        </div>
      </nav>

      {/* ── Main Content Container ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex-1 w-full space-y-16">
        
        {/* ── HERO SECTION ── */}
        <section className="relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#005B54]/10 border border-[#005B54]/20 text-[#005B54] text-xs sm:text-sm font-bold mb-4">
            <Globe2 className="w-4 h-4" />
            <span>WebGIS Tempat Nugas Ramah Mahasiswa Kota Bogor</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-[1.15] mb-5">
            Panduan Ruang Belajar &amp; Kafe Ramah Mahasiswa di Kota Bogor
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-3xl mb-8">
            Dokumentasi inisiatif <strong className="text-[#005B54] font-bold">Go-around</strong> dalam memetakan lebih dari 2.900 ruang belajar di sekeliling kawasan kampus IPB University, berbasis fasilitas riil yang dibutuhkan mahasiswa: stopkontak, Wi-Fi cepat, ketenangan akustik, dan bujet terjangkau.
          </p>

          {/* Key Metrics Highlight Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-[#005B54]/40 transition-all">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Cakupan Tempat</span>
                <Database className="w-5 h-5 text-[#005B54]" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#005B54]">2.900+</div>
              <p className="text-sm text-stone-500 font-medium mt-1">Kafe &amp; ruang komunal terpetakan</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-[#005B54]/40 transition-all">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Wilayah Studi</span>
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-stone-900">6</div>
              <p className="text-sm text-stone-500 font-medium mt-1">Kecamatan administratif Kota Bogor</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-[#005B54]/40 transition-all">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Fasilitas Inti</span>
                <Coffee className="w-5 h-5 text-teal-600" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#005B54]">5 Kategori</div>
              <p className="text-sm text-stone-500 font-medium mt-1">Colokan, Wi-Fi, akustik, bujet, jam</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-[#005B54]/40 transition-all">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Sistem Peta</span>
                <Globe2 className="w-5 h-5 text-sky-600" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-stone-900">WGS 84</div>
              <p className="text-sm text-stone-500 font-medium mt-1">Geolokasi presisi titik perangkat</p>
            </div>
          </div>
        </section>

        {/* ── SECTION 1: WHY GO-AROUND (GAP ANALYSIS) ── */}
        <section id="latar-belakang" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 rounded-xl bg-[#005B54] text-white flex items-center justify-center text-sm font-bold shadow-xs">1</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Mengapa Go-around? Kesenjangan Mesin Pencari Konvensional
            </h2>
          </div>
          <p className="text-base text-stone-600 leading-relaxed mb-6 max-w-4xl">
            Google Maps dan platform komersial lainnya umumnya mengoptimalkan pencarian untuk makan dan nongkrong umum. Kebutuhan spesifik mahasiswa saat ingin menyelesaikan tugas kuliah sering kali tidak terpetakan dengan baik:
          </p>

          {/* Clean Modern Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Colokan */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-stone-900">Ketersediaan Stopkontak / Colokan</h3>
                      <span className="text-xs font-semibold text-stone-400">Daya Listrik Laptop &amp; Gadget</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                    Kritis
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-900">
                    <strong className="block text-xs uppercase font-extrabold tracking-wider text-rose-700 mb-1">Mesin Pencari Biasa:</strong>
                    Hanya menampilkan ulasan teks acak, tidak diketahui apakah meja memiliki colokan aktif sebelum tiba di lokasi.
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-950">
                    <strong className="block text-xs uppercase font-extrabold tracking-wider text-emerald-700 mb-1">Solusi Go-around WebGIS:</strong>
                    Rasio ketersediaan stopkontak terverifikasi: Banyak Meja (&gt;70%), Meja Tertentu, atau Minim Colokan.
                  </div>
                </div>
              </div>
            </div>

            {/* Wi-Fi */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                      <Wifi className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-stone-900">Kestabilan Wi-Fi Mahasiswa</h3>
                      <span className="text-xs font-semibold text-stone-400">Kecepatan &amp; Kestabilan Akses</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full">
                    Esensial
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-900">
                    <strong className="block text-xs uppercase font-extrabold tracking-wider text-rose-700 mb-1">Mesin Pencari Biasa:</strong>
                    Sekadar label &quot;Free Wi-Fi&quot; tanpa jaminan apakah bandwidth cukup untuk meeting Zoom atau download jurnal riset.
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-950">
                    <strong className="block text-xs uppercase font-extrabold tracking-wider text-emerald-700 mb-1">Solusi Go-around WebGIS:</strong>
                    Kategori kecepatan riil: Sangat Kencang (&gt;50 Mbps), Stabil Menengah (20–50 Mbps), atau Kecepatan Dasar.
                  </div>
                </div>
              </div>
            </div>

            {/* Suasana Akustik */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Volume2 className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-stone-900">Tingkat Kebisingan Akustik</h3>
                      <span className="text-xs font-semibold text-stone-400">Kondusifitas Fokus Belajar</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                    Kenyamanan
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-900">
                    <strong className="block text-xs uppercase font-extrabold tracking-wider text-rose-700 mb-1">Mesin Pencari Biasa:</strong>
                    Mahasiswa kerap terjebak di kafe dengan live music keras saat butuh keheningan total untuk menyusun skripsi.
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-950">
                    <strong className="block text-xs uppercase font-extrabold tracking-wider text-emerald-700 mb-1">Solusi Go-around WebGIS:</strong>
                    Klasifikasi suasana: Zona Hening &amp; Fokus, Kondusif Belajar Santai, atau Social Hub / Obrolan Ramai.
                  </div>
                </div>
              </div>
            </div>

            {/* Bujet */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-stone-900">Transparansi Bujet Mahasiswa</h3>
                      <span className="text-xs font-semibold text-stone-400">Rentang Harga Menu Kopi &amp; Makanan</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-violet-100 text-violet-800 px-2.5 py-1 rounded-full">
                    Ekonomis
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-900">
                    <strong className="block text-xs uppercase font-extrabold tracking-wider text-rose-700 mb-1">Mesin Pencari Biasa:</strong>
                    Hanya ada tanda samar ($$) tanpa perkiraan batas biaya pengeluaran per satu sesi nugas mahasiswa.
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-950">
                    <strong className="block text-xs uppercase font-extrabold tracking-wider text-emerald-700 mb-1">Solusi Go-around WebGIS:</strong>
                    Rentang biaya jelas per sesi: Kategori Hemat (&lt; Rp 20.000), Menengah (Rp 20–35 rb), dan Spesialti.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: STAT CARDS & TIER BREAKDOWN (VARIATIVE UI) ── */}
        <section id="fasilitas-visual" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 rounded-xl bg-[#005B54] text-white flex items-center justify-center text-sm font-bold shadow-xs">2</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Karakteristik &amp; Sebaran Fasilitas Nugas
            </h2>
          </div>
          <p className="text-base text-stone-600 leading-relaxed mb-6 max-w-4xl">
            Pilih parameter fasilitas di bawah untuk melihat rincian kategori dan persentase sebaran kafe di Kota Bogor:
          </p>

          {/* Interactive Facility Selector Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {FACILITY_TIERS.map((f) => {
              const IconComp = f.icon;
              const isActive = activeFacility === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFacility(f.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-[#005B54] text-white shadow-sm'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{f.name.split(' ')[0]} {f.name.split(' ')[1] || ''}</span>
                </button>
              );
            })}
          </div>

          {/* 3-Column Comparative Tier Cards */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {currentFacility.tiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:border-[#005B54]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${tier.badgeClass}`}>
                        {tier.badge}
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-[#005B54] font-mono">
                        {tier.pct}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1">
                      {tier.title}
                    </h3>
                    <span className="text-xs font-semibold text-stone-400 block mb-3">
                      {tier.sub}
                    </span>

                    <p className="text-sm text-stone-600 leading-relaxed">
                      {tier.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-500">
                    <span className="flex items-center gap-1.5">
                      <Signal className="w-3.5 h-3.5 text-[#005B54]" />
                      <span>Kategori #{idx + 1}</span>
                    </span>
                    <span className="text-[#005B54] font-semibold">Tercatat di Peta</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Insight Banner */}
            <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-center gap-3.5 shadow-2xs">
              <Sparkles className="w-5 h-5 text-[#005B54] shrink-0" />
              <p className="text-sm font-semibold text-teal-950 leading-relaxed">
                {currentFacility.insight}
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: 4 KARAKTERISTIK RUANG NUGAS (SPEC CHIPS UI) ── */}
        <section id="kategori-nugas" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 rounded-xl bg-[#005B54] text-white flex items-center justify-center text-sm font-bold shadow-xs">3</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              4 Profil Karakteristik Tempat Nugas Pilihan
            </h2>
          </div>
          <p className="text-base text-stone-600 leading-relaxed mb-6 max-w-4xl">
            Pilih kategori nugas sesuai gaya belajarmu untuk melihat rincian spesifikasi fasilitas dan rekomendasi klaster lokasinya:
          </p>

          {/* Vibe Selector Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
            {STUDY_VIBES.map((vibe) => {
              const IconComp = vibe.icon;
              const isActive = activeVibe === vibe.id;
              return (
                <button
                  key={vibe.id}
                  type="button"
                  onClick={() => setActiveVibe(vibe.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-4 ${
                    isActive
                      ? 'bg-white border-[#005B54] shadow-md ring-2 ring-[#005B54]/20'
                      : 'bg-stone-50 border-stone-200 hover:bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-[#005B54] text-white' : 'bg-stone-200 text-stone-700'
                    }`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${vibe.badgeColor}`}>
                      {vibe.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 leading-snug">{vibe.title.split('&')[0]}</h4>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Vibe Detail Card with Spec Chips */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-stone-100">
              <div>
                <span className="text-xs font-bold text-[#005B54] uppercase tracking-wider block">
                  Profil Ruang Belajar
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                  {currentVibe.title}
                </h3>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${currentVibe.badgeColor} self-start sm:self-auto`}>
                {currentVibe.badge}
              </span>
            </div>

            <p className="text-base text-stone-600 leading-relaxed mb-8">
              {currentVibe.tagline}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Spec Chips Grid */}
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-400 block pb-1 border-b border-stone-100">
                  Spesifikasi &amp; Tolok Ukur Fasilitas
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {currentVibe.specs.map((spec, i) => (
                    <div key={i} className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-xs font-semibold text-stone-500 block mb-1">
                        {spec.label}
                      </span>
                      <span className="text-sm font-black text-stone-900 block mb-1">
                        {spec.level}
                      </span>
                      <span className="text-xs text-stone-500 block">
                        {spec.desc}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 mt-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 block mb-1">
                    Paling Pas Untuk:
                  </span>
                  <p className="text-sm font-bold text-emerald-950">
                    {currentVibe.idealFor}
                  </p>
                </div>
              </div>

              {/* Right Column: Features Checklist & Spots */}
              <div className="lg:col-span-6 space-y-5 text-sm">
                <div className="p-5 rounded-2xl bg-white border border-stone-200">
                  <h4 className="text-xs uppercase font-extrabold text-stone-400 mb-3 tracking-wider">
                    Ciri Utama &amp; Fasilitas
                  </h4>
                  <ul className="space-y-3">
                    {currentVibe.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-stone-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-stone-500">Rekomendasi Klaster:</span>
                  {currentVibe.spots.map((spot) => (
                    <span key={spot} className="px-3 py-1 bg-white border border-stone-200 rounded-lg font-bold text-stone-800 text-xs shadow-2xs">
                      📍 {spot}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: SPATIAL RANKING & DENSITY GRID (#1 s/d #6) ── */}
        <section id="sebaran-wilayah" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 rounded-xl bg-[#005B54] text-white flex items-center justify-center text-sm font-bold shadow-xs">4</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Sebaran Geospasial 6 Kecamatan Kota Bogor
            </h2>
          </div>
          <p className="text-base text-stone-600 leading-relaxed mb-6 max-w-4xl">
            Peringkat kepadatan ruang nugas dan klaster kafe di seluruh wilayah administratif Kota Bogor:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: 6 Ranking Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {DISTRICT_RANKINGS.map((d) => {
                const isSelected = selectedDistrict === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDistrict(d.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-white border-[#005B54] shadow-md ring-2 ring-[#005B54]/20'
                        : 'bg-stone-50 border-stone-200 hover:bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                        {d.rank}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${d.tagClass}`}>
                        {d.densityTag}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-stone-900 leading-snug">{d.name}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-stone-500">
                        <span className="text-[#005B54] font-bold">{d.cafes}</span>
                        <span>&bull;</span>
                        <span>{d.pct}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200 text-[11px] font-medium text-stone-500 flex items-center justify-between">
                      <span>{d.transit}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Detailed District Inspection Card */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex justify-between items-start pb-4 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-[#005B54] text-white">
                      {currentDistrict.rank}
                    </span>
                    <span className="text-xs font-bold text-[#005B54] uppercase tracking-wider">
                      Detail Kawasan
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-stone-900 mt-1">
                    Kecamatan {currentDistrict.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-[#005B54] block">
                    {currentDistrict.cafes}
                  </span>
                  <span className="text-xs font-semibold text-stone-400">
                    {currentDistrict.pct}
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                {currentDistrict.desc}
              </p>

              <div className="space-y-3 text-sm">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-xs uppercase font-extrabold text-stone-400 block mb-1">
                    Titik Kampus &amp; Akademik
                  </span>
                  <p className="font-bold text-stone-900">{currentDistrict.campus}</p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-xs uppercase font-extrabold text-stone-400 block mb-1">
                    Akses Transportasi Publik
                  </span>
                  <p className="font-bold text-stone-900">{currentDistrict.transit}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-stone-500">Klaster Jalan Terkenal:</span>
                {currentDistrict.hotspots.map((h) => (
                  <span key={h} className="px-2.5 py-1 bg-stone-100 font-semibold text-stone-700 rounded-md">
                    📍 {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: CAMPUS & TRANSIT CONNECTIVITY ── */}
        <section id="akses-kampus" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 rounded-xl bg-[#005B54] text-white flex items-center justify-center text-sm font-bold shadow-xs">5</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Akses Kampus IPB &amp; Koridor Transit Biskita Transpakuan
            </h2>
          </div>
          <p className="text-base text-stone-600 leading-relaxed mb-6 max-w-4xl">
            Integrasi spasial titik nugas dengan jalur transportasi publik utama Kota Bogor:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Campus 1 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#005B54] flex items-center justify-center font-bold mb-4">
                  <Bus className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-1">IPB Kampus Baranangsiang</h3>
                <span className="text-xs font-bold text-stone-400 block uppercase mb-3">Bogor Tengah &bull; Terminal Baranangsiang</span>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Terhubung langsung dengan koridor Biskita K1 dan K2. Dikelilingi kafe di Jl. Pajajaran dan kawasan Babakan yang dapat dijangkau 5–10 menit jalan kaki.
                </p>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs text-stone-700 font-semibold">
                Rekomendasi: Spot nugas di Babakan &amp; Pajajaran Tengah.
              </div>
            </div>

            {/* Campus 2 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#005B54] flex items-center justify-center font-bold mb-4">
                  <Bus className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-1">Sekolah Vokasi IPB (Cilibende)</h3>
                <span className="text-xs font-bold text-stone-400 block uppercase mb-3">Bogor Utara &bull; Jl. Kumbang &amp; Cilibende</span>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Pusat aktivitas ribuan mahasiswa vokasi. Dikelilingi sentra kuliner dan kafe hemat di sepanjang Jl. Bangbarung dan Jl. Pandu Raya.
                </p>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs text-stone-700 font-semibold">
                Rekomendasi: Kafe ramah kantong di Bangbarung &amp; Pandu Raya.
              </div>
            </div>

            {/* Campus 3 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#005B54] flex items-center justify-center font-bold mb-4">
                  <Bus className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-1">IPB Kampus Utama Dramaga</h3>
                <span className="text-xs font-bold text-stone-400 block uppercase mb-3">Lingkar Kampus &bull; Perbatasan Barat</span>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Akses transit dari Terminal Bubulak. Pilihan kafe bernuansa hijau terbuka dan kedai kopi santai di sepanjang jalur lingkar Dramaga.
                </p>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs text-stone-700 font-semibold">
                Rekomendasi: Kafe semi-outdoor di koridor Bubulak–Dramaga.
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: CROWDSOURCING & VOLUNTEERED GEOGRAPHIC INFORMATION (VGI) ── */}
        <section className="bg-stone-100/80 rounded-2xl border border-stone-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-6 h-6 text-[#005B54]" />
            <h3 className="text-xl font-bold text-stone-900">
              Pembaruan Berkelanjutan dari Mahasiswa
            </h3>
          </div>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-6">
            Dinamika kafe di lapangan selalu berubah: colokan dapat rusak, password Wi-Fi berganti, dan jam operasional berubah saat masa liburan semester. Kamu bisa membantu sesama mahasiswa melalui partisipasi data:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/lapor-fasilitas"
              className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-[#005B54] transition-all group flex items-start gap-4 shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#005B54] flex items-center justify-center font-bold text-base shrink-0 mt-0.5">
                📝
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#005B54] transition-colors flex items-center gap-1.5">
                  <span>Modul Lapor Fasilitas</span>
                  <ChevronRight className="w-4 h-4" />
                </h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Laporkan jika ada colokan yang mati, Wi-Fi lambat, atau perubahan jam operasional kafe.
                </p>
              </div>
            </Link>

            <Link
              href="/tambah-tempat"
              className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-[#005B54] transition-all group flex items-start gap-4 shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#005B54] flex items-center justify-center font-bold text-base shrink-0 mt-0.5">
                ➕
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#005B54] transition-colors flex items-center gap-1.5">
                  <span>Modul Tambah Tempat Baru</span>
                  <ChevronRight className="w-4 h-4" />
                </h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Daftarkan tempat nugas favoritmu yang belum terdaftar di peta Go-around.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* ── SECTION 7: ACADEMIC COLOPHON & TECH STACK ── */}
        <section id="kolofon" className="scroll-mt-24 border-t border-stone-200 pt-10">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-stone-100">
              <div>
                <span className="text-xs font-bold text-[#005B54] uppercase tracking-wider block">
                  Atribusi Proyek Akademik
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                  Kolofon Proyek PJBL SIG 2026
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold">
                <span>Sekolah Vokasi IPB University &bull; 2026</span>
              </div>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed mb-6">
              Platform WebGIS ini dikembangkan dalam rangka <strong>Project-Based Learning (PJBL)</strong> mata kuliah <strong>Sistem Informasi Geografis (SIG)</strong> pada Program Pendidikan Vokasi, <strong>Sekolah Vokasi Institut Pertanian Bogor (IPB University)</strong>, tahun akademik 2026.
            </p>

            {/* Tech Stack Pills */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-stone-400 block">
                Teknologi yang Digunakan
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-700">
                <span className="px-3 py-1.5 bg-stone-100 rounded-lg font-bold border border-stone-200">Next.js 16 (App Router)</span>
                <span className="px-3 py-1.5 bg-stone-100 rounded-lg font-bold border border-stone-200">React 19</span>
                <span className="px-3 py-1.5 bg-stone-100 rounded-lg font-bold border border-stone-200">TypeScript 5</span>
                <span className="px-3 py-1.5 bg-stone-100 rounded-lg font-bold border border-stone-200">Tailwind CSS 4</span>
                <span className="px-3 py-1.5 bg-stone-100 rounded-lg font-bold border border-stone-200">React Leaflet 5</span>
                <span className="px-3 py-1.5 bg-stone-100 rounded-lg font-bold border border-stone-200">OpenStreetMap (OSM)</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── CALL TO ACTION SECTION ── */}
        <section className="bg-gradient-to-r from-[#005B54] to-[#004741] text-white rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
              Siap Menemukan Tempat Nugas Ideal?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Eksplorasi Peta WebGIS Go-around Sekarang
            </h3>
            <p className="text-emerald-100 text-sm max-w-xl">
              Cari kafe dengan colokan melimpah, Wi-Fi kencang, dan harga mahasiswa di sekitarmu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#005B54] hover:bg-stone-100 text-sm font-black transition-all shadow-md"
            >
              <span>Buka Peta WebGIS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://saweria.co/goaround"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#FAAE2B] hover:bg-[#F59E0B] text-gray-900 text-sm font-black transition-all shadow-md"
            >
              <Image src="/saweria.png" alt="Saweria" width={20} height={20} className="w-5 h-5 object-contain" />
              <span>Dukung Riset</span>
              <ExternalLink className="w-4 h-4 opacity-80" />
            </a>
          </div>
        </section>

      </main>

      {/* Global Public Footer */}
      <PublicFooter />
    </div>
  );
}
