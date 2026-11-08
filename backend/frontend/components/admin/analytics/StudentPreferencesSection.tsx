import { Sparkles } from 'lucide-react';

interface PreferenceItem {
  label: string;
  percent: number;
  hits: number;
  color: string;
}

interface StudentPreferencesSectionProps {
  preferences: PreferenceItem[];
}

export function StudentPreferencesSection({ preferences }: StudentPreferencesSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#005B54]" />
          Preferensi Krusial Mahasiswa Nugas
        </h3>
        <span className="text-[11px] text-gray-400 font-medium">Berdasarkan filter aktif</span>
      </div>

      <div className="space-y-4">
        {preferences.map((p) => (
          <div key={p.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-800">{p.label}</span>
              <span className="font-bold text-gray-900">
                {p.percent}% ({p.hits.toLocaleString()} kueri)
              </span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${p.percent}%`, backgroundColor: p.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
