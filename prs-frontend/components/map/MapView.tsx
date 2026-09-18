/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, Polyline, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PlaceGeoJsonFeature } from '@/lib/types';
import { formatNugasScore, latLngFromFeature } from '@/lib/utils';
import type { TileLayerType, SpatialOverlays } from './MapControls';

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

const SVG_GRAD_CAP = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21.42 10.922a1 1 0 0 0-.019-.838L12.83 2.18a2 2 0 0 0-1.66 0L2.6 10.08a1 1 0 0 0 0 1.832l8.57 7.908a2 2 0 0 0 1.66 0l8.57-7.9a1 1 0 0 0 .02-.998Z"/>
    <path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>
  </svg>
`;

const SVG_BUS = `
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 6v6"/><path d="M16 6v6"/><path d="M4 18v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3"/><path d="M17 18v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3"/>
    <rect width="16" height="16" x="4" y="2" rx="2"/><path d="M4 10h16"/><path d="M8 14h.01"/><path d="M16 14h.01"/>
  </svg>
`;

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

  // Unselected Pin: circle icon matching Figma (Coffee orange or Zap teal)
  const isCoffee = iconType === 'coffee' || score < 90;
  const bgColor = isCoffee ? '#F97316' : '#005B54';
  const iconSvg = isCoffee ? SVG_COFFEE : SVG_ZAP;

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

// Custom Pin for IPB Baranangsiang Campus with SVG icon
const IPB_CAMPUS_PIN = L.divIcon({
  className: 'custom-ipb-pin',
  html: `
    <div style="
      display: flex;
      align-items: center;
      gap: 6px;
      background: #005B54;
      color: #ffffff;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 800;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 4px 12px rgba(0, 91, 84, 0.45);
      border: 2px solid white;
      white-space: nowrap;
      cursor: pointer;
    ">
      <span style="display: flex; align-items: center;">${SVG_GRAD_CAP}</span>
      <span>Kampus IPB Baranangsiang</span>
    </div>
  `,
  iconSize: [180, 28],
  iconAnchor: [90, 14],
  popupAnchor: [0, -18],
});

// Pedestrian 10-Minute Isochrone Walk Shed (~800m network distance)
const ISOCHRONE_PEDESTRIAN_10MIN: [number, number][] = [
  [-6.5945, 106.8035],
  [-6.5960, 106.8105],
  [-6.6002, 106.8130],
  [-6.6055, 106.8120],
  [-6.6085, 106.8075],
  [-6.6068, 106.8015],
  [-6.6018, 106.7990],
  [-6.5970, 106.8002],
];

// Cafe / Study Hotspot Density Clusters
const DENSITY_CLUSTERS: { name: string; center: [number, number]; radius: number; count: number; desc: string }[] = [
  {
    name: 'Klaster Babakan & Lodaya',
    center: [-6.5955, 106.8065],
    radius: 360,
    count: 18,
    desc: 'Konsentrasi cafe mahasiswa SV IPB & coworking space',
  },
  {
    name: 'Klaster Pajajaran & Sukasari',
    center: [-6.6035, 106.8115],
    radius: 320,
    count: 14,
    desc: 'Akses koridor utama & banyak cafe 24 jam',
  },
  {
    name: 'Klaster Pandu Raya / Tegal Gundil',
    center: [-6.5860, 106.8110],
    radius: 340,
    count: 12,
    desc: 'Sentra kuliner & tempat nugas tenang Bogor Utara',
  },
  {
    name: 'Klaster Suryakencana & Batutulis',
    center: [-6.6110, 106.8035],
    radius: 280,
    count: 9,
    desc: 'Heritage cafe & spot nugas estetik',
  },
];

// Biskita Transpakuan Public Transit Corridor
const BISKITA_CORRIDOR: [number, number][] = [
  [-6.5815, 106.8090],
  [-6.5890, 106.8080],
  [-6.5955, 106.8070],
  [-6.6010, 106.8060],
  [-6.6045, 106.8010],
  [-6.6010, 106.7940],
  [-6.5935, 106.7915],
  [-6.5885, 106.7970],
  [-6.5925, 106.8055],
];

const BISKITA_STOPS: { name: string; position: [number, number]; koridor: string; desc: string }[] = [
  { name: 'Halte Biskita Baranangsiang', position: [-6.6015, 106.8065], koridor: 'Koridor 1 & 2', desc: 'Dekat Tugu Kujang & Kampus IPB' },
  { name: 'Halte Biskita IPB Pajajaran', position: [-6.5960, 106.8072], koridor: 'Koridor 1', desc: 'Akses ke cafe Jl. Lodaya & Kumbang' },
  { name: 'Halte Biskita PMI / RS PMI', position: [-6.6005, 106.8032], koridor: 'Koridor 2', desc: 'Dekat Kebun Raya & Botani Square' },
  { name: 'Halte Biskita Balai Kota Bogor', position: [-6.5888, 106.7972], koridor: 'Koridor 1', desc: 'Akses Taman Sempur & Jalur SSA' },
  { name: 'Halte Biskita Stasiun Bogor', position: [-6.5938, 106.7918], koridor: 'Koridor 2', desc: 'Integrasi KRL Commuter Line' },
];

const BISKITA_STOP_PIN = L.divIcon({
  className: 'custom-biskita-pin',
  html: `
    <div style="
      width: 24px;
      height: 24px;
      border-radius: 9999px;
      background: #0284C7;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(2, 132, 199, 0.45);
      cursor: pointer;
    ">
      ${SVG_BUS}
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -14],
});

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
  spatialOverlays?: SpatialOverlays;
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
  spatialOverlays,
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

      {/* Campus Pin IPB Baranangsiang */}
      <Marker position={BOGOR_CENTER} icon={IPB_CAMPUS_PIN}>
        <Popup className="custom-leaflet-popup">
          <div className="p-1 font-sans">
            <p className="font-bold text-xs text-[#005B54]">Kampus IPB Baranangsiang</p>
            <p className="text-[11px] text-gray-500">Pusat Kajian &amp; Titik Temu Mahasiswa</p>
          </div>
        </Popup>
      </Marker>

      {/* 1. Spatial Overlay: Buffer Jangkauan IPB (500m & 1000m) */}
      {spatialOverlays?.buffer && (
        <>
          <Circle
            center={BOGOR_CENTER}
            radius={1000}
            pathOptions={{
              color: '#005B54',
              fillColor: '#005B54',
              fillOpacity: 0.05,
              weight: 1.5,
              dashArray: '6, 6',
            }}
          >
            <Tooltip direction="top" opacity={0.85}>
              <span className="font-sans text-xs">Radius 1000m (Jangkauan Berkendara 5 Menit)</span>
            </Tooltip>
          </Circle>

          <Circle
            center={BOGOR_CENTER}
            radius={500}
            pathOptions={{
              color: '#005B54',
              fillColor: '#005B54',
              fillOpacity: 0.12,
              weight: 2,
              dashArray: '4, 4',
            }}
          >
            <Tooltip direction="top" opacity={0.85}>
              <span className="font-sans text-xs font-semibold">Radius 500m (Sangat Dekat dari Kampus)</span>
            </Tooltip>
          </Circle>
        </>
      )}

      {/* 2. Spatial Overlay: Isochrone 10 Menit Jalan Kaki */}
      {spatialOverlays?.isochrone && (
        <Polygon
          positions={ISOCHRONE_PEDESTRIAN_10MIN}
          pathOptions={{
            color: '#005B54',
            fillColor: '#005B54',
            fillOpacity: 0.16,
            weight: 2.5,
            dashArray: '3, 3',
          }}
        >
          <Tooltip direction="center" opacity={0.9} sticky>
            <div className="font-sans text-xs p-0.5">
              <p className="font-bold text-[#005B54]">Isochrone 10 Menit</p>
              <p className="text-[11px] text-gray-600">Jangkauan jalan kaki santai mahasiswa (~800m)</p>
            </div>
          </Tooltip>
        </Polygon>
      )}

      {/* 3. Spatial Overlay: Heatmap / Klaster Kepadatan Kafe */}
      {spatialOverlays?.heatmap && (
        <>
          {DENSITY_CLUSTERS.map((cluster) => (
            <Circle
              key={cluster.name}
              center={cluster.center}
              radius={cluster.radius}
              pathOptions={{
                color: '#F97316',
                fillColor: '#F97316',
                fillOpacity: 0.14,
                weight: 2,
                dashArray: '4, 4',
              }}
            >
              <Tooltip direction="top" opacity={0.9}>
                <div className="font-sans text-xs">
                  <span className="font-bold text-gray-900 block">{cluster.name}</span>
                  <span className="text-[11px] text-gray-600">{cluster.count} spot nugas &bull; {cluster.desc}</span>
                </div>
              </Tooltip>
            </Circle>
          ))}
        </>
      )}

      {/* 4. Spatial Overlay: Halte & Rute Biskita Transpakuan */}
      {spatialOverlays?.transit && (
        <>
          {/* Corridor Line */}
          <Polyline
            positions={BISKITA_CORRIDOR}
            pathOptions={{
              color: '#0284C7',
              weight: 4,
              opacity: 0.85,
              dashArray: '6, 6',
            }}
          >
            <Tooltip direction="center" opacity={0.9} sticky>
              <div className="font-sans text-xs font-semibold text-sky-950">
                Rute Koridor Biskita Transpakuan (Pajajaran - SSA)
              </div>
            </Tooltip>
          </Polyline>

          {/* Stops Markers */}
          {BISKITA_STOPS.map((stop) => (
            <Marker key={stop.name} position={stop.position} icon={BISKITA_STOP_PIN}>
              <Popup className="custom-leaflet-popup">
                <div className="p-1 font-sans">
                  <p className="text-xs font-bold text-sky-800 flex items-center gap-1">
                    {stop.name}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{stop.koridor} &bull; {stop.desc}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </>
      )}

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
