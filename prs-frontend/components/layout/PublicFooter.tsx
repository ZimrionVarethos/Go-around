'use client';

import Link from 'next/link';
import { Coffee } from 'lucide-react';

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
        {/* Row 2: coffee button + tentang riset */}
        <div className="flex items-center justify-between px-3 h-9 gap-2 border-t border-gray-100">
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 font-bold bg-[#FFDD00] hover:bg-[#FACC15] text-gray-900 rounded-full border border-black/10 transition-colors text-[10px]"
          >
            <Coffee className="w-3 h-3 fill-gray-900" />
            <span>Buy me a coffee</span>
          </a>
          <Link
            href="/tentang-riset"
            className="text-gray-400 hover:text-gray-700 font-medium transition-colors text-[10px]"
          >
            Tentang Riset
          </Link>
        </div>
      </div>

      {/* ── Desktop layout: single row (sm+) ── */}
      <div className="hidden sm:flex items-center justify-between px-6 h-10 gap-4">
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

        {/* Center */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-gray-500 font-medium hidden md:inline">❤️ Support Riset :</span>
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-0.5 font-bold bg-[#FFDD00] hover:bg-[#FACC15] text-gray-900 rounded-full border border-black/10 shadow-2xs transition-colors"
          >
            <Coffee className="w-3.5 h-3.5 fill-gray-900" />
            <span>Buy me a coffee</span>
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
