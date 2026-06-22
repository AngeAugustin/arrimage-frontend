/**
 * @file    mesSaisiesQuery.ts
 * @module  features/shared
 */

import type { QueryClient } from '@tanstack/react-query';
import type { MesSaisiesResponse, Saisie } from '@/types/saisie';

export function patchMesSaisiesList(queryClient: QueryClient, updated: Saisie): void {
  queryClient.setQueriesData<MesSaisiesResponse>(
    { queryKey: ['mes-saisies', 'list'] },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        items: old.items.map((s) => (s.id === updated.id ? updated : s)),
      };
    },
  );
}

export async function refreshMesSaisies(queryClient: QueryClient): Promise<void> {
  await queryClient.refetchQueries({ queryKey: ['mes-saisies'] });
}

export function invalidateMesSaisies(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({ queryKey: ['mes-saisies'] });
}
