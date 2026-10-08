'use client';

import {
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@phosphor-icons/react';

const VERIFIED_TICKETS = [
  {
    id: '#TK-992',
    status: 'Selesai Diperbaiki',
    statusColor: 'text-emerald-700 bg-emerald-50 border-[#005B54]',
    dotColor: 'bg-emerald-500',
    cafe: 'Popolo Coffee – Lodaya',
    desc: 'Colokan meja lantai 2 kini telah dipasang perpanjangan stopkontak 6 lubang oleh pihak manajemen cafe.',
    verifier: 'Mhs SV IPB TIK',
    time: '2 jam lalu',
  },
  {
    id: '#TK-888',
    status: 'Selesai Dipulihkan',
    statusColor: 'text-teal-700 bg-teal-50 border-[#005B54]',
    dotColor: 'bg-teal-500',
    cafe: 'Anthology Coffee & Tea',
    desc: 'WiFi fiber optic dipulihkan menjadi 85 Mbps pasca perbaikan kabel jaringan putus di Jl. Baranangsiang Indah.',
    verifier: 'QA Kurator Kampus',
    time: 'Kemarin 16:20 WIB',
  },
  {
    id: '#TK-335',
    status: 'Sedang Divalidasi',
    statusColor: 'text-amber-700 bg-amber-50 border-amber-200/80',
    dotColor: 'bg-amber-500',
    cafe: 'Kopi Nako – Pajajaran',
    desc: 'Laporan musik live terlalu bising. Tim relawan sedang verifikasi tingkat kebisingan (dBA meter) saat jam nugas.',
    verifier: 'Cek On-site',
    time: '2 hari lalu',
  },
];

export function ReportSidebar() {
  return (
    <aside className="w-full lg:w-[420px] shrink-0 space-y-5 lg:sticky lg:top-20">
      {/* Card 1: Alur Penanganan Laporan */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#005B54]" />
            <h3 className="text-sm font-bold text-gray-900">
              Alur Verifikasi Penanganan Laporan
            </h3>
          </div>
          <span className="bg-[#E0F3EE] text-[#005B54] text-xs font-bold px-2.5 py-1 rounded-full border border-[#005B54]">
            SOP Kurasi
          </span>
        </div>

        {/* SLA Target Box */}
        <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <ClockIcon size={16} weight="duotone" className="text-[#005B54]" />
            <span className="text-xs sm:text-sm font-bold">Target Validasi On-site</span>
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-[#005B54]">&lt; 24 Jam Kerja</span>
        </div>

        {/* Steps List */}
        <div className="space-y-3.5 pt-1">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#005B54] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              1
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                Generate Tiket Publik Otomatis
              </p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Laporan tercatat dengan kode unik publik seperti{' '}
                <span className="font-mono bg-teal-50 border border-[#005B54] text-[#005B54] px-1.5 py-0.5 rounded text-xs font-bold">
                  #TK-2026-xxx
                </span>{' '}
                tanpa mempublikasikan data pribadi pelapor.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#005B54] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              2
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                Verifikasi Lapangan Mahasiswa SV IPB
              </p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Tim surveyor mahasiswa memeriksa ke lokasi fisik kafe atau konfirmasi silang langsung dengan barista dan pengelola.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#005B54] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              3
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                Sinkronisasi Spasial &amp; Tagging WebGIS
              </p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Kondisi aktual spot nugas otomatis diperbarui pada peta interaktif agar mahasiswa Bogor lainnya mendapatkan info terakurat.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 flex items-start gap-2 leading-relaxed pt-3 border-t border-gray-100">
          <ShieldCheckIcon size={16} weight="duotone" className="text-[#005B54] shrink-0 mt-0.5" />
          <span>Setiap perbaikan divalidasi langsung oleh komunitas relawan mahasiswa IPB University.</span>
        </p>
      </div>

      {/* Card 2: Laporan Terverifikasi Terkini */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircleIcon size={16} weight="fill" className="text-emerald-600" />
            <h3 className="text-sm font-bold text-gray-900">
              Laporan Terverifikasi Terkini
            </h3>
          </div>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
        </div>

        <div className="space-y-3">
          {VERIFIED_TICKETS.map((ticket) => (
            <div
              key={ticket.id}
              className="border border-gray-200 rounded-xl p-3.5 bg-gray-50/40 hover:bg-white hover:border-[#005B54]/40 hover:shadow-2xs transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 border border-[#005B54] px-2 py-0.5 rounded-md">
                  {ticket.id}
                </span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border ${ticket.statusColor}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${ticket.dotColor}`} />
                  {ticket.status}
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900 leading-snug">{ticket.cafe}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{ticket.desc}</p>
              <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                <span>Oleh: {ticket.verifier}</span>
                <span>{ticket.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
