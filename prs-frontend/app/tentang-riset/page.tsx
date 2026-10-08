'use client';

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
  ShieldCheck,
  ChevronRight,
  Coffee,
} from 'lucide-react';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { FacilityMetersSection } from '@/components/research/FacilityMetersSection';
import { StudyVibesSection } from '@/components/research/StudyVibesSection';
import { DistrictDistributionSection } from '@/components/research/DistrictDistributionSection';

export default function TentangRisetPage() {
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

        {/* ── SECTION 2: STAT CARDS & TIER BREAKDOWN ── */}
        <FacilityMetersSection />

        {/* ── SECTION 3: 4 KARAKTERISTIK RUANG NUGAS ── */}
        <StudyVibesSection />

        {/* ── SECTION 4 & 5: SPATIAL RANKING 6 KECAMATAN & AKSES KAMPUS/TRANSIT ── */}
        <DistrictDistributionSection />

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
