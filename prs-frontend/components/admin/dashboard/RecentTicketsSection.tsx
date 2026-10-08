'use client';

import Link from 'next/link';
import { ArrowUpRight, Check, X } from 'lucide-react';
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
    <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E5DF] shadow-card-subtle overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-[#E2E5DF] bg-[#F5F6F3]/45 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-text-950">
            Antrean Laporan &amp; Validasi Fasilitas
          </h3>
          <p className="text-xs text-text-500 mt-0.5">
            Laporan masuk terkait kondisi Wi-Fi, colokan, dan usulan tempat
          </p>
        </div>
        <Link
          href="/admin/reports"
          className="text-xs font-semibold text-[#005B54] hover:text-[#003833] px-2.5 py-1.5 rounded-lg hover:bg-[#005B54]/[0.06] flex items-center gap-1 transition-all shrink-0 group tactile-press"
        >
          <span>Semua Tiket</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Compact Operational Rows */}
      <div className="divide-y divide-[#E2E5DF]">
        {tickets.map((t) => {
          const isResolved = t.status === 'resolved';
          const isDismissed = t.status === 'dismissed';

          return (
            <div
              key={t.id}
              className={cn(
                'px-5 py-3.5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3',
                isResolved
                  ? 'bg-emerald-50/25 opacity-75'
                  : isDismissed
                  ? 'bg-[#F5F6F3]/60 opacity-55'
                  : 'hover:bg-[#F5F6F3]/50'
              )}
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-mono tabular-nums text-[11px] font-semibold text-text-600 bg-[#F5F6F3] border border-[#E2E5DF] px-1.5 py-0.5 rounded">
                    {t.id}
                  </span>
                  <span className="font-bold text-text-950 truncate">
                    {t.cafeName}
                  </span>
                  <span
                    className={cn(
                      'text-[11px] font-semibold px-2 py-0.5 rounded-md border',
                      t.priority === 'high'
                        ? 'bg-rose-50/80 text-rose-700 border-rose-200'
                        : t.priority === 'suggestion'
                        ? 'bg-teal-50/80 text-[#005B54] border-teal-200'
                        : 'bg-amber-50/80 text-amber-800 border-amber-200'
                    )}
                  >
                    {t.category}
                  </span>
                  <span className="text-[11px] font-mono tabular-nums text-text-400 ml-auto sm:ml-0">
                    {t.timeAgo}
                  </span>
                </div>

                <p className="text-xs text-text-600 line-clamp-1 leading-relaxed">
                  {t.description}
                </p>
              </div>

              {/* Action status or buttons */}
              <div className="shrink-0 flex items-center gap-1.5 self-end sm:self-center">
                {isResolved ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    <Check className="w-3 h-3" /> Selesai
                  </span>
                ) : isDismissed ? (
                  <span className="text-[11px] text-text-400 font-medium px-2 py-0.5">
                    Diabaikan
                  </span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onResolve(t.id, t.cafeName)}
                      className="px-2.5 py-1.5 bg-[#005B54] hover:bg-[#004741] text-white text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 tactile-press shadow-2xs"
                      title="Tandai Selesai"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Selesai</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDismiss(t.id)}
                      className="p-1.5 text-text-400 hover:text-text-700 hover:bg-[#F5F6F3] rounded-lg transition-colors cursor-pointer tactile-press"
                      title="Abaikan Laporan"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
