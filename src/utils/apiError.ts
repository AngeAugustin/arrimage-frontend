/**
 * @file    apiError.ts
 * @module  utils
 * @desc    Extraction du message d'erreur métier depuis une réponse Axios.
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { isApiError } from '@/types/api';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/api';

/**
 * Extrait le message d'erreur JSON depuis une réponse blob (export XLSX, etc.).
 */
export async function extractBlobApiError(
  error: unknown,
  fallback = 'Une erreur inattendue est survenue.',
): Promise<string> {
  const axiosErr = error as AxiosError<Blob>;
  const data = axiosErr.response?.data;
  const status = axiosErr.response?.status;

  if (data instanceof Blob) {
    const text = await data.text();
    if (text !== '') {
      try {
        const parsed = JSON.parse(text) as ApiErrorResponse;
        if (isApiError(parsed)) {
          return parsed.error.message;
        }
      } catch {
        if (text.length <= 300) {
          return text;
        }
      }
    }
  }

  if (status === 500) {
    return 'Erreur serveur pendant la consolidation (mémoire ou délai dépassé). Réessayez avec un lot plus petit ou contactez l\'administrateur.';
  }

  if (status === 504 || axiosErr.code === 'ECONNABORTED') {
    return 'La consolidation a pris trop de temps et a été interrompue. Réessayez ou réduisez le volume de données.';
  }

  return extractApiErrorMessage(error, fallback);
}

/**
 * Retourne le code d'erreur métier depuis une exception API.
 */
export function extractApiErrorCode(error: unknown): string | null {
  const axiosErr = error as AxiosError<ApiErrorResponse>;
  const apiData = axiosErr.response?.data;
  if (apiData && isApiError(apiData)) {
    return apiData.error.code;
  }
  return null;
}

/**
 * Retourne le message d'erreur lisible depuis une exception API.
 */
export function extractApiErrorMessage(error: unknown, fallback = 'Une erreur inattendue est survenue.'): string {
  const axiosErr = error as AxiosError<ApiErrorResponse>;
  if (!axiosErr.response) {
    return 'Impossible de joindre le serveur. Vérifiez que le backend est démarré.';
  }
  const apiData = axiosErr.response.data;
  if (apiData && isApiError(apiData)) {
    return apiData.error.message;
  }
  return fallback;
}
