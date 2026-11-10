'use client';

import { useState } from 'react';
import { CellSignalFullIcon, SparkleIcon } from '@phosphor-icons/react';
import { FACILITY_TIERS } from './research-data';

export function FacilityMetersSection() {
  const [activeFacility, setActiveFacility] = useState(FACILITY_TIERS[0].id);
  const currentFacility =
    FACILITY_TIERS.find((f) => f.id === activeFacility) || FACILITY_TIERS[0];

  return (
    <section id="fasilitas-visual" className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-8 h-8 rounded-xl bg-[#005B54] text-white flex items-center justify-center text-sm font-bold shadow-xs">
          2
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Karakteristik &amp; Sebaran Fasilitas Nugas
        </h2>
      </div>
      <p className="text-base text-stone-600 leading-relaxed mb-6 max-w-4xl">
        Pilih parameter fasilitas di bawah untuk melihat rincian kategori dan persentase sebaran kafe di Kota Bogor:
      </p>

      {/* Interactive Facility Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FACILITY_TIERS.map((f) => {
          const IconComp = f.icon;
          const isActive = activeFacility === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFacility(f.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#005B54] text-white shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <IconComp size={16} weight="duotone" />
              <span>
                {f.name.split(' ')[0]} {f.name.split(' ')[1] || ''}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3-Column Comparative Tier Cards */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {currentFacility.tiers.map((tier, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:border-[#005B54]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${tier.badgeClass}`}
                  >
                    {tier.badge}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#005B54] font-mono">
                    {tier.pct}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1">
                  {tier.title}
                </h3>
                <span className="text-xs font-semibold text-stone-400 block mb-3">
                  {tier.sub}
                </span>

                <p className="text-sm text-stone-600 leading-relaxed">{tier.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-500">
                <span className="flex items-center gap-1.5">
                  <CellSignalFullIcon size={14} weight="bold" className="text-[#005B54]" />
                  <span>Kategori #{idx + 1}</span>
                </span>
                <span className="text-[#005B54] font-semibold">Tercatat di Peta</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Insight Banner */}
        <div className="p-5 rounded-2xl bg-teal-50/70 border border-[#005B54] flex items-center gap-3.5 shadow-2xs">
          <SparkleIcon size={20} weight="fill" className="text-[#005B54] shrink-0" />
          <p className="text-sm font-semibold text-teal-950 leading-relaxed">
            {currentFacility.insight}
          </p>
        </div>
      </div>
    </section>
  );
}
