'use client';

import { useMemo, useSyncExternalStore } from 'react';
import {
  ADMIN_STORAGE_KEY,
  MOCK_ADMIN_TICKETS,
  MOCK_PLACES_TABLE,
  MOCK_ANALYTICS,
  MOCK_KPI,
} from './admin-mock-data';
import {
  adminAnalyticsApi,
  adminPlacesApi,
  adminTicketsApi,
  shouldUseLaravelAdminApi,
} from './api-admin';

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
export type AdminKpiState = typeof MOCK_KPI;

interface AdminState {
  tickets: AdminTicketItem[];
  places: PlaceItem[];
  analytics?: AdminAnalyticsState;
  kpi?: AdminKpiState;
  dataSource?: 'laravel' | 'local';
}

const STORAGE_KEY = ADMIN_STORAGE_KEY;

const INITIAL_TICKETS: AdminTicketItem[] = MOCK_ADMIN_TICKETS.map((t, index) => ({
  ...t,
  status: 'open' as const,
  isUnread: index === 0,
}));

const INITIAL_PLACES: PlaceItem[] = MOCK_PLACES_TABLE.map((p) => ({
  ...p,
  isUnread: p.status === 'review',
}));

const DEFAULT_STATE: AdminState = {
  tickets: INITIAL_TICKETS,
  places: INITIAL_PLACES,
  analytics: MOCK_ANALYTICS,
  kpi: MOCK_KPI,
  dataSource: 'local',
};

let memoryState: AdminState = DEFAULT_STATE;
let isInitialized = false;
let hasAttemptedHydration = false;
let inFlightHydration: Promise<'laravel' | 'local'> | null = null;
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
          kpi: parsed.kpi || MOCK_KPI,
          dataSource: parsed.dataSource || 'local',
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

