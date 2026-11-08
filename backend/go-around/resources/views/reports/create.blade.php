@extends('layouts.app')

@section('title', 'Lapor & Koreksi Fasilitas Cafe — Go Around Bogor')

@section('content')
<div class="max-w-4xl w-full mx-auto px-4 py-8 sm:py-12" x-data="laporFasilitasApp()">

    <!-- Header Section -->
    <div class="mb-8">
        <a href="{{ route('home') }}" class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#005B54] mb-3 transition-colors">
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
            <span>Kembali ke Peta WebGIS</span>
        </a>
        <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <i data-lucide="alert-triangle" class="w-5 h-5"></i>
            </div>
            <div>
                <h1 class="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    Lapor &amp; Koreksi Fasilitas Kafe
                </h1>
                <p class="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Bantu mahasiswa lain dengan melaporkan colokan mati, wifi drop, atau koreksi data kafe di Kota Bogor
                </p>
            </div>
        </div>
    </div>

    <!-- Success Ticket Notification Screen -->
    @if(session('success_ticket'))
    <div class="bg-white rounded-3xl border-2 border-[#005B54] p-8 sm:p-12 text-center shadow-xl space-y-4 mb-8">
        <div class="w-16 h-16 rounded-2xl bg-[#E0F3EE] text-[#005B54] flex items-center justify-center mx-auto shadow-xs">
            <i data-lucide="check-circle-2" class="w-8 h-8"></i>
        </div>
        <h2 class="text-2xl font-black text-gray-900">
            Laporan Tiket Berhasil Dikirim!
        </h2>
        <p class="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Tiket laporan untuk <strong>{{ session('success_ticket')['cafe_name'] }}</strong> dengan kode 
            <span class="px-2.5 py-1 bg-gray-100 rounded-lg font-mono font-bold text-[#005B54] text-xs">
                {{ session('success_ticket')['ticket_code'] }}
            </span>
            telah masuk antrean verifikasi on-site tim surveyor mahasiswa.
        </p>
        <div class="pt-4 flex items-center justify-center gap-3">
            <a href="{{ route('home') }}" class="px-6 py-3 bg-[#005B54] hover:bg-[#004741] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all">
                Kembali ke Peta
            </a>
            <a href="{{ route('reports.create') }}" class="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs sm:text-sm rounded-xl transition-all">
                Lapor Kendala Lain
            </a>
        </div>
    </div>
    @endif

    <!-- Form Section -->
    <form action="{{ route('reports.store') }}" method="POST" class="space-y-6" @submit="handleSubmit($event)">
        @csrf

        <!-- Progress Tracker Bar -->
        <div class="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div class="flex items-center justify-between gap-2 mb-2.5">
                <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Kelengkapan Laporan</span>
                <span class="text-xs font-extrabold px-2.5 py-0.5 rounded-full" 
                      :class="progressPercent === 100 ? 'text-[#005B54] bg-[#E0F3EE]' : 'text-amber-800 bg-amber-50'"
                      x-text="progressPercent + '% Lengkap'"></span>
            </div>
            <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-[#005B54] transition-all duration-300 rounded-full" :style="'width: ' + progressPercent + '%'"></div>
            </div>
        </div>

        <!-- ── Section 1: Pilih / Cari Kafe ── -->
        <section class="bg-white rounded-3xl border border-gray-200/90 shadow-xs p-6 space-y-4">
            <div class="flex items-start gap-3.5">
                <div class="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                </div>
                <div>
                    <h2 class="text-sm sm:text-base font-bold text-gray-900">
                        Pilih Kafe yang Ingin Dilaporkan <span class="text-red-500">*</span>
                    </h2>
                    <p class="text-xs text-gray-500 mt-0.5">
                        Ketik nama kafe atau pilih dari database Go Around Kota Bogor
                    </p>
                </div>
            </div>

            <!-- Place Selection Search -->
            <div class="space-y-2">
                <input type="hidden" name="place_id" :value="selectedPlace ? selectedPlace.id : ''">
                <input type="hidden" name="cafe_name" :value="selectedPlace ? selectedPlace.name : cafeNameInput">
                <input type="hidden" name="location" :value="selectedPlace ? selectedPlace.address : 'Kota Bogor'">

                <div class="relative">
                    <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                    <input type="text" 
                           x-model="cafeNameInput" 
                           @input="searchCafe()" 
                           @focus="showDropdown = true"
                           placeholder="Ketik nama kafe (cth: Anthology, Popolo, Kopi Nako)..." 
                           class="w-full h-11 pl-10 pr-4 text-xs sm:text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all">

                    <!-- Autocomplete Dropdown -->
                    <div x-show="showDropdown && filteredCafeList.length" 
                         @click.outside="showDropdown = false"
                         class="absolute top-12 inset-x-0 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 max-h-56 overflow-y-auto p-1.5 space-y-1">
                        <template x-for="c in filteredCafeList" :key="c.id">
                            <button type="button" 
                                    @click="pickPlace(c)" 
                                    class="w-full text-left p-2.5 rounded-xl hover:bg-[#F0FAF7] flex items-center justify-between text-xs transition-colors">
                                <div>
                                    <span class="font-bold text-gray-900 block" x-text="c.name"></span>
                                    <span class="text-[11px] text-gray-500 truncate block" x-text="c.address"></span>
                                </div>
                                <span class="text-[10px] font-bold text-[#005B54] bg-[#E0F3EE] px-2 py-0.5 rounded-md" x-text="c.subdistrict"></span>
                            </button>
                        </template>
                    </div>
                </div>

                <!-- Selected Cafe Preview Card -->
                <template x-if="selectedPlace">
                    <div class="bg-[#F0FAF7] border border-[#A7F3D0] rounded-2xl p-4 flex items-center justify-between gap-3">
                        <div class="flex items-center gap-3 min-w-0">
                            <div class="w-10 h-10 rounded-xl bg-[#005B54] text-white flex items-center justify-center shrink-0 font-bold">
                                <i data-lucide="coffee" class="w-5 h-5"></i>
                            </div>
                            <div class="min-w-0">
                                <h3 class="font-bold text-xs sm:text-sm text-gray-900 truncate" x-text="selectedPlace.name"></h3>
                                <p class="text-[11px] text-gray-600 truncate" x-text="selectedPlace.address"></p>
                            </div>
                        </div>
                        <button type="button" @click="selectedPlace = null; cafeNameInput = '';" class="text-xs font-bold text-red-600 hover:text-red-700">
                            Ganti
                        </button>
                    </div>
                </template>

                <!-- Mini Map Preview -->
                <div id="miniMap" class="w-full h-44 rounded-2xl border border-gray-200 overflow-hidden bg-gray-100 z-10"></div>
            </div>
        </section>

        <!-- ── Section 2: Pilih Jenis Kendala ── -->
        <section class="bg-white rounded-3xl border border-gray-200/90 shadow-xs p-6 space-y-4">
            <div class="flex items-start gap-3.5">
                <div class="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                </div>
                <div>
                    <h2 class="text-sm sm:text-base font-bold text-gray-900">
                        Jenis Kendala yang Ditemukan <span class="text-red-500">*</span>
                    </h2>
                    <p class="text-xs text-gray-500 mt-0.5">
                        Pilih satu atau beberapa kategori masalah yang terjadi
                    </p>
                </div>
            </div>

            <input type="hidden" name="category" :value="selectedIssues.join(', ')">

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <template x-for="opt in issueOptions" :key="opt.id">
                    <div @click="toggleIssue(opt.id)" 
                         :class="selectedIssues.includes(opt.id) ? 'bg-[#F0FAF7] border-[#005B54] ring-1 ring-[#005B54]' : 'bg-gray-50/50 hover:bg-gray-50 border-gray-200'"
                         class="border rounded-2xl p-4 cursor-pointer transition-all flex items-start gap-3">
                        <div class="w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 shrink-0"
                             :class="selectedIssues.includes(opt.id) ? 'bg-[#005B54] border-[#005B54] text-white' : 'border-gray-300 bg-white'">
                            <template x-if="selectedIssues.includes(opt.id)">
                                <i data-lucide="check" class="w-3.5 h-3.5"></i>
                            </template>
                        </div>
                        <div>
                            <span class="text-xs sm:text-sm font-bold text-gray-900 block" x-text="opt.title"></span>
                            <span class="text-[11px] text-gray-500 block mt-0.5 leading-snug" x-text="opt.desc"></span>
                        </div>
                    </div>
                </template>
            </div>
        </section>

        <!-- ── Section 3: Detail & Waktu ── -->
        <section class="bg-white rounded-3xl border border-gray-200/90 shadow-xs p-6 space-y-4">
            <div class="flex items-start gap-3.5">
                <div class="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    3
                </div>
                <div>
                    <h2 class="text-sm sm:text-base font-bold text-gray-900">
                        Detail Masalah &amp; Estimasi Waktu <span class="text-red-500">*</span>
                    </h2>
                    <p class="text-xs text-gray-500 mt-0.5">
                        Deskripsikan spesifikasi meja atau kronologi kendala
                    </p>
                </div>
            </div>

            <div class="space-y-3">
                <div>
                    <label class="text-xs font-bold text-gray-700 block mb-1.5">Deskripsi Lengkap Kendala *</label>
                    <textarea name="description" 
                              x-model="detailText" 
                              rows="4" 
                              required
                              placeholder="Contoh: Stopkontak di 3 meja lantai 2 area semi-outdoor mati total sejak kemarin sore. Wi-Fi sering terputus saat jam 19.00 WIB."
                              class="w-full p-3.5 text-xs sm:text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all resize-none"></textarea>
                </div>

                <div>
                    <label class="text-xs font-bold text-gray-700 block mb-1.5">Waktu Kejadian</label>
                    <input type="hidden" name="time_option" :value="timeOption">
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <template x-for="t in timeOptions" :key="t.id">
                            <button type="button" 
                                    @click="timeOption = t.id" 
                                    :class="timeOption === t.id ? 'bg-[#005B54] text-white font-bold' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'"
                                    class="py-2.5 rounded-xl border border-gray-200 text-xs transition-all cursor-pointer text-center"
                                    x-text="t.label"></button>
                        </template>
                    </div>
                </div>
            </div>
        </section>

        <!-- ── Section 4: Bukti Foto Wajib ── -->
        <section class="bg-white rounded-3xl border border-gray-200/90 shadow-xs p-6 space-y-4">
            <div class="flex items-start gap-3.5">
                <div class="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    4
                </div>
                <div>
                    <h2 class="text-sm sm:text-base font-bold text-gray-900">
                        Lampirkan Bukti Lapangan <span class="text-red-500">*</span>
                    </h2>
                    <p class="text-xs text-gray-500 mt-0.5">
                        Unggah minimal 1 bukti foto: foto fisik kendala, screenshot speedtest, atau foto menu/struk
                    </p>
                </div>
            </div>

            <input type="hidden" name="photo_colokan" :value="photoColokan">
            <input type="hidden" name="photo_speedtest" :value="photoSpeedtest">
            <input type="hidden" name="photo_menu" :value="photoMenu">

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <!-- Card 1: Colokan -->
                <div class="border border-gray-200 rounded-2xl p-4 flex flex-col justify-between space-y-3 bg-gray-50/40">
                    <div>
                        <span class="text-xs font-bold text-[#005B54] block mb-1">Foto Fisik</span>
                        <p class="font-bold text-xs text-gray-900">Colokan / Meja Rusak</p>
                        <p class="text-[11px] text-gray-500 mt-0.5">Stopkontak mati atau fasilitas rusak</p>
                    </div>

                    <template x-if="photoColokan">
                        <div class="relative h-24 rounded-xl overflow-hidden border border-gray-200">
                            <img :src="photoColokan" class="w-full h-full object-cover">
                            <button type="button" @click="photoColokan = null" class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center">
                                <i data-lucide="x" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </template>
                    <template x-if="!photoColokan">
                        <label class="border border-dashed border-gray-300 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#005B54] bg-white transition-all">
                            <i data-lucide="upload" class="w-4 h-4 text-gray-400 mb-1"></i>
                            <span class="text-[11px] font-bold text-[#005B54]">Pilih Foto</span>
                            <input type="file" accept="image/*" class="hidden" @change="uploadPhoto($event, 'colokan')">
                        </label>
                    </template>
                </div>

                <!-- Card 2: Speedtest -->
                <div class="border border-gray-200 rounded-2xl p-4 flex flex-col justify-between space-y-3 bg-gray-50/40">
                    <div>
                        <span class="text-xs font-bold text-[#005B54] block mb-1">Bukti Jaringan</span>
                        <p class="font-bold text-xs text-gray-900">Screenshot Speedtest</p>
                        <p class="text-[11px] text-gray-500 mt-0.5">Uji Fast.com / Ookla speed</p>
                    </div>

                    <template x-if="photoSpeedtest">
                        <div class="relative h-24 rounded-xl overflow-hidden border border-gray-200">
                            <img :src="photoSpeedtest" class="w-full h-full object-cover">
                            <button type="button" @click="photoSpeedtest = null" class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center">
                                <i data-lucide="x" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </template>
                    <template x-if="!photoSpeedtest">
                        <label class="border border-dashed border-gray-300 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#005B54] bg-white transition-all">
                            <i data-lucide="upload" class="w-4 h-4 text-gray-400 mb-1"></i>
                            <span class="text-[11px] font-bold text-[#005B54]">Pilih Foto</span>
                            <input type="file" accept="image/*" class="hidden" @change="uploadPhoto($event, 'speedtest')">
                        </label>
                    </template>
                </div>

                <!-- Card 3: Menu -->
                <div class="border border-gray-200 rounded-2xl p-4 flex flex-col justify-between space-y-3 bg-gray-50/40">
                    <div>
                        <span class="text-xs font-bold text-[#005B54] block mb-1">Koreksi Harga</span>
                        <p class="font-bold text-xs text-gray-900">Foto Menu / Struk</p>
                        <p class="text-[11px] text-gray-500 mt-0.5">Bukti harga minuman berubah</p>
                    </div>

                    <template x-if="photoMenu">
                        <div class="relative h-24 rounded-xl overflow-hidden border border-gray-200">
                            <img :src="photoMenu" class="w-full h-full object-cover">
                            <button type="button" @click="photoMenu = null" class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center">
                                <i data-lucide="x" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </template>
                    <template x-if="!photoMenu">
                        <label class="border border-dashed border-gray-300 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#005B54] bg-white transition-all">
                            <i data-lucide="upload" class="w-4 h-4 text-gray-400 mb-1"></i>
                            <span class="text-[11px] font-bold text-[#005B54]">Pilih Foto</span>
                            <input type="file" accept="image/*" class="hidden" @change="uploadPhoto($event, 'menu')">
                        </label>
                    </template>
                </div>
            </div>
        </section>

        <!-- ── Section 5: Kirim Anonim ── -->
        <section class="bg-white rounded-3xl border border-gray-200/90 shadow-xs p-6 space-y-4">
            <div class="flex items-start gap-3.5">
                <div class="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    5
                </div>
                <div>
                    <h2 class="text-sm sm:text-base font-bold text-gray-900">
                        Kirim Laporan Fasilitas (Publik &amp; Anonim)
                    </h2>
                    <p class="text-xs text-gray-500 mt-0.5">
                        Tidak perlu pendaftaran akun atau data pribadi
                    </p>
                </div>
            </div>

            <div class="space-y-3">
                <div class="bg-[#F0FAF7] border border-[#A7F3D0] rounded-xl p-3.5 text-xs text-gray-700 leading-relaxed">
                    Data laporan Anda dikirim secara anonim dan langsung masuk antrean verifikasi on-site tim surveyor mahasiswa SV IPB University.
                </div>

                <div>
                    <label class="text-xs font-bold text-gray-700 block mb-1.5">
                        Email / Telegram Notifikasi <span class="text-gray-400 font-normal">(Opsional)</span>
                    </label>
                    <input type="text" 
                           name="contact_info" 
                           x-model="contactInfo"
                           placeholder="Isi hanya jika ingin dikabari progres verifikasi tiket (cth: mhs.ipb@apps.ipb.ac.id / @username)"
                           class="w-full h-11 px-3.5 text-xs sm:text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all">
                </div>

                <div class="pt-2 flex items-center gap-3">
                    <button type="submit" 
                            class="h-12 px-8 bg-[#005B54] hover:bg-[#004741] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer">
                        <i data-lucide="send" class="w-4 h-4"></i>
                        <span>Kirim Laporan Fasilitas</span>
                    </button>

                    <a href="{{ route('home') }}" class="h-12 px-6 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl transition-all flex items-center gap-2">
                        Batal
                    </a>
                </div>
            </div>
        </section>
    </form>
</div>
@endsection

@push('scripts')
<script>
    function laporFasilitasApp() {
        return {
            places: @json($places),
            filteredCafeList: [],
            selectedPlace: null,
            cafeNameInput: '',
            showDropdown: false,
            selectedIssues: [],
            detailText: '',
            timeOption: 'hari_ini',
            contactInfo: '',
            photoColokan: null,
            photoSpeedtest: null,
            photoMenu: null,
            miniMap: null,
            miniMarker: null,

            issueOptions: [
                { id: 'colokan_rusak', title: 'Colokan Rusak / Mati', desc: 'Stopkontak mati di meja, tidak ada arus listrik.' },
                { id: 'wifi_lambat', title: 'WiFi Lambat / Putus', desc: 'Speedtest drop < 10 Mbps atau portal login sering error.' },
                { id: 'kebisingan_tinggi', title: 'Kebisingan Tinggi', desc: 'BGM terlalu kencang atau bising renovasi/jalan.' },
                { id: 'harga_naik', title: 'Harga Naik / Min. Order', desc: 'Menu melonjak drastis atau ada minimum order ketat.' },
                { id: 'jam_operasional', title: 'Jam Operasional / Tutup', desc: 'Tidak lagi buka 24 jam atau tutup lebih awal.' },
                { id: 'fasilitas_baru', title: 'Fasilitas Baru / Saran', desc: 'Spot meja kerja baru, musholla diperluas, AC baru.' },
            ],

            timeOptions: [
                { id: 'hari_ini', label: 'Hari Ini' },
                { id: 'kemarin', label: 'Kemarin' },
                { id: 'pekan_ini', label: 'Pekan Ini' },
                { id: 'lebih_7_hari', label: '> 7 Hari Lalu' },
            ],

            get progressPercent() {
                let count = 0;
                if (this.selectedPlace || this.cafeNameInput.trim()) count++;
                if (this.selectedIssues.length > 0) count++;
                if (this.detailText.trim().length > 0) count++;
                if (this.photoColokan || this.photoSpeedtest || this.photoMenu) count++;
                return Math.round((count / 4) * 100);
            },

            init() {
                // Initialize mini Leaflet preview
                this.miniMap = L.map('miniMap', {
                    center: [-6.598, 106.805],
                    zoom: 13,
                    zoomControl: false,
                    attributionControl: false
                });

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.miniMap);

                // Check query params if redirected from home
                const urlParams = new URLSearchParams(window.location.search);
                const placeId = urlParams.get('place_id');
                if (placeId) {
                    const match = this.places.find(p => p.id == placeId);
                    if (match) this.pickPlace(match);
                }

                setTimeout(() => lucide.createIcons(), 100);
            },

            searchCafe() {
                if (!this.cafeNameInput.trim()) {
                    this.filteredCafeList = [];
                    return;
                }
                const kw = this.cafeNameInput.toLowerCase();
                this.filteredCafeList = this.places.filter(p => p.name.toLowerCase().includes(kw));
            },

            pickPlace(place) {
                this.selectedPlace = place;
                this.cafeNameInput = place.name;
                this.showDropdown = false;

                if (this.miniMarker) this.miniMap.removeLayer(this.miniMarker);
                this.miniMap.setView([place.latitude, place.longitude], 16);
                this.miniMarker = L.marker([place.latitude, place.longitude]).addTo(this.miniMap);
            },

            toggleIssue(id) {
                if (this.selectedIssues.includes(id)) {
                    this.selectedIssues = this.selectedIssues.filter(i => i !== id);
                } else {
                    this.selectedIssues.push(id);
                }
                setTimeout(() => lucide.createIcons(), 50);
            },

            uploadPhoto(e, type) {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                    if (type === 'colokan') this.photoColokan = reader.result;
                    if (type === 'speedtest') this.photoSpeedtest = reader.result;
                    if (type === 'menu') this.photoMenu = reader.result;
                    setTimeout(() => lucide.createIcons(), 50);
                };
                reader.readAsDataURL(file);
            },

            handleSubmit(e) {
                if (!this.selectedPlace && !this.cafeNameInput.trim()) {
                    e.preventDefault();
                    alert('Mohon pilih atau ketik nama kafe.');
                    return;
                }
                if (this.selectedIssues.length === 0) {
                    e.preventDefault();
                    alert('Mohon pilih minimal 1 jenis kendala.');
                    return;
                }
                if (!this.detailText.trim()) {
                    e.preventDefault();
                    alert('Mohon isi deskripsi kendala.');
                    return;
                }
                if (!this.photoColokan && !this.photoSpeedtest && !this.photoMenu) {
                    e.preventDefault();
                    alert('Wajib melampirkan minimal 1 bukti foto lapangan.');
                    return;
                }
            }
        };
    }
</script>
@endpush
