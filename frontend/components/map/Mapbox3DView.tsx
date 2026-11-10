'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { PlaceGeoJsonFeature } from '@/lib/types';
import { supabaseApi } from '@/lib/supabase-api';
import { getScoreTier } from '@/lib/utils';
import { GoAroundLoader } from '@/components/loading/GoAroundLoader';

export interface Mapbox3DViewProps {
  features: PlaceGeoJsonFeature[];
  selectedSlug?: string | null;
  onMarkerClick: (slug: string) => void;
  tileLayer?: 'mapbox' | 'osm' | 'satellite';
  is3D?: boolean;
  userLocation?: [number, number] | null;
  onMapReady?: (map: mapboxgl.Map) => void;
  onBoundsChange?: (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => void;
}

const BOGOR_LNG_LAT: [number, number] = [106.805, -6.598];

function add3DBuildingsLayer(map: mapboxgl.Map) {
  if (!map.getSource('composite')) return;
  if (map.getLayer('3d-buildings-extrusion')) return;

  const layers = map.getStyle()?.layers;
  let labelLayerId: string | undefined;
  if (layers) {
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      if (
        layer.type === 'symbol' &&
        layer.layout &&
        (layer.layout as Record<string, unknown>)['text-field']
      ) {
        labelLayerId = layer.id;
        break;
      }
    }
  }

  try {
    map.addLayer(
      {
        id: '3d-buildings-extrusion',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 13.5,
        paint: {
          'fill-extrusion-color': [
            'interpolate',
            ['linear'],
            ['get', 'height'],
            0,
            '#E2E8F0',
            25,
            '#CBD5E1',
            60,
            '#94A3B8',
          ],
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            13.5,
            0,
            15,
            ['get', 'height'],
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            13.5,
            0,
            15,
            ['get', 'min_height'],
          ],
          'fill-extrusion-opacity': 0.85,
        },
      },
      labelLayerId,
    );
  } catch (err) {
    console.warn('3D building layer unavailable or already added', err);
  }
}

