/* eslint-disable @next/next/no-img-element */
'use client';

import { MapPin, Wifi, Edit2, Trash2, ClipboardCheck, Crosshair } from 'lucide-react';
import { PlaceItem } from '@/lib/admin-store';
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
  if (places.length === 0) {
    return (
      <div className="lg:hidden p-8 text-center text-text-500">
        Tidak ada tempat nugas yang sesuai dengan filter.
      </div>
    );
  }

  return (
    <div className="lg:hidden divide-y divide-[#E2E5DF] bg-white">
      {places.map((place) => (
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
                <MapPin className="w-3 h-3 text-text-400 shrink-0" />
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
                  <Crosshair className="w-3 h-3" />
                  <span>Salin</span>
                </button>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-text-900 tabular-nums block">
                <span className="text-[#D97706]">★</span> {formatStarRating(place.score)}{' '}
                <span className="text-[10px] font-normal text-text-400">/ 5</span>
              </span>
              <span className="text-[10px] font-semibold text-[#005B54] tabular-nums">
                {formatNugasScore(place.score)} Nugas
              </span>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-2 bg-[#F5F6F3] p-2.5 rounded-lg text-center text-xs border border-[#E2E5DF]">
            <div>
              <span className="text-[10px] text-text-500 font-medium block">Wi-Fi</span>
              <span className="font-semibold text-text-900 inline-flex items-center gap-1 justify-center tabular-nums">
                <Wifi className="w-3 h-3 text-[#005B54]" />
                {place.wifi} Mbps
              </span>
            </div>
            <div>
              <span className="text-[10px] text-text-500 font-medium block">Colokan</span>
              <span className="font-semibold text-text-900 tabular-nums">{place.plug}%</span>
            </div>
            <div>
              <span className="text-[10px] text-text-500 font-medium block">Harga</span>
              <span className="font-semibold text-text-900 tabular-nums truncate block">{place.price}</span>
            </div>
          </div>

          {/* Status & Actions Footer */}
          <div className="flex items-center justify-between pt-0.5">
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
                  <ClipboardCheck className="w-3 h-3" />
                  <span>Audit</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onEdit(place)}
                className="px-2.5 py-1 bg-[#F5F6F3] hover:bg-[#EFECE1] text-text-700 text-xs font-semibold rounded-md transition-colors border border-[#E2E5DF] cursor-pointer tactile-press"
              >
                <Edit2 className="w-3 h-3 inline mr-1" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(place.id, place.name)}
                className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-md transition-colors cursor-pointer tactile-press"
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
