@extends('layouts.app')

@section('title', 'Tambah & Usulkan Tempat Nugas Baru — Go Around Bogor')

@section('content')
<div class="max-w-4xl w-full mx-auto px-4 py-8 sm:py-12" x-data="tambahTempatApp()">

    <!-- Header Section -->
    <div class="mb-8">
        <a href="{{ route('home') }}" class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#005B54] mb-3 transition-colors">
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
            <span>Kembali ke Peta WebGIS</span>
        </a>
        <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <i data-lucide="map-pin-plus" class="w-5 h-5"></i>
            </div>
            <div>
                <h1 class="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    Tambah &amp; Rekomendasikan Tempat Nugas
                </h1>
                <p class="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Punya spot kafe atau warkop hidden gem ramah kantong di Bogor? Usulkan ke master data spasial kami
                </p>
            </div>
        </div>
    </div>

    <!-- Success Screen -->
    @if(session('success_contribution'))
    <div class="bg-white rounded-3xl border-2 border-[#005B54] p-8 sm:p-12 text-center shadow-xl space-y-4 mb-8">
        <div class="w-16 h-16 rounded-2xl bg-[#E0F3EE] text-[#005B54] flex items-center justify-center mx-auto shadow-xs">
            <i data-lucide="check-circle-2" class="w-8 h-8"></i>
        </div>
        <h2 class="text-2xl font-black text-gray-900">
            Usulan Tempat Berhasil Dikirim!
        </h2>
        <p class="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Terima kasih! Rekomendasi Anda untuk <strong>{{ session('success_contribution')['name'] }}</strong> 
            (Kode: <span class="font-mono font-bold text-[#005B54]">{{ session('success_contribution')['code'] }}</span>) 
            akan diverifikasi oleh tim kurator sebelum diterbitkan ke publik.
        </p>
        <div class="pt-4 flex items-center justify-center gap-3">
            <a href="{{ route('home') }}" class="px-6 py-3 bg-[#005B54] hover:bg-[#004741] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all">
                Kembali ke Peta
            </a>
            <a href="{{ route('contributions.create') }}" class="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs sm:text-sm rounded-xl transition-all">
                Usulkan Tempat Lain
            </a>
        </div>
    </div>
    @endif

    <form action="{{ route('contributions.store') }}" method="POST" class="space-y-6">
        @csrf

        <!-- ── Section 1: Informasi Dasar ── -->
        <section class="bg-white rounded-3xl border border-gray-200/90 shadow-xs p-6 space-y-4">
            <div class="flex items-start gap-3.5">
                <div class="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                </div>
                <div>
                    <h2 class="text-sm sm:text-base font-bold text-gray-900">
                        Informasi Dasar Tempat <span class="text-red-500">*</span>
                    </h2>
                    <p class="text-xs text-gray-500 mt-0.5">Nama, kategori, dan lokasi tempat nugas</p>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="text-xs font-bold text-gray-700 block mb-1">Nama Tempat / Kafe *</label>
                    <input type="text" name="name" required placeholder="Contoh: Kopi Titik Temu Baranangsiang" class="w-full h-11 px-3.5 text-xs sm:text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#005B54]">
                </div>

                <div>
                    <label class="text-xs font-bold text-gray-700 block mb-1">Kategori Tempat</label>
                    <select name="category" class="w-full h-11 px-3 text-xs sm:text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#005B54]">
                        @foreach($categories as $cat)
                            <option value="{{ $cat->slug }}">{{ $cat->name }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="sm:col-span-2">
                    <label class="text-xs font-bold text-gray-700 block mb-1">Alamat Lengkap *</label>
                    <input type="text" name="address" required placeholder="Jl. Pajajaran No. 45, RT 02/RW 05..." class="w-full h-11 px-3.5 text-xs sm:text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#005B54]">
                </div>

                <div>
                    <label class="text-xs font-bold text-gray-700 block mb-1">Kecamatan (Kota Bogor) *</label>
                    <select name="subdistrict" required class="w-full h-11 px-3 text-xs sm:text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#005B54]">
                        @foreach($subdistricts as $sub)
                            <option value="{{ $sub }}">{{ $sub }}</option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label class="text-xs font-bold text-gray-700 block mb-1">Harga Minuman Termurah (Rp)</label>
                    <input type="number" name="price_min_drink" placeholder="15000" class="w-full h-11 px-3.5 text-xs sm:text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#005B54]">
                </div>
            </div>
        </section>

        <!-- ── Section 2: Titik Koordinat Peta GIS ── -->
        <section class="bg-white rounded-3xl border border-gray-200/90 shadow-xs p-6 space-y-4">
            <div class="flex items-start gap-3.5">
                <div class="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                </div>
                <div>
                    <h2 class="text-sm sm:text-base font-bold text-gray-900">
                        Pilih Titik Lokasi di Peta <span class="text-red-500">*</span>
                    </h2>
                    <p class="text-xs text-gray-500 mt-0.5">Klik pada peta di bawah ini untuk menandai posisi akurat</p>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3 text-xs">
                <div>
                    <label class="font-bold text-gray-700 block mb-1">Latitude</label>
                    <input type="text" name="latitude" x-model="lat" readonly class="w-full h-10 px-3 bg-gray-100 border border-gray-200 rounded-xl font-mono text-gray-600">
                </div>
                <div>
                    <label class="font-bold text-gray-700 block mb-1">Longitude</label>
                    <input type="text" name="longitude" x-model="lng" readonly class="w-full h-10 px-3 bg-gray-100 border border-gray-200 rounded-xl font-mono text-gray-600">
                </div>
            </div>

            <!-- Picker Map -->
            <div id="pickerMap" class="w-full h-64 rounded-2xl border border-gray-200 overflow-hidden bg-gray-100 z-10 cursor-crosshair"></div>
            <p class="text-[11px] text-gray-400 italic text-center">Petunjuk: Geser peta dan klik pada titik bangunan kafe yang sesuai.</p>
        </section>

        <!-- ── Section 3: Fasilitas Nugas ── -->
        <section class="bg-white rounded-3xl border border-gray-200/90 shadow-xs p-6 space-y-4">
            <div class="flex items-start gap-3.5">
                <div class="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    3
                </div>
                <div>
                    <h2 class="text-sm sm:text-base font-bold text-gray-900">
                        Kondisi Fasilitas Belajar
                    </h2>
                    <p class="text-xs text-gray-500 mt-0.5">Spesifikasi internet, colokan, dan suasana</p>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label class="text-xs font-bold text-gray-700 block mb-1">Kecepatan Wi-Fi (Mbps)</label>
                    <input type="number" name="wifi_download" placeholder="50" class="w-full h-11 px-3.5 text-xs sm:text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#005B54]">
                </div>

                <div>
                    <label class="text-xs font-bold text-gray-700 block mb-1">Ketersediaan Colokan</label>
                    <select name="plug_availability" class="w-full h-11 px-3 text-xs sm:text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#005B54]">
                        <option value="abundant">Banyak (Hampir tiap meja)</option>
                        <option value="moderate" selected>Cukup (Beberapa meja)</option>
                        <option value="limited">Terbatas</option>
                    </select>
                </div>

                <div>
                    <label class="text-xs font-bold text-gray-700 block mb-1">Tingkat Kebisingan</label>
                    <select name="noise_level" class="w-full h-11 px-3 text-xs sm:text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#005B54]">
                        <option value="quiet">Tenang (Cocok Skripsi)</option>
                        <option value="moderate" selected>Sedang (Diskusi / Musik Santai)</option>
                        <option value="lively">Ramai / Hidup</option>
                    </select>
                </div>
            </div>

            <div class="flex items-center gap-6 pt-2">
                <label class="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                    <input type="checkbox" name="is_24_hours" value="1" class="w-4 h-4 rounded text-[#005B54] focus:ring-[#005B54]">
                    <span>Buka 24 Jam</span>
                </label>
            </div>

            <div>
                <label class="text-xs font-bold text-gray-700 block mb-1">Catatan Tambahan / Rekomendasi Menu</label>
                <textarea name="notes" rows="3" placeholder="Contoh: Es kopi susu murah Rp15.000, meja luas di lantai 2 banyak colokan, ada musholla bersih." class="w-full p-3.5 text-xs sm:text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#005B54] resize-none"></textarea>
            </div>

            <div>
                <label class="text-xs font-bold text-gray-700 block mb-1">URL Foto Tempat / Menu (Opsional)</label>
                <input type="url" name="image_url" placeholder="https://images.unsplash.com/..." class="w-full h-11 px-3.5 text-xs sm:text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#005B54]">
            </div>
        </section>

        <div class="flex items-center gap-3 pt-2">
            <button type="submit" class="h-12 px-8 bg-[#005B54] hover:bg-[#004741] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer">
                <i data-lucide="send" class="w-4 h-4"></i>
                <span>Kirim Usulan Tempat Baru</span>
            </button>
            <a href="{{ route('home') }}" class="h-12 px-6 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl transition-all flex items-center gap-2">
                Batal
            </a>
        </div>
    </form>
</div>
@endsection

@push('scripts')
<script>
    function tambahTempatApp() {
        return {
            lat: -6.5980000,
            lng: 106.8050000,
            map: null,
            marker: null,

            init() {
                this.map = L.map('pickerMap', {
                    center: [this.lat, this.lng],
                    zoom: 14,
                    zoomControl: true,
                });

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

                this.marker = L.marker([this.lat, this.lng], { draggable: true }).addTo(this.map);

                this.map.on('click', (e) => {
                    this.lat = e.latlng.lat.toFixed(7);
                    this.lng = e.latlng.lng.toFixed(7);
                    this.marker.setLatLng(e.latlng);
                });

                this.marker.on('dragend', () => {
                    const pos = this.marker.getLatLng();
                    this.lat = pos.lat.toFixed(7);
                    this.lng = pos.lng.toFixed(7);
                });

                setTimeout(() => lucide.createIcons(), 100);
            }
        };
    }
</script>
@endpush
