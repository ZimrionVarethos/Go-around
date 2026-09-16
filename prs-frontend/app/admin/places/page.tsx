'use client';

import { useState } from 'react';
import { Plus, Search, Check } from 'lucide-react';
import { AdminTopbar } from '@/components/layout/AdminTopbar';
import { useAdminLayout } from '../layout';
import { useAdminStore, PlaceItem } from '@/lib/admin-store';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { cn } from '@/lib/cn';
import {
  PlacesTable,
  PlacesMobileList,
  PlaceFormModal,
  PlaceFormData,
} from '@/components/admin/places';

export default function AdminPlacesPage() {
  const { openMobileMenu } = useAdminLayout();
  const { toasts, showToast, dismissToast } = useToast();

  const {
    places,
    newPlacesCount,
    markAllPlacesAsReviewed,
    verifyPlace,
    addPlace,
    updatePlace,
    deletePlace,
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
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

  // Filter
  const filteredPlaces = places.filter((p) => {
    const matchStatus = selectedStatus === 'all' || p.status === selectedStatus;
    const matchSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

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
      showToast(`Tempat "${place.name}" diverifikasi & disetujui! ✅`, 'success', 2500);
    } else {
      const nextStatus = place.status === 'verified' ? 'review' : 'verified';
      updatePlace({ ...place, status: nextStatus, isUnread: false });
      showToast(
        `Status ${place.name} diubah ke ${nextStatus === 'verified' ? 'Terverifikasi' : 'Dalam Review'}`,
        'info',
        2500
      );
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-12">
      <AdminTopbar
        title="Kelola Tempat Nugas"
        subtitle="Master basis data spasial tempat nugas dan kafe ramah kantong Kota Bogor"
        onOpenMobileMenu={openMobileMenu}
        actions={
          <div className="flex items-center gap-2">
            {newPlacesCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  markAllPlacesAsReviewed();
                  showToast('Semua usulan tempat nugas telah ditandai sudah ditinjau! 👍', 'success', 2500);
                }}
                className="bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Tandai Ditinjau ({newPlacesCount})</span>
                <span className="sm:hidden">Tinjau</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleOpenCreate}
              className="bg-[#005B54] hover:bg-[#004741] active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Tempat Nugas</span>
              <span className="sm:hidden">Tambah</span>
            </button>
          </div>
        }
      />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Controls Toolbar */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama kafe, kode, atau alamat..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54] transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl shrink-0 overflow-x-auto">
            {[
              { id: 'all', label: `Semua (${places.length})` },
              { id: 'verified', label: `Terverifikasi (${places.filter((p) => p.status === 'verified').length})` },
              { id: 'review', label: `Perlu Review (${places.filter((p) => p.status === 'review').length})` },
              { id: 'rejected', label: `Ditolak (${places.filter((p) => p.status === 'rejected').length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStatus(tab.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
                  selectedStatus === tab.id
                    ? 'bg-white text-[#005B54] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Table & Mobile Cards */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          <PlacesTable
            places={filteredPlaces}
            totalPlacesCount={places.length}
            hasSearchQuery={!!searchQuery}
            onResetSearch={() => setSearchQuery('')}
            onToggleStatus={handleToggleStatus}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
          <PlacesMobileList
            places={filteredPlaces}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        </div>
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
