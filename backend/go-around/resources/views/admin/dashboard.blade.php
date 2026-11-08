@extends('layouts.admin')

@section('title', 'Admin Dashboard Overview — Go Around Bogor')

@section('admin_content')
<div class="space-y-6 max-w-7xl mx-auto w-full">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight font-['Onest']">
                Dashboard Overview
            </h1>
            <p class="text-xs text-gray-500 mt-1">
                Pemantauan master data spasial, tiket laporan, dan aktivitas nugas mahasiswa Kota Bogor
            </p>
        </div>
        <div class="flex items-center gap-2">
            <a href="{{ route('admin.places') }}" class="px-3.5 py-2 rounded-xl bg-[#005B54] hover:bg-[#004741] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Tambah Kafe Baru</span>
            </a>
        </div>
    </div>

    <!-- 1. Welcome Banner -->
    <div class="bg-gradient-to-r from-[#005B54] to-[#003B37] rounded-2xl p-5 sm:p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="space-y-1.5 max-w-2xl">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-medium backdrop-blur-xs">
                <i data-lucide="sparkles" class="w-3 h-3 text-amber-300"></i>
                <span>Sistem Informasi Geografis Go Around Kota Bogor</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold tracking-tight font-['Onest']">
                Selamat Bertugas, Tim Admin SIG
            </h2>
            <p class="text-sm text-teal-100 font-normal leading-relaxed">
                Terdapat <strong>{{ $tiketTerbuka }} tiket laporan fasilitas</strong> yang membutuhkan validasi teknis dan verifikasi lapangan dari mahasiswa.
            </p>
        </div>

        <div class="flex items-center gap-2.5 shrink-0">
            <a href="{{ route('admin.reports') }}" class="bg-white text-[#005B54] hover:bg-teal-50 active:scale-95 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5">
                <i data-lucide="file-text" class="w-4 h-4"></i>
                <span>Tinjau Laporan</span>
            </a>
            <a href="{{ route('admin.places') }}" class="bg-white/20 hover:bg-white/30 text-white active:scale-95 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all border border-white/20 flex items-center gap-1.5">
                <i data-lucide="coffee" class="w-4 h-4"></i>
                <span>Kelola Kafe</span>
            </a>
        </div>
    </div>

    <!-- 2. 4 KPI Grid Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- KPI 1: Total Kafe -->
        <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-500">Total Tempat Nugas</span>
                <div class="w-9 h-9 rounded-xl bg-teal-50 text-[#005B54] flex items-center justify-center">
                    <i data-lucide="coffee" class="w-5 h-5"></i>
                </div>
            </div>
            <div class="mt-3 flex items-baseline gap-2">
                <span class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {{ $totalKafe }}
                </span>
                <span class="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                    <i data-lucide="trending-up" class="w-3 h-3"></i>
                    +12% bln ini
                </span>
            </div>
            <p class="text-[11px] text-gray-400 mt-2 truncate">
                Tervalidasi & tampil di WebGIS publik
            </p>
        </div>

        <!-- KPI 2: Tiket Laporan -->
        <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-500">Tiket Terbuka</span>
                <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <i data-lucide="alert-triangle" class="w-5 h-5"></i>
                </div>
            </div>
            <div class="mt-3 flex items-baseline gap-2">
                <span class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {{ $tiketTerbuka }}
                </span>
                <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Perlu Validasi
                </span>
            </div>
            <p class="text-[11px] text-gray-400 mt-2 truncate">
                Koreksi colokan, Wi-Fi & operasional
            </p>
        </div>

        <!-- KPI 3: Usulan Baru -->
        <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-500">Usulan Spot Baru</span>
                <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <i data-lucide="map-pin" class="w-5 h-5"></i>
                </div>
            </div>
            <div class="mt-3 flex items-baseline gap-2">
                <span class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {{ $usulanBaru }}
                </span>
                <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    Antrean Masuk
                </span>
            </div>
            <p class="text-[11px] text-gray-400 mt-2 truncate">
                Usulan crowdsourcing dari mahasiswa
            </p>
        </div>

        <!-- KPI 4: Kunjungan -->
        <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-500">Kunjungan WebGIS</span>
                <div class="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <i data-lucide="users" class="w-5 h-5"></i>
                </div>
            </div>
            <div class="mt-3 flex items-baseline gap-2">
                <span class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    4,820
                </span>
                <span class="text-xs text-gray-500 font-medium">
                    +24% pekan ini
                </span>
            </div>
            <p class="text-[11px] text-gray-400 mt-2 truncate">
                Mahasiswa IPB & pencari kafe nugas
            </p>
        </div>
    </div>

    <!-- 3. 2-Column Section: Recent Tickets & Top Places -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Tickets (2 Cols) -->
        <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                    <h3 class="text-base font-bold text-gray-900 flex items-center gap-2 font-['Onest']">
                        <i data-lucide="file-text" class="w-4 h-4 text-[#005B54]"></i>
                        Tiket Laporan & Validasi Fasilitas
                    </h3>
                    <p class="text-xs text-gray-500 mt-0.5">
                        Laporan masuk dari mahasiswa untuk pembaruan data WebGIS
                    </p>
                </div>
                <a href="{{ route('admin.reports') }}" class="text-xs font-semibold text-[#005B54] hover:text-[#004741] flex items-center gap-1 transition-colors">
                    <span>Lihat Semua</span>
                    <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
                </a>
            </div>

            <!-- Tickets List -->
            <div class="space-y-3">
                @forelse($recentTickets as $ticket)
                    <div class="p-4 rounded-xl border transition-all {{ $ticket->status === 'resolved' ? 'bg-emerald-50/40 border-emerald-200' : ($ticket->status === 'dismissed' ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-200/90 hover:border-gray-300 shadow-2xs') }}">
                        <div class="flex items-start justify-between gap-3">
                            <div class="space-y-1 flex-1">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                                        {{ $ticket->ticket_code }}
                                    </span>
                                    <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full {{ $ticket->priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700' }}">
                                        {{ $ticket->category }}
                                    </span>
                                    <span class="text-xs text-gray-400 flex items-center gap-1">
                                        <i data-lucide="clock" class="w-3 h-3"></i>
                                        {{ $ticket->created_at->diffForHumans() }}
                                    </span>
                                </div>
                                <h4 class="text-sm font-bold text-gray-900 mt-1">
                                    {{ $ticket->cafe_name }}
                                </h4>
                                <p class="text-xs text-gray-600 leading-relaxed">
                                    {{ $ticket->description }}
                                </p>
                            </div>

                            <!-- Action buttons -->
                            <div class="shrink-0 flex items-center gap-1.5 pt-1">
                                @if($ticket->status === 'resolved')
                                    <span class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                                        <i data-lucide="check" class="w-3.5 h-3.5"></i> Selesai
                                    </span>
                                @elseif($ticket->status === 'dismissed')
                                    <span class="text-xs text-gray-400 italic">Diabaikan</span>
                                @else
                                    <form action="{{ route('admin.reports.resolve', $ticket->id) }}" method="POST">
                                        @csrf
                                        <button type="submit" title="Tandai Selesai" class="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer">
                                            <i data-lucide="check" class="w-4 h-4"></i>
                                        </button>
                                    </form>
                                    <form action="{{ route('admin.reports.dismiss', $ticket->id) }}" method="POST">
                                        @csrf
                                        <button type="submit" title="Abaikan Laporan" class="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer">
                                            <i data-lucide="x" class="w-4 h-4"></i>
                                        </button>
                                    </form>
                                @endif
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="text-center py-8 text-xs text-gray-400">
                        Belum ada tiket laporan masuk.
                    </div>
                @endforelse
            </div>
        </div>

        <!-- Top Places & Spatial Breakdown (1 Col) -->
        <div class="space-y-6">
            <!-- Top Places List -->
            <div class="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2 font-['Onest']">
                        <i data-lucide="coffee" class="w-4 h-4 text-[#005B54]"></i>
                        Master Spot Nugas Teratas
                    </h3>
                    <a href="{{ route('admin.places') }}" class="text-[11px] font-semibold text-[#005B54] hover:underline">
                        Kelola ({{ $totalKafe }})
                    </a>
                </div>

                <div class="space-y-2.5">
                    @forelse($recentPlaces as $idx => $p)
                        <div class="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center gap-1.5">
                                    <span class="text-[10px] font-bold text-gray-400">#{{ $idx + 1 }}</span>
                                    <h5 class="text-xs font-bold text-gray-900 truncate">
                                        {{ $p->name }}
                                    </h5>
                                </div>
                                <p class="text-[11px] text-gray-500 truncate mt-0.5">
                                    {{ $p->address }}
                                </p>
                            </div>

                            <div class="shrink-0 flex items-center gap-2 pl-3">
                                <span class="text-xs font-bold text-[#005B54] bg-teal-50 px-2 py-0.5 rounded-md">
                                    ★ {{ number_format($p->nugas_score / 10, 1) }}
                                </span>
                            </div>
                        </div>
                    @empty
                        <div class="text-center py-4 text-xs text-gray-400">
                            Belum ada kafe terdaftar.
                        </div>
                    @endforelse
                </div>

                <a href="{{ route('admin.places') }}" class="block text-center text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 py-2.5 rounded-xl border border-gray-200 transition-colors">
                    Buka Master Data Kafe →
                </a>
            </div>

            <!-- Spatial Density Breakdown -->
            <div class="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 space-y-3">
                <h4 class="text-xs font-bold text-gray-900 flex items-center gap-2 font-['Onest']">
                    <i data-lucide="map-pin" class="w-4 h-4 text-[#005B54]"></i>
                    Sebaran Titik per Wilayah
                </h4>

                <div class="space-y-2 text-xs">
                    <div class="flex items-center justify-between">
                        <span class="text-gray-600">Babakan Madang & Sentul</span>
                        <span class="font-bold text-gray-900">6 Kafe (38%)</span>
                    </div>
                    <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-[#005B54] rounded-full" style="width: 38%;"></div>
                    </div>

                    <div class="flex items-center justify-between pt-1">
                        <span class="text-gray-600">Bogor Tengah & Timur</span>
                        <span class="font-bold text-gray-900">6 Kafe (38%)</span>
                    </div>
                    <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-teal-600 rounded-full" style="width: 38%;"></div>
                    </div>

                    <div class="flex items-center justify-between pt-1">
                        <span class="text-gray-600">Dramaga (IPB University)</span>
                        <span class="font-bold text-gray-900">4 Kafe (24%)</span>
                    </div>
                    <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-emerald-500 rounded-full" style="width: 24%;"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
