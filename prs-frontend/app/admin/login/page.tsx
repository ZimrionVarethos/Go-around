'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth';
import { CartographicBackground } from '@/components/admin/auth/CartographicBackground';

type AuthViewMode = 'login' | 'forgot' | 'sent';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();

  const [viewMode, setViewMode] = useState<AuthViewMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 250));

    const result = login(email, password);

    if (result.success) {
      router.push('/admin');
    } else {
      setIsLoading(false);
      setErrorMessage(result.error || 'Email atau kata sandi tidak sesuai.');
    }
  };

  const handleSubmitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setErrorMessage('Masukkan alamat email pengelola yang valid.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsLoading(false);
    setResendCooldown(30);
    setViewMode('sent');
  };

  const handleResendReset = async () => {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between bg-[#F2F4F0] text-[#0F172A] px-4 py-6 sm:px-8 select-none overflow-hidden">
      <CartographicBackground />

      {/* Top Bar: Back Link & Subtle Spatial Reference */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-white/85 hover:bg-white border border-[#DCDFD9] text-xs font-semibold text-text-700 hover:text-text-950 transition-all group tactile-press shadow-2xs backdrop-blur-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-text-500 group-hover:text-text-950 transition-transform group-hover:-translate-x-0.5" />
          <span>Peta Publik</span>
        </Link>

        <span className="hidden sm:inline-block font-mono text-[11px] text-text-500 tabular-nums">
          6°35&apos;48&quot;S · 106°47&apos;50&quot;E — KOTA BOGOR
        </span>
      </header>

      {/* Center Structured Login Card */}
      <main className="relative z-10 w-full max-w-[388px] mx-auto my-auto py-8">
        <div className="bg-white rounded-xl border border-[#DCDFD9] shadow-[0_12px_32px_-8px_rgba(15,23,42,0.08),0_2px_6px_-1px_rgba(0,91,84,0.05)] overflow-hidden">
          {/* 1. Card Identity Header */}
          <div className="px-6 py-4 bg-[#F8F9F7] border-b border-[#E2E5DF] flex items-center justify-between">
            <span
              style={{
                color: '#0F172A',
                fontFamily: "var(--font-onest), 'Onest', sans-serif",
                fontSize: '22px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: 'normal',
                letterSpacing: '-0.724px',
              }}
            >
              Go Around
            </span>

            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#005B54] bg-[#005B54]/[0.08] border border-[#005B54]/15 px-2 py-0.5 rounded">
              Admin Portal
            </span>
          </div>

          {/* 2. Card Body: Switchable Login / Forgot / Sent */}
          <div className="p-6">
            {viewMode === 'login' && (
              <div className="animate-in fade-in duration-150">
                <div className="mb-5">
                  <h1 className="text-base font-bold text-text-950 tracking-tight">
                    Masuk ke Ruang Kerja
                  </h1>
                  <p className="text-xs text-text-500 mt-0.5">
                    Pengelolaan direktori kafe &amp; moderasi laporan Kota Bogor.
                  </p>
                </div>

                {errorMessage && (
                  <div
                    role="alert"
                    className="mb-4 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium"
                  >
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmitLogin} className="space-y-4">
                  <div>
                    <label
                      htmlFor="admin-email"
                      className="block text-xs font-semibold text-text-800 mb-1.5"
                    >
                      Alamat Email
                    </label>
                    <input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@goaround.id"
                      autoComplete="email"
                      required
                      className="w-full h-9 px-3 text-xs font-mono bg-white border border-[#CBD5E1] rounded-lg text-text-900 placeholder:text-text-400 focus:outline-none focus:ring-2 focus:ring-[#005B54]/15 focus:border-[#005B54] transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="admin-password"
                        className="block text-xs font-semibold text-text-800"
                      >
                        Kata Sandi
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMessage('');
                          setResetEmail(email);
                          setViewMode('forgot');
                        }}
                        className="text-[11px] font-semibold text-[#005B54] hover:underline cursor-pointer"
                      >
                        Lupa sandi?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="admin-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan kata sandi"
                        autoComplete="current-password"
                        required
                        className="w-full h-9 pl-3 pr-9 text-xs bg-white border border-[#CBD5E1] rounded-lg text-text-900 placeholder:text-text-400 focus:outline-none focus:ring-2 focus:ring-[#005B54]/15 focus:border-[#005B54] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-400 hover:text-text-700 cursor-pointer p-1 rounded focus-visible:outline-none tactile-press"
                        aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-9 rounded-lg bg-[#005B54] hover:bg-[#004741] disabled:opacity-60 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 tactile-press"
                    >
                      <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
                      {!isLoading && (
                        <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/15 text-white/90 leading-none">
                          ↵
                        </kbd>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {viewMode === 'forgot' && (
              <div className="animate-in fade-in duration-150">
                <div className="mb-5">
                  <h1 className="text-base font-bold text-text-950 tracking-tight">
                    Pemulihan Kata Sandi
                  </h1>
                  <p className="text-xs text-text-500 mt-0.5 leading-relaxed">
                    Masukkan email pengelola untuk menerima tautan pengaturan ulang kata sandi.
                  </p>
                </div>

                {errorMessage && (
                  <div
                    role="alert"
                    className="mb-4 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium"
                  >
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmitReset} className="space-y-4">
                  <div>
                    <label
                      htmlFor="reset-email"
                      className="block text-xs font-semibold text-text-800 mb-1.5"
                    >
                      Email Terdaftar
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="admin@goaround.id"
                      required
                      className="w-full h-9 px-3 text-xs font-mono bg-white border border-[#CBD5E1] rounded-lg text-text-900 placeholder:text-text-400 focus:outline-none focus:ring-2 focus:ring-[#005B54]/15 focus:border-[#005B54] transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage('');
                        setViewMode('login');
                      }}
                      className="h-9 px-3 rounded-lg border border-[#E2E5DF] bg-white hover:bg-[#F5F6F3] text-xs font-semibold text-text-700 transition-colors cursor-pointer tactile-press"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 h-9 rounded-lg bg-[#005B54] hover:bg-[#004741] disabled:opacity-60 text-white text-xs font-semibold transition-colors cursor-pointer tactile-press"
                    >
                      {isLoading ? 'Mengirim...' : 'Kirim Tautan Reset'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {viewMode === 'sent' && (
              <div className="animate-in fade-in duration-150 space-y-4">
                <div className="p-3.5 rounded-lg bg-[#F8F9F7] border border-[#E2E5DF] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#005B54]">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Tautan Pemulihan Terkirim</span>
                  </div>
                  <p className="text-xs text-text-600 leading-relaxed">
                    Instruksi pengaturan ulang kata sandi telah dikirimkan ke{' '}
                    <span className="font-mono font-semibold text-text-900">{resetEmail}</span>.
                    Silakan periksa kotak masuk Anda.
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-text-500 px-0.5">
                  <span>Belum menerima email?</span>
                  <button
                    type="button"
                    onClick={handleResendReset}
                    disabled={resendCooldown > 0}
                    className="font-semibold text-[#005B54] disabled:text-text-400 hover:underline disabled:no-underline cursor-pointer disabled:cursor-default"
                  >
                    {resendCooldown > 0
                      ? `Kirim ulang dalam ${resendCooldown}d`
                      : 'Kirim ulang tautan'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setViewMode('login')}
                  className="w-full h-9 rounded-lg border border-[#E2E5DF] bg-white hover:bg-[#F5F6F3] text-xs font-semibold text-text-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5 tactile-press"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-text-500" />
                  <span>Kembali ke Halaman Masuk</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between text-[11px] text-text-500">
        <span>Go Around · WebGIS Tempat Nugas Kota Bogor</span>
        <span className="font-mono">SRID 4326</span>
      </footer>
    </div>
  );
}
