'use client';

import { PlaceItem } from '@/lib/admin-store';
import { cn } from '@/lib/cn';

interface PlacesMobileListProps {
  places: PlaceItem[];
  onEdit: (place: PlaceItem) => void;
  onDelete: (id: number, name: string) => void;
}

export function PlacesMobileList({ places, onEdit, onDelete }: PlacesMobileListProps) {
  return (
    <div className="md:hidden divide-y divide-gray-100">
      {places.map((p) => (
        <div key={p.id} className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                  {p.code}
                </span>
                <h4 className="text-sm font-bold text-gray-900">{p.name}</h4>
                {p.status === 'review' && p.isUnread !== false && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 animate-pulse">
                    Baru
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{p.address}</p>
            </div>
            <span className="text-xs font-bold text-[#005B54] bg-teal-50 px-2 py-0.5 rounded-lg shrink-0">
              ★ {p.score}
            </span>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-xl text-center text-xs">
            <div>
              <span className="text-[10px] text-gray-400 block">WiFi</span>
              <span className="font-bold text-gray-800">{p.wifi} Mbps</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block">Colokan</span>
              <span className="font-bold text-gray-800">{p.plug}% Meja</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block">Harga</span>
              <span className="font-bold text-teal-800">{p.price}</span>
            </div>
          </div>

          {/* Status and Action Buttons */}
          <div className="flex items-center justify-between pt-1">
            <span
              className={cn(
                'inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full',
                p.status === 'verified'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              )}
            >
              {p.status}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(p)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(p.id, p.name)}
                className="px-3 py-1 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
