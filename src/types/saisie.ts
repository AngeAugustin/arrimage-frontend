/**
 * @file    saisie.ts
 * @module  types
 * @desc    Types TypeScript pour les saisies IFU et discordances.
 * @author  CNSS–DSI
 * @since   2026-06
 */

import type { PaginatedResponse } from './api';

export interface UserSummary {
  id: number;
  nom: string;
  prenom: string;
}

export type SaisieStatus = 'SAISIE' | 'CONTRE_SAISIE' | 'CONSOLIDE';

export interface Saisie {
  id: number;
  numCnss: string;
  raisonSociale: string;
  ifuAgent1?: string;
  agent1?: UserSummary;
  dtSaisie1?: string;
  ifuAgent2?: string | null;
  agent2?: UserSummary | null;
  dtSaisie2?: string | null;
  flagConsolide: boolean;
  dtExport?: string | null;
  status: SaisieStatus;
  dtModif?: string | null;
}

export interface Discordance extends Saisie {
  ifuAgent1: string;
  agent1: UserSummary;
  dtSaisie1: string;
  ifuAgent2: string;
  agent2: UserSummary;
  dtSaisie2: string;
}

export interface EmployeurInfo {
  numCnss: string;
  raisonSociale: string;
}

export interface AttenteContresaisie {
  eligible: boolean;
  numCnss: string;
  raisonSociale: string;
}

export interface CorrectionContext {
  numCnss: string;
  raisonSociale: string;
  ifuActuel: string;
  flagConsolide: boolean;
  dtExport?: string | null;
}

export interface AgentDashboardStats {
  today: number;
  yesterday: number;
  todayDelta: number;
  monthTotal: number;
  pending: number;
}

export interface MesSaisiesFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'all' | 'attente' | 'concordant' | 'discordant' | 'consolide';
  period?: string;
}

export interface MesSaisiesResponse extends PaginatedResponse<Saisie> {
  stats: AgentDashboardStats;
}

export interface ControleurSummary {
  discordances: number;
  concordants: number;
  enAttenteContresaisie: number;
  validationRate: number;
  recentDelta: number;
  averageDelayMinutes: number | null;
}

export interface DiscordancesFilters {
  page?: number;
  limit?: number;
}

export interface DiscordancesResponse extends PaginatedResponse<Discordance> {
  count: number;
  fetchedAt: string;
  summary: ControleurSummary;
}
