'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowSquareOutIcon } from '@phosphor-icons/react';

export function PublicFooter() {
  return (
    <footer className="bg-white border-t border-gray-200/90 shrink-0 z-30 select-none text-xs">

      {/* ── Mobile layout: 2 rows (< sm) ── */}
      <div className="sm:hidden flex flex-col divide-y divide-gray-100">
        {/* Row 1: Copyright — centered, clean */}
        <div className="flex items-center justify-center px-4 h-10">
          <span className="text-gray-400 font-medium text-[11px] text-center">
            Go Around Bogor © 2026 · Sekolah Vokasi IPB University
          </span>
        </div>

        {/* Row 2: Dukung Riset + Tentang Riset */}
        <div className="flex items-center justify-between px-4 h-12 gap-3">
          <a
            href="https://saweria.co/goaround"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 font-bold bg-[#FAAE2B] hover:bg-[#F59E0B] text-gray-900 rounded-full border border-black/10 transition-colors text-[12px] shadow-2xs"
          >
            <Image src="/saweria.png" alt="Saweria" width={16} height={16} className="w-4 h-4 object-contain" />
            <span>Dukung Riset</span>
            <ArrowSquareOutIcon size={13} weight="bold" className="opacity-70" />
          </a>
          <Link
            href="/tentang-riset"
            className="text-gray-500 hover:text-gray-800 font-semibold transition-colors text-[12px] shrink-0"
          >
            Tentang Riset
          </Link>
        </div>
      </div>

      {/* ── Tablet layout: single row (sm – lg) ── */}
      <div className="hidden sm:flex lg:hidden items-center justify-between px-6 h-12 gap-4">
        <span className="text-gray-500 font-medium text-[12px] truncate">
          Go Around Bogor © 2026 · SV IPB
        </span>

        <div className="flex items-center gap-4 shrink-0">
          <a
            href="https://saweria.co/goaround"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 font-bold bg-[#FAAE2B] hover:bg-[#F59E0B] text-gray-900 rounded-full border border-black/10 shadow-2xs hover:shadow-xs transition-all text-xs"
          >
            <Image src="/saweria.png" alt="Saweria" width={18} height={18} className="w-4.5 h-4.5 object-contain" />
            <span>Dukung Riset</span>
            <ArrowSquareOutIcon size={13} weight="bold" className="opacity-80" />
          </a>
          <Link
            href="/tentang-riset"
            className="text-gray-500 hover:text-gray-900 font-semibold transition-colors text-[12px]"
          >
            Tentang Riset
          </Link>
        </div>
      </div>

      {/* ── Desktop layout: single row (lg+) ── */}
      <div className="hidden lg:flex items-center justify-between px-6 h-11 gap-4">
        {/* Left */}
        <span className="text-gray-500 font-medium text-xs truncate">
          Go Around Bogor © 2026
        </span>

        {/* Center */}
        <div className="flex items-center shrink-0">
          <a
            href="https://saweria.co/goaround"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 font-bold bg-[#FAAE2B] hover:bg-[#F59E0B] text-gray-900 rounded-full border border-black/10 shadow-2xs hover:shadow-xs transition-all text-xs"
          >
            <Image src="/saweria.png" alt="Saweria" width={20} height={20} className="w-5 h-5 object-contain" />
            <span>Dukung Riset</span>
            <ArrowSquareOutIcon size={14} weight="bold" className="opacity-80" />
          </a>
        </div>

        {/* Right */}
        <div className="shrink-0">
          <Link
            href="/tentang-riset"
            className="text-gray-500 hover:text-gray-900 font-medium transition-colors text-xs"
          >
            Tentang Riset
          </Link>
        </div>
      </div>

    </footer>
  );
}
