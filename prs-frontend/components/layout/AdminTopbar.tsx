'use client';

import { Bell, Download, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import React, { ReactNode } from 'react';

export interface AdminTopbarProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  showSearch?: boolean;
  onOpenMobileMenu?: () => void;
}

export function AdminTopbar({
  title,
  subtitle,
  actions,
  showSearch = true,
  onOpenMobileMenu,
}: AdminTopbarProps) {
  return (
    <header className="h-[68px] bg-white border-b border-border-subtle px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-4 shrink-0 select-none">
      {/* Left: Mobile Menu Trigger + Page Title & Breadcrumb */}
      <div className="flex items-center gap-2.5 min-w-0">
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
        <div className="flex flex-col min-w-0">
          {title && (
            <h1 className="text-base sm:text-lg font-bold text-text-950 truncate tracking-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs text-text-500 truncate hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Center Search bar */}
      {showSearch && (
        <div className="flex-1 max-w-sm relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-400" />
          <input
            type="text"
            placeholder="Cari kafe, jalan, ID spasial..."
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
        <Button variant="outline" size="sm" className="hidden sm:inline-flex rounded-md text-xs">
          <Download className="w-3.5 h-3.5" />
          <span>Ekspor Data</span>
        </Button>

        {/* Notification Bell */}
        <button
          title="Notifikasi"
          className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-surface-header text-text-500 hover:text-text-900 transition-colors cursor-pointer relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger-base" />
        </button>
      </div>
    </header>
  );
}
