'use client';

import { useMemo, useSyncExternalStore } from 'react';
import {
  ADMIN_STORAGE_KEY,
  MOCK_ADMIN_TICKETS,
  MOCK_PLACES_TABLE,
  MOCK_ANALYTICS,
} from './admin-mock-data';

export interface AdminTicketItem {
  id: string;
  priority: 'high' | 'medium' | 'suggestion' | 'low';
  category: string;
  cafeName: string;
  location: string;
  timeAgo: string;
  reportedBy: string;
  description: string;
  status: 'open' | 'resolved' | 'dismissed';
  isUnread?: boolean;
  internalNote?: string;
}

export interface PlaceItem {
  id: number;
  code: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  wifi: number;
  plug: number;
  price: string;
  score: number;
  status: 'verified' | 'review' | 'rejected';
  isUnread?: boolean;
  imageUrl?: string | null;
  plugLabel?: string;
  priceCategory?: string;
  acoustic?: string;
  district?: string;
  is24Hours?: boolean;
}

export type AdminAnalyticsState = typeof MOCK_ANALYTICS;

interface AdminState {
  tickets: AdminTicketItem[];
  places: PlaceItem[];
  analytics?: AdminAnalyticsState;
}

const STORAGE_KEY = ADMIN_STORAGE_KEY;

// Default initial state:
// 1 ticket unread (TK-802) so there is an active issue to demonstrate "1 baru"
// 1 cafe review unread (KF-003) so there is an active pending cafe to demonstrate "1 baru"
const INITIAL_TICKETS: AdminTicketItem[] = MOCK_ADMIN_TICKETS.map((t, index) => ({
  ...t,
  status: 'open' as const,
  isUnread: index === 0, // Only the first recent ticket is unread
}));

const INITIAL_PLACES: PlaceItem[] = MOCK_PLACES_TABLE.map((p) => ({
  ...p,
  isUnread: p.status === 'review', // If in review status, it is unread/pending
}));

const DEFAULT_STATE: AdminState = {
  tickets: INITIAL_TICKETS,
  places: INITIAL_PLACES,
  analytics: MOCK_ANALYTICS,
};

let memoryState: AdminState = DEFAULT_STATE;
let isInitialized = false;
const listeners = new Set<() => void>();

function getStoredState(): AdminState {
  if (typeof window === 'undefined') return DEFAULT_STATE;

  if (!isInitialized) {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        const parsed = JSON.parse(item) as AdminState;
        memoryState = {
          ...DEFAULT_STATE,
          ...parsed,
          analytics: parsed.analytics || MOCK_ANALYTICS,
        };
      } else {
        memoryState = DEFAULT_STATE;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
      }
    } catch {
      memoryState = DEFAULT_STATE;
    }
    isInitialized = true;
  }
  return memoryState;
}

function saveAndNotify(nextState: AdminState) {
  memoryState = nextState;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue) as AdminState;
        memoryState = {
          ...DEFAULT_STATE,
          ...parsed,
          analytics: parsed.analytics || MOCK_ANALYTICS,
        };
        callback();
      } catch {
        // ignore
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageEvent);
  }

  return () => {
    listeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorageEvent);
    }
  };
}

