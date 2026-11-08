'use client';

import {
  MapPin,
  Wifi,
  Volume2,
  Edit2,
  Trash2,
  Crosshair,
  ClipboardCheck,
} from 'lucide-react';
import { PlaceItem } from '@/lib/admin-store';
import { cn } from '@/lib/cn';

interface PlacesGridProps {
  places: PlaceItem[];
  onToggleStatus: (place: PlaceItem) => void;
  onEdit: (place: PlaceItem) => void;
  onDelete: (id: number, name: string) => void;
  onLocatePlace?: (place: PlaceItem) => void;
}

export function PlacesGrid({
  places,
  onToggleStatus,
  onEdit,
  onDelete,
  onLocatePlace,
}: PlacesGridProps) {
  if (places.length === 0) {
    return (
      <div className="p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-200/80">
        Tidak ada tempat nugas yang sesuai dengan filter.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {places.map((place) => (
        <div
          key={place.id}
          className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
        >
          {/* Card Top / Image & Status Badges */}
          <div>
            <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
              <img
                src={
                  place.imageUrl ||
                  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&auto=format&fit=crop&q=80'
                }
                alt={place.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Status Pill Top Left */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-white bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/20">
                  #{place.code}
                </span>
                {place.status === 'verified' ? (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>Terverifikasi</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>Perlu Review</span>
                  </span>
                )}
              </div>

              {/* Rating Top Right */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-sm text-xs font-extrabold text-[#005B54] flex items-center gap-1">
                <span className="text-amber-500">★</span>
                <span>{place.score}</span>
              </div>

              {/* Title & Address overlay at bottom of image */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-base font-bold drop-shadow-sm truncate">{place.name}</h3>
                <div className="flex items-center gap-1 text-xs text-white/90 truncate mt-0.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{place.address}</span>
                </div>
              </div>
            </div>

            {/* Attributes Section */}
            <div className="p-4 space-y-3.5">
              {/* GIS Coordinates & WiFi */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-mono text-[11px] text-gray-600 bg-gray-50 border border-gray-200/80 px-2 py-1 rounded-lg">
                  <MapPin className="w-3 h-3 text-teal-600" />
                  <span>
                    {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD] text-xs font-bold px-2.5 py-1 rounded-full">
                  <Wifi className="w-3 h-3" />
                  <span>{place.wifi} Mbps</span>
                </div>
              </div>

              {/* Colokan Bar & Price */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Colokan: <strong className="text-amber-600 font-bold">{place.plug}%</strong>{' '}
                    <span className="text-gray-400">
                      ({place.plugLabel || (place.plug >= 80 ? 'Banyak' : 'Cukup')})
                    </span>
                  </span>
                  <span className="font-bold text-gray-900">{place.price}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${place.plug}%` }}
                  />
                </div>
              </div>

              {/* Acoustics & Budget Tag */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                <div className="flex items-center gap-1 text-gray-600 font-medium">
                  <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>{place.acoustic || 'Kondusif'}</span>
                </div>
                <span className="text-emerald-700 font-semibold text-[11px]">
                  {place.priceCategory || 'Ramah Mahasiswa'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-3 bg-gray-50/75 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onLocatePlace?.(place)}
              className="text-xs text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Titik Spasial</span>
            </button>

            <div className="flex items-center gap-1">
              {place.status === 'review' ? (
                <button
                  type="button"
                  onClick={() => onToggleStatus(place)}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>Audit</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onEdit(place)}
                    className="p-1.5 text-gray-500 hover:text-[#005B54] hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Edit Data"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(place.id, place.name)}
                    className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
