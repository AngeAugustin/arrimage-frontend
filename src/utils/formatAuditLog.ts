/**
 * @file    formatAuditLog.ts
 * @module  utils
 * @desc    Helpers d'affichage pour le journal d'audit.
 */

import type { AuditEntry } from '@/types/admin';

const ACTION_CODES: Record<string, string> = {
  LOGIN: 'LOG',
  LOGIN_REFUSEE: 'LRF',
  ACCOUNT_DISABLED: 'ACD',
  ACCOUNT_ENABLED: 'ACE',
  RESET_PASSWORD: 'RSP',
  CHANGE_PASSWORD: 'CHP',
  CHANGE_PASSWORD_REFUSEE: 'CPR',
  SAISIE: 'SAI',
  SAISIE_REFUSEE: 'SRF',
  CONTRESAISIE: 'CTS',
  CONTRESAISIE_REFUSEE: 'CRF',
  CORRECTION: 'COR',
  CONSOLIDATION: 'CSD',
  CREATE_USER: 'CRU',
  UPDATE_USER: 'UPU',
};

/**
 * Identifiant lisible d'une entrée d'audit (ex. #LOG-2026-COR-00023).
 */
export function formatAuditLogId(entry: AuditEntry): string {
  const year = new Date(entry.timestamp).getFullYear();
  const code = ACTION_CODES[entry.action] ?? 'ACT';
  const id = String(entry.id).padStart(5, '0');
  return `#LOG-${year}-${code}-${id}`;
}

function parseAuditJson(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

/**
 * Objet before/after pour l'affichage JSON des valeurs modifiées.
 */
export function buildAuditModifiedValues(entry: AuditEntry): Record<string, unknown> {
  const before = parseAuditJson(entry.valeurAvant);
  const after = parseAuditJson(entry.valeurApres);

  if (before !== null && after !== null) {
    return { before, after };
  }
  if (before !== null) {
    return { before };
  }
  if (after !== null) {
    return { after };
  }
  return { message: 'Aucune valeur enregistrée pour cette action.' };
}

/**
 * Identifiant affiché pour l'auteur d'une entrée d'audit (y compris connexions refusées).
 */
export function getAuditUsername(entry: AuditEntry): string {
  if (entry.user?.username) {
    return entry.user.username;
  }

  if (entry.valeurApres) {
    try {
      const parsed = JSON.parse(entry.valeurApres) as { username?: string };
      if (parsed.username) {
        return parsed.username;
      }
    } catch {
      // ignore invalid JSON
    }
  }

  return '—';
}

export function formatAuditJsonBlock(entry: AuditEntry): string {
  return JSON.stringify(buildAuditModifiedValues(entry), null, 2);
}

/**
 * Libellé court de l'entité cible.
 */
export function formatAuditEntiteCible(entiteCible: string | null): string {
  if (!entiteCible) return '—';
  if (entiteCible.includes('\\')) {
    return entiteCible.split('\\').pop() ?? entiteCible;
  }
  return entiteCible;
}
