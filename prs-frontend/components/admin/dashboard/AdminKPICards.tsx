import { Coffee, AlertTriangle, MapPin, Users } from 'lucide-react';

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
    <div className="bg-white rounded-2xl border border-[#E2E5DF] shadow-card-subtle grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E5DF] overflow-hidden">
      {/* KPI 1: Total Kafe */}
      <div className="p-4 sm:p-5 flex flex-col justify-between hover:bg-[#F5F6F3]/45 transition-colors">
        <div className="flex items-center justify-between text-text-500">
          <span className="text-xs font-semibold text-text-700">Total Tempat Nugas</span>
          <div className="w-7 h-7 rounded-lg bg-[#005B54]/[0.07] border border-[#005B54]/15 flex items-center justify-center">
            <Coffee className="w-3.5 h-3.5 text-[#005B54]" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span
            className="text-2xl sm:text-[26px] font-extrabold text-text-950 tracking-tight tabular-nums leading-none"
            style={{ fontFamily: "var(--font-onest), 'Onest', sans-serif" }}
          >
            {totalPlaces}
          </span>
          <span className="text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded">
            {kpi.totalKafeChange}
          </span>
        </div>
        <p className="text-[11px] text-text-500 mt-2 truncate font-medium">
          {kpi.totalKafeBreakdown}
        </p>
      </div>

      {/* KPI 2: Tiket Laporan */}
      <div className="p-4 sm:p-5 flex flex-col justify-between hover:bg-[#F5F6F3]/45 transition-colors">
        <div className="flex items-center justify-between text-text-500">
          <span className="text-xs font-semibold text-text-700">Tiket Terbuka</span>
          <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span
            className="text-2xl sm:text-[26px] font-extrabold text-text-950 tracking-tight tabular-nums leading-none"
            style={{ fontFamily: "var(--font-onest), 'Onest', sans-serif" }}
          >
            {activeTicketsCount}
          </span>
          <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded">
            {kpi.tiketNote}
          </span>
        </div>
        <p className="text-[11px] text-text-500 mt-2 truncate font-medium">
          {kpi.tiketBreakdown}
        </p>
      </div>

      {/* KPI 3: Usulan Baru */}
      <div className="p-4 sm:p-5 flex flex-col justify-between hover:bg-[#F5F6F3]/45 transition-colors">
        <div className="flex items-center justify-between text-text-500">
          <span className="text-xs font-semibold text-text-700">Usulan Spot Baru</span>
          <div className="w-7 h-7 rounded-lg bg-[#F5F6F3] border border-[#E2E5DF] flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-[#005B54]" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span
            className="text-2xl sm:text-[26px] font-extrabold text-text-950 tracking-tight tabular-nums leading-none"
            style={{ fontFamily: "var(--font-onest), 'Onest', sans-serif" }}
          >
            {kpi.usulanBaru}
          </span>
          <span className="text-[11px] font-medium text-text-700 bg-[#F5F6F3] border border-[#E2E5DF] px-1.5 py-0.5 rounded">
            {kpi.usulanNote}
          </span>
        </div>
        <p className="text-[11px] text-text-500 mt-2 truncate font-medium">
          {kpi.usulanBreakdown}
        </p>
      </div>

      {/* KPI 4: Kunjungan */}
      <div className="p-4 sm:p-5 flex flex-col justify-between hover:bg-[#F5F6F3]/45 transition-colors">
        <div className="flex items-center justify-between text-text-500">
          <span className="text-xs font-semibold text-text-700">Kunjungan WebGIS</span>
          <div className="w-7 h-7 rounded-lg bg-[#F5F6F3] border border-[#E2E5DF] flex items-center justify-center">
            <Users className="w-3.5 h-3.5 text-text-600" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span
            className="text-2xl sm:text-[26px] font-extrabold text-text-950 tracking-tight tabular-nums leading-none"
            style={{ fontFamily: "var(--font-onest), 'Onest', sans-serif" }}
          >
            {kpi.kunjungan.toLocaleString('id-ID')}
          </span>
          <span className="text-xs text-text-500 font-medium">
            {kpi.kunjunganNote}
          </span>
        </div>
        <p className="text-[11px] text-text-500 mt-2 truncate font-medium">
          {kpi.kunjunganBreakdown}
        </p>
      </div>
    </div>
  );
}
