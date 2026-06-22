/**
 * @file    ConsolidationPage.tsx
 * @module  features/admin
 */

import { Layers, TriangleAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { auditApi } from '@/api/auditApi';
import { consolidationApi } from '@/api/consolidationApi';
import { statsApi } from '@/api/statsApi';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { LinearProgress } from '@/components/ui/ProgressBar';
import { Spinner } from '@/components/ui/Spinner';
import { IconAlert } from '@/components/ui/icons';
import { useSimulatedProgress } from '@/hooks/useSimulatedProgress';
import { extractApiErrorMessage } from '@/utils/apiError';
import { formatDate } from '@/utils/formatDate';
import { Card } from '@/components/ui/Card';

function estimateSeconds(count: number): number {
  if (count === 0) return 8;
  return Math.max(8, Math.ceil(count / 700));
}

function formatEstimateLabel(count: number): string {
  if (count === 0) return '—';
  return `~ ${estimateSeconds(count)}s`;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function ConsolidationPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [exportReport, setExportReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, isError, error: previewError } = useQuery({
    queryKey: ['consolidation-preview'],
    queryFn: consolidationApi.preview,
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => statsApi.getStats(),
  });

  const { data: lastExport } = useQuery({
    queryKey: ['audit', 'last-export'],
    queryFn: () => auditApi.getList({ action: 'CONSOLIDATION', limit: 1, page: 1 }),
  });

  const eligibleCount = data?.count ?? 0;
  const estimatedSecs = estimateSeconds(eligibleCount);

  const exportMutation = useMutation({
    mutationFn: consolidationApi.export,
    onSuccess: async (result) => {
      completeProgress();
      await wait(500);
      setError(null);
      setExportReport(
        `${result.count} ligne(s) exportée(s) — fichier ${result.filename} téléchargé.`,
      );

      queryClient.setQueryData(['consolidation-preview'], { count: 0, duplicateCount: 0 });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['consolidation-preview'] }),
        queryClient.invalidateQueries({ queryKey: ['stats'] }),
        queryClient.invalidateQueries({ queryKey: ['audit', 'last-export'] }),
      ]);
    },
    onError: (err) => {
      setExportReport(null);
      setError(err instanceof Error ? err.message : extractApiErrorMessage(err));
    },
  });

  const [progress, completeProgress] = useSimulatedProgress(
    exportMutation.isPending,
    estimatedSecs,
  );

  const concordanceRate = useMemo(() => {
    if (!stats) return null;
    const { restants, discordants } = stats.summary;
    const total = restants + discordants;
    if (total === 0) return null;
    return ((restants / total) * 100).toFixed(1);
  }, [stats]);

  const lastConsolidation = lastExport?.items[0]?.timestamp;
  const isConsolidating = exportMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cnss-blue">Consolidation des données</h1>
          <p className="mt-1 text-sm text-cnss-text">
            Fusionnez les dossiers IFU concordants issus des différents agents de saisie.
          </p>
        </div>
        {lastConsolidation && (
          <p className="text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
            Dernière consolidation : {formatDate(lastConsolidation)}
          </p>
        )}
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-lg bg-cnss-error-bg px-5 py-4 text-cnss-error-text">
        <IconAlert className="mt-0.5 h-5 w-5 shrink-0 text-cnss-error" />
        <p className="text-sm font-medium">
          Ce traitement empêche toute modification ultérieure des données consolidées.
        </p>
      </div>

      <Card className="mb-6 text-center">
        <p className="text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
          Dossiers en attente
        </p>
        <p className="mt-4 text-6xl font-bold text-cnss-blue">{data?.count ?? 0}</p>
        <p className="mt-2 text-lg font-medium text-cnss-primary">
          IFU éligibles à la consolidation
        </p>

        <div className="mt-10 grid gap-6 border-t border-cnss-border pt-8 sm:grid-cols-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
              Pourcentage concordance
            </p>
            <p className="mt-2 text-2xl font-bold text-teal-700">
              {concordanceRate !== null ? `${concordanceRate}%` : '—'}
            </p>
          </div>
          <div className="border-x border-cnss-border">
            <p className="text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
              Doublons détectés
            </p>
            <p className="mt-2 text-2xl font-bold text-amber-700">{data?.duplicateCount ?? 0}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
              Estimation temps
            </p>
            <p className="mt-2 text-2xl font-bold text-cnss-text-muted">
              {formatEstimateLabel(data?.count ?? 0)}
            </p>
          </div>
        </div>
      </Card>

      {isError && (
        <Alert className="mb-4">
          {previewError instanceof Error
            ? previewError.message
            : extractApiErrorMessage(previewError)}
        </Alert>
      )}
      {error && <Alert className="mb-4">{error}</Alert>}
      {exportReport && <Alert variant="success" className="mb-4">{exportReport}</Alert>}

      {isConsolidating && (
        <div className="mb-4 rounded-lg border border-cnss-border bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-cnss-text">Consolidation en cours…</p>
            <p className="text-sm font-bold text-cnss-primary">{Math.round(progress)}%</p>
          </div>
          <LinearProgress value={progress} className="h-4" />
          <p className="mt-2 text-xs text-cnss-text-muted">
            Génération du fichier XLSX — cette opération peut prendre plusieurs minutes.
          </p>
        </div>
      )}

      <Button
        className="h-12 w-full text-base"
        onClick={() => setConfirmOpen(true)}
        isLoading={isFetching && !isConsolidating}
        disabled={eligibleCount === 0 || isConsolidating}
      >
        <Layers className="h-5 w-5" strokeWidth={2} />
        {isConsolidating
          ? 'Consolidation en cours…'
          : 'Lancer la consolidation et générer le fichier xlsx'}
      </Button>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Attention — Opération irréversible"
        className="max-w-xl !border-amber-300 !bg-cnss-error-bg [&_h2]:!text-cnss-error-text [&_button[aria-label='Fermer']]:text-cnss-error-text"
      >
        <div className="flex items-start gap-3">
          <TriangleAlert className="mt-0.5 h-6 w-6 shrink-0 text-cnss-error" strokeWidth={2} />
          <p className="text-sm font-medium text-cnss-error-text">
            Ce traitement empêche toute modification ultérieure des données consolidées.
          </p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
            Annuler
          </Button>
          <Button
            type="button"
            onClick={() => {
              setConfirmOpen(false);
              exportMutation.mutate();
            }}
          >
            Continuer
          </Button>
        </div>
      </Modal>
    </div>
  );
}
