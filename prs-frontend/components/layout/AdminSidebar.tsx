'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowSquareOutIcon,
  ChartBarIcon,
  CoffeeIcon,
  FileTextIcon,
  GearSixIcon,
  SquaresFourIcon,
  XIcon,
} from '@phosphor-icons/react';
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
        'ml-auto h-5 min-w-5 inline-flex items-center justify-center font-mono tabular-nums text-[10px] font-semibold leading-none px-1.5 rounded-md transition-colors shrink-0',
        variant === 'danger'
          ? 'bg-rose-50 text-rose-700 border border-rose-200/80'
          : 'bg-[#F5F6F3] text-text-700 border border-[#E2E5DF]'
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
    { href: '/admin', label: 'Dashboard', icon: SquaresFourIcon, exact: true },
    {
      href: '/admin/reports',
      label: 'Laporan & Tiket',
      icon: FileTextIcon,
      badge: unreadTicketsCount > 0 ? `${unreadTicketsCount}` : undefined,
      badgeVariant: 'danger' as const,
    },
    {
      href: '/admin/places',
      label: 'Kelola Kafe',
      icon: CoffeeIcon,
      badge: newPlacesCount > 0 ? `${newPlacesCount}` : undefined,
      badgeVariant: 'danger' as const,
    },
    { href: '/admin/analytics', label: 'Analisis Spasial', icon: ChartBarIcon },
  ];

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={cn(
        'w-[254px] h-[100dvh] bg-white border-r border-[#E2E5DF] flex flex-col shrink-0 select-none',
        className
      )}
    >
      {/* Brand Wordmark matching exact Figma 254x66px & Onest 24px */}
      <div className="h-[66px] flex items-center justify-between px-5 border-b border-[#E2E5DF] shrink-0">
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
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-text-400 hover:text-text-700 hover:bg-[#F5F6F3] transition-colors cursor-pointer shrink-0 tactile-press"
            title="Tutup Menu"
          >
            <XIcon size={16} weight="bold" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3.5 space-y-1">
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
                'flex items-center gap-2.5 px-3 h-9 rounded-xl text-xs transition-all tactile-press',
                active
                  ? 'bg-[#005B54]/[0.08] text-[#005B54] font-bold border border-[#005B54]/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]'
                  : 'text-text-700 font-medium hover:bg-[#F5F6F3] hover:text-text-950 border border-transparent'
              )}
            >
              <item.icon
                size={16}
                weight={active ? 'duotone' : 'regular'}
                className={cn(
                  'shrink-0 transition-colors',
                  active ? 'text-[#005B54]' : 'text-text-400'
                )}
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
      <div className="border-t border-[#E2E5DF] p-3.5 space-y-2 bg-[#F5F6F3]/40">
        <Link
          href="/"
          className="flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-text-700 hover:text-[#005B54] hover:bg-white rounded-xl border border-transparent hover:border-[#E2E5DF] transition-all tactile-press group"
        >
          <span className="flex items-center gap-2">
            <ArrowSquareOutIcon size={14} weight="duotone" className="text-text-400 group-hover:text-[#005B54] transition-colors" />
            <span>Lihat WebGIS Publik</span>
          </span>
          <span className="text-[10px] font-mono text-text-400 group-hover:text-[#005B54]">↗</span>
        </Link>
        {/* Settings Button linking to /admin/settings */}
        <Link
          href="/admin/settings"
          className={cn(
            'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all tactile-press',
            pathname.startsWith('/admin/settings')
              ? 'bg-[#005B54]/[0.08] text-[#005B54] border border-[#005B54]/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]'
              : 'bg-white text-text-700 hover:text-text-950 border border-[#E2E5DF] hover:border-[#CBD5E1] shadow-2xs'
          )}
        >
          <GearSixIcon
            size={16}
            weight={pathname.startsWith('/admin/settings') ? 'duotone' : 'regular'}
            className={cn(
              'shrink-0 transition-transform',
              pathname.startsWith('/admin/settings') ? 'text-[#005B54]' : 'text-text-500'
            )}
          />
          <span className="flex-1 truncate">Pengaturan</span>
        </Link>
      </div>
    </aside>
  );
}
