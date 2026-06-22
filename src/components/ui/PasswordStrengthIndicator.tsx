/**
 * @file    PasswordStrengthIndicator.tsx
 * @module  components/ui
 */

import { cn } from '@/utils/cn';

interface PasswordStrengthIndicatorProps {
  password: string;
  variant?: 'default' | 'labeled';
}

type StrengthLevel = 0 | 1 | 2 | 3 | 4 | 5;

const LABELS: Record<StrengthLevel, string> = {
  0: '',
  1: 'SÉCURITÉ FAIBLE',
  2: 'SÉCURITÉ MOYENNE',
  3: 'SÉCURITÉ CORRECTE',
  4: 'SÉCURITÉ FORTE',
  5: 'SÉCURITÉ FORTE',
};

const LABELED_LABELS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: '',
  1: 'Faible',
  2: 'Moyen',
  3: 'Correct',
  4: 'Très fort',
};

function computeStrength(password: string): StrengthLevel {
  if (!password) return 0;

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;

  return score as StrengthLevel;
}

function computeLabeledStrength(password: string): 0 | 1 | 2 | 3 | 4 {
  if (!password) return 0;

  let score = 0;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score as 0 | 1 | 2 | 3 | 4;
}

export function PasswordStrengthIndicator({
  password,
  variant = 'default',
}: PasswordStrengthIndicatorProps) {
  if (variant === 'labeled') {
    const strength = computeLabeledStrength(password);
    if (strength === 0) return null;

    const isStrong = strength >= 3;

    return (
      <div className="mt-2">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-cnss-text-muted">Force du mot de passe :</span>
          <span className={cn('font-bold', isStrong ? 'text-cnss-success' : 'text-amber-600')}>
            {LABELED_LABELS[strength]}
          </span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full',
                i < strength ? (isStrong ? 'bg-cnss-success' : 'bg-amber-500') : 'bg-cnss-border',
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  const strength = computeStrength(password);
  if (strength === 0) return null;

  const isStrong = strength >= 4;

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full',
              i < strength ? (isStrong ? 'bg-cnss-success' : 'bg-amber-500') : 'bg-cnss-border',
            )}
          />
        ))}
      </div>
      <p
        className={cn(
          'mt-1.5 text-[10px] font-bold tracking-wider',
          isStrong ? 'text-cnss-success' : 'text-amber-600',
        )}
      >
        {LABELS[strength]}
      </p>
    </div>
  );
}
