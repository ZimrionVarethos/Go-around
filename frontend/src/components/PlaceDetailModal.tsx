'use client';

import React, { useEffect, useState } from 'react';
import { PlaceDetailData } from '@/types/place';
import { apiService } from '@/services/api';
import {
  X,
  Navigation,
  ExternalLink,
  Wifi,
  Zap,
  Volume2,
  Clock,
  MapPin,
  CheckCircle2,
  Star,
  DollarSign,
} from 'lucide-react';

interface PlaceDetailModalProps {
  slug: string | null;
  onClose: () => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({ slug, onClose }) => {
  const [data, setData] = useState<PlaceDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    apiService.getPlaceDetail(slug).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [slug]);

  if (!slug) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-zinc-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/90 shrink-0">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
              {data?.location.subdistrict || 'Kota Bogor'}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400">{data?.category?.name || 'Workspace'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 font-sans">
          {loading ? (
            <div className="py-20 text-center text-zinc-500 font-mono text-xs">
              Memuat detail lengkap data spasial...
            </div>
          ) : data ? (
            <>
              {/* Title & Description */}
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">{data.name}</h2>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{data.location.address}</span>
                </div>
                {data.description && (
                  <p className="text-xs text-zinc-300 mt-3 leading-relaxed bg-zinc-900/60 p-3 rounded-lg border border-zinc-850">
                    {data.description}
                  </p>
                )}
              </div>

              {/* Score HUD Cards */}
              <div className="grid grid-cols-3 gap-3 font-mono">
                <div className="bg-zinc-900 border border-emerald-500/40 rounded-xl p-3 text-center">
                  <span className="text-[10px] text-zinc-400 font-semibold block uppercase tracking-wider">Skor Nugas</span>
                  <span className="text-2xl font-bold text-emerald-400">
                    {data.nugas_metrics.nugas_score.toFixed(1)}
                  </span>
                  <span className="text-[9px] text-zinc-500 block mt-0.5">Agregat Kelayakan</span>
                </div>

                <div className="bg-zinc-900 border border-cyan-500/40 rounded-xl p-3 text-center">
                  <span className="text-[10px] text-zinc-400 font-semibold block uppercase tracking-wider">Skor Fasilitas</span>
                  <span className="text-2xl font-bold text-cyan-400">
                    {data.nugas_metrics.facility_score.toFixed(1)}
                  </span>
                  <span className="text-[9px] text-zinc-500 block mt-0.5">Wi-Fi & Colokan</span>
                </div>

                <div className="bg-zinc-900 border border-amber-500/40 rounded-xl p-3 text-center">
                  <span className="text-[10px] text-zinc-400 font-semibold block uppercase tracking-wider">Skor Budget</span>
                  <span className="text-2xl font-bold text-amber-400">
                    {data.nugas_metrics.budget_score.toFixed(1)}
                  </span>
                  <span className="text-[9px] text-zinc-500 block mt-0.5">Ramah Kantong</span>
                </div>
              </div>

              {/* Key Specifications Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="flex items-center gap-3 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Koneksi Internet</span>
                    <span className="font-bold text-white text-xs">
                      {data.nugas_metrics.wifi_speed_mbps} Mbps ({data.nugas_metrics.wifi_quality})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Colokan Listrik</span>
                    <span className="font-bold text-white text-xs">
                      {data.nugas_metrics.plug_label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Harga Minuman</span>
                    <span className="font-bold text-white text-xs">
                      Rp {data.economics.price_min_drink.toLocaleString('id-ID')} - {data.economics.price_max_drink.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Jam Operasional</span>
                    <span className="font-bold text-white text-xs">
                      {data.operational.formatted_hours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amenities Tags */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Fasilitas Terverifikasi
                </h4>
                <div className="flex flex-wrap gap-2 font-mono">
                  {data.amenities.map((a) => (
                    <span
                      key={a.id}
                      className="flex items-center gap-1.5 text-xs bg-zinc-900 text-zinc-300 px-2.5 py-1 rounded-lg border border-zinc-800"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{a.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Reviews Summary */}
              {data.reviews_summary.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Ulasan & Kata Kunci Mahasiswa
                  </h4>
                  <div className="space-y-2">
                    {data.reviews_summary.map((rev) => (
                      <div key={rev.id} className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850 text-xs">
                        <div className="flex items-center justify-between text-zinc-400 mb-1 font-mono">
                          <span className="font-semibold text-zinc-200">{rev.reviewer_name}</span>
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{rev.rating}</span>
                          </div>
                        </div>
                        <p className="text-zinc-300 leading-relaxed font-sans">{rev.comment}</p>
                        {rev.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2 font-mono">
                            {rev.keywords.map((kw) => (
                              <span
                                key={kw}
                                className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-750"
                              >
                                #{kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer Actions */}
        {data && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3 shrink-0 font-mono">
            <a
              href={data.location.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-zinc-900 border border-zinc-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka Google Maps</span>
            </a>

            <a
              href={data.location.navigation_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-lg transition-colors shadow-lg shadow-emerald-950/30"
            >
              <Navigation className="w-4 h-4" />
              <span>Buka Rute Navigasi</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
