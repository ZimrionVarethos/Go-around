'use client';

import { FileText, Wifi, Volume2, Tag, MessageSquare, AlertTriangle } from 'lucide-react';

const VERIFIED_TICKETS = [
  {
    id: '#TK-992',
    status: 'Selesai Diperbaiki',
    statusColor: 'text-emerald-600 bg-emerald-50',
    dotColor: 'bg-emerald-500',
    cafe: 'Popolo Coffee – Lodaya',
    desc: 'Colokan meja lantai 2 kini telah dipasang perpanjangan stopkontak 6 lubang oleh pihak manajemen cafe.',
    verifier: 'Mhs SV IPB TIK',
    time: '2 jam yang lalu',
    icon: <Tag className="w-3 h-3" />,
  },
  {
    id: '#TK-888',
    status: 'Selesai Dipulihkan',
    statusColor: 'text-teal-600 bg-teal-50',
    dotColor: 'bg-teal-500',
    cafe: 'Anthology Coffee & Tea',
    desc: 'WiFi fiber optic dipulihkan menjadi 85 Mbps pasca perbaikan kabel jaringan putus di Jl. Baranangsiang Indah.',
    verifier: 'QA Kurator Kampus',
    time: 'Kemarin 16:20 WIB',
    icon: <Wifi className="w-3 h-3" />,
  },
  {
    id: '#TK-335',
    status: 'Sedang Divalidasi',
    statusColor: 'text-amber-600 bg-amber-50',
    dotColor: 'bg-amber-400',
    cafe: 'Kopi Nako – Pajajaran',
    desc: 'Laporan musik live terlalu keras pada sore hari. Tim sedang verifikasi tingkat kebisingan (dBA meter).',
    verifier: 'Cek On-site',
    time: '2 hari lalu',
    icon: <Volume2 className="w-3 h-3" />,
  },
];

export function ReportSidebar() {
  return (
    <aside className="hidden lg:flex flex-col gap-5 w-[400px] xl:w-[440px] shrink-0">
      {/* Card 1: Alur Penanganan */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <FileText className="w-4.5 h-4.5 text-[#005B54]" />
          <h2 className="text-[15px] font-bold text-gray-900">Alur Penanganan Laporan</h2>
        </div>

        <div className="relative pl-7">
          {/* Vertical divider */}
          <div className="absolute left-[13px] top-3 bottom-3 w-0.5 bg-gray-100 rounded-full" />

          {/* Step 1 */}
          <div className="relative mb-7 last:mb-0">
            <div className="absolute -left-7 top-0 w-7 h-7 rounded-full bg-[#005B54] text-white text-xs font-bold flex items-center justify-center shadow-sm">
              1
            </div>
            <h4 className="text-[13px] font-semibold text-gray-900 mb-1">Generate Tiket Publik Otomatis</h4>
            <p className="text-[11.5px] text-gray-500 leading-relaxed">
              Laporan tercatat dengan kode unik publik seperti{' '}
              <span className="font-mono bg-gray-100 text-gray-700 px-1 py-0.5 rounded text-[10px]">
                #TK-2026-xxx
              </span>{' '}
              tanpa identitas pelapor.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative mb-7 last:mb-0">
            <div className="absolute -left-7 top-0 w-7 h-7 rounded-full bg-[#005B54] text-white text-xs font-bold flex items-center justify-center shadow-sm">
              2
            </div>
            <h4 className="text-[13px] font-semibold text-gray-900 mb-1">Verifikasi Lapangan Mahasiswa SV IPB</h4>
            <p className="text-[11.5px] text-gray-500 leading-relaxed">
              Tim surveyor &amp; kurator memeriksa ke lokasi atau konfirmasi silang dengan barista cafe dalam &lt; 24 jam.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="absolute -left-7 top-0 w-7 h-7 rounded-full bg-[#005B54] text-white text-xs font-bold flex items-center justify-center shadow-sm">
              3
            </div>
            <h4 className="text-[13px] font-semibold text-gray-900 mb-1">Update Spasial &amp; Tagging WebGIS</h4>
            <p className="text-[11.5px] text-gray-500 leading-relaxed">
              Metadata cafe otomatis diperbarui di peta interaktif agar mahasiswa Bogor lainnya tahu dari zona colokan/WiFi.
            </p>
          </div>
        </div>
      </div>

      {/* Card 2: Laporan Terverifikasi Terkini */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-4.5 h-4.5 text-[#005B54]" />
            <h2 className="text-[15px] font-bold text-gray-900">Laporan Terverifikasi Terkini</h2>
          </div>
          {/* Live dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {VERIFIED_TICKETS.map((ticket) => (
            <div key={ticket.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {ticket.id}
                </span>
                <span className={`inline-flex items-center gap-1.5 text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${ticket.statusColor}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${ticket.dotColor}`} />
                  {ticket.status}
                </span>
              </div>
              <p className="text-[13px] font-semibold text-gray-900 mb-1">{ticket.cafe}</p>
              <p className="text-[11.5px] text-gray-500 leading-relaxed mb-2">{ticket.desc}</p>
              <div className="flex items-center justify-between text-[10.5px] text-gray-400 pt-1 border-t border-gray-50">
                <span>Verifikator: {ticket.verifier}</span>
                <span>{ticket.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 3: Callout Cafe Tutup */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex gap-3.5 items-start">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-amber-900 mb-1.5">
              Cafe Tutup Permanen / Ganti Nama?
            </h4>
            <p className="text-[11.5px] text-amber-800/80 leading-relaxed mb-3">
              Bantu rekan mahasiswa lain hemat ongkos bensin. Tandai langsung di peta atau mention bot Telegram komunitas WebGIS Bogor.
            </p>
            <button
              type="button"
              className="text-[12px] font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 transition-colors cursor-pointer"
            >
              Lapor Penutupan Cepat →
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
