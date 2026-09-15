'use client';

import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PlaceGeoJsonFeature } from '@/lib/types';
import { formatNugasScore, latLngFromFeature } from '@/lib/utils';

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

// Isochrone / Suitability zones in Bogor matching Figma spatial polygon overlays
const SUITABILITY_ZONE_1: [number, number][] = [
  [-6.592, 106.801],
  [-6.590, 106.812],
  [-6.602, 106.818],
  [-6.608, 106.809],
  [-6.604, 106.798],
];

const SUITABILITY_ZONE_2: [number, number][] = [
  [-6.605, 106.797],
  [-6.608, 106.808],
  [-6.618, 106.809],
  [-6.617, 106.796],
];

export interface MapViewProps {
  features: PlaceGeoJsonFeature[];
  selectedSlug: string | null;
  onMarkerClick: (slug: string) => void;
  onBoundsChange: (bounds: { north: number; south: number; east: number; west: number }) => void;
}

// Centered on Baranangsiang / IPB University district
const BOGOR_CENTER: [number, number] = [-6.601, 106.806];

export default function MapView({
  features,
  selectedSlug,
  onMarkerClick,
  onBoundsChange,
}: MapViewProps) {
  return (
    <MapContainer
      center={BOGOR_CENTER}
      zoom={15}
      minZoom={12}
      maxZoom={18}
      className="w-full h-full z-0"
      zoomControl={false}
    >
      {/* Clean OSM tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {/* Spatial Polygon Overlays from Figma */}
      <Polygon
        positions={SUITABILITY_ZONE_1}
        pathOptions={{
          color: '#10B981',
          weight: 2,
          opacity: 0.8,
          fillColor: '#10B981',
          fillOpacity: 0.12,
        }}
      />
      <Polygon
        positions={SUITABILITY_ZONE_2}
        pathOptions={{
          color: '#F59E0B',
          weight: 1.5,
          opacity: 0.7,
          dashArray: '4, 4',
          fillColor: '#F59E0B',
          fillOpacity: 0.08,
        }}
      />

      <BoundsTracker onBoundsChange={onBoundsChange} />

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
