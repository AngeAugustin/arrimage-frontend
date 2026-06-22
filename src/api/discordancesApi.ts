/**
 * @file    discordancesApi.ts
 * @module  api
 * @desc    Client API pour les discordances IFU (UC04).
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { apiClient } from './client';
import type { ApiSuccessResponse } from '@/types/api';
import type { DiscordancesFilters, DiscordancesResponse } from '@/types/saisie';

export const discordancesApi = {
  /**
   * Récupère la liste paginée des discordances actives.
   */
  async getList(filters: DiscordancesFilters = {}): Promise<DiscordancesResponse> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));

    const query = params.toString();
    const { data } = await apiClient.get<ApiSuccessResponse<DiscordancesResponse>>(
      `/api/discordances${query ? `?${query}` : ''}`,
    );
    return data.data;
  },
};
