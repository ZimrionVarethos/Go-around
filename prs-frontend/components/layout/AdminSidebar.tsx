'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Coffee,
  BarChart2,
  ExternalLink,
  X,
} from 'lucide-react';
import { cn } from '@/lib/cn';

import { useAdminStore } from '@/lib/admin-store';

export interface AdminSidebarProps {
  onCloseMobile?: () => void;
  className?: string;
}

type BadgeVariant = 'danger' | 'default';

function NavBadge({ label, variant }: { label: string; variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        'ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full transition-all duration-200 animate-in fade-in',
        variant === 'danger'
          ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-xs'
          : 'bg-surface-header text-text-700 border border-border-subtle'
      )}
    >
      {label}
    </span>
  );
}

export function AdminSidebar({ onCloseMobile, className }: AdminSidebarProps = {}) {
  const pathname = usePathname();
  const { unreadTicketsCount, newPlacesCount } = useAdminStore();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    {
      href: '/admin/reports',
      label: 'Report / Tiket',
      icon: FileText,
      badge: unreadTicketsCount > 0 ? `${unreadTicketsCount} baru` : undefined,
      badgeVariant: 'danger' as const,
    },
    {
      href: '/admin/places',
      label: 'Kelola Kafe',
      icon: Coffee,
      badge: newPlacesCount > 0 ? `${newPlacesCount} baru` : undefined,
      badgeVariant: 'danger' as const,
    },
    { href: '/admin/analytics', label: 'Analisis Pengguna', icon: BarChart2 },
  ];

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className={cn('w-[254px] h-screen bg-white border-r border-border-subtle flex flex-col shrink-0 select-none', className)}>
      {/* Brand Wordmark matching exact Figma 254x66px & Onest 24px */}
      <div className="h-[66px] flex items-center justify-between px-5 border-b border-border-subtle shrink-0">
        <Link
          href="/admin"
          className="select-none"
          style={{
            display: 'flex',
            width: '254px',
            height: '66px',
            flexDirection: 'column',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              color: '#0F172A',
              fontFamily: "var(--font-onest), 'Onest', sans-serif",
              fontSize: '24px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: 'normal',
              letterSpacing: '-0.724px',
            }}
          >
            Go Around
          </span>
        </Link>

        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-text-400 hover:text-text-700 hover:bg-surface-subtle transition-colors cursor-pointer shrink-0"
            title="Tutup Menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="text-[11px] font-semibold text-text-400 uppercase tracking-wider px-3 py-2">
          Navigasi Utama
        </p>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-primary-100 text-primary-900 font-semibold border-l-[3px] border-primary-900'
                  : 'text-text-700 hover:bg-surface-subtle hover:text-text-900'
              )}
            >
              <item.icon
                className={cn('w-4 h-4 shrink-0', active ? 'text-primary-900' : 'text-text-400')}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <NavBadge label={item.badge} variant={item.badgeVariant} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border-subtle p-3 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-700 hover:text-primary-900 hover:bg-surface-subtle rounded-lg transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Lihat WebGIS Publik</span>
        </Link>
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-surface-subtle border border-border-subtle">
          <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center text-white text-xs font-bold shrink-0">
            AS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-text-900 truncate">Azqilla Simbolon</p>
            <p className="text-[11px] text-text-500">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
