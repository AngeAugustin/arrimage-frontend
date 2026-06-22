/**
 * @file    roleLabels.ts
 * @module  utils
 * @desc    Libellés d'affichage des rôles utilisateur (Figma).
 */

import type { UserRole } from '@/types/auth';

export const ROLE_LABELS: Record<UserRole, string> = {
  agent1: 'Agent 1 — Saisie',
  agent2: 'Agent 2 — Contre-saisie',
  controleur: 'Contrôleur',
  admin: 'Administrateur',
};

export function getUserInitials(prenom: string, nom: string): string {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
}
