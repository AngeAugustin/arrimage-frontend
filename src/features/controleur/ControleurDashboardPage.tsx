/**
 * @file    ControleurDashboardPage.tsx
 * @module  features/controleur
 */

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import {
  IconCheckCircle,
  IconChevronRight,
  IconClock,
  IconExclamationCircle,
} from '@/components/ui/icons';
import { useDiscordances } from '@/hooks/useDiscordances';
import { usePollingCountdown } from '@/hooks/usePollingCountdown';
import { useAuthStore } from '@/store/authStore';
import { formatDateShort, formatTodayLong } from '@/utils/formatDate';
import { POLLING_INTERVAL_MS } from '@/utils/constants';
import { extractApiErrorMessage } from '@/utils/apiError';
import { cn } from '@/utils/cn';
import type { UserSummary } from '@/types/saisie';

const PAGE_SIZE = 5;

interface DashboardStatCardProps {
  label: string;
  value: number;
  hint: string;
  hintClassName?: string;
  valueClassName?: string;
  icon: React.ReactNode;
  iconClassName?: string;
}

function DashboardStatCard({
  label,
  value,
  hint,
  hintClassName,
  valueClassName,
  icon,
  iconClassName,
}: DashboardStatCardProps) {
  return (
    <div className="relative rounded border border-cnss-border bg-white p-6 shadow-card">
      <div
        className={cn(
          'absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full',
          iconClassName,
        )}
      >
        {icon}
      </div>
      <p className="pr-12 text-[11px] font-bold uppercase leading-4 tracking-wider text-cnss-text-muted">
        {label}
      </p>
      <p className={cn('mt-3 text-3xl font-bold', valueClassName ?? 'text-cnss-blue')}>
        {value.toLocaleString('fr-FR', { minimumIntegerDigits: 2, useGrouping: true })}
      </p>
      <p className={cn('mt-1 text-sm', hintClassName ?? 'text-cnss-text-muted')}>{hint}</p>
    </div>
  );
}

function formatAgentLabel(agent: UserSummary): string {
  return `${agent.prenom} ${agent.nom}`;
}

