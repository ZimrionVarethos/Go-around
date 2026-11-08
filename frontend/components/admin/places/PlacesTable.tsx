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
    <div className="hidden lg:block overflow-x-auto select-none">
      <table className="w-full text-left border-collapse text-xs text-gray-600">
        <thead className="bg-[#F8FAFC] border-b border-gray-200/90 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          <tr>
            <th className="py-3.5 px-4 w-12 text-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded-sm text-[#005B54] focus:ring-[#005B54] border-gray-300 cursor-pointer accent-[#005B54]"
                aria-label="Pilih Semua"
              />
            </th>
            <th className="py-3.5 px-4 min-w-[280px]">Kafe & Lokasi Spasial</th>
            <th className="py-3.5 px-4 min-w-[160px]">Koordinat PostGIS</th>
            <th className="py-3.5 px-4 min-w-[120px]">WiFi Speed</th>
            <th className="py-3.5 px-4 min-w-[130px]">Colokan Listrik</th>
            <th className="py-3.5 px-4 min-w-[120px]">Kisaran Harga</th>
            <th className="py-3.5 px-4 min-w-[140px]">Akustik & Skor</th>
            <th className="py-3.5 px-4 min-w-[130px]">Status Tayang</th>
            <th className="py-3.5 px-4 min-w-[120px] text-center">Aksi Spasial</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100/90 bg-white">
          {paginatedPlaces.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-12 text-center text-gray-400">
                Tidak ada tempat nugas yang sesuai dengan filter atau kata kunci.
                {hasSearchQuery && (
                  <button
                    type="button"
                    onClick={onResetSearch}
                    className="block mx-auto mt-2 text-xs font-bold text-[#005B54] hover:underline"
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
                    'transition-colors hover:bg-[#F8FAFC]/80 group',
                    isSelected && 'bg-[#EFFBF6]/70 hover:bg-[#EFFBF6]'
                  )}
                >
                  {/* Row Checkbox */}
                  <td className="py-4 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(place.id)}
                      className="w-4 h-4 rounded-sm text-[#005B54] focus:ring-[#005B54] border-gray-300 cursor-pointer accent-[#005B54]"
                      aria-label={`Pilih ${place.name}`}
                    />
                  </td>

                  {/* Kafe & Lokasi Spasial */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {/* Thumbnail Image */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200/60 shrink-0 relative">
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
                          <span className="font-bold text-gray-900 text-[13px] hover:text-[#005B54] transition-colors cursor-pointer truncate">
                            {place.name}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md border border-gray-200/50 shrink-0">
                            #{place.code}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-1 truncate">
                          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="truncate">{place.address}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Koordinat PostGIS */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="font-mono text-[11px] text-gray-600 leading-tight">
                        <div>{place.lat.toFixed(4)},</div>
                        <div>{place.lng.toFixed(4)}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onLocatePlace?.(place)}
                        title="Buka titik koordinat di GIS"
                        className="w-6 h-6 rounded-lg text-teal-600 hover:text-teal-700 hover:bg-teal-50 border border-transparent hover:border-teal-200 flex items-center justify-center transition-all cursor-pointer shrink-0"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* WiFi Speed */}
                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-1.5 bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD] text-xs font-bold px-2.5 py-1 rounded-full shadow-2xs">
                      <Wifi className="w-3.5 h-3.5" />
                      <span>{place.wifi} Mbps</span>
                    </div>
                  </td>

                  {/* Colokan Listrik */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-600 text-xs">{place.plug}%</span>
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                            style={{ width: `${place.plug}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-500 truncate">
                        {place.plugLabel || (place.plug >= 80 ? 'Hampir tiap meja' : 'Cukup memadai')}
                      </span>
                    </div>
                  </td>

                  {/* Kisaran Harga */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-gray-900 text-xs">{place.price}</span>
                      <span className="text-[11px] font-semibold text-emerald-700 truncate">
                        {place.priceCategory || 'Ramah Mahasiswa'}
                      </span>
                    </div>
                  </td>

                  {/* Akustik & Skor */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-xs text-gray-700 font-medium">
                        <Volume2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="truncate">{place.acoustic || 'Tenang'}</span>
                      </div>
                      <div className="flex items-baseline gap-1 text-[11px]">
                        <span className="font-extrabold text-amber-500">★ {place.score}</span>
                        <span className="text-gray-400 text-[10px]">/10 Nugas</span>
                      </div>
                    </div>
                  </td>

                  {/* Status Tayang */}
                  <td className="py-4 px-4">
                    {place.status === 'verified' ? (
                      <span className="inline-flex items-center gap-1.5 bg-[#E6F7EF] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                        <span>Terverifikasi</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
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
                            className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                          >
                            <ClipboardCheck className="w-3.5 h-3.5" />
                            <span>Audit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onLocatePlace?.(place)}
                            title="Lihat di Peta Spasial"
                            className="p-1.5 text-gray-400 hover:text-[#005B54] hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
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
                            className="p-1.5 text-gray-400 hover:text-[#005B54] hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onLocatePlace?.(place)}
                            title="Lihat di Peta Spasial"
                            className="p-1.5 text-gray-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Crosshair className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(place.id, place.name)}
                            title="Hapus / Arsipkan"
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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

      {/* 4. PAGINATION & BATCH ACTIONS FOOTER */}
      <div className="bg-white border-t border-gray-200/80 px-4 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Batch Actions Left */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
            Aksi Batch Terpilih:
          </span>
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => onBatchVerify?.(selectedIds)}
            className="bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
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
            className="bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
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
            className="bg-white hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200 text-rose-600 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            Hapus Terpilih
          </button>
        </div>

        {/* Pagination Controls Right */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <span className="text-xs text-gray-500 font-medium">
            Menampilkan {totalItems === 0 ? 0 : startIndex + 1}–{endIndex} dari {totalPlacesCount} titik kafe
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={validPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 cursor-pointer shadow-xs transition-colors"
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
                    'w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer transition-colors',
                    validPage === p
                      ? 'bg-[#005B54] text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {p}
                </button>
              ) : (
                <span key={idx} className="text-gray-400 px-1 text-xs font-bold">
                  ...
                </span>
              )
            )}
            <button
              type="button"
              disabled={validPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 cursor-pointer shadow-xs transition-colors"
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
