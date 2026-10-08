/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef } from 'react';
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

// Clean Phosphor SVG Icons for Leaflet Markers (CoffeeIcon & PlugChargingIcon)
const SVG_COFFEE = `
  <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
    <path d="M80,56V24a8,8,0,0,1,16,0V56a8,8,0,0,1-16,0Zm40,8a8,8,0,0,0,8-8V24a8,8,0,0,0-16,0V56A8,8,0,0,0,120,64Zm32,0a8,8,0,0,0,8-8V24a8,8,0,0,0-16,0V56A8,8,0,0,0,152,64Zm96,56v8a40,40,0,0,1-37.51,39.91,96.59,96.59,0,0,1-27,40.09H208a8,8,0,0,1,0,16H32a8,8,0,0,1,0-16H56.54A96.3,96.3,0,0,1,24,136V88a8,8,0,0,1,8-8H208A40,40,0,0,1,248,120Zm-16,0a24,24,0,0,0-16-22.62V136a95.78,95.78,0,0,1-1.85,18.75A24,24,0,0,0,232,128V120Z"/>
  </svg>
`;

const SVG_ZAP = `
  <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
    <path d="M224,88H200V40a8,8,0,0,0-16,0V88H144V40a8,8,0,0,0-16,0V88H96V40a8,8,0,0,0-16,0V88H56a16,16,0,0,0-16,16v24a88.14,88.14,0,0,0,72,86.52V240a8,8,0,0,0,16,0V214.52A88.14,88.14,0,0,0,200,128V104h24a8,8,0,0,0,0-16Zm-72.55,51L135,171.89a8,8,0,0,1-14.31-7.16L131.06,144H112a8,8,0,0,1-7.15-11.58l16-32a8,8,0,1,1,14.3,7.16L124.94,128H144a8,8,0,0,1,7.45,11Z"/>
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
  const lastKeyRef = useRef<string>('');
  const map = useMapEvents({
    moveend: () => {
      const b = map.getBounds();
      const next = {
        north: Number(b.getNorth().toFixed(4)),
        south: Number(b.getSouth().toFixed(4)),
        east: Number(b.getEast().toFixed(4)),
        west: Number(b.getWest().toFixed(4)),
      };
      const key = `${next.north}:${next.south}:${next.east}:${next.west}`;
      if (key !== lastKeyRef.current) {
        lastKeyRef.current = key;
        onBoundsChange(next);
      }
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

// Component to smoothly pan the map once when a new place is selected
function MapFlyTo({ selectedSlug, features }: { selectedSlug?: string | null; features: PlaceGeoJsonFeature[] }) {
  const map = useMap();
  const lastFlownSlugRef = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedSlug) {
      lastFlownSlugRef.current = null;
      return;
    }
    if (lastFlownSlugRef.current === selectedSlug) {
      return;
    }
    const target = features.find((f) => f.properties.slug === selectedSlug);
    if (target) {
      lastFlownSlugRef.current = selectedSlug;
      const { lat, lng } = latLngFromFeature(target);
      map.stop();
      map.flyTo([lat, lng], 16, { duration: 0.85 });
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
          <Popup className="custom-leaflet-popup" autoPan={false}>
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
            <Popup className="custom-leaflet-popup" autoPan={false}>
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
