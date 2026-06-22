/**
 * @file    statsApi.ts
 * @module  api
 * @desc    Client API pour les statistiques admin (UC07).
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { apiClient } from './client';
import type { ApiSuccessResponse } from '@/types/api';
import type { StatsFilters, StatsResponse } from '@/types/admin';

export const statsApi = {
  async getStats(filters: StatsFilters = {}): Promise<StatsResponse> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.agentId) params.set('agentId', String(filters.agentId));

    const { data } = await apiClient.get<ApiSuccessResponse<StatsResponse>>(
      `/api/stats?${params.toString()}`,
    );
    return data.data;
  },
};
