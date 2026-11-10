/**
 * Go Around — Admin API Service Layer & Backend Contracts
 *
 * File ini adalah kontrak penghubung (Single Source of Truth) antara Frontend Next.js
 * dan Backend Laravel (Kota Bogor).
 *
 * FITUR UTAMA:
 * - Standarisasi DTO & endpoint Laravel (/api/v1/auth/* dan /api/v1/admin/*)
 * - Dukungan Bearer Token otomatis
 * - Graceful Fallback: Aktif memanggil Laravel saat NEXT_PUBLIC_API_URL dikonfigurasi
 *   atau saat dijalankan di localhost/127.0.0.1. Jika backend Laravel belum menyala,
 *   sistem beralih ke local storage / mock data tanpa error di browser.
 */

import type { AdminProfile } from './admin-auth';
import type { AdminTicketItem, PlaceItem } from './admin-store';
import { ADMIN_STORAGE_KEY, MOCK_ANALYTICS, MOCK_KPI } from './admin-mock-data';

const EXPLICIT_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || '';
const API_BASE = EXPLICIT_API_URL || 'http://127.0.0.1:8000/api/v1';
const TOKEN_KEY = 'goaround_admin_token_v1';

export const DEFAULT_ADMIN_PROFILE_DATA: AdminProfile = {
  name: 'Admin',
  email: 'admin@goaround.id',
  role: 'Super Admin SIG Kota Bogor',
  agency: 'Bappeda & Tim SIG IPB University',
  avatarInitials: 'AD',
  bio: 'Pengelola master data spasial dan verifikator fasilitas kafe ramah mahasiswa seputar Kota Bogor.',
  phone: '+62 812-3456-7890',
  isAuthenticated: true,
  lastLogin: 'Hari ini, 08:30 WIB',
};

export function getAdminApiBase(): string {
  return API_BASE;
}

export function shouldUseLaravelAdminApi(): boolean {
  if (EXPLICIT_API_URL) return true;
  if (typeof window === 'undefined') return false;
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );
}

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

export function calculateAdminInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (name.slice(0, 2) || 'AD').toUpperCase();
}

export function normalizeLaravelAdminProfile(
  raw: Record<string, unknown> | null | undefined,
  current?: AdminProfile,
): AdminProfile {
  const base = current ?? DEFAULT_ADMIN_PROFILE_DATA;
  const name = typeof raw?.name === 'string' && raw.name.trim() ? raw.name.trim() : base.name;
  const email = typeof raw?.email === 'string' && raw.email.trim() ? raw.email.trim() : base.email;
  const role = typeof raw?.role === 'string' && raw.role.trim() ? raw.role.trim() : base.role;
  const agency =
    typeof raw?.agency === 'string' && raw.agency.trim()
      ? raw.agency.trim()
      : typeof raw?.institution === 'string' && raw.institution.trim()
      ? raw.institution.trim()
      : base.agency;
  const phone = typeof raw?.phone === 'string' && raw.phone.trim() ? raw.phone.trim() : base.phone;
  const bio = typeof raw?.bio === 'string' && raw.bio.trim() ? raw.bio.trim() : base.bio;

  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

  return {
    name,
    email,
    role,
    agency,
    avatarInitials:
      typeof raw?.avatarInitials === 'string' && raw.avatarInitials.trim()
        ? raw.avatarInitials.trim().toUpperCase()
        : calculateAdminInitials(name),
    bio,
    phone,
    isAuthenticated: true,
    lastLogin:
      typeof raw?.lastLogin === 'string' && raw.lastLogin.trim()
        ? raw.lastLogin.trim()
        : base.lastLogin || `Hari ini, ${timeString}`,
  };
}

// ─── Base Admin Fetcher ───────────────────────────────────────────────────────

interface AdminFetchOptions extends RequestInit {
  params?: Record<string, unknown>;
}

class AdminHttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
    message: string,
  ) {
    super(message);
    this.name = 'AdminHttpError';
  }
}

