/**
 * @file    constants.ts
 * @module  utils
 * @desc    Constantes globales de l'application Arrimage IFU.
 * @author  CNSS–DSI
 * @since   2026-06
 */

export const POLLING_INTERVAL_MS = 30_000;
export const IFU_LENGTH = 13;
export const MAX_LOGIN_ATTEMPTS = 5;
export const ACCESS_TOKEN_TTL = 3600;
export const REFRESH_TOKEN_TTL = 86400;

export const ROLE_DASHBOARD: Record<string, string> = {
  agent1: '/agent1/dashboard',
  agent2: '/agent2/dashboard',
  controleur: '/controleur/dashboard',
  admin: '/admin/dashboard',
};
