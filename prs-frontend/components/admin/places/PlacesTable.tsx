'use client';

import { Edit2, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
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
}

export function PlacesTable({
  places,
  totalPlacesCount,
  hasSearchQuery,
  onResetSearch,
  onToggleStatus,
  onEdit,
  onDelete,
}: PlacesTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-xs text-gray-600">
        <thead className="bg-gray-50/75 border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          <tr>
            <th className="py-3.5 px-4">Kode & Tempat</th>
            <th className="py-3.5 px-4">Alamat / Wilayah</th>
            <th className="py-3.5 px-4 text-center">WiFi (Mbps)</th>
            <th className="py-3.5 px-4 text-center">Colokan</th>
            <th className="py-3.5 px-4 text-center">Harga Min</th>
            <th className="py-3.5 px-4 text-center">Skor Nugas</th>
            <th className="py-3.5 px-4 text-center">Status</th>
            <th className="py-3.5 px-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {places.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    {p.code}
                  </span>
                  <span className="font-bold text-gray-900">{p.name}</span>
                  {p.status === 'review' && p.isUnread !== false && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 animate-pulse">
                      Baru
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 max-w-xs truncate text-gray-500">
                {p.address}
              </td>
              <td className="py-3 px-4 text-center font-semibold text-gray-800">
                📶 {p.wifi} Mbps
              </td>
              <td className="py-3 px-4 text-center font-semibold text-gray-800">
                ⚡ {p.plug}%
              </td>
              <td className="py-3 px-4 text-center font-medium text-teal-800">
                {p.price}
              </td>
              <td className="py-3 px-4 text-center font-extrabold text-[#005B54]">
                ★ {p.score}
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  type="button"
                  onClick={() => onToggleStatus(p)}
                  title="Klik untuk mengubah status"
                  className={cn(
                    'inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all',
                    p.status === 'verified'
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : p.status === 'review'
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  )}
                >
                  {p.status === 'verified' ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  <span>
                    {p.status === 'verified'
                      ? 'Verified'
                      : p.status === 'review'
                      ? 'Review'
                      : 'Rejected'}
                  </span>
                </button>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(p)}
                    className="p-1.5 text-gray-400 hover:text-[#005B54] hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Tempat"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(p.id, p.name)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus Tempat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Footer */}
      <div className="bg-gray-50/75 border-t border-gray-200/80 px-4 py-3 flex items-center justify-between text-xs text-gray-500">
        <span>
          Menampilkan <strong>{places.length}</strong> dari <strong>{totalPlacesCount}</strong> tempat nugas
        </span>
        {hasSearchQuery && (
          <button
            type="button"
            onClick={onResetSearch}
            className="text-[#005B54] hover:underline font-semibold cursor-pointer"
          >
            Reset Pencarian
          </button>
        )}
      </div>
    </div>
  );
}
