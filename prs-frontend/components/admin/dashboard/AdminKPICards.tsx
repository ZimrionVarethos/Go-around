import { Coffee, AlertTriangle, MapPin, Users, TrendingUp } from 'lucide-react';

interface AdminKPICardsProps {
  totalPlaces: number;
  activeTicketsCount: number;
  kpi: {
    totalKafeChange: string;
    totalKafeBreakdown: string;
    tiketNote: string;
    tiketBreakdown: string;
    usulanBaru: number;
    usulanNote: string;
    usulanBreakdown: string;
    kunjungan: number;
    kunjunganNote: string;
    kunjunganBreakdown: string;
  };
}

export function AdminKPICards({ totalPlaces, activeTicketsCount, kpi }: AdminKPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Total Kafe */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500">Total Tempat Nugas</span>
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#005B54] flex items-center justify-center">
            <Coffee className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {totalPlaces}
          </span>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            {kpi.totalKafeChange}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-2 truncate">
          {kpi.totalKafeBreakdown}
        </p>
      </div>

      {/* KPI 2: Tiket Laporan */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500">Tiket Terbuka</span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {activeTicketsCount}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            {kpi.tiketNote}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-2 truncate">
          {kpi.tiketBreakdown}
        </p>
      </div>

      {/* KPI 3: Usulan Baru */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500">Usulan Spot Baru</span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {kpi.usulanBaru}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
            {kpi.usulanNote}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-2 truncate">
          {kpi.usulanBreakdown}
        </p>
      </div>

      {/* KPI 4: Kunjungan */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500">Kunjungan WebGIS</span>
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {kpi.kunjungan.toLocaleString()}
          </span>
          <span className="text-xs text-gray-500 font-medium">
            {kpi.kunjunganNote}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-2 truncate">
          {kpi.kunjunganBreakdown}
        </p>
      </div>
    </div>
  );
}
