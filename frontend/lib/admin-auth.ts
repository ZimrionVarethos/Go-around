'use client';

import { useSyncExternalStore } from 'react';
import {
  adminAuthApi,
  calculateAdminInitials,
  DEFAULT_ADMIN_PROFILE_DATA,
  getAdminToken,
  shouldUseLaravelAdminApi,
} from './api-admin';

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

export const DEFAULT_ADMIN_PROFILE: AdminProfile = DEFAULT_ADMIN_PROFILE_DATA;

const DEFAULT_AUTH_STATE: AdminAuthState = {
  profile: DEFAULT_ADMIN_PROFILE,
  password: DEFAULT_ADMIN_PASSWORD,
};

let memoryState: AdminAuthState = DEFAULT_AUTH_STATE;
let isInitialized = false;
let hasSyncedProfile = false;
const listeners = new Set<() => void>();

function getStoredState(): AdminAuthState {
  if (typeof window === 'undefined') return DEFAULT_AUTH_STATE;

  if (!isInitialized) {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        memoryState = JSON.parse(item) as AdminAuthState;
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
        memoryState = JSON.parse(e.newValue) as AdminAuthState;
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

export async function syncAdminAuthFromBackend(): Promise<void> {
  if (hasSyncedProfile || !shouldUseLaravelAdminApi()) return;

  const token = getAdminToken();
  if (!token || token.startsWith('mock-sanctum-token-')) {
    return;
  }

  hasSyncedProfile = true;
  try {
    const serverProfile = await adminAuthApi.getMeStrict();
    const current = getStoredState();
    if (!current.profile.isAuthenticated) return;

    saveAndNotify({
      ...current,
      profile: {
        ...current.profile,
        ...serverProfile,
        isAuthenticated: true,
      },
    });
  } catch {
    hasSyncedProfile = false;
  }
}

export function useAdminAuth() {
  const state = useSyncExternalStore(
    subscribe,
    getStoredState,
    () => DEFAULT_AUTH_STATE,
  );

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return { success: false, error: 'Email dan kata sandi wajib diisi.' };
    }

    const current = getStoredState();

    if (shouldUseLaravelAdminApi()) {
      try {
        const res = await adminAuthApi.login({
          email: trimmedEmail,
          password: trimmedPassword,
        });

        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

        saveAndNotify({
          ...current,
          password: trimmedPassword,
          profile: {
            ...current.profile,
            ...res.user,
            isAuthenticated: true,
            lastLogin: `Hari ini, ${timeString}`,
          },
        });
        hasSyncedProfile = true;
        return { success: true };
      } catch (err) {
        if (err && typeof err === 'object' && 'status' in err) {
          return {
            success: false,
            error:
              err instanceof Error && err.message
                ? err.message
                : 'Email atau kata sandi yang Anda masukkan salah.',
          };
        }
        // Network offline -> fall through to local validation below
      }
    }

    const activeEmail = (current.profile.email || DEFAULT_ADMIN_PROFILE.email).trim().toLowerCase();
    const activePassword = current.password || DEFAULT_ADMIN_PASSWORD;

    const isEmailValid =
      trimmedEmail === activeEmail || trimmedEmail === DEFAULT_ADMIN_PROFILE.email.toLowerCase();
    const isPasswordValid = trimmedPassword === activePassword;

    if (!isEmailValid || !isPasswordValid) {
      return {
        success: false,
        error: 'Email atau kata sandi yang Anda masukkan salah.',
      };
    }

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

    saveAndNotify({
      ...current,
      profile: {
        ...current.profile,
        isAuthenticated: true,
        lastLogin: `Hari ini, ${timeString}`,
      },
    });

    return { success: true };
  };

  const logout = async (): Promise<void> => {
    const current = getStoredState();
    hasSyncedProfile = false;
    saveAndNotify({
      ...current,
      profile: {
        ...current.profile,
        isAuthenticated: false,
      },
    });
    await adminAuthApi.logout();
  };

  const updateProfile = async (data: Partial<AdminProfile>): Promise<void> => {
    const current = getStoredState();
    const nextName = data.name !== undefined ? data.name : current.profile.name;
    const nextInitials = data.avatarInitials || calculateAdminInitials(nextName);

    const nextProfile: AdminProfile = {
      ...current.profile,
      ...data,
      name: nextName,
      avatarInitials: nextInitials,
    };

    saveAndNotify({
      ...current,
      profile: nextProfile,
    });

    if (shouldUseLaravelAdminApi()) {
      try {
        const synced = await adminAuthApi.updateProfile(nextProfile);
        const latest = getStoredState();
        saveAndNotify({
          ...latest,
          profile: {
            ...latest.profile,
            ...synced,
            agency: data.agency ?? synced.agency,
            bio: data.bio ?? synced.bio,
            phone: data.phone ?? synced.phone,
            role: data.role ?? synced.role,
          },
        });
      } catch {
        // Offline fallback already saved locally
      }
    }
  };

  const updatePassword = async (
    oldPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!oldPassword) {
      return { success: false, error: 'Kata sandi saat ini wajib diisi.' };
    }
    const current = getStoredState();
    const activePassword = current.password || DEFAULT_ADMIN_PASSWORD;
    if (oldPassword !== activePassword) {
      return { success: false, error: 'Kata sandi saat ini tidak sesuai.' };
    }
    if (newPassword.length < 6) {
      return { success: false, error: 'Kata sandi baru minimal 6 karakter.' };
    }

    if (shouldUseLaravelAdminApi()) {
      try {
        await adminAuthApi.changePassword(oldPassword, newPassword);
      } catch (err) {
        if (err && typeof err === 'object' && 'status' in err) {
          return {
            success: false,
            error:
              err instanceof Error && err.message
                ? err.message
                : 'Gagal memperbarui kata sandi di server.',
          };
        }
      }
    }

    saveAndNotify({
      ...current,
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