function getRasterStyle(tileLayer: 'osm' | 'satellite'): mapboxgl.StyleSpecification {
  if (tileLayer === 'satellite') {
    return {
      version: 8,
      sources: {
        'satellite-tiles': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          attribution: '&copy; Esri, Maxar, Earthstar Geographics',
        },
      },
      layers: [
        {
          id: 'satellite-layer',
          type: 'raster',
          source: 'satellite-tiles',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };
  }

  return {
    version: 8,
    sources: {
      'osm-tiles': {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '&copy; OpenStreetMap contributors',
      },
    },
    layers: [
      {
        id: 'osm-layer',
        type: 'raster',
        source: 'osm-tiles',
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  };
}

export default function Mapbox3DView({
  features,
  selectedSlug,
  onMarkerClick,
  tileLayer = 'mapbox',
  is3D = true,
  userLocation,
  onMapReady,
  onBoundsChange,
}: Mapbox3DViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const prevTileLayerRef = useRef<string>(tileLayer);
  const lastFlownSlugRef = useRef<string | null>(null);
  const is3DRef = useRef(is3D);
  const tileLayerRef = useRef(tileLayer);
  const onMapReadyRef = useRef(onMapReady);
  const onBoundsChangeRef = useRef(onBoundsChange);
  const onMarkerClickRef = useRef(onMarkerClick);

  useEffect(() => {
    is3DRef.current = is3D;
    tileLayerRef.current = tileLayer;
    onMapReadyRef.current = onMapReady;
    onBoundsChangeRef.current = onBoundsChange;
    onMarkerClickRef.current = onMarkerClick;
  });

  const envToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
  const hasPlaceholderEnv = !envToken || envToken === 'pk.placeholder';
  const [token, setToken] = useState<string>(hasPlaceholderEnv ? '' : envToken);
  const [isLoadingToken, setIsLoadingToken] = useState<boolean>(hasPlaceholderEnv);

  // 1. Fetch Mapbox token from Supabase settings if not configured in env
  useEffect(() => {
    if (token) return;

    let cancelled = false;
    supabaseApi
      .getSetting('mapbox_token')
      .then((dbToken) => {
        if (!cancelled && dbToken) {
          setToken(dbToken);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingToken(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  // 2. Initialize Mapbox GL Map once token is available
  useEffect(() => {
    if (!mapContainerRef.current || !token) return;

    mapboxgl.accessToken = token;

    const initialStyle: string | mapboxgl.StyleSpecification =
      tileLayerRef.current === 'mapbox'
        ? 'mapbox://styles/mapbox/streets-v12'
        : getRasterStyle(tileLayerRef.current);

    const usePitch = is3DRef.current && tileLayerRef.current === 'mapbox';
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: BOGOR_LNG_LAT,
      zoom: 14.3,
      pitch: usePitch ? 52 : 0,
      bearing: usePitch ? -15 : 0,
      antialias: true,
    });

    prevTileLayerRef.current = tileLayerRef.current;

    map.on('style.load', () => {
      if (tileLayerRef.current === 'mapbox') {
        add3DBuildingsLayer(map);
      }
    });

    map.on('moveend', () => {
      if (!onBoundsChangeRef.current) return;
      const b = map.getBounds();
      if (!b) return;
      onBoundsChangeRef.current({
        north: Number(b.getNorth().toFixed(4)),
        south: Number(b.getSouth().toFixed(4)),
        east: Number(b.getEast().toFixed(4)),
        west: Number(b.getWest().toFixed(4)),
      });
    });

    mapRef.current = map;
    onMapReadyRef.current?.(map);

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [token]);

  // 3. Switch Basemap Layer cleanly only when tileLayer changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (prevTileLayerRef.current === tileLayer) return;
    prevTileLayerRef.current = tileLayer;

    if (tileLayer === 'mapbox') {
      map.setStyle('mapbox://styles/mapbox/streets-v12');
      map.once('style.load', () => {
        add3DBuildingsLayer(map);
      });
      if (is3DRef.current) {
        map.easeTo({ pitch: 52, bearing: -15, duration: 800 });
      }
    } else {
      map.setStyle(getRasterStyle(tileLayer));
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
    }
  }, [tileLayer]);

  // 4. Toggle 3D / 2D Camera Pitch
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (is3D && tileLayer === 'mapbox') {
      map.easeTo({ pitch: 52, bearing: -15, duration: 800 });
    } else {
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
    }
  }, [is3D, tileLayer]);

  // 5. Render Cafe Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    features.forEach((f) => {
      const [lng, lat] = f.geometry.coordinates;
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;

      const p = f.properties;
      const identifier = p.slug || String(p.id);
      const isSelected = identifier === selectedSlug;

      const scoreNum = p.recommendation_score ?? p.nugas_score ?? 0;
      const displayScore =
        scoreNum > 10 ? (scoreNum / 10).toFixed(1) : Number(scoreNum).toFixed(1);
      const tier = getScoreTier(scoreNum);
      const pinBg = isSelected ? '#005B54' : tier.color;

      const el = document.createElement('div');
      el.className = 'custom-mapbox-pin';
      el.style.cursor = 'pointer';
      el.style.zIndex = isSelected ? '50' : '1';

      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.flexDirection = 'column';
      wrapper.style.alignItems = 'center';
      wrapper.style.transform = isSelected ? 'scale(1.14)' : 'scale(1)';
      wrapper.style.transition = 'transform 0.15s ease';
      wrapper.style.filter = isSelected
        ? 'drop-shadow(0 4px 10px rgba(0, 91, 84, 0.45))'
        : 'drop-shadow(0 3px 6px rgba(0,0,0,0.28))';

      const pill = document.createElement('div');
      pill.style.background = pinBg;
      pill.style.color = '#ffffff';
      pill.style.fontFamily = 'var(--font-sans), system-ui, sans-serif';
      pill.style.fontSize = '11px';
      pill.style.fontWeight = '800';
      pill.style.padding = '3px 8px';
      pill.style.borderRadius = '9999px';
      pill.style.border = '2px solid #ffffff';
      pill.style.whiteSpace = 'nowrap';
      if (isSelected) {
        pill.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.45)';
      }

      const label = document.createElement('span');
      label.textContent = displayScore;
      pill.appendChild(label);

      const arrow = document.createElement('div');
      arrow.style.width = '0';
      arrow.style.height = '0';
      arrow.style.borderLeft = '5px solid transparent';
      arrow.style.borderRight = '5px solid transparent';
      arrow.style.borderTop = `6px solid ${pinBg}`;
      arrow.style.marginTop = '-1px';

      wrapper.appendChild(pill);
      wrapper.appendChild(arrow);
      el.appendChild(wrapper);

      // Build popup content safely via DOM nodes
      const popupNode = document.createElement('div');
      popupNode.style.padding = '8px 10px';
      popupNode.style.maxWidth = '210px';
      popupNode.style.fontFamily = 'var(--font-sans), system-ui, sans-serif';

      const titleEl = document.createElement('h4');
      titleEl.textContent = p.name;
      titleEl.style.fontWeight = '700';
      titleEl.style.fontSize = '13px';
      titleEl.style.color = '#111827';
      titleEl.style.margin = '0 0 3px 0';

      const subEl = document.createElement('p');
      subEl.textContent = p.subdistrict || 'Kota Bogor';
      subEl.style.fontSize = '11px';
      subEl.style.color = '#6B7280';
      subEl.style.margin = '0 0 6px 0';

      const metaRow = document.createElement('div');
      metaRow.style.display = 'flex';
      metaRow.style.justifyContent = 'space-between';
      metaRow.style.gap = '10px';
      metaRow.style.fontSize = '11px';
      metaRow.style.fontWeight = '700';
      metaRow.style.color = '#005B54';
      metaRow.style.borderTop = '1px solid #E5E7EB';
      metaRow.style.paddingTop = '6px';

      const wifiEl = document.createElement('span');
      wifiEl.textContent = p.wifi_speed_mbps ? `WiFi ${p.wifi_speed_mbps} Mbps` : 'WiFi N/A';
      const scoreEl = document.createElement('span');
      scoreEl.textContent = `Skor: ${displayScore}`;

      metaRow.appendChild(wifiEl);
      metaRow.appendChild(scoreEl);
      popupNode.appendChild(titleEl);
      popupNode.appendChild(subEl);
      popupNode.appendChild(metaRow);

      const popup = new mapboxgl.Popup({
        offset: [0, -28],
        closeButton: false,
      }).setDOMContent(popupNode);

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener('click', (event) => {
        event.stopPropagation();
        onMarkerClickRef.current(identifier);
      });

      markersRef.current.push(marker);
    });
  }, [features, selectedSlug]);

  // 6. Smooth Fly to Newly Selected Place
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!selectedSlug) {
      lastFlownSlugRef.current = null;
      return;
    }

    if (lastFlownSlugRef.current === selectedSlug) return;

    const target = features.find(
      (f) => (f.properties.slug || String(f.properties.id)) === selectedSlug,
    );
    if (target) {
      lastFlownSlugRef.current = selectedSlug;
      const [lng, lat] = target.geometry.coordinates;
      map.flyTo({
        center: [lng, lat],
        zoom: 16.5,
        pitch: is3D && tileLayer === 'mapbox' ? 55 : 0,
        duration: 1100,
      });
    }
  }, [selectedSlug, features, is3D, tileLayer]);

  // 7. User GPS Marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const [lat, lng] = userLocation;
      const el = document.createElement('div');
      el.className =
        'w-5 h-5 rounded-full bg-sky-600 border-2 border-white shadow-lg ring-4 ring-sky-400/40 animate-pulse';

      const popupEl = document.createElement('div');
      popupEl.style.fontFamily = 'var(--font-sans), system-ui, sans-serif';
      popupEl.style.fontSize = '12px';
      popupEl.style.fontWeight = '700';
      popupEl.style.color = '#0369a1';
      popupEl.textContent = 'Lokasi Anda Saat Ini';

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup({ offset: 12, closeButton: false }).setDOMContent(popupEl))
        .addTo(map);

      userMarkerRef.current = marker;
    }
  }, [userLocation]);

  if (isLoadingToken) {
    return <GoAroundLoader mode="map" label="Memuat peta 3D Bogor…" />;
  }

  if (!token) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F6F4ED] p-6 text-center">
        <div className="max-w-sm rounded-2xl bg-white p-6 shadow-md border border-slate-200">
          <p className="text-sm font-bold text-slate-900">Token Mapbox belum tersedia</p>
          <p className="mt-1.5 text-xs text-slate-500">
            Pastikan NEXT_PUBLIC_MAPBOX_TOKEN atau pengaturan mapbox_token di Supabase sudah terisi.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative z-0">
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0" />
    </div>
  );
}
