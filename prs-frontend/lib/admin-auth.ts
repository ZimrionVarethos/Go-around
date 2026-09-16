'use client';

import { useSyncExternalStore } from 'react';

export interface AdminProfile {
  name: string;
  email: string;
  role: string;
  agency: string;
  avatarInitials: string;
  bio: string;
  phone?: string;
  isAuthenticated: boolean;
  lastLogin: string;
}

export interface AdminPreferences {
  defaultBasemap: 'carto' | 'osm' | 'topo';
  defaultBufferRadius: number; // in meters (e.g. 500, 1000, 2000)
  notificationsEnabled: boolean;
  soundAlerts: boolean;
  coordinateFormat: 'decimal' | 'dms';
}

export interface AdminAuthState {
  profile: AdminProfile;
  preferences: AdminPreferences;
}

const STORAGE_KEY = 'goaround_admin_auth_v1';
const EVENT_KEY = 'goaround:admin-auth-updated';

export const DEFAULT_ADMIN_PROFILE: AdminProfile = {
  name: 'Azqilla Simbolon',
  email: 'admin@goaround.id',
  role: 'Super Admin SIG Kota Bogor',
  agency: 'Bappeda & Tim SIG IPB University',
  avatarInitials: 'AS',
  bio: 'Pengelola master data spasial dan verifikator fasilitas kafe ramah mahasiswa seputar Kota Bogor.',
  phone: '+62 812-3456-7890',
  isAuthenticated: true,
  lastLogin: 'Hari ini, 08:30 WIB',
};

export const DEFAULT_ADMIN_PREFERENCES: AdminPreferences = {
  defaultBasemap: 'carto',
  defaultBufferRadius: 1000,
  notificationsEnabled: true,
  soundAlerts: false,
  coordinateFormat: 'decimal',
};

const DEFAULT_AUTH_STATE: AdminAuthState = {
  profile: DEFAULT_ADMIN_PROFILE,
  preferences: DEFAULT_ADMIN_PREFERENCES,
};

let memoryState: AdminAuthState = DEFAULT_AUTH_STATE;
let isInitialized = false;
const listeners = new Set<() => void>();

function getStoredState(): AdminAuthState {
  if (typeof window === 'undefined') return DEFAULT_AUTH_STATE;

  if (!isInitialized) {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        memoryState = JSON.parse(item);
      } else {
        memoryState = DEFAULT_AUTH_STATE;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_AUTH_STATE));
      }
    } catch {
      memoryState = DEFAULT_AUTH_STATE;
    }
    isInitialized = true;
  }
  return memoryState;
}

function saveAndNotify(nextState: AdminAuthState) {
  memoryState = nextState;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      window.dispatchEvent(new CustomEvent(EVENT_KEY));
    } catch (e) {
      console.warn('Failed to save admin auth to localStorage', e);
    }
  }
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);

  const handleCustomEvent = () => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        memoryState = JSON.parse(item);
      }
    } catch {
      // ignore
    }
    callback();
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        memoryState = JSON.parse(e.newValue);
        callback();
      } catch {
        // ignore
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener(EVENT_KEY, handleCustomEvent);
    window.addEventListener('storage', handleStorageEvent);
  }

  return () => {
    listeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener(EVENT_KEY, handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
    }
  };
}

export function useAdminAuth() {
  const state = useSyncExternalStore(
    subscribe,
    getStoredState,
    () => DEFAULT_AUTH_STATE
  );

  const calculateInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name.slice(0, 2) || 'AD').toUpperCase();
  };

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    // Validasi sederhana: mendukung akun demo atau kombinasi email/password apa pun yang tidak kosong
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return { success: false, error: 'Email dan kata sandi wajib diisi.' };
    }

    if (trimmedPassword.length < 6) {
      return { success: false, error: 'Kata sandi minimal 6 karakter.' };
    }

    // Login berhasil
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

    const updatedProfile: AdminProfile = {
      ...state.profile,
      email: trimmedEmail,
      name: trimmedEmail === 'admin@goaround.id' ? 'Azqilla Simbolon' : state.profile.name,
      avatarInitials: calculateInitials(trimmedEmail === 'admin@goaround.id' ? 'Azqilla Simbolon' : state.profile.name),
      isAuthenticated: true,
      lastLogin: `Hari ini, ${timeString}`,
    };

    saveAndNotify({
      ...state,
      profile: updatedProfile,
    });

    return { success: true };
  };

  const logout = () => {
    saveAndNotify({
      ...state,
      profile: {
        ...state.profile,
        isAuthenticated: false,
      },
    });
  };

  const updateProfile = (data: Partial<AdminProfile>) => {
    const nextName = data.name !== undefined ? data.name : state.profile.name;
    const nextInitials = data.avatarInitials || calculateInitials(nextName);

    const nextProfile: AdminProfile = {
      ...state.profile,
      ...data,
      name: nextName,
      avatarInitials: nextInitials,
    };

    saveAndNotify({
      ...state,
      profile: nextProfile,
    });
  };

  const updatePreferences = (data: Partial<AdminPreferences>) => {
    saveAndNotify({
      ...state,
      preferences: {
        ...state.preferences,
        ...data,
      },
    });
  };

  const updatePassword = (oldPassword: string, newPassword: string): { success: boolean; error?: string } => {
    if (!oldPassword) {
      return { success: false, error: 'Kata sandi saat ini wajib diisi.' };
    }
    if (newPassword.length < 6) {
      return { success: false, error: 'Kata sandi baru minimal 6 karakter.' };
    }
    return { success: true };
  };

  return {
    profile: state.profile,
    preferences: state.preferences,
    isAuthenticated: state.profile.isAuthenticated,
    login,
    logout,
    updateProfile,
    updatePreferences,
    updatePassword,
  };
}
