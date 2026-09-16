'use client';

import { useState } from 'react';
import { Bell, Download, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import React, { ReactNode } from 'react';
import { useAdminAuth } from '@/lib/admin-auth';
import { AdminProfileDropdown } from '@/components/admin/AdminProfileDropdown';

export interface AdminTopbarProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  hideDefaultExport?: boolean;
  onOpenMobileMenu?: () => void;
}

export function AdminTopbar({
  title,
  subtitle,
  actions,
  showSearch = true,
  searchPlaceholder = 'Cari kafe, jalan, ID spasial...',
  searchValue,
  onSearchChange,
  hideDefaultExport = false,
  onOpenMobileMenu,
}: AdminTopbarProps) {
  const { profile } = useAdminAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <header className="h-[68px] bg-white border-b border-border-subtle px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-4 shrink-0 select-none">
      {/* Left: Mobile Menu Trigger + Page Title & Breadcrumb OR Search Bar if no title */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-text-700 hover:bg-surface-subtle border border-border-subtle transition-colors cursor-pointer shrink-0"
            title="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {title ? (
          <div className="flex flex-col min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-text-950 truncate tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-text-500 truncate hidden sm:block">{subtitle}</p>
            )}
          </div>
        ) : (
          /* Wide Search bar when no title is given (Figma standard) */
          showSearch && (
            <div className="flex-1 max-w-2xl relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-14 py-2 text-xs bg-surface-subtle border border-border-subtle rounded-xl text-text-900 placeholder:text-text-400 transition-all focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700 shadow-xs"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-white border border-border-strong text-text-500 px-1.5 py-0.5 rounded-xs shadow-xs">
                ⌘K
              </span>
            </div>
          )
        )}
      </div>

      {/* Center Search bar (when title is present) */}
      {title && showSearch && (
        <div className="flex-1 max-w-sm relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-14 py-2 text-xs bg-surface-subtle border border-border-subtle rounded-md text-text-900 placeholder:text-text-400 transition-all focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-white border border-border-strong text-text-500 px-1 py-0.5 rounded-xs">
            ⌘K
          </span>
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {actions}

        {/* Export action */}
        {!hideDefaultExport && (
          <Button variant="outline" size="sm" className="hidden sm:inline-flex rounded-md text-xs">
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Data</span>
          </Button>
        )}

        {/* Notification Bell */}
        <button
          title="Notifikasi"
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-border-subtle hover:bg-surface-header text-text-500 hover:text-text-900 transition-colors cursor-pointer relative shadow-xs"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger-base ring-2 ring-white" />
        </button>

        {/* Subtle Divider */}
        <div className="h-6 w-px bg-border-subtle mx-0.5 hidden sm:block" />

        {/* Profile Avatar Button & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-surface-subtle border border-border-subtle hover:border-border-strong transition-all cursor-pointer group"
            title="Menu Profil & Pengaturan"
            aria-expanded={isProfileDropdownOpen}
            aria-haspopup="true"
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center text-white text-xs font-bold shadow-xs group-hover:scale-105 transition-transform">
                {profile.avatarInitials}
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
                title="Status: Online"
              />
            </div>
            <div className="hidden lg:flex flex-col text-left pr-1 min-w-0">
              <span className="text-xs font-semibold text-text-900 truncate max-w-[120px] group-hover:text-primary-950">
                {profile.name}
              </span>
              <span className="text-[10px] text-text-500 truncate max-w-[120px]">
                {profile.role.split(' ')[0]}
              </span>
            </div>
          </button>

          <AdminProfileDropdown
            isOpen={isProfileDropdownOpen}
            onClose={() => setIsProfileDropdownOpen(false)}
            placement="bottom-right"
          />
        </div>
      </div>
    </header>
  );
}
