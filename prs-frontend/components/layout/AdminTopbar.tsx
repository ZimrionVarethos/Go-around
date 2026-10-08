'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import {
  BellIcon,
  DownloadSimpleIcon,
  ListIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { useAdminAuth } from '@/lib/admin-auth';
import { useAdminStore } from '@/lib/admin-store';
import { AdminProfileDropdown } from '@/components/admin/AdminProfileDropdown';
import { AdminNotificationDropdown } from '@/components/admin/AdminNotificationDropdown';
import { cn } from '@/lib/cn';

export interface AdminTopbarProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  onExport?: () => void;
  hideDefaultExport?: boolean;
  hideNotification?: boolean;
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
  onExport,
  hideDefaultExport = false,
  hideNotification = false,
  onOpenMobileMenu,
}: AdminTopbarProps) {
  const { profile } = useAdminAuth();
  const { unreadTicketsCount, newPlacesCount } = useAdminStore();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Shortcut global Cmd+K / Ctrl+K untuk fokus pencarian
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        if (showSearch && searchInputRef.current) {
          e.preventDefault();
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  const totalUnread = unreadTicketsCount + newPlacesCount;
  return (
    <header className="h-[68px] bg-white/95 backdrop-blur-md border-b border-[#E2E5DF] px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-4 shrink-0 select-none sticky top-0 z-30">
      {/* Left: Mobile Menu Trigger + Page Title & Breadcrumb OR Search Bar if no title */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-text-700 hover:bg-[#F5F6F3] border border-[#E2E5DF] transition-colors cursor-pointer shrink-0 tactile-press"
            title="Buka Menu"
          >
            <ListIcon size={20} weight="bold" />
          </button>
        )}
        {title ? (
          <div className="flex flex-col min-w-0">
            <h1
              className="text-base sm:text-lg font-extrabold text-text-950 truncate tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-onest), 'Onest', sans-serif" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-text-500 truncate hidden sm:block">{subtitle}</p>
            )}
          </div>
        ) : (
          /* Wide Search bar when no title is given */
          showSearch && (
            <div className="flex-1 max-w-2xl relative">
              <MagnifyingGlassIcon size={16} weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-14 py-2 text-xs bg-[#F5F6F3] border border-[#E2E5DF] rounded-xl text-text-900 placeholder:text-text-500 transition-all focus:bg-white focus:outline-none focus:border-[#005B54] shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)]"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium bg-white border border-[#D5D9D0] text-text-600 px-1.5 py-0.5 rounded-md shadow-2xs hidden sm:inline-block">
                ⌘K
              </span>
            </div>
          )
        )}
      </div>

      {/* Center Search bar (when title is present) */}
      {title && showSearch && (
        <div className="flex-1 max-w-sm relative hidden md:block">
          <MagnifyingGlassIcon size={16} weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-14 py-2 text-xs bg-[#F5F6F3] border border-[#E2E5DF] rounded-xl text-text-900 placeholder:text-text-500 transition-all focus:bg-white focus:outline-none focus:border-[#005B54]"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium bg-white border border-[#D5D9D0] text-text-600 px-1.5 py-0.5 rounded-md">
            ⌘K
          </span>
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {actions}

        {/* Export action */}
        {!hideDefaultExport && onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="hidden sm:inline-flex rounded-xl text-xs cursor-pointer tactile-press"
          >
            <DownloadSimpleIcon size={14} weight="bold" />
            <span>Ekspor Data</span>
          </Button>
        )}

        {/* Interactive Notification Bell & Dropdown */}
        {!hideNotification && (
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsNotificationOpen((prev) => !prev);
                setIsProfileDropdownOpen(false);
              }}
              title="Notifikasi Laporan & Kafe Baru"
              aria-expanded={isNotificationOpen}
              aria-haspopup="true"
              className={cn(
                'w-9 h-9 flex items-center justify-center rounded-xl border transition-all cursor-pointer relative shadow-2xs tactile-press',
                isNotificationOpen
                  ? 'bg-[#005B54]/[0.08] border-[#005B54]/30 text-[#005B54] ring-2 ring-[#005B54]/15'
                  : 'bg-white border-[#E2E5DF] hover:bg-[#F5F6F3] text-text-600 hover:text-text-950'
              )}
            >
              <BellIcon size={16} weight={isNotificationOpen ? 'fill' : 'duotone'} />
              {totalUnread > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger-base ring-2 ring-white animate-pulse" />
              )}
            </button>

            <AdminNotificationDropdown
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
            />
          </div>
        )}

        {/* Subtle Divider */}
        <div className="h-6 w-px bg-[#E2E5DF] mx-0.5 hidden sm:block" />

        {/* Profile Avatar Button & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsProfileDropdownOpen((prev) => !prev);
              setIsNotificationOpen(false);
            }}
            className={cn(
              'h-9 flex items-center gap-2 pl-1.5 pr-1.5 sm:pr-2.5 rounded-xl border transition-all cursor-pointer group tactile-press',
              isProfileDropdownOpen
                ? 'bg-[#005B54]/[0.08] border-[#005B54]/30 ring-2 ring-[#005B54]/15'
                : 'bg-white hover:bg-[#F5F6F3] border-[#E2E5DF] hover:border-[#CBD5E1] shadow-2xs'
            )}
            title="Menu Akun"
            aria-expanded={isProfileDropdownOpen}
            aria-haspopup="true"
          >
            <div className="w-6 h-6 rounded-md bg-[#005B54] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
              {profile.avatarInitials}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-text-900 truncate max-w-[130px] group-hover:text-[#005B54]">
              {profile.name}
            </span>
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
