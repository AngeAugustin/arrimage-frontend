/**
 * @file    HistoriqueSaisie.tsx
 * @module  features/agent1
 */

import { useQuery } from '@tanstack/react-query';
import { saisieApi } from '@/api/saisieApi';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from '@/components/ui/DataTable';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/utils/formatDate';
import type { Saisie } from '@/types/saisie';

interface HistoriqueSaisieProps {
  refreshKey?: number;
}

export function HistoriqueSaisie({ refreshKey = 0 }: HistoriqueSaisieProps) {
  const { user } = useAuthStore();
  const isAgent2 = user?.role === 'agent2';

  const { data, isLoading, error } = useQuery({
    queryKey: ['mes-saisies', 'historique', refreshKey],
    queryFn: () => saisieApi.getMesSaisies({ page: 1, limit: 100 }),
  });

  const items = data?.items ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-cnss-error">Impossible de charger l&apos;historique.</p>;
  }

  if (!data || items.length === 0) {
    return <p className="py-8 text-center text-sm text-cnss-text-muted">Aucune saisie enregistrée.</p>;
  }

  return (
    <DataTable>
      <DataTableHead>
        <tr>
          <DataTableHeaderCell>N° CNSS</DataTableHeaderCell>
          <DataTableHeaderCell>Raison sociale</DataTableHeaderCell>
          <DataTableHeaderCell>{isAgent2 ? 'Mon IFU' : 'IFU saisi'}</DataTableHeaderCell>
          <DataTableHeaderCell>Date</DataTableHeaderCell>
          <DataTableHeaderCell>Statut</DataTableHeaderCell>
        </tr>
      </DataTableHead>
      <DataTableBody>
        {items.map((saisie: Saisie) => (
          <DataTableRow key={saisie.id}>
            <DataTableCell className="font-mono">{saisie.numCnss}</DataTableCell>
            <DataTableCell>{saisie.raisonSociale}</DataTableCell>
            <DataTableCell className="font-mono tracking-wider">
              {isAgent2 ? saisie.ifuAgent2 : saisie.ifuAgent1}
            </DataTableCell>
            <DataTableCell className="text-cnss-text-muted">
              {formatDate(isAgent2 ? (saisie.dtSaisie2 ?? saisie.dtSaisie1 ?? '') : (saisie.dtSaisie1 ?? ''))}
            </DataTableCell>
            <DataTableCell>
              <StatusBadge saisie={saisie} isAgent2={isAgent2} />
            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  );
}
function StatusBadge({ saisie, isAgent2 }: { saisie: Saisie; isAgent2: boolean }) {
  if (saisie.flagConsolide) return <Badge variant="neutral">Consolidé</Badge>;
  if (isAgent2) return <Badge variant="success">Contre-saisie</Badge>;
  if (!saisie.ifuAgent2) return <Badge variant="warning">En attente</Badge>;
  if (saisie.ifuAgent1 !== saisie.ifuAgent2) return <Badge variant="danger">Discordant</Badge>;
  return <Badge variant="success">Concordant</Badge>;
}

