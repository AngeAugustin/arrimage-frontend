/**
 * @file    useDiscordances.ts
 * @module  hooks
 * @desc    Hook de récupération des discordances avec polling 30s (UC04, RG-10).
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { useQuery } from '@tanstack/react-query';
import { discordancesApi } from '@/api/discordancesApi';
import { POLLING_INTERVAL_MS } from '@/utils/constants';
import type { DiscordancesFilters } from '@/types/saisie';

/**
 * Charge les discordances avec rafraîchissement automatique toutes les 30 secondes.
 */
export function useDiscordances(filters: DiscordancesFilters = {}) {
  const query = useQuery({
    queryKey: ['discordances', filters],
    queryFn: () => discordancesApi.getList(filters),
    refetchInterval: POLLING_INTERVAL_MS,
    refetchIntervalInBackground: false,
    staleTime: POLLING_INTERVAL_MS - 5_000,
  });

  return {
    discordances: query.data?.items ?? [],
    count: query.data?.count ?? 0,
    total: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    summary: query.data?.summary ?? null,
    lastUpdated: query.data?.fetchedAt ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refresh: query.refetch,
  };
}
