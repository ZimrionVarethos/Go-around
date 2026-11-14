'use client';

import { useState, useRef, useEffect } from 'react';
import {
  XIcon,
  PaperPlaneTiltIcon,
  CoffeeIcon,
  MapPinIcon,
  SparkleIcon,
  ArrowClockwiseIcon,
  CheckCircleIcon,
} from '@phosphor-icons/react';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  time: string;
}

const QUICK_PROMPTS = [
  '⚡ WiFi > 50 Mbps & stabil',
  '🔌 Colokan banyak di meja',
  '🌙 Kafe buka 24 jam',
  '📍 Paling dekat dari posisiku',
  '💰 Minuman hemat < 20rb',
  '🤫 Suasana hening & tenang',
];

// Inline markdown helper for bold, headers, lists, and numbers
function renderMarkdown(content: string) {
  const lines = content.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return <div key={idx} className="h-1.5" />;
    }

    // Header 3 or 4
    if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
      const headerText = trimmed.replace(/^#+\s*/, '');
      return (
        <h4
          key={idx}
          className="font-bold text-xs uppercase tracking-wide text-[#005B54] mt-2 mb-1"
        >
          {formatInline(headerText)}
        </h4>
      );
    }

    // Numbered item (e.g. "1. Two Stories")
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      return (
        <div key={idx} className="flex items-start gap-1.5 my-1 pl-1">
          <span className="font-bold text-[#005B54] text-[11px] min-w-4">
            {numMatch[1]}.
          </span>
          <div className="text-[12.5px] leading-relaxed text-slate-800 flex-1">
            {formatInline(numMatch[2])}
          </div>
        </div>
      );
    }

    // Bullet point line
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const bulletText = trimmed.slice(2);
      return (
        <div key={idx} className="flex items-start gap-1.5 my-0.5 pl-3">
          <span className="text-amber-600 font-bold text-xs mt-0.5">•</span>
          <div className="text-[12px] leading-relaxed text-slate-700 flex-1">
            {formatInline(bulletText)}
          </div>
        </div>
      );
    }

    // Regular paragraph
    return (
      <p key={idx} className="text-[12.5px] leading-relaxed text-slate-800 my-1">
        {formatInline(line)}
      </p>
    );
  });
}

function formatInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function GoAroundChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    'idle' | 'requesting' | 'granted' | 'denied'
  >('idle');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content:
        'Halo! Saya **Kofi**, asisten nugas cerdas Go-around ☕\n\nLagi cari kafe seperti apa di Kota Bogor?\n- Butuh **WiFi kencang** & colokan melimpah?\n- Spot **buka 24 jam** atau **suasana hening**?\n- Atau ingin tahu yang **paling dekat dari posisimu**?\n\nCeritakan saja kebutuhan tugasmu!',
      time: 'Baru saja',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Request user GPS coordinates
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }
    setLocationStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocationStatus('granted');
      },
      () => {
        setLocationStatus('denied');
      },
      { timeout: 8000, enableHighAccuracy: true },
    );
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      time: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          location: userLocation,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Gagal menghubungi asisten AI.');
      }

      const botReply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.reply,
        time: timeStr,
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: `⚠️ ${err.message || 'Maaf, terjadi kendala koneksi ke asisten AI. Silakan coba kembali.'}`,
        time: timeStr,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* =========================================================================
          1. FLOATING BOTTOM RIGHT: BUY ME A COFFEE PILL + ICON-ONLY CHATBOT FAB
         ========================================================================= */}
      <div className="fixed bottom-4 right-4 z-[480] flex flex-col items-end gap-2 pointer-events-auto select-none">
        {/* Support Research / Buy Me A Coffee Pill */}
        <Link
          href="/tentang-riset"
          className="group inline-flex items-center gap-1.5 rounded-full bg-amber-500 hover:bg-amber-600 active:scale-95 px-3 py-1.5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(245,158,11,0.35)] transition-all cursor-pointer border border-amber-300/40"
          title="Dukung Riset & Pengembangan Go-around"
        >
          <CoffeeIcon
            size={15}
            weight="fill"
            className="text-white group-hover:rotate-12 transition-transform"
          />
          <span className="text-[11px] tracking-tight">Buy me a coffee</span>
        </Link>

        {/* Clean Icon-Only Floating Action Button (No text) */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#005B54] hover:bg-[#004741] active:scale-90 text-white shadow-[0_10px_25px_rgba(0,91,84,0.42)] transition-all cursor-pointer border border-teal-400/30"
          title="Tanya Kofi — Asisten AI Kafe Bogor"
          aria-label="Tanya Kofi — Asisten AI Kafe Bogor"
        >
          {/* Subtle live indicator pulse */}
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border border-white"></span>
          </span>

          {/* Coffee Icon with Mini Sparkle */}
          <div className="relative flex items-center justify-center">
            <CoffeeIcon
              size={24}
              weight="fill"
              className="text-amber-300 group-hover:scale-110 group-hover:-rotate-6 transition-transform"
            />
            <SparkleIcon
              size={11}
              weight="fill"
              className="absolute -top-1 -right-1 text-white animate-pulse"
            />
          </div>
        </button>
      </div>

      {/* =========================================================================
          2. MODERN CENTERED POPUP MODAL WITH BLURRED BACKDROP
         ========================================================================= */}
      {isOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-3 sm:p-5 backdrop-blur-md bg-slate-900/45 animate-in fade-in duration-200">
          {/* Main Card Container */}
          <div className="relative w-full max-w-[490px] h-[86vh] max-h-[640px] bg-[#FAF9F5] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border border-amber-900/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header: Clean Glass White */}
            <div className="px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-[#005B54] to-[#07796f] flex items-center justify-center text-amber-300 shadow-sm shrink-0">
                  <CoffeeIcon size={20} weight="fill" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                      Kofi
                    </h3>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-[10px] font-semibold text-emerald-700 border border-emerald-200/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-none mt-0.5">
                    Asisten cerdas nugas seputar Kota Bogor
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Tutup Chat"
              >
                <XIcon size={16} weight="bold" />
              </button>
            </div>

            {/* Sub-bar: Minimalist GPS Proximity Pill */}
            <div className="px-4 py-2 bg-white/70 border-b border-slate-200/50 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-1.5 text-slate-600 truncate">
                <MapPinIcon
                  size={14}
                  weight={userLocation ? 'fill' : 'regular'}
                  className={userLocation ? 'text-emerald-600' : 'text-slate-400'}
                />
                <span className="text-[11px] truncate">
                  {userLocation
                    ? 'Jarak kafe dihitung presisi dari lokasimu'
                    : 'Aktifkan lokasi untuk hitung jarak kafe terdekat'}
                </span>
              </div>

              {!userLocation ? (
                <button
                  type="button"
                  onClick={handleRequestLocation}
                  disabled={locationStatus === 'requesting'}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-[#005B54] font-bold text-[10.5px] shadow-2xs active:scale-95 transition-all cursor-pointer shrink-0 ml-2"
                >
                  {locationStatus === 'requesting' ? 'Mendeteksi...' : 'Izinkan GPS'}
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10.5px] text-emerald-700 font-semibold shrink-0 ml-2">
                  <CheckCircleIcon size={13} weight="fill" /> Aktif
                </span>
              )}
            </div>

            {/* Chat Stream / Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {m.role === 'user' ? (
                    <div className="max-w-[85%] rounded-2xl rounded-tr-xs px-3.5 py-2.5 bg-[#005B54] text-white shadow-xs text-xs sm:text-[12.5px] leading-relaxed whitespace-pre-wrap">
                      {m.content}
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 max-w-[92%]">
                      <div className="h-7 w-7 rounded-xl bg-[#005B54]/10 text-[#005B54] flex items-center justify-center shrink-0 mt-0.5 border border-[#005B54]/15">
                        <CoffeeIcon size={15} weight="fill" />
                      </div>
                      <div className="flex-1 rounded-2xl rounded-tl-xs p-3.5 bg-white border border-slate-200/70 shadow-2xs text-slate-800">
                        {renderMarkdown(m.content)}
                      </div>
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 px-1 mt-1">
                    {m.time}
                  </span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-2 max-w-[90%]">
                  <div className="h-7 w-7 rounded-xl bg-[#005B54]/10 text-[#005B54] flex items-center justify-center shrink-0 mt-0.5 border border-[#005B54]/15">
                    <CoffeeIcon size={15} weight="fill" />
                  </div>
                  <div className="rounded-2xl rounded-tl-xs px-3.5 py-2.5 bg-white border border-slate-200/70 shadow-2xs flex items-center gap-2 text-xs font-semibold text-[#005B54]">
                    <ArrowClockwiseIcon
                      size={15}
                      className="animate-spin text-[#005B54]"
                    />
                    <span>Kofi sedang meramu rekomendasi kafe...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Chips */}
            <div className="px-3.5 py-2 bg-white/80 border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {QUICK_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(p)}
                  disabled={isLoading}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-[#005B54] text-[11px] font-medium transition-all cursor-pointer shrink-0 disabled:opacity-50 shadow-2xs"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Integrated Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-slate-100 shrink-0"
            >
              <div className="flex items-center gap-2 bg-slate-100/90 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#005B54]/20 focus-within:border-[#005B54] border border-slate-200 rounded-2xl p-1.5 pl-3.5 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tanya kafe di Bogor (misal: 'wifi kencang dekat IPB')..."
                  className="flex-1 bg-transparent text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="h-9 w-9 rounded-xl bg-[#005B54] hover:bg-[#004741] disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
                  title="Kirim Pesan"
                >
                  <PaperPlaneTiltIcon size={16} weight="fill" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
