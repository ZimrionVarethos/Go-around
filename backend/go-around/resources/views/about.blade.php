@extends('layouts.app')

@section('title', 'Tentang Riset — Go Around WebGIS Kota Bogor')

@section('content')
<div class="max-w-4xl w-full mx-auto px-4 py-8 sm:py-12">
    <!-- Breadcrumb -->
    <a href="{{ route('home') }}" class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#005B54] mb-4 transition-colors">
        <i data-lucide="arrow-left" class="w-4 h-4"></i>
        <span>Kembali ke Peta WebGIS</span>
    </a>

    <!-- Hero Card -->
    <div class="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 sm:p-10 space-y-6">
        <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-[#E0F3EE] text-[#005B54] flex items-center justify-center font-bold">
                <i data-lucide="compass" class="w-7 h-7"></i>
            </div>
            <div>
                <h1 class="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    Tentang Riset Go Around
                </h1>
                <p class="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Platform Geographic Information System (WebGIS) untuk ruang belajar ramah kantong mahasiswa di Kota Bogor
                </p>
            </div>
        </div>

        <div class="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4">
            <p>
                <strong>Go Around</strong> lahir dari permasalahan nyata yang dihadapi mahasiswa di Kota Bogor: kesulitan menemukan tempat nugas dengan metrik terstandarisasi, mulai dari keandalan Wi-Fi, ketersediaan colokan listrik, tingkat kebisingan, hingga batas harga minuman yang ramah kantong.
            </p>
            <p>
                Platform ini mengintegrasikan data geospasial Kota Bogor dengan model <em>Multi-Criteria Decision Making</em> (MCDM) untuk menghitung <strong>Nugas Score</strong> agregat 0 hingga 100 secara dinamis dan transparan.
            </p>
        </div>

        <!-- Scoring Dimensions Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div class="bg-[#F0FAF7] border border-[#A7F3D0] rounded-2xl p-5 space-y-2">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-black text-[#005B54] uppercase tracking-wider">1. Skor Budget &amp; Hemat</span>
                    <span class="text-sm font-black text-[#005B54]">Bobot 35%</span>
                </div>
                <p class="text-xs text-gray-600 leading-relaxed">
                    Menghitung batas harga minuman termurah (&lt; Rp15.000), ada tidaknya diskon KTM mahasiswa, dan biaya parkir motor.
                </p>
            </div>

            <div class="bg-[#F0FAF7] border border-[#A7F3D0] rounded-2xl p-5 space-y-2">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-black text-[#005B54] uppercase tracking-wider">2. Skor Fasilitas &amp; Belajar</span>
                    <span class="text-sm font-black text-[#005B54]">Bobot 30%</span>
                </div>
                <p class="text-xs text-gray-600 leading-relaxed">
                    Kecepatan download Wi-Fi (Mbps) stabil, rasio ketersediaan stopkontak tiap meja, AC dingin, dan status operasional 24 jam.
                </p>
            </div>

            <div class="bg-[#F0FAF7] border border-[#A7F3D0] rounded-2xl p-5 space-y-2">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-black text-[#005B54] uppercase tracking-wider">3. Skor Kenyamanan Suasana</span>
                    <span class="text-sm font-black text-[#005B54]">Bobot 20%</span>
                </div>
                <p class="text-xs text-gray-600 leading-relaxed">
                    Tingkat kebisingan ruang (Quiet / Moderate / Lively), kenyamanan kursi untuk sesi nugas &gt; 3 jam, dan ketersediaan area hening skripsi.
                </p>
            </div>

            <div class="bg-[#F0FAF7] border border-[#A7F3D0] rounded-2xl p-5 space-y-2">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-black text-[#005B54] uppercase tracking-wider">4. Skor Reputasi Komunitas</span>
                    <span class="text-sm font-black text-[#005B54]">Bobot 15%</span>
                </div>
                <p class="text-xs text-gray-600 leading-relaxed">
                    Rating Google Places terverifikasi dan sentimen ulasan positif dari mahasiswa yang telah berkunjung langsung.
                </p>
            </div>
        </div>

        <!-- Academic Accreditation Footer -->
        <div class="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4 text-xs text-gray-600">
            <div>
                <p class="font-bold text-gray-900">Program Riset Mandiri Mahasiswa</p>
                <p class="text-gray-500 mt-0.5">Sekolah Vokasi IPB University &middot; Kota Bogor, Jawa Barat</p>
            </div>
            <a href="{{ route('home') }}" class="px-5 py-2.5 bg-[#005B54] text-white font-bold rounded-xl shadow-xs hover:bg-[#004741] transition-all">
                Jelajahi Peta Sekarang
            </a>
        </div>
    </div>
</div>
@endsection
