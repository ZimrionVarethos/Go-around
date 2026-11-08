@extends('layouts.admin')

@section('title', 'Tiket Laporan & Validasi Fasilitas — Go Around Bogor')

@section('admin_content')
<div class="space-y-6 max-w-7xl mx-auto w-full" x-data="{ resolveModalOpen: false, currentTicketId: null, currentTicketCode: '', currentCafeName: '', internalNote: '' }">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight font-['Onest']">
                Report & Tiket Validasi
            </h1>
            <p class="text-xs text-gray-500 mt-1">
                Kelola laporan fasilitas mahasiswa, verifikasi kecepatan internet, dan kondisi colokan kafe
            </p>
        </div>
        <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                <i data-lucide="bell" class="w-3.5 h-3.5 text-amber-600"></i>
                <span>{{ $tickets->where('status', 'open')->count() }} Tiket Terbuka</span>
            </span>
        </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-2xs space-y-3">
        <form method="GET" action="{{ route('admin.reports') }}" class="flex flex-col sm:flex-row items-center justify-between gap-3">
            <!-- Search -->
            <div class="relative w-full sm:w-96">
                <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                <input
                    type="text"
                    name="search"
                    value="{{ request('search') }}"
                    placeholder="Cari kode tiket, nama kafe, atau pelapor..."
                    class="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all"
                >
            </div>

            <!-- Status Tabs -->
            <div class="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <a href="{{ route('admin.reports', array_merge(request()->query(), ['status' => ''])) }}"
                   class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap {{ !request('status') ? 'bg-[#005B54] text-white shadow-xs' : 'bg-gray-50 text-gray-600 hover:bg-gray-100' }}">
                    Semua
                </a>
                <a href="{{ route('admin.reports', array_merge(request()->query(), ['status' => 'open'])) }}"
                   class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap {{ request('status') === 'open' ? 'bg-[#005B54] text-white shadow-xs' : 'bg-gray-50 text-gray-600 hover:bg-gray-100' }}">
                    Terbuka
                </a>
                <a href="{{ route('admin.reports', array_merge(request()->query(), ['status' => 'resolved'])) }}"
                   class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap {{ request('status') === 'resolved' ? 'bg-[#005B54] text-white shadow-xs' : 'bg-gray-50 text-gray-600 hover:bg-gray-100' }}">
                    Selesai
                </a>
                <a href="{{ route('admin.reports', array_merge(request()->query(), ['status' => 'dismissed'])) }}"
                   class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap {{ request('status') === 'dismissed' ? 'bg-[#005B54] text-white shadow-xs' : 'bg-gray-50 text-gray-600 hover:bg-gray-100' }}">
                    Diabaikan
                </a>
            </div>
        </form>
    </div>

    <!-- Tickets List -->
    <div class="space-y-4">
        @forelse($tickets as $ticket)
            <div class="bg-white rounded-2xl border p-5 sm:p-6 transition-all {{ $ticket->status === 'resolved' ? 'border-emerald-200 bg-emerald-50/20' : ($ticket->status === 'dismissed' ? 'border-gray-200 bg-gray-50/50 opacity-60' : 'border-gray-200/90 hover:border-gray-300 shadow-2xs') }}">
                <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div class="space-y-2 flex-1">
                        <!-- Top Metadata Row -->
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="font-mono text-xs font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                                {{ $ticket->ticket_code }}
                            </span>
                            <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full {{ $ticket->priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700' }}">
                                {{ $ticket->category }}
                            </span>
                            <span class="text-xs text-gray-400 flex items-center gap-1">
                                <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                                {{ $ticket->created_at->diffForHumans() }}
                            </span>
                            @if($ticket->is_unread && $ticket->status === 'open')
                                <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Belum dibaca"></span>
                            @endif
                        </div>

                        <!-- Cafe Name & Reported By -->
                        <div>
                            <h3 class="text-base font-bold text-gray-900 font-['Onest']">
                                {{ $ticket->cafe_name }}
                            </h3>
                            <p class="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                                <span>Pelapor: <strong>{{ $ticket->reported_by }}</strong></span>
                                <span>•</span>
                                <span>Lokasi: {{ $ticket->location }}</span>
                            </p>
                        </div>

                        <!-- Description -->
                        <p class="text-xs text-gray-700 leading-relaxed bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
                            {{ $ticket->description }}
                        </p>

                        <!-- Internal Admin Note if any -->
                        @if($ticket->internal_note)
                            <div class="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-start gap-2">
                                <i data-lucide="check-circle-2" class="w-4 h-4 text-[#005B54] shrink-0 mt-0.5"></i>
                                <div>
                                    <span class="font-bold text-[#005B54] block">Catatan Penyelesaian Admin:</span>
                                    <span>{{ $ticket->internal_note }}</span>
                                </div>
                            </div>
                        @endif
                    </div>

                    <!-- Action Controls -->
                    <div class="shrink-0 flex sm:flex-col items-center sm:items-end gap-2 pt-1 border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                        @if($ticket->status === 'open')
                            <button
                                type="button"
                                @click="currentTicketId = {{ $ticket->id }}; currentTicketCode = '{{ $ticket->ticket_code }}'; currentCafeName = '{{ addslashes($ticket->cafe_name) }}'; resolveModalOpen = true;"
                                class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                                <i data-lucide="check" class="w-3.5 h-3.5"></i>
                                <span>Selesaikan</span>
                            </button>

                            <form action="{{ route('admin.reports.dismiss', $ticket->id) }}" method="POST">
                                @csrf
                                <button type="submit" class="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 text-xs font-semibold transition-all cursor-pointer">
                                    Abaikan
                                </button>
                            </form>
                        @elseif($ticket->status === 'resolved')
                            <span class="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl">
                                <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Selesai
                            </span>
                        @else
                            <span class="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-xl">
                                Diabaikan
                            </span>
                        @endif
                    </div>
                </div>
            </div>
        @empty
            <div class="bg-white rounded-2xl border border-gray-200 p-12 text-center text-xs text-gray-400">
                Tidak ada tiket laporan yang sesuai dengan filter.
            </div>
        @endforelse
    </div>

    @if($tickets->hasPages())
        <div class="p-4 bg-white rounded-2xl border border-gray-200 flex items-center justify-between">
            {{ $tickets->links() }}
        </div>
    @endif

    <!-- Resolve Modal -->
    <div
        x-show="resolveModalOpen"
        class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        style="display: none;"
    >
        <div
            @click.away="resolveModalOpen = false"
            class="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
        >
            <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <i data-lucide="check-circle" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-sm text-gray-900 font-['Onest']">Tandai Selesai</h3>
                        <p class="text-[11px] text-gray-400" x-text="currentTicketCode + ' — ' + currentCafeName"></p>
                    </div>
                </div>
                <button type="button" @click="resolveModalOpen = false" class="text-gray-400 hover:text-gray-600 cursor-pointer">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <form :action="'/admin/reports/' + currentTicketId + '/resolve'" method="POST" class="space-y-4">
                @csrf

                <div>
                    <label class="block text-xs font-bold text-gray-700 mb-1">Catatan Tindak Lanjut Admin (Opsional)</label>
                    <textarea
                        name="internal_note"
                        rows="3"
                        placeholder="Contoh: Tim manajemen kafe telah mengganti stopkontak rusak di lantai 2..."
                        class="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54]"
                    ></textarea>
                </div>

                <div class="flex items-center justify-end gap-2 pt-2">
                    <button type="button" @click="resolveModalOpen = false" class="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer">
                        Batal
                    </button>
                    <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer">
                        Konfirmasi Selesai
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
