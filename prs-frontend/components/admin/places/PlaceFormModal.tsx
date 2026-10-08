/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef, useState } from 'react';
import {
  ImageIcon,
  LinkSimpleIcon,
  TrashIcon,
  UploadSimpleIcon,
  XIcon,
} from '@phosphor-icons/react';
import {
  DynamicPlugIcon,
  DynamicWifiIcon,
} from '@/components/ui/FacilityIcons';
import { formatStarRating, formatNugasScore } from '@/lib/utils';

export interface PlaceFormData {
  name: string;
  address: string;
  district: string;
  lat: number;
  lng: number;
  wifi: number;
  plug: number;
  price: string;
  score: number;
  status: 'verified' | 'review' | 'rejected';
  imageUrl?: string;
  acoustic?: string;
  is24Hours?: boolean;
}

const KOTA_BOGOR_DISTRICTS = [
  'Bogor Tengah',
  'Bogor Timur',
  'Bogor Utara',
  'Bogor Barat',
  'Tanah Sareal',
  'Bogor Selatan',
] as const;

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoInputMode, setPhotoInputMode] = useState<'upload' | 'url'>('upload');
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen || !mode) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Format file harus berupa gambar (JPG, PNG, atau WebP).');
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      setUploadError('Ukuran foto maksimal 2,5 MB agar ringan dimuat di peta.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl border border-[#E2E5DF] shadow-tinted-teal overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
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
            <XIcon size={16} weight="bold" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* 1. Foto Kafe (Upload File / URL Gambar) */}
          <div className="p-3.5 rounded-xl bg-[#F8F9F7] border border-[#E2E5DF] space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <label className="text-xs font-semibold text-text-800 flex items-center gap-1.5">
                <ImageIcon size={15} weight="duotone" className="text-[#005B54]" />
                <span>Foto Kafe / Tempat Nugas</span>
              </label>
              <div className="inline-flex rounded-lg border border-[#E2E5DF] bg-white p-0.5 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setPhotoInputMode('upload')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    photoInputMode === 'upload'
                      ? 'bg-[#005B54] text-white'
                      : 'text-text-600 hover:text-text-900'
                  }`}
                >
                  <UploadSimpleIcon size={12} weight="bold" />
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoInputMode('url')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    photoInputMode === 'url'
                      ? 'bg-[#005B54] text-white'
                      : 'text-text-600 hover:text-text-900'
                  }`}
                >
                  <LinkSimpleIcon size={12} weight="bold" />
                  <span>URL Gambar</span>
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {/* Preview Thumbnail */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border border-[#E2E5DF] shrink-0 flex items-center justify-center relative">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Preview Kafe"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-text-400 text-center px-1.5 leading-tight">
                    Belum ada foto
                  </span>
                )}
              </div>

              {/* Input Controls */}
              <div className="flex-1 min-w-0 space-y-2">
                {photoInputMode === 'upload' ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white hover:bg-[#F0F2EE] border border-[#E2E5DF] rounded-lg text-xs font-semibold text-text-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <UploadSimpleIcon size={14} weight="bold" className="text-[#005B54]" />
                        <span>Pilih Foto dari Perangkat</span>
                      </button>
                      {formData.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: '' })}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Foto"
                        >
                          <TrashIcon size={14} weight="bold" />
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-text-500 mt-1">
                      Format JPG, PNG, atau WebP (maks. 2,5 MB). Otomatis tampil di kartu Peta Publik.
                    </p>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={formData.imageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full h-9 px-3 text-xs bg-white border border-[#E2E5DF] rounded-lg text-text-900 placeholder:text-text-400 focus:outline-none focus:border-[#005B54] transition-all"
                    />
                    <p className="text-[11px] text-text-500 mt-1">
                      Tempel tautan langsung gambar kafe (misal hasil scraping Google Places / CDN).
                    </p>
                  </div>
                )}

                {uploadError && (
                  <p className="text-[11px] font-medium text-rose-600">{uploadError}</p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Nama & Kecamatan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-text-700 block mb-1">
                Nama Kafe / Working Space *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Kopi Tuya Baranangsiang"
                className="w-full h-9 px-3 text-xs bg-white border border-[#E2E5DF] rounded-lg text-text-900 placeholder:text-text-500 focus:outline-none focus:border-[#005B54] transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-700 block mb-1">
                Kecamatan (Kota Bogor) *
              </label>
              <select
                value={formData.district || 'Bogor Tengah'}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full h-9 px-2.5 text-xs bg-white border border-[#E2E5DF] rounded-lg text-text-900 focus:outline-none focus:border-[#005B54] transition-all"
              >
                {KOTA_BOGOR_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Alamat Lengkap */}
          <div>
            <label className="text-xs font-semibold text-text-700 block mb-1">
              Alamat Lengkap &amp; Koridor Kampus *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Contoh: Jl. Pajajaran No. 28, Baranangsiang, Bogor Timur"
              className="w-full h-9 px-3 text-xs bg-white border border-[#E2E5DF] rounded-lg text-text-900 placeholder:text-text-500 focus:outline-none focus:border-[#005B54] transition-all"
            />
          </div>

          {/* 4. Koordinat Spasial */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-text-700 block mb-1">
                Latitude (EPSG:4326)
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                className="w-full h-9 px-3 text-xs font-mono tabular-nums bg-white border border-[#E2E5DF] rounded-lg text-text-900 focus:outline-none focus:border-[#005B54] transition-all"
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
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                className="w-full h-9 px-3 text-xs font-mono tabular-nums bg-white border border-[#E2E5DF] rounded-lg text-text-900 focus:outline-none focus:border-[#005B54] transition-all"
              />
            </div>
          </div>

          {/* 5. Wi-Fi & Colokan */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-text-700 flex items-center justify-between mb-1">
                <span>Kecepatan Wi-Fi (Mbps)</span>
                <DynamicWifiIcon mbps={formData.wifi} size={14} />
              </label>
              <input
                type="number"
                value={formData.wifi}
                onChange={(e) => setFormData({ ...formData, wifi: parseInt(e.target.value) || 0 })}
                className="w-full h-9 px-3 text-xs tabular-nums bg-white border border-[#E2E5DF] rounded-lg text-text-900 focus:outline-none focus:border-[#005B54] transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-700 flex items-center justify-between mb-1">
                <span>Ketersediaan Colokan (%)</span>
                <DynamicPlugIcon plugPercent={formData.plug} size={14} />
              </label>
              <input
                type="number"
                value={formData.plug}
                onChange={(e) => setFormData({ ...formData, plug: parseInt(e.target.value) || 0 })}
                className="w-full h-9 px-3 text-xs tabular-nums bg-white border border-[#E2E5DF] rounded-lg text-text-900 focus:outline-none focus:border-[#005B54] transition-all"
              />
            </div>
          </div>

          {/* 6. Harga & Skor */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-text-700 block mb-1">
                Harga Minuman Mulai
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full h-9 px-3 text-xs bg-white border border-[#E2E5DF] rounded-lg text-text-900 focus:outline-none focus:border-[#005B54] transition-all"
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
                className="w-full h-9 px-3 text-xs tabular-nums bg-white border border-[#E2E5DF] rounded-lg text-text-900 focus:outline-none focus:border-[#005B54] transition-all"
              />
            </div>
          </div>

          {/* 7. Status Tayang, Suasana Akustik & Buka 24 Jam */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="text-xs font-semibold text-text-700 block mb-1">
                Status Tayang Peta
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'verified' | 'review' | 'rejected',
                  })
                }
                className="w-full h-9 px-2.5 text-xs bg-white border border-[#E2E5DF] rounded-lg text-text-900 focus:outline-none focus:border-[#005B54] transition-all"
              >
                <option value="verified">Terverifikasi (Tayang)</option>
                <option value="review">Perlu Review (Antrean)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-700 block mb-1">
                Suasana Akustik
              </label>
              <select
                value={formData.acoustic || 'Kondusif'}
                onChange={(e) => setFormData({ ...formData, acoustic: e.target.value })}
                className="w-full h-9 px-2.5 text-xs bg-white border border-[#E2E5DF] rounded-lg text-text-900 focus:outline-none focus:border-[#005B54] transition-all"
              >
                <option value="Tenang">Tenang (Fokus)</option>
                <option value="Kondusif">Kondusif Standar</option>
                <option value="Kerja Kelompok">Kerja Kelompok</option>
                <option value="Ramai Malam">Ramai / Diskusi</option>
              </select>
            </div>

            <div className="flex items-end pb-1.5">
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-text-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={Boolean(formData.is24Hours)}
                  onChange={(e) => setFormData({ ...formData, is24Hours: e.target.checked })}
                  className="w-4 h-4 rounded-sm text-[#005B54] focus:ring-[#005B54] border-[#D5D3C8] cursor-pointer accent-[#005B54]"
                />
                <span>Buka 24 Jam Penuh</span>
              </label>
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
