/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import {
  Edit2,
  Trash2,
  MapPin,
  Wifi,
  Volume2,
  Check,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Crosshair,
} from 'lucide-react';
import { PlaceItem } from '@/lib/admin-store';
import { cn } from '@/lib/cn';
import { formatStarRating, formatNugasScore } from '@/lib/utils';

interface PlacesTableProps {
  places: PlaceItem[];
  totalPlacesCount: number;
  hasSearchQuery: boolean;
  onResetSearch: () => void;
  onToggleStatus: (place: PlaceItem) => void;
  onEdit: (place: PlaceItem) => void;
  onDelete: (id: number, name: string) => void;
  onBatchVerify?: (ids: number[]) => void;
  onBatchDelete?: (ids: number[]) => void;
  onLocatePlace?: (place: PlaceItem) => void;
}

export function PlacesTable({
  places,
  totalPlacesCount,
  hasSearchQuery,
  onResetSearch,
  onToggleStatus,
  onEdit,
  onDelete,
  onBatchVerify,
  onBatchDelete,
  onLocatePlace,
}: PlacesTableProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const pageSize = 5;
  const totalItems = places.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (validPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedPlaces = places.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    pages.push(1);
    if (validPage > 3) pages.push('...');
    const start = Math.max(2, validPage - 1);
    const end = Math.min(totalPages - 1, validPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (validPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  const isAllSelected = paginatedPlaces.length > 0 && paginatedPlaces.every((p) => selectedIds.includes(p.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !paginatedPlaces.some((p) => p.id === id)));
    } else {
      const pageIds = paginatedPlaces.map((p) => p.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="hidden lg:block select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs text-text-700">
        <thead className="bg-[#F8F9F7] border-b border-[#E2E5DF] text-[11px] font-bold text-text-600 uppercase tracking-wider">
          <tr>
            <th className="py-3.5 px-4 w-12 text-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded-sm text-[#005B54] focus:ring-[#005B54] border-[#D5D3C8] cursor-pointer accent-[#005B54]"
                aria-label="Pilih Semua"
              />
            </th>
            <th className="py-3.5 px-4 min-w-[280px]">Kafe &amp; Lokasi Spasial</th>
            <th className="py-3.5 px-4 min-w-[160px]">Koordinat PostGIS</th>
            <th className="py-3.5 px-4 min-w-[120px]">WiFi Speed</th>
            <th className="py-3.5 px-4 min-w-[130px]">Colokan Listrik</th>
            <th className="py-3.5 px-4 min-w-[120px]">Kisaran Harga</th>
            <th className="py-3.5 px-4 min-w-[140px]">Akustik &amp; Skor</th>
            <th className="py-3.5 px-4 min-w-[130px]">Status Tayang</th>
            <th className="py-3.5 px-4 min-w-[120px] text-center">Aksi Spasial</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E2E5DF] bg-white">
          {paginatedPlaces.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-12 text-center text-text-500">
                Tidak ada tempat nugas yang sesuai dengan filter atau kata kunci.
                {hasSearchQuery && (
                  <button
                    type="button"
                    onClick={onResetSearch}
                    className="block mx-auto mt-2 text-xs font-bold text-[#005B54] hover:underline cursor-pointer"
                  >
                    Reset Pencarian
                  </button>
                )}
              </td>
            </tr>
          ) : (
            paginatedPlaces.map((place) => {
              const isSelected = selectedIds.includes(place.id);
              return (
                <tr
                  key={place.id}
                  className={cn(
                    'transition-colors hover:bg-[#F5F6F3]/65 group',
                    isSelected && 'bg-[#005B54]/[0.05] hover:bg-[#005B54]/[0.08]'
                  )}
                >
                  {/* Row Checkbox */}
                  <td className="py-4 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(place.id)}
                      className="w-4 h-4 rounded-sm text-[#005B54] focus:ring-[#005B54] border-[#D5D3C8] cursor-pointer accent-[#005B54]"
                      aria-label={`Pilih ${place.name}`}
                    />
                  </td>

                  {/* Kafe & Lokasi Spasial */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {/* Thumbnail Image */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F5F6F3] border border-[#E2E5DF] shrink-0 relative">
                        <img
                          src={
                            place.imageUrl ||
                            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&auto=format&fit=crop&q=80'
                          }
                          alt={place.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Name, Tag & Address */}
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-text-950 text-[13px] hover:text-[#005B54] transition-colors cursor-pointer truncate">
                            {place.name}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-text-600 tabular-nums bg-[#F5F6F3] px-1.5 py-0.5 rounded-md border border-[#E2E5DF] shrink-0">
                            #{place.code}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-text-500 mt-1 truncate">
                          <MapPin className="w-3 h-3 text-text-400 shrink-0" />
                          <span className="truncate">{place.address}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Koordinat PostGIS */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="font-mono text-[11px] text-text-700 tabular-nums leading-tight">
                        <div>{place.lat.toFixed(4)},</div>
                        <div>{place.lng.toFixed(4)}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onLocatePlace?.(place)}
                        title="Salin titik koordinat GIS"
                        className="w-6 h-6 rounded-lg text-[#005B54] hover:bg-[#005B54]/[0.08] border border-transparent hover:border-[#005B54]/20 flex items-center justify-center transition-all cursor-pointer shrink-0 tactile-press"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* WiFi Speed */}
                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-900 tabular-nums">
                      <Wifi className="w-3.5 h-3.5 text-[#005B54]" />
                      <span>{place.wifi} Mbps</span>
                    </div>
                  </td>

                  {/* Colokan Listrik (Structured Telemetry Pill instead of repetitive progress bars) */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col items-start gap-1">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border tabular-nums',
                          place.plug >= 80
                            ? 'bg-teal-50/75 text-[#005B54] border-teal-200'
                            : 'bg-[#F5F6F3] text-text-800 border-[#E2E5DF]'
                        )}
                      >
                        <span>{place.plug}% Meja</span>
                      </span>
                      <span className="text-[11px] text-text-500 truncate">
                        {place.plugLabel || (place.plug >= 80 ? 'Hampir tiap meja' : 'Cukup memadai')}
                      </span>
                    </div>
                  </td>

                  {/* Kisaran Harga */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-text-900 text-xs tabular-nums">{place.price}</span>
                      <span className="text-[11px] font-medium text-text-500 truncate">
                        {place.priceCategory || 'Ramah Mahasiswa'}
                      </span>
                    </div>
                  </td>

                  {/* Akustik & Skor (Normalized 5-Star Scale + Nugas Suitability Index) */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-text-700 font-medium">
                        <Volume2 className="w-3.5 h-3.5 text-text-400 shrink-0" />
                        <span className="truncate">{place.acoustic || 'Tenang'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] tabular-nums">
                        <span className="font-bold text-text-900">
                          <span className="text-[#D97706]">★</span> {formatStarRating(place.score)}
                        </span>
                        <span className="text-text-400">/ 5</span>
                        <span className="text-text-300">·</span>
                        <span className="font-semibold text-[#005B54]">
                          {formatNugasScore(place.score)} Nugas
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status Tayang */}
                  <td className="py-4 px-4">
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
                  </td>

                  {/* Aksi Spasial */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {place.status === 'review' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onToggleStatus(place)}
                            title="Lakukan audit dan verifikasi tempat ini"
                            className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-2xs tactile-press"
                          >
                            <ClipboardCheck className="w-3.5 h-3.5" />
                            <span>Audit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onLocatePlace?.(place)}
                            title="Salin Koordinat Spasial"
                            className="p-1.5 text-text-400 hover:text-[#005B54] hover:bg-[#005B54]/[0.08] rounded-lg transition-colors cursor-pointer tactile-press"
                          >
                            <Crosshair className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => onEdit(place)}
                            title="Edit data kafe"
                            className="p-1.5 text-text-400 hover:text-[#005B54] hover:bg-[#005B54]/[0.08] rounded-lg transition-colors cursor-pointer tactile-press"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onLocatePlace?.(place)}
                            title="Salin Koordinat Spasial"
                            className="p-1.5 text-text-400 hover:text-[#005B54] hover:bg-[#005B54]/[0.08] rounded-lg transition-colors cursor-pointer tactile-press"
                          >
                            <Crosshair className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(place.id, place.name)}
                            title="Hapus / Arsipkan"
                            className="p-1.5 text-text-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer tactile-press"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        </table>
      </div>

      {/* 4. PAGINATION & BATCH ACTIONS FOOTER */}
      <div className="bg-[#F8F9F7] border-t border-[#E2E5DF] px-4 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Batch Actions Left */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <span className="text-xs text-text-600 font-semibold whitespace-nowrap">
            Aksi Batch Terpilih:
          </span>
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => onBatchVerify?.(selectedIds)}
            className="bg-white hover:bg-[#F5F6F3] disabled:opacity-40 disabled:cursor-not-allowed border border-[#E2E5DF] text-text-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap tactile-press"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verifikasi Masal</span>
          </button>
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => {
              selectedIds.forEach((id) => {
                const target = places.find((p) => p.id === id);
                if (target) onToggleStatus(target);
              });
              setSelectedIds([]);
            }}
            className="bg-white hover:bg-[#F5F6F3] disabled:opacity-40 disabled:cursor-not-allowed border border-[#E2E5DF] text-text-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap tactile-press"
          >
            Ubah Status
          </button>
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => {
              if (confirm(`Hapus ${selectedIds.length} tempat terpilih dari master data?`)) {
                onBatchDelete?.(selectedIds);
                setSelectedIds([]);
              }
            }}
            className="bg-white hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed border border-[#E2E5DF] text-rose-600 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap tactile-press"
          >
            Hapus Terpilih
          </button>
        </div>

        {/* Pagination Controls Right */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <span className="text-xs text-text-600 font-medium tabular-nums">
            Menampilkan {totalItems === 0 ? 0 : startIndex + 1}-{endIndex} dari {totalPlacesCount} titik kafe
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={validPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-lg border border-[#E2E5DF] bg-white hover:bg-[#F5F6F3] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-text-700 cursor-pointer shadow-2xs transition-colors tactile-press"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {getPageNumbers().map((p, idx) =>
              typeof p === 'number' ? (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-colors tabular-nums tactile-press',
                    validPage === p
                      ? 'bg-[#005B54] text-white shadow-2xs'
                      : 'bg-white border border-[#E2E5DF] text-text-700 hover:bg-[#F5F6F3]'
                  )}
                >
                  {p}
                </button>
              ) : (
                <span key={idx} className="text-text-400 px-1 text-xs font-bold">
                  ...
                </span>
              )
            )}
            <button
              type="button"
              disabled={validPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-8 h-8 rounded-lg border border-[#E2E5DF] bg-white hover:bg-[#F5F6F3] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-text-700 cursor-pointer shadow-2xs transition-colors tactile-press"
              title="Halaman Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
