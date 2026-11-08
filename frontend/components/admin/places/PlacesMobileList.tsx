'use client';

import { MapPin, Wifi, Volume2, Edit2, Trash2, ClipboardCheck, Crosshair } from 'lucide-react';
import { PlaceItem } from '@/lib/admin-store';
import { cn } from '@/lib/cn';

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
  if (places.length === 0) {
    return (
      <div className="lg:hidden p-8 text-center text-gray-400">
        Tidak ada tempat nugas yang sesuai dengan filter.
      </div>
    );
  }

  return (
    <div className="lg:hidden divide-y divide-gray-100 bg-white">
      {places.map((place) => (
        <div key={place.id} className="p-4 space-y-3">
          {/* Header Row: Thumbnail + Info */}
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200/60 shrink-0">
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
                <span className="font-mono text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                  #{place.code}
                </span>
                <h4 className="text-sm font-bold text-gray-900 truncate">{place.name}</h4>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 truncate flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                <span className="truncate">{place.address}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-[10px] text-gray-500">
                  {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                </span>
                <button
                  type="button"
                  onClick={() => onLocatePlace?.(place)}
                  className="text-[10px] font-bold text-teal-700 hover:underline flex items-center gap-0.5"
                >
                  <Crosshair className="w-3 h-3" />
                  <span>Lihat GIS</span>
                </button>
              </div>
            </div>
            <span className="text-xs font-bold text-[#005B54] bg-teal-50 px-2 py-0.5 rounded-lg shrink-0 border border-teal-100">
              ★ {place.score}
            </span>
          </div>

          {/* Metrics Bento Row */}
          <div className="grid grid-cols-3 gap-2 bg-gray-50/80 p-2.5 rounded-xl text-center text-xs border border-gray-100">
            <div>
              <span className="text-[10px] text-gray-400 block">WiFi Speed</span>
              <span className="font-bold text-[#0284C7] inline-flex items-center gap-1 justify-center">
                <Wifi className="w-3 h-3" />
                {place.wifi} Mbps
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block">Colokan</span>
              <span className="font-bold text-amber-600">{place.plug}%</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block">Harga</span>
              <span className="font-bold text-gray-900 truncate block">{place.price}</span>
            </div>
          </div>

          {/* Status & Actions Footer */}
          <div className="flex items-center justify-between pt-1">
            {place.status === 'verified' ? (
              <span className="inline-flex items-center gap-1.5 bg-[#E6F7EF] text-[#059669] border border-[#A7F3D0] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                <span>Terverifikasi</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                <span>Perlu Review</span>
              </span>
            )}

            <div className="flex items-center gap-1.5">
              {place.status === 'review' && onToggleStatus && (
                <button
                  type="button"
                  onClick={() => onToggleStatus(place)}
                  className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 shadow-xs"
                >
                  <ClipboardCheck className="w-3 h-3" />
                  <span>Audit</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onEdit(place)}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
              >
                <Edit2 className="w-3 h-3 inline mr-1" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(place.id, place.name)}
                className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition-colors"
              >
                <Trash2 className="w-3 h-3 inline mr-1" />
                Hapus
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
