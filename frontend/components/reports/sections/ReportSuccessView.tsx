'use client';

import Link from 'next/link';
import { CheckCircleIcon, ArrowLeftIcon } from '@phosphor-icons/react';

interface ReportSuccessViewProps {
  placeName?: string;
  onReset: () => void;
}

export function ReportSuccessView({ placeName, onReset }: ReportSuccessViewProps) {
  return (
    <div className="flex-1 w-full bg-white rounded-2xl border-2 border-[#005B54] shadow-lg p-8 sm:p-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95">
      <div className="w-16 h-16 rounded-2xl bg-[#E0F3EE] border border-[#005B54] flex items-center justify-center mx-auto mb-5 shadow-xs">
        <CheckCircleIcon size={36} weight="duotone" className="text-[#005B54]" />
      </div>
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
        Laporan Tiket Berhasil Dikirim!
      </h2>
      <p className="text-sm text-gray-600 max-w-md leading-relaxed mb-6">
        Tiket laporan untuk <strong>{placeName}</strong> telah masuk ke antrean kurasi. Tim kurator mahasiswa SV IPB akan melakukan verifikasi on-site dalam kurun waktu 24 jam.
      </p>
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#005B54] hover:bg-[#004741] text-white font-bold text-sm rounded-xl shadow-xs transition-all active:scale-[0.98]"
        >
          <ArrowLeftIcon size={16} weight="bold" />
          <span>Kembali ke Peta</span>
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="px-6 py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-xl transition-all active:scale-[0.98] cursor-pointer"
        >
          Lapor Masalah Lain
        </button>
      </div>
    </div>
  );
}
