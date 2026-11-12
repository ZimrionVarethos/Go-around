/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import {
  CaretLeftIcon,
  CaretRightIcon,
  ClipboardTextIcon,
  CrosshairIcon,
  MapPinIcon,
  PencilSimpleIcon,
  StarIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import {
  DynamicPlugIcon,
  DynamicWifiIcon,
} from '@/components/ui/FacilityIcons';
import { PlaceItem } from '@/lib/admin-store';
import { cn } from '@/lib/cn';
import { formatStarRating, formatNugasScore } from '@/lib/utils';

interface PlacesMobileListProps {
  places: PlaceItem[];
  onToggleStatus?: (place: PlaceItem) => void;
  onEdit: (place: PlaceItem) => void;
  onDelete: (id: number, name: string) => void;
  onLocatePlace?: (place: PlaceItem) => void;
}

export function PlacesMobileList({
  places,
  onToggleStatus,
  onEdit,
  onDelete,
  onLocatePlace,
}: PlacesMobileListProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;
  const totalItems = places.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedPlaces = places.slice(startIndex, endIndex);

  if (places.length === 0) {
    return (
      <div className="lg:hidden p-8 text-center text-text-500">
        Tidak ada tempat nugas yang sesuai dengan filter.
      </div>
    );
  }

  return (
    <div className="lg:hidden bg-white select-none">
      <div className="divide-y divide-[#E2E5DF]">
        {paginatedPlaces.map((place) => (
          <div key={place.id} className="p-4 space-y-3">
            {/* Header Row: Thumbnail + Info */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F5F6F3] border border-[#E2E5DF] shrink-0">
                <img
                  src={
                    place.imageUrl ||
                    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&auto=format&fit=crop&q=80'
                  }
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-[10px] font-bold text-text-600 tabular-nums bg-[#F5F6F3] border border-[#E2E5DF] px-1.5 py-0.5 rounded">
                    #{place.code}
                  </span>
                  <h4 className="text-sm font-bold text-text-950 truncate">{place.name}</h4>
                </div>
                <p className="text-xs text-text-500 mt-0.5 truncate flex items-center gap-1">
                  <MapPinIcon size={12} weight="fill" className="text-text-400 shrink-0" />
                  <span className="truncate">{place.address}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[10px] text-text-600 tabular-nums">
                    {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onLocatePlace?.(place)}
                    className="text-[10px] font-semibold text-[#005B54] hover:underline flex items-center gap-0.5 cursor-pointer tactile-press"
                  >
                    <CrosshairIcon size={12} weight="bold" />
                    <span>Salin</span>
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-text-900 tabular-nums inline-flex items-center gap-0.5">
                  <StarIcon size={12} weight="fill" className="text-[#D97706]" />
                  {formatStarRating(place.score)}{' '}
                  <span className="text-[10px] font-normal text-text-400">/ 5</span>
                </span>
                <span className="text-[10px] font-semibold text-[#005B54] tabular-nums block">
                  {formatNugasScore(place.score)} Nugas
                </span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-2 bg-[#F5F6F3] p-2.5 rounded-lg text-center text-xs border border-[#E2E5DF]">
              <div>
                <span className="text-[10px] text-text-500 font-medium block">Wi-Fi</span>
                <span className="font-semibold text-text-900 inline-flex items-center gap-1 justify-center tabular-nums">
                  <DynamicWifiIcon mbps={place.wifi} size={13} />
                  {place.wifi} Mbps
                </span>
              </div>
              <div>
                <span className="text-[10px] text-text-500 font-medium block">Colokan</span>
                <span className="font-semibold text-text-900 inline-flex items-center gap-1 justify-center tabular-nums">
                  <DynamicPlugIcon plugPercent={place.plug} size={13} />
                  {place.plug}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-text-500 font-medium block">Harga</span>
                <span className="font-semibold text-text-900 tabular-nums truncate block">{place.price}</span>
              </div>
            </div>

            {/* Status & Actions Footer */}
            <div className="flex items-center justify-between pt-0.5 gap-2 flex-wrap">
              {place.status === 'verified' ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Terverifikasi</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Perlu Review</span>
                </span>
              )}

              <div className="flex items-center gap-1.5">
                {place.status === 'review' && onToggleStatus && (
                  <button
                    type="button"
                    onClick={() => onToggleStatus(place)}
                    className="bg-amber-50 text-amber-800 border border-amber-300 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer tactile-press"
                  >
                    <ClipboardTextIcon size={13} weight="duotone" />
                    <span>Audit</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onEdit(place)}
                  className="px-2.5 py-1 bg-[#F5F6F3] hover:bg-[#EFECE1] text-text-700 text-xs font-semibold rounded-md transition-colors border border-[#E2E5DF] cursor-pointer tactile-press inline-flex items-center gap-1"
                >
                  <PencilSimpleIcon size={12} weight="bold" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(place.id, place.name)}
                  className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-md transition-colors cursor-pointer tactile-press inline-flex items-center gap-1"
                >
                  <TrashIcon size={12} weight="bold" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Pagination Footer */}
      {totalPages > 1 && (
        <div className="bg-[#F8F9F7] border-t border-[#E2E5DF] px-4 py-3 flex items-center justify-between gap-2">
          <span className="text-[11px] text-text-600 font-medium tabular-nums">
            {startIndex + 1}–{endIndex} dari {totalItems} kafe
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={validPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 rounded-lg border border-[#E2E5DF] bg-white hover:bg-[#F5F6F3] disabled:opacity-30 flex items-center justify-center text-text-700 cursor-pointer"
              aria-label="Halaman Sebelumnya"
            >
              <CaretLeftIcon size={14} weight="bold" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setCurrentPage(p)}
                className={cn(
                  'w-7 h-7 rounded-lg text-[11px] font-bold flex items-center justify-center cursor-pointer tabular-nums',
                  validPage === p
                    ? 'bg-[#005B54] text-white'
                    : 'bg-white border border-[#E2E5DF] text-text-700'
                )}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              disabled={validPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-7 h-7 rounded-lg border border-[#E2E5DF] bg-white hover:bg-[#F5F6F3] disabled:opacity-30 flex items-center justify-center text-text-700 cursor-pointer"
              aria-label="Halaman Berikutnya"
            >
              <CaretRightIcon size={14} weight="bold" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
