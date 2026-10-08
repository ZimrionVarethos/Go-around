'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import {
  useAdminAuth,
  DEFAULT_ADMIN_PROFILE,
  type AdminProfile,
} from '@/lib/admin-auth';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { ProfileSettingsForm } from '@/components/admin/settings/ProfileSettingsForm';
import { PasswordSecurityForm } from '@/components/admin/settings/PasswordSecurityForm';

type TabKey = 'profile' | 'security';

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    profile,
    updateProfile,
    updatePassword,
    logout,
  } = useAdminAuth();
  const { toasts, showToast, dismissToast } = useToast();

  // URL-driven active tab
  const tabParam = searchParams.get('tab');
  const activeTab: TabKey = tabParam === 'security' ? 'security' : 'profile';

  const handleTabChange = (tab: TabKey) => {
    router.replace(`/admin/settings?tab=${tab}`);
  };

  const handleSaveProfile = (data: Partial<AdminProfile>) => {
    if (!data.name?.trim()) {
      showToast('Nama tampilan tidak boleh kosong.', 'error', 3000);
      return;
    }
    if (!data.email?.trim() || !data.email.includes('@')) {
      showToast('Format email tidak valid.', 'error', 3000);
      return;
    }

    updateProfile(data);
    showToast('Profil akun berhasil diperbarui.', 'success', 3000);
  };

  const handleResetProfile = () => {
    updateProfile(DEFAULT_ADMIN_PROFILE);
    showToast('Profil dikembalikan ke pengaturan awal.', 'info', 2500);
  };

  const handleUpdatePassword = (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): boolean => {
    if (!currentPassword) {
      showToast('Masukkan kata sandi saat ini.', 'error', 3000);
      return false;
    }
    if (newPassword.length < 6) {
      showToast('Kata sandi baru minimal 6 karakter.', 'error', 3000);
      return false;
    }
    if (newPassword !== confirmPassword) {
      showToast('Konfirmasi kata sandi tidak cocok.', 'error', 3000);
      return false;
    }

    const res = updatePassword(currentPassword, newPassword);
    if (res.success) {
      showToast('Kata sandi berhasil diperbarui.', 'success', 3000);
      return true;
    } else {
      showToast(res.error || 'Gagal memperbarui kata sandi.', 'error', 3000);
      return false;
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const navTabs: { id: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'profile', label: 'Profil Akun', icon: User },
    { id: 'security', label: 'Kata Sandi', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#F5F6F3]">
      {/* Standalone Top Header Bar (No AdminSidebar) */}
      <header className="h-14 bg-white border-b border-[#E2E5DF] px-4 sm:px-6 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-[#E2E5DF] bg-white hover:bg-[#F5F6F3] text-xs font-semibold text-text-700 hover:text-text-950 transition-colors shrink-0 tactile-press"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-text-500" />
              <span>Kembali ke Dashboard</span>
            </Link>
            <span className="h-4 w-px bg-[#E2E5DF] hidden sm:block" />
            <h1 className="text-sm font-bold text-text-950 truncate hidden sm:block">
              Pengaturan
            </h1>
          </div>

          {/* Right Account Summary */}
          <div className="flex items-center gap-2 text-xs text-text-600 min-w-0">
            <div className="w-6 h-6 rounded-md bg-[#005B54] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
              {profile.avatarInitials}
            </div>
            <span className="font-mono text-[11px] text-text-600 truncate max-w-[180px]">
              {profile.email}
            </span>
          </div>
        </div>
      </header>

      {/* Main 2-Column Settings Workspace */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Left Rail Navigation */}
          <aside className="w-full md:w-48 shrink-0 space-y-1">
            <div className="flex md:flex-col gap-1 overflow-x-auto pb-1 md:pb-0">
              {navTabs.map((item) => {
                const active = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabChange(item.id)}
                    className={cn(
                      'flex items-center gap-2.5 h-9 px-3 rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap tactile-press text-left',
                      active
                        ? 'bg-white text-[#005B54] font-bold border border-[#E2E5DF] shadow-2xs'
                        : 'text-text-600 font-medium hover:text-text-950 hover:bg-white/60 border border-transparent'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-3.5 h-3.5 shrink-0',
                        active ? 'text-[#005B54]' : 'text-text-400'
                      )}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden md:block pt-3 mt-3 border-t border-[#E2E5DF]">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 h-9 px-3 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50/80 transition-colors cursor-pointer text-left tactile-press"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>Keluar Sesi</span>
              </button>
            </div>
          </aside>

          {/* Right Content Column */}
          <div className="flex-1 w-full min-w-0">
            {activeTab === 'profile' && (
              <ProfileSettingsForm
                key={`${profile.name}-${profile.email}-${profile.role}`}
                profile={profile}
                onSave={handleSaveProfile}
                onReset={handleResetProfile}
              />
            )}

            {activeTab === 'security' && (
              <PasswordSecurityForm onUpdatePassword={handleUpdatePassword} />
            )}
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-[#F5F6F3]" />}>
      <SettingsContent />
    </Suspense>
  );
}
