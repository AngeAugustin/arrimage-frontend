/**
 * @file    ProgressBar.tsx
 * @module  components/ui
 */

import { cn } from '@/utils/cn';

export interface ProgressSegment {
  label: string;
  value: number;
  colorClass: string;
}

interface ProgressBarProps {
  segments: ProgressSegment[];
  className?: string;
}

export function getProgressPercentages(segments: ProgressSegment[]): number[] {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  return segments.map((segment) => Math.round((segment.value / total) * 100));
}

export function ProgressBar({ segments, className }: ProgressBarProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  return (
    <div
      className={cn('flex h-4 overflow-hidden rounded-full bg-cnss-input-bg', className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={100}
    >
      {segments.map((segment) => {
        const width = (segment.value / total) * 100;
        if (width <= 0) return null;
        return (
          <div
            key={segment.label}
            className={cn('h-full transition-all', segment.colorClass)}
            style={{ width: `${width}%` }}
            title={`${segment.label}: ${Math.round(width)}%`}
          />
        );
      })}
    </div>
  );
}

interface LinearProgressProps {
  value: number;
  className?: string;
  barClassName?: string;
}

export function LinearProgress({ value, className, barClassName }: LinearProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn('h-3 overflow-hidden rounded-full bg-cnss-input-bg', className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-label="Progression de la consolidation"
    >
      <div
        className={cn(
          'h-full rounded-full bg-cnss-primary transition-[width] duration-300 ease-out',
          barClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
