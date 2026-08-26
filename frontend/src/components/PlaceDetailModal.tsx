'use client';

import React, { useEffect, useState } from 'react';
import { PlaceDetailData } from '@/types/place';
import { apiService } from '@/services/api';
import {
  X,
  Wifi,
  Zap,
  Clock,
  DollarSign,
  MapPin,
  Star,
  Navigation,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface PlaceDetailModalProps {
  slug: string | null;
  onClose: () => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({ slug, onClose }) => {
  const [place, setPlace] = useState<PlaceDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) {
      setPlace(null);
      return;
    }

    setLoading(true);
    apiService.getPlaceDetail(slug).then((res) => {
      setPlace(res);
      setLoading(false);
    });
  }, [slug]);

  if (!slug) return null;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div
        className="bg-zinc-950 border border-zinc-850 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl text-zinc-100 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-md px-5 py-4 border-b border-zinc-850 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-syne font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg">
              {place?.location?.subdistrict || 'Kota Bogor'}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400 truncate">{place?.category?.name || 'Tempat Nugas'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              title="Salin tautan"
              className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 rounded-xl border border-zinc-800 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 rounded-xl border border-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col gap-5">
          {loading || !place ? (
            <div className="py-20 text-center text-zinc-500 font-sans text-xs">
              Memuat detail tempat...
            </div>
          ) : (
            <>
              {/* Title & Score Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-syne font-extrabold text-xl sm:text-2xl text-white">
                    {place.name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{place.location?.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 bg-zinc-900 px-3.5 py-2 rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                    <span className="font-syne font-extrabold text-base">
                      {place.nugas_metrics?.nugas_score.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase font-syne font-bold">Skor Nugas</span>
                </div>
              </div>

              {/* Description */}
              {place.description && (
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-zinc-850">
                  {place.description}
                </p>
              )}

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850 flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-syne font-bold flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-sky-400" />
                    <span>Wi-Fi</span>
                  </span>
                  <span className="text-sm font-bold text-white">
                    {place.nugas_metrics?.wifi_speed_mbps} Mbps
                  </span>
                </div>

                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850 flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-syne font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Colokan</span>
                  </span>
                  <span className="text-sm font-bold text-white truncate">
                    {place.nugas_metrics?.plug_label || 'Tersedia'}
                  </span>
                </div>

                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850 flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-syne font-bold flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-emerald-400" />
                    <span>Harga Kopi</span>
                  </span>
                  <span className="text-sm font-bold text-emerald-400">
                    Rp {((place.economics?.price_min_drink || 0) / 1000).toFixed(0)}k
                  </span>
                </div>

                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850 flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-syne font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-400" />
                    <span>Operasional</span>
                  </span>
                  <span className="text-sm font-bold text-white truncate">
                    {place.operational?.is_24_hours
                      ? '24 Jam Nonstop'
                      : place.operational?.formatted_hours || 'Reguler'}
                  </span>
                </div>
              </div>

              {/* Amenities Tags */}
              {place.amenities && place.amenities.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-syne font-bold uppercase tracking-wider text-zinc-400">
                    Fasilitas Terverifikasi
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {place.amenities.map((amenity) => (
                      <span
                        key={amenity.id}
                        className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{amenity.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              {place.reviews_summary && place.reviews_summary.length > 0 && (
                <div className="flex flex-col gap-2.5 pt-2 border-t border-zinc-900">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-syne font-bold uppercase tracking-wider text-zinc-400">
                      Ulasan Mahasiswa
                    </span>
                    <span className="text-xs text-zinc-500">
                      Google Rating {place.ratings?.google_rating} ({place.ratings?.total_google_reviews || 500}+ review)
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {place.reviews_summary.slice(0, 2).map((rev) => (
                      <div key={rev.id} className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-850 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-zinc-200">{rev.reviewer_name}</span>
                          <div className="flex items-center gap-1 text-amber-400 text-[11px]">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{rev.rating}</span>
                          </div>
                        </div>
                        <p className="text-zinc-400 leading-relaxed italic">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sticky Action Footer */}
        {place && (
          <div className="sticky bottom-0 bg-zinc-950/95 backdrop-blur-md px-5 py-3.5 border-t border-zinc-850 flex items-center justify-between gap-3">
            {copied ? (
              <span className="text-xs text-emerald-400 font-medium">Tautan tersalin ke clipboard!</span>
            ) : (
              <span className="text-xs text-zinc-500 font-sans">
                {place.location?.subdistrict}, Kota Bogor
              </span>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-syne font-semibold bg-zinc-900 hover:bg-zinc-850 text-zinc-300 rounded-xl border border-zinc-800 transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <a
                href={place.location?.navigation_url || place.location?.google_maps_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-syne font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl transition-all shadow-md shadow-emerald-950/20"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Rute Navigasi</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
