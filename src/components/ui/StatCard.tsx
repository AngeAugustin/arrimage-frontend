/**
 * @file    StatCard.tsx
 * @module  components/ui
 */

import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'neutral';
}

const variantStyles = {
  default: 'text-cnss-blue',
  success: 'text-cnss-success',
  warning: 'text-amber-700',
  danger: 'text-cnss-error',
  neutral: 'text-cnss-text',
};

export function StatCard({ label, value, variant = 'default' }: StatCardProps) {
  return (
    <div className="rounded border border-cnss-border bg-white p-6 shadow-card">
      <p className="text-[11px] font-bold uppercase leading-4 tracking-wider text-cnss-text-muted whitespace-pre-line">
        {label}
      </p>
      <p className={cn('mt-3 text-3xl font-bold', variantStyles[variant])}>
        {value.toLocaleString('fr-FR')}
      </p>
    </div>
  );
}
