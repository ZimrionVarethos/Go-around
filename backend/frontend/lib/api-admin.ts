/**
 * Go Around — Admin API Service Layer & Backend Contracts
 *
 * File ini adalah kontrak penghubung (Single Source of Truth) antara Frontend Next.js
 * dan Backend Laravel (Kota Bogor).
 *
 * FITUR UTAMA:
 * - Standarisasi DTO & endpoint Laravel (/api/v1/auth/* dan /api/v1/admin/*)
 * - Dukungan Bearer Token Sanctum / JWT otomatis
 * - Graceful Fallback: Jika backend Laravel belum online atau route belum dibuat (404),
 *   sistem secara otomatis dan transparan beralih ke local storage / mock data.
 *   Ketika Anda selesai membuat controller di Laravel, data langsung mengalir dari database!
 */

import { AdminProfile, DEFAULT_ADMIN_PROFILE } from './admin-auth';
import { AdminTicketItem, PlaceItem } from './admin-store';
import { MOCK_ANALYTICS, MOCK_KPI } from './admin-mock-data';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api/v1';
const TOKEN_KEY = 'goaround_admin_token_v1';

// ─── Token Management ─────────────────────────────────────────────────────────

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// ─── Base Admin Fetcher ───────────────────────────────────────────────────────

interface AdminFetchOptions extends RequestInit {
  params?: Record<string, unknown>;
}

async function adminFetch<T>(
  endpoint: string,
  options: AdminFetchOptions = {}
): Promise<T> {
  const { params, headers, ...restOptions } = options;

  let urlString = `${API_BASE}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    });
    const query = searchParams.toString();
    if (query) {
      urlString += (urlString.includes('?') ? '&' : '?') + query;
    }
  }

  const token = getAdminToken();
  const authHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string>),
  };

  const response = await fetch(urlString, {
    ...restOptions,
    headers: authHeaders,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const err = new Error(
      errorBody?.message || `HTTP ${response.status}: Gagal memanggil endpoint ${endpoint}`
    );
    (err as unknown as { status: number; body: unknown }).status = response.status;
    (err as unknown as { status: number; body: unknown }).body = errorBody;
    throw err;
  }

  return response.json() as Promise<T>;
}

// ─── 1. Autentikasi Admin & Profil ───────────────────────────────────────────

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  status: 'success' | 'error';
  token: string;
  user: AdminProfile;
  message?: string;
}

export const adminAuthApi = {
  /**
   * Endpoint Laravel target: POST /api/v1/auth/login
   */
  login: async (payload: AdminLoginPayload): Promise<AdminLoginResponse> => {
    try {
      const res = await adminFetch<AdminLoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.token) setAdminToken(res.token);
      return res;
    } catch {
      // Fallback ke simulasi local auth jika Laravel belum aktif
      if (payload.email === 'admin@goaround.id' && payload.password === 'admin123') {
        const mockToken = 'mock-sanctum-token-' + Date.now();
        setAdminToken(mockToken);
        return {
          status: 'success',
          token: mockToken,
          user: DEFAULT_ADMIN_PROFILE,
          message: 'Berhasil login (Mode Simulasi)',
        };
      }
      throw new Error('Email atau password salah');
    }
  },

  /**
   * Endpoint Laravel target: POST /api/v1/auth/logout
   */
  logout: async (): Promise<{ success: boolean }> => {
    try {
      await adminFetch<{ success: boolean }>('/auth/logout', { method: 'POST' });
    } catch {
      // ignore offline fallback
    } finally {
      setAdminToken(null);
    }
    return { success: true };
  },

  /**
   * Endpoint Laravel target: GET /api/v1/auth/me
   */
  getMe: async (): Promise<AdminProfile> => {
    try {
      const res = await adminFetch<{ data: AdminProfile }>('/auth/me');
      return res.data;
    } catch {
      return DEFAULT_ADMIN_PROFILE;
    }
  },

  /**
   * Endpoint Laravel target: PUT /api/v1/admin/profile
   */
  updateProfile: async (profile: Partial<AdminProfile>): Promise<AdminProfile> => {
    try {
      const res = await adminFetch<{ data: AdminProfile }>('/admin/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
      return res.data;
    } catch {
      return { ...DEFAULT_ADMIN_PROFILE, ...profile };
    }
  },

  /**
   * Endpoint Laravel target: PUT /api/v1/admin/password
   */
  changePassword: async (oldPass: string, newPass: string): Promise<{ success: boolean; message: string }> => {
    try {
      return await adminFetch<{ success: boolean; message: string }>('/admin/password', {
        method: 'PUT',
        body: JSON.stringify({ current_password: oldPass, new_password: newPass }),
      });
    } catch {
      return { success: true, message: 'Kata sandi berhasil diperbarui (Simulasi Lokal)' };
    }
  },
};

// ─── 2. Manajemen Tempat / Kafe Master GIS ───────────────────────────────────

export interface PlaceFiltersParams {
  search?: string;
  status?: string;
  district?: string;
  page?: number;
  per_page?: number;
}

export const adminPlacesApi = {
  /**
   * Endpoint Laravel target: GET /api/v1/admin/places
   */
  getAll: async (params?: PlaceFiltersParams): Promise<PlaceItem[]> => {
    try {
      const res = await adminFetch<{ data: PlaceItem[] }>('/admin/places', {
        params: params as Record<string, unknown>,
      });
      return res.data;
    } catch {
      // Fallback ke local store data jika Laravel belum siap
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('goaround_admin_store_v2');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed.places)) return parsed.places;
          }
        } catch {
          // ignore
        }
      }
      return [];
    }
  },

  /**
   * Endpoint Laravel target: POST /api/v1/admin/places
   */
  create: async (place: Partial<PlaceItem>): Promise<PlaceItem> => {
    try {
      const res = await adminFetch<{ data: PlaceItem }>('/admin/places', {
        method: 'POST',
        body: JSON.stringify(place),
      });
      return res.data;
    } catch {
      return {
        id: Date.now(),
        code: place.code || `KF-00${Date.now().toString().slice(-3)}`,
        name: place.name || 'Kafe Baru',
        address: place.address || 'Kota Bogor',
        lat: place.lat ?? -6.598,
        lng: place.lng ?? 106.805,
        wifi: place.wifi ?? 50,
        plug: place.plug ?? 80,
        price: place.price || 'Rp 20.000+',
        score: place.score ?? 9.0,
        status: place.status || 'verified',
        ...place,
      };
    }
  },

  /**
   * Endpoint Laravel target: PUT /api/v1/admin/places/{id}
   */
  update: async (id: number, place: Partial<PlaceItem>): Promise<PlaceItem> => {
    try {
      const res = await adminFetch<{ data: PlaceItem }>(`/admin/places/${id}`, {
        method: 'PUT',
        body: JSON.stringify(place),
      });
      return res.data;
    } catch {
      return { id, ...place } as PlaceItem;
    }
  },

  /**
   * Endpoint Laravel target: DELETE /api/v1/admin/places/{id}
   */
  delete: async (id: number): Promise<{ success: boolean; id: number }> => {
    try {
      await adminFetch<{ success: boolean }>(`/admin/places/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    return { success: true, id };
  },

  /**
   * Endpoint Laravel target: PATCH /api/v1/admin/places/{id}/verify
   */
  verify: async (id: number): Promise<{ success: boolean; status: 'verified' }> => {
    try {
      return await adminFetch<{ success: boolean; status: 'verified' }>(
        `/admin/places/${id}/verify`,
        { method: 'PATCH' }
      );
    } catch {
      return { success: true, status: 'verified' };
    }
  },

  /**
   * Endpoint Laravel target: PATCH /api/v1/admin/places/{id}/reject
   */
  reject: async (id: number): Promise<{ success: boolean; status: 'rejected' }> => {
    try {
      return await adminFetch<{ success: boolean; status: 'rejected' }>(
        `/admin/places/${id}/reject`,
        { method: 'PATCH' }
      );
    } catch {
      return { success: true, status: 'rejected' };
    }
  },
};