async function adminFetch<T>(
  endpoint: string,
  options: AdminFetchOptions = {},
): Promise<T> {
  if (!shouldUseLaravelAdminApi()) {
    throw new Error('Laravel Admin API belum dikonfigurasi untuk environment ini.');
  }

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
    throw new AdminHttpError(
      response.status,
      errorBody,
      (errorBody as { message?: string } | null)?.message ||
        `HTTP ${response.status}: Gagal memanggil endpoint ${endpoint}`,
    );
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
      const res = await adminFetch<{
        status: 'success' | 'error';
        token: string;
        user: Record<string, unknown>;
        message?: string;
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.token) setAdminToken(res.token);
      return {
        status: res.status,
        token: res.token,
        user: normalizeLaravelAdminProfile(res.user),
        message: res.message,
      };
    } catch (err) {
      if (err instanceof AdminHttpError) {
        throw err;
      }
      // Fallback ke simulasi local auth hanya jika server Laravel offline/tidak aktif
      if (payload.email === 'admin@goaround.id' && payload.password === 'admin123') {
        const mockToken = 'mock-sanctum-token-' + Date.now();
        setAdminToken(mockToken);
        return {
          status: 'success',
          token: mockToken,
          user: DEFAULT_ADMIN_PROFILE_DATA,
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
   * Endpoint Laravel target: GET /api/v1/auth/me (throws if offline)
   */
  getMeStrict: async (): Promise<AdminProfile> => {
    const res = await adminFetch<{ data: Record<string, unknown> }>('/auth/me');
    return normalizeLaravelAdminProfile(res.data);
  },

  /**
   * Endpoint Laravel target: GET /api/v1/auth/me
   */
  getMe: async (): Promise<AdminProfile> => {
    try {
      return await adminAuthApi.getMeStrict();
    } catch {
      return DEFAULT_ADMIN_PROFILE_DATA;
    }
  },

  /**
   * Endpoint Laravel target: PUT /api/v1/admin/profile
   */
  updateProfile: async (profile: Partial<AdminProfile>): Promise<AdminProfile> => {
    try {
      const res = await adminFetch<{ data: Record<string, unknown> }>('/admin/profile', {
        method: 'PUT',
        body: JSON.stringify({
          ...profile,
          institution: profile.agency,
        }),
      });
      return normalizeLaravelAdminProfile(res.data, {
        ...DEFAULT_ADMIN_PROFILE_DATA,
        ...profile,
      });
    } catch {
      return { ...DEFAULT_ADMIN_PROFILE_DATA, ...profile };
    }
  },

  /**
   * Endpoint Laravel target: PUT /api/v1/admin/password
   */
  changePassword: async (
    oldPass: string,
    newPass: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      return await adminFetch<{ success: boolean; message: string }>('/admin/password', {
        method: 'PUT',
        body: JSON.stringify({ current_password: oldPass, new_password: newPass }),
      });
    } catch (err) {
      if (err instanceof AdminHttpError) {
        throw err;
      }
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
   * Endpoint Laravel target: GET /api/v1/admin/places (throws if offline)
   */
  getAllStrict: async (params?: PlaceFiltersParams): Promise<PlaceItem[]> => {
    const res = await adminFetch<{ data: PlaceItem[] }>('/admin/places', {
      params: params as Record<string, unknown>,
    });
    return Array.isArray(res.data) ? res.data : [];
  },

  /**
   * Endpoint Laravel target: GET /api/v1/admin/places
   */
  getAll: async (params?: PlaceFiltersParams): Promise<PlaceItem[]> => {
    try {
      return await adminPlacesApi.getAllStrict(params);
    } catch {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored) as { places?: PlaceItem[] };
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
      // ignore offline fallback
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
        { method: 'PATCH' },
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
        { method: 'PATCH' },
      );
    } catch {
      return { success: true, status: 'rejected' };
    }
  },

  /**
   * Endpoint Laravel target: POST /api/v1/admin/places/{id}/photo (multipart/form-data)
   */
  uploadPhoto: async (
    id: number,
    file: File,
  ): Promise<{ status: 'success'; imageUrl: string }> => {
    if (!shouldUseLaravelAdminApi()) {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
        reader.readAsDataURL(file);
      });
      return { status: 'success', imageUrl: dataUrl };
    }

    const formData = new FormData();
    formData.append('image', file);
    const token = getAdminToken();
    try {
      const res = await fetch(`${API_BASE}/admin/places/${id}/photo`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as { status: 'success'; imageUrl: string };
    } catch {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
        reader.readAsDataURL(file);
      });
      return { status: 'success', imageUrl: dataUrl };
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
   * Endpoint Laravel target: GET /api/v1/admin/tickets (throws if offline)
   */
  getAllStrict: async (params?: TicketFilterParams): Promise<AdminTicketItem[]> => {
    const res = await adminFetch<{ data: AdminTicketItem[] }>('/admin/tickets', {
      params: params as Record<string, unknown>,
    });
    return Array.isArray(res.data) ? res.data : [];
  },

  /**
   * Endpoint Laravel target: GET /api/v1/admin/tickets
   */
  getAll: async (params?: TicketFilterParams): Promise<AdminTicketItem[]> => {
    try {
      return await adminTicketsApi.getAllStrict(params);
    } catch {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored) as { tickets?: AdminTicketItem[] };
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
      return await adminFetch<{ success: boolean }>(
        `/admin/tickets/${encodeURIComponent(id)}/resolve`,
        {
          method: 'PATCH',
          body: JSON.stringify({ internal_note: internalNote }),
        },
      );
    } catch {
      return { success: true };
    }
  },

  /**
   * Endpoint Laravel target: PATCH /api/v1/admin/tickets/{id}/dismiss
   */
  dismiss: async (id: string): Promise<{ success: boolean }> => {
    try {
      return await adminFetch<{ success: boolean }>(
        `/admin/tickets/${encodeURIComponent(id)}/dismiss`,
        { method: 'PATCH' },
      );
    } catch {
      return { success: true };
    }
  },
};

// ─── 4. Analisis Spasial & Ekspor ───────────────────────────────────────────

export const adminAnalyticsApi = {
  /**
   * Endpoint Laravel target: GET /api/v1/admin/analytics/overview (throws if offline)
   */
  getOverviewStrict: async (timeRange: string = '30d') => {
    return adminFetch<{
      status: string;
      data: {
        kpi: typeof MOCK_KPI;
        analytics: typeof MOCK_ANALYTICS;
      };
    }>('/admin/analytics/overview', { params: { time_range: timeRange } });
  },

  /**
   * Endpoint Laravel target: GET /api/v1/admin/analytics/overview
   */
  getOverview: async (timeRange: string = '30d') => {
    try {
      return await adminAnalyticsApi.getOverviewStrict(timeRange);
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
