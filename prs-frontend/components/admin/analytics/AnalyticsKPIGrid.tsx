import { TrendingUp } from 'lucide-react';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
        <span className="text-xs font-semibold text-gray-500">Total Kueri Spasial</span>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {kpi.totalQueries.toLocaleString()}
          </span>
          <span className="text-xs font-bold text-emerald-600 flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            {kpi.queriesGrowth}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-2">
          Pencarian tempat nugas via WebGIS
        </p>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
        <span className="text-xs font-semibold text-gray-500">Mahasiswa Aktif</span>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {kpi.activeStudents.toLocaleString()}
          </span>
          <span className="text-xs font-bold text-emerald-600 flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            {kpi.studentsGrowth}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-2">
          Pengguna aktif bulanan di Bogor
        </p>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
        <span className="text-xs font-semibold text-gray-500">Rata-rata Durasi Nugas</span>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {kpi.avgSessionHours} Jam
          </span>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
            Produktif
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-2">
          Berdasarkan waktu kunjungan & survei
        </p>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
        <span className="text-xs font-semibold text-gray-500">Konversi Navigasi Rute</span>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {kpi.routeConversions.toLocaleString()}
          </span>
          <span className="text-xs font-bold text-emerald-600">
            {kpi.conversionRate}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-2">
          Klik &quot;Buka Rute Maps&quot; ke lokasi kafe
        </p>
      </div>
    </div>
  );
}
