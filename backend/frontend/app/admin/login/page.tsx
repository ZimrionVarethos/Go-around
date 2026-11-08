'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowLeft,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const { toasts, showToast, dismissToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    // Simulate quick network/auth check
    await new Promise((resolve) => setTimeout(resolve, 450));

    const result = login(email, password);

    if (result.success) {
      showToast('Login berhasil! Mengalihkan ke Dashboard...', 'success', 2500);
      setTimeout(() => {
        router.push('/admin');
      }, 500);
    } else {
      setIsLoading(false);
      setErrorMessage(result.error || 'Email atau kata sandi tidak valid.');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@goaround.id');
    setPassword('admin123');
    setErrorMessage('');
    showToast('Kredensial demo terisi otomatis! Silakan klik Masuk.', 'info', 2500);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] select-none">
      {/* 1. Left Side Hero Banner (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#003833] via-[#005B54] to-[#0F172A] text-white p-12 flex-col justify-between overflow-hidden">
        {/* Background Ambient Circles & Grid Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl" />

        {/* Top Brand Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:bg-white/20 transition-all">
              <Coffee className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Go Around
              </span>
              <span className="text-[10px] block text-emerald-300 font-medium tracking-wider uppercase">
                Admin Portal SIG
              </span>
            </div>
          </Link>
        </div>

        {/* Center Content / Pitch */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-emerald-200 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tata Kelola Data Spasial Tempat Nugas Mahasiswa</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight">
            Portal Administrasi WebGIS Kota Bogor
          </h1>

          <p className="text-sm text-slate-200 leading-relaxed font-normal">
            Kelola master data kafe ramah mahasiswa, verifikasi laporan fasilitas colokan & Wi-Fi, serta analisis koridor transit Biskita Transpakuan dan jangkauan kampus IPB University secara terintegrasi.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Radius Buffer</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Pemetaan jarak tempuh jalan kaki 500m hingga 2km dari kampus.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Moderasi Komunitas</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Verifikasi usulan kafe baru dan tiket laporan fasilitas real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="relative z-10 text-xs text-slate-400 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} Go-around Kota Bogor</span>
          <span className="flex items-center gap-1.5 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Server Spasial Online
          </span>
        </div>
      </div>

      {/* 2. Right Side Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md space-y-6">
          {/* Back link */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke WebGIS Publik</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-primary-900 flex items-center justify-center text-white">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-base">Go Around Admin</span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Masuk ke Portal Admin
            </h2>
            <p className="text-xs text-slate-500">
              Silakan masukkan kredensial administrator untuk mengelola data WebGIS.
            </p>
          </div>

          {/* 1-Click Demo Fill Box */}
          <div className="p-3.5 rounded-xl bg-primary-50 border border-primary-200/80 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary-950">
                <Sparkles className="w-3.5 h-3.5 text-primary-700 shrink-0" />
                <span>Pengujian & Evaluasi Cepat</span>
              </div>
              <p className="text-[11px] text-primary-800 truncate mt-0.5">
                Akun: <code className="font-mono bg-white/70 px-1 py-0.5 rounded text-[10px]">admin@goaround.id</code>
              </p>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-3 py-1.5 text-xs font-bold bg-primary-900 hover:bg-primary-950 text-white rounded-lg transition-all cursor-pointer shadow-xs shrink-0"
            >
              Gunakan Demo
            </button>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Administrator
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@goaround.id"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 transition-all shadow-2xs placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Kata Sandi
                </label>
                <span className="text-[11px] text-slate-400 hover:text-primary-800 cursor-pointer">
                  Lupa sandi?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 transition-all shadow-2xs placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                  title={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-primary-900 rounded cursor-pointer"
                />
                <span>Ingat sesi saya di perangkat ini</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full rounded-xl justify-center font-bold text-xs gap-2 py-3 shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi Sesi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Security footnote */}
          <div className="pt-4 text-center">
            <p className="text-[11px] text-slate-400">
              Khusus pengelola data spasial Bappeda & Tim WebGIS Go-around Kota Bogor.
            </p>
          </div>
        </div>
      </div>

      {/* Global Toast */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
