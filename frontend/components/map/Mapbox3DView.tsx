'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { PlaceGeoJsonFeature } from '@/lib/types';
import { supabaseApi } from '@/lib/supabase-api';

export interface Mapbox3DViewProps {
  features: PlaceGeoJsonFeature[];
  selectedSlug?: string | null;
  onMarkerClick: (slug: string) => void;
  tileLayer?: 'mapbox' | 'osm' | 'satellite';
  is3D?: boolean;
  userLocation?: [number, number] | null;
  onMapReady?: (map: mapboxgl.Map) => void;
}

const BOGOR_LNG_LAT: [number, number] = [106.805, -6.598];

export default function Mapbox3DView({
  features,
  selectedSlug,
  onMarkerClick,
  tileLayer = 'mapbox',
  is3D = true,
  userLocation,
  onMapReady,
}: Mapbox3DViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [token, setToken] = useState<string>(process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '');

  // 1. Fetch Mapbox Token from Supabase settings if not in env
  useEffect(() => {
    if (!token) {
      supabaseApi.getSetting('mapbox_token').then((dbToken) => {
        if (dbToken) {
          setToken(dbToken);
        }
      });
    }
  }, [token]);

  // 2. Initialize Mapbox GL Map
  useEffect(() => {
    if (!mapContainerRef.current || !token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: BOGOR_LNG_LAT,
      zoom: 14.3,
      pitch: is3D ? 52 : 0,
      bearing: is3D ? -15 : 0,
      antialias: true,
    });

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'bottom-right');

    const add3DLayer = () => {
      if (tileLayer !== 'mapbox') return;
      if (map.getLayer('3d-buildings-extrusion')) return;

      const layers = map.getStyle().layers;
      let labelLayerId: string | undefined;
      if (layers) {
        for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout && (layers[i].layout as any)?.['text-field']) {
            labelLayerId = layers[i].id;
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
                0, '#E2E8F0',
                25, '#CBD5E1',
                60, '#94A3B8',
              ],
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                13.5, 0,
                15, ['get', 'height'],
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                13.5, 0,
                15, ['get', 'min_height'],
              ],
              'fill-extrusion-opacity': 0.85,
            },
          },
          labelLayerId
        );
      } catch (err) {
        console.warn('3D building layer already exists or source missing', err);
      }
    };

    map.on('style.load', add3DLayer);

    mapRef.current = map;
    if (onMapReady) onMapReady(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [token]);

  // 3. Switch Basemap Layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayer === 'mapbox') {
      map.setStyle('mapbox://styles/mapbox/streets-v12');
      map.once('style.load', () => {
        // Re-apply 3D extrusions
        const layers = map.getStyle().layers;
        let labelLayerId: string | undefined;
        if (layers) {
          for (let i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol' && layers[i].layout && (layers[i].layout as any)?.['text-field']) {
              labelLayerId = layers[i].id;
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
                'fill-extrusion-color': '#CBD5E1',
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'min_height'],
                'fill-extrusion-opacity': 0.85,
              },
            },
            labelLayerId
          );
        } catch {
          // ignore
        }
      });
      if (is3D) map.easeTo({ pitch: 52, bearing: -15, duration: 800 });
    } else if (tileLayer === 'osm') {
      map.setStyle({
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
      });
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
    } else if (tileLayer === 'satellite') {
      map.setStyle({
        version: 8,
        sources: {
          'satellite-tiles': {
            type: 'raster',
            tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
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
      });
    }
  }, [tileLayer]);

  // 4. Toggle 3D / 2D Camera Pitch
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (is3D) {
      map.easeTo({ pitch: 52, bearing: -15, duration: 800 });
    } else {
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
    }
  }, [is3D]);

  // 5. Render Cafe Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    features.forEach((f, idx) => {
      const [lng, lat] = f.geometry.coordinates;
      const p = f.properties;
      const isSelected = p.slug === selectedSlug;

      const scoreNum = p.recommendation_score ?? p.nugas_score ?? 0;
      const displayScore = scoreNum > 10 ? (scoreNum / 10).toFixed(1) : Number(scoreNum).toFixed(1);

      const el = document.createElement('div');
      el.className = 'custom-mapbox-pin';
      el.style.cursor = 'pointer';

      const pinBg = isSelected ? '#005B54' : '#0F756E';
      const borderR = isSelected ? 'ring-4 ring-emerald-400' : 'shadow-md';

      el.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));">
          <div style="
            background: ${pinBg};
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 11px;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 9999px;
            border: 2px solid white;
            white-space: nowrap;
          " class="${borderR}">
            <span>${displayScore}</span>
          </div>
          <div style="
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 6px solid ${pinBg};
            margin-top: -1px;
          "></div>
        </div>
      `;

      const popupHtml = `
        <div style="padding: 10px; max-width: 200px; font-family: sans-serif;">
          <h4 style="font-weight: 700; font-size: 13px; color: #111827; margin: 0 0 4px 0;">${p.name}</h4>
          <p style="font-size: 11px; color: #6B7280; margin: 0 0 6px 0;">${p.subdistrict || 'Kota Bogor'}</p>
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: #005B54; border-top: 1px solid #E5E7EB; padding-top: 6px;">
            <span>WiFi ${p.wifi_speed_mbps || 0} Mbps</span>
            <span>Skor: ${displayScore}</span>
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: [0, -28], closeButton: false }).setHTML(popupHtml);

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener('click', () => {
        onMarkerClick(p.slug);
      });

      markersRef.current.push(marker);
    });
  }, [features, selectedSlug, onMarkerClick]);

  // 6. Fly to Selected Place
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedSlug) return;
    const target = features.find((f) => f.properties.slug === selectedSlug);
    if (target) {
      const [lng, lat] = target.geometry.coordinates;
      map.flyTo({
        center: [lng, lat],
        zoom: 16.5,
        pitch: is3D ? 55 : 0,
        duration: 1200,
      });
    }
  }, [selectedSlug, features, is3D]);

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
      el.className = 'w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg ring-4 ring-blue-400/40 animate-pulse';

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup({ offset: 12 }).setHTML('<b>Lokasi Anda</b>'))
        .addTo(map);

      userMarkerRef.current = marker;
    }
  }, [userLocation]);

  return (
    <div className="w-full h-full relative z-0">
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0" />
    </div>
  );
}
