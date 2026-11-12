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
    <div className="bg-white rounded-xl border border-[#E2E5DF] shadow-card-subtle p-5 space-y-4 flex flex-col justify-between">
      <div className="flex items-start justify-between pb-3 border-b border-[#E2E5DF]">
        <div>
          <h3 className="text-sm font-bold text-text-950">
            Parameter Filter Fasilitas Terpopuler
          </h3>
          <p className="text-xs text-text-500 mt-0.5">
            Frekuensi penggunaan filter oleh mahasiswa saat mencari tempat nugas
          </p>
        </div>
        <span className="text-[11px] font-mono text-text-500 shrink-0">Proporsi Kueri</span>
      </div>

      <div className="space-y-3.5 py-1">
        {preferences.map((p) => {
          const isHigh = p.percent >= 65;
          const isMedium = p.percent >= 50 && p.percent < 65;

          const barColorClass = isHigh
            ? 'bg-[#005B54]'
            : isMedium
              ? 'bg-amber-500'
              : 'bg-slate-400';

          const pctColorClass = isHigh
            ? 'text-[#005B54]'
            : isMedium
              ? 'text-amber-700'
              : 'text-text-700';

          return (
            <div key={p.label} className="space-y-1.5">
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-semibold text-text-800">{p.label}</span>
                <div className="flex items-baseline gap-2 tabular-nums">
                  <span className="text-[11px] text-text-500 font-mono">
                    {p.hits.toLocaleString('id-ID')} kueri
                  </span>
                  <span className={`font-bold w-9 text-right ${pctColorClass}`}>
                    {p.percent}%
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-[#E6E9E2] rounded-sm overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${barColorClass}`}
                  style={{
                    width: `${p.percent}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-[#E2E5DF] flex items-center justify-between text-[11px] text-text-500">
        <span>Atribut dominan: Ketersediaan colokan &amp; kecepatan Wi-Fi</span>
        <span className="font-mono text-text-700 tabular-nums">n = 14.280 sesi</span>
      </div>
    </div>
  );
}
