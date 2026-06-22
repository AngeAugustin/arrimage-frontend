/**
 * @file    Input.tsx
 * @module  components/ui
 */

import { cn } from '@/utils/cn';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  uppercaseLabel?: boolean;
}

export function Input({
  label,
  error,
  className,
  id,
  uppercaseLabel = true,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={inputId}
        className={cn(
          'text-[11px] font-bold tracking-wider text-cnss-text',
          uppercaseLabel && 'uppercase',
        )}
      >
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          'h-[46px] w-full rounded border border-cnss-border bg-cnss-input-bg px-4 text-sm text-cnss-navy placeholder:text-cnss-placeholder focus:border-cnss-primary focus:outline-none focus:ring-2 focus:ring-cnss-primary/20',
          error && 'border-cnss-error focus:border-cnss-error focus:ring-cnss-error/20',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-cnss-error">{error}</p>}
    </div>
  );
}