function updateStoredState(updater: (current: AdminState) => AdminState) {
  const latest = getStoredState();
  saveAndNotify(updater(latest));
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
          kpi: parsed.kpi || MOCK_KPI,
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

export async function hydrateAdminStoreFromApi(
  timeRange: string = '30d',
  force: boolean = false,
): Promise<'laravel' | 'local'> {
  if (!shouldUseLaravelAdminApi()) return 'local';
  if (inFlightHydration) return inFlightHydration;
  if (hasAttemptedHydration && !force) {
    return getStoredState().dataSource || 'local';
  }

  hasAttemptedHydration = true;
  inFlightHydration = (async () => {
    const [placesResult, ticketsResult, overviewResult] = await Promise.allSettled([
      adminPlacesApi.getAllStrict(),
      adminTicketsApi.getAllStrict(),
      adminAnalyticsApi.getOverviewStrict(timeRange),
    ]);

    const anySucceeded =
      placesResult.status === 'fulfilled' ||
      ticketsResult.status === 'fulfilled' ||
      overviewResult.status === 'fulfilled';

    if (!anySucceeded) {
      return getStoredState().dataSource || 'local';
    }

    updateStoredState((current) => {
      const readTicketIds = new Set(
        current.tickets.filter((t) => !t.isUnread).map((t) => t.id),
      );
      const reviewedPlaceIds = new Set(
        current.places.filter((p) => p.isUnread === false).map((p) => p.id),
      );

      const nextPlaces =
        placesResult.status === 'fulfilled'
          ? placesResult.value.map((p) => ({
              ...p,
              isUnread: reviewedPlaceIds.has(p.id) ? false : p.isUnread,
            }))
          : current.places;

      const nextTickets =
        ticketsResult.status === 'fulfilled'
          ? ticketsResult.value.map((t) => ({
              ...t,
              isUnread: readTicketIds.has(t.id) ? false : t.isUnread,
            }))
          : current.tickets;

      const nextOverview =
        overviewResult.status === 'fulfilled' ? overviewResult.value.data : null;

      return {
        ...current,
        places: nextPlaces,
        tickets: nextTickets,
        kpi: nextOverview?.kpi || current.kpi || MOCK_KPI,
        analytics: nextOverview?.analytics || current.analytics || MOCK_ANALYTICS,
        dataSource: 'laravel',
      };
    });

    return 'laravel' as const;
  })();

  try {
    return await inFlightHydration;
  } finally {
    inFlightHydration = null;
  }
}

export async function refreshAnalyticsFromApi(timeRange: string = '30d'): Promise<void> {
  if (!shouldUseLaravelAdminApi()) return;

  try {
    const res = await adminAnalyticsApi.getOverviewStrict(timeRange);
    updateStoredState((current) => ({
      ...current,
      kpi: res.data.kpi || current.kpi || MOCK_KPI,
      analytics: res.data.analytics || current.analytics || MOCK_ANALYTICS,
      dataSource: 'laravel',
    }));
  } catch {
    // Keep existing cached analytics when Laravel server is offline
  }
}

export function useAdminStore() {
  const state = useSyncExternalStore(
    subscribe,
    getStoredState,
    () => DEFAULT_STATE,
  );

  const unreadTicketsCount = useMemo(
    () => state.tickets.filter((t) => t.status === 'open' && t.isUnread).length,
    [state.tickets],
  );

  const newPlacesCount = useMemo(
    () => state.places.filter((p) => p.status === 'review' && p.isUnread !== false).length,
    [state.places],
  );

  return {
    tickets: state.tickets,
    places: state.places,
    analytics: state.analytics || MOCK_ANALYTICS,
    kpi: state.kpi || MOCK_KPI,
    dataSource: state.dataSource || 'local',
    unreadTicketsCount,
    newPlacesCount,

    // Ticket Actions
    markTicketAsRead: (ticketId: string) => {
      updateStoredState((current) => ({
        ...current,
        tickets: current.tickets.map((t) =>
          t.id === ticketId ? { ...t, isUnread: false } : t,
        ),
      }));
    },

    markAllTicketsAsRead: () => {
      updateStoredState((current) => ({
        ...current,
        tickets: current.tickets.map((t) => ({ ...t, isUnread: false })),
      }));
    },

    resolveTicket: (ticketId: string, internalNote?: string) => {
      updateStoredState((current) => ({
        ...current,
        tickets: current.tickets.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                status: 'resolved' as const,
                isUnread: false,
                internalNote: internalNote || t.internalNote,
              }
            : t,
        ),
      }));
      if (shouldUseLaravelAdminApi()) {
        void adminTicketsApi.resolve(ticketId, internalNote);
      }
    },

    dismissTicket: (ticketId: string) => {
      updateStoredState((current) => ({
        ...current,
        tickets: current.tickets.map((t) =>
          t.id === ticketId ? { ...t, status: 'dismissed' as const, isUnread: false } : t,
        ),
      }));
      if (shouldUseLaravelAdminApi()) {
        void adminTicketsApi.dismiss(ticketId);
      }
    },

    addTicket: (ticket: Partial<AdminTicketItem>) => {
      updateStoredState((current) => {
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
        return { ...current, tickets: [newTicket, ...current.tickets] };
      });
    },

    // Places Actions
    markPlaceAsReviewed: (placeId: number) => {
      updateStoredState((current) => ({
        ...current,
        places: current.places.map((p) =>
          p.id === placeId ? { ...p, isUnread: false } : p,
        ),
      }));
    },

    markAllPlacesAsReviewed: () => {
      updateStoredState((current) => ({
        ...current,
        places: current.places.map((p) => ({ ...p, isUnread: false })),
      }));
    },

    verifyPlace: (placeId: number) => {
      updateStoredState((current) => ({
        ...current,
        places: current.places.map((p) =>
          p.id === placeId ? { ...p, status: 'verified' as const, isUnread: false } : p,
        ),
      }));
      if (shouldUseLaravelAdminApi()) {
        void adminPlacesApi.verify(placeId);
      }
    },

    rejectPlace: (placeId: number) => {
      updateStoredState((current) => ({
        ...current,
        places: current.places.map((p) =>
          p.id === placeId ? { ...p, status: 'rejected' as const, isUnread: false } : p,
        ),
      }));
      if (shouldUseLaravelAdminApi()) {
        void adminPlacesApi.reject(placeId);
      }
    },

    addPlace: (place: Partial<PlaceItem>) => {
      const tempId = place.id || Date.now();
      let createdPayload: PlaceItem | null = null;

      updateStoredState((current) => {
        const newPlace: PlaceItem = {
          id: tempId,
          code: place.code || `KF-00${current.places.length + 1}`,
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
          plugLabel: place.plugLabel,
          priceCategory: place.priceCategory,
          acoustic: place.acoustic,
          district: place.district,
          is24Hours: place.is24Hours,
        };
        createdPayload = newPlace;
        return { ...current, places: [newPlace, ...current.places] };
      });

      if (shouldUseLaravelAdminApi() && createdPayload) {
        void adminPlacesApi.create(createdPayload).then((serverPlace) => {
          if (serverPlace && serverPlace.id && serverPlace.id !== tempId) {
            updateStoredState((current) => ({
              ...current,
              places: current.places.map((p) => (p.id === tempId ? serverPlace : p)),
            }));
          }
        });
      }
    },

    updatePlace: (updated: PlaceItem) => {
      updateStoredState((current) => ({
        ...current,
        places: current.places.map((p) => (p.id === updated.id ? updated : p)),
      }));
      if (shouldUseLaravelAdminApi()) {
        void adminPlacesApi.update(updated.id, updated).then((serverPlace) => {
          if (serverPlace && serverPlace.id === updated.id) {
            updateStoredState((current) => ({
              ...current,
              places: current.places.map((p) =>
                p.id === updated.id ? { ...updated, ...serverPlace } : p,
              ),
            }));
          }
        });
      }
    },

    deletePlace: (placeId: number) => {
      updateStoredState((current) => ({
        ...current,
        places: current.places.filter((p) => p.id !== placeId),
      }));
      if (shouldUseLaravelAdminApi()) {
        void adminPlacesApi.delete(placeId);
      }
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
    idx === targetIndex ? { ...zone, queries: zone.queries + 1 } : zone,
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
      (c) => c.name.toLowerCase() === placeName.toLowerCase(),
    );
    if (existingIdx >= 0) {
      nextTopCafes[existingIdx] = {
        ...nextTopCafes[existingIdx],
        clicks: nextTopCafes[existingIdx].clicks + 1,
      };
    } else if (address) {
      // Optional future expansion
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
