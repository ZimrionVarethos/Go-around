'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPinPlus,
  AlertTriangle,
  SlidersHorizontal,
  Search,
  Sparkles,
  Menu,
  X,
  Check,
  RotateCcw,
  ArrowRight,
  Wifi,
  Zap,
  Coffee,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useToast, type ToastType } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';

export interface PublicTopbarProps {
  onToast?: (msg: string, type?: ToastType, durationMs?: number) => void;
  onSearch?: (query: string) => void;
  onAiSearch?: (aiQuery: string) => void;
}

const AI_PROMPT_SUGGESTIONS = [
  'colokan tiap meja, wifi kenceng, es kopi murah dekat SV IPB',
  'cafe tenang & hening untuk nugas malam',
  'es kopi murah < 20rb dengan area outdoor sejuk',
  'buka 24 jam dengan parkir mobil luas',
];

export function PublicTopbar({ onToast, onSearch, onAiSearch }: PublicTopbarProps) {
  const { toasts, showToast, dismissToast } = useToast();
  const triggerToast = onToast || showToast;

  // Navigation / Menus State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchMode, setMobileSearchMode] = useState<'normal' | 'ai'>('ai');

  // Search States
  const [regularQuery, setRegularQuery] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [isAiFocused, setIsAiFocused] = useState(false);

  // Popover States
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter States
  const [minScore, setMinScore] = useState<string>('all');
  const [plugPref, setPlugPref] = useState<string>('abundant');
  const [wifiPref, setWifiPref] = useState<string>('all');
  const [ambiancePref, setAmbiancePref] = useState<string>('all');
  const [extraFacilities, setExtraFacilities] = useState<Record<string, boolean>>({
    open24h: false,
    musholla: true,
    carParking: false,
    acArea: true,
  });

  // Count active filters
  const activeFilterCount =
    (minScore !== 'all' ? 1 : 0) +
    (plugPref !== 'all' ? 1 : 0) +
    (wifiPref !== 'all' ? 1 : 0) +
    (ambiancePref !== 'all' ? 1 : 0) +
    Object.values(extraFacilities).filter(Boolean).length;

  // Outside click handler references
  const aiSearchRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (aiSearchRef.current && !aiSearchRef.current.contains(event.target as Node)) {
        setIsAiFocused(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers for Search
  const handleRegularSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!regularQuery.trim()) return;
    onSearch?.(regularQuery.trim());
    triggerToast(`Mencari "${regularQuery.trim()}" di peta...`, 'info');
  };

  const handleAiSearchSubmit = (queryToSearch?: string) => {
    const query = (queryToSearch ?? aiQuery).trim();
    if (!query) return;
    setIsAiFocused(false);
    setMobileSearchOpen(false);
    onAiSearch?.(query);
    // TODO [BACKEND]: POST /api/v1/ai/spatial-search { prompt: query }
    triggerToast(`✨ AI Spatial Match: Menganalisis spot dengan kriteria "${query}"...`, 'success', 4000);
  };

  const resetFilters = () => {
    setMinScore('all');
    setPlugPref('all');
    setWifiPref('all');
    setAmbiancePref('all');
    setExtraFacilities({
      open24h: false,
      musholla: false,
      carParking: false,
      acArea: false,
    });
    triggerToast('Semua filter dikembalikan ke default', 'info');
  };

  const applyFilters = () => {
    setFilterOpen(false);
    // TODO [BACKEND]: Connect to GET /api/v1/places with filter params
    triggerToast(`Filter diterapkan (${activeFilterCount} kriteria aktif)`, 'success');
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
                  <Sparkles className="w-3.5 h-3.5 text-[#005B54]" />
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
                  <Search className="w-3.5 h-3.5" />
                  <span>Cari Biasa</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input Row */}
            {mobileSearchMode === 'ai' ? (
              <div className="flex flex-col gap-2">
                <div className="relative w-full h-[42px] flex items-center bg-[#F4FAF8] border border-[#A7F3D0] rounded-[12px] px-3">
                  <Sparkles className="w-4 h-4 text-[#005B54] shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAiSearchSubmit();
                    }}
                    placeholder="Tulis kriteria cafe yang Anda inginkan..."
                    className="w-full bg-transparent text-xs text-gray-900 placeholder:text-gray-400 pl-2 focus:outline-none"
                  />
                  {aiQuery && (
                    <button
                      type="button"
                      onClick={() => handleAiSearchSubmit()}
                      className="shrink-0 bg-[#005B54] text-white p-1 rounded-md text-[11px] font-bold"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Suggestions Chips */}
                <div className="flex flex-col gap-1 pt-1">
                  <span className="text-[11px] font-semibold text-gray-400">Contoh Prompt:</span>
                  <div className="flex flex-wrap gap-1">
                    {AI_PROMPT_SUGGESTIONS.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAiQuery(prompt);
                          handleAiSearchSubmit(prompt);
                        }}
                        className="text-left text-[11px] bg-gray-50 border border-gray-200/80 hover:bg-[#EAFBF7] hover:border-[#A7F3D0] text-gray-700 hover:text-[#005B54] px-2 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        ✨ {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegularSearchSubmit} className="relative w-full h-[42px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  value={regularQuery}
                  onChange={(e) => setRegularQuery(e.target.value)}
                  placeholder="Cari cafe, jalan, atau area Bogor..."
                  className="w-full h-full pl-9 pr-3 text-xs bg-white border border-gray-200 rounded-[10px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54]"
                />
              </form>
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
              className="h-9 px-2.5 flex items-center gap-1.5 rounded-[10px] bg-gradient-to-r from-[#EAFBF7] to-[#E2F7F2] border border-[#A7F3D0] text-[#005B54] text-xs font-semibold hover:bg-[#d8f4e6] active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#005B54] shrink-0" />
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
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input (Tablet & Desktop) */}
          <form
            onSubmit={handleRegularSearchSubmit}
            className="hidden md:block relative w-[120px] lg:w-[170px] xl:w-[220px] h-[40px] shrink-0"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={regularQuery}
              onChange={(e) => setRegularQuery(e.target.value)}
              placeholder="Cari cafe, jalan..."
              className="w-full h-full pl-9 pr-7 text-xs bg-white border border-gray-200 rounded-[12px] text-gray-900 placeholder:text-gray-400 transition-all focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54]"
            />
            {regularQuery && (
              <button
                type="button"
                onClick={() => setRegularQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </form>

          {/* Interactive AI Search Input Bar (Tablet & Desktop) */}
          <div className="hidden md:block relative shrink-0" ref={aiSearchRef}>
            <div
              className={cn(
                'h-[40px] flex items-center gap-1.5 px-2.5 md:px-3 rounded-[12px] transition-all bg-gradient-to-r from-[#EAFBF7] to-[#F0FAF7] border',
                isAiFocused
                  ? 'border-[#005B54] ring-2 ring-[#005B54]/15 bg-white w-[180px] lg:w-[260px] xl:w-[300px] shadow-sm'
                  : 'border-[#A7F3D0] hover:border-[#6EE7B7] w-[125px] lg:w-[180px] xl:w-[240px]'
              )}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#005B54] shrink-0" />
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onFocus={() => {
                  setIsAiFocused(true);
                  setFilterOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAiSearchSubmit();
                }}
                placeholder="Cari AI..."
                className="w-full bg-transparent text-xs text-gray-900 placeholder:text-[#005B54]/75 focus:outline-none placeholder:truncate"
              />
              {aiQuery ? (
                <button
                  type="button"
                  onClick={() => setAiQuery('')}
                  className="text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : null}
              {aiQuery ? (
                <button
                  type="button"
                  onClick={() => handleAiSearchSubmit()}
                  title="Kirim Prompt AI"
                  className="bg-[#005B54] hover:bg-[#004741] text-white p-1 rounded-md shrink-0 transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <span className="text-[10px] font-bold bg-[#005B54] text-white px-1.5 py-0.5 rounded-[4px] shrink-0">
                  AI
                </span>
              )}
            </div>

            {/* AI Prompt Suggestions Popover */}
            {isAiFocused && (
              <div className="absolute top-[48px] right-0 w-[300px] sm:w-[360px] bg-white rounded-2xl border border-gray-200 shadow-xl p-3.5 flex flex-col gap-2.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                    <Sparkles className="w-3.5 h-3.5 text-[#005B54]" />
                    <span>Inspirasi Kebutuhan Spasial AI</span>
                  </div>
                  <span className="text-[10px] text-gray-400">Tekan Enter</span>
                </div>

                <div className="flex flex-col gap-1.5 pt-0.5">
                  {AI_PROMPT_SUGGESTIONS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAiQuery(prompt);
                        handleAiSearchSubmit(prompt);
                      }}
                      className="text-left text-xs bg-gray-50/80 hover:bg-[#EAFBF7] border border-gray-100 hover:border-[#A7F3D0] text-gray-700 hover:text-[#005B54] p-2 rounded-xl transition-all flex items-start gap-2 cursor-pointer group"
                    >
                      <span className="text-gray-400 group-hover:text-[#005B54] mt-0.5">•</span>
                      <span className="flex-1 line-clamp-2">{prompt}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-1 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                  <span>Ketik prompt bebas dalam bahasa santai</span>
                  <button
                    type="button"
                    onClick={() => setIsAiFocused(false)}
                    className="text-[#005B54] font-semibold hover:underline"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Interactive GIS Control Group (Filter & Preferences) */}
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            {/* Filter & GIS Button */}
            <div className="relative" ref={filterRef}>
              <button
                type="button"
                onClick={() => {
                  setFilterOpen(!filterOpen);
                  setIsAiFocused(false);
                }}
                title="Pengaturan GIS & Filter"
                className={cn(
                  'w-9 h-9 flex items-center justify-center rounded-[10px] border transition-all cursor-pointer relative',
                  filterOpen
                    ? 'bg-[#005B54] text-white border-[#005B54] shadow-xs'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#005B54] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Filter Popover */}
              {filterOpen && (
                <div className="fixed sm:absolute inset-x-3 sm:inset-x-auto top-20 sm:top-[48px] sm:right-0 w-auto sm:w-[360px] max-w-[calc(100vw-24px)] bg-white rounded-2xl border border-gray-200 shadow-2xl p-4 flex flex-col gap-3.5 z-50 max-h-[82vh] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Pengaturan GIS & Filter</h4>
                      <p className="text-[11px] text-gray-500">Sesuaikan kriteria spot nugas</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFilterOpen(false)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 1. Skor Nugas Minimum */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-gray-600">MINIMUM SKOR NUGAS</span>
                    <div className="grid grid-cols-4 gap-1 text-[11px]">
                      {[
                        { id: 'all', label: 'Semua' },
                        { id: '8', label: '★ ≥ 8.0' },
                        { id: '9', label: '★ ≥ 9.0' },
                        { id: '9.5', label: '★ ≥ 9.5' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setMinScore(item.id)}
                          className={cn(
                            'py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer',
                            minScore === item.id
                              ? 'bg-[#005B54] text-white border-[#005B54]'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Colokan Meja */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-gray-600 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>KETERSEDIAAN COLOKAN</span>
                    </span>
                    <div className="grid grid-cols-3 gap-1 text-[11px]">
                      {[
                        { id: 'all', label: 'Bebas' },
                        { id: 'moderate', label: 'Cukup' },
                        { id: 'abundant', label: 'Tiap Meja' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPlugPref(item.id)}
                          className={cn(
                            'py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer',
                            plugPref === item.id
                              ? 'bg-[#005B54] text-white border-[#005B54]'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Kecepatan WiFi */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-gray-600 flex items-center gap-1">
                      <Wifi className="w-3 h-3 text-[#005B54]" />
                      <span>KECEPATAN WIFI</span>
                    </span>
                    <div className="grid grid-cols-4 gap-1 text-[10.5px]">
                      {[
                        { id: 'all', label: 'Bebas' },
                        { id: '30', label: '>30 Mbps' },
                        { id: '50', label: '>50 Mbps' },
                        { id: '100', label: '>100 Mbps' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setWifiPref(item.id)}
                          className={cn(
                            'py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer',
                            wifiPref === item.id
                              ? 'bg-[#005B54] text-white border-[#005B54]'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Suasana / Akustik */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-gray-600 flex items-center gap-1">
                      <Coffee className="w-3 h-3 text-[#005B54]" />
                      <span>SUASANA & AKUSTIK</span>
                    </span>
                    <div className="grid grid-cols-3 gap-1 text-[11px]">
                      {[
                        { id: 'all', label: 'Semua' },
                        { id: 'quiet', label: 'Tenang' },
                        { id: 'moderate', label: 'Kondusif' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setAmbiancePref(item.id)}
                          className={cn(
                            'py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer',
                            ambiancePref === item.id
                              ? 'bg-[#005B54] text-white border-[#005B54]'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5. Fasilitas Tambahan Checkbox */}
                  <div className="flex flex-col gap-2 pt-1 border-t border-gray-100">
                    <span className="text-[11px] font-bold text-gray-600">FASILITAS WAJIB</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { key: 'musholla', label: 'Musholla' },
                        { key: 'acArea', label: 'Area Ber-AC' },
                        { key: 'carParking', label: 'Parkir Mobil' },
                        { key: 'open24h', label: 'Buka 24 Jam' },
                      ].map((facility) => (
                        <label
                          key={facility.key}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={extraFacilities[facility.key]}
                            onChange={(e) =>
                              setExtraFacilities((prev) => ({
                                ...prev,
                                [facility.key]: e.target.checked,
                              }))
                            }
                            className="rounded text-[#005B54] focus:ring-[#005B54]"
                          />
                          <span className="text-gray-700 font-medium">{facility.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                    <button
                      type="button"
                      onClick={applyFilters}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#005B54] hover:bg-[#004741] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Terapkan ({activeFilterCount})</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-5 w-[1px] bg-gray-200 mx-0.5 hidden lg:block shrink-0" />

          {/* Tambah Tempat CTA */}
          <Link
            href="/tambah-tempat"
            className="hidden md:flex h-[40px] items-center gap-1.5 px-2.5 lg:px-3.5 text-xs font-semibold rounded-[12px] bg-[#005B54] text-white hover:bg-[#004741] transition-all shadow-xs cursor-pointer shrink-0"
          >
            <MapPinPlus className="w-4 h-4 stroke-[2.2]" />
            <span className="hidden xl:inline">Tambah Tempat</span>
            <span className="inline xl:hidden">Tambah</span>
          </Link>

          {/* Lapor Fasilitas CTA */}
          <Link
            href="/lapor-fasilitas"
            className="hidden md:flex h-[40px] items-center gap-1.5 px-2.5 lg:px-3.5 text-xs font-semibold rounded-[12px] bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] hover:bg-[#fee2e2] transition-all cursor-pointer shrink-0"
          >
            <AlertTriangle className="w-4 h-4 text-[#DC2626] stroke-[2.2] shrink-0" />
            <span className="hidden xl:inline">Lapor Fasilitas</span>
            <span className="inline xl:hidden">Lapor</span>
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
            <div className="py-1 border-b border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setFilterOpen(true);
                }}
                title="Filter & Preferensi GIS"
                className="w-full flex items-center justify-between text-xs text-gray-700 p-2.5 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#005B54]" />
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
                <MapPinPlus className="w-4 h-4 stroke-[2.2]" />
                <span>Tambah Tempat Baru</span>
              </Link>
              <Link
                href="/lapor-fasilitas"
                onClick={() => setMobileMenuOpen(false)}
                className="h-[40px] flex items-center justify-center gap-2 text-xs font-semibold rounded-[10px] bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] hover:bg-[#fee2e2] transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-[#DC2626] stroke-[2.2]" />
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
