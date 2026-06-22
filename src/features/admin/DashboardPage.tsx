/**
 * @file    DashboardPage.tsx
 * @module  features/admin
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { auditApi } from '@/api/auditApi';
import { consolidationApi } from '@/api/consolidationApi';
import { statsApi } from '@/api/statsApi';
import { utilisateursApi } from '@/api/utilisateursApi';
import { ProgressBar, getProgressPercentages } from '@/components/ui/ProgressBar';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import {
  IconExclamationCircle,
  IconLock,
  IconStack,
  IconUser,
  IconDownload,
} from '@/components/ui/icons';
import { KpiCard, getMonthDateRange, parseExportCount } from '@/features/admin/adminShared';
import { formatDateShort } from '@/utils/formatDate';
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from '@/components/ui/DataTable';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

export function DashboardPage() {
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const downloadMutation = useMutation({
    mutationFn: (auditLogId: number) => consolidationApi.downloadExport(auditLogId),
    onSuccess: () => setDownloadError(null),
    onError: (err) => {
      setDownloadError(err instanceof Error ? err.message : 'Impossible de télécharger le fichier d\'export.');
    },
  });

  const monthRange = getMonthDateRange();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => statsApi.getStats(),
  });

  const { data: monthStats } = useQuery({
    queryKey: ['stats', 'month', monthRange],
    queryFn: () => statsApi.getStats(monthRange),
  });

  const { data: users } = useQuery({
    queryKey: ['utilisateurs', 'options'],
    queryFn: utilisateursApi.getOptions,
  });

  const { data: exports, isLoading: exportsLoading } = useQuery({
    queryKey: ['audit', 'exports'],
    queryFn: () => auditApi.getList({ action: 'CONSOLIDATION', limit: 5, page: 1 }),
  });

  if (statsLoading || !stats) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const { summary } = stats;
  const agents = users?.filter((u) => u.role === 'agent1' || u.role === 'agent2') ?? [];
  const activeAgents = agents.filter((u) => u.isActive).length;
  const authorizedAgents = agents.length;

  const progressSegments = [
    { label: 'Consolidés', value: summary.consolides, colorClass: 'bg-cnss-blue' },
    { label: 'En cours', value: summary.restants, colorClass: 'bg-sky-300' },
    { label: 'Discordances', value: summary.discordants, colorClass: 'bg-cnss-error' },
  ];
  const progressPercentages = getProgressPercentages(progressSegments);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cnss-blue">Tableau de bord de pilotage</h1>
        <p className="mt-1 text-sm text-cnss-text">
          Suivi opérationnel du processus d&apos;arrimage des IFU
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="IFU concordants non consolidés"
          value={summary.restants}
          hint="Prêts à être consolidés"
          hintClassName="text-cnss-success"
          icon={<IconStack className="h-5 w-5 text-cnss-success" />}
          iconClassName="bg-cnss-success-bg"
        />
        <KpiCard
          label="IFU consolidés ce mois"
          value={monthStats?.summary.consolides ?? 0}
          hint="Mois en cours"
          icon={<IconLock className="h-5 w-5 text-cnss-blue" />}
          iconClassName="bg-cnss-active-nav"
        />
        <KpiCard
          label="Discordances actives"
          value={summary.discordants}
          hint="Action requise immédiate"
          hintClassName="text-cnss-error"
          valueClassName="text-cnss-error"
          icon={<IconExclamationCircle className="h-5 w-5 text-cnss-error" />}
          iconClassName="bg-cnss-error-bg"
        />
        <KpiCard
          label="Agents actifs"
          value={activeAgents}
          hint={`Sur ${authorizedAgents} agents autorisés`}
          icon={<IconUser className="h-5 w-5 text-cnss-blue" />}
          iconClassName="bg-cnss-active-nav"
        />
      </div>

      <Card className="mb-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-cnss-navy">
            Avancement global de l&apos;arrimage
          </h2>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-cnss-text">
            {progressSegments.map((segment, index) => (
              <span key={segment.label} className="inline-flex items-center gap-2">
                <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', segment.colorClass)} />
                {segment.label}: {progressPercentages[index]}%
              </span>
            ))}
          </div>
        </div>

        <ProgressBar segments={progressSegments} />

        <div className="mt-8 grid grid-cols-1 divide-y divide-cnss-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="py-4 text-center sm:py-0">
            <p className="text-3xl font-bold text-cnss-blue">
              {summary.consolides.toLocaleString('fr-FR')}
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
              Consolidés
            </p>
          </div>
          <div className="py-4 text-center sm:py-0">
            <p className="text-3xl font-bold text-cnss-blue">
              {summary.restants.toLocaleString('fr-FR')}
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
              En cours
            </p>
          </div>
          <div className="py-4 text-center sm:py-0">
            <p className="text-3xl font-bold text-cnss-error">
              {summary.discordants.toLocaleString('fr-FR')}
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
              Discordances
            </p>
          </div>
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cnss-border px-6 py-4">
          <h2 className="text-lg font-bold text-cnss-blue">Derniers exports générés</h2>
          <Link
            to="/admin/consolidation"
            className="text-sm font-bold text-cnss-primary hover:underline"
          >
            Gérer les exports
          </Link>
        </div>
        {downloadError && (
          <Alert className="mx-6 mt-4">{downloadError}</Alert>
        )}
        <DataTable className="border-0 shadow-none">
          <DataTableHead>
            <tr>
              <DataTableHeaderCell>Date</DataTableHeaderCell>
              <DataTableHeaderCell>Nb IFU</DataTableHeaderCell>
              <DataTableHeaderCell>Exporté par</DataTableHeaderCell>
              <DataTableHeaderCell>Statut</DataTableHeaderCell>
              <DataTableHeaderCell className="text-center">Fichier</DataTableHeaderCell>
            </tr>
          </DataTableHead>
          <DataTableBody>
            {exportsLoading ? (
              <DataTableRow>
                <DataTableCell colSpan={5} className="py-10 text-center">
                  <Spinner />
                </DataTableCell>
              </DataTableRow>
            ) : (
              <>
                {exports?.items.map((entry) => {
                  const count = parseExportCount(entry);
                  const exporter = entry.user
                    ? `${entry.user.prenom} ${entry.user.nom}`
                    : '—';
                  return (
                    <DataTableRow key={entry.id}>
                      <DataTableCell>{formatDateShort(entry.timestamp)}</DataTableCell>
                      <DataTableCell className="font-bold">
                        {count.toLocaleString('fr-FR')}
                      </DataTableCell>
                      <DataTableCell>{exporter}</DataTableCell>
                      <DataTableCell>
                        <Badge variant={count > 0 ? 'success' : 'warning'}>
                          {count > 0 ? 'Prêt' : 'Partiel'}
                        </Badge>
                      </DataTableCell>
                      <DataTableCell className="text-center">
                        <button
                          type="button"
                          onClick={() => downloadMutation.mutate(entry.id)}
                          disabled={count === 0 || downloadMutation.isPending}
                          className="inline-flex rounded p-1 text-cnss-primary hover:bg-cnss-active-nav disabled:cursor-not-allowed disabled:opacity-40"
                          title="Télécharger le fichier XLSX"
                        >
                          {downloadMutation.isPending && downloadMutation.variables === entry.id ? (
                            <Spinner size="sm" className="h-5 w-5" />
                          ) : (
                            <IconDownload className="h-5 w-5" />
                          )}
                        </button>
                      </DataTableCell>
                    </DataTableRow>
                  );
                })}
                {(exports?.items.length ?? 0) === 0 && (
                  <DataTableRow>
                    <DataTableCell colSpan={5} className="py-10 text-center text-cnss-text-muted">
                      Aucun export enregistré pour le moment.
                    </DataTableCell>
                  </DataTableRow>
                )}
              </>
            )}
          </DataTableBody>
        </DataTable>
      </Card>
    </div>
  );
}