export function useAdminStore() {
  const state = useSyncExternalStore(
    subscribe,
    getStoredState,
    () => DEFAULT_STATE
  );

  const unreadTicketsCount = useMemo(
    () => state.tickets.filter((t) => t.status === 'open' && t.isUnread).length,
    [state.tickets]
  );

  const newPlacesCount = useMemo(
    () => state.places.filter((p) => p.status === 'review' && p.isUnread !== false).length,
    [state.places]
  );

  return {
    tickets: state.tickets,
    places: state.places,
    analytics: state.analytics || MOCK_ANALYTICS,
    unreadTicketsCount,
    newPlacesCount,

    // Ticket Actions
    markTicketAsRead: (ticketId: string) => {
      const nextTickets = state.tickets.map((t) =>
        t.id === ticketId ? { ...t, isUnread: false } : t
      );
      saveAndNotify({ ...state, tickets: nextTickets });
    },

    markAllTicketsAsRead: () => {
      const nextTickets = state.tickets.map((t) => ({ ...t, isUnread: false }));
      saveAndNotify({ ...state, tickets: nextTickets });
    },

    resolveTicket: (ticketId: string, internalNote?: string) => {
      const nextTickets = state.tickets.map((t) =>
        t.id === ticketId
          ? { ...t, status: 'resolved' as const, isUnread: false, internalNote: internalNote || t.internalNote }
          : t
      );
      saveAndNotify({ ...state, tickets: nextTickets });
    },

    dismissTicket: (ticketId: string) => {
      const nextTickets = state.tickets.map((t) =>
        t.id === ticketId ? { ...t, status: 'dismissed' as const, isUnread: false } : t
      );
      saveAndNotify({ ...state, tickets: nextTickets });
    },

    addTicket: (ticket: Partial<AdminTicketItem>) => {
      const newTicket: AdminTicketItem = {
        id: ticket.id || `TK-${Math.floor(800 + Math.random() * 100)}`,
        priority: ticket.priority || 'high',
        category: ticket.category || 'Colokan Rusak',
        cafeName: ticket.cafeName || 'Spot Kafe Baru',
        location: ticket.location || 'Kota Bogor',
        timeAgo: 'Baru saja',
        reportedBy: ticket.reportedBy || 'Anonim',
        description: ticket.description || 'Laporan fasilitas baru masuk.',
        status: 'open',
        isUnread: true,
        internalNote: ticket.internalNote,
      };
      saveAndNotify({ ...state, tickets: [newTicket, ...state.tickets] });
    },

    // Places Actions
    markPlaceAsReviewed: (placeId: number) => {
      const nextPlaces = state.places.map((p) =>
        p.id === placeId ? { ...p, isUnread: false } : p
      );
      saveAndNotify({ ...state, places: nextPlaces });
    },

    markAllPlacesAsReviewed: () => {
      const nextPlaces = state.places.map((p) => ({ ...p, isUnread: false }));
      saveAndNotify({ ...state, places: nextPlaces });
    },

    verifyPlace: (placeId: number) => {
      const nextPlaces = state.places.map((p) =>
        p.id === placeId ? { ...p, status: 'verified' as const, isUnread: false } : p
      );
      saveAndNotify({ ...state, places: nextPlaces });
    },

    rejectPlace: (placeId: number) => {
      const nextPlaces = state.places.map((p) =>
        p.id === placeId ? { ...p, status: 'rejected' as const, isUnread: false } : p
      );
      saveAndNotify({ ...state, places: nextPlaces });
    },

    addPlace: (place: Partial<PlaceItem>) => {
      const newPlace: PlaceItem = {
        id: place.id || Date.now(),
        code: place.code || `KF-00${state.places.length + 1}`,
        name: place.name || 'Kafe Baru Usulan',
        address: place.address || 'Jl. Pajajaran, Kota Bogor',
        lat: place.lat ?? -6.598,
        lng: place.lng ?? 106.805,
        wifi: place.wifi ?? 50,
        plug: place.plug ?? 80,
        price: place.price || 'Rp 20.000+',
        score: place.score ?? 9.0,
        status: place.status || 'review',
        isUnread: true,
        imageUrl: place.imageUrl ?? null,
      };
      saveAndNotify({ ...state, places: [newPlace, ...state.places] });
    },

    updatePlace: (updated: PlaceItem) => {
      const nextPlaces = state.places.map((p) =>
        p.id === updated.id ? updated : p
      );
      saveAndNotify({ ...state, places: nextPlaces });
    },

    deletePlace: (placeId: number) => {
      const nextPlaces = state.places.filter((p) => p.id !== placeId);
      saveAndNotify({ ...state, places: nextPlaces });
    },

    resetToDefault: () => {
      saveAndNotify(DEFAULT_STATE);
    },
  };
}

// Standalone functions for external pages (like /lapor-fasilitas, /tambah-tempat, and Public WebGIS /)
export function dispatchNewPublicTicket(ticket: Partial<AdminTicketItem>) {
  if (typeof window === 'undefined') return;
  const current = getStoredState();
  const newTicket: AdminTicketItem = {
    id: ticket.id || `TK-${Math.floor(800 + Math.random() * 100)}`,
    priority: ticket.priority || 'high',
    category: ticket.category || 'Colokan Rusak',
    cafeName: ticket.cafeName || 'Spot Kafe Baru',
    location: ticket.location || 'Kota Bogor',
    timeAgo: 'Baru saja',
    reportedBy: ticket.reportedBy || 'Anonim',
    description: ticket.description || 'Laporan fasilitas dari pengguna.',
    status: 'open',
    isUnread: true,
    internalNote: ticket.internalNote,
  };
  saveAndNotify({ ...current, tickets: [newTicket, ...current.tickets] });
}

