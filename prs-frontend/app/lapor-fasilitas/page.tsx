'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { LaporFasilitasForm, ReportSidebar } from '@/components/reports';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';

export default function LaporFasilitasPage() {
  const { toasts, showToast, dismissToast } = useToast();
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col select-none">

      {/* ── Sticky back-button header ── */}
      <div className="sticky top-0 z-[500] bg-white/95 backdrop-blur-md border-b border-gray-200/80">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#005B54] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Peta</span>
          </Link>
          <div className="h-4 w-px bg-gray-200" />
          <span className="text-xs font-bold text-gray-900 truncate">Lapor Fasilitas</span>
        </div>
      </div>

      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1">

        {/* ── Banner: Informasi Anonimitas & SLA ── */}
        <div className="flex items-start sm:items-center justify-between gap-4 bg-white rounded-2xl border border-amber-200/70 shadow-xs px-5 py-4 mb-6">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h1 className="text-[14px] font-bold text-gray-900">
                  Formulir Lapor &amp; Koreksi Fasilitas Cafe
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  100% Terbuka &amp; Anonim
                </span>
              </div>
              <p className="text-[12px] text-gray-500 leading-relaxed">
                Setiap laporan langsung diteruskan ke kurator untuk verifikasi geospasial lapangan.
              </p>
            </div>
          </div>

          {/* SLA Target */}
          <div className="hidden sm:flex flex-col items-end shrink-0 border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50/80">
            <span className="text-[10px] font-semibold text-gray-500 mb-0.5">Target Verifikasi</span>
            <span className="text-[13px] font-extrabold text-[#005B54]">&lt; 24 Jam Kerja</span>
          </div>
        </div>

        {/* ── 2-Column Grid ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <LaporFasilitasForm onToast={showToast} />
          <ReportSidebar />
        </div>
      </main>

      <PublicFooter />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
