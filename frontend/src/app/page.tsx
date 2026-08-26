'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { MapComponent } from '@/components/MapComponent';
import { FilterToolbar } from '@/components/FilterToolbar';
import { PlaceCard } from '@/components/PlaceCard';
import { PlaceDetailModal } from '@/components/PlaceDetailModal';
import { RecommendationModal } from '@/components/RecommendationModal';
import { ContributeModal } from '@/components/ContributeModal';
import { apiService } from '@/services/api';
import { FilterState, GeoJsonFeatureCollection } from '@/types/place';
import {
  Wifi,
  Clock,
  DollarSign,
  AlertCircle,
  MapPin,
  Radio,
  X,
} from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  search: '',
  subdistrict: '',
  category: '',
  price_tier: '',
  max_price: '',
  min_wifi: '',
  plug_availability: '',
  noise_level: '',
  is_24_hours: false,
  has_student_discount: false,
  min_nugas_score: '',
  sort_by: 'nugas_score',
};

// Haversine formula to calculate distance in KM
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export default function Home() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [data, setData] = useState<GeoJsonFeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [detailSlug, setDetailSlug] = useState<string | null>(null);
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);
  const [isContributeOpen, setIsContributeOpen] = useState(false);

  // Geolocation & Nearby States
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isNearbyActive, setIsNearbyActive] = useState(false);
  const [maxRadiusFilter, setMaxRadiusFilter] = useState<number | null>(null);

  // Load places whenever filters change
  useEffect(() => {
    setLoading(true);
    apiService.getPlaces(filters).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [filters]);

  // Request browser geolocation for nearby spots
  const handleGetNearby = () => {
    if (!navigator.geolocation) {
      setLocationError('Maaf lokasi kamu tidak bisa diakses');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setUserLocation({ lat: userLat, lng: userLng });
        setIsNearbyActive(true);
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);
        setLocationError('Maaf lokasi kamu tidak bisa diakses');
        setTimeout(() => setLocationError(null), 5000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleResetNearby = () => {
    setUserLocation(null);
    setIsNearbyActive(false);
    setMaxRadiusFilter(null);
  };

  // Compute distances & sort if nearby is active
  const places = useMemo(() => {
    if (!data?.features) return [];

    let list = data.features.map((feature) => {
      if (userLocation) {
        const [lng, lat] = feature.geometry.coordinates;
        const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, lat, lng);
        return {
          ...feature,
          properties: {
            ...feature.properties,
            distance_km: dist,
          },
        };
      }
      return feature;
    });

    // Filter by maxRadius if set
    if (isNearbyActive && maxRadiusFilter !== null) {
      list = list.filter((p) => (p.properties.distance_km ?? 999) <= maxRadiusFilter);
    }

    if (isNearbyActive && userLocation) {
      list.sort((a, b) => (a.properties.distance_km ?? 999) - (b.properties.distance_km ?? 999));
    }

    return list;
  }, [data, userLocation, isNearbyActive, maxRadiusFilter]);

  // Aggregate Stats
  const stats = useMemo(() => {
    if (places.length === 0) return { count: 0, avgWifi: 0, count24h: 0, minPrice: 0 };
    const avgWifi = Math.round(
      places.reduce((acc, p) => acc + p.properties.wifi_speed_mbps, 0) / places.length
    );
    const count24h = places.filter((p) => p.properties.is_24_hours).length;
    const minPrice = Math.min(...places.map((p) => p.properties.price_min_drink));
    return { count: places.length, avgWifi, count24h, minPrice };
  }, [places]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        searchQuery={filters.search}
        onSearchChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
        onOpenRecommend={() => setIsRecommendOpen(true)}
        onOpenContribute={() => setIsContributeOpen(true)}
      />

      <main className="flex-1 flex flex-col gap-4 sm:gap-6 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:px-8">
        {/* Location Error Notification Toast */}
        {locationError && (
          <div className="w-full bg-red-950/90 border border-red-800 text-red-200 px-4 py-2.5 rounded-xl flex items-center justify-between gap-3 text-xs animate-fade-in shadow-xl">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{locationError}</span>
            </div>
            <button
              onClick={() => setLocationError(null)}
              className="p-1 hover:bg-red-900 rounded-lg text-red-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Nearby Active Mode Banner */}
        {isNearbyActive && userLocation && (
          <div className="w-full bg-sky-950/80 border border-sky-800 text-sky-200 px-3.5 sm:px-4 py-2.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs animate-fade-in shadow-xl">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-sky-400 shrink-0 animate-pulse" />
              <span className="font-medium">
                Radar Terdekat Aktif: Menampilkan {places.length} spot terdekat dari posisi koordinat Anda
              </span>
            </div>
            <button
              onClick={handleResetNearby}
              className="px-3 py-1 bg-sky-900 hover:bg-sky-850 text-sky-200 border border-sky-700 rounded-lg text-xs font-syne font-bold self-end sm:self-auto cursor-pointer"
            >
              Reset Jarak
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 1 (TOP): FULL-WIDTH MAPCN DARK WEBGIS CANVAS                     */}
        {/* ========================================================================= */}
        <section className="w-full h-[360px] sm:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden border border-zinc-850 bg-zinc-950 shadow-2xl relative">
          <MapComponent
            places={places}
            selectedPlaceId={selectedPlaceId}
            onSelectPlace={(id) => setSelectedPlaceId(id)}
            onOpenDetail={(slug) => setDetailSlug(slug)}
            activeSubdistrict={filters.subdistrict}
            onSelectSubdistrict={(sub) => setFilters((prev) => ({ ...prev, subdistrict: sub }))}
            userLocation={userLocation}
            onTriggerNearby={handleGetNearby}
            isLocating={isLocating}
            maxRadiusFilter={maxRadiusFilter}
          />
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2 (STATS STRIP): REFINED SLEEK HORIZONTAL METRICS                 */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="bg-zinc-950 border border-zinc-850 p-3 sm:p-3.5 rounded-xl flex items-center gap-3 shadow-md">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-medium tracking-wide block">Spot Terdata</span>
              <span className="text-sm sm:text-base font-syne font-bold text-white">{stats.count} Lokasi</span>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-850 p-3 sm:p-3.5 rounded-xl flex items-center gap-3 shadow-md">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-medium tracking-wide block">Rata-rata Wi-Fi</span>
              <span className="text-sm sm:text-base font-syne font-bold text-sky-400">{stats.avgWifi} Mbps</span>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-850 p-3 sm:p-3.5 rounded-xl flex items-center gap-3 shadow-md">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-medium tracking-wide block">Buka 24 Jam</span>
              <span className="text-sm sm:text-base font-syne font-bold text-purple-400">{stats.count24h} Tempat</span>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-850 p-3 sm:p-3.5 rounded-xl flex items-center gap-3 shadow-md">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-medium tracking-wide block">Kopi Termurah</span>
              <span className="text-sm sm:text-base font-syne font-bold text-emerald-400">
                Rp {(stats.minPrice / 1000).toFixed(0)}k
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3 (CONTROLS): HORIZONTAL MODERN FILTER TOOLBAR                    */}
        {/* ========================================================================= */}
        <section className="w-full">
          <FilterToolbar
            filters={filters}
            onFilterChange={setFilters}
            onReset={() => setFilters(INITIAL_FILTERS)}
            resultCount={places.length}
            maxRadius={maxRadiusFilter}
            onSelectRadius={setMaxRadiusFilter}
            isNearbyActive={isNearbyActive}
          />
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4 (BOTTOM): RESULTS GRID (RESPONSIVE 1-3 COLUMNS)                 */}
        {/* ========================================================================= */}
        <section className="w-full pb-16">
          <div className="flex items-center justify-between mb-3 px-0.5">
            <div className="flex items-center gap-2">
              <h2 className="font-syne font-bold text-white text-sm sm:text-base tracking-tight">
                {isNearbyActive ? 'Spot Terdekat Dari Posisi Anda' : 'Daftar Tempat Nugas Terpilih'}
              </h2>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-400 font-syne font-bold text-xs">{places.length} Hasil</span>
            </div>
            {filters.subdistrict && (
              <span className="text-zinc-400 text-xs hidden sm:inline">Kecamatan: {filters.subdistrict}</span>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center text-zinc-500 text-xs bg-zinc-950 rounded-2xl border border-zinc-850">
              Memperbarui data spasial...
            </div>
          ) : places.length === 0 ? (
            <div className="py-16 px-4 text-center bg-zinc-950 rounded-2xl border border-zinc-850 flex flex-col items-center gap-3">
              <AlertCircle className="w-8 h-8 text-amber-400" />
              <h4 className="font-syne font-bold text-sm text-white">Tidak Ada Tempat Ditemukan</h4>
              <p className="text-xs text-zinc-400 max-w-sm">
                Tidak ada coffee shop atau warkop yang cocok dengan kombinasi filter saat ini.
              </p>
              <button
                onClick={() => {
                  setFilters(INITIAL_FILTERS);
                  setMaxRadiusFilter(null);
                }}
                className="mt-2 text-xs font-syne font-bold text-emerald-400 hover:underline cursor-pointer"
              >
                Reset Semua Kriteria Filter &rarr;
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {places.map((feature) => (
                <PlaceCard
                  key={feature.id}
                  place={feature.properties}
                  isSelected={selectedPlaceId === feature.id}
                  onSelect={() => {
                    setSelectedPlaceId(feature.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenDetail={() => setDetailSlug(feature.properties.slug)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Place Detail Modal */}
      <PlaceDetailModal slug={detailSlug} onClose={() => setDetailSlug(null)} />

      {/* AI Recommendation Modal */}
      <RecommendationModal
        isOpen={isRecommendOpen}
        onClose={() => setIsRecommendOpen(false)}
        places={places}
        onSelectPlace={(id) => {
          setSelectedPlaceId(id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDetail={(slug) => setDetailSlug(slug)}
      />

      {/* Community Contribution Modal */}
      <ContributeModal isOpen={isContributeOpen} onClose={() => setIsContributeOpen(false)} />
    </div>
  );
}
