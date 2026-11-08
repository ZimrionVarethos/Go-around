<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Admin Dashboard — Go Around Bogor')</title>
    
    <!-- Google Fonts -->
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
                            100: '#E0F3EE',
                            50: '#F0FAF7',
                        }
                    },
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'sans-serif'],
                        brand: ['Onest', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <!-- Alpine.js -->
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #F8F9FA; color: #131A2D; }
    </style>
</head>
<body class="min-h-screen flex flex-col md:flex-row bg-[#F8F9FA]" x-data="{ sidebarOpen: false }">

    <!-- ── Sidebar Desktop & Mobile ── -->
    <aside class="w-full md:w-64 bg-white border-r border-gray-200/90 shrink-0 flex flex-col justify-between p-4 z-40"
           :class="sidebarOpen ? 'block' : 'hidden md:flex'">
        <div class="space-y-6">
            <!-- Brand -->
            <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-2.5 group">
                    <div class="w-8 h-8 rounded-xl bg-[#005B54] text-white flex items-center justify-center font-bold shadow-xs">
                        <i data-lucide="shield-check" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <span class="font-['Onest'] font-bold text-base text-[#0F172A] block leading-none">Admin Panel</span>
                        <span class="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mt-0.5">Go Around Bogor</span>
                    </div>
                </a>
                <button type="button" @click="sidebarOpen = false" class="md:hidden text-gray-400 hover:text-gray-600">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <!-- Navigation Links -->
            <nav class="space-y-1">
                <a href="{{ route('admin.dashboard') }}" 
                   class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all {{ request()->routeIs('admin.dashboard') ? 'bg-[#E0F3EE] text-[#005B54]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900' }}">
                    <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
                    <span>Dashboard Overview</span>
                </a>

                <a href="{{ route('admin.places') }}" 
                   class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all {{ request()->routeIs('admin.places*') ? 'bg-[#E0F3EE] text-[#005B54]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900' }}">
                    <i data-lucide="coffee" class="w-4 h-4"></i>
                    <span>Kelola Kafe GIS</span>
                </a>

                <a href="{{ route('admin.reports') }}" 
                   class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all {{ request()->routeIs('admin.reports*') ? 'bg-[#E0F3EE] text-[#005B54]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900' }}">
                    <i data-lucide="inbox" class="w-4 h-4"></i>
                    <span>Tiket Laporan Masuk</span>
                </a>

                <a href="{{ route('admin.analytics') }}" 
                   class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all {{ request()->routeIs('admin.analytics') ? 'bg-[#E0F3EE] text-[#005B54]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900' }}">
                    <i data-lucide="bar-chart-3" class="w-4 h-4"></i>
                    <span>Analisis Spasial</span>
                </a>

                <a href="{{ route('admin.settings') }}" 
                   class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all {{ request()->routeIs('admin.settings') ? 'bg-[#E0F3EE] text-[#005B54]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900' }}">
                    <i data-lucide="settings" class="w-4 h-4"></i>
                    <span>Pengaturan Akun</span>
                </a>
            </nav>
        </div>

        <!-- Bottom User / Logout Card -->
        <div class="pt-4 border-t border-gray-100 space-y-2.5">
            <a href="{{ route('home') }}" class="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-[#005B54] transition-colors">
                <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
                <span>Lihat WebGIS Publik</span>
            </a>

            <div class="bg-gray-50 p-2.5 rounded-xl flex items-center justify-between gap-2">
                <div class="min-w-0">
                    <span class="font-bold text-xs text-gray-900 block truncate">{{ session('admin_name', 'Admin Curator') }}</span>
                    <span class="text-[10px] text-gray-400 block truncate">Super Admin</span>
                </div>
                <form action="{{ route('admin.logout') }}" method="POST">
                    @csrf
                    <button type="submit" title="Logout" class="w-7 h-7 rounded-lg bg-white border border-gray-200 text-red-500 hover:bg-red-50 flex items-center justify-center cursor-pointer">
                        <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                    </button>
                </form>
            </div>
        </div>
    </aside>

    <!-- ── Main Content Area ── -->
    <div class="flex-1 flex flex-col min-w-0">
        <!-- Top Mobile Header -->
        <div class="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <span class="font-['Onest'] font-bold text-base text-[#005B54]">Go Around Admin</span>
            <button type="button" @click="sidebarOpen = !sidebarOpen" class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600">
                <i data-lucide="menu" class="w-4 h-4"></i>
            </button>
        </div>

        <!-- Success/Error Alert -->
        @if(session('success'))
            <div class="m-6 mb-0 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i>
                <span>{{ session('success') }}</span>
            </div>
        @endif

        <main class="flex-1 p-4 sm:p-8 overflow-y-auto">
            @yield('admin_content')
        </main>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (window.lucide) lucide.createIcons();
        });
    </script>
    @stack('admin_scripts')
</body>
</html>
