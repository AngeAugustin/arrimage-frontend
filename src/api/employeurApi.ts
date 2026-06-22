/**
 * @file    employeurApi.ts
 * @module  api
 * @desc    Client API pour la recherche employeur CNSS.
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { apiClient } from './client';
import type { ApiSuccessResponse } from '@/types/api';
import type { EmployeurInfo } from '@/types/saisie';

export const employeurApi = {
  /**
   * Recherche un employeur par numéro CNSS.
   */
  async getByNumCnss(numCnss: string): Promise<EmployeurInfo> {
    const { data } = await apiClient.get<ApiSuccessResponse<EmployeurInfo>>(
      `/api/employeur/${encodeURIComponent(numCnss)}`,
    );
    return data.data;
  },
};
