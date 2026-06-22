/**
 * @file    admin.ts
 * @module  types
 * @desc    Types TypeScript pour les modules administrateur.
 * @author  CNSS–DSI
 * @since   2026-06
 */

import type { UserRole } from './auth';
import type { PaginatedResponse } from './api';

export interface ConsolidationPreview {
  count: number;
  duplicateCount: number;
}

export interface StatsSummary {
  concordants: number;
  discordants: number;
  consolides: number;
  restants: number;
  totalSaisies: number;
}

export interface StatsByAgent {
  agentId: number;
  nom: string;
  prenom: string;
  role: string;
  count: number;
}

export interface StatsByDate {
  date: string;
  count: number;
}

export interface StatsResponse {
  summary: StatsSummary;
  parAgent: StatsByAgent[];
  parDate: StatsByDate[];
}

export interface AdminUser {
  id: number;
  username: string;
  nom: string;
  prenom: string;
  role: UserRole;
  isActive: boolean;
  isFirstConnexion: boolean;
  dtCreation: string;
  dtLastLogin?: string | null;
}

export interface UserListResponse extends PaginatedResponse<AdminUser> {
  activeCount: number;
}

export interface UserListFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: 'active' | 'inactive';
}

export interface UserOption {
  id: number;
  username: string;
  nom: string;
  prenom: string;
  role: UserRole;
  isActive: boolean;
  dtLastLogin?: string | null;
}

export interface CreateUserResponse {
  user: AdminUser;
  temporaryPassword: string;
}

export interface AuditEntry {
  id: number;
  timestamp: string;
  user: { id: number; nom: string; prenom: string; username: string } | null;
  action: string;
  entiteCible: string | null;
  valeurAvant: string | null;
  valeurApres: string | null;
  ipAddress: string | null;
}

export interface AuditListResponse extends PaginatedResponse<AuditEntry> {}

export interface StatsFilters {
  dateFrom?: string;
  dateTo?: string;
  agentId?: number;
}

export interface AuditFilters {
  page?: number;
  limit?: number;
  userId?: number;
  action?: string;
  dateFrom?: string;
  dateTo?: string;
}
