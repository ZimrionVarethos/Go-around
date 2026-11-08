'use client';

import { FileText, Clock, Check, X, MapPin, User, Eye, MessageSquare } from 'lucide-react';
import { AdminTicketItem } from '@/lib/admin-store';
import { cn } from '@/lib/cn';

interface TicketCardListProps {
  tickets: AdminTicketItem[];
  onOpenModal: (ticket: AdminTicketItem) => void;
  onResolve: (id: string, cafeName: string) => void;
  onDismiss: (id: string) => void;
}

export function TicketCardList({
  tickets,
  onOpenModal,
  onResolve,
  onDismiss,
}: TicketCardListProps) {
  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center space-y-2">
        <FileText className="w-10 h-10 text-gray-300 mx-auto" />
        <h4 className="text-base font-bold text-gray-800">Tidak ada tiket yang cocok</h4>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Coba ganti filter kategori atau kata kunci pencarian Anda untuk melihat laporan lain.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tickets.map((t) => {
        const isResolved = t.status === 'resolved';
        const isDismissed = t.status === 'dismissed';

        return (
          <div
            key={t.id}
            className={cn(
              'bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4',
              isResolved
                ? 'border-emerald-200 bg-emerald-50/20'
                : isDismissed
                ? 'border-gray-200 bg-gray-50/60 opacity-60'
                : 'border-gray-200/80'
            )}
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-gray-800 bg-gray-100 px-2.5 py-0.5 rounded-md">
                    {t.id}
                  </span>
                  {t.isUnread && t.status === 'open' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 animate-pulse">
                      Baru
                    </span>
                  )}
                  <span
                    className={cn(
                      'text-[11px] font-semibold px-2 py-0.5 rounded-full',
                      t.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : t.priority === 'suggestion'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    )}
                  >
                    {t.category}
                  </span>
                </div>

                <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" />
                  {t.timeAgo}
                </span>
              </div>

              {/* Cafe & Location */}
              <div>
                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {t.cafeName}
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{t.location}</span>
                </p>
              </div>

              {/* Description Quote */}
              <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed italic">
                &quot;{t.description}&quot;
              </p>

              {/* Reporter & Note */}
              <div className="flex items-center justify-between text-[11.5px] text-gray-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  {t.reportedBy}
                </span>
                {t.internalNote && (
                  <span className="text-teal-700 font-medium flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Ada Catatan
                  </span>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onOpenModal(t)}
                className="text-xs font-semibold text-gray-700 hover:text-[#005B54] hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Detail & Catatan</span>
              </button>

              <div className="flex items-center gap-1.5">
                {isResolved ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg">
                    <Check className="w-3.5 h-3.5" /> Selesai
                  </span>
                ) : isDismissed ? (
                  <button
                    type="button"
                    onClick={() => onResolve(t.id, t.cafeName)}
                    className="text-xs text-[#005B54] hover:underline font-semibold"
                  >
                    Buka Kembali
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onDismiss(t.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      title="Abaikan Tiket"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onResolve(t.id, t.cafeName)}
                      className="bg-[#005B54] hover:bg-[#004741] active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Validasi Selesai</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
