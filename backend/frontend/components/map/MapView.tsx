/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PlaceGeoJsonFeature } from '@/lib/types';
import { formatNugasScore, getScoreTier, latLngFromFeature } from '@/lib/utils';
import type { TileLayerType } from './MapControls';

// Fix Leaflet default icon path issue with Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Clean SVG Icons for Leaflet Markers (No OS Emojis)
const SVG_COFFEE = `
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12Z"/>
    <path d="M6 2v2"/><path d="M17 11h1a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3h-1"/>
  </svg>
`;

const SVG_ZAP = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
`;

// Custom Pins matching Figma & Map Legend 4 Tiers
function createPinIcon(
  score: number | null,
  isSelected: boolean,
  iconType?: string,
  isRecommendation = false,
): L.DivIcon {
  const displayScore = score === null
    ? '—'
    : isRecommendation
      ? `${Math.round(score)}%`
      : formatNugasScore(score);

  const tier = getScoreTier(score);
  const bgColor = tier.color;

  if (isSelected) {
    // Selected Pin: Tier-colored pill with percentage and glowing ring, NO confusing stars
    return L.divIcon({
      className: 'custom-selected-pin',
      html: `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transform: scale(1.12);
          filter: drop-shadow(0 4px 10px rgba(0, 91, 84, 0.45));
          z-index: 1000;
        ">
          <div style="
            background: ${bgColor};
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 11px;
            font-weight: 800;
            padding: 4px 10px;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            gap: 3px;
            border: 2px solid white;
            box-shadow: 0 0 0 3px rgba(0, 91, 84, 0.25);
            white-space: nowrap;
          ">
            <span>${displayScore}</span>
            <span style="font-size: 9px; opacity: 0.85; font-weight: 600;">${isRecommendation ? 'cocok' : 'skor'}</span>
          </div>
          <div style="
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 7px solid ${bgColor};
            margin-top: -1px;
          "></div>
        </div>
      `,
      iconSize: [80, 42],
      iconAnchor: [40, 40],
      popupAnchor: [0, -38],
    });
  }

  // Unselected Pin: circle teardrop icon colored strictly according to 4-tier score
  const isCoffee = iconType === 'coffee';
  const iconSvg = isCoffee ? SVG_COFFEE : SVG_ZAP;
  const isMuted = score !== null && (score <= 10 ? score * 10 : score) < 50;

  return L.divIcon({
    className: 'custom-marker-pin',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        opacity: ${isMuted ? '0.75' : '1'};
        filter: drop-shadow(0 2px 6px rgba(0,0,0,0.22));
        transition: transform 0.15s ease;
      ">
        <div style="
          width: 30px;
          height: 30px;
          background: ${bgColor};
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        ">
          ${iconSvg}
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 5px solid ${bgColor};
          margin-top: -1px;
        "></div>
      </div>
    `,
    iconSize: [32, 38],
    iconAnchor: [16, 36],
    popupAnchor: [0, -34],
  });
}

// BoundsTracker to notify parent when map moves
function BoundsTracker({
  onBoundsChange,
}: {
  onBoundsChange: (bounds: { north: number; south: number; east: number; west: number }) => void;
}) {
  const map = useMapEvents({
    moveend: () => {
      const b = map.getBounds();
      onBoundsChange({
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
      });
    },
  });
  return null;
}

// Tile Layer configurations
const TILE_LAYERS: Record<TileLayerType, { url: string; attribution: string; maxZoom: number }> = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics',
    maxZoom: 19,
  },
  carto: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 19,
  },
};

