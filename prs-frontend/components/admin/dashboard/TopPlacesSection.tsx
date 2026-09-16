import Link from 'next/link';
import { Coffee, MapPin } from 'lucide-react';
import { PlaceItem } from '@/lib/admin-store';

interface TopPlacesSectionProps {
  places: PlaceItem[];
}

export function TopPlacesSection({ places }: TopPlacesSectionProps) {
  return (
    <div className="space-y-6">
      {/* Top Verified Cafes */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Coffee className="w-4 h-4 text-[#005B54]" />
            Master Spot Nugas Teratas
          </h3>
          <Link
            href="/admin/places"
            className="text-[11px] font-semibold text-[#005B54] hover:underline"
          >
            Kelola ({places.length})
          </Link>
        </div>

        <div className="space-y-3">
          {places.slice(0, 4).map((place, idx) => (
            <div
              key={place.id}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-gray-400">#{idx + 1}</span>
                  <h5 className="text-xs font-bold text-gray-900 truncate">
                    {place.name}
                  </h5>
                </div>
                <p className="text-[11px] text-gray-500 truncate mt-0.5">
                  {place.address}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2 pl-3">
                <span className="text-xs font-bold text-[#005B54] bg-teal-50 px-2 py-0.5 rounded-md">
                  ★ {place.score}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/admin/places"
          className="block text-center text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 py-2.5 rounded-xl border border-gray-200 transition-colors"
        >
          Buka Master Data Kafe →
        </Link>
      </div>

      {/* Quick Spatial Density Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 space-y-3">
        <h4 className="text-xs font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#005B54]" />
          Sebaran Titik per Wilayah
        </h4>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Sentul & Babakan Madang</span>
            <span className="font-bold text-gray-900">42 Kafe (39%)</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#005B54] rounded-full" style={{ width: '39%' }} />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-gray-600">Bogor Tengah & Timur</span>
            <span className="font-bold text-gray-900">38 Kafe (35%)</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-600 rounded-full" style={{ width: '35%' }} />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-gray-600">Dramaga (IPB University)</span>
            <span className="font-bold text-gray-900">28 Kafe (26%)</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '26%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
