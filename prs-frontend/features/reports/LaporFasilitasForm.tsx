'use client';

import { useState } from 'react';
import {
  Zap, Wifi, Volume2, TrendingUp, Clock, Sparkles,
  Upload, Mail, ArrowLeft, Send, CheckCircle2,
  MapPin, ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// ─── Types ─────────────────────────────────────────────────────────────────
type IssueType =
  | 'colokan_rusak'
  | 'wifi_lambat'
  | 'kebisingan_tinggi'
  | 'harga_naik'
  | 'jam_operasional'
  | 'fasilitas_baru';

type TimeOption = 'hari_ini' | 'kemarin' | 'pekan_ini' | 'lebih_7_hari';

// ─── Issue Options ──────────────────────────────────────────────────────────
const ISSUE_OPTIONS: {
  id: IssueType;
  icon: React.ReactNode;
  title: string;
  desc: string;
  activeColor: string;
  activeBg: string;
  activeBorder: string;
}[] = [
  {
    id: 'colokan_rusak',
    icon: <Zap className="w-3.5 h-3.5" />,
    title: 'Colokan Rusak / Mati',
    desc: 'Stopkontak mati di meja, tidak ada arus, atau jumlah berkurang drastis.',
    activeColor: 'text-teal-700',
    activeBg: 'bg-teal-50',
    activeBorder: 'border-teal-500',
  },
  {
    id: 'wifi_lambat',
    icon: <Wifi className="w-3.5 h-3.5" />,
    title: 'WiFi Lambat / Putus',
    desc: 'Speedtest < 10 Mbps, portal login macet, sering diskonek.',
    activeColor: 'text-blue-700',
    activeBg: 'bg-blue-50',
    activeBorder: 'border-blue-500',
  },
  {
    id: 'kebisingan_tinggi',
    icon: <Volume2 className="w-3.5 h-3.5" />,
    title: 'Kebisingan Tinggi',
    desc: 'BGM terlalu kencang, bising renovasi, atau tidak kondusif untuk nugas.',
    activeColor: 'text-orange-700',
    activeBg: 'bg-orange-50',
    activeBorder: 'border-orange-500',
  },
  {
    id: 'harga_naik',
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    title: 'Harga Naik / Minimum Order',
    desc: 'Menu melonjak tidak ramah kantong, ada syarat beli khusus per jam.',
    activeColor: 'text-rose-700',
    activeBg: 'bg-rose-50',
    activeBorder: 'border-rose-500',
  },
  {
    id: 'jam_operasional',
    icon: <Clock className="w-3.5 h-3.5" />,
    title: 'Jam Operasional / Tutup',
    desc: 'Batal buka 24 jam, tutup lebih awal, atau sedang renovasi total.',
    activeColor: 'text-purple-700',
    activeBg: 'bg-purple-50',
    activeBorder: 'border-purple-500',
  },
  {
    id: 'fasilitas_baru',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    title: 'Fasilitas Baru / Saran',
    desc: 'Ada spot meja nugas baru, musholla diperluas, AC baru dipasang.',
    activeColor: 'text-indigo-700',
    activeBg: 'bg-indigo-50',
    activeBorder: 'border-indigo-500',
  },
];

const TIME_OPTIONS: { id: TimeOption; label: string }[] = [
  { id: 'hari_ini', label: 'Hari Ini' },
  { id: 'kemarin', label: 'Kemarin' },
  { id: 'pekan_ini', label: 'Pekan Ini' },
  { id: 'lebih_7_hari', label: 'Lebih dari 7 Hari Lalu' },
];

// ─── Upload Slot ────────────────────────────────────────────────────────────
interface UploadSlotProps {
  label: string;
  hint: string;
  icon: React.ReactNode;
  preview: string | null;
  onChange: (f: string) => void;
}

function UploadSlot({ label, hint, icon, preview, onChange }: UploadSlotProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => onChange(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <label className="relative flex flex-col items-center justify-center gap-2 h-[140px] rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/60 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer group overflow-hidden">
      <input type="file" accept="image/*" className="sr-only" onChange={handleChange} />
      {preview ? (
        <Image src={preview} alt={label} fill className="object-cover rounded-xl" />
      ) : (
        <>
          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-[#005B54] transition-colors shadow-xs">
            {icon}
          </div>
          <p className="text-[12px] font-semibold text-gray-600 text-center px-2 leading-tight">{label}</p>
          <p className="text-[10.5px] text-gray-400 text-center px-3">{hint}</p>
        </>
      )}
      {preview && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
          <span className="text-white text-[11px] font-semibold">Ganti Foto</span>
        </div>
      )}
    </label>
  );
}

// ─── Main Form ──────────────────────────────────────────────────────────────
export interface LaporFasilitasFormProps {
  onToast?: (msg: string, type?: 'success' | 'info' | 'error' | 'warning', durationMs?: number) => void;
}

export function LaporFasilitasForm({ onToast }: LaporFasilitasFormProps = {}) {
  const [selectedCafe, setSelectedCafe] = useState('Anthology Coffee & Tea – Baranangsiang Indah');
  const [selectedIssues, setSelectedIssues] = useState<IssueType[]>(['colokan_rusak']);
  const [detail, setDetail] = useState('');
  const [time, setTime] = useState<TimeOption>('hari_ini');
  const [photoColokan, setPhotoColokan] = useState<string | null>(null);
  const [photoSpeedtest, setPhotoSpeedtest] = useState<string | null>(null);
  const [photoMenu, setPhotoMenu] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleIssue = (id: IssueType) => {
    setSelectedIssues((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIssues.length === 0) {
      onToast?.('Pilih minimal 1 jenis masalah terlebih dahulu', 'warning');
      return;
    }
    setIsSubmitting(true);

    // TODO [BACKEND]: Replace with real API call:
    //   const payload: ReportPayload = {
    //     cafe: selectedCafe, issues: selectedIssues, detail, time,
    //     photos: [photoColokan, photoSpeedtest, photoMenu].filter(Boolean),
    //     is_anonymous: isAnonymous, contact: contactInfo,
    //   };
    //   await fetch('/api/v1/reports', { method: 'POST', body: JSON.stringify(payload) })
    await new Promise((r) => setTimeout(r, 1200));

    setIsSubmitting(false);
    setIsSuccess(true);
    onToast?.('Laporan berhasil dikirim! Tim akan menindaklanjuti dalam < 24 jam.', 'success', 4000);
  };

  if (isSuccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[#E0F3EE] flex items-center justify-center mx-auto mb-5 shadow-sm">
          <CheckCircle2 className="w-9 h-9 text-[#005B54]" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Laporan Dikirim — 100% Anonim
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
          Laporan Berhasil Dikirim!
        </h2>
        <p className="text-sm text-gray-500 max-w-md leading-relaxed mb-6">
          Tiket kamu masuk ke antrean verifikasi. Tim surveyor mahasiswa SV IPB akan menindaklanjuti dalam{' '}
          <strong className="text-gray-700">&lt; 24 jam</strong>.
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#005B54] hover:bg-[#004741] text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Peta
          </Link>
          <button
            type="button"
            onClick={() => { setIsSuccess(false); setSelectedIssues(['colokan_rusak']); setDetail(''); }}
            className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl transition-all cursor-pointer"
          >
            Lapor Masalah Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 min-w-0">
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 space-y-8">

          {/* ── Section 1: Pilih Spot ─────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[15px] font-bold text-gray-900">
                1. Pilih Identitas Cafe / Spot Nugas <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-[#005B54] font-semibold bg-[#E0F3EE] px-2 py-0.5 rounded-full">
                Terdaftar di WebGIS
              </span>
            </div>

            {/* Dropdown */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <MapPin className="w-4 h-4 text-[#005B54]" />
              </div>
              <select
                value={selectedCafe}
                onChange={(e) => setSelectedCafe(e.target.value)}
                className="w-full appearance-none pl-9 pr-9 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#005B54]/30 focus:border-[#005B54] transition cursor-pointer"
              >
                <option>Anthology Coffee &amp; Tea – Baranangsiang Indah</option>
                <option>Popolo Coffee – Lodaya</option>
                <option>Kopi Nako – Pajajaran</option>
                <option>Yellow Truck Coffee – Taman Yasmin</option>
                <option>Cafe lainnya di Bogor…</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Mini GIS Map Preview */}
            <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 shadow-xs">
              <div className="relative h-[144px] bg-[#E8EDE6] flex items-center justify-center">
                {/* Simulated map tiles */}
                <div className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(0deg, transparent, transparent 39px, #d4d8d0 39px, #d4d8d0 40px),
                      repeating-linear-gradient(90deg, transparent, transparent 39px, #d4d8d0 39px, #d4d8d0 40px)
                    `,
                    backgroundSize: '40px 40px',
                    opacity: 0.5,
                  }}
                />
                {/* Roads simulation */}
                <div className="absolute top-1/3 left-0 right-0 h-[7px] bg-white/80 skew-y-1" />
                <div className="absolute left-1/3 top-0 bottom-0 w-[5px] bg-white/70 -skew-x-2" />
                <div className="absolute top-1/2 left-0 right-0 h-[4px] bg-white/50 -skew-y-1" />
                {/* Location pin */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#005B54] border-2 border-white shadow-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white fill-white" />
                  </div>
                  <div className="mt-1 w-2 h-2 rounded-full bg-[#005B54]/30" />
                </div>

                {/* Coordinate + Distance tags */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-gray-600 bg-white/85 backdrop-blur-sm px-2 py-1 rounded-lg shadow-xs">
                    <MapPin className="w-2.5 h-2.5 text-[#005B54]" />
                    -6.6028°S, 106.8123°E
                  </span>
                  <span className="inline-flex items-center text-[10px] font-semibold text-white bg-[#005B54]/80 backdrop-blur-sm px-2 py-1 rounded-lg shadow-xs">
                    850m dari IPB Baranangsiang
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <CheckCircle2 className="w-3 h-3 text-[#005B54]" />
                  <span>Koordinat spasial terdeteksi akurat</span>
                </div>
                <button type="button" className="text-[11px] font-semibold text-[#005B54] hover:text-[#004741] transition-colors cursor-pointer">
                  Ubah Pin Peta
                </button>
              </div>
            </div>
          </section>

          {/* ── Section 2: Jenis Masalah ──────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[15px] font-bold text-gray-900">
                2. Jenis Masalah / Ketidaksesuaian Fasilitas <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-gray-500 font-medium">Bisa pilih lebih dari satu</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ISSUE_OPTIONS.map((option) => {
                const active = selectedIssues.includes(option.id);
                return (
                  <label
                    key={option.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all select-none ${
                      active
                        ? `${option.activeBg} ${option.activeBorder}`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={active}
                      onChange={() => toggleIssue(option.id)}
                    />
                    {/* Checkbox visual */}
                    <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                      active ? `bg-[#005B54] border-[#005B54]` : 'border-gray-300 bg-white'
                    }`}>
                      {active && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className={`flex items-center gap-1.5 mb-0.5 text-[13px] font-semibold ${active ? option.activeColor : 'text-gray-800'}`}>
                        {option.icon}
                        <span>{option.title}</span>
                      </div>
                      <p className="text-[11.5px] text-gray-500 leading-relaxed">{option.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* ── Section 3: Detail Masalah ─────────────────────────── */}
          <section>
            <label className="block text-[15px] font-bold text-gray-900 mb-3">
              3. Detail Masalah &amp; Spesifikasi Area Meja
            </label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              rows={4}
              placeholder="Contoh: Stopkontak di 3 meja lantai 2 area semi-outdoor dekat jendela samping mati sejak kemarin siang. Meja tengah tidak ada aliran listrik."
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005B54]/30 focus:border-[#005B54] resize-none transition"
            />

            {/* Time selector */}
            <div className="mt-4">
              <p className="text-[12px] font-semibold text-gray-600 mb-2">
                Estimasi Waktu Kejadian / Terakhir Berkunjung:
              </p>
              <div className="flex flex-wrap gap-2">
                {TIME_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTime(opt.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      time === opt.id
                        ? 'bg-[#005B54] text-white border-[#005B54] shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ── Section 4: Bukti Foto ─────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[15px] font-bold text-gray-900">
                4. Bukti Foto Lapangan{' '}
                <span className="text-[12px] font-medium text-gray-400">(Opsional namun mempercepat verifikasi)</span>
              </label>
              <span className="text-[11px] text-gray-400 font-medium">Maks. 5 MB per berkas</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <UploadSlot
                label="Foto Colokan / Meja"
                hint="Seret berkas atau browse"
                icon={<Zap className="w-5 h-5" />}
                preview={photoColokan}
                onChange={setPhotoColokan}
              />
              <UploadSlot
                label="Screenshot Speedtest"
                hint="PNG, JPG, WebP"
                icon={<Upload className="w-5 h-5" />}
                preview={photoSpeedtest}
                onChange={setPhotoSpeedtest}
              />
              <UploadSlot
                label="Foto Menu / Struk"
                hint="Untuk bukti koreksi harga"
                icon={<Upload className="w-5 h-5" />}
                preview={photoMenu}
                onChange={setPhotoMenu}
              />
            </div>
          </section>

          {/* ── Section 5: Anonimitas & Notifikasi ───────────────── */}
          <section className="bg-gray-50/70 rounded-xl border border-gray-200 p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`mt-0.5 w-4.5 h-4.5 rounded border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                  isAnonymous ? 'bg-[#005B54] border-[#005B54]' : 'border-gray-300 bg-white'
                }`}
              >
                {isAnonymous && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div>
                <span className="text-[13.5px] font-semibold text-gray-900">
                  Kirim sebagai Anonim (Mahasiswa Bogor)
                </span>
                <p className="text-[11.5px] text-gray-500 leading-relaxed mt-0.5">
                  Data pribadi Anda tidak akan dipublikasikan ke publik. Jika ingin memantau tiket via Telegram/Email, masukkan di bawah ini:
                </p>
              </div>
            </label>

            {/* Contact input */}
            <div className="mt-4 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Mail className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Email kampus / @username telegram (opsional)"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005B54]/30 focus:border-[#005B54] bg-white transition"
              />
            </div>
          </section>

        </div>

        {/* ── Action Footer ──────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-t border-gray-100 bg-gray-50/50">
          <Link
            href="/"
            className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Batal &amp; Kembali ke Peta
          </Link>

          <button
            type="submit"
            disabled={isSubmitting || selectedIssues.length === 0}
            className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-[#005B54] hover:bg-[#004741] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Mengirim…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Kirim Laporan Fasilitas
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
