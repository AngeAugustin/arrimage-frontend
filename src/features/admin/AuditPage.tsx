/**
 * @file    AuditPage.tsx
 * @module  features/admin
 */

import { Eye, FunnelX } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { auditApi } from '@/api/auditApi';
import { utilisateursApi } from '@/api/utilisateursApi';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import {
  IconChart,
  IconCheckCircle,
  IconDownload,
  IconFileExport,
  IconFilter,
  IconLogin,
  IconShieldExclamation,
  IconXCircle,
} from '@/components/ui/icons';
import {
  ActionBadge,
  KpiCard,
  RoleBadge,
  TablePagination,
  isAuditFailure,
  parseExportCount,
} from '@/features/admin/adminShared';
import { formatAuditTimestamp, formatRelativeLogin } from '@/utils/formatDate';
import { formatAuditEntiteCible, getAuditUsername } from '@/utils/formatAuditLog';
import { extractApiErrorMessage } from '@/utils/apiError';
import { cn } from '@/utils/cn';
import type { AuditFilters } from '@/types/admin';
import type { UserRole } from '@/types/auth';
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from '@/components/ui/DataTable';
import { Card } from '@/components/ui/Card';
import { AuditLogDetailDrawer } from '@/features/admin/AuditLogDetailDrawer';
import type { AuditEntry } from '@/types/admin';

const ACTIONS = [
  'LOGIN',
  'LOGIN_REFUSEE',
  'ACCOUNT_DISABLED',
  'ACCOUNT_ENABLED',
  'RESET_PASSWORD',
  'CHANGE_PASSWORD',
  'CHANGE_PASSWORD_REFUSEE',
  'SAISIE',
  'SAISIE_REFUSEE',
  'CONTRESAISIE',
  'CONTRESAISIE_REFUSEE',
  'CORRECTION',
  'CONSOLIDATION',
  'CREATE_USER',
  'UPDATE_USER',
];
const PAGE_SIZE = 8;
const DEFAULT_FILTERS: AuditFilters = { page: 1, limit: PAGE_SIZE };

const tableActionBtn =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors';

const tableActionIcon = 'h-6 w-6 shrink-0';

function getUserRole(
  userId: number | undefined,
  users: Array<{ id: number; role: UserRole }> | undefined,
): UserRole | null {
  if (!userId || !users) return null;
  return users.find((u) => u.id === userId)?.role ?? null;
}

