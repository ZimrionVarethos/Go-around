'use client';

import React, { useState } from 'react';
import { GeoJsonFeature, RecommendationWeights } from '@/types/place';
import { apiService } from '@/services/api';
import { Sparkles, X, DollarSign, Wifi, Zap, Volume2, ArrowRight } from 'lucide-react';

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  places: GeoJsonFeature[];
  onSelectPlace: (id: number) => void;
  onOpenDetail: (slug: string) => void;
}

export const RecommendationModal: React.FC<RecommendationModalProps> = ({
  isOpen,
  onClose,
  places,
  onSelectPlace,
  onOpenDetail,
}) => {
  const [weights, setWeights] = useState<RecommendationWeights>({
    w_budget: 0.35,
    w_wifi: 0.25,
    w_plug: 0.25,
    w_quiet: 0.15,
  });

  if (!isOpen) return null;

  const applyPreset = (preset: 'skripsi' | 'hemat' | 'kelompok') => {
    if (preset === 'skripsi') {
      setWeights({ w_budget: 0.15, w_wifi: 0.35, w_plug: 0.25, w_quiet: 0.25 });
    } else if (preset === 'hemat') {
      setWeights({ w_budget: 0.55, w_wifi: 0.15, w_plug: 0.20, w_quiet: 0.10 });
    } else if (preset === 'kelompok') {
      setWeights({ w_budget: 0.25, w_wifi: 0.30, w_plug: 0.35, w_quiet: 0.10 });
    }
  };

  const ranked = apiService.calculateRecommendations(places, weights).slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in font-mono">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden text-zinc-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">AI Nugas Scorer</h3>
              <p className="text-[11px] text-zinc-500">Kalkulasi terbobot preferensi belajar mahasiswa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-5 flex-1 text-xs">
          {/* Presets */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-zinc-400 text-[11px] uppercase tracking-wider">Skenario Rekomendasi Cepat:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => applyPreset('skripsi')}
                className="px-3 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-left transition-colors cursor-pointer"
              >
                <span className="font-bold text-zinc-200 block text-xs">Fokus Skripsi</span>
                <span className="text-[10px] text-zinc-500">Wi-Fi + Hening</span>
              </button>
              <button
                onClick={() => applyPreset('hemat')}
                className="px-3 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-left transition-colors cursor-pointer"
              >
                <span className="font-bold text-zinc-200 block text-xs">Budget Hemat</span>
                <span className="text-[10px] text-zinc-500">Akhir Bulan</span>
              </button>
              <button
                onClick={() => applyPreset('kelompok')}
                className="px-3 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-left transition-colors cursor-pointer"
              >
                <span className="font-bold text-zinc-200 block text-xs">Nugas Bareng</span>
                <span className="text-[10px] text-zinc-500">Colokan + Meja</span>
              </button>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 bg-zinc-900/60 p-4 rounded-xl border border-zinc-850">
            {/* 1. Budget */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Prioritas Harga Murah
                </span>
                <span className="font-bold text-emerald-400">{Math.round(weights.w_budget * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.w_budget}
                onChange={(e) => setWeights({ ...weights, w_budget: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* 2. Wi-Fi */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                  <Wifi className="w-3.5 h-3.5 text-sky-400" />
                  Prioritas Kecepatan Wi-Fi
                </span>
                <span className="font-bold text-sky-400">{Math.round(weights.w_wifi * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.w_wifi}
                onChange={(e) => setWeights({ ...weights, w_wifi: parseFloat(e.target.value) })}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            {/* 3. Plug */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Prioritas Ketersediaan Colokan
                </span>
                <span className="font-bold text-amber-400">{Math.round(weights.w_plug * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.w_plug}
                onChange={(e) => setWeights({ ...weights, w_plug: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* 4. Quiet */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                  <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                  Prioritas Keheningan Suasana
                </span>
                <span className="font-bold text-purple-400">{Math.round(weights.w_quiet * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.w_quiet}
                onChange={(e) => setWeights({ ...weights, w_quiet: parseFloat(e.target.value) })}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Ranked List */}
          <div className="space-y-2">
            <h4 className="font-bold text-zinc-300 text-xs uppercase tracking-wider">Peringkat Spot Paling Sesuai:</h4>
            <div className="space-y-2">
              {ranked.map((feature, idx) => {
                const p = feature.properties;
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/60 transition-all cursor-pointer"
                    onClick={() => {
                      onSelectPlace(p.id);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-300">
                        {idx + 1}
                      </span>
                      <div>
                        <h5 className="font-bold text-white text-xs">{p.name}</h5>
                        <p className="text-[10px] text-zinc-500">
                          {p.subdistrict} • Wi-Fi {p.wifi_speed_mbps} Mbps • Mulai Rp{(p.price_min_drink / 1000).toFixed(0)}k
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-[9px] text-zinc-500 block uppercase">Kecocokan</span>
                        <span className="text-xs font-bold text-emerald-400">
                          {p.custom_recommendation_score}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDetail(p.slug);
                          onClose();
                        }}
                        className="p-1 text-zinc-400 hover:text-white"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
