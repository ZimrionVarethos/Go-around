'use client';

import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';
import { FilterBar } from '@/components/places/FilterBar';
import { PlaceDetailDrawer } from '@/components/places/PlaceDetailDrawer';
import { MapControls, MapLegend, type TileLayerType, type SpatialOverlays, DEFAULT_SPATIAL_OVERLAYS } from './MapControls';
import { RecommendationPanel } from '@/components/places/RecommendationPanel';
import { usePlaces, useBboxPlaces } from '@/hooks/usePlacesQuery';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';
import type { PlaceFilters, BboxParams, PlaceGeoJsonFeature } from '@/lib/types';
import { FIGMA_PLACES } from '@/lib/figma-places';
import { cn } from '@/lib/cn';
import type L from 'leaflet';

// Dynamic import for Leaflet MapView (client-only, SSR false)
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#F6F4ED] flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 rounded-full border-3 border-[#005B54] border-t-transparent animate-spin" />
      <span className="text-xs font-semibold text-slate-700">Memuat Peta Spasial Bogor...</span>
    </div>
  ),
});

// Haversine formula to calculate real-world distance in km
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// Centered on Baranangsiang / IPB University district
const BOGOR_CENTER: [number, number] = [-6.601, 106.806];

export function MapPage() {
  // Default: clean map without auto-opened drawer, collapsed left panel pill
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [sortTab, setSortTab] = useState<'score' | 'nearby' | 'budget'>('score');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showLegend, setShowLegend] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [tileLayer, setTileLayer] = useState<TileLayerType>('osm');
  const [spatialOverlays, setSpatialOverlays] = useState<SpatialOverlays>(DEFAULT_SPATIAL_OVERLAYS);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { toasts, showToast, dismissToast } = useToast();

  const handleToggleOverlay = (key: keyof SpatialOverlays, label: string) => {
    setSpatialOverlays((prev) => {
      const nextState = !prev[key];
      showToast(
        `Lapisan ${label} ${nextState ? 'diaktifkan' : 'dinonaktifkan'} 🗺️`,
        'info',
        2500
      );
      return { ...prev, [key]: nextState };
    });
  };

  const handleToggleLegend = () => {
    setShowLegend((prev) => {
      const next = !prev;
      showToast(
        next ? 'Menampilkan legenda skor kesesuaian spasial 🗺️' : 'Legenda peta disembunyikan',
        'info',
        2500
      );
      return next;
    });
  };

  const handleSortChange = (newTab: 'score' | 'nearby' | 'budget') => {
    setSortTab(newTab);
    const labels = {
      score: 'Skor Tertinggi ⭐',
      nearby: 'Jarak Terdekat 📍',
      budget: 'Paling Hemat ☕',
    };
    showToast(`Urutan: ${labels[newTab]}`, 'info', 2000);
  };

  const [filters, setFilters] = useState<PlaceFilters>({
    sort_by: 'nugas_score',
    order: 'desc',
  });

  // Default Bogor viewport bounding box
  const [bbox, setBbox] = useState<BboxParams>({
    north: -6.58,
    south: -6.63,
    east: 106.83,
    west: 106.78,
  });

  // Query places list based on active filters
  const queryFilters = useMemo<PlaceFilters>(() => {
    let sort_by: PlaceFilters['sort_by'] = 'nugas_score';
    let order: 'asc' | 'desc' = 'desc';

    if (sortTab === 'score') {
      sort_by = 'nugas_score';
      order = 'desc';
    } else if (sortTab === 'budget') {
      sort_by = 'price_min_drink';
      order = 'asc';
    } else if (sortTab === 'nearby') {
      sort_by = 'facility_score';
      order = 'desc';
    }

    return {
      ...filters,
      sort_by,
      order,
    };
  }, [filters, sortTab]);

  const { data: placesResponse } = usePlaces(queryFilters);
  // Merge Figma showcase places with API places & sort dynamically
  const places = useMemo(() => {
    const apiPlaces = placesResponse?.data ?? [];
    const existingSlugs = new Set(FIGMA_PLACES.map((p) => p.slug));
    const nonDuplicateApiPlaces = apiPlaces.filter((p) => !existingSlugs.has(p.slug));
    const combined = [...FIGMA_PLACES, ...nonDuplicateApiPlaces];

    const refPoint = userLocation ?? BOGOR_CENTER;

    return [...combined].sort((a, b) => {
      if (sortTab === 'score') {
        // Skor Tertinggi: nugas_score descending
        return (b.nugas_score ?? 0) - (a.nugas_score ?? 0);
      }
      if (sortTab === 'budget') {
        // Paling Hemat: harga kopi termurah ascending
        const priceA = a.price_min_drink || 999999;
        const priceB = b.price_min_drink || 999999;
        return priceA - priceB;
      }
      if (sortTab === 'nearby') {
        // Paling Dekat: jarak radius kilometer dari IPB Baranangsiang / GPS
        const distA = getDistanceKm(refPoint[0], refPoint[1], a.latitude, a.longitude);
        const distB = getDistanceKm(refPoint[0], refPoint[1], b.latitude, b.longitude);
        return distA - distB;
      }
      return 0;
    });
  }, [placesResponse?.data, sortTab, userLocation]);

  const totalSpots = placesResponse?.pagination?.total ?? places.length;

  // Query geojson markers in current map viewport
  const { data: bboxResponse } = useBboxPlaces({
    ...bbox,
    ...filters,
  });

  // Map features with fallback to Figma places
  const mapFeatures = useMemo<PlaceGeoJsonFeature[]>(() => {
    const apiMapFeatures = bboxResponse?.features ?? [];
    const defaultFeatures: PlaceGeoJsonFeature[] = FIGMA_PLACES.map((p) => ({
      type: 'Feature',
      id: p.id,
      geometry: {
        type: 'Point',
        coordinates: [p.longitude, p.latitude],
      },
      properties: {
        id: p.id,
        name: p.name,
        slug: p.slug,
        address: p.address,
        subdistrict: p.subdistrict,
        price_min_drink: p.price_min_drink,
        price_max_drink: p.price_max_drink,
        price_avg_food: p.price_avg_food,
        price_tier: p.price_tier,
        wifi_speed_mbps: p.wifi_speed_mbps,
        wifi_quality: p.wifi_quality,
        plug_availability: p.plug_availability,
        noise_level: p.noise_level,
        is_24_hours: p.is_24_hours,
        open_time: p.open_time,
        close_time: p.close_time,
        google_rating: p.google_rating,
        nugas_score: p.nugas_score,
        budget_score: p.budget_score,
        facility_score: p.facility_score,
        image_url: p.image_url,
        vibe_tags: ['Colokan Melimpah', 'WiFi Kencang', 'Kondusif'],
        google_maps_url: p.google_maps_url,
        instagram_handle: p.instagram_handle,
        distance_km: 0.85,
        category: p.category ?? undefined,
        amenities: [],
      },
    }));

    const existingSlugs = new Set(defaultFeatures.map((f) => f.properties.slug));
    const extraFeatures = apiMapFeatures.filter((f) => !existingSlugs.has(f.properties.slug));
    return [...defaultFeatures, ...extraFeatures];
  }, [bboxResponse?.features]);

  // Zoom In
  const handleZoomIn = () => {
    if (mapInstance) {
      mapInstance.zoomIn();
    } else {
      const el = document.querySelector('.leaflet-container');
      const map = (el as unknown as { _leaflet_map?: { zoomIn: () => void } })?._leaflet_map;
      map?.zoomIn();
    }
  };

  // Zoom Out
  const handleZoomOut = () => {
    if (mapInstance) {
      mapInstance.zoomOut();
    } else {
      const el = document.querySelector('.leaflet-container');
      const map = (el as unknown as { _leaflet_map?: { zoomOut: () => void } })?._leaflet_map;
      map?.zoomOut();
    }
  };

  // Reset Compass (Back to North & Bogor Center)
  const handleResetCompass = () => {
    if (mapInstance) {
      mapInstance.flyTo(BOGOR_CENTER, 15, { duration: 1.2 });
    }
    showToast('Peta di-reset ke pandangan utama Bogor (Utara ↑)', 'info', 2500);
  };

  // Geolocation trigger
  const handleLocate = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      showToast('Perangkat tidak mendukung geolokasi GPS', 'error', 3000);
      return;
    }

    showToast('Mencari sinyal GPS Anda... 📡', 'info', 2500);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        if (mapInstance) {
          mapInstance.flyTo(coords, 16, { duration: 1.5 });
        }
        setSortTab('nearby');
        showToast('Lokasi Anda ditemukan! Menampilkan tempat nugas terdekat 📍', 'success', 3500);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        showToast(
          'Izin lokasi tidak diberikan atau GPS belum aktif di perangkat Anda',
          'warning',
          4000
        );
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleDownloadGeoJson = () => {
    const geoJsonData = {
      type: 'FeatureCollection',
      features: mapFeatures,
    };
    const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'go-around-bogor-places.geojson';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Full-Canvas Map in background */}
      <MapView
        features={mapFeatures}
        selectedSlug={selectedSlug}
        onMarkerClick={(slug) => setSelectedSlug(slug)}
        onBoundsChange={(b) => setBbox(b)}
        tileLayer={tileLayer}
        userLocation={userLocation}
        onMapReady={setMapInstance}
        spatialOverlays={spatialOverlays}
      />

      {/* Floating Filter Bar (Below topbar) */}
      <div className="absolute top-[76px] sm:top-[88px] left-0 right-0 sm:left-6 sm:right-auto z-[400] pointer-events-auto px-3 sm:px-0">
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          className="max-w-full"
        />
      </div>

      {/* Floating Left Sidebar Panel ("Rekomendasi Nugas Bogor")
          - Mobile: bottom sheet (bottom-0, left-0, right-0, max-h-[55vh])
          - Desktop: left sidebar as usual */}
      <RecommendationPanel
        isCollapsed={isCollapsed}
        onToggleCollapse={setIsCollapsed}
        sortTab={sortTab}
        onSortChange={handleSortChange}
        places={places}
        totalCount={totalSpots}
        selectedSlug={selectedSlug}
        onSelectPlace={(slug) => {
          setSelectedSlug(slug);
          // On mobile, auto-collapse panel when selecting a place
          if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsCollapsed(true);
          }
        }}
        onDownloadGeoJson={handleDownloadGeoJson}
        onToast={showToast}
        showLegend={showLegend}
        onToggleLegend={handleToggleLegend}
      />

      {/* Floating Right Selected Place Detail Drawer
          - Mobile: bottom sheet full-width above footer
          - Desktop: right side panel */}
      {selectedSlug && (
        <>
          {/* Desktop drawer (md+) */}
          <div className="hidden md:block absolute top-[88px] right-6 z-[400] pointer-events-auto">
            <PlaceDetailDrawer
              slug={selectedSlug}
              onClose={() => setSelectedSlug(null)}
              onToast={showToast}
            />
          </div>
          {/* Mobile bottom sheet */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 z-[450] pointer-events-auto">
            <PlaceDetailDrawer
              slug={selectedSlug}
              onClose={() => setSelectedSlug(null)}
              isMobileSheet
              onToast={showToast}
            />
          </div>
        </>
      )}

      {/* Mobile Floating Legend (shown conditionally) */}
      {showLegend && (
        <div className="sm:hidden absolute top-[76px] right-3 z-[450] pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          <MapLegend onClose={() => setShowLegend(false)} />
        </div>
      )}

      {/* Floating Bottom-Right Map Controls & Suitability Legend
          - Legend appears on desktop/tablet when toggled; shift left on md when drawer open */}
      <div
        className={cn(
          'absolute bottom-3.5 z-[350] flex items-end gap-3 pointer-events-auto transition-all duration-300',
          // Desktop: shift left when detail drawer is open
          selectedSlug ? 'right-6 md:right-[456px]' : 'right-6'
        )}
      >
        {/* Suitability Legend - desktop only (conditional) */}
        {showLegend && (
          <div className="hidden sm:block animate-in fade-in zoom-in-95 duration-200">
            <MapLegend onClose={() => setShowLegend(false)} />
          </div>
        )}

        {/* 5-Button Map Controls Stack */}
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onLocate={handleLocate}
          onResetCompass={handleResetCompass}
          currentLayer={tileLayer}
          onChangeLayer={setTileLayer}
          overlays={spatialOverlays}
          onToggleOverlay={handleToggleOverlay}
          onToast={showToast}
        />
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