export function AuditPage() {
  const [filters, setFilters] = useState<AuditFilters>(DEFAULT_FILTERS);
  const [draft, setDraft] = useState<AuditFilters>(DEFAULT_FILTERS);
  const [successOnly, setSuccessOnly] = useState(false);
  const [failureOnly, setFailureOnly] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportMutation = useMutation({
    mutationFn: () => auditApi.exportXlsx(filters),
    onSuccess: (result) => {
      setExportError(null);
      setExportMessage(
        `${result.count} entrée(s) exportée(s) — fichier ${result.filename} téléchargé.`,
      );
    },
    onError: (err) => {
      setExportMessage(null);
      setExportError(err instanceof Error ? err.message : 'Impossible d\'exporter le journal d\'audit.');
    },
  });

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['audit', filters],
    queryFn: () => auditApi.getList(filters),
  });

  const { data: summaryData } = useQuery({
    queryKey: ['audit', 'summary'],
    queryFn: () => auditApi.getList({ page: 1, limit: 1 }),
  });

  const { data: exportData } = useQuery({
    queryKey: ['audit', 'last-export-kpi'],
    queryFn: () => auditApi.getList({ action: 'CONSOLIDATION', page: 1, limit: 1 }),
  });

  const { data: users } = useQuery({
    queryKey: ['utilisateurs'],
    queryFn: utilisateursApi.getOptions,
  });

  const activeLogins = useMemo(() => {
    if (!users) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return users.filter((u) => u.dtLastLogin && new Date(u.dtLastLogin) >= today).length;
  }, [users]);

  const anomalies = useMemo(() => {
    return data?.items.filter(isAuditFailure).length ?? 0;
  }, [data?.items]);

  const lastExport = exportData?.items[0];
  const lastExportLabel = lastExport
    ? `Export du ${formatRelativeLogin(lastExport.timestamp)}`
  : 'Aucun export récent';

  const applyFilters = () => {
    setFilters({ ...draft, page: 1, limit: PAGE_SIZE });
  };

  const resetFilters = () => {
    setDraft(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setSuccessOnly(false);
    setFailureOnly(false);
    setExportMessage(null);
    setExportError(null);
  };

  const filteredItems = useMemo(() => {
    if (!data?.items) return [];
    return data.items.filter((entry) => {
      const failed = isAuditFailure(entry);
      if (successOnly && !failureOnly && failed) return false;
      if (failureOnly && !successOnly && !failed) return false;
      return true;
    });
  }, [data?.items, successOnly, failureOnly]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cnss-blue">Journal d&apos;audit</h1>
        <p className="mt-1 text-sm text-cnss-text">
          Traçabilité complète des actions effectuées sur la plateforme.
        </p>
      </div>

      <Card className="mb-6">
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
              Utilisateur
            </label>
            <select
              className="h-10 rounded border border-cnss-border bg-cnss-input-bg px-3 text-sm"
              value={draft.userId ?? ''}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  userId: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            >
              <option value="">Tous les utilisateurs</option>
              {users?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.prenom} {u.nom}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Date début"
            type="date"
            uppercaseLabel
            value={draft.dateFrom ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, dateFrom: e.target.value || undefined }))}
          />
          <Input
            label="Date fin"
            type="date"
            uppercaseLabel
            value={draft.dateTo ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, dateTo: e.target.value || undefined }))}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
              Type d&apos;action
            </label>
            <select
              className="h-10 rounded border border-cnss-border bg-cnss-input-bg px-3 text-sm"
              value={draft.action ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, action: e.target.value || undefined }))}
            >
              <option value="">Toutes les actions</option>
              {ACTIONS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-cnss-border pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
              Résultat
            </span>
            <button
              type="button"
              onClick={() => {
                setSuccessOnly(false);
                setFailureOnly(false);
              }}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm',
                !successOnly && !failureOnly
                  ? 'border-cnss-blue bg-cnss-active-nav text-cnss-blue'
                  : 'border-cnss-border text-cnss-text',
              )}
            >
              Tous
            </button>
            <button
              type="button"
              onClick={() => {
                setSuccessOnly(true);
                setFailureOnly(false);
              }}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm',
                successOnly && !failureOnly
                  ? 'border-cnss-blue bg-cnss-active-nav text-cnss-blue'
                  : 'border-cnss-border text-cnss-text',
              )}
            >
              <IconCheckCircle className="h-4 w-4" />
              Succès
            </button>
            <button
              type="button"
              onClick={() => {
                setSuccessOnly(false);
                setFailureOnly(true);
              }}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm',
                failureOnly && !successOnly
                  ? 'border-cnss-error bg-cnss-error-bg text-cnss-error'
                  : 'border-cnss-border text-cnss-text',
              )}
            >
              <IconXCircle className="h-4 w-4" />
              Échec
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" onClick={applyFilters}>
              <IconFilter className="h-4 w-4" />
              Appliquer les filtres
            </Button>
            <Button variant="ghost" onClick={resetFilters}>
              <FunnelX className="h-4 w-4" strokeWidth={2} />
              Réinitialiser les filtres
            </Button>
            <Button
              variant="secondary"
              disabled={exportMutation.isPending}
              onClick={() => exportMutation.mutate()}
            >
              <IconDownload className="h-4 w-4" />
              {exportMutation.isPending ? 'Export en cours…' : 'Exporter XLSX'}
            </Button>
          </div>
        </div>
      </Card>

      {exportError && (
        <Alert variant="error" className="mb-6">
          {exportError}
        </Alert>
      )}

      {exportMessage && (
        <Alert variant="success" className="mb-6">
          {exportMessage}
        </Alert>
      )}

      {isError && (
        <Alert className="mb-6">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <span>
              Impossible de charger le journal d&apos;audit :{' '}
              {extractApiErrorMessage(error)}
            </span>
            <Button variant="ghost" onClick={() => refetch()} disabled={isFetching}>
              Réessayer
            </Button>
          </div>
        </Alert>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total actions"
          value={summaryData?.total ?? 0}
          hint="Toutes périodes"
          icon={<IconChart className="h-7 w-7 shrink-0 text-cnss-blue" />}
          iconClassName="bg-cnss-active-nav"
          iconContainerClassName="h-12 w-12"
        />
        <KpiCard
          label="Connexions actives"
          value={activeLogins}
          hint="Utilisateurs connectés aujourd'hui"
          icon={<IconLogin className="h-7 w-7 shrink-0 text-cnss-blue" />}
          iconClassName="bg-cnss-active-nav"
          iconContainerClassName="h-12 w-12"
        />
        <KpiCard
          label="Anomalies détectées"
          value={anomalies}
          hint="Nécessite attention"
          hintClassName="text-cnss-error"
          valueClassName="text-cnss-error"
          icon={<IconShieldExclamation className="h-7 w-7 shrink-0 text-cnss-error" />}
          iconClassName="bg-cnss-error-bg"
          iconContainerClassName="h-12 w-12"
        />
        <KpiCard
          label="Dernier export"
          value={lastExport ? `${parseExportCount(lastExport)} IFU` : '—'}
          hint={lastExportLabel}
          icon={<IconFileExport className="h-7 w-7 shrink-0 text-cnss-success" />}
          iconClassName="bg-cnss-success-bg"
          iconContainerClassName="h-12 w-12"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <DataTable className="border-0 shadow-none">
            <DataTableHead>
              <tr>
                <DataTableHeaderCell>Date & Heure</DataTableHeaderCell>
                <DataTableHeaderCell>Utilisateur</DataTableHeaderCell>
                <DataTableHeaderCell>Rôle</DataTableHeaderCell>
                <DataTableHeaderCell>Action</DataTableHeaderCell>
                <DataTableHeaderCell>Entité cible</DataTableHeaderCell>
                <DataTableHeaderCell className="text-center">Résultat</DataTableHeaderCell>
                <DataTableHeaderCell className="text-right">Actions</DataTableHeaderCell>
              </tr>
            </DataTableHead>
            <DataTableBody>
              {filteredItems.map((entry) => {
                const failed = isAuditFailure(entry);
                const role = getUserRole(entry.user?.id, users);
                return (
                  <DataTableRow
                    key={entry.id}
                    className={cn(failed && 'bg-cnss-error-bg/40')}
                  >
                    <DataTableCell className="whitespace-nowrap font-mono text-xs text-cnss-text-muted">
                      {formatAuditTimestamp(entry.timestamp)}
                    </DataTableCell>
                    <DataTableCell className="text-sm">
                      {getAuditUsername(entry)}
                    </DataTableCell>
                    <DataTableCell>
                      {role ? <RoleBadge role={role} /> : <span className="text-xs">SYS</span>}
                    </DataTableCell>
                    <DataTableCell>
                      <ActionBadge action={entry.action} />
                    </DataTableCell>
                    <DataTableCell className="max-w-[200px] truncate text-sm text-cnss-text-muted">
                      {formatAuditEntiteCible(entry.entiteCible)}
                    </DataTableCell>
                    <DataTableCell className="text-center">
                      {failed ? (
                        <IconXCircle className="mx-auto h-5 w-5 text-cnss-error" />
                      ) : (
                        <IconCheckCircle className="mx-auto h-5 w-5 text-cnss-success" />
                      )}
                    </DataTableCell>
                    <DataTableCell className="text-right">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          title="Voir les détails"
                          onClick={() => setSelectedEntry(entry)}
                          className={cn(
                            tableActionBtn,
                            'text-cnss-blue hover:bg-cnss-input-bg',
                          )}
                        >
                          <Eye className={tableActionIcon} strokeWidth={2} />
                        </button>
                      </div>
                    </DataTableCell>
                  </DataTableRow>
                );
              })}
              {filteredItems.length === 0 && !isError && (
                <DataTableRow>
                  <DataTableCell colSpan={7} className="py-10 text-center text-cnss-text-muted">
                    {data?.items.length && (successOnly || failureOnly)
                      ? 'Aucune entrée ne correspond au filtre Résultat sur cette page. Essayez « Tous » ou « Échec » pour voir les tentatives refusées.'
                      : 'Aucune entrée trouvée.'}
                  </DataTableCell>
                </DataTableRow>
              )}
            </DataTableBody>
          </DataTable>

          {data && (
            <TablePagination
              page={filters.page ?? 1}
              pageSize={PAGE_SIZE}
              total={data.total}
              onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
              label="entrées"
            />
          )}
        </Card>
      )}

      <AuditLogDetailDrawer
        open={selectedEntry !== null}
        entry={selectedEntry}
        role={getUserRole(selectedEntry?.user?.id, users)}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
}
