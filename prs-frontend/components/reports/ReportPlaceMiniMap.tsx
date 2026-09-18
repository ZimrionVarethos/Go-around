'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 16, { animate: true });
  }, [lat, lng, map]);
  return null;
}

function createCafePin(name: string): L.DivIcon {
  return L.divIcon({
    className: 'gis-report-pin',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translateY(-8px);
        cursor: default;
      ">
        <div style="
          background: #005B54;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2.5px 8px;
          border-radius: 9999px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          border: 1.5px solid white;
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
        ">
          ${name}
        </div>
        <div style="
          width: 28px;
          height: 28px;
          background: #005B54;
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 3px 8px rgba(0,91,84,0.4);
          margin-top: 2px;
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" fill="currentColor" />
          </svg>
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 5px solid #005B54;
          margin-top: -1px;
        "></div>
      </div>
    `,
    iconSize: [160, 56],
    iconAnchor: [80, 52],
  });
}

export interface ReportPlaceMiniMapProps {
  lat: number;
  lng: number;
  placeName: string;
}

export default function ReportPlaceMiniMap({ lat, lng, placeName }: ReportPlaceMiniMapProps) {
  const pinIcon = useMemo(() => createCafePin(placeName), [placeName]);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden">
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        minZoom={12}
        maxZoom={19}
        className="w-full h-full z-0 rounded-xl"
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter lat={lat} lng={lng} />
        <Marker position={[lat, lng]} icon={pinIcon} />
      </MapContainer>
    </div>
  );
}
