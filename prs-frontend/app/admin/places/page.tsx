'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { AdminTopbar } from '@/components/layout/AdminTopbar';
import { useAdminLayout } from '../layout';
import { useAdminStore, PlaceItem } from '@/lib/admin-store';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';
import {
  PlacesKPIGrid,
  PlacesToolbar,
  PlacesTable,
  PlacesGrid,
  PlacesMobileList,
  PlaceFormModal,
  PlaceFormData,
} from '@/components/admin/places';

export default function AdminPlacesPage() {
  const { openMobileMenu } = useAdminLayout();
  const { toasts, showToast, dismissToast } = useToast();

  const {
    places,
    verifyPlace,
    addPlace,
    updatePlace,
    deletePlace,
  } = useAdminStore();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [quickFilters, setQuickFilters] = useState({
    wifi50: false,
    plug80: false,
    budget25k: false,
    open24h: false,
  });
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modal State
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingPlace, setEditingPlace] = useState<PlaceItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<PlaceFormData>({
    name: '',
    address: '',
    lat: -6.598,
    lng: 106.805,
    wifi: 50,
    plug: 80,
    price: 'Rp 20.000+',
    score: 9.0,
    status: 'verified',
  });

  const toggleQuickFilter = (key: 'wifi50' | 'plug80' | 'budget25k' | 'open24h') => {
    setQuickFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter Logic
  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      // 1. Status Filter
      if (selectedStatus !== 'all' && p.status !== selectedStatus) {
        return false;
      }

      // 2. District Filter
      if (selectedDistrict !== 'all') {
        const matchesDistrict =
          p.district?.toLowerCase().includes(selectedDistrict.toLowerCase()) ||
          p.address.toLowerCase().includes(selectedDistrict.toLowerCase());
        if (!matchesDistrict) return false;
      }

      // 3. Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          (p.district && p.district.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      // 4. Quick Filters
      if (quickFilters.wifi50 && p.wifi < 50) return false;
      if (quickFilters.plug80 && p.plug < 80) return false;
      if (quickFilters.budget25k) {
        const numericPrice = parseInt(p.price.replace(/[^\d]/g, ''), 10);
        if (!isNaN(numericPrice) && numericPrice > 25000) return false;
      }
      if (quickFilters.open24h && !p.is24Hours) return false;

      return true;
    });
  }, [places, selectedStatus, selectedDistrict, searchQuery, quickFilters]);

  // Handlers
  const handleOpenCreate = () => {
    setFormData({
      name: '',
      address: '',
      lat: -6.598,
      lng: 106.805,
      wifi: 60,
      plug: 85,
      price: 'Rp 22.000+',
      score: 9.2,
      status: 'verified',
    });
    setModalMode('create');
  };

  const handleOpenEdit = (place: PlaceItem) => {
    setEditingPlace(place);
    setFormData({
      name: place.name,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
      wifi: place.wifi,
      plug: place.plug,
      price: place.price,
      score: place.score,
      status: place.status,
    });
    setModalMode('edit');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Nama tempat nugas tidak boleh kosong!', 'error');
      return;
    }

    if (modalMode === 'create') {
      const newCode = `KF-0${places.length + 1}`.slice(-6);
      addPlace({
        code: newCode,
        ...formData,
        district: 'Bogor Tengah',
        plugLabel: formData.plug >= 80 ? 'Hampir tiap meja' : 'Cukup memadai',
        priceCategory: 'Ramah Mahasiswa',
        acoustic: 'Kondusif',
      });
      showToast(`Tempat "${formData.name}" berhasil ditambahkan ke master GIS! 🎉`, 'success', 3000);
    } else if (modalMode === 'edit' && editingPlace) {
      updatePlace({ ...editingPlace, ...formData, isUnread: false });
      showToast(`Data "${formData.name}" berhasil diperbarui! 💾`, 'success', 3000);
    }

    setModalMode(null);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus "${name}" dari master data?`)) {
      deletePlace(id);
      showToast(`"${name}" telah dihapus.`, 'info', 2500);
    }
  };

  const handleToggleStatus = (place: PlaceItem) => {
    if (place.status === 'review') {
      verifyPlace(place.id);
      showToast(`Tempat "${place.name}" diverifikasi & disetujui tayang! ✅`, 'success', 2500);
    } else {
      const nextStatus = place.status === 'verified' ? 'review' : 'verified';
      updatePlace({ ...place, status: nextStatus, isUnread: false });
      showToast(
        `Status "${place.name}" diubah ke ${nextStatus === 'verified' ? 'Terverifikasi' : 'Perlu Review'}`,
        'info',
        2500
      );
    }
  };

  const handleBatchVerify = (ids: number[]) => {
    ids.forEach((id) => verifyPlace(id));
    showToast(`${ids.length} tempat nugas berhasil diverifikasi masal! ✅`, 'success', 3000);
  };

  const handleBatchDelete = (ids: number[]) => {
    ids.forEach((id) => deletePlace(id));
    showToast(`${ids.length} tempat nugas berhasil dihapus dari direktori.`, 'info', 3000);
  };

  const handleLocatePlace = (place: PlaceItem) => {
    navigator.clipboard?.writeText?.(`${place.lat}, ${place.lng}`);
    showToast(
      `Koordinat ${place.name} (${place.lat.toFixed(4)}, ${place.lng.toFixed(4)}) disalin! 📍`,
      'info',
      3000
    );
  };

  const handleExportGIS = () => {
    const geojson = {
      type: 'FeatureCollection',
      name: 'GoAround_Bogor_Places',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: places.map((p) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
        properties: {
          id: p.id,
          code: p.code,
          name: p.name,
          address: p.address,
          wifi_speed_mbps: p.wifi,
          plug_percent: p.plug,
          price_range: p.price,
          nugas_score: p.score,
          status: p.status,
        },
      })),
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `goaround_places_postgis_${new Date().toISOString().slice(0, 10)}.geojson`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Dataset GeoJSON PostGIS berhasil diekspor! 📁', 'success', 3000);
  };

  return (
    <div className="flex flex-col min-h-full pb-16 bg-[#F8FAFC]">
      {/* Top Navbar Component matching Figma */}
      <AdminTopbar
        onOpenMobileMenu={openMobileMenu}
        hideDefaultExport={true}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari nama kafe, nama jalan (mis. Pajajaran, Ciheuleut), atau ID spasial..."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportGIS}
              className="bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200/90 text-gray-700 text-xs font-semibold px-3 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden sm:inline">Export GIS</span>
              <span className="sm:hidden">Export</span>
            </button>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="bg-[#005B54] hover:bg-[#004741] active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Data Kafe</span>
              <span className="sm:hidden">Tambah</span>
            </button>
          </div>
        }
      />

      {/* Main Content Body Canvas */}
      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Title Header Section matching Figma */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Kelola Kafe & Spot Nugas
              </h1>
              <span className="bg-[#EFFBF6] text-[#005B54] border border-[#A7F3D0] text-xs font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                Direktori Spasial
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
              Master data direktori spasial, atribut fasilitas WiFi, colokan, harga, koordinat PostGIS,
              dan status verifikasi tayang untuk mahasiswa Kota Bogor.
            </p>
          </div>

          {/* Right Status Pill Badge */}
          <div className="self-start lg:self-center inline-flex items-center gap-2 bg-white border border-gray-200/90 px-3.5 py-1.5 rounded-full shadow-xs text-xs text-gray-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-gray-800">SRS: EPSG:4326 (WGS84)</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-600">Buffer Radius Kampus: Aktif</span>
          </div>
        </div>

        {/* 1. RINGKASAN STATUS DIREKTORI (KPI Bento Metric Cards) */}
        <PlacesKPIGrid
          totalPlaces={places.length}
          verifiedPlaces={places.filter((p) => p.status === 'verified').length}
          reviewPlaces={places.filter((p) => p.status === 'review').length}
        />

        {/* 2. FILTER & TOOLBAR DATA PANEL */}
        <PlacesToolbar
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          quickFilters={quickFilters}
          toggleQuickFilter={toggleQuickFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* 3. TABEL MASTER DATA KAFE KOMPREHENSIF / GRID PETA */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          {viewMode === 'table' ? (
            <>
              <PlacesTable
                places={filteredPlaces}
                totalPlacesCount={places.length}
                hasSearchQuery={!!searchQuery || selectedDistrict !== 'all' || selectedStatus !== 'all'}
                onResetSearch={() => {
                  setSearchQuery('');
                  setSelectedDistrict('all');
                  setSelectedStatus('all');
                  setQuickFilters({
                    wifi50: false,
                    plug80: false,
                    budget25k: false,
                    open24h: false,
                  });
                }}
                onToggleStatus={handleToggleStatus}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onBatchVerify={handleBatchVerify}
                onBatchDelete={handleBatchDelete}
                onLocatePlace={handleLocatePlace}
              />
              <PlacesMobileList
                places={filteredPlaces}
                onToggleStatus={handleToggleStatus}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onLocatePlace={handleLocatePlace}
              />
            </>
          ) : (
            <div className="p-4 sm:p-6">
              <PlacesGrid
                places={filteredPlaces}
                onToggleStatus={handleToggleStatus}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onLocatePlace={handleLocatePlace}
              />
            </div>
          )}
        </div>

        {/* Footer Specification from Figma */}
        <footer className="pt-6 pb-2 border-t border-gray-200/70 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>Go Around – WEB GIS © 2026 Sekolah Vokasi IPB</span>
          </div>
          <button
            type="button"
            onClick={() =>
              showToast(
                'Dokumentasi PostGIS: SRID 4326, buffer spatial radius 300m, integrasi Next.js WebGIS.',
                'info',
                4000
              )
            }
            className="text-gray-500 hover:text-gray-900 font-medium hover:underline cursor-pointer"
          >
            Dokumentasi Teknis
          </button>
        </footer>
      </div>

      {/* Modal Form: Create / Edit Spot */}
      <PlaceFormModal
        isOpen={modalMode !== null}
        mode={modalMode}
        editingPlaceName={editingPlace?.name}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setModalMode(null)}
        onSubmit={handleSaveForm}
      />

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
