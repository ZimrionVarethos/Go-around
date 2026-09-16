'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Coffee,
  CheckCheck,
  Clock,
  ArrowRight,
  AlertTriangle,
  Zap,
  Wifi,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useAdminStore } from '@/lib/admin-store';

export interface AdminNotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

type NotificationTab = 'all' | 'tickets' | 'places';

export function AdminNotificationDropdown({
  isOpen,
  onClose,
  className,
}: AdminNotificationDropdownProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<NotificationTab>('all');

  const {
    tickets,
    places,
    unreadTicketsCount,
    newPlacesCount,
    markTicketAsRead,
    markAllTicketsAsRead,
    markPlaceAsReviewed,
    markAllPlacesAsReviewed,
  } = useAdminStore();

  const totalUnread = unreadTicketsCount + newPlacesCount;

  // Filter items
  const unreadTickets = tickets.filter((t) => t.status === 'open');
  const reviewPlaces = places.filter((p) => p.status === 'review');

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

  const handleMarkAllRead = () => {
    markAllTicketsAsRead();
    markAllPlacesAsReviewed();
  };

  const handleTicketClick = (ticketId: string) => {
    markTicketAsRead(ticketId);
    onClose();
    router.push('/admin/reports');
  };

  const handlePlaceClick = (placeId: number) => {
    markPlaceAsReviewed(placeId);
    onClose();
    router.push('/admin/places');
  };

  return (
    <div
      ref={dropdownRef}
      role="region"
      aria-label="Notifikasi Administrator"
      className={cn(
        'absolute right-0 top-full mt-2 z-50 w-[360px] sm:w-[390px] rounded-2xl bg-white border border-border-subtle shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150 select-none overflow-hidden flex flex-col max-h-[520px]',
        className
      )}
    >
      {/* 1. Header */}
      <div className="p-4 border-b border-border-subtle bg-gradient-to-r from-surface-subtle to-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center text-primary-900 shadow-2xs">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-950 flex items-center gap-1.5">
              <span>Notifikasi Admin</span>
              {totalUnread > 0 && (
                <span className="text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.2 rounded-full">
                  {totalUnread} baru
                </span>
              )}
            </h4>
            <p className="text-[11px] text-text-500">Aktivitas pelaporan & usulan kafe</p>
          </div>
        </div>

        {totalUnread > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-[11px] font-semibold text-primary-900 hover:text-primary-950 flex items-center gap-1 hover:underline cursor-pointer"
            title="Tandai semua telah dibaca"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Tandai dibaca</span>
          </button>
        )}
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center border-b border-border-subtle px-3 py-2 bg-surface-subtle/40 gap-1.5 shrink-0 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={cn(
            'px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer text-[11px]',
            activeTab === 'all'
              ? 'bg-white text-text-950 shadow-2xs border border-border-subtle'
              : 'text-text-500 hover:text-text-900'
          )}
        >
          Semua ({unreadTickets.length + reviewPlaces.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tickets')}
          className={cn(
            'px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer text-[11px] flex items-center gap-1',
            activeTab === 'tickets'
              ? 'bg-white text-text-950 shadow-2xs border border-border-subtle'
              : 'text-text-500 hover:text-text-900'
          )}
        >
          <span>Laporan</span>
          {unreadTicketsCount > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('places')}
          className={cn(
            'px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer text-[11px] flex items-center gap-1',
            activeTab === 'places'
              ? 'bg-white text-text-950 shadow-2xs border border-border-subtle'
              : 'text-text-500 hover:text-text-900'
          )}
        >
          <span>Usulan Kafe</span>
          {newPlacesCount > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          )}
        </button>
      </div>

      {/* 3. Notification List */}
      <div className="flex-1 overflow-y-auto divide-y divide-border-subtle/60 p-1">
        {/* Empty State */}
        {unreadTickets.length === 0 && reviewPlaces.length === 0 && (
          <div className="py-12 px-4 text-center space-y-2.5">
            <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-text-900">Semua Laporan Telah Ditangani!</p>
            <p className="text-[11px] text-text-500 max-w-xs mx-auto">
              Tidak ada tiket colokan/wifi yang pending maupun kafe baru yang perlu diverifikasi saat ini.
            </p>
          </div>
        )}

        {/* Tickets Section */}
        {(activeTab === 'all' || activeTab === 'tickets') &&
          unreadTickets.slice(0, 4).map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              onClick={() => handleTicketClick(ticket.id)}
              className={cn(
                'w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 group',
                ticket.isUnread
                  ? 'bg-primary-50/40 hover:bg-primary-50/80'
                  : 'hover:bg-surface-subtle'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs',
                  ticket.priority === 'high'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-amber-100 text-amber-700'
                )}
              >
                {ticket.category.toLowerCase().includes('wifi') ? (
                  <Wifi className="w-4 h-4" />
                ) : ticket.category.toLowerCase().includes('colokan') ? (
                  <Zap className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-text-950 truncate group-hover:text-primary-950">
                    {ticket.cafeName}
                  </span>
                  <span className="text-[10px] text-text-400 shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {ticket.timeAgo}
                  </span>
                </div>

                <p className="text-[11px] text-text-600 line-clamp-1 mt-0.5">
                  <span className="font-semibold text-rose-600">{ticket.category}</span> —{' '}
                  {ticket.description}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-text-400">Oleh: {ticket.reportedBy}</span>
                  {ticket.isUnread && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-800" />
                  )}
                </div>
              </div>
            </button>
          ))}

        {/* Places Section */}
        {(activeTab === 'all' || activeTab === 'places') &&
          reviewPlaces.slice(0, 3).map((place) => (
            <button
              key={place.id}
              type="button"
              onClick={() => handlePlaceClick(place.id)}
              className={cn(
                'w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 group',
                place.isUnread
                  ? 'bg-amber-50/40 hover:bg-amber-50/80'
                  : 'hover:bg-surface-subtle'
              )}
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Coffee className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-text-950 truncate group-hover:text-amber-950">
                    {place.name}
                  </span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full shrink-0">
                    Verifikasi
                  </span>
                </div>

                <p className="text-[11px] text-text-500 line-clamp-1 mt-0.5">
                  {place.address}
                </p>

                <div className="flex items-center gap-2 mt-1 text-[10px] text-text-400">
                  <span>Harga: {place.price}</span>
                  <span>•</span>
                  <span>Wi-Fi: {place.wifi}%</span>
                  {place.isUnread && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  )}
                </div>
              </div>
            </button>
          ))}
      </div>

      {/* 4. Footer */}
      <div className="p-2.5 border-t border-border-subtle bg-surface-subtle/50 shrink-0 text-center">
        <Link
          href="/admin/reports"
          onClick={onClose}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-primary-900 hover:text-primary-950 hover:underline py-1"
        >
          <span>Buka Pusat Tiket & Laporan Spasial</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
