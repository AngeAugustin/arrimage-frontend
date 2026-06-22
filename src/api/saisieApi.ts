/**
 * @file    saisieApi.ts
 * @module  api
 * @desc    Client API pour les saisies, contre-saisies et corrections IFU.
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { apiClient } from './client';
import type { ApiSuccessResponse } from '@/types/api';
import type {
  AttenteContresaisie,
  CorrectionContext,
  MesSaisiesFilters,
  MesSaisiesResponse,
  Saisie,
} from '@/types/saisie';

export interface SaisiePayload {
  numCnss: string;
  ifu: string;
  ifuConfirmation: string;
}

export interface IfuPayload {
  ifu: string;
  ifuConfirmation: string;
}

export const saisieApi = {
  async create(payload: SaisiePayload): Promise<Saisie> {
    const { data } = await apiClient.post<ApiSuccessResponse<Saisie>>('/api/saisie', payload);
    return data.data;
  },

  async getMesSaisies(filters: MesSaisiesFilters = {}): Promise<MesSaisiesResponse> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters.period) params.set('period', filters.period);

    const query = params.toString();
    const { data } = await apiClient.get<ApiSuccessResponse<MesSaisiesResponse>>(
      `/api/saisie/mes-saisies${query ? `?${query}` : ''}`,
    );
    return data.data;
  },

  async getAttente(numCnss: string): Promise<AttenteContresaisie> {
    const { data } = await apiClient.get<ApiSuccessResponse<AttenteContresaisie>>(
      `/api/saisie/attente/${encodeURIComponent(numCnss)}`,
    );
    return data.data;
  },

  async contresaisie(numCnss: string, payload: IfuPayload): Promise<Saisie> {
    const { data } = await apiClient.patch<ApiSuccessResponse<Saisie>>(
      `/api/saisie/${encodeURIComponent(numCnss)}/contresaisie`,
      payload,
    );
    return data.data;
  },

  async getCorrectionContext(numCnss: string): Promise<CorrectionContext> {
    const { data } = await apiClient.get<ApiSuccessResponse<CorrectionContext>>(
      `/api/saisie/${encodeURIComponent(numCnss)}/correction`,
    );
    return data.data;
  },

  async correction(numCnss: string, payload: IfuPayload): Promise<Saisie> {
    const { data } = await apiClient.patch<ApiSuccessResponse<Saisie>>(
      `/api/saisie/${encodeURIComponent(numCnss)}/correction`,
      payload,
    );
    return data.data;
  },
};
