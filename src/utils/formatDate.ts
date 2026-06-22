/**
 * @file    formatDate.ts
 * @module  utils
 * @desc    Utilitaires de formatage de dates pour l'affichage UI.
 * @author  CNSS–DSI
 * @since   2026-06
 */

/**
 * Formate une date ISO en format français lisible.
 */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formate l'heure seule (pour la dernière actualisation du polling).
 */
export function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Formate une date pour l'affichage dans les tableaux (ex. « 24 oct. 2023 »).
 */
export function formatDateShort(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formate la veille en français court (ex. « 17 juin 2026 »).
 */
export function formatYesterdayLong(date = new Date()): string {
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  const formatted = yesterday.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * Formate la date du jour en français long (ex. « Vendredi 5 juin 2026 »).
 */
export function formatTodayLong(date = new Date()): string {
  const formatted = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * Formate une date de création (ex. « 12 oct. 2023 »).
 */
export function formatCreationDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formate une dernière connexion en relatif (ex. « Aujourd'hui, 09:45 »).
 */
export function formatRelativeLogin(iso: string | null | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  const now = new Date();
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfDate = new Date(date);
  startOfDate.setHours(0, 0, 0, 0);

  const dayDiff = Math.round((startOfToday.getTime() - startOfDate.getTime()) / 86_400_000);

  if (dayDiff === 0) return `Aujourd'hui, ${time}`;
  if (dayDiff === 1) return `Hier, ${time}`;
  if (dayDiff < 7) return `Il y a ${dayDiff} jours`;
  return formatDateShort(iso);
}

/**
 * Formate un horodatage audit (ex. « 19/06/2026 11:32:39 »).
 */
export function formatAuditTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}
