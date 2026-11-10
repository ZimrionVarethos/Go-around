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

export interface AdminAuthState {
  profile: AdminProfile;
  password?: string;
}

const STORAGE_KEY = 'goaround_admin_auth_v2';
const DEFAULT_ADMIN_PASSWORD = 'admin123';

export const DEFAULT_ADMIN_PROFILE: AdminProfile = {
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

const DEFAULT_AUTH_STATE: AdminAuthState = {
  profile: DEFAULT_ADMIN_PROFILE,
  password: DEFAULT_ADMIN_PASSWORD,
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
    } catch (e) {
      console.warn('Failed to save admin auth to localStorage', e);
    }
  }
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);

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
    window.addEventListener('storage', handleStorageEvent);
  }

  return () => {
    listeners.delete(callback);
    if (typeof window !== 'undefined') {
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
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return { success: false, error: 'Email dan kata sandi wajib diisi.' };
    }

    const activeEmail = (state.profile.email || DEFAULT_ADMIN_PROFILE.email).trim().toLowerCase();
    const activePassword = state.password || DEFAULT_ADMIN_PASSWORD;

    const isEmailValid =
      trimmedEmail === activeEmail || trimmedEmail === DEFAULT_ADMIN_PROFILE.email.toLowerCase();
    const isPasswordValid = trimmedPassword === activePassword;

    if (!isEmailValid || !isPasswordValid) {
      return {
        success: false,
        error: 'Email atau kata sandi yang Anda masukkan salah.',
      };
    }

    // Login berhasil
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

    const updatedProfile: AdminProfile = {
      ...state.profile,
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

  const updatePassword = (oldPassword: string, newPassword: string): { success: boolean; error?: string } => {
    if (!oldPassword) {
      return { success: false, error: 'Kata sandi saat ini wajib diisi.' };
    }
    const activePassword = state.password || DEFAULT_ADMIN_PASSWORD;
    if (oldPassword !== activePassword) {
      return { success: false, error: 'Kata sandi saat ini tidak sesuai.' };
    }
    if (newPassword.length < 6) {
      return { success: false, error: 'Kata sandi baru minimal 6 karakter.' };
    }

    saveAndNotify({
      ...state,
      password: newPassword,
    });

    return { success: true };
  };

  return {
    profile: state.profile,
    isAuthenticated: state.profile.isAuthenticated,
    login,
    logout,
    updateProfile,
    updatePassword,
  };
}
