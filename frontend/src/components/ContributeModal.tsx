'use client';

import React, { useState } from 'react';
import { apiService } from '@/services/api';
import { PlusCircle, X, Check, Loader2 } from 'lucide-react';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUBDISTRICTS = [
  'Bogor Tengah',
  'Bogor Timur',
  'Bogor Utara',
  'Bogor Selatan',
  'Bogor Barat',
  'Tanah Sareal',
];

export const ContributeModal: React.FC<ContributeModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    address: '',
    subdistrict: 'Bogor Tengah',
    latitude: -6.595038,
    longitude: 106.790082,
    price_min_drink: 15000,
    wifi_speed_mbps: 30,
    plug_availability: 'moderate',
    noise_level: 'moderate',
    is_24_hours: false,
    notes: '',
    submitter_name: '',
    submitter_email: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await apiService.submitContribution(form);
    setSubmitting(false);
    setSuccessMessage(res.message);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-zinc-950 border border-zinc-850 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden text-zinc-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-zinc-850 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-syne font-bold text-sm sm:text-base text-white uppercase tracking-wider">
                Usulkan Spot Nugas Baru
              </h3>
              <p className="text-xs text-zinc-400">Kontribusi data komunitas mahasiswa Kota Bogor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {successMessage ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-syne font-bold text-sm text-white uppercase tracking-wider">Berhasil Terkirim</h4>
            <p className="text-xs text-zinc-400 max-w-xs">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1 text-xs">
            <div>
              <label className="block font-syne font-bold text-zinc-300 mb-1.5 text-xs">Nama Tempat / Warkop / Cafe *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Warkop Pakuan Center"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-zinc-500 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-syne font-bold text-zinc-300 mb-1.5 text-xs">Kecamatan di Bogor *</label>
                <select
                  value={form.subdistrict}
                  onChange={(e) => setForm({ ...form, subdistrict: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-zinc-500 text-xs cursor-pointer"
                >
                  {SUBDISTRICTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-syne font-bold text-zinc-300 mb-1.5 text-xs">Minuman Termurah (Rp)</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={form.price_min_drink}
                  onChange={(e) => setForm({ ...form, price_min_drink: parseInt(e.target.value) || 0 })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-zinc-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-syne font-bold text-zinc-300 mb-1.5 text-xs">Alamat Lengkap / Patokan *</label>
              <textarea
                required
                rows={2}
                placeholder="Contoh: Jl. Pajajaran Indah No. 12, seberang kampus..."
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-zinc-500 resize-none text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-syne font-bold text-zinc-300 mb-1.5 text-xs">Colokan Listrik</label>
                <select
                  value={form.plug_availability}
                  onChange={(e) => setForm({ ...form, plug_availability: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-zinc-500 text-xs cursor-pointer"
                >
                  <option value="abundant">Melimpah (Tiap Meja)</option>
                  <option value="moderate">Cukup (Beberapa Titik)</option>
                  <option value="limited">Terbatas</option>
                </select>
              </div>

              <div>
                <label className="block font-syne font-bold text-zinc-300 mb-1.5 text-xs">Estimasi Wi-Fi (Mbps)</label>
                <input
                  type="number"
                  min="0"
                  value={form.wifi_speed_mbps}
                  onChange={(e) => setForm({ ...form, wifi_speed_mbps: parseInt(e.target.value) || 0 })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-zinc-500 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is_24_hours"
                checked={form.is_24_hours}
                onChange={(e) => setForm({ ...form, is_24_hours: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500 bg-zinc-900 border-zinc-700"
              />
              <label htmlFor="is_24_hours" className="text-zinc-300 text-xs cursor-pointer">
                Tempat ini beroperasi 24 Jam Nonstop
              </label>
            </div>

            <div className="border-t border-zinc-850 pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 rounded-xl transition-colors font-syne font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black rounded-xl transition-colors font-syne font-bold flex items-center gap-2 uppercase tracking-wider"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <span>Kirim Data Spot</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
