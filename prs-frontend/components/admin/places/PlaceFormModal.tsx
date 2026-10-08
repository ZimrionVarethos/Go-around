'use client';

import { X } from 'lucide-react';
import { formatStarRating, formatNugasScore } from '@/lib/utils';

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
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl border border-[#E2E5DF] shadow-tinted-teal overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 border-b border-[#E2E5DF] bg-[#F8F9F7] flex items-center justify-between shrink-0">
          <h3 className="text-base font-bold text-text-950 tracking-tight">
            {mode === 'create'
              ? 'Tambah Titik Kafe / Tempat Nugas'
              : `Edit Atribut: ${editingPlaceName}`}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-400 hover:text-text-700 hover:bg-[#F0F2EE] transition-colors cursor-pointer tactile-press"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="text-xs font-semibold text-text-700 block mb-1">
              Nama Kafe / Working Space *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Kopi Tuya Baranangsiang"
              className="w-full h-9 px-3 text-xs bg-white border border-[#E2E5DF] rounded-lg text-text-900 placeholder:text-text-500 focus:outline-none focus:ring-2 focus:ring-[#005B54]/15 focus:border-[#005B54] transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-text-700 block mb-1">
              Alamat Lengkap &amp; Koridor Kampus *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Contoh: Jl. Pajajaran No. 28, Bogor Timur"
              className="w-full h-9 px-3 text-xs bg-white border border-[#E2E5DF] rounded-lg text-text-900 placeholder:text-text-500 focus:outline-none focus:ring-2 focus:ring-[#005B54]/15 focus:border-[#005B54] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-text-700 block mb-1">
                Latitude (EPSG:4326)
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                className="w-full h-9 px-3 text-xs font-mono tabular-nums bg-white border border-[#E2E5DF] rounded-lg text-text-900 focus:outline-none focus:ring-2 focus:ring-[#005B54]/15 focus:border-[#005B54] transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-700 block mb-1">
                Longitude (EPSG:4326)
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                className="w-full h-9 px-3 text-xs font-mono tabular-nums bg-white border border-[#E2E5DF] rounded-lg text-text-900 focus:outline-none focus:ring-2 focus:ring-[#005B54]/15 focus:border-[#005B54] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-text-700 block mb-1">
                Kecepatan Wi-Fi (Mbps)
              </label>
              <input
                type="number"
                value={formData.wifi}
                onChange={(e) => setFormData({ ...formData, wifi: parseInt(e.target.value) || 0 })}
                className="w-full h-9 px-3 text-xs tabular-nums bg-white border border-[#E2E5DF] rounded-lg text-text-900 focus:outline-none focus:ring-2 focus:ring-[#005B54]/15 focus:border-[#005B54] transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-700 block mb-1">
                Ketersediaan Colokan (%)
              </label>
              <input
                type="number"
                value={formData.plug}
                onChange={(e) => setFormData({ ...formData, plug: parseInt(e.target.value) || 0 })}
                className="w-full h-9 px-3 text-xs tabular-nums bg-white border border-[#E2E5DF] rounded-lg text-text-900 focus:outline-none focus:ring-2 focus:ring-[#005B54]/15 focus:border-[#005B54] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-text-700 block mb-1">
                Harga Minuman Mulai
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full h-9 px-3 text-xs bg-white border border-[#E2E5DF] rounded-lg text-text-900 focus:outline-none focus:ring-2 focus:ring-[#005B54]/15 focus:border-[#005B54] transition-all"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-text-700">
                  Skor Internal (0-10)
                </label>
                <span className="text-[10px] font-semibold text-[#005B54] tabular-nums">
                  ★ {formatStarRating(formData.score)} / 5 ({formatNugasScore(formData.score)})
                </span>
              </div>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: parseFloat(e.target.value) || 0 })}
                className="w-full h-9 px-3 text-xs tabular-nums bg-white border border-[#E2E5DF] rounded-lg text-text-900 focus:outline-none focus:ring-2 focus:ring-[#005B54]/15 focus:border-[#005B54] transition-all"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E5DF] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-text-700 hover:bg-[#F5F6F3] rounded-lg transition-colors cursor-pointer tactile-press"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#005B54] hover:bg-[#004741] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs tactile-press"
            >
              {mode === 'create' ? 'Simpan Titik Baru' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
