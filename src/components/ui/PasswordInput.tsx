/**
 * @file    PasswordInput.tsx
 * @module  components/ui
 */

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { IconEye, IconEyeOff } from '@/components/ui/icons';
import type { InputHTMLAttributes } from 'react';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  uppercaseLabel?: boolean;
}

export function PasswordInput({
  label,
  error,
  className,
  id,
  uppercaseLabel = true,
  autoComplete,
  type: _type,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
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
      <div className="relative">
        <input
          id={inputId}
          className={cn(
            'h-[46px] w-full rounded border border-cnss-border bg-cnss-input-bg px-4 pr-11 text-sm text-cnss-navy placeholder:text-cnss-placeholder focus:border-cnss-primary focus:outline-none focus:ring-2 focus:ring-cnss-primary/20',
            error && 'border-cnss-error focus:border-cnss-error focus:ring-cnss-error/20',
            className,
          )}
          {...props}
          type={visible ? 'text' : 'password'}
          autoComplete={visible ? 'off' : autoComplete}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-cnss-icon transition-colors hover:text-cnss-blue"
          aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          tabIndex={-1}
        >
          {visible ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
        </button>
      </div>
      {error && <p className="text-xs text-cnss-error">{error}</p>}
    </div>
  );
}
