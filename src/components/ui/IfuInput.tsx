/**
 * @file    IfuInput.tsx
 * @module  components/ui
 * @desc    Champ IFU avec compteur de caractères et clavier numérique mobile.
 *
 * Règles métier couvertes :
 *   - RG-16 : 13 chiffres exactement
 *
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { cn } from '@/utils/cn';
import { IFU_LENGTH } from '@/utils/constants';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface IfuInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  error?: string;
  value?: string;
  uppercaseLabel?: boolean;
  showCounter?: boolean;
  helperText?: string;
}

/**
 * Champ de saisie IFU avec compteur X/13.
 */
export function IfuInput({
  label,
  error,
  className,
  value = '',
  id,
  uppercaseLabel = true,
  showCounter = true,
  helperText,
  ...props
}: IfuInputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={inputId}
        className={cn(
          'text-sm font-medium text-cnss-text',
          uppercaseLabel && 'text-[11px] font-bold uppercase tracking-wider',
        )}
      >
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        inputMode="numeric"
        maxLength={IFU_LENGTH}
        value={value}
        className={cn(
          'h-[46px] w-full rounded border border-cnss-border bg-cnss-input-bg px-4 font-mono text-sm tracking-widest text-cnss-navy placeholder:font-sans placeholder:tracking-normal placeholder:text-cnss-placeholder focus:border-cnss-primary focus:outline-none focus:ring-2 focus:ring-cnss-primary/20',
          error && 'border-cnss-error focus:border-cnss-error focus:ring-cnss-error/20',
          className,
        )}
        {...props}
      />
      {(helperText || showCounter) && (
        <div className="flex items-center justify-between gap-2">
          {helperText ? (
            <p className="text-xs text-cnss-text-muted">{helperText}</p>
          ) : (
            <span />
          )}
          {showCounter && (
            <span className="font-mono text-xs text-cnss-text-muted">
              {value.length}/{IFU_LENGTH}
            </span>
          )}
        </div>
      )}
      {error && <p className="text-xs text-cnss-error">{error}</p>}
    </div>
  );
}
