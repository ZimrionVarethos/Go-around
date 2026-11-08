<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Administrator — Go Around Bogor</title>

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
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #F8FAFC; }
    </style>
</head>
<body class="min-h-screen w-full flex bg-[#F8FAFC] select-none" x-data="{ showPassword: false, email: '{{ old('email') }}', password: '' }">

    <!-- 1. Left Side Hero Banner (Desktop Only) -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#003833] via-[#005B54] to-[#0F172A] text-white p-12 flex-col justify-between overflow-hidden">
        <!-- Background Ambient Circles & Grid Pattern -->
        <div class="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div class="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl"></div>
        <div class="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl"></div>

        <!-- Top Brand Logo -->
        <div class="relative z-10">
            <a href="{{ route('home') }}" class="inline-flex items-center gap-3 group">
                <div class="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:bg-white/20 transition-all">
                    <i data-lucide="coffee" class="w-5 h-5 text-emerald-300"></i>
                </div>
                <div>
                    <span class="text-xl font-bold tracking-tight text-white font-['Onest']">
                        Go Around
                    </span>
                    <span class="text-[10px] block text-emerald-300 font-medium tracking-wider uppercase">
                        Admin Portal SIG
                    </span>
                </div>
            </a>
        </div>

        <!-- Center Content / Pitch -->
        <div class="relative z-10 space-y-6 max-w-lg">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-emerald-200 backdrop-blur-md">
                <i data-lucide="sparkles" class="w-3.5 h-3.5 text-emerald-400"></i>
                <span>Tata Kelola Data Spasial Tempat Nugas Mahasiswa</span>
            </div>

            <h1 class="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight font-['Onest']">
                Portal Administrasi WebGIS Kota Bogor
            </h1>

            <p className="text-sm text-slate-200 leading-relaxed font-normal">
                Kelola master data kafe ramah mahasiswa, verifikasi laporan fasilitas colokan & Wi-Fi, serta analisis koridor transit Biskita Transpakuan dan jangkauan kampus IPB University secara terintegrasi.
            </p>

            <div class="grid grid-cols-2 gap-4 pt-2">
                <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <div class="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-1">
                        <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
                        <span>Radius Buffer</span>
                    </div>
                    <p class="text-[11px] text-slate-300">
                        Pemetaan jarak tempuh jalan kaki 500m hingga 2km dari kampus.
                    </p>
                </div>

                <div class="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <div class="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-1">
                        <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
                        <span>Moderasi Komunitas</span>
                    </div>
                    <p class="text-[11px] text-slate-300">
                        Verifikasi usulan kafe baru dan tiket laporan fasilitas real-time.
                    </p>
                </div>
            </div>
        </div>

        <!-- Bottom Note -->
        <div class="relative z-10 text-xs text-slate-400 flex items-center justify-between">
            <span>&copy; {{ date('Y') }} Go-around Kota Bogor</span>
            <span class="flex items-center gap-1.5 text-emerald-300">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Server Spasial Online
            </span>
        </div>
    </div>

    <!-- 2. Right Side Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div class="w-full max-w-md space-y-6">
            <!-- Back link -->
            <div>
                <a href="{{ route('home') }}" class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#005B54] transition-colors">
                    <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
                    <span>Kembali ke WebGIS Publik</span>
                </a>
            </div>

            <!-- Form Header -->
            <div class="space-y-2">
                <div class="flex items-center gap-2 lg:hidden">
                    <div class="w-8 h-8 rounded-lg bg-[#005B54] flex items-center justify-center text-white">
                        <i data-lucide="coffee" class="w-4 h-4"></i>
                    </div>
                    <span class="font-bold text-slate-900 text-base font-['Onest']">Go Around Admin</span>
                </div>

                <h2 class="text-2xl font-bold text-slate-900 tracking-tight font-['Onest']">
                    Masuk ke Portal Admin
                </h2>
                <p class="text-xs text-slate-500">
                    Silakan masukkan kredensial administrator untuk mengelola data WebGIS.
                </p>
            </div>

            <!-- 1-Click Demo Fill Box -->
            <div class="p-3.5 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-between gap-3">
                <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5 text-xs font-bold text-teal-950">
                        <i data-lucide="sparkles" class="w-3.5 h-3.5 text-[#005B54] shrink-0"></i>
                        <span>Pengujian & Evaluasi Cepat</span>
                    </div>
                    <p class="text-[11px] text-teal-800 truncate mt-0.5">
                        Akun: <code class="font-mono bg-white/70 px-1 py-0.5 rounded text-[10px]">admin@goaround.id</code>
                    </p>
                </div>
                <button
                    type="button"
                    @click="email = 'admin@goaround.id'; password = 'admin123';"
                    class="px-3 py-1.5 text-xs font-bold bg-[#005B54] hover:bg-[#004741] text-white rounded-lg transition-all cursor-pointer shadow-xs shrink-0"
                >
                    Gunakan Demo
                </button>
            </div>

            <!-- Error Alert -->
            @if(isset($errors) && $errors->any())
                <div class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
                    <span>{{ $errors->first() }}</span>
                </div>
            @endif

            @if(session('info'))
                <div class="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium flex items-center gap-2">
                    <i data-lucide="info" class="w-4 h-4 text-blue-600"></i>
                    <span>{{ session('info') }}</span>
                </div>
            @endif

            <!-- Login Form -->
            <form action="{{ route('admin.login.post') }}" method="POST" class="space-y-4">
                @csrf

                <!-- Email Field -->
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                        Email Administrator
                    </label>
                    <div class="relative">
                        <i data-lucide="mail" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                        <input
                            type="email"
                            name="email"
                            x-model="email"
                            placeholder="admin@goaround.id"
                            required
                            class="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all shadow-2xs placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <!-- Password Field -->
                <div>
                    <div class="flex items-center justify-between mb-1.5">
                        <label class="text-xs font-semibold text-slate-700">
                            Kata Sandi
                        </label>
                        <span class="text-[11px] text-slate-400 hover:text-[#005B54] cursor-pointer">
                            Lupa sandi?
                        </span>
                    </div>
                    <div class="relative">
                        <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                        <input
                            :type="showPassword ? 'text' : 'password'"
                            name="password"
                            x-model="password"
                            placeholder="••••••••"
                            required
                            class="w-full pl-10 pr-10 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all shadow-2xs placeholder:text-slate-400"
                        />
                        <button
                            type="button"
                            @click="showPassword = !showPassword"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                            title="Tampilkan sandi"
                        >
                            <i data-lucide="eye" x-show="!showPassword" class="w-4 h-4"></i>
                            <i data-lucide="eye-off" x-show="showPassword" class="w-4 h-4" style="display: none;"></i>
                        </button>
                    </div>
                </div>

                <!-- Remember Me Checkbox -->
                <div class="flex items-center justify-between text-xs pt-1">
                    <label class="flex items-center gap-2 text-slate-600 cursor-pointer">
                        <input
                            type="checkbox"
                            name="remember"
                            checked
                            class="w-4 h-4 rounded text-[#005B54] focus:ring-[#005B54]/20 border-slate-300"
                        />
                        <span>Ingat sesi masuk</span>
                    </label>
                </div>

                <!-- Submit Button -->
                <button
                    type="submit"
                    class="w-full py-2.5 px-4 bg-[#005B54] hover:bg-[#004741] active:scale-[0.99] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                    <span>Masuk ke Dashboard Admin</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
            </form>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (window.lucide) lucide.createIcons();
        });
    </script>
</body>
</html>
