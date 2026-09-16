'use client';

import { X } from 'lucide-react';
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
      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {ticket.id}
            </span>
            <h3 className="text-base font-bold text-gray-900 mt-1">
              Detail Tiket & Catatan Admin
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Tempat Nugas
            </label>
            <p className="text-sm font-bold text-gray-900 mt-0.5">
              {ticket.cafeName} ({ticket.location})
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Laporan Pengguna
            </label>
            <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 mt-1 leading-relaxed">
              &quot;{ticket.description}&quot;
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Dilaporkan oleh: {ticket.reportedBy} · {ticket.timeAgo}
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Catatan Tindak Lanjut Tim Admin
            </label>
            <textarea
              rows={3}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Tuliskan catatan teknis, instruksi surveyor lapangan, atau verifikasi perubahan data..."
              className="w-full mt-1.5 p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54] transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={onSaveNote}
            className="px-4 py-2 bg-[#005B54] hover:bg-[#004741] active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Simpan Catatan
          </button>
        </div>
      </div>
    </div>
  );
}
