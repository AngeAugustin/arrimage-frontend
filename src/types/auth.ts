/**
 * @file    auth.ts
 * @module  types
 * @desc    Types TypeScript pour l'authentification et les rôles utilisateur.
 * @author  CNSS–DSI
 * @since   2026-06
 */

export type UserRole = 'agent1' | 'agent2' | 'controleur' | 'admin';

export interface AuthUser {
  id: number;
  username: string;
  role: UserRole;
  nom: string;
  prenom: string;
  isActive: boolean;
  dtLastLogin?: string | null;
}

export interface LoginResponse {
  user: AuthUser;
  isFirstConnexion: boolean;
  expiresAt: string;
}

export interface MeResponse {
  user: AuthUser;
  isFirstConnexion: boolean;
}
