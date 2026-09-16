import { Clock, Flame } from 'lucide-react';
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
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#005B54]" />
          Jam Sibuk Kunjungan Nugas (Peak Hours)
        </h3>
        <span className="text-[11px] text-gray-400 font-medium">WIB</span>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        {peakHours.map((hour) => (
          <div
            key={hour.label}
            className={cn(
              'p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3',
              hour.isPeak
                ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 shadow-xs'
                : 'bg-gray-50/70 border-gray-200/80'
            )}
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-gray-700 whitespace-pre-line leading-snug">
                {hour.label}
              </span>
              {hour.isPeak && (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <Flame className="w-3 h-3 text-red-600 fill-red-600" />
                  Peak Time
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1">
              <span
                className={cn(
                  'text-2xl font-black tracking-tight',
                  hour.isPeak ? 'text-amber-900' : 'text-gray-800'
                )}
              >
                {hour.percent}%
              </span>
              <span className="text-[11px] text-gray-500">kepadatan</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 bg-teal-50 p-3 rounded-xl border border-teal-100/80 leading-relaxed">
        💡 <strong>Rekomendasi Mahasiswa:</strong> Kepadatan tertinggi terjadi antara jam <strong>16.00 – 21.00 WIB</strong>. Mahasiswa disarankan datang sebelum jam 15.30 WIB untuk mengamankan colokan di meja favorit.
      </p>
    </div>
  );
}
