/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PlaceGeoJsonFeature } from '@/lib/types';
import { formatNugasScore, latLngFromFeature } from '@/lib/utils';
import type { TileLayerType } from './MapControls';

// Fix Leaflet default icon path issue with Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom Pins matching Figma
function createPinIcon(score: number, isSelected: boolean, iconType?: string): L.DivIcon {
  const displayScore = formatNugasScore(score);

  if (isSelected) {
    // Figma Selected Pin: ★ 9.7 with dark teal circle & glowing ring
    return L.divIcon({
      className: 'custom-selected-pin',
      html: `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transform: scale(1.1);
          filter: drop-shadow(0 4px 10px rgba(0, 91, 84, 0.4));
        ">
          <div style="
            background: #005B54;
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 11.5px;
            font-weight: 800;
            padding: 4px 10px;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            gap: 3px;
            border: 2px solid white;
            box-shadow: 0 0 0 3px #A7F3D0;
            white-space: nowrap;
          ">
            <span style="color: #FDE68A; font-size: 11px;">★</span>
            <span>${displayScore}</span>
          </div>
          <div style="
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 7px solid #005B54;
            margin-top: -1px;
          "></div>
        </div>
      `,
      iconSize: [64, 40],
      iconAnchor: [32, 38],
      popupAnchor: [0, -36],
    });
  }

  // Unselected Pin: circle icon matching Figma (Coffee orange, Zap teal, or WiFi)
  const isCoffee = iconType === 'coffee' || score < 9.0;
  const bgColor = isCoffee ? '#F97316' : '#005B54';
  const iconEmoji = isCoffee ? '☕' : '⚡';

  return L.divIcon({
    className: 'custom-marker-pin',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        filter: drop-shadow(0 2px 6px rgba(0,0,0,0.25));
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
          font-size: 13px;
          color: white;
        ">
          ${iconEmoji}
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
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO',
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

export interface MapViewProps {
  features: PlaceGeoJsonFeature[];
  selectedSlug: string | null;
  onMarkerClick: (slug: string) => void;
  onBoundsChange: (bounds: { north: number; south: number; east: number; west: number }) => void;
  tileLayer?: TileLayerType;
  userLocation?: [number, number] | null;
  onMapReady?: (map: L.Map) => void;
}

// Centered on Baranangsiang / IPB University district
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
      minZoom={12}
      maxZoom={18}
      className="w-full h-full z-0"
      zoomControl={false}
    >
      {/* Dynamic Tile Layer */}
      <TileLayer
        key={tileLayer}
        attribution={currentTile.attribution}
        url={currentTile.url}
        maxZoom={currentTile.maxZoom}
      />

      <MapReadyEmitter onMapReady={onMapReady} />
      <BoundsTracker onBoundsChange={onBoundsChange} />

      {/* User GPS location pin */}
      {userLocation && (
        <Marker position={userLocation} icon={USER_LOCATION_PIN}>
          <Popup className="custom-leaflet-popup">
            <div className="p-1 font-sans text-xs">
              <p className="font-bold text-sky-700 flex items-center gap-1">
                <span>📍</span> Lokasi Anda Saat Ini
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
        const { slug, name, nugas_score, subdistrict, image_url } = feature.properties;
        const isSelected = slug === selectedSlug || (selectedSlug === null && idx === 0);
        const iconType = idx % 2 === 0 ? 'coffee' : 'zap';

        return (
          <Marker
            key={feature.id}
            position={[lat, lng]}
            icon={createPinIcon(nugas_score, isSelected, iconType)}
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
                  <span className="font-semibold text-[#005B54]">
                    ★ {formatNugasScore(nugas_score)} / 10
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
