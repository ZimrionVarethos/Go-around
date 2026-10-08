'use client';

import { useState } from 'react';
import { CheckCircleIcon } from '@phosphor-icons/react';
import { STUDY_VIBES } from './research-data';

export function StudyVibesSection() {
  const [activeVibe, setActiveVibe] = useState(STUDY_VIBES[0].id);
  const currentVibe =
    STUDY_VIBES.find((v) => v.id === activeVibe) || STUDY_VIBES[0];

  return (
    <section id="kategori-nugas" className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-8 h-8 rounded-xl bg-[#005B54] text-white flex items-center justify-center text-sm font-bold shadow-xs">
          3
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          4 Profil Karakteristik Tempat Nugas Pilihan
        </h2>
      </div>
      <p className="text-base text-stone-600 leading-relaxed mb-6 max-w-4xl">
        Pilih kategori nugas sesuai gaya belajarmu untuk melihat rincian spesifikasi fasilitas dan rekomendasi klaster lokasinya:
      </p>

      {/* Vibe Selector Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {STUDY_VIBES.map((vibe) => {
          const IconComp = vibe.icon;
          const isActive = activeVibe === vibe.id;
          return (
            <button
              key={vibe.id}
              type="button"
              onClick={() => setActiveVibe(vibe.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-4 cursor-pointer ${
                isActive
                  ? 'bg-white border-[#005B54] shadow-md'
                  : 'bg-stone-50 border-stone-200 hover:bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isActive
                      ? 'bg-[#005B54] text-white'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  <IconComp size={20} weight="duotone" />
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${vibe.badgeColor}`}
                >
                  {vibe.badge}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 leading-snug">
                  {vibe.title.split('&')[0]}
                </h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Vibe Detail Card with Spec Chips */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-stone-100">
          <div>
            <span className="text-xs font-bold text-[#005B54] uppercase tracking-wider block">
              Profil Ruang Belajar
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              {currentVibe.title}
            </h3>
          </div>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${currentVibe.badgeColor} self-start sm:self-auto`}
          >
            {currentVibe.badge}
          </span>
        </div>

        <p className="text-base text-stone-600 leading-relaxed mb-8">
          {currentVibe.tagline}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Spec Chips Grid */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-stone-400 block pb-1 border-b border-stone-100">
              Spesifikasi &amp; Tolok Ukur Fasilitas
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentVibe.specs.map((spec, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-stone-50 border border-stone-200"
                >
                  <span className="text-xs font-semibold text-stone-500 block mb-1">
                    {spec.label}
                  </span>
                  <span className="text-sm font-black text-stone-900 block mb-1">
                    {spec.level}
                  </span>
                  <span className="text-xs text-stone-500 block">
                    {spec.desc}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-[#005B54] mt-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 block mb-1">
                Paling Pas Untuk:
              </span>
              <p className="text-sm font-bold text-emerald-950">
                {currentVibe.idealFor}
              </p>
            </div>
          </div>

          {/* Right Column: Features Checklist & Spots */}
          <div className="lg:col-span-6 space-y-5 text-sm">
            <div className="p-5 rounded-2xl bg-white border border-stone-200">
              <h4 className="text-xs uppercase font-extrabold text-stone-400 mb-3 tracking-wider">
                Ciri Utama &amp; Fasilitas
              </h4>
              <ul className="space-y-3">
                {currentVibe.features.map((feat, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-stone-700 font-medium"
                  >
                    <CheckCircleIcon size={16} weight="fill" className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-stone-500">
                Rekomendasi Klaster:
              </span>
              {currentVibe.spots.map((spot) => (
                <span
                  key={spot}
                  className="px-3 py-1 bg-white border border-stone-200 rounded-lg font-bold text-stone-800 text-xs shadow-2xs"
                >
                  📍 {spot}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
