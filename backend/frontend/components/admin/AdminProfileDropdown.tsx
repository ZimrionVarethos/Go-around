'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  ShieldCheck,
  Sliders,
  ExternalLink,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useAdminAuth } from '@/lib/admin-auth';

export interface AdminProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
}

export function AdminProfileDropdown({
  isOpen,
  onClose,
  placement = 'bottom-right',
  className,
}: AdminProfileDropdownProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { profile, logout } = useAdminAuth();

  // Close on outside click or ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogout = () => {
    onClose();
    logout();
    router.push('/admin/login');
  };

  const getPlacementClasses = () => {
    switch (placement) {
      case 'top-left':
        return 'bottom-full left-0 mb-2 origin-bottom-left';
      case 'top-right':
        return 'bottom-full right-0 mb-2 origin-bottom-right';
      case 'bottom-left':
        return 'top-full left-0 mt-2 origin-top-left';
      case 'bottom-right':
      default:
        return 'top-full right-0 mt-2 origin-top-right';
    }
  };

  return (
    <div
      ref={dropdownRef}
      role="menu"
      aria-orientation="vertical"
      className={cn(
        'absolute z-50 w-72 rounded-2xl bg-white border border-border-subtle shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150 select-none overflow-hidden',
        getPlacementClasses(),
        className
      )}
    >
      {/* 1. Header Profil Info */}
      <div className="p-4 bg-gradient-to-br from-primary-50/70 via-surface-subtle to-white border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-primary-900 text-white font-bold text-sm flex items-center justify-center shadow-xs">
              {profile.avatarInitials}
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white"
              title="Aktif / Online"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-text-950 truncate">
                {profile.name}
              </h4>
            </div>
            <p className="text-xs text-text-500 truncate mt-0.5">{profile.email}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-primary-100/80 text-primary-900 px-2 py-0.5 rounded-full border border-primary-200/50">
                <Sparkles className="w-2.5 h-2.5 text-primary-700" />
                {profile.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Menu Items Navigation */}
      <div className="p-1.5 space-y-0.5 text-xs text-text-700">
        <Link
          href="/admin/settings?tab=profile"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-surface-subtle hover:text-text-950 transition-colors font-medium"
        >
          <User className="w-4 h-4 text-text-400" />
          <div className="flex-1">
            <span className="block">Pengaturan Profil</span>
            <span className="text-[10px] text-text-400 font-normal">
              Informasi akun & kontak
            </span>
          </div>
        </Link>

        <Link
          href="/admin/settings?tab=security"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-surface-subtle hover:text-text-950 transition-colors font-medium"
        >
          <ShieldCheck className="w-4 h-4 text-text-400" />
          <div className="flex-1">
            <span className="block">Keamanan & Sandi</span>
            <span className="text-[10px] text-text-400 font-normal">
              Ganti password & sesi
            </span>
          </div>
        </Link>

        <Link
          href="/admin/settings?tab=preferences"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-surface-subtle hover:text-text-950 transition-colors font-medium"
        >
          <Sliders className="w-4 h-4 text-text-400" />
          <div className="flex-1">
            <span className="block">Preferensi WebGIS</span>
            <span className="text-[10px] text-text-400 font-normal">
              Basemap, buffer & notifikasi
            </span>
          </div>
        </Link>
      </div>

      {/* 3. Divider & Footer Actions */}
      <div className="p-1.5 border-t border-border-subtle bg-surface-subtle/50 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-text-600 hover:text-primary-900 hover:bg-white transition-colors font-medium"
        >
          <ExternalLink className="w-4 h-4 text-text-400" />
          <span>Lihat WebGIS Publik</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors font-semibold cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar dari Portal Admin</span>
        </button>
      </div>
    </div>
  );
}
