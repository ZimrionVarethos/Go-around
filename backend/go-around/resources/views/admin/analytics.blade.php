@extends('layouts.admin')

@section('title', 'Analisis Spasial & Pengguna — Go Around Bogor')

@section('admin_content')
<div class="space-y-6 max-w-7xl mx-auto w-full">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight font-['Onest']">
                Analisis Spasial & Perilaku Pengguna
            </h1>
            <p class="text-xs text-gray-500 mt-1">
                Wawasan analitik preferensi mahasiswa, jam puncak nugas, dan sebaran geografis kafe Kota Bogor
            </p>
        </div>
        <div class="flex items-center gap-2">
            <a href="/api/v1/analytics/geojson" download="bogor-cafes.geojson" class="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5">
                <i data-lucide="download" class="w-4 h-4 text-[#005B54]"></i>
                <span>Unduh GeoJSON Kafe</span>
            </a>
        </div>
    </div>

    <!-- 4 KPI Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs">
            <span class="text-xs font-semibold text-gray-500 block">Total Kueri Pencarian</span>
            <div class="mt-2 flex items-baseline gap-2">
                <span class="text-2xl font-extrabold text-gray-900">12,450</span>
                <span class="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                    <i data-lucide="trending-up" class="w-3 h-3"></i> +18%
                </span>
            </div>
            <p class="text-[11px] text-gray-400 mt-1">Interaksi mahasiswa bulan ini</p>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs">
            <span class="text-xs font-semibold text-gray-500 block">Rata-rata Durasi Nugas</span>
            <div class="mt-2 flex items-baseline gap-2">
                <span class="text-2xl font-extrabold text-[#005B54]">3.8 Jam</span>
                <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800">Stabil</span>
            </div>
            <p class="text-[11px] text-gray-400 mt-1">Berdasarkan survei mahasiswa IPB</p>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs">
            <span class="text-xs font-semibold text-gray-500 block">Kriteria Terpopuler</span>
            <div class="mt-2 flex items-baseline gap-2">
                <span class="text-xl font-extrabold text-gray-900">Banyak Colokan</span>
            </div>
            <p class="text-[11px] text-gray-400 mt-1">Dipilih 94% mahasiswa saat filtering</p>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs">
            <span class="text-xs font-semibold text-gray-500 block">Integrasi Biskita</span>
            <div class="mt-2 flex items-baseline gap-2">
                <span class="text-2xl font-extrabold text-purple-700">42% Kafe</span>
            </div>
            <p class="text-[11px] text-gray-400 mt-1">&lt;350 meter dari halte Biskita</p>
        </div>
    </div>

    <!-- 2-Column: Preferences & Peak Hours -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Student Preferences -->
        <div class="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                    <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2 font-['Onest']">
                        <i data-lucide="sliders" class="w-4 h-4 text-[#005B54]"></i>
                        Prioritas Kriteria Mahasiswa
                    </h3>
                    <p class="text-xs text-gray-500 mt-0.5">Persentase bobot yang dipilih pengguna pada rekomendasi</p>
                </div>
            </div>

            <div class="space-y-4 pt-1">
                <div>
                    <div class="flex justify-between text-xs font-semibold mb-1">
                        <span class="text-gray-700">Colokan Banyak & Mudah Dijangkau</span>
                        <span class="text-[#005B54] font-bold">94%</span>
                    </div>
                    <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-[#005B54] rounded-full" style="width: 94%;"></div>
                    </div>
                </div>

                <div>
                    <div class="flex justify-between text-xs font-semibold mb-1">
                        <span class="text-gray-700">Koneksi Wi-Fi Stabil (&gt;50 Mbps)</span>
                        <span class="text-teal-600 font-bold">89%</span>
                    </div>
                    <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-teal-600 rounded-full" style="width: 89%;"></div>
                    </div>
                </div>

                <div>
                    <div class="flex justify-between text-xs font-semibold mb-1">
                        <span class="text-gray-700">Suasana Kondusif (Hening / Chill)</span>
                        <span class="text-emerald-500 font-bold">78%</span>
                    </div>
                    <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-emerald-500 rounded-full" style="width: 78%;"></div>
                    </div>
                </div>

                <div>
                    <div class="flex justify-between text-xs font-semibold mb-1">
                        <span class="text-gray-700">Harga Ramah Kantong (&lt;Rp 25.000)</span>
                        <span class="text-amber-500 font-bold">65%</span>
                    </div>
                    <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-amber-500 rounded-full" style="width: 65%;"></div>
                    </div>
                </div>

                <div>
                    <div class="flex justify-between text-xs font-semibold mb-1">
                        <span class="text-gray-700">Buka Hingga Tengah Malam / 24 Jam</span>
                        <span class="text-purple-600 font-bold">45%</span>
                    </div>
                    <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-purple-600 rounded-full" style="width: 45%;"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Peak Hours Distribution -->
        <div class="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                    <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2 font-['Onest']">
                        <i data-lucide="clock" class="w-4 h-4 text-[#005B54]"></i>
                        Distribusi Jam Nugas Mahasiswa
                    </h3>
                    <p class="text-xs text-gray-500 mt-0.5">Waktu paling padat aktivitas belajar & pengerjaan skripsi</p>
                </div>
            </div>

            <div class="space-y-4 pt-1">
                <div>
                    <div class="flex justify-between text-xs font-semibold mb-1">
                        <span class="text-gray-700">Pagi (08:00 - 12:00)</span>
                        <span class="text-gray-600 font-bold">25% (Rendah)</span>
                    </div>
                    <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-gray-400 rounded-full" style="width: 25%;"></div>
                    </div>
                </div>

                <div>
                    <div class="flex justify-between text-xs font-semibold mb-1">
                        <span class="text-gray-700">Siang (12:00 - 15:00)</span>
                        <span class="text-blue-600 font-bold">55% (Sedang)</span>
                    </div>
                    <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-500 rounded-full" style="width: 55%;"></div>
                    </div>
                </div>

                <div>
                    <div class="flex justify-between text-xs font-semibold mb-1">
                        <span class="text-gray-700">Sore (15:00 - 18:00) — Selesai Kuliah</span>
                        <span class="text-amber-600 font-bold">85% (Sangat Padat)</span>
                    </div>
                    <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-amber-500 rounded-full" style="width: 85%;"></div>
                    </div>
                </div>

                <div>
                    <div class="flex justify-between text-xs font-semibold mb-1">
                        <span class="text-gray-700">Malam (18:00 - 22:00) — Puncak Nugas</span>
                        <span class="text-rose-600 font-bold">92% (Puncak Tertinggi)</span>
                    </div>
                    <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-rose-500 rounded-full" style="width: 92%;"></div>
                    </div>
                </div>

                <div>
                    <div class="flex justify-between text-xs font-semibold mb-1">
                        <span class="text-gray-700">Larut Malam (22:00 - 02:00) — 24 Jam Spot</span>
                        <span class="text-purple-600 font-bold">40% (Spesifik)</span>
                    </div>
                    <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-purple-600 rounded-full" style="width: 40%;"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Spatial Zones Density -->
    <div class="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 space-y-4">
        <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2 font-['Onest']">
            <i data-lucide="map" class="w-4 h-4 text-[#005B54]"></i>
            Analisis Konsentrasi Spasial Kafe & Transit Kota Bogor
        </h3>
        <p class="text-xs text-gray-500">
            Kepadatan klaster spasial berdasarkan kedekatan dengan koridor Biskita Transpakuan dan radius jalan kaki kampus IPB
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                <div class="flex items-center justify-between">
                    <span class="font-bold text-xs text-gray-900">Klaster Sentul & Babakan</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">Outdoor & Luas</span>
                </div>
                <p class="text-[11px] text-gray-600 leading-relaxed">
                    Dominan kafe bertipe pemandangan alam, tempat duduk luas, cocok untuk tugas kelompok besar.
                </p>
                <div class="text-xs font-bold text-[#005B54]">Kerapatan: 38% Titik Data</div>
            </div>

            <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                <div class="flex items-center justify-between">
                    <span class="font-bold text-xs text-gray-900">Bogor Tengah & Pajajaran</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Transit Terpadu</span>
                </div>
                <p class="text-[11px] text-gray-600 leading-relaxed">
                    Sangat terhubung dengan Koridor 1 & 2 Biskita Transpakuan, colokan melimpah dan Wi-Fi berkecepatan tinggi.
                </p>
                <div class="text-xs font-bold text-[#005B54]">Kerapatan: 38% Titik Data</div>
            </div>

            <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                <div class="flex items-center justify-between">
                    <span class="font-bold text-xs text-gray-900">Dramaga (IPB University)</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">Budget Friendly</span>
                </div>
                <p class="text-[11px] text-gray-600 leading-relaxed">
                    Radius tempuh jalan kaki & motor mahasiswa, minuman mulai Rp 15.000, banyak spot buka 24 jam.
                </p>
                <div class="text-xs font-bold text-[#005B54]">Kerapatan: 24% Titik Data</div>
            </div>
        </div>
    </div>
</div>
@endsection
