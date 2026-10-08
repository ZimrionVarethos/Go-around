/* eslint-disable @next/next/no-img-element */
'use client';

import {
  ClipboardTextIcon,
  CrosshairIcon,
  MapPinIcon,
  PencilSimpleIcon,
  StarIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import {
  DynamicAcousticIcon,
  DynamicPlugIcon,
  DynamicWifiIcon,
} from '@/components/ui/FacilityIcons';
import { PlaceItem } from '@/lib/admin-store';
import { formatStarRating, formatNugasScore } from '@/lib/utils';

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
      <div className="p-10 text-center text-text-500 bg-white rounded-xl border border-[#E2E5DF] shadow-card-subtle">
        Tidak ada tempat nugas yang sesuai dengan filter.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {places.map((place) => (
        <div
          key={place.id}
          className="bg-white rounded-xl border border-[#E2E5DF] shadow-card-subtle overflow-hidden flex flex-col justify-between group"
        >
          {/* Card Top / Image & Status Badges */}
          <div>
            <div className="relative h-40 w-full bg-[#F5F6F3] overflow-hidden">
              <img
                src={
                  place.imageUrl ||
                  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&auto=format&fit=crop&q=80'
                }
                alt={place.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />

              {/* Code & Status Pill Top Left */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="font-mono text-[10px] font-bold text-white tabular-nums bg-black/55 backdrop-blur-xs px-2 py-0.5 rounded border border-white/20">
                  #{place.code}
                </span>
                {place.status === 'verified' ? (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span>Terverifikasi</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-amber-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span>Perlu Review</span>
                  </span>
                )}
              </div>

              {/* Standardized 5-Star Rating Top Right */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md text-xs font-bold text-text-900 flex items-center gap-1 tabular-nums">
                <StarIcon size={12} weight="fill" className="text-[#D97706]" />
                <span>{formatStarRating(place.score)}</span>
                <span className="text-[10px] font-normal text-text-400">/ 5</span>
              </div>

              {/* Title & Address overlay at bottom of image */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-sm font-bold drop-shadow-xs truncate">{place.name}</h3>
                <div className="flex items-center gap-1 text-[11px] text-white/90 truncate mt-0.5">
                  <MapPinIcon size={12} weight="fill" className="shrink-0" />
                  <span className="truncate">{place.address}</span>
                </div>
              </div>
            </div>

            {/* Attributes Section */}
            <div className="p-4 space-y-3">
              {/* GIS Coordinates & WiFi */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-mono text-[11px] text-text-700 tabular-nums bg-[#F5F6F3] border border-[#E2E5DF] px-2 py-0.5 rounded-md">
                  <MapPinIcon size={12} weight="fill" className="text-[#005B54]" />
                  <span>
                    {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-text-900 tabular-nums">
                  <DynamicWifiIcon mbps={place.wifi} size={15} />
                  <span>{place.wifi} Mbps</span>
                </div>
              </div>

              {/* Colokan & Price Telemetry Strip */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-[#F5F6F3] border border-[#E2E5DF] text-xs">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-500 block">
                    Colokan Listrik
                  </span>
                  <div className="mt-0.5 flex items-center gap-1">
                    <DynamicPlugIcon plugPercent={place.plug} size={14} />
                    <strong className="text-text-950 font-bold tabular-nums">{place.plug}%</strong>
                    <span className="text-[11px] text-text-500 truncate">
                      ({place.plug >= 80 ? 'Banyak' : 'Cukup'})
                    </span>
                  </div>
                </div>
                <div className="border-l border-[#E2E5DF] pl-2.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-500 block">
                    Kisaran Harga
                  </span>
                  <span className="mt-0.5 font-bold text-text-950 tabular-nums block truncate">
                    {place.price}
                  </span>
                </div>
              </div>

              {/* Acoustics & Nugas Index */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E2E5DF]">
                <div className="flex items-center gap-1.5 text-text-600 font-medium">
                  <DynamicAcousticIcon acousticLabel={place.acoustic} size={14} />
                  <span>{place.acoustic || 'Kondusif'}</span>
                </div>
                <span className="text-[#005B54] font-semibold text-[11px] tabular-nums">
                  {formatNugasScore(place.score)} Indeks Nugas
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="px-4 py-2.5 bg-[#F8F9F7] border-t border-[#E2E5DF] flex items-center justify-between">
            <button
              type="button"
              onClick={() => onLocatePlace?.(place)}
              className="text-xs text-[#005B54] hover:underline font-semibold flex items-center gap-1 cursor-pointer tactile-press"
            >
              <CrosshairIcon size={14} weight="bold" />
              <span>Salin Koordinat</span>
            </button>

            <div className="flex items-center gap-1">
              {place.status === 'review' ? (
                <button
                  type="button"
                  onClick={() => onToggleStatus(place)}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors cursor-pointer tactile-press"
                >
                  <ClipboardTextIcon size={14} weight="duotone" />
                  <span>Audit</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onEdit(place)}
                    className="p-1.5 text-text-500 hover:text-[#005B54] hover:bg-white rounded-md transition-colors cursor-pointer tactile-press"
                    title="Edit Data"
                  >
                    <PencilSimpleIcon size={14} weight="bold" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(place.id, place.name)}
                    className="p-1.5 text-text-500 hover:text-rose-600 hover:bg-white rounded-md transition-colors cursor-pointer tactile-press"
                    title="Hapus"
                  >
                    <TrashIcon size={14} weight="bold" />
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
