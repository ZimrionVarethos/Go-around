@extends('layouts.admin')

@section('title', 'Kelola Master Kafe GIS — Go Around Bogor')

@section('admin_content')
<div class="space-y-6 max-w-7xl mx-auto w-full"
     x-data="{ 
        addModalOpen: false,
        syncModalOpen: false,
        editModalOpen: false,
        isSyncing: false,
        editingPlace: {
            id: null,
            code: '',
            name: '',
            address: '',
            subdistrict: 'Bogor Tengah',
            latitude: -6.595,
            longitude: 106.790,
            price_min_drink: 20000,
            wifi_speed_mbps: 50,
            plug_availability: 'moderate',
            noise_level: 'moderate',
            nugas_score: '8.8',
            is_24_hours: false,
            image_url: '',
            status: 'active'
        },
        openEdit(p) {
            this.editingPlace = {
                id: p.id,
                code: p.code || ('KF-' + String(p.id).padStart(3, '0')),
                name: p.name,
                address: p.address,
                subdistrict: p.subdistrict,
                latitude: p.latitude,
                longitude: p.longitude,
                price_min_drink: p.price_min_drink,
                wifi_speed_mbps: p.wifi_speed_mbps,
                plug_availability: p.plug_availability || 'moderate',
                noise_level: p.noise_level || 'moderate',
                nugas_score: (p.nugas_score > 10 ? p.nugas_score / 10 : p.nugas_score).toFixed(1),
                is_24_hours: Boolean(p.is_24_hours),
                image_url: p.image_url || '',
                status: p.status
            };
            this.editModalOpen = true;
        }
     }">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight font-['Onest']">
                Kelola Kafe & Master Data GIS
            </h1>
            <p class="text-xs text-gray-500 mt-1">
                Moderasi katalog tempat nugas, scraping sinkronisasi real-time, dan edit data kafe secara manual
            </p>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
            <!-- Sync / Scraping Button -->
            <button
                type="button"
                @click="syncModalOpen = true"
                class="px-3.5 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
                <i data-lucide="cloud-download" class="w-4 h-4 text-[#005B54]"></i>
                <span>Sinkronisasi / Scraping (Real-Time)</span>
            </button>

            <!-- Add Button -->
            <button
                type="button"
                @click="addModalOpen = true"
                class="px-4 py-2.5 rounded-xl bg-[#005B54] hover:bg-[#004741] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Tambah Kafe Baru</span>
            </button>
        </div>
    </div>

    <!-- KPI Summary Row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs">
            <span class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Total Kafe di Database</span>
            <span class="text-2xl font-bold text-gray-900 mt-1 block">{{ $places->total() }}</span>
        </div>
        <div class="bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs">
            <span class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Aktif & Terverifikasi</span>
            <span class="text-2xl font-bold text-emerald-600 mt-1 block">{{ $places->where('status', 'active')->count() }}</span>
        </div>
        <div class="bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs">
            <span class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Menunggu Review</span>
            <span class="text-2xl font-bold text-amber-600 mt-1 block">{{ $places->where('status', 'pending')->count() }}</span>
        </div>
        <div class="bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs">
            <span class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Rata-rata Skor Nugas</span>
            <span class="text-2xl font-bold text-[#005B54] mt-1 block">★ 9.2</span>
        </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-2xs space-y-3">
        <form method="GET" action="{{ route('admin.places') }}" class="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <!-- Search -->
            <div class="sm:col-span-6 relative">
                <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                <input
                    type="text"
                    name="search"
                    value="{{ request('search') }}"
                    placeholder="Cari kode KF, nama kafe, atau jalan..."
                    class="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all"
                >
            </div>

            <!-- District Filter -->
            <div class="sm:col-span-3">
                <select
                    name="district"
                    class="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all text-gray-700"
                    onchange="this.form.submit()"
                >
                    <option value="">Semua Wilayah / Kecamatan</option>
                    @foreach($districts as $d)
                        <option value="{{ $d }}" {{ request('district') === $d ? 'selected' : '' }}>{{ $d }}</option>
                    @endforeach
                </select>
            </div>

            <!-- Status Filter -->
            <div class="sm:col-span-3 flex gap-2">
                <select
                    name="status"
                    class="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all text-gray-700"
                    onchange="this.form.submit()"
                >
                    <option value="">Semua Status</option>
                    <option value="verified" {{ request('status') === 'verified' ? 'selected' : '' }}>Terverifikasi (Aktif)</option>
                    <option value="review" {{ request('status') === 'review' ? 'selected' : '' }}>Menunggu Review</option>
                    <option value="rejected" {{ request('status') === 'rejected' ? 'selected' : '' }}>Ditolak (Nonaktif)</option>
                </select>

                @if(request()->anyFilled(['search', 'district', 'status']))
                    <a href="{{ route('admin.places') }}" class="p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-xl flex items-center justify-center shrink-0" title="Reset filter">
                        <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
                    </a>
                @endif
            </div>
        </form>
    </div>

    <!-- Places Table Card -->
    <div class="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead class="bg-gray-50/80 border-b border-gray-200/80 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                        <th class="px-5 py-3.5">Kode & Kafe</th>
                        <th class="px-4 py-3.5">Wilayah</th>
                        <th class="px-4 py-3.5">Fasilitas Nugas</th>
                        <th class="px-4 py-3.5">Harga Min</th>
                        <th class="px-4 py-3.5">Skor GIS</th>
                        <th class="px-4 py-3.5">Status</th>
                        <th class="px-5 py-3.5 text-right">Aksi & Edit Manual</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @forelse($places as $place)
                        <tr class="hover:bg-gray-50/70 transition-colors">
                            <!-- Code & Name -->
                            <td class="px-5 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                                        @if($place->image_url)
                                            <img src="{{ $place->image_url }}" alt="{{ $place->name }}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                                            <div class="hidden w-full h-full bg-gray-100 items-center justify-center">
                                                <i data-lucide="coffee" class="w-4 h-4 text-gray-400 stroke-[1.5]"></i>
                                            </div>
                                        @else
                                            <i data-lucide="coffee" class="w-4 h-4 text-gray-400 stroke-[1.5]"></i>
                                        @endif
                                    </div>
                                    <div class="min-w-0">
                                        <div class="flex items-center gap-1.5">
                                            <span class="font-mono text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                                {{ $place->code ?: 'KF-' . str_pad($place->id, 3, '0', STR_PAD_LEFT) }}
                                            </span>
                                            <h4 class="font-bold text-gray-900 truncate">{{ $place->name }}</h4>
                                        </div>
                                        <p class="text-[11px] text-gray-500 truncate max-w-xs mt-0.5">{{ $place->address }}</p>
                                    </div>
                                </div>
                            </td>

                            <!-- District -->
                            <td class="px-4 py-4 whitespace-nowrap">
                                <span class="text-xs font-semibold text-gray-700">{{ $place->subdistrict }}</span>
                                <span class="block text-[10px] text-gray-400">Kota Bogor</span>
                            </td>

                            <!-- Facilities -->
                            <td class="px-4 py-4 whitespace-nowrap">
                                <div class="flex items-center gap-2 text-[11px]">
                                    <span class="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                                        <i data-lucide="wifi" class="w-3 h-3"></i>
                                        {{ $place->wifi_speed_mbps }} Mbps
                                    </span>
                                    @if($place->is_24_hours)
                                        <span class="inline-flex items-center gap-0.5 text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                            24 Jam
                                        </span>
                                    @endif
                                </div>
                            </td>

                            <!-- Price -->
                            <td class="px-4 py-4 whitespace-nowrap font-medium text-gray-700">
                                Rp {{ number_format($place->price_min_drink, 0, ',', '.') }}
                            </td>

                            <!-- GIS Score -->
                            <td class="px-4 py-4 whitespace-nowrap">
                                <span class="inline-flex items-center gap-1 text-xs font-bold text-[#005B54] bg-[#E0F3EE] px-2.5 py-0.5 rounded-lg">
                                    ★ {{ number_format($place->nugas_score / 10, 1) }}
                                </span>
                            </td>

                            <!-- Status -->
                            <td class="px-4 py-4 whitespace-nowrap">
                                @if($place->status === 'active' || $place->status === 'verified')
                                    <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                        <i data-lucide="check-circle" class="w-3 h-3"></i> Terverifikasi
                                    </span>
                                @elseif($place->status === 'pending' || $place->status === 'review')
                                    <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                                        <i data-lucide="clock" class="w-3 h-3"></i> Menunggu Review
                                    </span>
                                @else
                                    <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                                        <i data-lucide="x-circle" class="w-3 h-3"></i> Nonaktif
                                    </span>
                                @endif
                            </td>

                            <!-- Actions & Manual Edit -->
                            <td class="px-5 py-4 whitespace-nowrap text-right">
                                <div class="inline-flex items-center gap-1.5">
                                    <!-- Edit Button (Pencil) -->
                                    <button
                                        type="button"
                                        @click="openEdit({{ json_encode([
                                            'id' => $place->id,
                                            'code' => $place->code ?: 'KF-' . str_pad($place->id, 3, '0', STR_PAD_LEFT),
                                            'name' => $place->name,
                                            'address' => $place->address,
                                            'subdistrict' => $place->subdistrict,
                                            'latitude' => (float)$place->latitude,
                                            'longitude' => (float)$place->longitude,
                                            'price_min_drink' => (int)$place->price_min_drink,
                                            'wifi_speed_mbps' => (int)$place->wifi_speed_mbps,
                                            'plug_availability' => $place->plug_availability,
                                            'noise_level' => $place->noise_level,
                                            'nugas_score' => (float)$place->nugas_score,
                                            'is_24_hours' => (bool)$place->is_24_hours,
                                            'image_url' => $place->image_url,
                                            'status' => $place->status,
                                        ]) }})"
                                        title="Edit Manual Data Kafe"
                                        class="p-1.5 rounded-lg bg-teal-50 text-[#005B54] hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer"
                                    >
                                        <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                                    </button>

                                    @if($place->status === 'pending' || $place->status === 'review')
                                        <form action="{{ route('admin.places.verify', $place->id) }}" method="POST">
                                            @csrf
                                            <button type="submit" title="Verifikasi Spot" class="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer">
                                                <i data-lucide="check" class="w-3.5 h-3.5"></i>
                                            </button>
                                        </form>
                                        <form action="{{ route('admin.places.reject', $place->id) }}" method="POST">
                                            @csrf
                                            <button type="submit" title="Tolak Usulan" class="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer">
                                                <i data-lucide="slash" class="w-3.5 h-3.5"></i>
                                            </button>
                                        </form>
                                    @endif

                                    <form action="{{ route('admin.places.delete', $place->id) }}" method="POST" onsubmit="return confirm('Apakah Anda yakin ingin menghapus kafe {{ $place->name }} dari master data?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" title="Hapus Kafe" class="p-1.5 rounded-lg bg-gray-50 text-rose-500 hover:bg-rose-50 hover:text-rose-700 border border-gray-200 transition-colors cursor-pointer">
                                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="px-5 py-12 text-center text-gray-400">
                                Tidak ada kafe yang cocok dengan filter.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($places->hasPages())
            <div class="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                {{ $places->links() }}
            </div>
        @endif
    </div>

    <!-- 1. Modal Sinkronisasi / Scraping Kafe (Real-Time) -->
    <div
        x-show="syncModalOpen"
        class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        style="display: none;"
    >
        <div
            @click.away="syncModalOpen = false"
            class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
        >
            <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-xl bg-teal-50 text-[#005B54] flex items-center justify-center">
                        <i data-lucide="cloud-download" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-base text-gray-900 font-['Onest']">Sinkronisasi / Scraping Kafe</h3>
                        <p class="text-[11px] text-gray-400">Ambil data kafe terbaru secara real-time ke GIS</p>
                    </div>
                </div>
                <button type="button" @click="syncModalOpen = false" class="text-gray-400 hover:text-gray-600 cursor-pointer">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <form action="{{ route('admin.places.sync') }}" method="POST" @submit="isSyncing = true" class="space-y-4">
                @csrf

                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1.5">Sumber Data Scraping</label>
                    <select name="source" class="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                        <option value="all" selected>🌟 Semua Sumber (OSM Real-Time + Kurasi Mahasiswa Bogor)</option>
                        <option value="osm">🗺️ OpenStreetMap Real-Time (Nominatim Search API)</option>
                        <option value="curated">☕ Kurasi Kafe Populer Bogor (IPB, Sentul, Pajajaran)</option>
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1.5">Jumlah Maksimal Data</label>
                    <select name="limit" class="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                        <option value="20">20 Kafe</option>
                        <option value="40" selected>40 Kafe (Rekomendasi)</option>
                        <option value="80">80 Kafe</option>
                    </select>
                </div>

                <div class="p-3 rounded-xl bg-teal-50 border border-teal-200 text-[11px] text-teal-900 space-y-1">
                    <div class="font-bold flex items-center gap-1 text-[#005B54]">
                        <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
                        <span>Proteksi Duplikasi Otomatis:</span>
                    </div>
                    <p class="text-teal-800">
                        Sistem secara otomatis mendeteksi kemiripan nama dan jarak koordinat spasial (&lt;35m) sehingga tidak ada data ganda.
                    </p>
                </div>

                <div class="flex items-center justify-end gap-2 pt-2">
                    <button type="button" @click="syncModalOpen = false" class="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer">
                        Batal
                    </button>
                    <button
                        type="submit"
                        :disabled="isSyncing"
                        class="px-5 py-2.5 rounded-xl bg-[#005B54] hover:bg-[#004741] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                        <span x-show="!isSyncing">Mulai Scraping & Sinkronisasi</span>
                        <span x-show="isSyncing" style="display: none;">Sedang Menghubungkan ke OSM...</span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- 2. Modal Edit Manual Kafe -->
    <div
        x-show="editModalOpen"
        class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        style="display: none;"
    >
        <div
            @click.away="editModalOpen = false"
            class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
        >
            <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-teal-50 text-[#005B54] flex items-center justify-center">
                        <i data-lucide="edit-3" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-base text-gray-900 font-['Onest']">Edit Manual Kafe</h3>
                        <p class="text-[11px] text-gray-400">Kode: <span class="font-mono font-bold text-gray-700" x-text="editingPlace.code"></span></p>
                    </div>
                </div>
                <button type="button" @click="editModalOpen = false" class="text-gray-400 hover:text-gray-600 cursor-pointer">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <form :action="'/admin/places/' + editingPlace.id" method="POST" class="space-y-4">
                @csrf

                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">Nama Tempat / Kafe *</label>
                    <input type="text" name="name" x-model="editingPlace.name" required class="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">Kecamatan / Wilayah *</label>
                        <select name="subdistrict" x-model="editingPlace.subdistrict" required class="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                            <option value="Babakan Madang">Babakan Madang (Sentul)</option>
                            <option value="Bogor Tengah">Bogor Tengah</option>
                            <option value="Bogor Timur">Bogor Timur</option>
                            <option value="Bogor Utara">Bogor Utara</option>
                            <option value="Bogor Barat">Bogor Barat</option>
                            <option value="Bogor Selatan">Bogor Selatan</option>
                            <option value="Dramaga">Dramaga (IPB)</option>
                            <option value="Tanah Sareal">Tanah Sareal</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">Status Publikasi</label>
                        <select name="status" x-model="editingPlace.status" required class="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                            <option value="active">Terverifikasi (Tampil di WebGIS)</option>
                            <option value="pending">Menunggu Review</option>
                            <option value="inactive">Nonaktif / Ditolak</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">Alamat Lengkap *</label>
                    <textarea name="address" x-model="editingPlace.address" required rows="2" class="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]"></textarea>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">Latitude (Lintang) *</label>
                        <input type="number" step="any" name="latitude" x-model="editingPlace.latitude" required class="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">Longitude (Bujur) *</label>
                        <input type="number" step="any" name="longitude" x-model="editingPlace.longitude" required class="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">Harga Min (Rp)</label>
                        <input type="number" name="price_min_drink" x-model="editingPlace.price_min_drink" class="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">Wi-Fi (Mbps)</label>
                        <input type="number" name="wifi_speed_mbps" x-model="editingPlace.wifi_speed_mbps" class="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">Skor Nugas</label>
                        <input type="number" step="0.1" name="nugas_score" x-model="editingPlace.nugas_score" placeholder="9.2" class="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">Ketersediaan Colokan</label>
                        <select name="plug_availability" x-model="editingPlace.plug_availability" class="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                            <option value="abundant">Banyak (Hampir di setiap meja)</option>
                            <option value="moderate">Sedang (Beberapa meja)</option>
                            <option value="rare">Sedikit (Terbatas)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">Tingkat Kebisingan</label>
                        <select name="noise_level" x-model="editingPlace.noise_level" class="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                            <option value="quiet">Hening / Tenang</option>
                            <option value="moderate">Sedang (Musik latar)</option>
                            <option value="lively">Ramai / Hidup</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">URL Foto Kafe</label>
                    <input type="url" name="image_url" x-model="editingPlace.image_url" class="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                </div>

                <div class="flex items-center gap-2 pt-1">
                    <input type="checkbox" name="is_24_hours" value="1" id="edit_is_24_hours" :checked="editingPlace.is_24_hours" class="rounded text-[#005B54] focus:ring-[#005B54]/20">
                    <label for="edit_is_24_hours" class="text-xs font-medium text-gray-700 cursor-pointer">Buka 24 Jam</label>
                </div>

                <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button type="button" @click="editModalOpen = false" class="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer">
                        Batal
                    </button>
                    <button type="submit" class="px-5 py-2 rounded-xl bg-[#005B54] hover:bg-[#004741] text-white text-xs font-bold transition-all shadow-xs cursor-pointer">
                        Simpan Perubahan Manual
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- 3. Modal Tambah Kafe Baru -->
    <div
        x-show="addModalOpen"
        class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        style="display: none;"
    >
        <div
            @click.away="addModalOpen = false"
            class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
        >
            <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-[#E0F3EE] text-[#005B54] flex items-center justify-center">
                        <i data-lucide="coffee" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-base text-gray-900 font-['Onest']">Tambah Kafe ke Master Data</h3>
                        <p class="text-[11px] text-gray-400">Data akan langsung tersimpan dan aktif di peta publik</p>
                    </div>
                </div>
                <button type="button" @click="addModalOpen = false" class="text-gray-400 hover:text-gray-600 cursor-pointer">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <form action="{{ route('admin.places.store') }}" method="POST" class="space-y-4">
                @csrf

                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">Nama Tempat / Kafe *</label>
                    <input type="text" name="name" required placeholder="Contoh: Anthology Coffee & Tea" class="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">Kecamatan *</label>
                        <select name="subdistrict" required class="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                            <option value="Babakan Madang">Babakan Madang (Sentul)</option>
                            <option value="Bogor Tengah">Bogor Tengah</option>
                            <option value="Bogor Timur">Bogor Timur</option>
                            <option value="Bogor Utara">Bogor Utara</option>
                            <option value="Bogor Barat">Bogor Barat</option>
                            <option value="Bogor Selatan">Bogor Selatan</option>
                            <option value="Dramaga">Dramaga (IPB)</option>
                            <option value="Tanah Sareal">Tanah Sareal</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">Harga Min Minuman (Rp)</label>
                        <input type="number" name="price_min_drink" value="20000" class="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">Alamat Lengkap *</label>
                    <textarea name="address" required rows="2" placeholder="Jl. Danau Teratai No. 1, Sentul..." class="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]"></textarea>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">Latitude (Lintang) *</label>
                        <input type="number" step="any" name="latitude" value="-6.5891" required class="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">Longitude (Bujur) *</label>
                        <input type="number" step="any" name="longitude" value="106.8732" required class="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">Kecepatan Wi-Fi (Mbps)</label>
                        <input type="number" name="wifi_speed_mbps" value="50" class="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">Ketersediaan Colokan</label>
                        <select name="plug_availability" class="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                            <option value="abundant">Banyak (Hampir di setiap meja)</option>
                            <option value="moderate" selected>Sedang (Beberapa meja)</option>
                            <option value="rare">Sedikit (Terbatas)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">URL Foto Kafe</label>
                    <input type="url" name="image_url" placeholder="https://images.unsplash.com/..." class="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]">
                </div>

                <div class="flex items-center gap-2 pt-1">
                    <input type="checkbox" name="is_24_hours" value="1" id="is_24_hours" class="rounded text-[#005B54] focus:ring-[#005B54]/20">
                    <label for="is_24_hours" class="text-xs font-medium text-gray-700 cursor-pointer">Buka 24 Jam</label>
                </div>

                <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button type="button" @click="addModalOpen = false" class="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer">
                        Batal
                    </button>
                    <button type="submit" class="px-5 py-2 rounded-xl bg-[#005B54] hover:bg-[#004741] text-white text-xs font-bold transition-all shadow-xs cursor-pointer">
                        Simpan ke Master Data
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
