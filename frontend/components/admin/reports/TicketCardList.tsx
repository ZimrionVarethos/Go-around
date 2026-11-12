'use client';

import {
  ChatTextIcon,
  CheckIcon,
  EyeIcon,
  FileTextIcon,
  MapPinIcon,
  XIcon,
} from '@phosphor-icons/react';
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
      <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-card-subtle p-10 text-center space-y-1.5">
        <FileTextIcon size={32} weight="duotone" className="text-text-400 mx-auto" />
        <h4 className="text-sm font-bold text-text-900">Tidak ada tiket laporan yang sesuai</h4>
        <p className="text-xs text-text-500 max-w-sm mx-auto">
          Sesuaikan filter status, kategori, atau kata kunci pencarian untuk melihat tiket lainnya.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-card-subtle overflow-hidden">
      {/* Desktop Column Header */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-5 py-2.5 bg-[#F8F9F7] border-b border-[#E2E5DF] text-[11px] font-semibold uppercase tracking-wider text-text-600">
        <div className="col-span-2">ID &amp; Status</div>
        <div className="col-span-3">Tempat &amp; Kategori</div>
        <div className="col-span-4">Ringkasan Laporan Fasilitas</div>
        <div className="col-span-3 text-right">Tindakan Moderasi</div>
      </div>

      {/* Structured Operational Rows */}
      <div className="divide-y divide-[#E2E5DF]">
        {tickets.map((t) => {
          const isResolved = t.status === 'resolved';
          const isDismissed = t.status === 'dismissed';

          return (
            <div
              key={t.id}
              className={cn(
                'p-4 sm:px-5 sm:py-4 transition-colors lg:grid lg:grid-cols-12 lg:items-center lg:gap-4 flex flex-col gap-3',
                isResolved
                  ? 'bg-emerald-50/20'
                  : isDismissed
                  ? 'bg-[#F5F6F3]/70 opacity-65'
                  : 'hover:bg-[#F5F6F3]/60'
              )}
            >
              {/* Col 1: ID, Workflow Status Dot & Time */}
              <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-start justify-between gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-text-900 tabular-nums bg-[#F5F6F3] border border-[#E2E5DF] px-1.5 py-0.5 rounded">
                    {t.id}
                  </span>
                  {t.isUnread && t.status === 'open' && (
                    <span
                      className="w-2 h-2 rounded-full bg-rose-500"
                      title="Belum dibaca"
                    />
                  )}
                </div>

                {/* Semantic Workflow Status Badge */}
                <div className="flex items-center gap-2">
                  {isResolved ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      Selesai
                    </span>
                  ) : isDismissed ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-text-600 bg-[#F0F2EE] border border-[#E2E5DF] px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-text-400" />
                      Diabaikan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Perlu Validasi
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-text-500 tabular-nums hidden lg:block">
                  {t.timeAgo}
                </span>
              </div>

              {/* Col 2: Place Name, Location & Category Tag */}
              <div className="lg:col-span-3 min-w-0 space-y-1">
                <h3 className="text-sm font-bold text-text-950 truncate">
                  {t.cafeName}
                </h3>
                <p className="text-xs text-text-600 flex items-center gap-1 truncate">
                  <MapPinIcon size={12} weight="fill" className="text-text-400 shrink-0" />
                  <span className="truncate">{t.location}</span>
                </p>
                <div className="pt-0.5">
                  <span
                    className={cn(
                      'inline-block text-[11px] font-semibold px-1.5 py-0.5 rounded border',
                      t.priority === 'high'
                        ? 'bg-rose-50/70 text-rose-700 border-rose-200'
                        : t.priority === 'suggestion'
                        ? 'bg-teal-50/70 text-[#005B54] border-teal-200'
                        : 'bg-[#F5F6F3] text-text-700 border-[#E2E5DF]'
                    )}
                  >
                    {t.category}
                  </span>
                </div>
              </div>

              {/* Col 3: Issue Summary */}
              <div className="lg:col-span-4 min-w-0 space-y-1.5">
                <p className="text-xs text-text-800 leading-relaxed line-clamp-2">
                  {t.description}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-text-500 flex-wrap">
                  <span className="lg:hidden tabular-nums">Dilaporkan {t.timeAgo}</span>
                  {t.internalNote && (
                    <span className="inline-flex items-center gap-1 text-[#005B54] font-semibold bg-teal-50/60 border border-teal-200/70 px-1.5 py-0.5 rounded">
                      <ChatTextIcon size={12} weight="duotone" /> Catatan Tersimpan
                    </span>
                  )}
                </div>
              </div>

              {/* Col 4: Moderation Actions */}
              <div className="lg:col-span-3 flex items-center justify-end gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#E2E5DF] flex-wrap">
                <button
                  type="button"
                  onClick={() => onOpenModal(t)}
                  className="text-xs font-semibold text-text-700 hover:text-[#005B54] hover:bg-[#F5F6F3] px-2.5 py-1.5 rounded-lg border border-[#E2E5DF] transition-colors flex items-center gap-1.5 cursor-pointer tactile-press"
                >
                  <EyeIcon size={14} weight="duotone" />
                  <span>Detail &amp; Catatan</span>
                </button>

                {isResolved ? null : isDismissed ? (
                  <button
                    type="button"
                    onClick={() => onResolve(t.id, t.cafeName)}
                    className="text-xs text-[#005B54] hover:underline font-semibold px-2 py-1.5 cursor-pointer tactile-press"
                  >
                    Validasi
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onResolve(t.id, t.cafeName)}
                      className="bg-[#005B54] hover:bg-[#004741] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs tactile-press"
                    >
                      <CheckIcon size={14} weight="bold" />
                      <span>Validasi Selesai</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDismiss(t.id)}
                      className="p-1.5 text-text-400 hover:text-text-700 hover:bg-[#F0F2EE] rounded-lg transition-colors cursor-pointer tactile-press"
                      title="Abaikan Tiket"
                    >
                      <XIcon size={15} weight="bold" />
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
