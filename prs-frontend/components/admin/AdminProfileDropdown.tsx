'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  ShieldCheck,
  ExternalLink,
  LogOut,
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
        'absolute z-50 w-56 bg-white rounded-xl border border-[#E2E5DF] shadow-tinted-teal overflow-hidden animate-in fade-in zoom-in-95 duration-150 select-none',
        getPlacementClasses(),
        className
      )}
    >
      {/* 1. Compact Account Header */}
      <div className="px-3.5 py-2.5 border-b border-[#E2E5DF] bg-[#F8F9F7]">
        <p className="text-xs font-bold text-text-950 truncate">{profile.name}</p>
        <p className="text-[11px] font-mono text-text-500 truncate mt-0.5">
          {profile.email}
        </p>
      </div>

      {/* 2. Single-Line Menu Items */}
      <div className="p-1.5 space-y-0.5 text-xs text-text-700">
        <Link
          href="/admin/settings?tab=profile"
          onClick={onClose}
          className="flex items-center gap-2.5 h-8 px-2.5 rounded-lg hover:bg-[#F5F6F3] hover:text-text-950 transition-colors font-medium group tactile-press"
        >
          <User className="w-3.5 h-3.5 text-text-400 group-hover:text-[#005B54] transition-colors shrink-0" />
          <span>Profil Akun</span>
        </Link>

        <Link
          href="/admin/settings?tab=security"
          onClick={onClose}
          className="flex items-center gap-2.5 h-8 px-2.5 rounded-lg hover:bg-[#F5F6F3] hover:text-text-950 transition-colors font-medium group tactile-press"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-text-400 group-hover:text-[#005B54] transition-colors shrink-0" />
          <span>Kata Sandi</span>
        </Link>
      </div>

      {/* 3. Divider & Footer Actions */}
      <div className="p-1.5 border-t border-[#E2E5DF] space-y-0.5">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center justify-between gap-2 h-8 px-2.5 rounded-lg text-xs text-text-700 hover:text-[#005B54] hover:bg-[#F5F6F3] transition-colors font-medium tactile-press group"
        >
          <span className="flex items-center gap-2.5">
            <ExternalLink className="w-3.5 h-3.5 text-text-400 group-hover:text-[#005B54] shrink-0" />
            <span>WebGIS Publik</span>
          </span>
          <span className="text-[10px] font-mono text-text-400 group-hover:text-[#005B54]">↗</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 h-8 px-2.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors font-semibold cursor-pointer text-left tactile-press"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
}
