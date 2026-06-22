/**
 * @file    utilisateursApi.ts
 * @module  api
 * @desc    Client API pour la gestion des utilisateurs (UC08).
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { apiClient } from './client';
import type { ApiSuccessResponse } from '@/types/api';
import type { AdminUser, CreateUserResponse, UserListFilters, UserListResponse, UserOption } from '@/types/admin';
import type { UserRole } from '@/types/auth';

export type { UserListFilters };

export interface CreateUserPayload {
  username: string;
  nom: string;
  prenom: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  nom: string;
  prenom: string;
  role: UserRole;
}

export const utilisateursApi = {
  async getList(filters: UserListFilters = {}): Promise<UserListResponse> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.role) params.set('role', filters.role);
    if (filters.status) params.set('status', filters.status);

    const query = params.toString();
    const { data } = await apiClient.get<ApiSuccessResponse<UserListResponse>>(
      `/api/utilisateurs${query ? `?${query}` : ''}`,
    );
    return data.data;
  },

  async getOptions(): Promise<UserOption[]> {
    const { data } = await apiClient.get<ApiSuccessResponse<UserOption[]>>('/api/utilisateurs/options');
    return data.data;
  },

  async create(payload: CreateUserPayload): Promise<CreateUserResponse> {
    const { data } = await apiClient.post<ApiSuccessResponse<CreateUserResponse>>(
      '/api/utilisateurs',
      payload,
    );
    return data.data;
  },

  async update(id: number, payload: UpdateUserPayload): Promise<AdminUser> {
    const { data } = await apiClient.patch<ApiSuccessResponse<AdminUser>>(
      `/api/utilisateurs/${id}`,
      payload,
    );
    return data.data;
  },

  async toggleActive(id: number): Promise<AdminUser> {
    const { data } = await apiClient.patch<ApiSuccessResponse<AdminUser>>(
      `/api/utilisateurs/${id}/toggle-active`,
    );
    return data.data;
  },

  async resetPassword(id: number): Promise<CreateUserResponse> {
    const { data } = await apiClient.post<ApiSuccessResponse<CreateUserResponse>>(
      `/api/utilisateurs/${id}/reset-password`,
    );
    return data.data;
  },
};
