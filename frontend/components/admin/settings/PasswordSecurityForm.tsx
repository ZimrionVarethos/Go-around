'use client';

import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';

interface PasswordSecurityFormProps {
  onUpdatePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => boolean;
}

export function PasswordSecurityForm({ onUpdatePassword }: PasswordSecurityFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onUpdatePassword(currentPassword, newPassword, confirmPassword);
    if (ok) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-[#E2E5DF] shadow-card-subtle divide-y divide-[#E2E5DF] overflow-hidden"
    >
      <div className="px-5 py-4 bg-[#F8F9F7]">
        <h2 className="text-sm font-bold text-text-950">Ubah Kata Sandi</h2>
        <p className="text-xs text-text-500 mt-0.5">
          Gunakan minimal 6 karakter untuk memperbarui kredensial akses portal.
        </p>
      </div>

      {/* Current Password */}
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-center">
        <label htmlFor="current-pw" className="text-xs font-semibold text-text-900">
          Kata Sandi Saat Ini
        </label>
        <div className="sm:col-span-2 relative">
          <input
            id="current-pw"
            type={showCurrentPw ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Masukkan kata sandi saat ini"
            className="w-full h-9 pl-3 pr-9 text-xs bg-white border border-[#CBD5E1] rounded-lg text-text-900 placeholder:text-text-400 focus:outline-none focus:border-[#005B54] transition-all"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPw(!showCurrentPw)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-400 hover:text-text-700 p-1 cursor-pointer tactile-press"
          >
            {showCurrentPw ? <EyeSlashIcon size={14} weight="bold" /> : <EyeIcon size={14} weight="bold" />}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-center">
        <label htmlFor="new-pw" className="text-xs font-semibold text-text-900">
          Kata Sandi Baru
        </label>
        <div className="sm:col-span-2 relative">
          <input
            id="new-pw"
            type={showNewPw ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            className="w-full h-9 pl-3 pr-9 text-xs bg-white border border-[#CBD5E1] rounded-lg text-text-900 placeholder:text-text-400 focus:outline-none focus:border-[#005B54] transition-all"
          />
          <button
            type="button"
            onClick={() => setShowNewPw(!showNewPw)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-400 hover:text-text-700 p-1 cursor-pointer tactile-press"
          >
            {showNewPw ? <EyeSlashIcon size={14} weight="bold" /> : <EyeIcon size={14} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-center">
        <label htmlFor="confirm-pw" className="text-xs font-semibold text-text-900">
          Konfirmasi Sandi Baru
        </label>
        <div className="sm:col-span-2">
          <input
            id="confirm-pw"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ketik ulang kata sandi baru"
            className="w-full h-9 px-3 text-xs bg-white border border-[#CBD5E1] rounded-lg text-text-900 placeholder:text-text-400 focus:outline-none focus:border-[#005B54] transition-all"
          />
        </div>
      </div>

      <div className="px-5 py-3.5 bg-[#F8F9F7] flex items-center justify-end">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="rounded-lg text-xs font-semibold px-4 tactile-press"
        >
          Perbarui Kata Sandi
        </Button>
      </div>
    </form>
  );
}
