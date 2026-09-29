'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FilterBar } from '@/components/places/FilterBar';
import { PlaceDetailDrawer } from '@/components/places/PlaceDetailDrawer';
import { MapControls, MapLegend, type TileLayerType, type SpatialOverlays, DEFAULT_SPATIAL_OVERLAYS } from './MapControls';
import { RecommendationPanel } from '@/components/places/RecommendationPanel';
import { useBboxPlaces, useRecommendations } from '@/hooks/usePlacesQuery';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';
import type { PlaceFilters, BboxParams, PlaceGeoJsonFeature } from '@/lib/types';
import {
  DEFAULT_RECOMMENDATION_REQUEST,
  type RecommendationPlace,
  type RecommendationRequest,
  type RecommendationSort,
} from '@/lib/recommendations';
import { cn } from '@/lib/cn';
import { useSearchContext } from '@/components/search/SearchProvider';
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

// Centered on Baranangsiang / IPB University district
const BOGOR_CENTER: [number, number] = [-6.601, 106.806];

function recommendationToGeoJsonFeature(place: RecommendationPlace): PlaceGeoJsonFeature {
  return {
    type: 'Feature',
    id: place.id,
    geometry: {
      type: 'Point',
      coordinates: [place.longitude, place.latitude],
    },
    properties: {
      id: place.id,
      name: place.name,
      slug: place.slug,
      subdistrict: place.subdistrict,
      address: place.address,
      price_min_drink: place.price_min_drink,
      price_max_drink: place.price_max_drink,
      price_avg_food: null,
      wifi_speed_mbps: place.wifi_speed_mbps,
      wifi_quality: place.wifi_quality,
      plug_availability: place.plug_availability,
      noise_level: place.noise_level,
      is_24_hours: null,
      open_time: null,
      close_time: null,
      google_rating: place.google_rating,
      nugas_score: place.recommendation_score,
      budget_score: place.score_breakdown.price,
      facility_score: null,
      recommendation_score: place.recommendation_score,
      data_confidence: place.data_confidence,
      image_url: place.image_url,
      vibe_tags: place.reasons,
      google_maps_url: place.google_maps_url,
      distance_km: place.distance_km,
      amenities: [],
    },
  };
}

export function MapPage() {
  const { searchIntent } = useSearchContext();
  // Default: clean map without auto-opened drawer, collapsed left panel pill
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [sortTab, setSortTab] = useState<'score' | 'nearby' | 'budget'>('score');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showLegend, setShowLegend] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [tileLayer, setTileLayer] = useState<TileLayerType>('osm');
  const [spatialOverlays, setSpatialOverlays] = useState<SpatialOverlays>(DEFAULT_SPATIAL_OVERLAYS);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [submittedRequest, setSubmittedRequest] = useState<RecommendationRequest>({
    ...DEFAULT_RECOMMENDATION_REQUEST,
    location: {
      latitude: BOGOR_CENTER[0],
      longitude: BOGOR_CENTER[1],
    },
  });
  const appliedSearchId = useRef<number | null>(null);
  const { toasts, showToast, dismissToast } = useToast();

  useEffect(() => {
    if (!searchIntent || appliedSearchId.current === searchIntent.id) return;

    appliedSearchId.current = searchIntent.id;
    setSubmittedRequest((current) => ({
      ...current,
      search_query: searchIntent.mode === 'keyword' ? searchIntent.query : null,
      natural_language_query: searchIntent.mode === 'need' ? searchIntent.query : null,
    }));
    setSelectedSlug(searchIntent.mode === 'keyword' && searchIntent.place
      ? searchIntent.place.slug
      : null);
    setIsCollapsed(false);
  }, [searchIntent]);

  useEffect(() => {
    if (!mapInstance || searchIntent?.mode !== 'keyword' || !searchIntent.place) return;

    mapInstance.flyTo(
      [searchIntent.place.latitude, searchIntent.place.longitude],
      16,
      { duration: 0.8 },
    );
  }, [mapInstance, searchIntent]);

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
    const sortBy: RecommendationSort = newTab === 'nearby'
      ? 'distance'
      : newTab === 'budget'
        ? 'price'
        : 'match';
    setSubmittedRequest((current) => ({ ...current, sort_by: sortBy }));
    setSelectedSlug(null);
    const labels = {
      score: 'Kecocokan tertinggi',
      nearby: 'Jarak terdekat',
      budget: 'Paling hemat',
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

  const {
    data: recommendationResponse,
    isPending: isRecommendationPending,
    isFetching: isRecommendationFetching,
    isError: isRecommendationError,
    refetch: retryRecommendations,
  } = useRecommendations(submittedRequest);

  const places = useMemo(
    () => recommendationResponse?.data ?? [],
    [recommendationResponse?.data],
  );
  const totalSpots = recommendationResponse?.meta.total ?? places.length;

  // Query geojson markers in current map viewport
  const { data: bboxResponse } = useBboxPlaces({
    ...bbox,
    ...filters,
  });

  // Recommendation markers take precedence over matching viewport markers.
  const mapFeatures = useMemo<PlaceGeoJsonFeature[]>(() => {
    const apiMapFeatures = bboxResponse?.features ?? [];
    const recommendationFeatures = places.map(recommendationToGeoJsonFeature);
    const recommendationSlugs = new Set(
      recommendationFeatures.map((feature) => feature.properties.slug),
    );
    const additionalViewportFeatures = apiMapFeatures.filter(
      (feature) => !recommendationSlugs.has(feature.properties.slug),
    );

    return [...recommendationFeatures, ...additionalViewportFeatures];
  }, [bboxResponse?.features, places]);

  useEffect(() => {
    if (!mapInstance || places.length === 0) return;

    const bounds = places.map(
      (place) => [place.latitude, place.longitude] as [number, number],
    );
    mapInstance.fitBounds(bounds, {
      padding: [56, 56],
      maxZoom: 15,
      animate: true,
      duration: 0.8,
    });
  }, [mapInstance, places]);

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
        setSubmittedRequest((current) => ({
          ...current,
          location: {
            latitude: coords[0],
            longitude: coords[1],
          },
          sort_by: 'distance',
        }));
        if (mapInstance) {
          mapInstance.flyTo(coords, 16, { duration: 1.5 });
        }
        setSortTab('nearby');
        setSelectedSlug(null);
        showToast('Lokasi ditemukan. Rekomendasi terdekat sedang diperbarui.', 'success', 3500);
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

  const handleRecommendationSubmit = (request: RecommendationRequest) => {
    setSubmittedRequest({
      ...request,
      location: userLocation
        ? { latitude: userLocation[0], longitude: userLocation[1] }
        : request.location,
    });
    setSortTab(
      request.sort_by === 'distance'
        ? 'nearby'
        : request.sort_by === 'price'
          ? 'budget'
          : 'score',
    );
    setSelectedSlug(null);
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
        recommendationRequest={submittedRequest}
        onSubmitRecommendation={handleRecommendationSubmit}
        onRequestLocation={handleLocate}
        isRecommendationLoading={isRecommendationPending || isRecommendationFetching}
        recommendationError={isRecommendationError}
        onRetryRecommendation={() => {
          void retryRecommendations();
        }}
      />

      {/* Floating Right Selected Place Detail Drawer
          - Mobile: bottom sheet full-width above footer
          - Desktop: right side panel */}
      {selectedSlug && recommendationResponse?.meta.source === 'api' && (
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
          selectedSlug && recommendationResponse?.meta.source === 'api'
            ? 'right-6 md:right-[456px]'
            : 'right-6'
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
