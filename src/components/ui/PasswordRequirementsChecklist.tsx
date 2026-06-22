/**
 * @file    PasswordRequirementsChecklist.tsx
 * @module  components/ui
 */

import { cn } from '@/utils/cn';
import { IconCheckCircle } from '@/components/ui/icons';

interface Requirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const REQUIREMENTS: Requirement[] = [
  { id: 'length', label: 'Au moins 12 caractères', test: (p) => p.length >= 12 },
  { id: 'upper', label: 'Une majuscule', test: (p) => /[A-Z]/.test(p) },
  { id: 'digit', label: 'Un chiffre', test: (p) => /\d/.test(p) },
  { id: 'special', label: 'Un caractère spécial', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

interface PasswordRequirementsChecklistProps {
  password: string;
}

export function PasswordRequirementsChecklist({ password }: PasswordRequirementsChecklistProps) {
  return (
    <ul className="space-y-2">
      {REQUIREMENTS.map((req) => {
        const met = req.test(password);
        return (
          <li key={req.id} className="flex items-center gap-2 text-sm">
            <IconCheckCircle
              className={cn('h-4 w-4 shrink-0', met ? 'text-cnss-success' : 'text-cnss-border')}
            />
            <span className={cn(met ? 'text-cnss-success' : 'text-cnss-text-muted')}>{req.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function meetsPasswordRequirements(password: string): boolean {
  return REQUIREMENTS.every((req) => req.test(password));
}
