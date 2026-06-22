/**
 * @file    KpiCard.tsx
 * @module  components/ui
 */

import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  hint?: string;
  hintClassName?: string;
  valueClassName?: string;
  icon?: ReactNode;
  iconClassName?: string;
}

export function KpiCard({
  label,
  value,
  hint,
  hintClassName,
  valueClassName,
  icon,
  iconClassName,
}: KpiCardProps) {
  const displayValue =
    typeof value === 'number'
      ? value.toLocaleString('fr-FR', { useGrouping: true })
      : value;

  return (
    <div className="relative rounded border border-cnss-border bg-white p-6 shadow-card">
      {icon && (
        <div
          className={cn(
            'absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full',
            iconClassName,
          )}
        >
          {icon}
        </div>
      )}
      <p className="pr-12 text-[11px] font-bold uppercase leading-4 tracking-wider text-cnss-text-muted">
        {label}
      </p>
      <p className={cn('mt-3 text-3xl font-bold', valueClassName ?? 'text-cnss-blue')}>
        {displayValue}
      </p>
      {hint && (
        <p className={cn('mt-1 text-sm', hintClassName ?? 'text-cnss-text-muted')}>{hint}</p>
      )}
    </div>
  );
}
