'use client';

import {
  Unplug,
  WifiOff,
  Volume2,
  TrendingUp,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export type IssueType =
  | 'colokan_rusak'
  | 'wifi_lambat'
  | 'kebisingan_tinggi'
  | 'harga_naik'
  | 'jam_operasional'
  | 'fasilitas_baru';

export type TimeOption = 'hari_ini' | 'kemarin' | 'pekan_ini' | 'lebih_7_hari';

const ISSUE_OPTIONS = [
  {
    id: 'colokan_rusak' as const,
    title: 'Colokan Rusak / Mati',
    desc: 'Stopkontak mati di meja, tidak ada arus listrik, atau berkurang drastis.',
    icon: Unplug,
  },
  {
    id: 'wifi_lambat' as const,
    title: 'WiFi Lambat / Putus',
    desc: 'Speedtest < 10 Mbps, portal login macet, atau sering terputus saat nugas.',
    icon: WifiOff,
  },
  {
    id: 'kebisingan_tinggi' as const,
    title: 'Kebisingan Tinggi',
    desc: 'BGM terlalu kencang, bising renovasi/jalan, tidak kondusif untuk fokus.',
    icon: Volume2,
  },
  {
    id: 'harga_naik' as const,
    title: 'Harga Naik / Min. Order',
    desc: 'Menu melonjak drastis tidak ramah kantong, ada syarat minimal beli per jam.',
    icon: TrendingUp,
  },
  {
    id: 'jam_operasional' as const,
    title: 'Jam Operasional / Tutup',
    desc: 'Tidak lagi buka 24 jam, tutup lebih awal, atau sedang tutup renovasi total.',
    icon: Clock,
  },
  {
    id: 'fasilitas_baru' as const,
    title: 'Fasilitas Baru / Saran',
    desc: 'Spot meja kerja baru, musholla diperluas, AC baru dipasang, atau saran.',
    icon: Sparkles,
  },
];

const TIME_OPTIONS: { id: TimeOption; label: string }[] = [
  { id: 'hari_ini', label: 'Hari Ini' },
  { id: 'kemarin', label: 'Kemarin' },
  { id: 'pekan_ini', label: 'Pekan Ini' },
  { id: 'lebih_7_hari', label: 'Lebih 7 Hari Lalu' },
];

interface IssueSelectionSectionProps {
  selectedIssues: IssueType[];
  onToggleIssue: (id: IssueType) => void;
  detail: string;
  onDetailChange: (val: string) => void;
  time: TimeOption;
  onTimeChange: (val: TimeOption) => void;
}

export function IssueSelectionSection({
  selectedIssues,
  onToggleIssue,
  detail,
  onDetailChange,
  time,
  onTimeChange,
}: IssueSelectionSectionProps) {
  return (
    <>
      {/* ── Section 2: Jenis Masalah (Card 2) ── */}
      <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-7 space-y-5">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
              2
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                Jenis Masalah / Ketidaksesuaian Fasilitas <span className="text-red-500">*</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Pilih satu atau lebih kendala fasilitas yang dialami langsung saat nugas
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            Dapat memilih lebih dari satu
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ISSUE_OPTIONS.map((item) => {
            const isSelected = selectedIssues.includes(item.id);
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onToggleIssue(item.id)}
                className={cn(
                  'p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none active:scale-[0.98]',
                  isSelected
                    ? 'bg-[#F0FAF7] border-[#005B54] ring-1 ring-[#005B54]/30 shadow-xs'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                )}
              >
                <div
                  className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                    isSelected ? 'bg-[#005B54] text-white shadow-2xs' : 'bg-gray-100 text-gray-600'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs sm:text-sm font-bold text-gray-900">{item.title}</p>
                    <div
                      className={cn(
                        'w-4 h-4 rounded-md flex items-center justify-center transition-colors shrink-0',
                        isSelected ? 'bg-[#005B54] text-white' : 'border border-gray-300 bg-white'
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 3: Detail & Waktu Kejadian (Card 3) ── */}
      <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-7 space-y-5">
        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
            3
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              Detail Masalah &amp; Estimasi Waktu <span className="text-red-500">*</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Deskripsikan area spesifik meja atau kronologi kendala yang ditemukan
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-800">
            Spesifikasi Meja / Catatan Tambahan <span className="text-red-500">*</span>
          </label>
          <textarea
            value={detail}
            onChange={(e) => onDetailChange(e.target.value)}
            rows={4}
            placeholder="Contoh: Stopkontak di 3 meja lantai 2 area semi-outdoor dekat jendela samping mati sejak kemarin siang. Meja tengah tidak ada aliran listrik."
            className="w-full p-3.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all resize-none shadow-2xs"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-800">
            Estimasi Waktu Kejadian / Terakhir Berkunjung
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {TIME_OPTIONS.map((opt) => {
              const isSelected = time === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onTimeChange(opt.id)}
                  className={cn(
                    'h-10 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none active:scale-[0.98]',
                    isSelected
                      ? 'bg-[#005B54] text-white border-[#005B54] shadow-2xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  )}
                >
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
