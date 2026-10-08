'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ListIcon,
  MagnifyingGlassIcon,
  MapPinPlusIcon,
  SlidersHorizontalIcon,
  SparkleIcon,
  WarningIcon,
  XIcon,
} from '@phosphor-icons/react';
import { cn } from '@/lib/cn';
import { useToast, type ToastType } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete';
import type { PlaceSearchSuggestion } from '@/lib/search';

export interface PublicTopbarProps {
  onToast?: (msg: string, type?: ToastType, durationMs?: number) => void;
  onSearch?: (query: string) => void;
  onAiSearch?: (aiQuery: string) => void;
  onPlaceSelect?: (place: PlaceSearchSuggestion) => void;
  onOpenCriteria?: () => void;
  isCriteriaOpen?: boolean;
  activeFilterCount?: number;
}

export function PublicTopbar({
  onToast,
  onSearch,
  onAiSearch,
  onPlaceSelect,
  onOpenCriteria,
  isCriteriaOpen = false,
  activeFilterCount = 0,
}: PublicTopbarProps) {
  const { toasts, showToast, dismissToast } = useToast();
  const triggerToast = onToast || showToast;

  // Navigation / Menus State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchMode, setMobileSearchMode] = useState<'normal' | 'ai'>('ai');

  // Search States
  const [regularQuery, setRegularQuery] = useState('');
  const [aiQuery, setAiQuery] = useState('');

  // Handlers for Search
  const handleRegularSearchSubmit = (query: string) => {
    if (!query.trim()) return;
    setMobileSearchOpen(false);
    onSearch?.(query.trim());
    triggerToast(`Mencari "${query.trim()}" di peta...`, 'info');
  };

  const handlePlaceSuggestionSelect = (place: PlaceSearchSuggestion) => {
    setRegularQuery(place.name);
    setMobileSearchOpen(false);
    onPlaceSelect?.(place);
    triggerToast(`Menampilkan ${place.name} di peta.`, 'success', 2500);
  };

  const handleAiSearchSubmit = (queryToSearch?: string) => {
    const query = (queryToSearch ?? aiQuery).trim();
    if (!query) return;
    setMobileSearchOpen(false);
    onAiSearch?.(query);
    triggerToast(`Mencari spot sesuai kebutuhan "${query}"...`, 'info', 3000);
  };

  return (
    <>
      <header className="h-[64px] bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-[12px] flex items-center justify-between px-3 sm:px-5 gap-2 sm:gap-4 select-none shadow-sm relative z-50">
        {/* Left: Brand Wordmark */}
        <Link
          href="/"
          className="shrink-0 flex flex-col justify-center w-auto h-[45.273px] select-none"
        >
          <span
            className="font-brand text-[21px] sm:text-[24px] font-medium text-[#0F172A] leading-normal tracking-[-0.724px]"
            style={{
              fontFamily: "var(--font-onest), 'Onest', sans-serif",
            }}
          >
            Go Around
          </span>
        </Link>

        {/* Mobile Search Overlay */}
        {mobileSearchOpen && (
          <div className="absolute inset-x-2 sm:inset-x-4 top-2 sm:top-3 bg-white p-3 rounded-[16px] border border-gray-200 shadow-2xl flex flex-col gap-2.5 md:hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Mode Switcher */}
            <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
              <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMobileSearchMode('ai')}
                  className={cn(
                    'px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer',
                    mobileSearchMode === 'ai'
                      ? 'bg-white text-[#005B54] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <SparkleIcon size={14} weight="fill" className="text-[#005B54]" />
                  <span>Pencarian AI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileSearchMode('normal')}
                  className={cn(
                    'px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer',
                    mobileSearchMode === 'normal'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <MagnifyingGlassIcon size={14} weight="bold" />
                  <span>Cari Biasa</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <XIcon size={16} weight="bold" />
              </button>
            </div>

            {/* Input Row */}
            {mobileSearchMode === 'ai' ? (
              <SearchAutocomplete
                mode="need"
                value={aiQuery}
                onChange={setAiQuery}
                onSubmit={handleAiSearchSubmit}
                placeholder="Contoh: murah, tenang, banyak colokan…"
                autoFocus
                tone="need"
                className="h-[42px] w-full"
              />
            ) : (
              <SearchAutocomplete
                mode="place"
                value={regularQuery}
                onChange={setRegularQuery}
                onSubmit={handleRegularSearchSubmit}
                onPlaceSelect={handlePlaceSuggestionSelect}
                placeholder="Cari coffee shop, jalan, atau area…"
                autoFocus
                className="h-[42px] w-full"
              />
            )}
          </div>
        )}

        {/* Right: Search + AI + Filters Control Group aligned next to Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
          {/* Mobile Search Controls (< md) */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            {/* AI Search Trigger Pill */}
            <button
              type="button"
              onClick={() => {
                setMobileSearchMode('ai');
                setMobileSearchOpen(true);
              }}
              className="h-9 px-2.5 flex items-center gap-1.5 rounded-[10px] bg-gradient-to-r from-[#EAFBF7] to-[#E2F7F2] border border-[#005B54] text-[#005B54] text-xs font-semibold hover:bg-[#d8f4e6] active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <SparkleIcon size={14} weight="fill" className="text-[#005B54] shrink-0" />
              <span className="text-[11px] font-bold">Cari AI</span>
              <span className="text-[9px] font-extrabold bg-[#005B54] text-white px-1 py-0.5 rounded-[4px] leading-none">
                AI
              </span>
            </button>

            {/* Regular Search Icon Button */}
            <button
              type="button"
              onClick={() => {
                setMobileSearchMode('normal');
                setMobileSearchOpen(true);
              }}
              title="Cari Cafe / Lokasi"
              className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-700 border border-gray-200 transition-colors cursor-pointer shrink-0"
            >
              <MagnifyingGlassIcon size={16} weight="bold" />
            </button>
          </div>

          {/* Search Input (Tablet & Desktop) */}
          <SearchAutocomplete
            mode="place"
            value={regularQuery}
            onChange={setRegularQuery}
            onSubmit={handleRegularSearchSubmit}
            onPlaceSelect={handlePlaceSuggestionSelect}
            placeholder="Cari coffee shop…"
            className="hidden w-[150px] shrink-0 md:block lg:w-[190px] xl:w-[230px]"
          />

          {/* Interactive AI Search Input Bar (Tablet & Desktop) */}
          <SearchAutocomplete
            mode="need"
            value={aiQuery}
            onChange={setAiQuery}
            onSubmit={handleAiSearchSubmit}
            placeholder="Tulis kebutuhan…"
            tone="need"
            className="hidden w-[150px] shrink-0 md:block lg:w-[220px] xl:w-[280px]"
          />

          {/* Interactive GIS Control Group (Filter & Preferences) */}
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            {/* Filter & GIS Button -> Opens Sidebar Recommendation Criteria */}
            <button
              type="button"
              onClick={() => {
                onOpenCriteria?.();
              }}
              title="Atur Kriteria & Parameter Nugas"
              aria-label="Buka pengaturan kriteria nugas"
              className={cn(
                'w-9 h-9 flex items-center justify-center rounded-[10px] border transition-all cursor-pointer relative',
                isCriteriaOpen
                  ? 'bg-[#005B54] text-white border-[#005B54] shadow-xs'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
              )}
            >
              <SlidersHorizontalIcon size={16} weight="bold" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#005B54] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="h-5 w-[1px] bg-gray-200 mx-0.5 hidden lg:block shrink-0" />

          {/* Tambah Tempat CTA */}
          <Link
            href="/tambah-tempat"
            className="hidden md:flex h-[40px] items-center gap-1.5 px-2.5 lg:px-3.5 text-xs font-semibold rounded-[12px] bg-[#005B54] text-white hover:bg-[#004741] transition-all shadow-xs cursor-pointer shrink-0"
          >
            <MapPinPlusIcon size={16} weight="bold" />
            <span className="hidden xl:inline">Tambah Tempat</span>
            <span className="inline xl:hidden">Tambah</span>
          </Link>

          {/* Lapor Fasilitas CTA */}
          <Link
            href="/lapor-fasilitas"
            className="hidden md:flex h-[40px] items-center gap-1.5 px-2.5 lg:px-3.5 text-xs font-semibold rounded-[12px] bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] hover:bg-[#fee2e2] transition-all cursor-pointer shrink-0"
          >
            <WarningIcon size={16} weight="duotone" className="text-[#DC2626] shrink-0" />
            <span className="hidden xl:inline">Lapor Fasilitas</span>
            <span className="inline xl:hidden">Lapor</span>
          </Link>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            title="Menu"
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-[10px] bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? <XIcon size={16} weight="bold" /> : <ListIcon size={16} weight="bold" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-[70px] inset-x-4 bg-white border border-gray-200 rounded-[16px] shadow-lg p-4 flex flex-col gap-3 md:hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="py-1 border-b border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCriteria?.();
                }}
                title="Filter & Preferensi GIS"
                className="w-full flex items-center justify-between text-xs text-gray-700 p-2.5 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontalIcon size={16} weight="bold" className="text-[#005B54]" />
                  <span className="font-semibold">Filter GIS & Preferensi</span>
                </div>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#005B54] text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/tambah-tempat"
                onClick={() => setMobileMenuOpen(false)}
                className="h-[40px] flex items-center justify-center gap-2 text-xs font-semibold rounded-[10px] bg-[#005B54] text-white hover:bg-[#004741] transition-all"
              >
                <MapPinPlusIcon size={16} weight="bold" />
                <span>Tambah Tempat Baru</span>
              </Link>
              <Link
                href="/lapor-fasilitas"
                onClick={() => setMobileMenuOpen(false)}
                className="h-[40px] flex items-center justify-center gap-2 text-xs font-semibold rounded-[10px] bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] hover:bg-[#fee2e2] transition-all"
              >
                <WarningIcon size={16} weight="duotone" className="text-[#DC2626]" />
                <span>Lapor & Koreksi Fasilitas</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Fallback Toast Container if used standalone */}
      {!onToast && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </>
  );
}