export function ControleurDashboardPage() {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const {
    discordances,
    count,
    total,
    totalPages,
    summary,
    lastUpdated,
    isLoading,
    isFetching,
    error,
    refresh,
  } = useDiscordances({ page, limit: PAGE_SIZE });
  const secondsLeft = usePollingCountdown(POLLING_INTERVAL_MS, lastUpdated);

  const currentPage = Math.min(page, totalPages);
  const pageItems = discordances;

  const recentDelta = summary?.recentDelta ?? 0;
  const avgDelay = summary?.averageDelayMinutes ?? null;

  const discordanceHint =
    recentDelta > 0
      ? `+${recentDelta} depuis 1h`
      : recentDelta < 0
        ? `${recentDelta} depuis 1h`
        : 'Aucune nouvelle discordance depuis 1h';

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <Alert>{extractApiErrorMessage(error) || 'Impossible de charger les discordances.'}</Alert>;
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cnss-navy">
            Bonjour, {user?.prenom ?? 'Contrôleur'}
          </h1>
          <p className="mt-1 text-sm text-cnss-text-muted">
            Nous sommes le {formatTodayLong()}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-cnss-border bg-white px-4 py-2.5 text-sm text-cnss-text shadow-card">
            <span
              className={cn(
                'inline-block h-2 w-2 rounded-full',
                isFetching ? 'animate-pulse bg-cnss-error' : 'bg-cnss-error',
              )}
            />
            <span>
              Actualisation automatique toutes les {POLLING_INTERVAL_MS / 1000}s | Prochain
              rafraîchissement dans {secondsLeft}s
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-auto shrink-0 px-3 py-2.5"
            onClick={() => void refresh()}
            disabled={isFetching}
            aria-label="Actualiser les discordances maintenant"
          >
            <RefreshCw
              className={cn('h-4 w-4', isFetching && 'animate-spin')}
              strokeWidth={2}
            />
            Actualiser maintenant
          </Button>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <DashboardStatCard
          label="Discordances en cours"
          value={summary?.discordances ?? count}
          hint={discordanceHint}
          hintClassName={recentDelta > 0 ? 'text-cnss-error' : 'text-cnss-text-muted'}
          valueClassName="text-cnss-error"
          icon={<IconExclamationCircle className="h-5 w-5 text-cnss-error" />}
          iconClassName="bg-cnss-error-bg"
        />
        <DashboardStatCard
          label="Saisies concordantes"
          value={summary?.concordants ?? 0}
          hint={`Taux de validation : ${summary?.validationRate ?? 0}%`}
          hintClassName="text-cnss-success"
          valueClassName="text-cnss-success"
          icon={<IconCheckCircle className="h-5 w-5 text-cnss-success" />}
          iconClassName="bg-cnss-success-bg"
        />
        <DashboardStatCard
          label="En attente de contre-saisie"
          value={summary?.enAttenteContresaisie ?? 0}
          hint={avgDelay ? `Délai moyen : ${avgDelay} min` : 'En attente d\'Agent 2'}
          valueClassName="text-amber-600"
          icon={<IconClock className="h-5 w-5 text-amber-600" />}
          iconClassName="bg-amber-50"
        />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold text-cnss-blue">Contrôle des discordances</h2>
      </div>

      {count === 0 ? (
        <Alert variant="success">
          Aucune discordance détectée. Toutes les saisies sont cohérentes.
        </Alert>
      ) : (
        <div className="overflow-hidden rounded border border-cnss-border bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-cnss-border bg-cnss-input-bg">
                <tr>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
                    N° CNSS
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
                    Raison sociale
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
                    IFU Agent 1
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
                    Agent 1
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
                    Date saisie 1
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
                    IFU Agent 2
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
                    Agent 2
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
                    Date saisie 2
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cnss-border">
                {pageItems.map((d) => (
                  <tr key={d.id} className="bg-cnss-error-bg/10 transition-colors hover:bg-cnss-error-bg/20">
                    <td className="px-6 py-4 font-mono text-cnss-text">{d.numCnss}</td>
                    <td className="px-6 py-4 text-cnss-text">{d.raisonSociale}</td>
                    <td className="px-6 py-4 font-mono tracking-wider text-cnss-error line-through">
                      {d.ifuAgent1}
                    </td>
                    <td className="px-6 py-4 text-cnss-text">{formatAgentLabel(d.agent1)}</td>
                    <td className="px-6 py-4 text-cnss-text-muted">
                      {formatDateShort(d.dtSaisie1)}
                    </td>
                    <td className="px-6 py-4 font-mono tracking-wider text-cnss-error line-through">
                      {d.ifuAgent2}
                    </td>
                    <td className="px-6 py-4 text-cnss-text">{formatAgentLabel(d.agent2)}</td>
                    <td className="px-6 py-4 text-cnss-text-muted">
                      {formatDateShort(d.dtSaisie2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-cnss-border px-6 py-4">
            <p className="mb-4 text-xs italic text-cnss-text-muted">
              * Les lignes marquées en rouge indiquent une divergence stricte entre les deux saisies
              IFU. Procédure : Retourner les documents physiques à l&apos;agent concerné pour
              vérification et correction.
            </p>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-cnss-text-muted">
                {total === 0
                  ? '0 entrée'
                  : `${(currentPage - 1) * PAGE_SIZE + 1} - ${Math.min(currentPage * PAGE_SIZE, total)} sur ${total}`}
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded text-cnss-text-muted hover:bg-cnss-input-bg disabled:opacity-40"
                  aria-label="Page précédente"
                >
                  <IconChevronRight className="h-3 w-3 rotate-180" />
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded text-cnss-text-muted hover:bg-cnss-input-bg disabled:opacity-40"
                  aria-label="Page suivante"
                >
                  <IconChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
