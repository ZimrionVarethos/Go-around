@extends('layouts.admin')

@section('title', 'Pengaturan Administrator — Go Around Bogor')

@section('admin_content')
<div class="space-y-6 max-w-4xl mx-auto w-full" x-data="{ activeTab: 'profile', showPass: false }">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight font-['Onest']">
                Pengaturan Akun & WebGIS
            </h1>
            <p class="text-xs text-gray-500 mt-1">
                Kelola profil administrator, kata sandi akses, dan konfigurasi layer spasial
            </p>
        </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex items-center gap-2 border-b border-gray-200">
        <button
            type="button"
            @click="activeTab = 'profile'"
            class="px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5"
            :class="activeTab === 'profile' ? 'border-[#005B54] text-[#005B54]' : 'border-transparent text-gray-500 hover:text-gray-800'"
        >
            <i data-lucide="user" class="w-4 h-4"></i>
            <span>Profil Administrator</span>
        </button>

        <button
            type="button"
            @click="activeTab = 'security'"
            class="px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5"
            :class="activeTab === 'security' ? 'border-[#005B54] text-[#005B54]' : 'border-transparent text-gray-500 hover:text-gray-800'"
        >
            <i data-lucide="shield-check" class="w-4 h-4"></i>
            <span>Keamanan & Sandi</span>
        </button>

        <button
            type="button"
            @click="activeTab = 'gis'"
            class="px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5"
            :class="activeTab === 'gis' ? 'border-[#005B54] text-[#005B54]' : 'border-transparent text-gray-500 hover:text-gray-800'"
        >
            <i data-lucide="layers" class="w-4 h-4"></i>
            <span>Parameter Spasial</span>
        </button>
    </div>

    <!-- 1. Profile Tab Content -->
    <div x-show="activeTab === 'profile'" class="space-y-6">
        <!-- Identity Summary Card -->
        <div class="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div class="flex items-center gap-4">
                <div class="relative">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#005B54] to-[#002623] text-white font-bold text-2xl flex items-center justify-center shadow-md font-['Onest']">
                        {{ strtoupper(substr($user->name ?? 'Admin', 0, 2)) }}
                    </div>
                    <span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" title="Status: Aktif"></span>
                </div>
                <div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <h2 class="text-lg font-bold text-gray-900 font-['Onest']">{{ $user->name ?? 'Zimrion Varethos' }}</h2>
                        <span class="inline-flex items-center gap-1 text-[11px] font-semibold bg-teal-50 text-[#005B54] px-2.5 py-0.5 rounded-full border border-teal-200">
                            <i data-lucide="sparkles" class="w-3 h-3 text-[#005B54]"></i>
                            Super Administrator
                        </span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                        <i data-lucide="mail" class="w-3.5 h-3.5 text-gray-400"></i>
                        {{ $user->email ?? 'admin@goaround.id' }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Form Edit Profile -->
        <div class="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs space-y-5">
            <h3 class="text-sm font-bold text-gray-900 font-['Onest']">Informasi Data Pribadi</h3>

            <form action="{{ route('admin.settings.profile') }}" method="POST" class="space-y-4">
                @csrf

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            name="name"
                            value="{{ $user->name ?? 'Zimrion Varethos' }}"
                            required
                            class="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]"
                        >
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">Email Administrator</label>
                        <input
                            type="email"
                            name="email"
                            value="{{ $user->email ?? 'admin@goaround.id' }}"
                            required
                            class="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]"
                        >
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">Instansi / Divisi Riset</label>
                    <input
                        type="text"
                        name="agency"
                        value="Tim Peneliti SIG Spasial Mahasiswa Bogor"
                        class="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]"
                    >
                </div>

                <div class="pt-2 flex justify-end">
                    <button
                        type="submit"
                        class="px-5 py-2.5 rounded-xl bg-[#005B54] hover:bg-[#004741] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                        <i data-lucide="save" class="w-4 h-4"></i>
                        <span>Simpan Perubahan</span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- 2. Security Tab Content -->
    <div x-show="activeTab === 'security'" class="space-y-6" style="display: none;">
        <div class="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs space-y-5">
            <div>
                <h3 class="text-sm font-bold text-gray-900 font-['Onest']">Ubah Kata Sandi</h3>
                <p class="text-xs text-gray-500 mt-0.5">Pastikan kata sandi baru minimal 6 karakter kombinasi</p>
            </div>

            <form action="{{ route('admin.settings.password') }}" method="POST" class="space-y-4 max-w-md">
                @csrf

                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">Kata Sandi Baru</label>
                    <div class="relative">
                        <input
                            :type="showPass ? 'text' : 'password'"
                            name="new_password"
                            required
                            minlength="6"
                            placeholder="Minimal 6 karakter"
                            class="w-full pl-3.5 pr-10 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]"
                        >
                        <button
                            type="button"
                            @click="showPass = !showPass"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            <i data-lucide="eye" x-show="!showPass" class="w-4 h-4"></i>
                            <i data-lucide="eye-off" x-show="showPass" class="w-4 h-4" style="display: none;"></i>
                        </button>
                    </div>
                </div>

                <div class="pt-2 flex justify-start">
                    <button
                        type="submit"
                        class="px-5 py-2.5 rounded-xl bg-[#005B54] hover:bg-[#004741] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                        <i data-lucide="key-round" class="w-4 h-4"></i>
                        <span>Perbarui Kata Sandi</span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- 3. Parameter Spasial Tab Content -->
    <div x-show="activeTab === 'gis'" class="space-y-6" style="display: none;">
        <div class="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs space-y-5">
            <div>
                <h3 class="text-sm font-bold text-gray-900 font-['Onest']">Pengaturan Default WebGIS Kota Bogor</h3>
                <p class="text-xs text-gray-500 mt-0.5">Konfigurasi pusat koordinat peta dan radius analisis buffer rekomendasi</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">Koordinat Pusat (Pusat Kota Bogor)</label>
                    <input
                        type="text"
                        readonly
                        value="-6.5971, 106.7993"
                        class="w-full px-3.5 py-2.5 text-xs bg-gray-100 border border-gray-200 rounded-xl text-gray-600"
                    >
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">Tingkat Zoom Awal Peta</label>
                    <input
                        type="text"
                        readonly
                        value="13 (Kota & Sekitar Kampus)"
                        class="w-full px-3.5 py-2.5 text-xs bg-gray-100 border border-gray-200 rounded-xl text-gray-600"
                    >
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">Basemap Default</label>
                    <input
                        type="text"
                        readonly
                        value="CartoDB Dark Matter / CartoDB Positron"
                        class="w-full px-3.5 py-2.5 text-xs bg-gray-100 border border-gray-200 rounded-xl text-gray-600"
                    >
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">Radius Buffer Rekomendasi Jalan Kaki</label>
                    <input
                        type="text"
                        readonly
                        value="1.500 Meter (1.5 km)"
                        class="w-full px-3.5 py-2.5 text-xs bg-gray-100 border border-gray-200 rounded-xl text-gray-600"
                    >
                </div>
            </div>

            <div class="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center gap-2">
                <i data-lucide="info" class="w-4 h-4 text-[#005B54] shrink-0"></i>
                <span>Pengaturan spasial telah dioptimalkan secara default untuk peta interaktif mahasiswa di homepage.</span>
            </div>
        </div>
    </div>
</div>
@endsection