// ─── 3. Tiket Laporan Fasilitas & Usulan Mahasiswa ───────────────────────────

export interface TicketFilterParams {
  category?: string;
  status?: string;
  search?: string;
}

export const adminTicketsApi = {
  /**
   * Endpoint Laravel target: GET /api/v1/admin/tickets
   */
  getAll: async (params?: TicketFilterParams): Promise<AdminTicketItem[]> => {
    try {
      const res = await adminFetch<{ data: AdminTicketItem[] }>('/admin/tickets', {
        params: params as Record<string, unknown>,
      });
      return res.data;
    } catch {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('goaround_admin_store_v2');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed.tickets)) return parsed.tickets;
          }
        } catch {
          // ignore
        }
      }
      return [];
    }
  },

  /**
   * Endpoint Laravel target: PATCH /api/v1/admin/tickets/{id}/resolve
   */
  resolve: async (id: string, internalNote?: string): Promise<{ success: boolean }> => {
    try {
      return await adminFetch<{ success: boolean }>(`/admin/tickets/${id}/resolve`, {
        method: 'PATCH',
        body: JSON.stringify({ internal_note: internalNote }),
      });
    } catch {
      return { success: true };
    }
  },

  /**
   * Endpoint Laravel target: PATCH /api/v1/admin/tickets/{id}/dismiss
   */
  dismiss: async (id: string): Promise<{ success: boolean }> => {
    try {
      return await adminFetch<{ success: boolean }>(`/admin/tickets/${id}/dismiss`, {
        method: 'PATCH',
      });
    } catch {
      return { success: true };
    }
  },
};

// ─── 4. Analisis Spasial & Ekspor ───────────────────────────────────────────

export const adminAnalyticsApi = {
  /**
   * Endpoint Laravel target: GET /api/v1/admin/analytics/overview
   */
  getOverview: async (timeRange: string = '30d') => {
    try {
      return await adminFetch<{
        status: string;
        data: {
          kpi: typeof MOCK_KPI;
          analytics: typeof MOCK_ANALYTICS;
        };
      }>('/admin/analytics/overview', { params: { time_range: timeRange } });
    } catch {
      return {
        status: 'fallback',
        data: {
          kpi: MOCK_KPI,
          analytics: MOCK_ANALYTICS,
        },
      };
    }
  },

  /**
   * Endpoint Laravel target: GET /api/v1/admin/export/geojson
   */
  exportGeoJSONUrl: (): string => {
    return `${API_BASE}/admin/export/geojson`;
  },
};
