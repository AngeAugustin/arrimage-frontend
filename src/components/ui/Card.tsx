/**
 * @file    Card.tsx
 * @module  components/ui
 */

import { cn } from '@/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className, padding = 'md' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded border border-cnss-border bg-white shadow-card',
        paddings[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}
