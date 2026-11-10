'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FilterBar } from '@/components/places/FilterBar';
import { PlaceDetailDrawer } from '@/components/places/PlaceDetailDrawer';
import { MapControls, MapLegend, type TileLayerType } from './MapControls';
import { RecommendationPanel } from '@/components/places/RecommendationPanel';
import { useBboxPlaces, useRecommendations } from '@/hooks/usePlacesQuery';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';
import type { PlaceFilters, BboxParams, PlaceGeoJsonFeature } from '@/lib/types';
import {
  DEFAULT_RECOMMENDATION_REQUEST,
  type RecommendationRequest,
  type RecommendationSort,
} from '@/lib/recommendations';
import { recommendationToGeoJsonFeature } from '@/lib/recommendations/mock-data';
import { cn } from '@/lib/cn';
import { useSearchContext } from '@/components/search/SearchProvider';
import { GoAroundLoader } from '@/components/loading/GoAroundLoader';
import { trackPublicSpatialQuery } from '@/lib/admin-store';
import type mapboxgl from 'mapbox-gl';

// Dynamic import for Mapbox 3D View (client-only, SSR false)
const Mapbox3DView = dynamic(() => import('./Mapbox3DView'), {
  ssr: false,
  loading: () => <GoAroundLoader mode="map" label="Memuat peta 3D Bogor…" />,
});

// Centered on Baranangsiang / IPB University district ([lat, lng] for spatial calc)
const BOGOR_CENTER: [number, number] = [-6.601, 106.806];
// [lng, lat] for Mapbox GL JS camera
const BOGOR_MAPBOX_CENTER: [number, number] = [106.805, -6.598];

