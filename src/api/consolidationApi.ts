/**
 * @file    consolidationApi.ts
 * @module  api
 * @desc    Client API pour la consolidation et export XLSX (UC06).
 * @author  CNSS–DSI
 * @since   2026-06
 */

import type { AxiosResponse } from 'axios';
import { apiClient } from './client';
import type { ApiSuccessResponse } from '@/types/api';
import type { ConsolidationPreview } from '@/types/admin';
import { extractBlobApiError } from '@/utils/apiError';

async function triggerBlobDownload(response: AxiosResponse<Blob>): Promise<{ count: number; filename: string }> {
  const count = parseInt(response.headers['x-export-count'] as string ?? '0', 10);
  const disposition = response.headers['content-disposition'] as string | undefined;
  const filenameMatch =
    disposition?.match(/filename\*=UTF-8''([^;]+)/i) ??
    disposition?.match(/filename="([^"]+)"/i) ??
    disposition?.match(/filename=([^;]+)/i);
  const filename = filenameMatch?.[1]
    ? decodeURIComponent(filenameMatch[1].trim())
    : 'consolidation_ifu.xlsx';

  const blob =
    response.data instanceof Blob
      ? response.data
      : new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return { count, filename };
}

export const consolidationApi = {
  async preview(): Promise<ConsolidationPreview> {
    const { data } = await apiClient.get<ApiSuccessResponse<ConsolidationPreview>>(
      '/api/consolidation/preview',
    );
    return data.data;
  },

  /**
   * Lance l'export XLSX et déclenche le téléchargement côté navigateur.
   */
  async export(): Promise<{ count: number; filename: string }> {
    try {
      const response = await apiClient.post<Blob>('/api/consolidation/export', null, {
        responseType: 'blob',
        timeout: 3_600_000,
      });
      return triggerBlobDownload(response);
    } catch (error) {
      throw new Error(await extractBlobApiError(error, 'Impossible de lancer la consolidation.'));
    }
  },

  /**
   * Re-télécharge le fichier XLSX d'un export déjà généré.
   */
  async downloadExport(auditLogId: number): Promise<{ count: number; filename: string }> {
    try {
      const response = await apiClient.get<Blob>(`/api/consolidation/export/${auditLogId}`, {
        responseType: 'blob',
      });
      return triggerBlobDownload(response);
    } catch (error) {
      throw new Error(await extractBlobApiError(error, 'Impossible de télécharger le fichier d\'export.'));
    }
  },
};
