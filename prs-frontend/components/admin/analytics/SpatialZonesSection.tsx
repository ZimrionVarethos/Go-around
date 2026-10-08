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
  const totalQueries = spatialDensity.reduce((sum, d) => sum + d.queries, 0) || 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Spatial Density Table Breakdown (Structured Telemetry Rows without repetitive progress bars) */}
      <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-card-subtle overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-[#E2E5DF] bg-[#F8F9F7] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-text-950">
              Densitas Kueri Spasial per Koridor Wilayah
            </h3>
            <p className="text-xs text-text-500 mt-0.5">
              Konsentrasi pencarian titik tempat nugas di Kota Bogor &amp; lingkar kampus
            </p>
          </div>
          <span className="text-[11px] font-mono font-semibold text-[#005B54] bg-[#005B54]/[0.07] px-2 py-0.5 rounded shrink-0">
            EPSG:4326
          </span>
        </div>

        <div className="divide-y divide-[#E2E5DF] flex-1">
          {spatialDensity.map((area) => {
            const sharePct = ((area.queries / totalQueries) * 100).toFixed(1);
            const badgeColorClass =
              area.rank === 1
                ? 'text-[#005B54] bg-[#005B54]/[0.08] border-[#005B54]/20'
                : area.rank === 2
                  ? 'text-amber-800 bg-amber-50 border-amber-200/80'
                  : 'text-text-700 bg-[#F5F6F3] border-[#E2E5DF]';

            return (
              <div
                key={area.area}
                className="px-5 py-3.5 hover:bg-[#F5F6F3]/60 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-baseline gap-2.5 min-w-0">
                    <span className="font-mono text-[11px] font-bold text-text-400 tabular-nums shrink-0">
                      0{area.rank}
                    </span>
                    <span className="font-bold text-text-950 truncate">{area.area}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 tabular-nums">
                    <span className="font-bold text-text-900">
                      {area.queries.toLocaleString('id-ID')} kueri
                    </span>
                    <span
                      className={`font-mono text-[11px] font-bold border px-1.5 py-0.5 rounded-md ${badgeColorClass}`}
                    >
                      {sharePct}%
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-text-500 leading-relaxed pl-6">{area.note}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Spot Most Searched Routes */}
      <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-card-subtle overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-[#E2E5DF] bg-[#F8F9F7] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-text-950">
              Titik Kafe dengan Permintaan Rute Tertinggi
            </h3>
            <p className="text-xs text-text-500 mt-0.5">
              Frekuensi pengarahan navigasi dari peta publik ke lokasi tujuan
            </p>
          </div>
          <span className="text-[11px] font-mono text-text-500 shrink-0">Konversi Rute</span>
        </div>

        <div className="divide-y divide-[#E2E5DF] flex-1">
          {topCafes.map((cafe) => (
            <div
              key={cafe.name}
              className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-[#F5F6F3]/60 transition-colors"
            >
              <div className="flex items-baseline gap-3 min-w-0">
                <span className="font-mono text-xs font-bold text-text-400 tabular-nums shrink-0">
                  0{cafe.rank}
                </span>
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-text-950 truncate">
                    {cafe.name}
                  </h5>
                  <p className="text-[11px] text-text-500 truncate mt-0.5">
                    {cafe.address}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 tabular-nums">
                <span className="text-xs font-bold text-text-950">
                  {cafe.clicks.toLocaleString('id-ID')}
                </span>
                <span className="text-[11px] text-text-500 ml-1">rute</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
