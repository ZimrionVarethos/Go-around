import Link from 'next/link';
import { FileText, Coffee } from 'lucide-react';

interface AdminWelcomeBannerProps {
  activeTicketsCount: number;
}

export function AdminWelcomeBanner({ activeTicketsCount }: AdminWelcomeBannerProps) {
  return (
    <div className="bg-[#F6F4ED] rounded-xl p-4 sm:p-5 border border-[#E2E0D8] shadow-card-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="space-y-1 max-w-2xl">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#005B54]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#005B54] animate-pulse" />
          <span>Status Operasional WebGIS · Kota Bogor</span>
        </div>
        <h2
          className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight"
          style={{ fontFamily: "var(--font-onest), 'Onest', sans-serif" }}
        >
          Pemeliharaan Direktori &amp; Moderasi Fasilitas Tempat Nugas
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Saat ini terdapat{' '}
          <strong className="font-bold text-slate-900 tabular-nums">
            {activeTicketsCount} laporan fasilitas terbuka
          </strong>{' '}
          yang menunggu peninjauan teknis.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/admin/reports"
          className="bg-[#005B54] hover:bg-[#004741] text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 tactile-press shadow-2xs"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="tabular-nums">Tinjau Laporan ({activeTicketsCount})</span>
        </Link>
        <Link
          href="/admin/places"
          className="bg-white hover:bg-[#EFECE1] text-slate-800 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all border border-[#D5D3C8] flex items-center gap-1.5 tactile-press shadow-2xs"
        >
          <Coffee className="w-3.5 h-3.5 text-[#005B54]" />
          <span>Kelola Kafe</span>
        </Link>
      </div>
    </div>
  );
}
