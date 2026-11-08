<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Go Around — WebGIS Tempat Nugas Ramah Mahasiswa Kota Bogor')</title>
    
    <!-- Google Fonts: Onest & Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: {
                            900: '#005B54',
                            800: '#004741',
                            700: '#0F756E',
                            600: '#0284C7',
                            500: '#059569',
                            100: '#E0F3EE',
                            50: '#F0FAF7',
                        },
                        brandDark: '#131A2D',
                        brandBg: '#F6F4ED',
                    },
                    fontFamily: {
                        brand: ['Onest', 'sans-serif'],
                        sans: ['Plus Jakarta Sans', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    
    <!-- Leaflet CSS & JS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <!-- Alpine.js for interactive UI -->
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #F8F9FA;
            color: #131A2D;
            overflow-x: hidden;
        }

        /* Marker Neon & Pin Styles */
        .cafe-marker-pin {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 9999px;
            box-shadow: 0 4px 12px rgba(0, 91, 84, 0.35);
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            cursor: pointer;
        }
        .cafe-marker-pin:hover {
            transform: scale(1.15) translateY(-3px);
            z-index: 1000 !important;
        }
        .marker-budget { background: linear-gradient(135deg, #10B981, #059669); color: white; border: 2.5px solid #ffffff; }
        .marker-cozy { background: linear-gradient(135deg, #005B54, #0F756E); color: white; border: 2.5px solid #ffffff; }
        .marker-coworking { background: linear-gradient(135deg, #6366F1, #4F46E5); color: white; border: 2.5px solid #ffffff; }
        .marker-library { background: linear-gradient(135deg, #8B5CF6, #7C3AED); color: white; border: 2.5px solid #ffffff; }

        /* Custom Scrollbars */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 9999px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }

        /* Leaflet Controls Reset */
        .leaflet-bar { border: none !important; box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important; border-radius: 12px !important; overflow: hidden; }
        .leaflet-bar a { border-bottom: 1px solid #E2E8F0 !important; color: #1E293B !important; width: 36px !important; height: 36px !important; line-height: 36px !important; }
        .leaflet-bar a:hover { background-color: #F8FAFC !important; }
    </style>

    @stack('styles')
</head>
<body class="min-h-screen flex flex-col bg-[#F8F9FA] text-[#131A2D]" x-data="{
    mobileMenu: false,
    toastMsg: '{{ session('success') ?? session('info') }}',
    toastType: '{{ session('success') ? 'success' : 'info' }}',
    showToast(msg, type = 'success') {
        this.toastMsg = msg;
        this.toastType = type;
        setTimeout(() => this.toastMsg = '', 4000);
    }
}" x-init="if (toastMsg) setTimeout(() => toastMsg = '', 4000)">

    <!-- Topbar Navigation -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/90 shadow-xs px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <!-- Brand Wordmark -->
        <a href="{{ route('home') }}" class="flex items-center gap-2.5 shrink-0 group">
            <div class="w-9 h-9 rounded-xl bg-[#005B54] text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <i data-lucide="compass" class="w-5 h-5"></i>
            </div>
            <div>
                <span class="font-['Onest'] text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] block leading-none">
                    Go Around
                </span>
                <span class="text-[10px] text-gray-500 font-semibold tracking-wide uppercase block mt-0.5">
                    WebGIS Mahasiswa Bogor
                </span>
            </div>
        </a>

        <!-- Desktop Navigation Items -->
        <nav class="hidden md:flex items-center gap-1.5">
            <a href="{{ route('home') }}" class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all {{ request()->routeIs('home') ? 'bg-[#E0F3EE] text-[#005B54] font-bold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60' }}">
                <i data-lucide="map" class="w-4 h-4 inline mr-1.5 -mt-0.5"></i>
                Peta WebGIS
            </a>
            
            <a href="{{ route('reports.create') }}" class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all {{ request()->routeIs('reports.*') ? 'bg-[#E0F3EE] text-[#005B54] font-bold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60' }}">
                <i data-lucide="alert-triangle" class="w-4 h-4 inline mr-1.5 -mt-0.5 text-amber-500"></i>
                Lapor Fasilitas
            </a>

            <a href="{{ route('contributions.create') }}" class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all {{ request()->routeIs('contributions.*') ? 'bg-[#E0F3EE] text-[#005B54] font-bold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60' }}">
                <i data-lucide="map-pin-plus" class="w-4 h-4 inline mr-1.5 -mt-0.5 text-emerald-600"></i>
                Tambah Tempat
            </a>

            <a href="{{ route('about') }}" class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all {{ request()->routeIs('about') ? 'bg-[#E0F3EE] text-[#005B54] font-bold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60' }}">
                <i data-lucide="info" class="w-4 h-4 inline mr-1.5 -mt-0.5"></i>
                Tentang Riset
            </a>
        </nav>

        <!-- Right Side CTA / Admin Link -->
        <div class="flex items-center gap-2">
            <a href="{{ route('admin.dashboard') }}" class="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-2xs">
                <i data-lucide="shield-check" class="w-4 h-4 text-[#005B54]"></i>
                <span class="hidden sm:inline">Portal</span> Admin
            </a>

            <!-- Mobile Hamburger Toggle -->
            <button type="button" @click="mobileMenu = !mobileMenu" class="md:hidden w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100">
                <i data-lucide="menu" class="w-5 h-5"></i>
            </button>
        </div>
    </header>

    <!-- Mobile Drawer Nav -->
    <div x-show="mobileMenu" 
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0 -translate-y-2"
         x-transition:enter-end="opacity-100 translate-y-0"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-start="opacity-100 translate-y-0"
         x-transition:leave-end="opacity-0 -translate-y-2"
         class="md:hidden bg-white border-b border-gray-200 p-4 space-y-2 shadow-lg z-40 fixed top-16 inset-x-0"
         @click.outside="mobileMenu = false"
         style="display: none;">
        <a href="{{ route('home') }}" class="flex items-center gap-2.5 p-2.5 rounded-xl font-bold text-sm text-[#005B54] bg-[#E0F3EE]">
            <i data-lucide="map" class="w-4 h-4"></i>
            Peta WebGIS Kota Bogor
        </a>
        <a href="{{ route('reports.create') }}" class="flex items-center gap-2.5 p-2.5 rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-50">
            <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-500"></i>
            Lapor & Koreksi Fasilitas
        </a>
        <a href="{{ route('contributions.create') }}" class="flex items-center gap-2.5 p-2.5 rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-50">
            <i data-lucide="map-pin-plus" class="w-4 h-4 text-emerald-600"></i>
            Tambah & Rekomendasikan Tempat
        </a>
        <a href="{{ route('about') }}" class="flex items-center gap-2.5 p-2.5 rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-50">
            <i data-lucide="info" class="w-4 h-4"></i>
            Tentang Riset Mahasiswa
        </a>
    </div>

    <!-- Toast Notification Banner -->
    <div x-show="toastMsg" 
         x-transition 
         class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold animate-in fade-in slide-in-from-bottom-2"
         :class="toastType === 'success' ? 'bg-[#005B54] text-white border-teal-600' : 'bg-gray-900 text-white border-gray-800'"
         style="display: none;">
        <i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-300"></i>
        <span x-text="toastMsg"></span>
        <button type="button" @click="toastMsg = ''" class="ml-2 hover:opacity-75">
            <i data-lucide="x" class="w-4 h-4"></i>
        </button>
    </div>

    <!-- Main Content Slot -->
    <main class="flex-1 flex flex-col">
        @yield('content')
    </main>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (window.lucide) {
                lucide.createIcons();
            }
        });
    </script>
    @stack('scripts')
</body>
</html>
