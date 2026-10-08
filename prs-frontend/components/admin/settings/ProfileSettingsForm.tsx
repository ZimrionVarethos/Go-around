'use client';

import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import type { AdminProfile } from '@/lib/admin-auth';
import { Button } from '@/components/ui/Button';

interface ProfileSettingsFormProps {
  profile: AdminProfile;
  onSave: (data: Partial<AdminProfile>) => void;
  onReset: () => void;
}

export function ProfileSettingsForm({
  profile,
  onSave,
  onReset,
}: ProfileSettingsFormProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [role, setRole] = useState(profile.role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-[#E2E5DF] shadow-card-subtle divide-y divide-[#E2E5DF] overflow-hidden"
    >
      {/* Section Header */}
      <div className="px-5 py-4 flex items-center justify-between gap-4 bg-[#F8F9F7]">
        <div>
          <h2 className="text-sm font-bold text-text-950">Profil Akun</h2>
          <p className="text-xs text-text-500 mt-0.5">
            Identitas pengelola yang tercatat pada log moderasi direktori Kota Bogor.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-[#E2E5DF] bg-white hover:bg-[#F5F6F3] text-xs font-medium text-text-700 transition-colors cursor-pointer shrink-0 tactile-press"
        >
          <RotateCcw className="w-3 h-3 text-text-500" />
          <span>Reset Default</span>
        </button>
      </div>

      {/* Row 1: Avatar & Ringkasan */}
      <div className="px-5 py-4 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-text-900 block">Inisial Avatar</span>
          <span className="text-[11px] text-text-500">
            Dibuat otomatis dari nama tampilan
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#005B54] text-white font-bold text-xs flex items-center justify-center shrink-0">
            {profile.avatarInitials}
          </div>
          <span className="text-xs font-mono text-text-500 tabular-nums">
            Login: {profile.lastLogin}
          </span>
        </div>
      </div>

      {/* Row 2: Nama Lengkap */}
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-center">
        <div>
          <label htmlFor="settings-name" className="text-xs font-semibold text-text-900 block">
            Nama Tampilan
          </label>
          <span className="text-[11px] text-text-500">Nama yang tampil di topbar</span>
        </div>
        <div className="sm:col-span-2">
          <input
            id="settings-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full h-9 px-3 text-xs bg-white border border-[#CBD5E1] rounded-lg text-text-900 placeholder:text-text-400 focus:outline-none focus:ring-2 focus:ring-[#005B54]/15 focus:border-[#005B54] transition-all"
            placeholder="Nama lengkap"
          />
        </div>
      </div>

      {/* Row 3: Email */}
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-center">
        <div>
          <label htmlFor="settings-email" className="text-xs font-semibold text-text-900 block">
            Alamat Email
          </label>
          <span className="text-[11px] text-text-500">Digunakan untuk masuk ke portal</span>
        </div>
        <div className="sm:col-span-2">
          <input
            id="settings-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-9 px-3 text-xs font-mono bg-white border border-[#CBD5E1] rounded-lg text-text-900 placeholder:text-text-400 focus:outline-none focus:ring-2 focus:ring-[#005B54]/15 focus:border-[#005B54] transition-all"
            placeholder="admin@goaround.id"
          />
        </div>
      </div>

      {/* Row 4: Peran */}
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-center">
        <div>
          <label htmlFor="settings-role" className="text-xs font-semibold text-text-900 block">
            Peran Operasional
          </label>
          <span className="text-[11px] text-text-500">Label peran di sistem</span>
        </div>
        <div className="sm:col-span-2">
          <input
            id="settings-role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full h-9 px-3 text-xs bg-white border border-[#CBD5E1] rounded-lg text-text-900 placeholder:text-text-400 focus:outline-none focus:ring-2 focus:ring-[#005B54]/15 focus:border-[#005B54] transition-all"
            placeholder="Admin WebGIS Kota Bogor"
          />
        </div>
      </div>

      {/* Footer Submit */}
      <div className="px-5 py-3.5 bg-[#F8F9F7] flex items-center justify-end">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="rounded-lg text-xs font-semibold px-4 tactile-press"
        >
          Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}
