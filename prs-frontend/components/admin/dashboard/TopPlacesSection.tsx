import Link from 'next/link';
import { Star } from 'lucide-react';
import { PlaceItem } from '@/lib/admin-store';
import { formatStarRating, formatNugasScore } from '@/lib/utils';

interface TopPlacesSectionProps {
  places: PlaceItem[];
}

export function TopPlacesSection({ places }: TopPlacesSectionProps) {
  return (
    <div className="space-y-6">
      {/* Top Verified Cafes */}
      <div className="bg-white rounded-2xl border border-[#E2E5DF] shadow-card-subtle overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E5DF] bg-[#F5F6F3]/45 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-text-950">
              Titik Kafe Rating Tertinggi
            </h3>
            <p className="text-[11px] text-text-500 mt-0.5">
              Skala rating publik (0-5) &amp; indeks nugas
            </p>
          </div>
          <Link
            href="/admin/places"
            className="text-xs font-semibold text-[#005B54] hover:underline shrink-0 tabular-nums"
          >
            Kelola ({places.length})
          </Link>
        </div>

        <div className="divide-y divide-[#E2E5DF]">
          {places.slice(0, 4).map((place, idx) => (
            <div
              key={place.id}
              className="flex items-center justify-between px-5 py-3 hover:bg-[#F5F6F3]/50 transition-colors"
            >
              <div className="min-w-0 flex-1 pr-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono tabular-nums font-semibold text-text-400">
                    0{idx + 1}
                  </span>
                  <h5 className="text-xs font-bold text-text-950 truncate">
                    {place.name}
                  </h5>
                </div>
                <p className="text-[11px] text-text-500 truncate mt-0.5">
                  {place.address}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2 text-right">
                <div className="inline-flex items-center gap-1 text-xs font-bold text-text-900 tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-[#ECC457] text-[#ECC457]" />
                  <span>{formatStarRating(place.score)}</span>
                  <span className="text-[10px] font-normal text-text-400">/ 5</span>
                </div>
                <span className="text-[11px] font-mono tabular-nums font-semibold text-[#005B54] bg-teal-50/80 border border-teal-200/70 px-1.5 py-0.5 rounded">
                  {formatNugasScore(place.score)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-2.5 bg-[#F5F6F3]/55 border-t border-[#E2E5DF]">
          <Link
            href="/admin/places"
            className="block text-center text-xs font-semibold text-text-700 hover:text-[#005B54] py-1 rounded-lg hover:bg-white transition-all tactile-press"
          >
            Buka Direktori Spasial Kafe →
          </Link>
        </div>
      </div>

      {/* Single Stacked Spatial Proportion Bar (Replaces 3 repetitive progress bars) */}
      <div className="bg-white rounded-2xl border border-[#E2E5DF] shadow-card-subtle p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-text-950">
              Sebaran Titik per Klaster Wilayah
            </h4>
            <p className="text-[11px] text-text-500 mt-0.5">
              Proporsi cakupan 108 titik tempat nugas aktif
            </p>
          </div>
          <span className="text-[10px] font-mono font-semibold text-[#005B54] bg-[#005B54]/[0.06] border border-[#005B54]/15 px-1.5 py-0.5 rounded">
            3 Klaster
          </span>
        </div>

        {/* Multi-segment Stacked Proportion Bar */}
        <div className="h-3 w-full rounded-lg bg-[#F5F6F3] p-0.5 border border-[#E2E5DF] flex items-center gap-0.5 overflow-hidden">
          <div
            className="h-full bg-[#005B54] rounded-l-md"
            style={{ width: '39%' }}
            title="Bogor Tengah & Babakan: 39%"
          />
          <div
            className="h-full bg-amber-500"
            style={{ width: '35%' }}
            title="Bogor Timur (Baranangsiang): 35%"
          />
          <div
            className="h-full bg-slate-400 rounded-r-md"
            style={{ width: '26%' }}
            title="Bogor Utara, Barat & Tanah Sareal: 26%"
          />
        </div>

        {/* Clean Matrix Legend */}
        <div className="divide-y divide-[#E2E5DF] text-xs">
          <div className="py-2 first:pt-0 flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-text-700 font-medium truncate">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#005B54] shrink-0" />
              <span className="truncate">Bogor Tengah &amp; Babakan</span>
            </span>
            <span className="font-mono tabular-nums text-[11px] font-semibold text-text-950 shrink-0">
              42 titik <span className="text-[#005B54] font-semibold">(39%)</span>
            </span>
          </div>

          <div className="py-2 flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-text-700 font-medium truncate">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 shrink-0" />
              <span className="truncate">Bogor Timur (Baranangsiang)</span>
            </span>
            <span className="font-mono tabular-nums text-[11px] font-semibold text-text-950 shrink-0">
              38 titik <span className="text-amber-700 font-semibold">(35%)</span>
            </span>
          </div>

          <div className="py-2 last:pb-0 flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-text-700 font-medium truncate">
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-400 shrink-0" />
              <span className="truncate">Bogor Utara, Barat &amp; Tanah Sareal</span>
            </span>
            <span className="font-mono tabular-nums text-[11px] font-semibold text-text-950 shrink-0">
              28 titik <span className="text-text-500 font-normal">(26%)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
