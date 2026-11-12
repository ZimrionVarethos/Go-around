'use client';

import { useState } from 'react';
import { CaretRightIcon, BusIcon } from '@phosphor-icons/react';
import { DISTRICT_RANKINGS } from './research-data';

export function DistrictDistributionSection() {
  const [selectedDistrict, setSelectedDistrict] = useState(
    DISTRICT_RANKINGS[0].id
  );
  const currentDistrict =
    DISTRICT_RANKINGS.find((d) => d.id === selectedDistrict) ||
    DISTRICT_RANKINGS[0];

  return (
    <>
      {/* ── SECTION 4: SPATIAL RANKING & DENSITY GRID (#1 s/d #6) ── */}
      <section id="sebaran-wilayah" className="scroll-mt-24">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-8 rounded-xl bg-[#005B54] text-white flex items-center justify-center text-sm font-bold shadow-xs">
            4
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Sebaran Geospasial 6 Kecamatan Kota Bogor
          </h2>
        </div>
        <p className="text-base text-stone-600 leading-relaxed mb-6 max-w-4xl">
          Peringkat kepadatan ruang nugas dan klaster kafe di seluruh wilayah administratif Kota Bogor:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 6 Ranking Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {DISTRICT_RANKINGS.map((d) => {
              const isSelected = selectedDistrict === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDistrict(d.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#005B54] shadow-md'
                      : 'bg-stone-50 border-stone-200 hover:bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                      {d.rank}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${d.tagClass}`}
                    >
                      {d.densityTag}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-stone-900 leading-snug">
                      {d.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-stone-500">
                      <span className="text-[#005B54] font-bold">{d.cafes}</span>
                      <span>&bull;</span>
                      <span>{d.pct}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-200 text-[11px] font-medium text-stone-500 flex items-center justify-between">
                    <span>{d.transit}</span>
                    <CaretRightIcon size={14} weight="bold" className="text-stone-400" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed District Inspection Card */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex justify-between items-start pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-[#005B54] text-white">
                    {currentDistrict.rank}
                  </span>
                  <span className="text-xs font-bold text-[#005B54] uppercase tracking-wider">
                    Detail Kawasan
                  </span>
                </div>
                <h3 className="text-2xl font-black text-stone-900 mt-1">
                  Kecamatan {currentDistrict.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-[#005B54] block">
                  {currentDistrict.cafes}
                </span>
                <span className="text-xs font-semibold text-stone-400">
                  {currentDistrict.pct}
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              {currentDistrict.desc}
            </p>

            <div className="space-y-3 text-sm">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-xs uppercase font-extrabold text-stone-400 block mb-1">
                  Titik Kampus &amp; Akademik
                </span>
                <p className="font-bold text-stone-900">
                  {currentDistrict.campus}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-xs uppercase font-extrabold text-stone-400 block mb-1">
                  Akses Transportasi Publik
                </span>
                <p className="font-bold text-stone-900">
                  {currentDistrict.transit}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-stone-500">
                Klaster Jalan Terkenal:
              </span>
              {currentDistrict.hotspots.map((h) => (
                <span
                  key={h}
                  className="px-2.5 py-1 bg-stone-100 font-semibold text-stone-700 rounded-md"
                >
                  📍 {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: CAMPUS & TRANSIT CONNECTIVITY ── */}
      <section id="akses-kampus" className="scroll-mt-24">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-8 rounded-xl bg-[#005B54] text-white flex items-center justify-center text-sm font-bold shadow-xs">
            5
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Akses Kampus IPB &amp; Koridor Transit Biskita Transpakuan
          </h2>
        </div>
        <p className="text-base text-stone-600 leading-relaxed mb-6 max-w-4xl">
          Integrasi spasial titik nugas dengan jalur transportasi publik utama Kota Bogor:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Campus 1 */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#005B54] flex items-center justify-center font-bold mb-4">
                <BusIcon size={20} weight="duotone" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-1">
                IPB Kampus Baranangsiang
              </h3>
              <span className="text-xs font-bold text-stone-400 block uppercase mb-3">
                Bogor Tengah &bull; Terminal Baranangsiang
              </span>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                Terhubung langsung dengan koridor Biskita K1 dan K2. Dikelilingi kafe di Jl. Pajajaran dan kawasan Babakan yang dapat dijangkau 5–10 menit jalan kaki.
              </p>
            </div>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs text-stone-700 font-semibold">
              Rekomendasi: Spot nugas di Babakan &amp; Pajajaran Tengah.
            </div>
          </div>

          {/* Campus 2 */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#005B54] flex items-center justify-center font-bold mb-4">
                <BusIcon size={20} weight="duotone" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-1">
                Sekolah Vokasi IPB (Cilibende)
              </h3>
              <span className="text-xs font-bold text-stone-400 block uppercase mb-3">
                Bogor Utara &bull; Jl. Kumbang &amp; Cilibende
              </span>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                Pusat aktivitas ribuan mahasiswa vokasi. Dikelilingi sentra kuliner dan kafe hemat di sepanjang Jl. Bangbarung dan Jl. Pandu Raya.
              </p>
            </div>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs text-stone-700 font-semibold">
              Rekomendasi: Kafe ramah kantong di Bangbarung &amp; Pandu Raya.
            </div>
          </div>

          {/* Campus 3 */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#005B54] flex items-center justify-center font-bold mb-4">
                <BusIcon size={20} weight="duotone" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-1">
                Kampus IPB Gunung Gede &amp; Koridor Yasmin
              </h3>
              <span className="text-xs font-bold text-stone-400 block uppercase mb-3">
                Bogor Tengah / Barat &bull; Lodaya &amp; Bubulak
              </span>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                Akses transit Biskita Koridor 1 dan 2. Pilihan kafe bernuansa tenang di sekitar Jl. Lodaya, Taman Kencana, hingga koridor Taman Yasmin.
              </p>
            </div>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs text-stone-700 font-semibold">
              Rekomendasi: Kafe tenang di Lodaya, Taman Kencana &amp; Yasmin.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
