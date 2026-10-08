'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckCheck,
  Clock,
  ArrowRight,
  AlertTriangle,
  Zap,
  Wifi,
  Coffee,
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
        'absolute right-0 top-full mt-2.5 z-50 w-[356px] sm:w-[392px] bg-white rounded-2xl border border-[#E2E5DF] shadow-tinted-teal overflow-hidden flex flex-col max-h-[500px] animate-in fade-in zoom-in-95 duration-150 select-none',
        className
      )}
    >
      {/* 1. Header */}
        <div className="px-4 py-3 border-b border-[#E2E5DF] bg-[#F5F6F3]/80 flex items-center justify-between shrink-0">
          <div>
            <h4 className="text-xs font-bold text-text-950 flex items-center gap-2">
              <span>Notifikasi Operasional</span>
              {totalUnread > 0 && (
                <span className="text-[10px] font-mono tabular-nums font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded-md">
                  {totalUnread} baru
                </span>
              )}
            </h4>
            <p className="text-[11px] text-text-500 mt-0.5">Laporan fasilitas &amp; usulan kafe</p>
          </div>

          {totalUnread > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-[11px] font-semibold text-[#005B54] hover:text-[#003833] flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#005B54]/[0.06] transition-colors cursor-pointer tactile-press"
              title="Tandai semua telah dibaca"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tandai dibaca</span>
            </button>
          )}
        </div>

        {/* 2. Filter Tabs */}
        <div className="flex items-center border-b border-[#E2E5DF] px-3 py-1.5 bg-white gap-1 shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={cn(
              'px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer text-[11px] tabular-nums tactile-press',
              activeTab === 'all'
                ? 'bg-[#005B54]/[0.08] text-[#005B54] border border-[#005B54]/20'
                : 'text-text-500 hover:text-text-900 hover:bg-[#F5F6F3] border border-transparent'
            )}
          >
            Semua ({unreadTickets.length + reviewPlaces.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tickets')}
            className={cn(
              'px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer text-[11px] flex items-center gap-1.5 tactile-press',
              activeTab === 'tickets'
                ? 'bg-[#005B54]/[0.08] text-[#005B54] border border-[#005B54]/20'
                : 'text-text-500 hover:text-text-900 hover:bg-[#F5F6F3] border border-transparent'
            )}
          >
            <span>Tiket</span>
            {unreadTicketsCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('places')}
            className={cn(
              'px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer text-[11px] flex items-center gap-1.5 tactile-press',
              activeTab === 'places'
                ? 'bg-[#005B54]/[0.08] text-[#005B54] border border-[#005B54]/20'
                : 'text-text-500 hover:text-text-900 hover:bg-[#F5F6F3] border border-transparent'
            )}
          >
            <span>Usulan Kafe</span>
            {newPlacesCount > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            )}
          </button>
        </div>

        {/* 3. Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#E2E5DF]">
          {/* Empty State */}
          {unreadTickets.length === 0 && reviewPlaces.length === 0 && (
            <div className="py-10 px-4 text-center space-y-1.5">
              <CheckCheck className="w-5 h-5 text-emerald-600 mx-auto" />
              <p className="text-xs font-bold text-text-900">Antrean Bersih</p>
              <p className="text-[11px] text-text-500 max-w-xs mx-auto">
                Tidak ada laporan fasilitas atau usulan tempat baru yang menunggu validasi.
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
                  'w-full text-left px-3.5 py-3 transition-colors cursor-pointer flex items-start gap-2.5 group',
                  ticket.isUnread
                    ? 'bg-[#005B54]/[0.03] hover:bg-[#F5F6F3]'
                    : 'hover:bg-[#F5F6F3]'
                )}
              >
                <div className="mt-0.5 w-7 h-7 rounded-lg bg-[#F5F6F3] border border-[#E2E5DF] flex items-center justify-center shrink-0">
                  {ticket.category.toLowerCase().includes('wifi') ? (
                    <Wifi className="w-3.5 h-3.5 text-amber-600" />
                  ) : ticket.category.toLowerCase().includes('colokan') ? (
                    <Zap className="w-3.5 h-3.5 text-rose-600" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-text-950 truncate group-hover:text-[#005B54]">
                      {ticket.cafeName}
                    </span>
                    <span className="text-[10px] font-mono tabular-nums text-text-400 shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ticket.timeAgo}
                    </span>
                  </div>

                  <p className="text-[11px] text-text-600 line-clamp-1 mt-0.5">
                    <span className="font-semibold text-text-900">{ticket.category}:</span>{' '}
                    {ticket.description}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-text-500 font-mono font-medium tabular-nums">
                      {ticket.id}
                    </span>
                    <span className="text-[10px] text-text-400 truncate">· {ticket.location}</span>
                    {ticket.isUnread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#005B54] ml-auto shrink-0" />
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
                  'w-full text-left px-3.5 py-3 transition-colors cursor-pointer flex items-start gap-2.5 group',
                  place.isUnread
                    ? 'bg-amber-50/30 hover:bg-[#F5F6F3]'
                    : 'hover:bg-[#F5F6F3]'
                )}
              >
                <div className="mt-0.5 w-7 h-7 rounded-lg bg-amber-50 border border-amber-200/70 flex items-center justify-center shrink-0">
                  <Coffee className="w-3.5 h-3.5 text-amber-700" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-text-950 truncate group-hover:text-[#005B54]">
                      {place.name}
                    </span>
                    <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded-md shrink-0">
                      Perlu Review
                    </span>
                  </div>

                  <p className="text-[11px] text-text-500 line-clamp-1 mt-0.5">
                    {place.address}
                  </p>

                  <div className="flex items-center gap-2 mt-1 text-[10px] font-mono tabular-nums text-text-500">
                    <span>Harga: {place.price}</span>
                    <span>·</span>
                    <span>Wi-Fi: {place.wifi}%</span>
                    {place.isUnread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 ml-auto" />
                    )}
                  </div>
                </div>
              </button>
            ))}
        </div>

        {/* 4. Footer */}
        <div className="p-2.5 border-t border-[#E2E5DF] bg-[#F5F6F3]/80 shrink-0 text-center">
          <Link
            href="/admin/reports"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#005B54] hover:text-[#003833] py-1 px-3 rounded-lg hover:bg-[#005B54]/[0.06] transition-all group tactile-press"
          >
            <span>Buka Pusat Tiket &amp; Laporan Spasial</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
    </div>
  );
}
