import Link from 'next/link';
import { Sparkles, FileText, Coffee } from 'lucide-react';

interface AdminWelcomeBannerProps {
  activeTicketsCount: number;
}

export function AdminWelcomeBanner({ activeTicketsCount }: AdminWelcomeBannerProps) {
  return (
    <div className="bg-gradient-to-r from-[#005B54] to-[#003B37] rounded-2xl p-5 sm:p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="space-y-1 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-medium backdrop-blur-xs">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Sistem Informasi Geografis Go Around Kota Bogor</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          Selamat Bertugas, Tim Admin SIG
        </h2>
        <p className="text-sm text-teal-100 font-normal leading-relaxed">
          Terdapat <strong>{activeTicketsCount} tiket laporan fasilitas</strong> yang membutuhkan validasi teknis dan verifikasi lapangan dari mahasiswa.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Link
          href="/admin/reports"
          className="bg-white text-[#005B54] hover:bg-teal-50 active:scale-95 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
        >
          <FileText className="w-4 h-4" />
          <span>Tinjau Laporan</span>
        </Link>
        <Link
          href="/admin/places"
          className="bg-white/20 hover:bg-white/30 text-white active:scale-95 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all border border-white/20 flex items-center gap-1.5"
        >
          <Coffee className="w-4 h-4" />
          <span>Kelola Kafe</span>
        </Link>
      </div>
    </div>
  );
}
