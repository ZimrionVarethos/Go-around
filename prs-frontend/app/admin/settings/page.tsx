'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  User,
  ShieldCheck,
  Sliders,
  Save,
  RotateCcw,
  KeyRound,
  Laptop,
  CheckCircle2,
  Bell,
  Layers,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Building2,
  Phone,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { AdminTopbar } from '@/components/layout/AdminTopbar';
import { useAdminLayout } from '../layout';
import { useAdminAuth, DEFAULT_ADMIN_PROFILE, AdminProfile, AdminPreferences } from '@/lib/admin-auth';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';

type TabKey = 'profile' | 'security' | 'preferences';

interface ProfileFormSectionProps {
  profile: AdminProfile;
  onSave: (data: Partial<AdminProfile>) => void;
  onReset: () => void;
}

function ProfileFormSection({ profile, onSave, onReset }: ProfileFormSectionProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [role, setRole] = useState(profile.role);
  const [agency, setAgency] = useState(profile.agency);
  const [phone, setPhone] = useState(profile.phone || '');
  const [bio, setBio] = useState(profile.bio);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      agency: agency.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Identity Card Overview */}
      <div className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-800 to-primary-950 text-white font-bold text-2xl flex items-center justify-center shadow-md">
              {profile.avatarInitials}
            </div>
            <span
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white"
              title="Status: Aktif"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-text-950">{profile.name}</h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary-100 text-primary-900 px-2.5 py-0.5 rounded-full border border-primary-200">
                <Sparkles className="w-3 h-3 text-primary-700" />
                {profile.role}
              </span>
            </div>
            <p className="text-xs text-text-500 mt-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-text-400" />
              {profile.email}
            </p>
            <p className="text-[11px] text-text-400 mt-0.5">
              Terakhir masuk: <span className="text-text-700 font-medium">{profile.lastLogin}</span>
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          className="rounded-xl text-xs gap-1.5 self-end sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset ke Default</span>
        </Button>
      </div>

      {/* Profile Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-7 shadow-xs space-y-5"
      >
        <div>
          <h3 className="text-sm font-bold text-text-950">Informasi Pribadi & Kontak</h3>
          <p className="text-xs text-text-500 mt-0.5">
            Informasi ini ditampilkan pada navigasi dashboard, tiket laporan, dan verifikasi kafe spasial.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-700 mb-1.5">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs bg-surface-subtle border border-border-subtle rounded-xl text-text-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700 transition-all shadow-2xs"
              placeholder="Contoh: Azqilla Simbolon"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-700 mb-1.5">
              Email Resmi <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs bg-surface-subtle border border-border-subtle rounded-xl text-text-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700 transition-all shadow-2xs"
              placeholder="admin@goaround.id"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-700 mb-1.5">
              Jabatan / Peran Admin
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-surface-subtle border border-border-subtle rounded-xl text-text-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700 transition-all shadow-2xs"
              placeholder="Super Admin SIG Kota Bogor"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-700 mb-1.5">
              Instansi / Departemen
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-text-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-surface-subtle border border-border-subtle rounded-xl text-text-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700 transition-all shadow-2xs"
                placeholder="Bappeda & Tim WebGIS IPB"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-700 mb-1.5">
              Nomor Kontak / WhatsApp
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-text-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-surface-subtle border border-border-subtle rounded-xl text-text-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700 transition-all shadow-2xs"
                placeholder="+62 812-3456-7890"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-text-700 mb-1.5">
              Bio / Catatan Tugas
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-surface-subtle border border-border-subtle rounded-xl text-text-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700 transition-all shadow-2xs resize-none"
              placeholder="Tulis deskripsi tanggung jawab administrator..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
          <Button type="submit" variant="primary" size="md" className="rounded-xl gap-2 text-xs font-semibold">
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

interface PreferencesFormSectionProps {
  preferences: AdminPreferences;
  onSave: (prefs: Partial<AdminPreferences>) => void;
}

function PreferencesFormSection({ preferences, onSave }: PreferencesFormSectionProps) {
  const [basemap, setBasemap] = useState(preferences.defaultBasemap);
  const [bufferRadius, setBufferRadius] = useState(preferences.defaultBufferRadius);
  const [notificationsEnabled, setNotificationsEnabled] = useState(preferences.notificationsEnabled);
  const [soundAlerts, setSoundAlerts] = useState(preferences.soundAlerts);
  const [coordinateFormat, setCoordinateFormat] = useState(preferences.coordinateFormat);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      defaultBasemap: basemap,
      defaultBufferRadius: bufferRadius,
      notificationsEnabled,
      soundAlerts,
      coordinateFormat,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-200"
    >
      <div>
        <h3 className="text-sm font-bold text-text-950 flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary-800" />
          <span>Preferensi Tampilan Peta & Pengolahan Spasial</span>
        </h3>
        <p className="text-xs text-text-500 mt-0.5">
          Konfigurasi layer peta dasar dan parameter analisis spasial untuk pengelolaan kafe seputar Kota Bogor.
        </p>
      </div>

      {/* Basemap Selection */}
      <div>
        <label className="block text-xs font-semibold text-text-700 mb-2">
          Basemap Peta Utama (Default)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'carto' as const,
              name: 'CartoDB Positron (Clean Light)',
              desc: 'Desain minimalis monokrom abu-abu, optimal membaca titik kafe',
            },
            {
              id: 'osm' as const,
              name: 'OpenStreetMap Standard',
              desc: 'Peta jalan lengkap dengan detail bangunan lokal Kota Bogor',
            },
            {
              id: 'topo' as const,
              name: 'OpenTopo Topografi',
              desc: 'Layer kontur elevasi, cocok mengamati kontur Bogor Selatan',
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setBasemap(item.id)}
              className={cn(
                'p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between',
                basemap === item.id
                  ? 'bg-primary-50/70 border-primary-800 ring-2 ring-primary-500/20 shadow-xs'
                  : 'bg-surface-subtle border-border-subtle hover:bg-surface-header'
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-950">{item.name}</span>
                  {basemap === item.id && (
                    <CheckCircle2 className="w-4 h-4 text-primary-800 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-text-500 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Default Buffer Radius */}
      <div>
        <label className="block text-xs font-semibold text-text-700 mb-2">
          Radius Buffer default Seputar Kampus IPB & Pusat Nugas
        </label>
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {[
            { val: 500, label: '500 Meter', tag: 'Jalan Kaki (~6 menit)' },
            { val: 1000, label: '1.000 Meter', tag: 'Standar Kampus (~12 menit)' },
            { val: 2000, label: '2.000 Meter', tag: 'Radius Motor / Angkot' },
          ].map((rad) => (
            <button
              key={rad.val}
              type="button"
              onClick={() => setBufferRadius(rad.val)}
              className={cn(
                'p-3 rounded-xl border text-center transition-all cursor-pointer',
                bufferRadius === rad.val
                  ? 'bg-primary-900 text-white border-primary-950 shadow-xs'
                  : 'bg-surface-subtle border-border-subtle text-text-800 hover:bg-surface-header'
              )}
            >
              <div className="text-xs font-bold">{rad.label}</div>
              <div
                className={cn(
                  'text-[10px] mt-0.5',
                  bufferRadius === rad.val ? 'text-primary-100' : 'text-text-400'
                )}
              >
                {rad.tag}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Coordinate Format */}
      <div>
        <label className="block text-xs font-semibold text-text-700 mb-2">
          Format Koordinat Spasial
        </label>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          {[
            { id: 'decimal' as const, label: 'Derajat Desimal (Lat, Lng)', example: '-6.5976, 106.8053' },
            { id: 'dms' as const, label: 'DMS (Derajat Menit Detik)', example: '6°35\'51"S 106°48\'19"E' },
          ].map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              onClick={() => setCoordinateFormat(fmt.id)}
              className={cn(
                'p-3 rounded-xl border text-left transition-all cursor-pointer',
                coordinateFormat === fmt.id
                  ? 'bg-primary-50 border-primary-800 ring-2 ring-primary-500/20 shadow-xs'
                  : 'bg-surface-subtle border-border-subtle hover:bg-surface-header'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-900">{fmt.label}</span>
                {coordinateFormat === fmt.id && <CheckCircle2 className="w-3.5 h-3.5 text-primary-800" />}
              </div>
              <p className="text-[10px] text-text-400 font-mono mt-1">{fmt.example}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Notification & Format Toggles */}
      <div className="pt-4 border-t border-border-subtle space-y-4">
        <h4 className="text-xs font-bold text-text-900 flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-text-600" />
          <span>Notifikasi & Peringatan Masuk</span>
        </h4>

        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-border-subtle bg-surface-subtle cursor-pointer hover:bg-surface-header transition-colors">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 accent-primary-900 rounded cursor-pointer"
            />
            <div className="flex-1 text-xs">
              <span className="font-semibold text-text-900 block">
                Notifikasi Tiket Laporan Masuk
              </span>
              <span className="text-[11px] text-text-500">
                Tampilkan badge merah dan toast saat mahasiswa melaporkan colokan/wifi kafe bermasalah
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-border-subtle bg-surface-subtle cursor-pointer hover:bg-surface-header transition-colors">
            <input
              type="checkbox"
              checked={soundAlerts}
              onChange={(e) => setSoundAlerts(e.target.checked)}
              className="w-4 h-4 accent-primary-900 rounded cursor-pointer"
            />
            <div className="flex-1 text-xs">
              <span className="font-semibold text-text-900 block">
                Bunyi Alert Audio untuk Tiket Prioritas Tinggi
              </span>
              <span className="text-[11px] text-text-500">
                Memberikan peringatan suara halus untuk tiket laporan mendesak
              </span>
            </div>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
        <Button type="submit" variant="primary" size="md" className="rounded-xl gap-2 text-xs font-semibold">
          <Save className="w-4 h-4" />
          <span>Simpan Preferensi WebGIS</span>
        </Button>
      </div>
    </form>
  );
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openMobileMenu } = useAdminLayout();
  const { profile, preferences, updateProfile, updatePreferences, updatePassword, logout } = useAdminAuth();
  const { toasts, showToast, dismissToast } = useToast();

  // URL-driven active tab
  const tabParam = searchParams.get('tab') as TabKey | null;
  const activeTab: TabKey =
    tabParam === 'security' || tabParam === 'preferences' ? tabParam : 'profile';

  const handleTabChange = (tab: TabKey) => {
    router.replace(`/admin/settings?tab=${tab}`);
  };

  // Tab 2: Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleSaveProfile = (data: Partial<AdminProfile>) => {
    if (!data.name?.trim()) {
      showToast('Nama lengkap tidak boleh kosong!', 'error', 3000);
      return;
    }
    if (!data.email?.trim() || !data.email.includes('@')) {
      showToast('Format email tidak valid!', 'error', 3000);
      return;
    }

    updateProfile(data);
    showToast('Profil administrator berhasil diperbarui! 🎉', 'success', 3500);
  };

  const handleResetProfile = () => {
    updateProfile(DEFAULT_ADMIN_PROFILE);
    showToast('Profil dikembalikan ke pengaturan default', 'info', 2500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Masukkan kata sandi saat ini.', 'error', 3000);
      return;
    }
    if (newPassword.length < 6) {
      showToast('Kata sandi baru minimal 6 karakter!', 'error', 3000);
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Konfirmasi kata sandi tidak cocok!', 'error', 3000);
      return;
    }

    const res = updatePassword(currentPassword, newPassword);
    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Kata sandi berhasil diperbarui dengan aman! 🔐', 'success', 3500);
    } else {
      showToast(res.error || 'Gagal memperbarui kata sandi', 'error', 3000);
    }
  };

  const handleSavePreferences = (prefs: Partial<AdminPreferences>) => {
    updatePreferences(prefs);
    showToast('Preferensi WebGIS & notifikasi berhasil disimpan! ✅', 'success', 3000);
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <div className="flex flex-col min-h-full pb-16">
      {/* Top Header */}
      <AdminTopbar
        title="Pengaturan Akun & WebGIS"
        subtitle="Kelola identitas administrator, keamanan sandi, dan preferensi spasial Kota Bogor"
        onOpenMobileMenu={openMobileMenu}
        hideDefaultExport
      />

      <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-border-subtle overflow-x-auto pb-px">
          <button
            type="button"
            onClick={() => handleTabChange('profile')}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'profile'
                ? 'border-primary-900 text-primary-900 bg-primary-50/40 rounded-t-xl'
                : 'border-transparent text-text-500 hover:text-text-900 hover:border-border-strong'
            )}
          >
            <User className="w-4 h-4" />
            <span>Profil Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('security')}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'security'
                ? 'border-primary-900 text-primary-900 bg-primary-50/40 rounded-t-xl'
                : 'border-transparent text-text-500 hover:text-text-900 hover:border-border-strong'
            )}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Keamanan & Sandi</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('preferences')}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'preferences'
                ? 'border-primary-900 text-primary-900 bg-primary-50/40 rounded-t-xl'
                : 'border-transparent text-text-500 hover:text-text-900 hover:border-border-strong'
            )}
          >
            <Sliders className="w-4 h-4" />
            <span>Preferensi WebGIS</span>
          </button>
        </div>

        {/* TAB 1: PROFIL ADMIN */}
        {activeTab === 'profile' && (
          <ProfileFormSection
            key={`${profile.name}-${profile.email}-${profile.lastLogin}`}
            profile={profile}
            onSave={handleSaveProfile}
            onReset={handleResetProfile}
          />
        )}

        {/* TAB 2: KEAMANAN & SANDI */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Change Password Form */}
            <form
              onSubmit={handleUpdatePassword}
              className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-7 shadow-xs space-y-5"
            >
              <div>
                <h3 className="text-sm font-bold text-text-950 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-primary-800" />
                  <span>Perbarui Kata Sandi Administrator</span>
                </h3>
                <p className="text-xs text-text-500 mt-0.5">
                  Pastikan kata sandi Anda menggunakan kombinasi huruf, angka, dan simbol untuk perlindungan data spasial.
                </p>
              </div>

              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-text-700 mb-1.5">
                    Kata Sandi Saat Ini
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-text-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Masukkan kata sandi lama"
                      className="w-full pl-9 pr-10 py-2 text-xs bg-surface-subtle border border-border-subtle rounded-xl text-text-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-400 hover:text-text-700"
                    >
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-700 mb-1.5">
                    Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-text-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-9 pr-10 py-2 text-xs bg-surface-subtle border border-border-subtle rounded-xl text-text-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-400 hover:text-text-700"
                    >
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-700 mb-1.5">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-text-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi baru"
                      className="w-full pl-9 pr-3.5 py-2 text-xs bg-surface-subtle border border-border-subtle rounded-xl text-text-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700 shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border-subtle">
                <Button type="submit" variant="primary" size="md" className="rounded-xl gap-2 text-xs font-semibold">
                  <KeyRound className="w-4 h-4" />
                  <span>Perbarui Kata Sandi</span>
                </Button>
              </div>
            </form>

            {/* 2FA & Active Sessions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* 2FA Card */}
              <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center text-primary-900">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text-950">Autentikasi Dua Langkah (2FA)</h4>
                      <p className="text-[11px] text-text-500">Lapisan proteksi ekstra melalui OTP</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      showToast(
                        !twoFactorEnabled ? '2FA telah diaktifkan!' : '2FA dinonaktifkan',
                        'info',
                        2500
                      );
                    }}
                    className={cn(
                      'w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors',
                      twoFactorEnabled ? 'bg-primary-800 justify-end' : 'bg-slate-200 justify-start'
                    )}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </button>
                </div>
                <p className="text-[11px] text-text-500 leading-relaxed bg-surface-subtle p-3 rounded-xl border border-border-subtle">
                  Jika diaktifkan, login admin ke portal WebGIS akan memerlukan kode otentikasi dari aplikasi authenticator.
                </p>
              </div>

              {/* Active Sessions */}
              <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-text-950">Sesi Aktif Saat Ini</h4>
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                        Online
                      </span>
                    </div>
                    <p className="text-[11px] text-text-500 truncate">
                      macOS • Browser Chrome • Kota Bogor, ID
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar dari Sesi Ini (Logout)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PREFERENSI WEBGIS & NOTIFIKASI */}
        {activeTab === 'preferences' && (
          <PreferencesFormSection
            preferences={preferences}
            onSave={handleSavePreferences}
          />
        )}
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-text-500">Memuat pengaturan admin...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
