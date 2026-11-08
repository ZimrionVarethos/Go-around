@extends('layouts.app')

@section('title', 'Go Around — WebGIS Tempat Nugas Ramah Mahasiswa Kota Bogor')

@section('content')
<div class="relative w-full flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden" 
     x-data="webgisApp()" 
     x-init="initMap()">

    <!-- Map Container -->
    <div id="map" class="absolute inset-0 z-0 bg-[#E2E8F0] w-full h-full"></div>

    <!-- ── Floating Topbar & Quick Filter Bar ── -->
    <div class="absolute top-4 inset-x-4 sm:inset-x-6 z-20 flex flex-col gap-2.5 max-w-4xl mx-auto pointer-events-none">
        <!-- Search and Criteria Row -->
        <div class="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/90 shadow-md p-2 flex items-center gap-2 pointer-events-auto">
            <div class="relative flex-1">
                <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                <input type="text" 
                       x-model="searchQuery" 
                       @input.debounce.300ms="filterPlaces()" 
                       placeholder="Cari kafe, warkop, jalan, atau suasana nugas di Bogor..." 
                       class="w-full h-10 pl-10 pr-4 text-xs sm:text-sm bg-transparent rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20">
            </div>

            <!-- Subdistrict Selector -->
            <select x-model="selectedSubdistrict" 
                    @change="filterPlaces()" 
                    class="hidden sm:block h-10 px-3 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-[#005B54] cursor-pointer">
                <option value="">Semua Kecamatan</option>
                @foreach($subdistricts as $sub)
                    <option value="{{ $sub }}">{{ $sub }}</option>
                @endforeach
            </select>

            <!-- Multi-Criteria Weights Button -->
            <button type="button" 
                    @click="criteriaModal = true" 
                    class="h-10 px-3.5 bg-[#005B54] hover:bg-[#004741] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0">
                <i data-lucide="sliders-horizontal" class="w-3.5 h-3.5"></i>
                <span class="hidden sm:inline">Bobot Rekomendasi</span>
                <span class="sm:hidden">Filter</span>
            </button>
        </div>

        <!-- Quick Filter Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pointer-events-auto">
            <button type="button" 
                    @click="resetAllFilters()" 
                    :class="!hasActiveFilters && activeTab === 'all' ? 'bg-[#005B54] text-white border-[#005B54]' : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-white'"
                    class="px-3 py-1.5 rounded-full text-xs font-semibold border shadow-2xs backdrop-blur-md transition-all shrink-0 cursor-pointer flex items-center gap-1">
                <i data-lucide="grid" class="w-3 h-3"></i>
                <span>Semua Kafe</span>
            </button>

            <button type="button" 
                    @click="toggleFilter('wifi50')" 
                    :class="activeFilters.wifi50 ? 'bg-[#005B54] text-white border-[#005B54]' : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-white'"
                    class="px-3 py-1.5 rounded-full text-xs font-semibold border shadow-2xs backdrop-blur-md transition-all shrink-0 cursor-pointer flex items-center gap-1">
                <i data-lucide="wifi" class="w-3 h-3"></i>
                <span>WiFi > 50 Mbps</span>
            </button>

            <button type="button" 
                    @click="toggleFilter('abundantPlug')" 
                    :class="activeFilters.abundantPlug ? 'bg-[#005B54] text-white border-[#005B54]' : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-white'"
                    class="px-3 py-1.5 rounded-full text-xs font-semibold border shadow-2xs backdrop-blur-md transition-all shrink-0 cursor-pointer flex items-center gap-1">
                <i data-lucide="zap" class="w-3 h-3"></i>
                <span>Banyak Colokan</span>
            </button>

            <button type="button" 
                    @click="toggleFilter('cheapPrice')" 
                    :class="activeFilters.cheapPrice ? 'bg-[#005B54] text-white border-[#005B54]' : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-white'"
                    class="px-3 py-1.5 rounded-full text-xs font-semibold border shadow-2xs backdrop-blur-md transition-all shrink-0 cursor-pointer flex items-center gap-1">
                <i data-lucide="tag" class="w-3 h-3"></i>
                <span>Ramah Kantong (&le; 20rb)</span>
            </button>

            <button type="button" 
                    @click="toggleFilter('is24h')" 
                    :class="activeFilters.is24h ? 'bg-[#005B54] text-white border-[#005B54]' : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-white'"
                    class="px-3 py-1.5 rounded-full text-xs font-semibold border shadow-2xs backdrop-blur-md transition-all shrink-0 cursor-pointer flex items-center gap-1">
                <i data-lucide="clock" class="w-3 h-3"></i>
                <span>Buka 24 Jam</span>
            </button>

            <button type="button" 
                    @click="toggleFilter('studentDiscount')" 
                    :class="activeFilters.studentDiscount ? 'bg-[#005B54] text-white border-[#005B54]' : 'bg-white/90 text-gray-700 border-gray-200 hover:bg-white'"
                    class="px-3 py-1.5 rounded-full text-xs font-semibold border shadow-2xs backdrop-blur-md transition-all shrink-0 cursor-pointer flex items-center gap-1">
                <i data-lucide="graduation-cap" class="w-3 h-3"></i>
                <span>Diskon Mahasiswa</span>
            </button>
        </div>
    </div>

    <!-- ── Left Floating Place Cards & Recommendation Drawer ── -->
    <div class="absolute left-4 top-24 bottom-4 z-20 w-80 sm:w-96 flex flex-col pointer-events-none transition-transform duration-300"
         :class="sidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+16px)] sm:-translate-x-[calc(100%+24px)]'">
        
        <div class="bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-2xl shadow-xl flex-1 flex flex-col overflow-hidden pointer-events-auto">
            <!-- Header Tabs -->
            <div class="p-3 border-b border-gray-100 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
                <div class="flex items-center gap-1 shrink-0">
                    <button type="button" 
                            @click="activeTab = 'all'; filterPlaces();" 
                            :class="activeTab === 'all' ? 'bg-[#005B54] text-white font-bold shadow-xs' : 'text-gray-600 hover:bg-gray-100'"
                            class="px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer">
                        Semua
                    </button>
                    <button type="button" 
                            @click="activeTab = 'nugas'; filterPlaces();" 
                            :class="activeTab === 'nugas' ? 'bg-[#005B54] text-white font-bold shadow-xs' : 'text-gray-600 hover:bg-gray-100'"
                            class="px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1">
                        <i data-lucide="sparkles" class="w-3 h-3 text-amber-300"></i>
                        <span>Top 10 Rekomendasi</span>
                    </button>
                    <button type="button" 
                            @click="activeTab = 'cheap'; filterPlaces();" 
                            :class="activeTab === 'cheap' ? 'bg-[#005B54] text-white font-bold shadow-xs' : 'text-gray-600 hover:bg-gray-100'"
                            class="px-2 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer">
                        Hemat
                    </button>
                    <button type="button" 
                            @click="activeTab = 'wifi'; filterPlaces();" 
                            :class="activeTab === 'wifi' ? 'bg-[#005B54] text-white font-bold shadow-xs' : 'text-gray-600 hover:bg-gray-100'"
                            class="px-2 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer">
                        WiFi
                    </button>
                </div>

                <div class="text-[10px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full shrink-0">
                    <span x-text="activeTab === 'nugas' ? 'Top 10' : filteredPlaces.length + ' spot'"></span>
                </div>
            </div>

            <!-- Place Cards List -->
            <div class="flex-1 overflow-y-auto p-3 space-y-2.5">
                <template x-for="(place, idx) in filteredPlaces" :key="place.id">
                    <div @click="selectPlace(place)" 
                         class="bg-white hover:bg-[#F0FAF7] border border-gray-200/80 hover:border-[#005B54]/40 rounded-xl p-3 shadow-2xs transition-all cursor-pointer group flex gap-3 relative">
                        <!-- Rank badge for top 10 recommendation -->
                        <span x-show="activeTab === 'nugas'" 
                              class="absolute top-2 left-2 z-10 w-5 h-5 rounded-md bg-[#005B54] text-white text-[10px] font-black flex items-center justify-center shadow-xs" 
                              x-text="'#' + (idx + 1)"></span>

                        <div class="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-gray-100 relative">
                            <template x-if="place.image_url">
                                <img :src="place.image_url" 
                                     :alt="place.name" 
                                     loading="lazy" 
                                     class="w-full h-full object-cover" 
                                     x-on:error="$el.style.display='none'; $el.nextElementSibling.style.display='flex'">
                            </template>
                            <div :class="place.image_url ? 'hidden' : 'flex'" 
                                 class="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex-col items-center justify-center text-gray-400 p-1 text-center">
                                <i data-lucide="coffee" class="w-5 h-5 text-gray-400 stroke-[1.5]"></i>
                                <span class="text-[8px] text-gray-400 font-medium mt-1 leading-none">Tanpa Foto</span>
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between gap-1">
                                <h3 class="font-bold text-xs sm:text-sm text-gray-900 truncate group-hover:text-[#005B54]" x-text="place.name"></h3>
                                <span class="bg-[#E0F3EE] text-[#005B54] font-extrabold text-[11px] px-1.5 py-0.5 rounded-md shrink-0 flex items-center gap-0.5">
                                    ★ <span x-text="place.computed_score ?? (place.nugas_score > 10 ? (place.nugas_score/10).toFixed(1) : Number(place.nugas_score).toFixed(1))"></span>
                                </span>
                            </div>
                            <p class="text-[11px] text-gray-500 truncate mt-0.5" x-text="place.address"></p>
                            
                            <!-- Badges -->
                            <div class="flex items-center gap-2 mt-2 text-[10px] font-semibold text-gray-600">
                                <span class="flex items-center gap-0.5 text-blue-600">
                                    <i data-lucide="wifi" class="w-3 h-3"></i>
                                    <span x-text="place.wifi_speed_mbps + ' Mbps'"></span>
                                </span>
                                <span class="flex items-center gap-0.5 text-amber-600">
                                    <i data-lucide="zap" class="w-3 h-3"></i>
                                    <span x-text="place.plug_availability === 'abundant' ? 'Colokan +' : 'Colokan Cukup'"></span>
                                </span>
                                <span class="text-emerald-700 font-bold" x-text="'Rp ' + (place.price_min_drink/1000) + 'k+'"></span>
                            </div>
                        </div>
                </template>

                <div x-show="filteredPlaces.length === 0" class="p-8 text-center text-xs text-gray-400">
                    Tidak ditemukan tempat nugas dengan kriteria tersebut.
                </div>
            </div>
        </div>
    </div>

    <!-- Toggle Drawer Floating Button -->
    <button type="button" 
            @click="sidebarOpen = !sidebarOpen" 
            class="absolute left-4 bottom-6 z-30 w-11 h-11 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 rounded-2xl shadow-lg flex items-center justify-center transition-all cursor-pointer">
        <i :data-lucide="sidebarOpen ? 'chevron-left' : 'list'" class="w-5 h-5"></i>
    </button>

    <!-- ── Floating Right Map Controls ── -->
    <div class="absolute right-4 bottom-6 z-20 flex flex-col gap-2 pointer-events-auto">
        <!-- Geolocation Button -->
        <button type="button" 
                @click="locateUser()" 
                title="Posisiku Saat Ini"
                class="w-11 h-11 bg-white hover:bg-[#F0FAF7] border border-gray-200 text-[#005B54] rounded-2xl shadow-md flex items-center justify-center transition-all cursor-pointer">
            <i data-lucide="crosshair" class="w-5 h-5"></i>
        </button>

        <!-- Basemap Toggle -->
        <button type="button" 
                @click="toggleBasemap()" 
                title="Ganti Peta (OSM / Dark Matter)"
                class="w-11 h-11 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-2xl shadow-md flex items-center justify-center transition-all cursor-pointer">
            <i data-lucide="layers" class="w-5 h-5"></i>
        </button>

        <!-- Reset Center -->
        <button type="button" 
                @click="resetMapView()" 
                title="Pusat Kota Bogor"
                class="w-11 h-11 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-2xl shadow-md flex items-center justify-center transition-all cursor-pointer">
            <i data-lucide="rotate-ccw" class="w-5 h-5"></i>
        </button>
    </div>

    <!-- ── Multi-Criteria Recommendation Modal ── -->
    <div x-show="criteriaModal" 
         x-transition 
         class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
         style="display: none;">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 border border-gray-200 shadow-2xl space-y-5" 
             @click.outside="criteriaModal = false">
            <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                <div class="flex items-center gap-2 text-[#005B54] font-bold text-base">
                    <i data-lucide="sliders-horizontal" class="w-5 h-5"></i>
                    <span>Pengaturan Bobot Nugas Score</span>
                </div>
                <button type="button" @click="criteriaModal = false" class="text-gray-400 hover:text-gray-600">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <p class="text-xs text-gray-500 leading-relaxed">
                Sesuaikan prioritas fasilitas yang Anda butuhkan. Algoritma spasial Go Around akan menghitung ulang rekomendasi kafe terbaik di Kota Bogor.
            </p>

            <div class="space-y-4">
                <!-- Wifi Slider -->
                <div>
                    <div class="flex justify-between text-xs font-bold text-gray-800 mb-1">
                        <span>Prioritas Kecepatan Wi-Fi</span>
                        <span x-text="weights.wifi + '%'"></span>
                    </div>
                    <input type="range" min="0" max="100" x-model="weights.wifi" class="w-full accent-[#005B54]">
                </div>

                <!-- Plug Slider -->
                <div>
                    <div class="flex justify-between text-xs font-bold text-gray-800 mb-1">
                        <span>Prioritas Colokan Listrik</span>
                        <span x-text="weights.plug + '%'"></span>
                    </div>
                    <input type="range" min="0" max="100" x-model="weights.plug" class="w-full accent-[#005B54]">
                </div>

                <!-- Budget Slider -->
                <div>
                    <div class="flex justify-between text-xs font-bold text-gray-800 mb-1">
                        <span>Prioritas Harga Murah (Ramah Kantong)</span>
                        <span x-text="weights.budget + '%'"></span>
                    </div>
                    <input type="range" min="0" max="100" x-model="weights.budget" class="w-full accent-[#005B54]">
                </div>

                <!-- Quiet Slider -->
                <div>
                    <div class="flex justify-between text-xs font-bold text-gray-800 mb-1">
                        <span>Prioritas Ketenangan (Fokus Deep Work)</span>
                        <span x-text="weights.quiet + '%'"></span>
                    </div>
                    <input type="range" min="0" max="100" x-model="weights.quiet" class="w-full accent-[#005B54]">
                </div>
            </div>

            <div class="pt-2 flex items-center justify-end gap-2">
                <button type="button" 
                        @click="resetWeights(); criteriaModal = false; filterPlaces();" 
                        class="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50">
                    Reset Default
                </button>
                <button type="button" 
                        @click="applyRecommendationWeights()" 
                        class="px-5 py-2.5 rounded-xl bg-[#005B54] hover:bg-[#004741] text-white text-xs font-bold shadow-xs">
                    Terapkan Rekomendasi (Top 10)
                </button>
            </div>
        </div>
    </div>

    <!-- ── Place Detail Modal / Drawer ── -->
    <div x-show="selectedPlace" 
         x-transition 
         class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
         style="display: none;">
        <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 shadow-2xl" 
             @click.outside="selectedPlace = null">
            
            <template x-if="selectedPlace">
                <div class="flex flex-col h-full overflow-hidden">
                    <!-- Hero Image Banner -->
                    <div class="relative h-56 sm:h-64 bg-gray-900 shrink-0 overflow-hidden">
                        <template x-if="selectedPlace.image_url">
                            <img :src="selectedPlace.image_url" 
                                 :alt="selectedPlace.name" 
                                 class="w-full h-full object-cover opacity-90"
                                 x-on:error="$el.style.display='none'; $el.nextElementSibling.style.display='flex'">
                        </template>
                        <div :class="selectedPlace.image_url ? 'hidden' : 'flex'" 
                             class="w-full h-full bg-gradient-to-br from-[#005B54] via-[#004741] to-[#002B27] flex-col items-center justify-center text-white/40">
                            <i data-lucide="coffee" class="w-14 h-14 stroke-[1.2] text-white/30"></i>
                            <span class="text-xs text-white/60 mt-2 font-medium">Foto Belum Tersedia di Google Preview</span>
                        </div>
                        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
                        
                        <button type="button" 
                                @click="selectedPlace = null" 
                                class="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>

                        <div class="absolute bottom-4 left-4 right-4 text-white">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="bg-[#005B54] text-white text-xs font-bold px-2.5 py-0.5 rounded-full" 
                                      x-text="selectedPlace.category ? selectedPlace.category.name : 'Kafe Nugas'"></span>
                                <span class="text-xs text-white/80" x-text="selectedPlace.subdistrict"></span>
                            </div>
                            <h2 class="text-xl sm:text-2xl font-extrabold" x-text="selectedPlace.name"></h2>
                        </div>
                    </div>

                    <!-- Scrollable Details -->
                    <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                        <!-- Score Bar -->
                        <div class="grid grid-cols-3 gap-3 bg-[#F0FAF7] border border-[#A7F3D0] rounded-2xl p-4 text-center">
                            <div>
                                <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Skor Nugas</span>
                                <span class="text-2xl font-black text-[#005B54]" x-text="selectedPlace.nugas_score"></span>
                            </div>
                            <div>
                                <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Skor Budget</span>
                                <span class="text-2xl font-black text-emerald-600" x-text="selectedPlace.budget_score"></span>
                            </div>
                            <div>
                                <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Skor Fasilitas</span>
                                <span class="text-2xl font-black text-blue-600" x-text="selectedPlace.facility_score"></span>
                            </div>
                        </div>

                        <!-- Info Grid -->
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div class="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <span class="text-gray-400 block mb-1">Wi-Fi Internet</span>
                                <span class="font-bold text-gray-900" x-text="selectedPlace.wifi_speed_mbps + ' Mbps (' + selectedPlace.wifi_quality + ')'"></span>
                            </div>
                            <div class="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <span class="text-gray-400 block mb-1">Ketersediaan Colokan</span>
                                <span class="font-bold text-gray-900 capitalize" x-text="selectedPlace.plug_availability"></span>
                            </div>
                            <div class="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <span class="text-gray-400 block mb-1">Min. Minuman</span>
                                <span class="font-bold text-[#005B54]" x-text="'Rp ' + Number(selectedPlace.price_min_drink).toLocaleString('id-ID')"></span>
                            </div>
                            <div class="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <span class="text-gray-400 block mb-1">Jam Operasional</span>
                                <span class="font-bold text-gray-900" x-text="selectedPlace.is_24_hours ? 'Buka 24 Jam' : (selectedPlace.open_time ? selectedPlace.open_time + ' - ' + selectedPlace.close_time : 'Cek Info')"></span>
                            </div>
                        </div>

                        <!-- Description -->
                        <div>
                            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Deskripsi & Vibe</h4>
                            <p class="text-xs sm:text-sm text-gray-700 leading-relaxed" x-text="selectedPlace.description"></p>
                        </div>

                        <!-- Vibe Tags -->
                        <template x-if="selectedPlace.vibe_tags && selectedPlace.vibe_tags.length">
                            <div class="flex flex-wrap gap-1.5">
                                <template x-for="tag in selectedPlace.vibe_tags" :key="tag">
                                    <span class="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg" x-text="'#' + tag"></span>
                                </template>
                            </div>
                        </template>

                        <!-- Address & Actions -->
                        <div class="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div class="text-xs text-gray-500 w-full sm:w-auto">
                                <i data-lucide="map-pin" class="w-3.5 h-3.5 inline mr-1 text-[#005B54]"></i>
                                <span x-text="selectedPlace.address"></span>
                            </div>

                            <div class="flex items-center gap-2 w-full sm:w-auto shrink-0">
                                <a :href="'/lapor-fasilitas?place_id=' + selectedPlace.id + '&name=' + encodeURIComponent(selectedPlace.name)" 
                                   class="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                                    <i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-amber-600"></i>
                                    <span>Lapor Kendala</span>
                                </a>

                                <a :href="selectedPlace.google_maps_url" 
                                   target="_blank" 
                                   class="px-5 py-2.5 rounded-xl bg-[#005B54] hover:bg-[#004741] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs">
                                    <i data-lucide="navigation" class="w-3.5 h-3.5"></i>
                                    <span>Rute Google Maps</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    function webgisApp() {
        return {
            map: null,
            markersLayer: null,
            tileLayer: null,
            currentBasemap: 'osm',
            allPlaces: @json($placesJson),
            filteredPlaces: [],
            selectedPlace: null,
            searchQuery: '',
            selectedSubdistrict: '',
            sidebarOpen: true,
            criteriaModal: false,
            activeTab: 'all',
            activeFilters: {
                wifi50: false,
                abundantPlug: false,
                cheapPrice: false,
                is24h: false,
                studentDiscount: false,
            },
            weights: {
                wifi: 30,
                plug: 30,
                budget: 25,
                quiet: 15,
            },

            get hasActiveFilters() {
                return this.activeFilters.wifi50 ||
                       this.activeFilters.abundantPlug ||
                       this.activeFilters.cheapPrice ||
                       this.activeFilters.is24h ||
                       this.activeFilters.studentDiscount ||
                       Boolean(this.searchQuery) ||
                       Boolean(this.selectedSubdistrict);
            },

            resetAllFilters() {
                this.searchQuery = '';
                this.selectedSubdistrict = '';
                this.activeFilters.wifi50 = false;
                this.activeFilters.abundantPlug = false;
                this.activeFilters.cheapPrice = false;
                this.activeFilters.is24h = false;
                this.activeFilters.studentDiscount = false;
                this.activeTab = 'all';
                this.filterPlaces();
            },

            initMap() {
                // Center Kota Bogor
                this.map = L.map('map', {
                    center: [-6.598, 106.805],
                    zoom: 14,
                    zoomControl: false,
                });

                L.control.zoom({ position: 'bottomright' }).addTo(this.map);

                this.setBasemap('osm');
                this.markersLayer = L.layerGroup().addTo(this.map);

                // Initial render of all places
                this.filterPlaces();

                // Re-render icons on modal/change
                this.$watch('criteriaModal', () => setTimeout(() => lucide.createIcons(), 50));
                this.$watch('selectedPlace', () => setTimeout(() => lucide.createIcons(), 50));
                this.$watch('activeTab', () => this.filterPlaces());
            },

            setBasemap(type) {
                if (this.tileLayer) {
                    this.map.removeLayer(this.tileLayer);
                }

                if (type === 'dark') {
                    this.tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                        attribution: '&copy; CartoDB &copy; OpenStreetMap',
                        maxZoom: 19
                    }).addTo(this.map);
                    this.currentBasemap = 'dark';
                } else {
                    this.tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; OpenStreetMap contributors',
                        maxZoom: 19
                    }).addTo(this.map);
                    this.currentBasemap = 'osm';
                }
            },

            toggleBasemap() {
                this.setBasemap(this.currentBasemap === 'osm' ? 'dark' : 'osm');
            },

            resetMapView() {
                this.map.flyTo([-6.598, 106.805], 14, { duration: 1 });
            },

            locateUser() {
                if (!navigator.geolocation) {
                    alert('Geolocation tidak didukung oleh browser Anda.');
                    return;
                }
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const lat = pos.coords.latitude;
                        const lng = pos.coords.longitude;
                        this.map.flyTo([lat, lng], 15, { duration: 1.2 });

                        const userIcon = L.divIcon({
                            className: 'user-pos-marker',
                            html: `<div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg ring-4 ring-blue-400/40 animate-pulse"></div>`,
                            iconSize: [20, 20],
                            iconAnchor: [10, 10]
                        });
                        L.marker([lat, lng], { icon: userIcon }).addTo(this.map).bindPopup('<b>Lokasi Anda</b>').openPopup();
                    },
                    () => alert('Gagal mendeteksi lokasi otomatis. Pastikan izin GPS aktif.')
                );
            },

            renderMarkers() {
                this.markersLayer.clearLayers();

                this.filteredPlaces.forEach((p, idx) => {
                    const pinColorClass = p.category?.slug === 'warkop-modern' ? 'marker-budget' :
                                         p.category?.slug === 'coworking-study-space' ? 'marker-coworking' :
                                         p.category?.slug === 'library-quiet-cafe' ? 'marker-library' : 'marker-cozy';

                    const rankBadge = (this.activeTab === 'nugas')
                        ? `<span class="absolute -top-2 -left-2 bg-amber-400 text-gray-900 border border-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">#${idx + 1}</span>`
                        : '';

                    const displayScore = p.computed_score ?? (p.nugas_score > 10 ? (p.nugas_score / 10).toFixed(1) : Number(p.nugas_score).toFixed(1));

                    const customIcon = L.divIcon({
                        className: 'custom-cafe-icon',
                        html: `<div class="cafe-marker-pin ${pinColorClass} w-9 h-9 text-xs font-black relative flex items-center justify-center">
                                  ${rankBadge}
                                  <span>${displayScore}</span>
                               </div>`,
                        iconSize: [36, 36],
                        iconAnchor: [18, 18],
                        popupAnchor: [0, -18]
                    });

                    const marker = L.marker([p.latitude, p.longitude], { icon: customIcon });

                    const rankPopupHeader = (this.activeTab === 'nugas')
                        ? `<div class="inline-block bg-amber-100 text-amber-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded mb-1">Peringkat #${idx + 1} Rekomendasi</div>`
                        : '';

                    const popupContent = `
                        <div class="p-2.5 max-w-[210px] space-y-1 text-left font-sans">
                            ${rankPopupHeader}
                            <h4 class="font-bold text-xs text-gray-900 leading-tight">${p.name}</h4>
                            <p class="text-[10px] text-gray-500">${p.subdistrict}</p>
                            <div class="flex items-center justify-between text-[11px] font-bold text-[#005B54] pt-1 border-t border-gray-100">
                                <span>WiFi ${p.wifi_speed_mbps} Mbps</span>
                                <span>Skor: ${displayScore}</span>
                            </div>
                        </div>
                    `;

                    marker.bindPopup(popupContent);
                    marker.on('click', () => {
                        this.selectPlace(p);
                    });

                    this.markersLayer.addLayer(marker);
                });
            },

            selectPlace(place) {
                this.selectedPlace = place;
                this.map.flyTo([place.latitude, place.longitude], 16, { duration: 0.8 });
                setTimeout(() => lucide.createIcons(), 60);
            },

            toggleFilter(key) {
                this.activeFilters[key] = !this.activeFilters[key];
                this.filterPlaces();
            },

            resetWeights() {
                this.weights = { wifi: 30, plug: 30, budget: 25, quiet: 15 };
                this.allPlaces.forEach(p => {
                    delete p.computed_score;
                });
            },

            applyRecommendationWeights() {
                const totalW = (Number(this.weights.wifi) + Number(this.weights.plug) + Number(this.weights.budget) + Number(this.weights.quiet)) || 100;
                const wWifi = Number(this.weights.wifi) / totalW;
                const wPlug = Number(this.weights.plug) / totalW;
                const wBudget = Number(this.weights.budget) / totalW;
                const wQuiet = Number(this.weights.quiet) / totalW;

                this.allPlaces.forEach(p => {
                    const wifiScore = Math.min(100, Math.max(20, (p.wifi_speed_mbps / 80) * 100));
                    const plugScore = p.plug_availability === 'abundant' ? 100 : (p.plug_availability === 'moderate' ? 75 : 45);
                    const priceScore = Math.max(10, Math.min(100, 100 - ((p.price_min_drink - 10000) / 300)));
                    const quietScore = p.noise_level === 'quiet' ? 100 : (p.noise_level === 'moderate' ? 75 : 50);

                    const totalScore = (wifiScore * wWifi) + (plugScore * wPlug) + (priceScore * wBudget) + (quietScore * wQuiet);
                    p.computed_score = (totalScore / 10).toFixed(1);
                });

                this.activeTab = 'nugas';
                this.criteriaModal = false;
                this.filterPlaces();
            },

            filterPlaces() {
                let res = this.allPlaces.filter(p => {
                    // Search
                    if (this.searchQuery) {
                        const kw = this.searchQuery.toLowerCase();
                        const matchName = (p.name || '').toLowerCase().includes(kw);
                        const matchAddr = (p.address || '').toLowerCase().includes(kw);
                        const matchSub = (p.subdistrict || '').toLowerCase().includes(kw);
                        if (!matchName && !matchAddr && !matchSub) return false;
                    }

                    // Subdistrict
                    if (this.selectedSubdistrict && p.subdistrict !== this.selectedSubdistrict) {
                        return false;
                    }

                    // Quick pills
                    if (this.activeFilters.wifi50 && p.wifi_speed_mbps < 50) return false;
                    if (this.activeFilters.abundantPlug && p.plug_availability !== 'abundant') return false;
                    if (this.activeFilters.cheapPrice && p.price_min_drink > 20000) return false;
                    if (this.activeFilters.is24h && !p.is_24_hours) return false;
                    if (this.activeFilters.studentDiscount && !p.has_student_discount) return false;

                    return true;
                });

                // Tab sorting & slicing
                if (this.activeTab === 'cheap') {
                    res.sort((a, b) => a.price_min_drink - b.price_min_drink);
                } else if (this.activeTab === 'wifi') {
                    res.sort((a, b) => b.wifi_speed_mbps - a.wifi_speed_mbps);
                } else if (this.activeTab === 'nugas') {
                    // Rekomendasi: Sort by computed_score or nugas_score descending, and take TOP 10!
                    res.sort((a, b) => {
                        const scoreB = b.computed_score ? parseFloat(b.computed_score) : (b.nugas_score > 10 ? b.nugas_score / 10 : b.nugas_score);
                        const scoreA = a.computed_score ? parseFloat(a.computed_score) : (a.nugas_score > 10 ? a.nugas_score / 10 : a.nugas_score);
                        return scoreB - scoreA;
                    });
                    res = res.slice(0, 10);
                } else {
                    // 'all' tab: Sort by default rating/score and show ALL places
                    res.sort((a, b) => (b.nugas_score || 0) - (a.nugas_score || 0));
                }

                this.filteredPlaces = res;
                this.renderMarkers();
                setTimeout(() => lucide.createIcons(), 60);
            }
        };
    }
</script>
@endpush
