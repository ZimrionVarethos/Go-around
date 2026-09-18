'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { LaporFasilitasForm, ReportSidebar } from '@/components/reports';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';

export default function LaporFasilitasPage() {
  const { toasts, showToast, dismissToast } = useToast();
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col select-none">

      {/* ── Sticky back-button header ── */}
      <header className="sticky top-0 z-[500] bg-white/95 backdrop-blur-md border-b border-gray-200/90 shadow-2xs">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#005B54] bg-gray-50 hover:bg-teal-50/60 rounded-[10px] border border-gray-200 transition-all active:scale-[0.98] cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Peta</span>
            </Link>
            <div className="h-4 w-px bg-gray-200" />
            <span className="text-xs font-bold text-gray-900 truncate">Lapor Fasilitas</span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">
              Laporan Publik &amp; Anonim
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1">
        {/* Page Title */}
        <div className="mb-7 space-y-2">
          <h1 className="text-[26px] sm:text-[32px] font-extrabold text-[#005B54] leading-[34px] sm:leading-[40px] tracking-[-0.03em]">
            Lapor &amp; Koreksi Fasilitas Tempat Nugas
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Temukan colokan mati, Wi-Fi lambat, lonjakan harga, atau perubahan jam operasional? Laporkan kendala secara anonim agar kurator mahasiswa SV IPB segera memvalidasi dan memperbarui data spasial peta.
          </p>
        </div>

        {/* ── 2-Column Layout ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <LaporFasilitasForm onToast={showToast} />
          <ReportSidebar />
        </div>
      </main>

      <PublicFooter />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
