/**
 * @file    Spinner.tsx
 * @module  components/ui
 */

import { cn } from '@/utils/cn';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-10 w-10' };

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-4 border-cnss-primary border-t-transparent',
        sizes[size],
        className,
      )}
      role="status"
      aria-label="Chargement"
    />
  );
}
