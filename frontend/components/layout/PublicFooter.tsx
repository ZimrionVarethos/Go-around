'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-white border-t border-gray-200/90 shrink-0 z-30 select-none text-xs">
      {/* ── Mobile layout: 2 compact rows (< sm) ── */}
      <div className="sm:hidden flex flex-col">
        {/* Row 1: verified pill + copyright */}
        <div className="flex items-center justify-between px-3 h-9 gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#D1FAE5] text-[#005B54] font-semibold text-[10px] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#005B54]" />
            {/* <span>120+ Terverifikasi</span> */}
          </span>
          <span className="text-gray-400 font-medium text-[10px] truncate">
            Go Around Bogor © 2026 · SV IPB
          </span>
        </div>
        {/* Row 2: saweria button + tentang riset */}
        <div className="flex items-center justify-between px-3 h-10 gap-2 border-t border-gray-100">
          <a
            href="https://saweria.co/goaround"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 font-bold bg-[#FAAE2B] hover:bg-[#F59E0B] text-gray-900 rounded-full border border-black/10 transition-colors text-xs shadow-2xs"
          >
            <Image src="/saweria.png" alt="Saweria" width={18} height={18} className="w-4.5 h-4.5 object-contain" />
            <span>Dukung Riset</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
          <Link
            href="/tentang-riset"
            className="text-gray-400 hover:text-gray-700 font-medium transition-colors text-[11px]"
          >
            Tentang Riset
          </Link>
        </div>
      </div>

      {/* ── Desktop layout: single row (sm+) ── */}
      <div className="hidden sm:flex items-center justify-between px-6 h-11 gap-4">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#005B54] font-semibold text-[11px] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#005B54]" />
            {/* <span>120+ Lokasi Terverifikasi</span> */}
          </span>
          <span className="text-gray-500 font-medium truncate">
            Go Around Bogor © 2026 
          </span>
        </div>

        {/* Center: Dukung Riset button */}
        <div className="flex items-center shrink-0">
          <a
            href="https://saweria.co/goaround"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 font-bold bg-[#FAAE2B] hover:bg-[#F59E0B] text-gray-900 rounded-full border border-black/10 shadow-2xs hover:shadow-xs transition-all text-xs"
          >
            <Image src="/saweria.png" alt="Saweria" width={20} height={20} className="w-5 h-5 object-contain" />
            <span>Dukung Riset</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        {/* Right */}
        <div className="shrink-0">
          <Link
            href="/tentang-riset"
            className="text-gray-500 hover:text-gray-900 font-medium transition-colors"
          >
            Tentang Riset
          </Link>
        </div>
      </div>
    </footer>
  );
}
