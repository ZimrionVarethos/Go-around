'use client';

import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMemo } from 'react';

// Fix Leaflet default icon path
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createDraggablePin(): L.DivIcon {
  return L.divIcon({
    className: 'gis-picker-pin',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: grab;
        transform: translateY(-8px);
      ">
        <div style="
          background: #005B54;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 9999px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          border: 1.5px solid white;
          margin-bottom: 2px;
        ">
          Geser pin ke lokasi
        </div>
        <div style="
          width: 32px;
          height: 32px;
          background: #005B54;
          border: 2.5px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 10px rgba(0,91,84,0.4);
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" fill="currentColor" />
          </svg>
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid #005B54;
          margin-top: -1px;
        "></div>
      </div>
    `,
    iconSize: [110, 60],
    iconAnchor: [55, 54],
  });
}

function MapClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
    },
  });
  return null;
}

export interface LocationPickerMapProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

export default function LocationPickerMap({ lat, lng, onChange }: LocationPickerMapProps) {
  const pinIcon = useMemo(() => createDraggablePin(), []);

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={16}
      minZoom={12}
      maxZoom={19}
      className="w-full h-full z-0 cursor-crosshair rounded-xl overflow-hidden"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Radius / Buffer Circle */}
      <Circle
        center={[lat, lng]}
        radius={250}
        pathOptions={{
          color: '#005B54',
          fillColor: '#005B54',
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: '3, 4',
        }}
      />

      <MapClickHandler onChange={onChange} />

      {/* Draggable Spot Pin */}
      <Marker
        position={[lat, lng]}
        draggable={true}
        icon={pinIcon}
        eventHandlers={{
          dragend(e) {
            const marker = e.target;
            const position = marker.getLatLng();
            onChange(Number(position.lat.toFixed(6)), Number(position.lng.toFixed(6)));
          },
        }}
      />
    </MapContainer>
  );
}
