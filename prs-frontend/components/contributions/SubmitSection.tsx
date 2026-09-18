'use client';

import Link from 'next/link';
import { Check, Send, X } from 'lucide-react';

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
    <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-7 space-y-5">
      {/* Header with Step 5 Circle */}
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
          5
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            Kirim Usulan Spot Nugas (Publik &amp; Anonim)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Tidak perlu pendaftaran akun atau data identitas pribadi
          </p>
        </div>
      </div>

      {/* Green Anon Callout */}
      <div className="bg-[#F0FAF7] border border-[#A7F3D0] rounded-[14px] p-4 flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-[#005B54] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          <Check className="w-3 h-3 stroke-[3]" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-900">
            Terkirim sebagai Anonim Mahasiswa / Warga Bogor
          </p>
          <p className="text-[11.5px] text-gray-600 mt-0.5 leading-relaxed">
            Data usulan tempat tidak dikaitkan dengan akun pengguna, nama asli, atau nomor telepon. 100% didedikasikan untuk ekosistem ketersediaan peta nugas bersama.
          </p>
        </div>
      </div>

      {/* Email / Telegram Optional */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-800">
          Email / Telegram Notifikasi <span className="text-gray-400 font-normal">(Sangat Opsional)</span>
        </label>
        <input
          type="text"
          value={submitterEmail}
          onChange={(e) => onSubmitterEmailChange(e.target.value)}
          placeholder="Isi hanya jika ingin dikabari saat spot tayang (cth: mhs.ipb@apps.ipb.ac.id)"
          className="w-full h-11 px-3.5 text-xs bg-white border border-gray-200 rounded-[10px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005B54]/20 focus:border-[#005B54] transition-all"
        />
      </div>

      {/* Submit & Cancel Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto h-11 px-7 bg-[#005B54] hover:bg-[#004741] text-white font-bold text-xs rounded-[10px] shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? 'Mengirim Data...' : 'Kirim Usulan Tempat'}</span>
        </button>

        <Link
          href="/"
          className="w-full sm:w-auto h-11 px-6 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-[10px] transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
        >
          <X className="w-3.5 h-3.5 text-gray-400" />
          <span>Batal &amp; Kembali ke Peta</span>
        </Link>
      </div>
    </section>
  );
}
