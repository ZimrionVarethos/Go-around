'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  MapPinPlus,
  AlertTriangle,
  Layers,
  SlidersHorizontal,
  Search,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

export function PublicTopbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="h-[64px] bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-[12px] flex items-center justify-between px-4 sm:px-5 gap-3 sm:gap-4 select-none shadow-sm relative z-50">
      {/* Left: Brand Wordmark */}
      <Link href="/" className="shrink-0 flex items-center">
        <span className="font-brand text-[20px] sm:text-[22px] font-extrabold text-[#111827] tracking-tight leading-none">
          Go Around
        </span>
      </Link>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="absolute inset-x-4 top-3 bg-white p-2 rounded-[12px] border border-gray-200 shadow-lg flex items-center gap-2 md:hidden z-50">
          <div className="relative w-full h-[40px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              autoFocus
              placeholder="Cari cafe, jalan, atau area Bogor..."
              className="w-full h-full pl-9 pr-8 text-xs bg-white border border-gray-200 rounded-[10px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54]"
            />
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Right: Search + AI + Filters Control Group aligned next to Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        {/* Mobile Search Icon Button */}
        <button
          onClick={() => setMobileSearchOpen(true)}
          title="Cari"
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-[10px] bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors cursor-pointer shrink-0"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Search Input (Tablet & Desktop) */}
        <div className="hidden md:block relative w-[180px] lg:w-[270px] xl:w-[300px] h-[40px] shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari cafe, jalan, atau area Bogor..."
            className="w-full h-full pl-9 pr-3 text-xs bg-white border border-gray-200 rounded-[12px] text-gray-900 placeholder:text-gray-400 transition-all focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54]"
          />
        </div>

        {/* AI Recommendation Button */}
        <button className="h-[40px] flex items-center gap-1.5 px-2.5 md:px-3 text-xs font-semibold rounded-[12px] bg-gradient-to-r from-[#EAFBF7] to-[#E2F7F2] border border-[#A7F3D0] text-[#005B54] hover:bg-[#d8f4e6] transition-all cursor-pointer shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-[#005B54] shrink-0" />
          <span className="hidden lg:inline">Cari berdasarkan kebutuhan Anda</span>
          <span className="hidden md:inline lg:hidden">Cari AI</span>
          <span className="text-[10px] font-bold bg-[#005B54] text-white px-1.5 py-0.5 rounded-[4px]">
            AI
          </span>
        </button>

        {/* 3 Icon Buttons (Layers, Sliders/Filter, Bell) */}
        <div className="hidden sm:flex items-center gap-0.5 shrink-0">
          <button
            title="Lapisan Peta"
            className="w-8 h-8 flex items-center justify-center rounded-[8px] hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            title="Pengaturan GIS & Filter"
            className="w-8 h-8 flex items-center justify-center rounded-[8px] hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
          </button>
          <button
            title="Notifikasi"
            className="w-8 h-8 flex items-center justify-center rounded-[8px] hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-5 w-[1px] bg-gray-200 mx-0.5 hidden lg:block shrink-0" />

        {/* Tambah Tempat CTA */}
        <Link
          href="/tambah-tempat"
          className="hidden md:flex h-[40px] items-center gap-1.5 px-3.5 text-xs font-semibold rounded-[12px] bg-[#005B54] text-white hover:bg-[#004741] transition-all shadow-xs cursor-pointer shrink-0"
        >
          <MapPinPlus className="w-4 h-4 stroke-[2.2]" />
          <span className="hidden lg:inline">Tambah Tempat</span>
          <span className="inline lg:hidden">Tambah</span>
        </Link>

        {/* Lapor Fasilitas CTA */}
        <Link
          href="/lapor-fasilitas"
          className="hidden xl:flex h-[40px] items-center gap-1.5 px-3.5 text-xs font-semibold rounded-[12px] bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] hover:bg-[#fee2e2] transition-all cursor-pointer shrink-0"
        >
          <AlertTriangle className="w-4 h-4 text-[#DC2626] stroke-[2.2]" />
          <span>Lapor Fasilitas</span>
        </Link>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          title="Menu"
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-[10px] bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors cursor-pointer shrink-0"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-[70px] inset-x-4 bg-white border border-gray-200 rounded-[16px] shadow-lg p-4 flex flex-col gap-3 md:hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-around py-2 border-b border-gray-100">
            <button
              title="Lapisan Peta"
              className="flex flex-col items-center gap-1 text-[11px] text-gray-700 p-2 rounded-lg hover:bg-gray-50"
            >
              <Layers className="w-5 h-5 text-[#005B54]" />
              <span>Lapisan</span>
            </button>
            <button
              title="Filter & GIS"
              className="flex flex-col items-center gap-1 text-[11px] text-gray-700 p-2 rounded-lg hover:bg-gray-50 relative"
            >
              <SlidersHorizontal className="w-5 h-5 text-[#005B54]" />
              <span>Filter</span>
              <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            </button>
            <button
              title="Notifikasi"
              className="flex flex-col items-center gap-1 text-[11px] text-gray-700 p-2 rounded-lg hover:bg-gray-50"
            >
              <Bell className="w-5 h-5 text-[#005B54]" />
              <span>Notifikasi</span>
            </button>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Link
              href="/tambah-tempat"
              onClick={() => setMobileMenuOpen(false)}
              className="h-[40px] flex items-center justify-center gap-2 text-xs font-semibold rounded-[10px] bg-[#005B54] text-white hover:bg-[#004741] transition-all"
            >
              <MapPinPlus className="w-4 h-4 stroke-[2.2]" />
              <span>Tambah Tempat</span>
            </Link>
            <Link
              href="/lapor-fasilitas"
              onClick={() => setMobileMenuOpen(false)}
              className="h-[40px] flex items-center justify-center gap-2 text-xs font-semibold rounded-[10px] bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] hover:bg-[#fee2e2] transition-all"
            >
              <AlertTriangle className="w-4 h-4 text-[#DC2626] stroke-[2.2]" />
              <span>Lapor Fasilitas</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
