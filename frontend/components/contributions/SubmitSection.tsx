'use client';

import Link from 'next/link';
import { CheckIcon, PaperPlaneRightIcon, XIcon } from '@phosphor-icons/react';

export interface SubmitSectionProps {
  submitterEmail: string;
  onSubmitterEmailChange: (val: string) => void;
  isSubmitting: boolean;
}

export function SubmitSection({
  submitterEmail,
  onSubmitterEmailChange,
  isSubmitting,
}: SubmitSectionProps) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 sm:p-8 space-y-6">
      {/* Header with Step 5 Circle */}
      <div className="flex items-start gap-3.5 pb-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          5
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Kirim Usulan Spot Nugas (Publik &amp; Terbuka)
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Tidak memerlukan pendaftaran akun, data login, atau data identitas pribadi
          </p>
        </div>
      </div>

      {/* Green Anon Callout */}
      <div className="bg-[#F0FAF7] border border-[#005B54] rounded-xl p-4.5 flex items-start gap-3.5">
        <div className="w-6 h-6 rounded-full bg-[#005B54] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          <CheckIcon size={14} weight="bold" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">
            Kontribusi Terkirim Terbuka untuk Komunitas
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
            Data usulan langsung didaftarkan ke antrean kurasi GIS tanpa mengumpulkan nomor telepon ataupun identitas sensitif Anda.
          </p>
        </div>
      </div>

      {/* Email / Telegram Optional */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-900 block">
          Kontak Pengusul <span className="text-gray-400 font-normal text-xs">(Opsional — jika ingin dihubungi saat spot tayang)</span>
        </label>
        <input
          type="text"
          value={submitterEmail}
          onChange={(e) => onSubmitterEmailChange(e.target.value)}
          placeholder="Contoh: mhs.ipb@apps.ipb.ac.id atau username Telegram"
          className="w-full h-12 px-4 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005B54] transition-all"
        />
      </div>

      {/* Submit & Cancel Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto h-12 px-8 bg-[#005B54] hover:bg-[#004741] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
        >
          <PaperPlaneRightIcon size={16} weight="fill" />
          <span>{isSubmitting ? 'Mengirim Data ke Server...' : 'Kirim Usulan Spot Nugas'}</span>
        </button>

        <Link
          href="/"
          className="w-full sm:w-auto h-12 px-6 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
        >
          <XIcon size={16} weight="bold" className="text-gray-400" />
          <span>Batal &amp; Kembali ke Peta</span>
        </Link>
      </div>
    </section>
  );
}
