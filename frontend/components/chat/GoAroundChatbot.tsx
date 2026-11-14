'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ChatTeardropDotsIcon,
  XIcon,
  PaperPlaneTiltIcon,
  CoffeeIcon,
  MapPinIcon,
  SparkleIcon,
  ArrowClockwiseIcon,
  CheckCircleIcon,
  HeartIcon,
} from '@phosphor-icons/react';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  time: string;
}

const QUICK_PROMPTS = [
  '⚡ WiFi kencang > 50 Mbps',
  '🔌 Colokan melimpah di setiap meja',
  '🌙 Kafe buka 24 jam',
  '📍 Kafe terdekat dari lokasiku',
  '💰 Budget hemat minuman < 20rb',
  '🤫 Suasana hening & tenang buat skripsi',
];

// Helper to format basic markdown (bold, lists, linebreaks)
function renderMarkdown(content: string) {
  const lines = content.split('\n');
  return lines.map((line, idx) => {
    // Empty line
    if (!line.trim()) {
      return <div key={idx} className="h-2" />;
    }

    // Bullet point line
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const text = line.trim().slice(2);
      return (
        <li key={idx} className="ml-4 list-disc text-[12.5px] leading-relaxed my-0.5">
          {formatInline(text)}
        </li>
      );
    }

    // Header ###
    if (line.trim().startsWith('### ')) {
      return (
        <h4 key={idx} className="font-bold text-[13px] text-[#005B54] mt-2 mb-1">
          {formatInline(line.trim().slice(4))}
        </h4>
      );
    }

    return (
      <p key={idx} className="text-[12.5px] leading-relaxed my-1">
        {formatInline(line)}
      </p>
    );
  });
}

function formatInline(text: string) {
  // Split on bold markdown **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-slate-900">
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
        'Halo! Saya **Kofi**, asisten cerdas Go-Around ☕\n\nKamu lagi cari tempat nugas seperti apa di Kota Bogor? Ceritakan kebutuhanmu, misalnya:\n- Butuh WiFi kencang buat download/koding\n- Cari colokan banyak & suasana tenang\n- Spot buka 24 jam atau paling dekat dari posisimu!',
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

  // Request user location GPS
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
      // Build conversation history
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
          1. FLOATING BOTTOM RIGHT CONTROLS: CHATBOT + BUY ME A COFFEE
         ========================================================================= */}
      <div className="fixed bottom-4 right-4 z-[480] flex flex-col items-end gap-2.5 pointer-events-auto select-none">
        {/* Support Research / Buy Me A Coffee Pill */}
        <Link
          href="/tentang-riset"
          className="group inline-flex items-center gap-1.5 rounded-full bg-amber-500 hover:bg-amber-600 active:scale-95 px-3 py-1.5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(245,158,11,0.35)] transition-all cursor-pointer border border-amber-300/40 backdrop-blur-xs"
          title="Dukung Riset & Pengembangan Go-Around"
        >
          <CoffeeIcon size={16} weight="fill" className="text-white group-hover:rotate-12 transition-transform" />
          <span className="text-[11.5px] tracking-tight">Buy me a coffee</span>
        </Link>

        {/* Main Floating Chatbot Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 rounded-full bg-[#005B54] hover:bg-[#004741] active:scale-95 pl-3.5 pr-4 py-2.5 text-white shadow-[0_8px_24px_rgba(0,91,84,0.38)] transition-all cursor-pointer border border-teal-600/40"
          aria-label="Buka Chatbot Asisten Kafe Bogor"
        >
          {/* Glowing pulse indicator */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
          </span>

          <div className="flex items-center gap-1.5">
            <ChatTeardropDotsIcon size={20} weight="fill" className="text-amber-300" />
            <span className="text-xs font-bold tracking-tight">Tanya Kofi AI</span>
          </div>
        </button>
      </div>

      {/* =========================================================================
          2. CENTERED MODAL POPUP WITH BLURRED BACKDROP
         ========================================================================= */}
      {isOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-3 sm:p-6 backdrop-blur-md bg-black/45 animate-in fade-in duration-200">
          {/* Modal Container */}
          <div className="relative w-full max-w-[540px] h-[88vh] max-h-[680px] bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-5 py-4 bg-[#005B54] text-white flex items-center justify-between shadow-xs shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
                  <CoffeeIcon size={24} weight="fill" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-extrabold tracking-tight">Kofi — Asisten AI Kafe</h3>
                    <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30">
                      Gemini 3.8
                    </span>
                  </div>
                  <p className="text-[11px] text-teal-100 leading-tight">
                    Rekomendasi kafe nugas cerdas seputar Kota Bogor
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Tutup Chatbot"
              >
                <XIcon size={18} weight="bold" />
              </button>
            </div>

            {/* Sub-bar: Geolocation Status & Permission */}
            <div className="px-4 py-2 bg-[#F6F4ED] border-b border-amber-900/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-700">
                <MapPinIcon
                  size={15}
                  weight={userLocation ? 'fill' : 'regular'}
                  className={userLocation ? 'text-emerald-600' : 'text-slate-400'}
                />
                <span className="text-[11.5px] font-medium">
                  {userLocation
                    ? `Lokasimu aktif (${userLocation.latitude.toFixed(3)}, ${userLocation.longitude.toFixed(3)})`
                    : locationStatus === 'denied'
                    ? 'Akses lokasi tidak diizinkan'
                    : 'Aktifkan lokasi untuk hitung jarak'}
                </span>
              </div>

              {!userLocation && (
                <button
                  type="button"
                  onClick={handleRequestLocation}
                  disabled={locationStatus === 'requesting'}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-[#005B54] font-bold text-[11px] shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  {locationStatus === 'requesting' ? 'Mendeteksi...' : 'Izinkan GPS'}
                </button>
              )}

              {userLocation && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                  <CheckCircleIcon size={14} weight="fill" /> Akurat
                </span>
              )}
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF8F5]/60 no-scrollbar">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs text-slate-800 ${
                      m.role === 'user'
                        ? 'bg-[#005B54] text-white rounded-br-xs'
                        : 'bg-white border border-[#EBE4D8] rounded-bl-xs'
                    }`}
                  >
                    {m.role === 'model' ? (
                      <div className="prose prose-sm max-w-none text-slate-800">
                        {renderMarkdown(m.content)}
                      </div>
                    ) : (
                      <p className="text-[12.5px] leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 px-1 mt-1">{m.time}</span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="rounded-2xl rounded-bl-xs bg-white border border-[#EBE4D8] p-3 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#005B54]">
                      <ArrowClockwiseIcon size={16} className="animate-spin text-[#005B54]" />
                      <span>Kofi sedang berpikir & menganalisis kafe...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Chips */}
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {QUICK_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(p)}
                  disabled={isLoading}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#F4F1EA] hover:bg-[#EAE4D7] text-slate-700 text-[11px] font-medium transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya kafe di Bogor, misal: 'kafe hening dekat Pajajaran'..."
                className="flex-1 h-11 px-4 rounded-xl bg-slate-100 focus:bg-white border border-transparent focus:border-[#005B54] text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="h-11 w-11 rounded-xl bg-[#005B54] hover:bg-[#004741] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
                title="Kirim Pesan"
              >
                <PaperPlaneTiltIcon size={18} weight="fill" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

