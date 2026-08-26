'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { GeoJsonFeature } from '@/types/place';
import { Loader2 } from 'lucide-react';

const MapInner = dynamic(
  () => import('./MapInner').then((mod) => mod.MapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black text-zinc-500 gap-3 min-h-[380px] sm:min-h-[500px]">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        <span className="text-xs font-mono tracking-wider uppercase text-zinc-400">Loading Mapcn Dark Engine...</span>
      </div>
    ),
  }
);

interface MapComponentProps {
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

export const MapComponent: React.FC<MapComponentProps> = (props) => {
  return <MapInner {...props} />;
};
