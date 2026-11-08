'use client';

import Link from 'next/link';
import { FileText, ArrowUpRight, Clock, Check, X } from 'lucide-react';
import { AdminTicketItem } from '@/lib/admin-store';
import { cn } from '@/lib/cn';

interface RecentTicketsSectionProps {
  tickets: AdminTicketItem[];
  onResolve: (ticketId: string, cafeName: string) => void;
  onDismiss: (ticketId: string) => void;
}

export function RecentTicketsSection({
  tickets,
  onResolve,
  onDismiss,
}: RecentTicketsSectionProps) {
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#005B54]" />
            Tiket Laporan & Validasi Fasilitas
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Laporan masuk dari mahasiswa untuk pembaruan data WebGIS
          </p>
        </div>
        <Link
          href="/admin/reports"
          className="text-xs font-semibold text-[#005B54] hover:text-[#004741] flex items-center gap-1 transition-colors"
        >
          <span>Lihat Semua</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {tickets.map((t) => {
          const isResolved = t.status === 'resolved';
          const isDismissed = t.status === 'dismissed';

          return (
            <div
              key={t.id}
              className={cn(
                'p-4 rounded-xl border transition-all',
                isResolved
                  ? 'bg-emerald-50/50 border-emerald-200 opacity-75'
                  : isDismissed
                  ? 'bg-gray-50 border-gray-200 opacity-50'
                  : 'bg-white border-gray-200/90 hover:border-gray-300 shadow-2xs'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                      {t.id}
                    </span>
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
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {t.timeAgo}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mt-1">
                    {t.cafeName}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {t.description}
                  </p>
                </div>

                {/* Action status or buttons */}
                <div className="shrink-0 flex items-center gap-1.5 pt-1">
                  {isResolved ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                      <Check className="w-3.5 h-3.5" /> Selesai
                    </span>
                  ) : isDismissed ? (
                    <span className="text-xs text-gray-400 italic">Diabaikan</span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => onResolve(t.id, t.cafeName)}
                        className="px-3 py-1.5 bg-[#005B54] hover:bg-[#004741] text-white text-xs font-semibold rounded-lg shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                        title="Tandai Selesai"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Selesai</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDismiss(t.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        title="Abaikan Laporan"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
