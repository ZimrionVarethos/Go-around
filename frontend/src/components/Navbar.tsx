'use client';

import React, { useState } from 'react';
import { Coffee, Sparkles, PlusCircle, Search, X } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onOpenRecommend: () => void;
  onOpenContribute: () => void;
  placesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenRecommend,
  onOpenContribute,
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-850 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 relative">
        {/* Protruding / Hanging Logo Pod (Clean Without Child Subtitle) */}
        <div className="flex items-center gap-3">
          <div className="relative -mt-1 pt-2 pb-3 px-3.5 sm:px-4 bg-zinc-900 border-x border-b border-zinc-700/80 rounded-b-2xl shadow-2xl flex items-center gap-2.5 sm:gap-3 transition-transform hover:translate-y-0.5">
            {/* Metallic Circle Emblem */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-zinc-700 via-zinc-900 to-black p-0.5 border border-zinc-600 shadow-inner flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                <Coffee className="w-5 h-5 sm:w-5 sm:h-5" />
              </div>
            </div>

            {/* Brand Title in Syne Font */}
            <div className="flex items-center gap-1.5">
              <span className="font-syne font-extrabold text-sm sm:text-base tracking-tight text-white uppercase">
                GO AROUND
              </span>
              <span className="text-[9px] font-syne font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/40">
                BOGOR
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Cari spot warkop, cafe, wifi kencang, jalan..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-zinc-900/90 text-xs font-sans text-zinc-200 placeholder-zinc-500 pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-zinc-500 transition-colors shadow-inner"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-xl border border-zinc-800 cursor-pointer"
          >
            {isMobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenRecommend}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-xs font-syne font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl transition-all shadow-lg shadow-emerald-950/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Nugas Scorer</span>
            <span className="sm:hidden">Scorer</span>
          </button>

          <button
            onClick={onOpenContribute}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-xs font-syne font-bold uppercase tracking-wider bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 rounded-xl transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Tambah Spot</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {isMobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-zinc-900 animate-fade-in">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              autoFocus
              placeholder="Cari warkop, cafe, wifi, jalan..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-zinc-900 text-xs font-sans text-zinc-200 placeholder-zinc-500 pl-9 pr-3 py-2 rounded-lg border border-zinc-800 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      )}
    </header>
  );
};
