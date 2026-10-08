'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeftIcon,
  MapPinIcon,
  WifiHighIcon,
  PlugChargingIcon,
  SpeakerSimpleLowIcon,
  CurrencyDollarIcon,
  ArrowSquareOutIcon,
  ArrowRightIcon,
  GlobeHemisphereWestIcon,
  CaretRightIcon,
  BusIcon,
  PlusCircleIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react';
import { PublicFooter } from '@/components/layout/PublicFooter';
import {
  FACILITY_TIERS,
  STUDY_VIBES,
  DISTRICT_RANKINGS,
} from '@/components/research/research-data';

export default function TentangRisetPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA] text-slate-800 flex flex-col font-sans selection:bg-[#005B54]/15 selection:text-[#005B54]">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-bold text-stone-700 hover:text-[#005B54] bg-white hover:bg-stone-100 rounded-xl border border-stone-200 transition-all shadow-2xs shrink-0"
            >
              <ArrowLeftIcon size={16} weight="bold" />
              <span>Kembali ke Peta</span>
            </Link>
            <span className="text-stone-300 hidden sm:inline">/</span>
            <span className="text-sm font-semibold text-stone-600 hidden sm:inline">
              Cerita di Balik Go-around
            </span>
          </div>
        </div>
      </header>

      {/* ── Main Storyline Container ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex-1 w-full space-y-16 sm:space-y-20">
        {/* ── HERO: PEMBUKA CERITA ── */}
        <section className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#005B54]/10 border border-[#005B54]/20 text-[#005B54] text-xs sm:text-sm font-bold">
            <GlobeHemisphereWestIcon size={16} weight="duotone" />
            <span>Cerita Riset WebGIS Go-around</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-[1.15]">
            Dari Bingung Cari Colokan, Jadi Peta Nugas Mahasiswa Bogor.
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            Kami memetakan <strong className="text-[#005B54]">150+ kafe dan ruang belajar</strong> di 6 Kecamatan Kota Bogor agar mahasiswa tidak lagi salah pilih tempat saat mengejar deadline.
          </p>

          {/* Compact 3-Stat Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-center">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-black text-[#005B54]">150+</div>
              <p className="text-xs text-stone-500 font-semibold mt-0.5">Titik Kafe &amp; Ruang Belajar</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-black text-stone-900">6</div>
              <p className="text-xs text-stone-500 font-semibold mt-0.5">Kecamatan Kota Bogor</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-black text-[#005B54]">4</div>
              <p className="text-xs text-stone-500 font-semibold mt-0.5">Indikator Fasilitas Nugas</p>
            </div>
          </div>
        </section>

        {/* ── BAB 1: MASALAHNYA (THE PROBLEM & 4 PARAMETERS) ── */}
        <section className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center bg-white rounded-3xl border border-stone-200 p-5 sm:p-8 shadow-xs">
            {/* Illustration — Natural 4:3 aspect ratio so nothing gets cropped */}
            <div className="lg:col-span-5">
              <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200/80 bg-[#F5F2EB] shadow-2xs">
                <Image
                  src="/assets/story-problem.webp"
                  alt="Mahasiswa kesulitan mencari colokan laptop di kafe"
                  width={960}
                  height={717}
                  className="w-full h-auto block object-contain"
                  priority
                />
              </div>
            </div>

            {/* Narrative */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  Bab 01 &bull; Masalah Klasik Mahasiswa
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
                Rating Bintang 5 di Peta Belum Tentu Enak Buat Laptopan.
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Peta konvensional hanya memberi tahu rasa kopi, bukan apakah ada stopkontak di dekat meja atau Wi-Fi yang kuat untuk Zoom. Karena itu, Go-around mengukur <strong>4 parameter fasilitas riil</strong>:
              </p>

              {/* 4 Compact Parameter Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
                  <PlugChargingIcon size={24} weight="duotone" className="text-[#005B54] shrink-0" />
                  <h3 className="text-sm font-bold text-stone-900">Ketersediaan Colokan</h3>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
                  <WifiHighIcon size={24} weight="bold" className="text-[#005B54] shrink-0" />
                  <h3 className="text-sm font-bold text-stone-900">Kecepatan Wi-Fi</h3>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
                  <SpeakerSimpleLowIcon size={24} weight="duotone" className="text-[#005B54] shrink-0" />
                  <h3 className="text-sm font-bold text-stone-900">Akustik Ruangan</h3>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
                  <CurrencyDollarIcon size={24} weight="bold" className="text-[#005B54] shrink-0" />
                  <h3 className="text-sm font-bold text-stone-900">Bujet Mahasiswa</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BAB 2: SOLUSI & 4 GAYA NUGAS (STUDY VIBES) ── */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center bg-white rounded-3xl border border-stone-200 p-5 sm:p-8 shadow-xs">
            {/* Narrative & 4 Vibes */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
                4 Karakteristik Tempat Sesuai Target Tugasmu.
              </h2>
              

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {STUDY_VIBES.map((vibe) => {
                  const IconComp = vibe.icon;
                  return (
                    <div
                      key={vibe.id}
                      className="p-4 rounded-2xl bg-stone-50 border border-stone-200"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <IconComp size={20} weight="duotone" className="text-[#005B54] shrink-0" />
                        <h3 className="text-sm font-bold text-stone-900">
                          {vibe.title.split('(')[0].trim()}
                        </h3>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {vibe.tagline}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Illustration — Natural 4:3 aspect ratio so nothing gets cropped */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#005B54] bg-teal-50 border border-[#005B54] px-3 py-1 rounded-full self-start">
                Bab 02 &bull; Solusi Klasifikasi Ruang
              </span>
              <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200/80 bg-[#F7F6F2] shadow-2xs">
                <Image
                  src="/assets/story-solution.webp"
                  alt="Mahasiswa nyaman mengerjakan tugas bersama di kafe Kota Bogor"
                  width={960}
                  height={717}
                  className="w-full h-auto block object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── BAB 3: PETA SEBARAN 6 KECAMATAN KOTA BOGOR ── */}
        <section className="space-y-5">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#005B54] bg-teal-50 border border-[#005B54] px-3 py-1 rounded-full mb-1">
              Bab 03 &bull; Area Jelajah
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Mau Nugas Dekat Kosan atau Sekitar Kampus? Semua Terjangkau.
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              Tersebar merata di 6 kecamatan Kota Bogor, tinggal pilih area terdekatmu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DISTRICT_RANKINGS.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#005B54]/10 text-[#005B54] flex items-center justify-center shrink-0">
                      <MapPinIcon size={16} weight="duotone" />
                    </span>
                    <h3 className="text-lg font-extrabold text-stone-900">
                      Kec. {d.name}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-2.5">
                    {d.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100">
                  <div className="flex flex-wrap gap-1.5">
                    {d.hotspots.map((h) => (
                      <span
                        key={h}
                        className="text-[11px] font-semibold px-2.5 py-0.5 bg-stone-100 text-stone-700 rounded-md"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BAB 4: GERAKAN MAHASISWA & KOLOFON RISET ── */}
        <section className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-8 shadow-xs space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-5">
              <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200/80 bg-[#F7F6F2] shadow-2xs">
                <Image
                  src="/assets/story-contribution.webp"
                  alt="Mahasiswa berkontribusi menambahkan tempat nugas dan melaporkan fasilitas kafe di Kota Bogor"
                  width={960}
                  height={717}
                  className="w-full h-auto block object-contain"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-[#005B54] px-3 py-1 rounded-full">
                Bab 04 &bull; Hidup dari Kontribusi Mahasiswa
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Data Selalu Update Berkat Laporan Sesama Mahasiswa.
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Colokan rusak, password Wi-Fi ganti, atau ada hidden gem baru di dekat kampus? Kamu bisa ikut memperbarui peta ini kapan saja:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <Link
                  href="/tambah-tempat"
                  className="p-4 rounded-2xl bg-stone-50 hover:bg-teal-50/60 border border-stone-200 hover:border-[#005B54] transition-all group flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <PlusCircleIcon size={24} weight="duotone" className="text-[#005B54] shrink-0" />
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#005B54]">
                        Tambah Tempat Baru
                      </h3>
                      <p className="text-xs text-stone-500">Daftarkan spot nugas favoritmu</p>
                    </div>
                  </div>
                  <CaretRightIcon size={16} weight="bold" className="text-stone-400 group-hover:text-[#005B54]" />
                </Link>

                <Link
                  href="/lapor-fasilitas"
                  className="p-4 rounded-2xl bg-stone-50 hover:bg-teal-50/60 border border-stone-200 hover:border-[#005B54] transition-all group flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <WarningCircleIcon size={24} weight="duotone" className="text-amber-600 shrink-0" />
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#005B54]">
                        Lapor Kondisi Fasilitas
                      </h3>
                      <p className="text-xs text-stone-500">Update Wi-Fi, colokan, atau jam buka</p>
                    </div>
                  </div>
                  <CaretRightIcon size={16} weight="bold" className="text-stone-400 group-hover:text-[#005B54]" />
                </Link>
              </div>
            </div>
          </div>

          {/* Compact Academic Colophon Strip */}
          <div className="pt-6 border-t border-stone-100 text-xs sm:text-sm text-stone-500 text-center">
            Go-around disusun oleh mahasiswa <strong className="text-stone-800">Sekolah Vokasi IPB University</strong> sebagai proyek pemetaan lapangan mata kuliah Sistem Informasi Geografis (2026).
          </div>
        </section>

        {/* ── CALL TO ACTION SECTION ── */}
        <section className="bg-gradient-to-r from-[#005B54] to-[#004741] text-white rounded-3xl p-6 sm:p-9 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">
              Siap Cari Tempat Nugas Sekarang?
            </h3>
            <p className="text-emerald-100 text-sm">
              Temukan kafe dengan colokan banyak, Wi-Fi kencang, dan harga ramah mahasiswa di sekitarmu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center shrink-0">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#005B54] hover:bg-stone-100 text-sm font-black transition-all shadow-md"
            >
              <span>Buka Peta WebGIS</span>
              <ArrowRightIcon size={16} weight="bold" />
            </Link>
          </div>
        </section>
      </main>

      {/* Global Public Footer */}
      <PublicFooter />
    </div>
  );
}
