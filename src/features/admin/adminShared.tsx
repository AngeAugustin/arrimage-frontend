/**
 * @file    adminShared.tsx
 * @module  features/admin
 */

import { IconChevronRight } from '@/components/ui/icons';
import { cn } from '@/utils/cn';
import type { UserRole } from '@/types/auth';
import type { AuditEntry } from '@/types/admin';

export interface KpiCardProps {
  label: string;
  value: number | string;
  hint?: string;
  hintClassName?: string;
  valueClassName?: string;
  icon: React.ReactNode;
  iconClassName?: string;
  iconContainerClassName?: string;
}

export function KpiCard({
  label,
  value,
  hint,
  hintClassName,
  valueClassName,
  icon,
  iconClassName,
  iconContainerClassName = 'h-10 w-10',
}: KpiCardProps) {
  const displayValue =
    typeof value === 'number'
      ? value.toLocaleString('fr-FR', { useGrouping: true })
      : value;

  return (
    <div className="relative rounded border border-cnss-border bg-white p-6 shadow-card">
      <div
        className={cn(
          'absolute right-5 top-5 flex items-center justify-center rounded-full',
          iconContainerClassName,
          iconClassName,
        )}
      >
        {icon}
      </div>
      <p className="pr-16 text-[11px] font-bold uppercase leading-4 tracking-wider text-cnss-text-muted">
        {label}
      </p>
      <p className={cn('mt-3 text-3xl font-bold', valueClassName ?? 'text-cnss-blue')}>
        {displayValue}
      </p>
      {hint && <p className={cn('mt-1 text-sm', hintClassName ?? 'text-cnss-text-muted')}>{hint}</p>}
    </div>
  );
}

const ROLE_BADGE_STYLES: Record<UserRole, string> = {
  admin: 'bg-cnss-blue text-white',
  controleur: 'bg-cnss-success-bg text-cnss-success',
  agent2: 'bg-cnss-active-nav text-cnss-blue',
  agent1: 'bg-sky-100 text-sky-800',
};

const ROLE_BADGE_LABELS: Record<UserRole, string> = {
  admin: 'ADMIN',
  controleur: 'CONTRÔLEUR',
  agent2: 'AGENT 2',
  agent1: 'AGENT 1',
};

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={cn(
        'inline-flex rounded px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide',
        ROLE_BADGE_STYLES[role],
      )}
    >
      {ROLE_BADGE_LABELS[role]}
    </span>
  );
}

const ACTION_BADGE_STYLES: Record<string, string> = {
  LOGIN: 'border border-cnss-blue text-cnss-blue bg-white',
  LOGIN_REFUSEE: 'bg-red-50 text-red-700',
  ACCOUNT_DISABLED: 'bg-red-100 text-red-800',
  ACCOUNT_ENABLED: 'bg-cnss-success-bg text-cnss-success',
  RESET_PASSWORD: 'bg-amber-100 text-amber-900',
  CHANGE_PASSWORD: 'bg-emerald-50 text-emerald-800',
  CHANGE_PASSWORD_REFUSEE: 'bg-red-50 text-red-700',
  SAISIE: 'bg-pink-50 text-pink-700',
  SAISIE_REFUSEE: 'bg-red-50 text-red-700',
  CONTRESAISIE: 'bg-cnss-active-nav text-cnss-blue',
  CONTRESAISIE_REFUSEE: 'bg-red-50 text-red-700',
  CORRECTION: 'bg-amber-50 text-amber-800',
  CONSOLIDATION: 'bg-cnss-success-bg text-cnss-success',
  CREATE_USER: 'bg-cnss-navy text-white',
  UPDATE_USER: 'bg-cnss-input-bg text-cnss-text',
};

export function ActionBadge({ action }: { action: string }) {
  return (
    <span
      className={cn(
        'inline-flex rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide',
        ACTION_BADGE_STYLES[action] ?? 'bg-cnss-input-bg text-cnss-text',
      )}
    >
      {action}
    </span>
  );
}

interface TablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  label?: string;
}

export function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  label = 'entrées',
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-cnss-border px-6 py-4">
      <p className="text-sm text-cnss-text-muted">
        Affichage de {from} à {to} sur {total.toLocaleString('fr-FR')} {label}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-8 w-8 items-center justify-center rounded text-cnss-text-muted hover:bg-cnss-input-bg disabled:opacity-40"
          aria-label="Page précédente"
        >
          <IconChevronRight className="h-3 w-3 rotate-180" />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
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
              onClick={() => onPageChange(totalPages)}
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
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-8 w-8 items-center justify-center rounded text-cnss-text-muted hover:bg-cnss-input-bg disabled:opacity-40"
          aria-label="Page suivante"
        >
          <IconChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export function parseExportCount(entry: AuditEntry): number {
  if (!entry.valeurApres) return 0;
  try {
    const parsed = JSON.parse(entry.valeurApres) as { count?: number };
    return parsed.count ?? 0;
  } catch {
    return 0;
  }
}

export function isAuditFailure(entry: AuditEntry): boolean {
  if (entry.action.endsWith('_REFUSEE')) {
    return true;
  }

  const text = `${entry.valeurApres ?? ''} ${entry.valeurAvant ?? ''}`.toLowerCase();
  return text.includes('échec') || text.includes('error') || text.includes('failed');
}

export function getMonthDateRange(): { dateFrom: string; dateTo: string } {
  const now = new Date();
  const dateFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const dateTo = now.toISOString().slice(0, 10);
  return { dateFrom, dateTo };
}