export function MapPage({ locationEnabled = true }: { locationEnabled?: boolean }) {
  const { searchIntent, openCriteriaTrigger } = useSearchContext();
  // Default: clean map without auto-opened drawer, collapsed left panel pill
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [sortTab, setSortTab] = useState<'score' | 'nearby' | 'budget'>('score');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [panelView, setPanelView] = useState<'results' | 'criteria'>('results');
  const [showLegend, setShowLegend] = useState(false);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [tileLayer, setTileLayer] = useState<TileLayerType>('mapbox');
  const [is3D, setIs3D] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [submittedRequest, setSubmittedRequest] = useState<RecommendationRequest>({
    ...DEFAULT_RECOMMENDATION_REQUEST,
    location: {
      latitude: BOGOR_CENTER[0],
      longitude: BOGOR_CENTER[1],
    },
  });
  const appliedSearchId = useRef<number | null>(null);
  const appliedCriteriaId = useRef<number>(0);
  const hasAutoCentered = useRef(false);
  const skipNextFitBoundsRef = useRef(false);
  const { toasts, showToast, dismissToast } = useToast();

  // Let the opening animation finish before showing the browser's GPS prompt.
  useEffect(() => {
    if (!locationEnabled || typeof window === 'undefined' || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        skipNextFitBoundsRef.current = true;
        setSubmittedRequest((current) => ({
          ...current,
          location: {
            latitude: coords[0],
            longitude: coords[1],
          },
          sort_by: 'distance',
        }));
        setSortTab('nearby');
        showToast('Lokasi GPS Anda terdeteksi. Menampilkan tempat nugas terdekat 📍', 'success', 3000);
      },
      () => {
        // Geolocation denied or unavailable: keep default center silently
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationEnabled]);

  // Center map on user location when detected
  useEffect(() => {
    if (!mapInstance || !userLocation || hasAutoCentered.current) return;
    hasAutoCentered.current = true;
    mapInstance.flyTo({
      center: [userLocation[1], userLocation[0]],
      zoom: 15,
      pitch: is3D && tileLayer === 'mapbox' ? 52 : 0,
      duration: 1200,
    });
  }, [mapInstance, userLocation, is3D, tileLayer]);

  useEffect(() => {
    if (openCriteriaTrigger === 0 || appliedCriteriaId.current === openCriteriaTrigger) return;
    appliedCriteriaId.current = openCriteriaTrigger;
    setIsCollapsed(false);
    setPanelView((prev) => (prev === 'criteria' ? 'results' : 'criteria'));
  }, [openCriteriaTrigger]);

  useEffect(() => {
    if (!searchIntent || appliedSearchId.current === searchIntent.id) return;

    appliedSearchId.current = searchIntent.id;
    trackPublicSpatialQuery(
      searchIntent.mode === 'keyword'
        ? searchIntent.place?.subdistrict || searchIntent.query
        : searchIntent.query,
    );
    setSubmittedRequest((current) => ({
      ...current,
      search_query: searchIntent.mode === 'keyword' ? searchIntent.query : null,
      natural_language_query: searchIntent.mode === 'need' ? searchIntent.query : null,
    }));
    setSelectedSlug(
      searchIntent.mode === 'keyword' && searchIntent.place
        ? searchIntent.place.slug
        : null,
    );
    setIsCollapsed(false);
  }, [searchIntent]);

  useEffect(() => {
    if (!mapInstance || searchIntent?.mode !== 'keyword' || !searchIntent.place) return;

    mapInstance.flyTo({
      center: [searchIntent.place.longitude, searchIntent.place.latitude],
      zoom: 16.2,
      pitch: is3D && tileLayer === 'mapbox' ? 52 : 0,
      duration: 900,
    });
  }, [mapInstance, searchIntent, is3D, tileLayer]);

  const handleToggleLegend = () => {
    setShowLegend((prev) => {
      const next = !prev;
      showToast(
        next ? 'Menampilkan legenda skor kesesuaian spasial 🗺️' : 'Legenda peta disembunyikan',
        'info',
        2500,
      );
      return next;
    });
  };

  const handleSortChange = (newTab: 'score' | 'nearby' | 'budget') => {
    setSortTab(newTab);
    const sortBy: RecommendationSort =
      newTab === 'nearby'
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

    if (skipNextFitBoundsRef.current) {
      skipNextFitBoundsRef.current = false;
      return;
    }

    const validCoords = places.filter(
      (p) => Number.isFinite(p.longitude) && Number.isFinite(p.latitude),
    );
    if (validCoords.length === 0) return;

    if (validCoords.length === 1) {
      const only = validCoords[0];
      mapInstance.flyTo({
        center: [only.longitude, only.latitude],
        zoom: 15.5,
        pitch: is3D && tileLayer === 'mapbox' ? 52 : 0,
        duration: 800,
      });
      return;
    }

    let minLng = Number.POSITIVE_INFINITY;
    let maxLng = Number.NEGATIVE_INFINITY;
    let minLat = Number.POSITIVE_INFINITY;
    let maxLat = Number.NEGATIVE_INFINITY;

    for (const p of validCoords) {
      if (p.longitude < minLng) minLng = p.longitude;
      if (p.longitude > maxLng) maxLng = p.longitude;
      if (p.latitude < minLat) minLat = p.latitude;
      if (p.latitude > maxLat) maxLat = p.latitude;
    }

    mapInstance.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      {
        padding: { top: 110, bottom: 70, left: 60, right: 60 },
        maxZoom: 15,
        duration: 800,
      },
    );
  }, [mapInstance, places, is3D, tileLayer]);

  // Zoom In
  const handleZoomIn = () => {
    mapInstance?.zoomIn({ duration: 300 });
  };

  // Zoom Out
  const handleZoomOut = () => {
    mapInstance?.zoomOut({ duration: 300 });
  };

  // Reset Compass (Back to North & Bogor Center)
  const handleResetCompass = () => {
    if (mapInstance) {
      mapInstance.flyTo({
        center: BOGOR_MAPBOX_CENTER,
        zoom: 14.3,
        pitch: is3D && tileLayer === 'mapbox' ? 52 : 0,
        bearing: is3D && tileLayer === 'mapbox' ? -15 : 0,
        duration: 1200,
      });
    }
    showToast('Peta di-reset ke pandangan utama Bogor (Utara ↑)', 'info', 2500);
  };

  // Geolocation trigger
  const handleLocate = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      showToast('Perangkat tidak mendukung geolokasi GPS', 'error', 3000);
      return;
    }

    skipNextFitBoundsRef.current = true;

    if (userLocation && mapInstance) {
      mapInstance.flyTo({
        center: [userLocation[1], userLocation[0]],
        zoom: 16,
        pitch: is3D && tileLayer === 'mapbox' ? 52 : 0,
        duration: 1200,
      });
    }

    showToast('Mencari sinyal GPS Anda... 📡', 'info', 2500);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        skipNextFitBoundsRef.current = true;
        setSubmittedRequest((current) => ({
          ...current,
          location: {
            latitude: coords[0],
            longitude: coords[1],
          },
          sort_by: 'distance',
        }));
        if (mapInstance) {
          mapInstance.flyTo({
            center: [coords[1], coords[0]],
            zoom: 16,
            pitch: is3D && tileLayer === 'mapbox' ? 52 : 0,
            duration: 1200,
          });
        }
        setSortTab('nearby');
        setSelectedSlug(null);
        showToast('Lokasi ditemukan. Rekomendasi terdekat sedang diperbarui.', 'success', 3500);
      },
      (err) => {
        skipNextFitBoundsRef.current = false;
        console.warn('Geolocation error:', err);
        showToast(
          'Izin lokasi tidak diberikan atau GPS belum aktif di perangkat Anda',
          'warning',
          4000,
        );
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const handleRecommendationSubmit = (request: RecommendationRequest) => {
    trackPublicSpatialQuery(request.search_query || request.natural_language_query || undefined);
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

  const selectedInitialPlace = useMemo(() => {
    if (!selectedSlug) return undefined;
    const fromRecs = places.find(
      (p) => p.slug === selectedSlug || String(p.id) === selectedSlug,
    );
    if (fromRecs) return fromRecs;
    const fromMap = mapFeatures.find(
      (f) => f.properties.slug === selectedSlug || String(f.properties.id) === selectedSlug,
    );
    return fromMap?.properties;
  }, [mapFeatures, places, selectedSlug]);

  return (
    <>
      {/* Full-Canvas Mapbox 3D Map in background */}
      <Mapbox3DView
        features={mapFeatures}
        selectedSlug={selectedSlug}
        onMarkerClick={(slug) => {
          setSelectedSlug(slug);
          if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsCollapsed(true);
          }
        }}
        onBoundsChange={(b) => setBbox(b)}
        tileLayer={tileLayer}
        is3D={is3D}
        userLocation={userLocation}
        onMapReady={setMapInstance}
      />

      {/* Floating Filter Bar (Below topbar) */}
      <div className="absolute top-[76px] sm:top-[88px] left-0 right-0 sm:left-6 sm:right-6 md:right-auto z-[400] pointer-events-auto px-3 sm:px-0">
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          recommendationRequest={submittedRequest}
          onRecommendationRequestChange={(nextRequest) => {
            trackPublicSpatialQuery();
            setSubmittedRequest(nextRequest);
            setIsCollapsed(false);
          }}
          className="max-w-full"
        />
      </div>

      {/* Floating Left Sidebar Panel ("Rekomendasi Nugas Bogor")
          - Mobile: bottom sheet
          - Desktop: left sidebar */}
      <RecommendationPanel
        isCollapsed={isCollapsed}
        onToggleCollapse={(collapsed) => {
          setIsCollapsed(collapsed);
          if (!collapsed && typeof window !== 'undefined' && window.innerWidth < 768) {
            setSelectedSlug(null);
          }
        }}
        view={panelView}
        onViewChange={setPanelView}
        sortTab={sortTab}
        onSortChange={handleSortChange}
        places={places}
        totalCount={totalSpots}
        selectedSlug={selectedSlug}
        onSelectPlace={(slug) => {
          setSelectedSlug(slug);
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
          - Mobile: bottom sheet full-width
          - Desktop: right side panel */}
      {selectedSlug && (
        <>
          {/* Desktop drawer (md+) */}
          <div className="hidden md:block absolute top-[88px] right-6 z-[400] pointer-events-auto">
            <PlaceDetailDrawer
              slug={selectedSlug}
              initialPlace={selectedInitialPlace}
              onClose={() => setSelectedSlug(null)}
              onToast={showToast}
            />
          </div>
          {/* Mobile bottom sheet */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 z-[450] pointer-events-auto">
            <PlaceDetailDrawer
              slug={selectedSlug}
              initialPlace={selectedInitialPlace}
              onClose={() => setSelectedSlug(null)}
              isMobileSheet
              onToast={showToast}
            />
          </div>
        </>
      )}

      {/* Mobile Floating Legend (shown conditionally) */}
      {showLegend && (
        <div className="sm:hidden absolute top-[124px] right-3 z-[450] pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          <MapLegend onClose={() => setShowLegend(false)} />
        </div>
      )}

      {/* Floating Bottom-Right Map Controls & Suitability Legend */}
      <div
        className={cn(
          'absolute bottom-3.5 right-3 sm:right-6 z-[350] flex items-end gap-3 pointer-events-auto transition-all duration-300',
          selectedSlug
            ? 'md:right-[396px] lg:right-[456px]'
            : 'md:right-6',
        )}
      >
        {showLegend && (
          <div className="hidden sm:block animate-in fade-in zoom-in-95 duration-200">
            <MapLegend onClose={() => setShowLegend(false)} />
          </div>
        )}

        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onLocate={handleLocate}
          onResetCompass={handleResetCompass}
          currentLayer={tileLayer}
          onChangeLayer={setTileLayer}
          is3D={is3D}
          onToggle3D={() => {
            setIs3D((prev) => {
              const next = !prev;
              showToast(next ? 'Mode Peta 3D aktif' : 'Mode Peta 2D aktif', 'info', 2000);
              return next;
            });
          }}
          onToast={showToast}
        />
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
