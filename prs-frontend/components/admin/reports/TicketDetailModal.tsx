'use client';

import { XIcon } from '@phosphor-icons/react';
import { AdminTicketItem } from '@/lib/admin-store';

interface TicketDetailModalProps {
  ticket: AdminTicketItem | null;
  noteInput: string;
  setNoteInput: (val: string) => void;
  onClose: () => void;
  onSaveNote: () => void;
}

export function TicketDetailModal({
  ticket,
  noteInput,
  setNoteInput,
  onClose,
  onSaveNote,
}: TicketDetailModalProps) {
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl border border-[#E2E5DF] shadow-tinted-teal overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E5DF] bg-[#F8F9F7] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-text-800 tabular-nums bg-white border border-[#E2E5DF] px-2 py-0.5 rounded">
                {ticket.id}
              </span>
              <span className="text-xs font-semibold text-text-600">
                {ticket.category}
              </span>
            </div>
            <h3 className="text-base font-bold text-text-950 mt-1 tracking-tight">
              Detail Laporan &amp; Catatan Tindak Lanjut
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-400 hover:text-text-700 hover:bg-[#F0F2EE] transition-colors cursor-pointer tactile-press"
          >
            <XIcon size={16} weight="bold" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-text-600 uppercase tracking-wider">
              Lokasi Tempat Nugas
            </label>
            <p className="text-sm font-bold text-text-950 mt-0.5">
              {ticket.cafeName} <span className="font-normal text-text-500">({ticket.location})</span>
            </p>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-text-600 uppercase tracking-wider">
              Deskripsi Laporan Fasilitas
            </label>
            <p className="text-xs text-text-800 bg-[#F5F6F3] p-3 rounded-lg border border-[#E2E5DF] mt-1 leading-relaxed">
              {ticket.description}
            </p>
            <p className="text-[11px] text-text-500 tabular-nums mt-1.5">
              Dilaporkan {ticket.timeAgo}
            </p>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-text-700 uppercase tracking-wider">
              Catatan Verifikasi Admin
            </label>
            <textarea
              rows={3}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Tuliskan hasil verifikasi lapangan atau pembaruan atribut fasilitas..."
              className="w-full mt-1.5 p-3 text-xs bg-white border border-[#E2E5DF] rounded-lg text-text-900 placeholder:text-text-500 focus:outline-none focus:border-[#005B54] transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#F8F9F7] border-t border-[#E2E5DF] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-text-700 hover:bg-[#F0F2EE] rounded-lg transition-colors cursor-pointer tactile-press"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSaveNote}
            className="px-4 py-2 bg-[#005B54] hover:bg-[#004741] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs tactile-press"
          >
            Simpan &amp; Validasi
          </button>
        </div>
      </div>
    </div>
  );
}
