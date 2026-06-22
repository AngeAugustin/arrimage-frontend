/**
 * @file    auditApi.ts
 * @module  api
 * @desc    Client API pour le journal d'audit (UC09).
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { apiClient } from './client';
import type { ApiSuccessResponse } from '@/types/api';
import type { AuditFilters, AuditListResponse } from '@/types/admin';
import { extractBlobApiError } from '@/utils/apiError';

function buildAuditParams(filters: AuditFilters = {}): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.userId) params.set('userId', String(filters.userId));
  if (filters.action) params.set('action', filters.action);
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
  if (filters.dateTo) params.set('dateTo', filters.dateTo);
  return params;
}

export const auditApi = {
  async getList(filters: AuditFilters = {}): Promise<AuditListResponse> {
    const { data } = await apiClient.get<ApiSuccessResponse<AuditListResponse>>(
      `/api/audit?${buildAuditParams(filters).toString()}`,
    );
    return data.data;
  },

  /**
   * Exporte le journal filtré en XLSX et déclenche le téléchargement navigateur.
   */
  async exportXlsx(filters: AuditFilters = {}): Promise<{ count: number; filename: string }> {
    const exportFilters: AuditFilters = { ...filters };
    delete exportFilters.page;
    delete exportFilters.limit;

    try {
      const response = await apiClient.get(`/api/audit/export?${buildAuditParams(exportFilters).toString()}`, {
        responseType: 'blob',
      });

      const count = parseInt(response.headers['x-export-count'] as string ?? '0', 10);
      const disposition = response.headers['content-disposition'] as string | undefined;
      const filenameMatch = disposition?.match(/filename="(.+)"/);
      const filename = filenameMatch?.[1] ?? 'audit_log.xlsx';

      const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { count, filename };
    } catch (error) {
      throw new Error(await extractBlobApiError(error, 'Impossible d\'exporter le journal d\'audit.'));
    }
  },
};
