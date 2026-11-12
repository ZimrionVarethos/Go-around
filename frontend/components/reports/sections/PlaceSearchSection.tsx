'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  MagnifyingGlassIcon,
  XIcon,
  BuildingsIcon,
  MapPinIcon,
  CompassIcon,
  CheckIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react';
import { cn } from '@/lib/cn';
import type { PlaceListItem } from '@/lib/types';

// Dynamic import Leaflet mini map (SSR false)
const ReportPlaceMiniMap = dynamic(() => import('../ReportPlaceMiniMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[200px] bg-[#F6F4ED] rounded-xl flex flex-col items-center justify-center gap-2 border border-gray-200">
      <div className="w-7 h-7 rounded-full border-2 border-[#005B54] border-t-transparent animate-spin" />
      <span className="text-xs font-semibold text-gray-500">Memuat visual spasial peta...</span>
    </div>
  ),
});

interface PlaceSearchSectionProps {
  places: PlaceListItem[];
  selectedPlace: PlaceListItem | null;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  onSelectPlace: (place: PlaceListItem) => void;
  onClearPlace: () => void;
  onCustomPlace: (customName: string) => void;
}

export function PlaceSearchSection({
  places,
  selectedPlace,
  searchQuery,
  onSearchQueryChange,
  onSelectPlace,
  onClearPlace,
  onCustomPlace,
}: PlaceSearchSectionProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPlaces = searchQuery.trim()
    ? places.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.subdistrict.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : places;

  return (
    <section className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-7 space-y-5">
      {/* Header with Step 1 Badge */}
      <div className="flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
          1
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            Pilih Identitas Cafe / Spot Nugas
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Ketik nama kafe terdaftar atau tentukan tempat yang fasilitasnya bermasalah
          </p>
        </div>
      </div>

      {/* Searchable Autocomplete Combobox */}
      <div className="space-y-2" ref={searchContainerRef}>
        <label className="text-xs font-bold text-gray-800">
          Nama Tempat / Kafe Terdaftar <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MagnifyingGlassIcon size={16} weight="bold" className="text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchQueryChange(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Cari kafe... (cth: Maraca, Popolo, Kopi Nako, Awal Mula)"
            className="w-full h-11 pl-10 pr-10 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:border-[#005B54] transition-all shadow-2xs placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                onClearPlace();
                setIsSearchOpen(true);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              title="Hapus pencarian"
            >
              <XIcon size={16} weight="bold" />
            </button>
          )}

          {/* Recommendations Dropdown Menu */}
          {isSearchOpen && (
            <div className="absolute top-full mt-1.5 left-0 right-0 z-40 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto p-1.5 space-y-0.5">
              <div className="px-2.5 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Rekomendasi Kafe Terdaftar ({filteredPlaces.length})
              </div>

              {filteredPlaces.length > 0 ? (
                filteredPlaces.map((place) => {
                  const isCurrent = selectedPlace?.id === place.id;
                  return (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => {
                        onSelectPlace(place);
                        setIsSearchOpen(false);
                      }}
                      className={cn(
                        'w-full text-left p-2.5 rounded-lg flex items-start justify-between gap-3 transition-colors cursor-pointer',
                        isCurrent
                          ? 'bg-[#F0FAF7] text-[#005B54]'
                          : 'hover:bg-gray-50 text-gray-800'
                      )}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <BuildingsIcon
                          size={16}
                          weight="duotone"
                          className={cn(
                            'shrink-0 mt-0.5',
                            isCurrent ? 'text-[#005B54]' : 'text-gray-400'
                          )}
                        />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold truncate">{place.name}</p>
                          <p className="text-xs text-gray-500 truncate">{place.address}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-[#005B54]">
                          {place.wifi_speed_mbps ? `${place.wifi_speed_mbps} Mbps` : place.subdistrict}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-3 text-center text-xs text-gray-500">
                  Tidak ada kafe yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
                </div>
              )}

              {/* Custom place option */}
              <div className="border-t border-gray-100 pt-1 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    onCustomPlace(searchQuery);
                    setIsSearchOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-lg text-xs text-[#005B54] hover:bg-[#F0FAF7] font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <MapPinIcon size={14} weight="fill" />
                  <span>
                    Gunakan &quot;{searchQuery || 'Nama Kafe Baru'}&quot; (Kafe belum terdaftar di WebGIS)
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real Leaflet Mini Map Preview */}
      <div className="space-y-2.5">
        <div className="h-[180px] sm:h-[200px] rounded-xl overflow-hidden border border-gray-200 shadow-2xs relative">
          <ReportPlaceMiniMap
            lat={selectedPlace ? selectedPlace.latitude : -6.5971}
            lng={selectedPlace ? selectedPlace.longitude : 106.7996}
            placeName={selectedPlace ? selectedPlace.name : 'Kota Bogor (Belum dipilih)'}
          />
        </div>

        {/* Genuine Spatial Coordinates & Location Bar */}
        <div className="p-3.5 bg-[#F8FAFC] border border-gray-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <CompassIcon size={16} weight="duotone" className="text-[#005B54] shrink-0" />
            <div className="min-w-0">
              {selectedPlace ? (
                <>
                  <span className="font-mono font-bold text-gray-800 text-xs block truncate">
                    {selectedPlace.latitude.toFixed(6)}° S, {selectedPlace.longitude.toFixed(6)}° E
                  </span>
                  <span className="text-xs text-gray-500 block truncate">
                    {selectedPlace.address}
                  </span>
                </>
              ) : (
                <>
                  <span className="font-semibold text-gray-700 text-xs block">
                    Titik Koordinat Spasial WebGIS
                  </span>
                  <span className="text-xs text-gray-500 block">
                    Pilih kafe pada kolom pencarian di atas untuk melihat titik lokasi pada peta
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 sm:self-center">
            {selectedPlace ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E0F3EE] text-[#005B54] text-xs font-bold border border-[#005B54]">
                <CheckIcon size={14} weight="bold" />
                <span>Terhubung ke Peta WebGIS</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200/60">
                <WarningCircleIcon size={14} weight="fill" />
                <span>Menunggu Pilihan Kafe</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
