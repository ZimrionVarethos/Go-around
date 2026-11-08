'use client';

import { X } from 'lucide-react';

export interface PlaceFormData {
  name: string;
  address: string;
  lat: number;
  lng: number;
  wifi: number;
  plug: number;
  price: string;
  score: number;
  status: 'verified' | 'review' | 'rejected';
}

interface PlaceFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit' | null;
  editingPlaceName?: string;
  formData: PlaceFormData;
  setFormData: React.Dispatch<React.SetStateAction<PlaceFormData>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PlaceFormModal({
  isOpen,
  mode,
  editingPlaceName,
  formData,
  setFormData,
  onClose,
  onSubmit,
}: PlaceFormModalProps) {
  if (!isOpen || !mode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h3 className="text-base font-bold text-gray-900">
            {mode === 'create'
              ? 'Tambah Tempat Nugas Baru'
              : `Edit Data: ${editingPlaceName}`}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Nama Kafe / Working Space *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Kopi Tuya Baranangsiang"
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Alamat Lengkap & Patokan Kampus *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Contoh: Jl. Pajajaran No. 28, Bogor Timur"
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Latitude Spasial
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Longitude Spasial
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Kecepatan WiFi (Mbps)
              </label>
              <input
                type="number"
                value={formData.wifi}
                onChange={(e) => setFormData({ ...formData, wifi: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Ketersediaan Colokan (%)
              </label>
              <input
                type="number"
                value={formData.plug}
                onChange={(e) => setFormData({ ...formData, plug: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Harga Minuman Mulai
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Skor Nugas (0 - 10)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005B54] focus:border-[#005B54]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#005B54] hover:bg-[#004741] active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {mode === 'create' ? 'Simpan Tempat Baru' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
