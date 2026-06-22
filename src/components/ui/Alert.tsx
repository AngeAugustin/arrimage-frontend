/**
 * @file    Alert.tsx
 * @module  components/ui
 */

import { TriangleAlert } from 'lucide-react';
import { cn } from '@/utils/cn';

type AlertVariant = 'error' | 'success' | 'info';

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
}

const variants: Record<AlertVariant, string> = {
  error: 'border-l-4 border-cnss-error bg-cnss-error-bg text-cnss-error-text',
  success: 'border border-cnss-success/30 bg-cnss-success-bg text-cnss-success',
  info: 'border border-cnss-border bg-cnss-input-bg text-cnss-text',
};

export function Alert({ children, variant = 'error', className }: AlertProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-r-lg px-4 py-4 text-sm',
        variants[variant],
        className,
      )}
      role="alert"
    >
      {variant === 'error' && (
        <TriangleAlert className="h-5 w-5 shrink-0 text-cnss-error" strokeWidth={2} />
      )}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
