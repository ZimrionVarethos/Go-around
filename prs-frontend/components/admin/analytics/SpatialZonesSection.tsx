import { MapPin, Navigation } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SpatialDensityItem {
  area: string;
  queries: number;
  rank: number;
  note: string;
}

interface TopCafeItem {
  name: string;
  address: string;
  clicks: number;
  rank: number;
}

interface SpatialZonesSectionProps {
  spatialDensity: SpatialDensityItem[];
  topCafes: TopCafeItem[];
}

export function SpatialZonesSection({ spatialDensity, topCafes }: SpatialZonesSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Spatial Density */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#005B54]" />
            Densitas Spasial Kueri per Wilayah
          </h3>
          <span className="text-[11px] text-gray-400 font-medium">Kota Bogor</span>
        </div>

        <div className="space-y-3">
          {spatialDensity.map((area) => (
            <div
              key={area.area}
              className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-gray-50 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white border border-gray-200 text-gray-700 text-[10px] font-bold flex items-center justify-center">
                    #{area.rank}
                  </span>
                  <span className="font-bold text-gray-900">{area.area}</span>
                </div>
                <span className="font-extrabold text-[#005B54]">
                  {area.queries.toLocaleString()} kueri
                </span>
              </div>
              <p className="text-[11px] text-gray-500 pl-7">{area.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Spot Most Searched Routes */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#005B54]" />
            Top Spot Paling Sering Dicari Rutenya
          </h3>
          <span className="text-[11px] text-gray-400 font-medium">Klik Rute</span>
        </div>

        <div className="divide-y divide-gray-100">
          {topCafes.map((cafe) => (
            <div
              key={cafe.name}
              className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={cn(
                    'w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0',
                    cafe.rank === 1
                      ? 'bg-amber-400 text-amber-950 shadow-xs'
                      : cafe.rank === 2
                      ? 'bg-gray-200 text-gray-800'
                      : cafe.rank === 3
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-500'
                  )}
                >
                  {cafe.rank}
                </span>
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-gray-900 truncate">
                    {cafe.name}
                  </h5>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">
                    {cafe.address}
                  </p>
                </div>
              </div>

              <span className="text-xs font-extrabold text-[#005B54] bg-teal-50 px-2.5 py-1 rounded-lg shrink-0">
                {cafe.clicks.toLocaleString()} rute
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
