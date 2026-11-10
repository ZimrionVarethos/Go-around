'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ArrowCounterClockwiseIcon,
} from '@phosphor-icons/react';
import { useAdminAuth } from '@/lib/admin-auth';

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
    <div
      className="relative min-h-[100dvh] w-full flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden selection:bg-[#005B54] selection:text-white"
      style={{
        background:
          'radial-gradient(circle at 85% 18%, #EFE6D5 0%, #F5EFE6 55%, #EDE4D3 100%)',
      }}
    >
      {/* Subtle Ambient Warmth Circles on Outer Backdrop */}
      <div
        className="pointer-events-none absolute -right-24 -bottom-24 w-[420px] h-[420px] rounded-full"
        style={{ background: 'rgba(236, 196, 87, 0.16)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 -top-24 w-[360px] h-[360px] rounded-full"
        style={{ background: 'rgba(0, 91, 84, 0.05)' }}
        aria-hidden="true"
      />

      {/* Main Clean White Canvas Frame */}
      <div className="relative z-10 w-full max-w-[1060px] min-h-[600px] bg-white rounded-[32px] shadow-[0_28px_70px_-18px_rgba(15,23,42,0.09)] border border-white/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Far-Left Vertical Teal Accent Pillar (#005B54) */}
        <div
          className="hidden sm:block absolute left-0 top-0 bottom-0 w-[22px] bg-[#005B54] z-20"
          aria-hidden="true"
        />

        {/* =================================================================
            LEFT COLUMN (6 COLS): GO AROUND NUGAS & NONGKRONG + 3D ICONS
           ================================================================= */}
        <section className="relative lg:col-span-6 flex flex-col justify-between px-6 pt-7 pb-4 sm:pl-14 sm:pr-6 sm:py-10">
          {/* Top-Left: Transparent Brand Wordmark + 3D Pin Icon */}
          <div className="relative z-20 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 focus-visible:outline-none group"
              aria-label="Go Around Peta Publik"
            >
              <Image
                src="/images/auth/icon_3d_pin.webp"
                alt=""
                width={34}
                height={44}
                className="w-8 h-8 object-contain drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
                unoptimized
              />
              <div className="inline-flex items-baseline">
                <span
                  style={{
                    color: '#005B54',
                    fontFamily: "var(--font-onest), 'Onest', sans-serif",
                    fontSize: 'clamp(24px, 2.2vw, 28px)',
                    fontWeight: 600,
                    lineHeight: 1,
                    letterSpacing: '-0.04em',
                  }}
                >
                  Go Around
                </span>
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full bg-[#ECC457] ml-1"
                  aria-hidden="true"
                />
              </div>
            </Link>
          </div>

          {/* Center Illustration: Go Around Students Nugas & Nongkrong */}
          <div className="relative z-10 my-4 lg:my-auto flex items-center justify-center py-2">
            {/* Soft Warm Ambient Glow Behind Characters */}
            <div
              className="pointer-events-none absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(236,196,87,0.18) 0%, rgba(0,91,84,0.05) 68%, transparent 100%)',
              }}
              aria-hidden="true"
            />

            {/* Main Character Illustration: Students Nugas & Nongkrong at Cafe Booth (Transparent BG) */}
            <Image
              src="/images/auth/nugas_booth_char.webp"
              alt="Ilustrasi mahasiswa sedang nugas dan nongkrong di kafe Kota Bogor"
              width={860}
              height={836}
              priority
              unoptimized
              className="relative z-10 w-full max-w-[300px] sm:max-w-[390px] lg:max-w-[430px] h-auto object-contain select-none pointer-events-none drop-shadow-[0_14px_24px_rgba(15,23,42,0.06)]"
            />
          </div>

          {/* Bottom Left Short Tagline */}
          <div className="hidden lg:block relative z-20">
            <p className="text-xs font-medium text-text-500">
              Teman eksplorasi tempat nugas &amp; nongkrong ramah mahasiswa di Kota Bogor.
            </p>
          </div>
        </section>

        {/* =================================================================
            RIGHT COLUMN (6 COLS): CLEAN, SPACIOUS ADMIN LOGIN FORM
           ================================================================= */}
        <main className="relative z-20 lg:col-span-6 flex flex-col justify-center items-center px-6 pb-10 pt-2 sm:px-12 lg:px-14 lg:py-12">
          <div className="w-full max-w-[360px] text-center">
            {viewMode === 'login' && (
              <div className="animate-in fade-in duration-150 space-y-7">
                {/* Heading & Admin Copywriting */}
                <div className="space-y-2.5">
                  <div className="inline-flex items-center justify-center gap-2.5">
                    <Image
                      src="/images/auth/icon_3d_shield.webp"
                      alt=""
                      width={40}
                      height={46}
                      unoptimized
                      className="w-9 h-9 object-contain drop-shadow-xs"
                    />
                    <h1 className="text-3xl sm:text-[34px] font-bold tracking-tight text-[#0F172A]">
                      Log in
                    </h1>
                  </div>
                  <p className="text-xs sm:text-[13px] text-text-500 leading-relaxed px-2">
                    Halo, Admin! Kelola direktori kafe, info Wi-Fi &amp; colokan, serta
                    verifikasi laporan tempat nugas di sini.
                  </p>
                </div>

                {errorMessage && (
                  <div
                    role="alert"
                    className="px-4 py-3 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold text-left"
                  >
                    {errorMessage}
                  </div>
                )}

                {/* Soft Pill Inputs & Primary Teal CTA */}
                <form onSubmit={handleSubmitLogin} className="space-y-3.5 text-left">
                  <div>
                    <label htmlFor="admin-email" className="sr-only">
                      Alamat Email Pengelola
                    </label>
                    <input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Masukkan Email"
                      autoComplete="email"
                      required
                      className="w-full h-12 px-5 rounded-full bg-[#F1F3F0] focus:bg-white border border-transparent focus:border-[#005B54] text-sm font-medium text-text-900 placeholder:text-text-400 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="admin-password" className="sr-only">
                      Kata Sandi
                    </label>
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Kata sandi"
                      autoComplete="current-password"
                      required
                      className="w-full h-12 pl-5 pr-24 rounded-full bg-[#F1F3F0] focus:bg-white border border-transparent focus:border-[#005B54] text-sm font-medium text-text-900 placeholder:text-text-400 focus:outline-none transition-all"
                    />

                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-text-400 hover:text-text-700 cursor-pointer p-1.5 rounded-full focus-visible:outline-none tactile-press"
                        aria-label={
                          showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
                        }
                      >
                        {showPassword ? (
                          <EyeSlashIcon size={16} weight="bold" />
                        ) : (
                          <EyeIcon size={16} weight="bold" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setErrorMessage('');
                          setResetEmail(email);
                          setViewMode('forgot');
                        }}
                        className="text-xs font-semibold text-[#005B54] hover:underline cursor-pointer pr-1"
                      >
                        Lupa?
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 rounded-full bg-[#005B54] hover:bg-[#004741] disabled:opacity-60 text-white text-sm font-semibold shadow-[0_12px_26px_-8px_rgba(0,91,84,0.45)] transition-all cursor-pointer flex items-center justify-center tactile-press"
                    >
                      <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
                    </button>
                  </div>
                </form>

                {/* Bottom Navigation Link */}
                <div className="pt-2 text-xs text-text-500">
                  Ingin menjelajahi tempat nugas?{' '}
                  <Link
                    href="/"
                    className="font-semibold text-[#005B54] underline underline-offset-4 hover:text-[#004741]"
                  >
                    Buka Peta Publik
                  </Link>
                </div>
              </div>
            )}

            {viewMode === 'forgot' && (
              <div className="animate-in fade-in duration-150 space-y-6 text-left">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#0F172A]">
                    Pemulihan Sandi
                  </h1>
                  <p className="text-xs sm:text-[13px] text-text-500 leading-relaxed">
                    Masukkan alamat email pengelola yang terdaftar untuk menerima tautan
                    pengaturan ulang kata sandi.
                  </p>
                </div>

                {errorMessage && (
                  <div
                    role="alert"
                    className="px-4 py-3 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold"
                  >
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmitReset} className="space-y-3.5">
                  <div>
                    <label htmlFor="reset-email" className="sr-only">
                      Email Terdaftar
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Email pengelola terdaftar"
                      required
                      className="w-full h-12 px-5 rounded-full bg-[#F1F3F0] focus:bg-white border border-transparent focus:border-[#005B54] text-sm font-medium text-text-900 placeholder:text-text-400 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage('');
                        setViewMode('login');
                      }}
                      className="h-12 px-6 rounded-full bg-[#F1F3F0] hover:bg-[#E5E8E3] text-sm font-semibold text-text-700 transition-colors cursor-pointer tactile-press"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 h-12 rounded-full bg-[#005B54] hover:bg-[#004741] disabled:opacity-60 text-white text-sm font-semibold shadow-[0_12px_26px_-8px_rgba(0,91,84,0.45)] transition-all cursor-pointer tactile-press"
                    >
                      {isLoading ? 'Mengirim...' : 'Kirim Tautan Reset'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {viewMode === 'sent' && (
              <div className="animate-in fade-in duration-150 space-y-5 text-left">
                <div className="p-5 rounded-2xl bg-[#F4F6F3] border border-[#DCE0D8] space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#005B54]">
                    <CheckCircleIcon size={18} weight="fill" className="shrink-0" />
                    <span>Tautan Pemulihan Terkirim</span>
                  </div>
                  <p className="text-xs text-text-600 leading-relaxed">
                    Instruksi pengaturan ulang kata sandi telah dikirimkan ke{' '}
                    <span className="font-mono font-semibold text-text-900">{resetEmail}</span>.
                    Silakan periksa kotak masuk Anda.
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-text-500 px-1">
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
                  className="w-full h-12 rounded-full bg-[#F1F3F0] hover:bg-[#E5E8E3] text-sm font-semibold text-text-800 transition-colors cursor-pointer flex items-center justify-center gap-2 tactile-press"
                >
                  <ArrowCounterClockwiseIcon size={16} weight="bold" className="text-text-500" />
                  <span>Kembali ke Log in</span>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