// Pulse radar pin for user GPS position
const USER_LOCATION_PIN = L.divIcon({
  className: 'custom-user-location-pin',
  html: `
    <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; inset: 0; border-radius: 9999px; background: rgba(2, 132, 199, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="width: 14px; height: 14px; border-radius: 9999px; background: #0284C7; border: 2.5px solid #FFFFFF; box-shadow: 0 2px 6px rgba(0,0,0,0.35);"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Component to emit map instance to parent & attach to container
function MapReadyEmitter({ onMapReady }: { onMapReady?: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    try {
      const container = map.getContainer() as HTMLElement & { _leaflet_map?: L.Map };
      if (container) {
        container._leaflet_map = map;
      }
    } catch {
      // ignore
    }
    if (onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);
  return null;
}

// Component to smoothly pan the map when a place is selected
function MapFlyTo({ selectedSlug, features }: { selectedSlug?: string | null; features: PlaceGeoJsonFeature[] }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedSlug) return;
    const target = features.find((f) => f.properties.slug === selectedSlug);
    if (target) {
      const { lat, lng } = latLngFromFeature(target);
      map.flyTo([lat, lng], 16, { duration: 1.2 });
    }
  }, [selectedSlug, features, map]);
  return null;
}

export interface MapViewProps {
  features: PlaceGeoJsonFeature[];
  selectedSlug?: string | null;
  onMarkerClick: (slug: string) => void;
  onBoundsChange: (bounds: { north: number; south: number; east: number; west: number }) => void;
  tileLayer?: TileLayerType;
  userLocation?: [number, number] | null;
  onMapReady?: (map: L.Map) => void;
}

// Baranangsiang / IPB University center coordinate
export const BOGOR_CENTER: [number, number] = [-6.601, 106.806];

export default function MapView({
  features,
  selectedSlug,
  onMarkerClick,
  onBoundsChange,
  tileLayer = 'osm',
  userLocation,
  onMapReady,
}: MapViewProps) {
  const currentTile = TILE_LAYERS[tileLayer] ?? TILE_LAYERS.osm;

  return (
    <MapContainer
      center={BOGOR_CENTER}
      zoom={15}
      minZoom={11}
      maxZoom={19}
      zoomControl={false}
      className="w-full h-full relative z-0 outline-none"
      style={{ minHeight: '100%' }}
    >
      <TileLayer
        key={tileLayer}
        url={currentTile.url}
        attribution={currentTile.attribution}
        maxZoom={currentTile.maxZoom}
      />

      <BoundsTracker onBoundsChange={onBoundsChange} />
      <MapReadyEmitter onMapReady={onMapReady} />
      <MapFlyTo selectedSlug={selectedSlug} features={features} />

      {/* User GPS location pin */}
      {userLocation && (
        <Marker position={userLocation} icon={USER_LOCATION_PIN}>
          <Popup className="custom-leaflet-popup">
            <div className="p-1 font-sans text-xs">
              <p className="font-bold text-sky-700">
                Lokasi Anda Saat Ini
              </p>
              <p className="text-gray-500 text-[11px] mt-0.5">
                Koordinat: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
      )}

      {features.map((feature, idx) => {
        const { lat, lng } = latLngFromFeature(feature);
        const {
          slug,
          name,
          nugas_score,
          recommendation_score,
          subdistrict,
          image_url,
        } = feature.properties;
        const isSelected = slug === selectedSlug;
        const isRecommendation = recommendation_score !== undefined;
        const markerScore = isRecommendation ? recommendation_score ?? null : nugas_score;
        const iconType = idx % 2 === 0 ? 'coffee' : 'zap';

        const tier = getScoreTier(markerScore);

        return (
          <Marker
            key={feature.id}
            position={[lat, lng]}
            icon={createPinIcon(markerScore, isSelected, iconType, isRecommendation)}
            zIndexOffset={isSelected ? 1000 : Math.round(markerScore ?? 0)}
            eventHandlers={{
              click: () => onMarkerClick(slug),
            }}
          >
            <Popup className="custom-leaflet-popup">
              <div
                onClick={() => onMarkerClick(slug)}
                className="cursor-pointer min-w-[180px] p-1 font-sans"
              >
                {image_url && (
                  <img
                    src={image_url}
                    alt={name}
                    className="w-full h-20 rounded-lg object-cover mb-2 border border-gray-100"
                  />
                )}
                <p className="text-xs font-bold text-gray-900 line-clamp-1">{name}</p>
                <p className="text-[11px] text-gray-500 line-clamp-1 mb-1.5">{subdistrict}</p>
                <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px]">
                  <span
                    className="font-bold text-xs"
                    style={{ color: tier.color }}
                  >
                    {markerScore === null
                      ? 'Skor belum tersedia'
                      : isRecommendation
                        ? `${Math.round(markerScore)}% cocok`
                        : `${formatNugasScore(markerScore)} skor`}
                  </span>
                  <span className="text-gray-400 font-medium text-[10px]">Detail →</span>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
