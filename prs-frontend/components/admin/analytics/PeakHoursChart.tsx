import { cn } from '@/lib/cn';

interface PeakHourItem {
  label: string;
  percent: number;
  isPeak?: boolean;
}

interface PeakHoursChartProps {
  peakHours: PeakHourItem[];
}

export function PeakHoursChart({ peakHours }: PeakHoursChartProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-card-subtle p-5 space-y-4 flex flex-col justify-between">
      <div className="flex items-start justify-between pb-3 border-b border-[#E2E5DF]">
        <div>
          <h3 className="text-sm font-bold text-text-950">
            Distribusi Waktu Kunjungan (WIB)
          </h3>
          <p className="text-xs text-text-500 mt-0.5">
            Tingkat okupansi tempat nugas berdasarkan rentang waktu harian
          </p>
        </div>
        <span className="text-[11px] font-mono text-text-500 shrink-0">Okupansi (%)</span>
      </div>

      {/* 4-Column Vertical Time-Slot Telemetry Grid (avoids repeating horizontal bars) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 pb-1 flex-1 items-end">
        {peakHours.map((hour) => {
          const timeParts = hour.label.split('\n');
          const periodName = timeParts[0] || hour.label;
          const timeWindow = timeParts[1] || '';
          const isModerate = !hour.isPeak && hour.percent >= 40;

          return (
            <div
              key={hour.label}
              className={cn(
                'flex flex-col items-center justify-between h-full gap-2.5 p-3 rounded-xl border transition-colors',
                hour.isPeak
                  ? 'bg-amber-50/40 border-amber-200/90'
                  : 'bg-[#F8F9F7] border-[#E2E5DF]'
              )}
            >
              {/* Top Metric & Peak Tag */}
              <div className="text-center space-y-1 w-full">
                {hour.isPeak ? (
                  <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/80 border border-amber-300/80 px-1.5 py-0.5 rounded">
                    Puncak
                  </span>
                ) : isModerate ? (
                  <span className="inline-block text-[9px] font-mono font-semibold text-[#005B54] py-0.5">
                    Moderat
                  </span>
                ) : (
                  <span className="inline-block text-[9px] font-mono text-text-400 py-0.5">
                    Lengang
                  </span>
                )}
                <div
                  className={cn(
                    'text-lg font-extrabold tabular-nums tracking-tight',
                    hour.isPeak
                      ? 'text-amber-700'
                      : isModerate
                        ? 'text-[#005B54]'
                        : 'text-text-800'
                  )}
                >
                  {hour.percent}%
                </div>
              </div>

              {/* Vertical Column Track */}
              <div className="w-full max-w-[44px] h-28 bg-[#E6E9E2] rounded-lg overflow-hidden flex items-end p-1">
                <div
                  className={cn(
                    'w-full rounded-md transition-all duration-500',
                    hour.isPeak
                      ? 'bg-amber-500'
                      : isModerate
                        ? 'bg-[#005B54]'
                        : 'bg-slate-400'
                  )}
                  style={{ height: `${Math.max(12, hour.percent)}%` }}
                />
              </div>

              {/* Time Slot Label */}
              <div className="text-center w-full pt-1 border-t border-[#E2E5DF]">
                <span className="text-xs font-bold text-text-900 block truncate">
                  {periodName}
                </span>
                {timeWindow && (
                  <span className="font-mono text-[10px] text-text-500 tabular-nums block mt-0.5">
                    {timeWindow}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-[#E2E5DF] text-xs text-text-600 leading-relaxed">
        <strong className="font-semibold text-text-900">Catatan Observasi:</strong> Beban puncak fasilitas listrik dan bandwidth Wi-Fi terjadi pada rentang <span className="font-mono font-semibold text-text-900 tabular-nums">16.00-21.00 WIB</span> seusai jam perkuliahan.
      </div>
    </div>
  );
}
