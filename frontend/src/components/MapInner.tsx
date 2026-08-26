'use client';

import React, { useEffect, useRef } from 'react';
import { GeoJsonFeature } from '@/types/place';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Crosshair, Navigation, Radio } from 'lucide-react';

interface MapInnerProps {
  places: GeoJsonFeature[];
  selectedPlaceId: number | null;
  onSelectPlace: (id: number) => void;
  onOpenDetail: (slug: string) => void;
  activeSubdistrict: string;
  onSelectSubdistrict: (sub: string) => void;
  userLocation: { lat: number; lng: number } | null;
  onTriggerNearby: () => void;
  isLocating: boolean;
  maxRadiusFilter: number | null;
}

const SUBDISTRICTS = [
  'Semua',
  'Bogor Tengah',
  'Bogor Timur',
  'Bogor Utara',
  'Bogor Selatan',
  'Bogor Barat',
  'Tanah Sareal',
];

export const MapInner: React.FC<MapInnerProps> = ({
  places,
  selectedPlaceId,
  onSelectPlace,
  onOpenDetail,
  activeSubdistrict,
  onSelectSubdistrict,
  userLocation,
  onTriggerNearby,
  isLocating,
  maxRadiusFilter,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerLayerRef = useRef<L.LayerGroup | null>(null);
  const radiusCirclesLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Dark Map (Fixed focus on Kota Bogor)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-6.595038, 106.790082],
      zoom: 13,
      minZoom: 11,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: true,
    });

    // Dark Matter Cartography
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Layer Groups
    radiusCirclesLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);
    userMarkerLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render Animated Radar Waves & Radius Circles
  useEffect(() => {
    if (!mapInstanceRef.current || !userMarkerLayerRef.current || !radiusCirclesLayerRef.current) return;

    userMarkerLayerRef.current.clearLayers();
    radiusCirclesLayerRef.current.clearLayers();

    if (userLocation) {
      // Animated Radar Sonar Waves Marker
      const sonarIcon = L.divIcon({
        className: 'user-sonar-marker',
        html: `
          <div style="position: relative; width: 0; height: 0;">
            <div class="sonar-wave-1" style="
              position: absolute;
              left: -30px;
              top: -30px;
              width: 60px;
              height: 60px;
              border-radius: 9999px;
              border: 1.5px solid #38bdf8;
              background: rgba(56, 189, 248, 0.2);
              pointer-events: none;
            "></div>
            <div class="sonar-wave-2" style="
              position: absolute;
              left: -30px;
              top: -30px;
              width: 60px;
              height: 60px;
              border-radius: 9999px;
              border: 1.5px solid #0284c7;
              background: rgba(2, 132, 199, 0.15);
              pointer-events: none;
            "></div>
            <div class="sonar-wave-3" style="
              position: absolute;
              left: -30px;
              top: -30px;
              width: 60px;
              height: 60px;
              border-radius: 9999px;
              border: 1.5px solid #0369a1;
              background: rgba(3, 105, 161, 0.1);
              pointer-events: none;
            "></div>

            <!-- Core User Pin Dot -->
            <div style="
              position: absolute;
              left: -7px;
              top: -7px;
              width: 14px;
              height: 14px;
              border-radius: 9999px;
              background: #38bdf8;
              border: 2.5px solid #ffffff;
              box-shadow: 0 0 16px #38bdf8, 0 0 30px rgba(56, 189, 248, 0.8);
            "></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: sonarIcon });
      userMarker.bindPopup(`
        <div style="font-family: var(--font-syne), sans-serif; font-size: 11px; font-weight: 700; color: #38bdf8; text-align: center; padding: 4px;">
          POSISI ANDA SAAT INI
        </div>
      `);
      userMarkerLayerRef.current.addLayer(userMarker);

      // Distance Suggestion Circles (1 KM, 3 KM, 5 KM)
      const suggestionRadii = [1000, 3000, 5000];
      suggestionRadii.forEach((radiusMeters) => {
        const isHighlight = maxRadiusFilter && maxRadiusFilter * 1000 === radiusMeters;
        const circle = L.circle([userLocation.lat, userLocation.lng], {
          radius: radiusMeters,
          color: isHighlight ? '#38bdf8' : '#0284c7',
          weight: isHighlight ? 1.5 : 0.8,
          opacity: isHighlight ? 0.8 : 0.3,
          dashArray: '4, 6',
          fillColor: '#0284c7',
          fillOpacity: isHighlight ? 0.05 : 0.015,
        });

        radiusCirclesLayerRef.current?.addLayer(circle);
      });

      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 14, { duration: 1.2 });
    }
  }, [userLocation, maxRadiusFilter]);

  // Render PURE COFFEE ICONS ONLY
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    places.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const p = feature.properties;
      const isSelected = selectedPlaceId === p.id;

      // Color coding by price tier
      const accentColor =
        p.price_tier === 1
          ? '#22c55e' // Neon Green (Warkop)
          : p.price_tier === 2
          ? '#06b6d4' // Electric Cyan (Cafe)
          : '#a855f7'; // Neon Purple (Coworking)

      // FULL COFFEE ICON ONLY (Circular Minimal Glass Token)
      const customCoffeeIcon = L.divIcon({
        className: 'pure-coffee-marker',
        html: `
          <div style="position: relative; width: 32px; height: 32px; transform: translate(-50%, -50%); cursor: pointer;">
            ${
              isSelected
                ? `<div class="coffee-pin-pulse" style="
                    position: absolute;
                    inset: -6px;
                    border-radius: 9999px;
                    background: ${accentColor};
                    opacity: 0.6;
                  "></div>`
                : ''
            }
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 9999px;
              background: #09090b;
              border: 2px solid ${isSelected ? '#ffffff' : accentColor};
              box-shadow: 0 0 14px ${accentColor}60, 0 4px 10px rgba(0,0,0,0.85);
              display: flex;
              align-items: center;
              justify-content: center;
              transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${isSelected ? '#ffffff' : accentColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12Z"/><path d="M6 2v2"/><path d="M17 10h1a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([lat, lng], { icon: customCoffeeIcon });

      // Clean tooltip on hover
      marker.bindTooltip(`
        <div style="font-family: var(--font-syne), sans-serif; font-size: 11px; font-weight: 700; color: #ffffff; padding: 2px 4px;">
          ${p.name} <span style="color: ${accentColor}; font-weight: 700;">★ ${p.nugas_score}</span>
        </div>
      `, {
        direction: 'top',
        offset: [0, -18],
        className: 'leaflet-popup-content-wrapper',
      });

      // Rich Mapcn dark glass popup when clicked
      const popupContent = document.createElement('div');
      popupContent.style.minWidth = '210px';
      popupContent.innerHTML = `
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <span style="font-family: var(--font-syne), sans-serif; font-size: 10px; text-transform: uppercase; color: ${accentColor}; letter-spacing: 0.5px; font-weight: 700;">
              ${p.subdistrict}
            </span>
            <span style="font-family: var(--font-syne), sans-serif; font-size: 10px; font-weight: 700; background: #18181b; color: #e4e4e7; padding: 2px 6px; border-radius: 4px; border: 1px solid #27272a;">
              Skor ${p.nugas_score}
            </span>
          </div>

          <h4 style="font-family: var(--font-syne), sans-serif; font-size: 13px; font-weight: 700; color: #ffffff; margin: 0 0 4px 0; line-height: 1.3;">
            ${p.name}
          </h4>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px; background: #121215; padding: 6px 8px; border-radius: 6px; border: 1px solid #27272a; margin-bottom: 8px;">
            <span style="color: #a1a1aa;">Wi-Fi: <b style="color: #38bdf8;">${p.wifi_speed_mbps} Mbps</b></span>
            <span style="color: #a1a1aa;">Mulai: <b style="color: #4ade80;">Rp ${(p.price_min_drink / 1000).toFixed(0)}k</b></span>
          </div>

          ${
            p.distance_km !== undefined && p.distance_km !== null
              ? `<div style="font-family: var(--font-syne), sans-serif; font-size: 10px; color: #38bdf8; font-weight: 700; margin-bottom: 8px; text-align: center; background: #082f49; padding: 3px 6px; border-radius: 4px; border: 1px solid #0369a1;">
                  Jarak: ${p.distance_km} KM dari posisi kamu
                 </div>`
              : ''
          }

          <button id="view-popup-btn-${p.id}" style="
            width: 100%;
            background: #27272a;
            color: #f4f4f5;
            font-family: var(--font-syne), sans-serif;
            font-size: 11px;
            font-weight: 700;
            padding: 6px 10px;
            border-radius: 6px;
            border: 1px solid #3f3f46;
            cursor: pointer;
            transition: background 0.15s;
          ">
            Buka Detail & Rute &rarr;
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        onSelectPlace(p.id);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-popup-btn-${p.id}`);
        if (btn) {
          btn.onclick = () => onOpenDetail(p.slug);
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [places, selectedPlaceId, onSelectPlace, onOpenDetail]);

  // Center map on selected place
  useEffect(() => {
    if (!mapInstanceRef.current || selectedPlaceId === null) return;
    const place = places.find((f) => f.id === selectedPlaceId);
    if (place) {
      const [lng, lat] = place.geometry.coordinates;
      mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1.0 });
    }
  }, [selectedPlaceId, places]);

  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo([-6.595038, 106.790082], 13, { duration: 0.8 });
  };

  return (
    <div className="relative w-full h-full min-h-[360px] sm:min-h-[480px] bg-black">
      {/* Real Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[360px] sm:min-h-[480px]" />

      {/* Map Floating HUD Top-Right: Cari Terdekat & Recenter */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[400] flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onTriggerNearby}
          disabled={isLocating}
          title="Cari spot nugas terdekat dari posisi saya"
          className="bg-black/90 hover:bg-zinc-900 border border-sky-500/60 hover:border-sky-400 text-sky-400 hover:text-sky-300 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-syne font-bold flex items-center gap-1.5 backdrop-blur-md transition-all shadow-xl cursor-pointer disabled:opacity-50"
        >
          {isLocating ? (
            <Radio className="w-3.5 h-3.5 animate-spin text-sky-400" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          <span>{isLocating ? 'Memindai...' : 'Cari Terdekat'}</span>
        </button>

        <button
          onClick={handleRecenter}
          title="Pusatkan Peta Kota Bogor"
          className="bg-black/85 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-syne font-bold flex items-center gap-1 backdrop-blur-md transition-all shadow-xl cursor-pointer"
        >
          <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Pusatkan</span>
        </button>
      </div>

      {/* Map Floating HUD Bottom: Subdistrict Filter Pills (With right margin so it never overlaps zoom controls) */}
      <div className="absolute bottom-3 left-3 right-14 sm:left-4 sm:right-auto z-[400] flex items-center gap-1.5 overflow-x-auto pb-1 max-w-[calc(100vw-5rem)] sm:max-w-2xl scrollbar-none">
        {SUBDISTRICTS.map((sub) => {
          const isSelected =
            (sub === 'Semua' && !activeSubdistrict) || activeSubdistrict === sub;
          return (
            <button
              key={sub}
              onClick={() => onSelectSubdistrict(sub === 'Semua' ? '' : sub)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-syne font-bold whitespace-nowrap transition-all backdrop-blur-md border cursor-pointer ${
                isSelected
                  ? 'bg-zinc-100 text-zinc-950 border-white shadow-lg shadow-white/10'
                  : 'bg-black/85 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-zinc-800'
              }`}
            >
              {sub}
            </button>
          );
        })}
      </div>
    </div>
  );
};
