interface AnalyticsKPIProps {
  kpi: {
    totalQueries: number;
    queriesGrowth: string;
    activeStudents: number;
    studentsGrowth: string;
    avgSessionHours: number;
    routeConversions: number;
    conversionRate: string;
  };
}

export function AnalyticsKPIGrid({ kpi }: AnalyticsKPIProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-card-subtle grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E5DF] overflow-hidden">
      <div className="p-4 sm:p-5">
        <span className="text-xs font-semibold text-text-600">Total Kueri Spasial</span>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl sm:text-[26px] font-extrabold text-text-950 tracking-tight tabular-nums">
            {kpi.totalQueries.toLocaleString('id-ID')}
          </span>
          <span className="text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md tabular-nums">
            {kpi.queriesGrowth}
          </span>
        </div>
        <p className="text-[11px] text-text-500 mt-1.5">
          Pencarian radius &amp; fasilitas di WebGIS
        </p>
      </div>

      <div className="p-4 sm:p-5">
        <span className="text-xs font-semibold text-text-600">Pengguna Mahasiswa Aktif</span>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl sm:text-[26px] font-extrabold text-text-950 tracking-tight tabular-nums">
            {kpi.activeStudents.toLocaleString('id-ID')}
          </span>
          <span className="text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md tabular-nums">
            {kpi.studentsGrowth}
          </span>
        </div>
        <p className="text-[11px] text-text-500 mt-1.5">
          Sesi unik kawasan kampus Kota Bogor
        </p>
      </div>

      <div className="p-4 sm:p-5">
        <span className="text-xs font-semibold text-text-600">Rata-rata Durasi Belajar</span>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl sm:text-[26px] font-extrabold text-text-950 tracking-tight tabular-nums">
            {kpi.avgSessionHours} Jam
          </span>
          <span className="text-[11px] font-mono font-semibold text-text-600 bg-[#F5F6F3] border border-[#E2E5DF] px-2 py-0.5 rounded-md">
            per kunjungan
          </span>
        </div>
        <p className="text-[11px] text-text-500 mt-1.5">
          Estimasi survei kontribusi lapangan
        </p>
      </div>

      <div className="p-4 sm:p-5">
        <span className="text-xs font-semibold text-text-600">Konversi Navigasi Rute</span>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl sm:text-[26px] font-extrabold text-text-950 tracking-tight tabular-nums">
            {kpi.routeConversions.toLocaleString('id-ID')}
          </span>
          <span className="text-[11px] font-mono font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md tabular-nums">
            {kpi.conversionRate}
          </span>
        </div>
        <p className="text-[11px] text-text-500 mt-1.5">
          Transisi dari titik peta ke navigasi rute
        </p>
      </div>
    </div>
  );
}
