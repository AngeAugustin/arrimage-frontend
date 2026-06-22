/**
 * @file    Badge.tsx
 * @module  components/ui
 */

import { cn } from '@/utils/cn';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-cnss-success-bg text-cnss-success',
  warning: 'bg-amber-50 text-amber-800',
  danger: 'bg-cnss-error-bg text-cnss-error-text',
  neutral: 'bg-cnss-input-bg text-cnss-text',
  info: 'bg-cnss-active-nav text-cnss-blue',
};

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide',
        variants[variant],
      )}
    >
      {children}
    </span>
  );
}
