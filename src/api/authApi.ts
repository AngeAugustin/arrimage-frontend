/**
 * @file    authApi.ts
 * @module  api
 * @desc    Client API pour les endpoints d'authentification.
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { apiClient } from './client';
import type { ApiSuccessResponse } from '@/types/api';
import type { LoginResponse, MeResponse } from '@/types/auth';

export const authApi = {
  /**
   * Authentifie un utilisateur (cookies JWT posés automatiquement).
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const { data } = await apiClient.post<ApiSuccessResponse<LoginResponse>>('/api/auth/login', {
      username,
      password,
    });
    return data.data;
  },

  /**
   * Récupère l'utilisateur courant depuis le cookie access_token.
   */
  async me(): Promise<MeResponse> {
    const { data } = await apiClient.get<ApiSuccessResponse<MeResponse>>('/api/auth/me');
    return data.data;
  },

  /**
   * Renouvelle l'access token à partir du cookie refresh_token.
   */
  async refresh(): Promise<void> {
    await apiClient.post('/api/auth/refresh');
  },

  /**
   * Déconnecte l'utilisateur et invalide les cookies.
   */
  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
  },

  /**
   * Change le mot de passe de l'utilisateur connecté.
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<void> {
    await apiClient.post('/api/auth/change-password', {
      currentPassword,
      newPassword,
      confirmPassword,
    });
  },
};