export function dispatchNewPublicPlace(place: Partial<PlaceItem>) {
  if (typeof window === 'undefined') return;
  const current = getStoredState();
  const newPlace: PlaceItem = {
    id: place.id || Date.now(),
    code: place.code || `KF-00${current.places.length + 1}`,
    name: place.name || 'Kafe Baru Usulan Mahasiswa',
    address: place.address || 'Kota Bogor',
    lat: place.lat ?? -6.598,
    lng: place.lng ?? 106.805,
    wifi: place.wifi ?? 50,
    plug: place.plug ?? 80,
    price: place.price || 'Rp 20.000+',
    score: place.score ?? 8.8,
    status: 'review',
    isUnread: true,
    imageUrl: place.imageUrl ?? null,
  };
  saveAndNotify({ ...current, places: [newPlace, ...current.places] });
}

/**
 * Tracks a spatial query event from Public WebGIS (/) — Search or Filter submission.
 * When backend endpoint `POST /api/v1/analytics/track` is ready, call it here.
 */
export function trackPublicSpatialQuery(queryHint?: string) {
  if (typeof window === 'undefined') return;
  const current = getStoredState();
  const currentAnalytics = current.analytics || MOCK_ANALYTICS;

  const nextTotalQueries = currentAnalytics.kpi.totalQueries + 1;
  const nextConversionRate = `${(
    (currentAnalytics.kpi.routeConversions / nextTotalQueries) *
    100
  ).toFixed(1)}%`;

  const hintLower = (queryHint || '').toLowerCase();
  const matchedZoneIndex = currentAnalytics.spatialDensity.findIndex((z) => {
    const areaLower = z.area.toLowerCase();
    if (hintLower.includes('timur') || hintLower.includes('baranangsiang')) {
      return areaLower.includes('bogor timur');
    }
    if (hintLower.includes('utara') || hintLower.includes('tegal gundil') || hintLower.includes('pandu')) {
      return areaLower.includes('bogor utara');
    }
    if (hintLower.includes('barat') || hintLower.includes('yasmin') || hintLower.includes('sareal')) {
      return areaLower.includes('bogor barat');
    }
    return false;
  });

  const targetIndex = matchedZoneIndex >= 0 ? matchedZoneIndex : 0;
  const nextSpatialDensity = currentAnalytics.spatialDensity.map((zone, idx) =>
    idx === targetIndex ? { ...zone, queries: zone.queries + 1 } : zone
  );

  saveAndNotify({
    ...current,
    analytics: {
      ...currentAnalytics,
      kpi: {
        ...currentAnalytics.kpi,
        totalQueries: nextTotalQueries,
        conversionRate: nextConversionRate,
      },
      spatialDensity: nextSpatialDensity,
    },
  });
}

/**
 * Tracks a route navigation click event ("Petunjuk Arah (Maps)") from Public WebGIS (/).
 * When backend endpoint `POST /api/v1/analytics/track` is ready, call it here.
 */
export function trackPublicRouteClick(placeName?: string, address?: string) {
  if (typeof window === 'undefined') return;
  const current = getStoredState();
  const currentAnalytics = current.analytics || MOCK_ANALYTICS;

  const nextRouteConversions = currentAnalytics.kpi.routeConversions + 1;
  const nextConversionRate = `${(
    (nextRouteConversions / currentAnalytics.kpi.totalQueries) *
    100
  ).toFixed(1)}%`;

  let nextTopCafes = [...currentAnalytics.topCafes];
  if (placeName) {
    const existingIdx = nextTopCafes.findIndex(
      (c) => c.name.toLowerCase() === placeName.toLowerCase()
    );
    if (existingIdx >= 0) {
      nextTopCafes[existingIdx] = {
        ...nextTopCafes[existingIdx],
        clicks: nextTopCafes[existingIdx].clicks + 1,
      };
    } else if (address) {
      // Optional: keep top 5 sorted if aexisting cafe is clicked
    }
    nextTopCafes = nextTopCafes
      .sort((a, b) => b.clicks - a.clicks)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
  }

  saveAndNotify({
    ...current,
    analytics: {
      ...currentAnalytics,
      kpi: {
        ...currentAnalytics.kpi,
        routeConversions: nextRouteConversions,
        conversionRate: nextConversionRate,
      },
      topCafes: nextTopCafes,
    },
  });
}
