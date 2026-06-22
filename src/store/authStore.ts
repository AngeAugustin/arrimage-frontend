/**
 * @file    authStore.ts
 * @module  store
 * @desc    Store Zustand pour l'état d'authentification (sans JWT — cookies HttpOnly uniquement).
 *
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AuthUser } from '@/types/auth';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isFirstConnexion: boolean;
  isLoading: boolean;
  pendingTempPassword: string | null;
  setUser: (user: AuthUser, isFirstConnexion: boolean) => void;
  setPendingTempPassword: (password: string) => void;
  clearPendingTempPassword: () => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const PENDING_TEMP_PASSWORD_KEY = 'arrimage_pending_temp_password';

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isFirstConnexion: false,
      isLoading: true,
      pendingTempPassword: null,

      setUser: (user, isFirstConnexion) =>
        set({ user, isAuthenticated: true, isFirstConnexion, isLoading: false }),

      setPendingTempPassword: (password) => {
        sessionStorage.setItem(PENDING_TEMP_PASSWORD_KEY, password);
        set({ pendingTempPassword: password });
      },

      clearPendingTempPassword: () => {
        sessionStorage.removeItem(PENDING_TEMP_PASSWORD_KEY);
        set({ pendingTempPassword: null });
      },

      logout: () => {
        sessionStorage.removeItem(PENDING_TEMP_PASSWORD_KEY);
        set({
          user: null,
          isAuthenticated: false,
          isFirstConnexion: false,
          isLoading: false,
          pendingTempPassword: null,
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    { name: 'AuthStore' },
  ),
);

export function getPendingTempPassword(): string | null {
  const { pendingTempPassword } = useAuthStore.getState();
  if (pendingTempPassword) return pendingTempPassword;
  return sessionStorage.getItem(PENDING_TEMP_PASSWORD_KEY);
}
