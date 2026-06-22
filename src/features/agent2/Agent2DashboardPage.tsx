/**
 * @file    Agent2DashboardPage.tsx
 * @module  features/agent2
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { saisieApi } from '@/api/saisieApi';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import {
  IconChevronRight,
  IconLock,
  IconClock,
  IconPencil,
  IconPlus,
  IconSearch,
  IconStack,
  IconToday,
} from '@/components/ui/icons';
import { CorrectionForm, type CorrectionFormContext } from '@/features/shared/CorrectionForm';
import { useAuthStore } from '@/store/authStore';
import { formatDateShort, formatTodayLong, formatYesterdayLong } from '@/utils/formatDate';
import { cn } from '@/utils/cn';
import type { Saisie } from '@/types/saisie';

const PAGE_SIZE = 5;

type FilterStatus = 'all' | 'attente' | 'concordant' | 'discordant' | 'consolide';

type ModalType = 'correction' | null;

function getSaisieStatus(saisie: Saisie): FilterStatus {
  if (saisie.flagConsolide) return 'consolide';
  if (!saisie.ifuAgent2) return 'attente';
  if (saisie.ifuAgent1 !== saisie.ifuAgent2) return 'discordant';
  return 'concordant';
}

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
      <p className={cn('mt-3 text-3xl font-bold text-cnss-blue', valueClassName)}>
        {value.toLocaleString('fr-FR', { minimumIntegerDigits: 2, useGrouping: true })}
      </p>
      <p className={cn('mt-1 text-sm', hintClassName ?? 'text-cnss-text-muted')}>{hint}</p>
    </div>
  );
}

export function Agent2DashboardPage() {
  const { user } = useAuthStore();
  const [modal, setModal] = useState<ModalType>(null);
  const [correctionContext, setCorrectionContext] = useState<CorrectionFormContext | null>(null);
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('');
  const [page, setPage] = useState(1);

  const { data: statsData } = useQuery({
    queryKey: ['mes-saisies', 'stats'],
    queryFn: () => saisieApi.getMesSaisies({ page: 1, limit: 1 }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['mes-saisies', 'list', page, search, period],
    queryFn: () =>
      saisieApi.getMesSaisies({
        page,
        limit: PAGE_SIZE,
        search: search.trim() || undefined,
        period: period || undefined,
      }),
  });

  const stats = statsData?.stats ?? { today: 0, yesterday: 0, todayDelta: 0, monthTotal: 0 };
  const pageItems = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const currentPage = Math.min(page, totalPages);

  const resetFilters = () => {
    setSearch('');
    setPeriod('');
    setPage(1);
  };

  const handleSuccess = () => {
    setModal(null);
    setCorrectionContext(null);
  };

  const openCorrection = (saisie: Saisie) => {
    setCorrectionContext({
      numCnss: saisie.numCnss,
      raisonSociale: saisie.raisonSociale,
      ifuActuel: saisie.ifuAgent2 ?? '',
    });
    setModal('correction');
  };

  const todayDeltaLabel =
    stats.todayDelta > 0
      ? `+${stats.todayDelta} depuis hier`
      : stats.todayDelta < 0
        ? `${stats.todayDelta} depuis hier`
        : 'Aucune variation depuis hier';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cnss-navy">
          Bonjour, {user?.prenom ?? 'Agent'}
        </h1>
        <p className="mt-1 text-sm text-cnss-text-muted">
          Aujourd&apos;hui, nous sommes le {formatTodayLong()}
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <DashboardStatCard
          label="Contre-saisies aujourd'hui"
          value={stats.today}
          hint={todayDeltaLabel}
          hintClassName={stats.todayDelta > 0 ? 'text-cnss-success' : 'text-cnss-text-muted'}
          icon={<IconToday className="h-5 w-5 text-cnss-blue" />}
          iconClassName="bg-cnss-active-nav"
        />
        <DashboardStatCard
          label="Contre-saisies hier"
          value={stats.yesterday}
          hint={formatYesterdayLong()}
          icon={<IconClock className="h-5 w-5 text-cnss-blue" />}
          iconClassName="bg-cnss-active-nav"
        />
        <DashboardStatCard
          label="Total de mes contre-saisies"
          value={stats.monthTotal}
          hint="ce mois"
          icon={<IconStack className="h-5 w-5 text-cnss-blue" />}
          iconClassName="bg-cnss-active-nav"
        />
      </div>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-cnss-blue">Mes contre-saisies</h2>
          <p className="mt-1 text-sm text-cnss-text-muted">
            Gérez et suivez l&apos;état de vos appariements IFU.
          </p>
        </div>
        <Link to="/agent2/contresaisie">
          <Button>
            <IconPlus className="h-4 w-4" />
            Nouvelle contre-saisie
          </Button>
        </Link>
      </div>

      <div className="mb-4 rounded border border-cnss-border bg-white p-4 shadow-card">
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr_auto] lg:items-end">
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
              Recherche
            </label>
            <div className="relative">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cnss-icon" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="N° CNSS or Raison Sociale..."
                className="h-10 w-full rounded border border-cnss-border bg-cnss-input-bg pl-10 pr-4 text-sm text-cnss-text placeholder:text-cnss-placeholder focus:border-cnss-primary focus:outline-none focus:ring-2 focus:ring-cnss-primary/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
              Période
            </label>
            <input
              type="date"
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded border border-cnss-border bg-cnss-input-bg px-3 text-sm text-cnss-text focus:border-cnss-primary focus:outline-none focus:ring-2 focus:ring-cnss-primary/20"
            />
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="h-10 text-sm font-medium text-cnss-blue hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
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
                    IFU saisi
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
                    Date de contre-saisie
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cnss-border">
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-cnss-text-muted">
                      Aucune contre-saisie trouvée.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((saisie) => {
                    const isDiscordant = getSaisieStatus(saisie) === 'discordant';
                    const isConsolide = saisie.flagConsolide;

                    return (
                      <tr key={saisie.id} className="transition-colors hover:bg-cnss-input-bg/50">
                        <td className="px-6 py-4 font-mono text-cnss-text">{saisie.numCnss}</td>
                        <td className="px-6 py-4 text-cnss-text">{saisie.raisonSociale}</td>
                        <td className="px-6 py-4 font-mono tracking-wider text-cnss-text">
                          {saisie.ifuAgent2 ?? '—'}
                        </td>
                        <td className="px-6 py-4 text-cnss-text-muted">
                          {saisie.dtSaisie2 ? formatDateShort(saisie.dtSaisie2) : '—'}
                        </td>
                        <td className="px-6 py-4">
                          {isConsolide ? (
                            <span className="inline-flex text-cnss-icon" title="Saisie consolidée">
                              <IconLock className="h-5 w-5" />
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openCorrection(saisie)}
                              className={cn(
                                'inline-flex transition-colors',
                                isDiscordant
                                  ? 'text-amber-600 hover:text-amber-700'
                                  : 'text-cnss-icon hover:text-cnss-blue',
                              )}
                              title="Corriger l'IFU"
                            >
                              <IconPencil className="h-5 w-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-cnss-border px-6 py-4">
            <p className="text-sm text-cnss-text-muted">
              Affichage de {total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} à{' '}
              {Math.min(currentPage * PAGE_SIZE, total)} sur {total} entrées
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
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={cn(
                    'flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm',
                    p === currentPage
                      ? 'bg-cnss-primary font-bold text-white'
                      : 'text-cnss-text hover:bg-cnss-input-bg',
                  )}
                >
                  {p}
                </button>
              ))}
              {totalPages > 5 && (
                <>
                  <span className="px-1 text-cnss-text-muted">…</span>
                  <button
                    type="button"
                    onClick={() => setPage(totalPages)}
                    className={cn(
                      'flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm',
                      currentPage === totalPages
                        ? 'bg-cnss-primary font-bold text-white'
                        : 'text-cnss-text hover:bg-cnss-input-bg',
                    )}
                  >
                    {totalPages}
                  </button>
                </>
              )}
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
      )}

      <Modal
        open={modal === 'correction'}
        onClose={() => {
          setModal(null);
          setCorrectionContext(null);
        }}
        title="Correction IFU"
      >
        {correctionContext && (
          <CorrectionForm key={correctionContext.numCnss} context={correctionContext} onSuccess={handleSuccess} />
        )}
      </Modal>
    </div>
  );
}
